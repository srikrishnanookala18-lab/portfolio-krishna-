import express from 'express';
import { spawn, type ChildProcess } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const PYTHON_HOST = process.env.PYTHON_API_HOST || '127.0.0.1';
const PYTHON_PORT = Number(process.env.PYTHON_API_PORT || 8001);
const PYTHON_BASE_URL = `http://${PYTHON_HOST}:${PYTHON_PORT}`;

let pythonProc: ChildProcess | null = null;
let shuttingDown = false;

function startPythonBackend() {
  if (shuttingDown) return;

  pythonProc = spawn('python3', ['-m', 'backend.app'], {
    cwd: __dirname,
    env: {
      ...process.env,
      PYTHON_API_HOST: PYTHON_HOST,
      PYTHON_API_PORT: String(PYTHON_PORT),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  pythonProc.stdout?.on('data', (chunk: Buffer) => {
    process.stdout.write(`[python] ${chunk.toString()}`);
  });

  pythonProc.stderr?.on('data', (chunk: Buffer) => {
    process.stderr.write(`[python] ${chunk.toString()}`);
  });

  pythonProc.on('exit', (code) => {
    if (!shuttingDown) {
      console.error(`[python] exited with code ${code ?? 'unknown'}, restarting in 1s...`);
      setTimeout(startPythonBackend, 1000);
    }
  });
}

async function waitForPythonReady(maxAttempts = 20): Promise<void> {
  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      const res = await fetch(`${PYTHON_BASE_URL}/api/health`);
      if (res.ok) return;
    } catch {
      // Backend still warming up
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
}

async function createAppServer() {
  startPythonBackend();
  await waitForPythonReady();

  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Proxy all /api/* traffic to the Python backend service
  app.use('/api', async (req, res) => {
    const targetUrl = `${PYTHON_BASE_URL}${req.originalUrl}`;
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      let body: string | undefined;
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(req.body ?? {});
      }

      const upstream = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
      });

      const text = await upstream.text();
      res.status(upstream.status);
      res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
      res.send(text);
    } catch (err) {
      console.error('Python backend proxy error:', err);
      res.status(502).json({ error: 'Python backend unavailable' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server listening on http://0.0.0.0:${PORT}`);
  });

  const cleanup = () => {
    shuttingDown = true;
    if (pythonProc && !pythonProc.killed) {
      pythonProc.kill('SIGTERM');
    }
    server.close(() => process.exit(0));
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

createAppServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
