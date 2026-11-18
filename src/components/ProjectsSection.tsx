import React, { useEffect, useState } from 'react';
import { AlertTriangle, ArrowUpRight, CheckCircle2, Info } from 'lucide-react';
import { CAMPUS_ROOMS, CampusRoom, CityWeather, WEATHER_SAMPLE } from '../data/portfolioData';

interface ProjectsSectionProps {
  activeProject: 'jiosense' | 'jainsmart';
  onChangeProject: (proj: 'jiosense' | 'jainsmart') => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  activeProject,
  onChangeProject,
}) => {
  // Project 1: Jio Sense state (backed by Python /api/weather)
  const [city, setCity] = useState<'Hyderabad' | 'Bengaluru' | 'Delhi'>('Hyderabad');
  const [weatherData, setWeatherData] = useState<CityWeather>(WEATHER_SAMPLE.Hyderabad);
  const [forecastMode, setForecastMode] = useState<'hourly' | '7day'>('hourly');
  const [hoveredWeatherPt, setHoveredWeatherPt] = useState<{
    info: string;
    x: number;
    y: number;
  } | null>(null);

  // Project 2: JAIN Smart Navigation state (backed by Python /api/campus/query)
  const [curFloor, setCurFloor] = useState<1 | 2 | 3>(2);
  const [rooms, setRooms] = useState<CampusRoom[]>(CAMPUS_ROOMS);
  const [queryInput, setQueryInput] = useState('Find available AI Lab');
  const [highlightedIds, setHighlightedIds] = useState<string[]>(['R201']);
  const [traceLines, setTraceLines] = useState<string[]>([
    '1. NL Query: "Find available AI Lab"',
    '2. Python Intent Engine (lab_lookup): SQLite room & availability lookup',
    '3. Matched: R201 (AI & ML Lab 201, Floor 2, Available)',
  ]);

  useEffect(() => {
    let active = true;
    fetch(`/api/weather?city=${encodeURIComponent(city)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && data.temp) {
          setWeatherData(data);
        } else if (active) {
          setWeatherData(WEATHER_SAMPLE[city]);
        }
      })
      .catch(() => {
        if (active) setWeatherData(WEATHER_SAMPLE[city]);
      });
    return () => {
      active = false;
    };
  }, [city]);

  useEffect(() => {
    let active = true;
    fetch('/api/campus/rooms')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data && Array.isArray(data.rooms) && data.rooms.length > 0) {
          setRooms(data.rooms);
        }
      })
      .catch(() => {
        // Fallback to static room schema if API is offline
      });
    return () => {
      active = false;
    };
  }, []);

  const series = forecastMode === 'hourly' ? weatherData.hourly : weatherData.daily;

  const w = 420;
  const h = 136;
  const padL = 26;
  const padR = 18;
  const padT = 24;
  const padB = 26;
  const vals = series.map((p) => p.v);
  const minV = Math.min(...vals) - 3;
  const maxV = Math.max(...vals) + 3;
  const xFor = (i: number) => padL + (i / (series.length - 1)) * (w - padL - padR);
  const yFor = (v: number) => padT + ((maxV - v) / (maxV - minV)) * (h - padT - padB);
  const base = h - padB;
  const linePts = series.map((p, i) => `${xFor(i).toFixed(1)},${yFor(p.v).toFixed(1)}`).join(' ');
  const areaPts = `${xFor(0).toFixed(1)},${base} ${linePts} ${xFor(series.length - 1).toFixed(1)},${base}`;

  const runCampusQueryLocal = (q: string) => {
    const text = q.toLowerCase();
    let matches: CampusRoom[] = [];
    if (text.includes('vacant') || (text.includes('available') && !text.includes('ai'))) {
      matches = rooms.filter((r) => r.status === 'Available');
    } else if (text.includes('ai') || text.includes('ml')) {
      matches = rooms.filter((r) => r.id === 'R201');
    } else if (text.includes('304')) {
      matches = rooms.filter((r) => r.id === 'R304');
    } else if (text.includes('lab')) {
      matches = rooms.filter((r) => r.type === 'Laboratory');
    } else {
      matches = rooms.filter(
        (r) => r.name.toLowerCase().includes(text) || r.id.toLowerCase().includes(text)
      );
    }
    if (matches.length === 0) matches = [rooms[0]];

    setCurFloor(matches[0].floor);
    setHighlightedIds(matches.map((m) => m.id));
    const summary = matches
      .map((m) => `${m.id} (${m.name}, Floor ${m.floor}, ${m.status})`)
      .join('; ');
    setTraceLines([
      `1. NL Query: "${q}"`,
      '2. Intent Engine: Room & availability lookup',
      `3. Matched: ${summary}`,
    ]);
  };

  const runCampusQuery = async (rawQuery: string) => {
    const q = rawQuery.trim() || 'Find available AI Lab';
    try {
      const res = await fetch('/api/campus/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) {
        runCampusQueryLocal(q);
        return;
      }
      const data = await res.json();
      setCurFloor(data.floor);
      setHighlightedIds(data.highlighted_ids || []);
      setTraceLines(data.trace || []);
    } catch {
      runCampusQueryLocal(q);
    }
  };

  const floorRooms = rooms.filter((r) => r.floor === curFloor);

  return (
    <section id="projects" className="py-12 border-t border-[#E4E2DC] dark:border-[#232732]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-7">
        <div>
          <p className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] mb-1">
            03. Engineering Workbench
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Team Projects &amp; Interactive Demos
          </h2>
        </div>
        <p className="text-xs text-[#555B66] dark:text-[#9CA3AF]">
          Switch projects and test interactive simulations powered by the Python API
        </p>
      </div>

      <div
        className="flex flex-wrap items-center gap-2 mb-6"
        role="tablist"
        aria-label="Engineering projects"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeProject === 'jiosense'}
          onClick={() => onChangeProject('jiosense')}
          className={`inline-flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[42px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6] ${
            activeProject === 'jiosense'
              ? 'bg-[#111318] text-white border-[#111318] dark:bg-[#F3F4F6] dark:text-[#111318] dark:border-[#F3F4F6]'
              : 'bg-white dark:bg-[#12141A] text-[#555B66] dark:text-[#9CA3AF] border-[#E4E2DC] dark:border-[#232732] hover:text-[#111318] dark:hover:text-[#F3F4F6]'
          }`}
        >
          <span className="font-mono text-xs opacity-70">01</span>
          <span>Jio Sense — Weather &amp; Climate Dashboard</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeProject === 'jainsmart'}
          onClick={() => onChangeProject('jainsmart')}
          className={`inline-flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[42px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6] ${
            activeProject === 'jainsmart'
              ? 'bg-[#111318] text-white border-[#111318] dark:bg-[#F3F4F6] dark:text-[#111318] dark:border-[#F3F4F6]'
              : 'bg-white dark:bg-[#12141A] text-[#555B66] dark:text-[#9CA3AF] border-[#E4E2DC] dark:border-[#232732] hover:text-[#111318] dark:hover:text-[#F3F4F6]'
          }`}
        >
          <span className="font-mono text-xs opacity-70">02</span>
          <span>JAIN Smart Navigation — Campus Digital Twin</span>
        </button>
      </div>

      {activeProject === 'jiosense' && (
        <article className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <p className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] mb-1">
                Team Project · Weather &amp; Telemetry
              </p>
              <h3 className="font-display text-xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
                Jio Sense — Real-Time Weather &amp; Climate Dashboard
              </h3>
            </div>

            <ul className="space-y-3 text-sm text-[#555B66] dark:text-[#9CA3AF] leading-relaxed list-disc pl-4">
              <li>
                Collaborated on a web-based dashboard that displays current weather conditions using live location detection or city search, including temperature, humidity, wind, pressure, and UV index.
              </li>
              <li>
                Integrated the Open-Meteo weather API and contributed to testing and debugging; features include hourly and 7-day forecasts, climate alerts, and a comfort index.
              </li>
            </ul>

            <div className="pt-4 border-t border-[#E4E2DC] dark:border-[#232732]">
              <p className="text-xs font-medium text-[#848B98] dark:text-[#6B7280] mb-1.5">
                Technologies Used
              </p>
              <p className="text-xs font-mono text-[#111318] dark:text-[#F3F4F6] leading-relaxed">
                HTML · CSS · JavaScript · Chart.js · Open-Meteo API · Python
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#F8F8F6] dark:bg-[#191C24] border border-[#E4E2DC] dark:border-[#232732] rounded-xl p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-medium text-[#555B66] dark:text-[#9CA3AF]">
                Interactive Sandbox · Weather Telemetry
              </span>
              <div className="inline-flex items-center gap-1 p-1 bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg">
                {(['Hyderabad', 'Bengaluru', 'Delhi'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      city === c
                        ? 'bg-[#2557D6] text-white dark:bg-[#60A5FA] dark:text-[#090D16]'
                        : 'text-[#555B66] dark:text-[#9CA3AF] hover:text-[#111318] dark:hover:text-[#F3F4F6]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { k: 'Temperature', v: weatherData.temp },
                { k: 'Humidity', v: weatherData.humidity },
                { k: 'Wind', v: weatherData.wind },
                { k: 'Pressure', v: weatherData.pressure },
                { k: 'UV Index', v: weatherData.uv },
                { k: 'Comfort Index', v: weatherData.comfort },
              ].map((stat) => (
                <div
                  key={stat.k}
                  className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg px-3.5 py-2.5"
                >
                  <div className="text-[11px] text-[#848B98] dark:text-[#6B7280]">{stat.k}</div>
                  <div className="text-sm font-semibold text-[#111318] dark:text-[#F3F4F6] tabular-nums mt-0.5">
                    {stat.v}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-mono text-xs text-[#555B66] dark:text-[#9CA3AF]">
                  {forecastMode === 'hourly'
                    ? `Hourly Forecast — ${city} (°C)`
                    : `7-Day Highs — ${city} (°C)`}
                </span>
                <div className="inline-flex items-center gap-1 p-0.5 bg-[#F1F0EC] dark:bg-[#191C24] rounded-md">
                  <button
                    type="button"
                    onClick={() => setForecastMode('hourly')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      forecastMode === 'hourly'
                        ? 'bg-white dark:bg-[#12141A] text-[#111318] dark:text-[#F3F4F6] shadow-xs'
                        : 'text-[#555B66] dark:text-[#9CA3AF]'
                    }`}
                  >
                    Hourly
                  </button>
                  <button
                    type="button"
                    onClick={() => setForecastMode('7day')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      forecastMode === '7day'
                        ? 'bg-white dark:bg-[#12141A] text-[#111318] dark:text-[#F3F4F6] shadow-xs'
                        : 'text-[#555B66] dark:text-[#9CA3AF]'
                    }`}
                  >
                    7-Day
                  </button>
                </div>
              </div>

              <div className="relative">
                {hoveredWeatherPt && (
                  <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-full -mt-2 px-2 py-1 rounded bg-[#111318] dark:bg-[#F3F4F6] text-white dark:text-[#111318] font-mono text-[11px] whitespace-nowrap z-10 tabular-nums"
                    style={{
                      left: `${(hoveredWeatherPt.x / w) * 100}%`,
                      top: `${(hoveredWeatherPt.y / h) * 100}%`,
                    }}
                  >
                    {hoveredWeatherPt.info}
                  </div>
                )}

                <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto overflow-visible">
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2557D6" stopOpacity="0.24" />
                      <stop offset="100%" stopColor="#2557D6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points={areaPts} fill="url(#wGrad)" />
                  <polyline
                    fill="none"
                    className="stroke-[#2557D6] dark:stroke-[#60A5FA]"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={linePts}
                  />
                  {series.map((p, i) => {
                    const cx = xFor(i);
                    const cy = yFor(p.v);
                    return (
                      <g key={p.t}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r="4.5"
                          className="fill-[#2557D6] dark:fill-[#60A5FA] stroke-white dark:stroke-[#12141A] cursor-pointer"
                          strokeWidth="2"
                          onMouseEnter={() =>
                            setHoveredWeatherPt({ info: `${p.t}: ${p.v}°C`, x: cx, y: cy })
                          }
                          onMouseLeave={() => setHoveredWeatherPt(null)}
                        />
                        <text
                          x={cx}
                          y={cy - 9}
                          textAnchor="middle"
                          fontSize="10"
                          className="fill-[#111318] dark:fill-[#F3F4F6] font-mono tabular-nums"
                        >
                          {p.v}°
                        </text>
                        <text
                          x={cx}
                          y={h - 6}
                          textAnchor="middle"
                          fontSize="10"
                          className="fill-[#848B98] dark:fill-[#6B7280] font-mono"
                        >
                          {p.t}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg px-4 py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#111318] dark:text-[#F3F4F6]">
                {weatherData.alert.level === 'Clear' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#15803D] dark:text-[#4ADE80] shrink-0" />
                ) : weatherData.alert.level === 'Heat Alert' ? (
                  <AlertTriangle className="w-4 h-4 text-[#B45309] dark:text-[#FBBF24] shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-[#2557D6] dark:text-[#60A5FA] shrink-0" />
                )}
                <span>
                  <strong>{weatherData.alert.level}:</strong> {weatherData.alert.text}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#555B66] dark:text-[#9CA3AF] shrink-0">
                {city}
              </span>
            </div>
          </div>
        </article>
      )}

      {activeProject === 'jainsmart' && (
        <article className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div>
              <p className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] mb-1">
                Team Project · Campus Digital Twin
              </p>
              <h3 className="font-display text-xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
                JAIN Smart Navigation — Smart Campus Digital Twin
              </h3>
              <a
                href="https://jainsmartnavigation.ai.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs font-mono font-medium text-[#2557D6] dark:text-[#60A5FA] hover:underline"
              >
                <span>jainsmartnavigation.ai.studio</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <ul className="space-y-3 text-sm text-[#555B66] dark:text-[#9CA3AF] leading-relaxed list-disc pl-4">
              <li>
                Collaborated on a campus navigation platform designed to help students find classrooms, laboratories, floors, and campus facilities, with room-availability and navigation queries.
              </li>
              <li>
                Contributed to backend development, data/database management, testing, and debugging for a smart campus assistant with natural-language query support.
              </li>
            </ul>

            <div className="pt-4 border-t border-[#E4E2DC] dark:border-[#232732]">
              <p className="text-xs font-medium text-[#848B98] dark:text-[#6B7280] mb-1.5">
                Technologies Used
              </p>
              <p className="text-xs font-mono text-[#111318] dark:text-[#F3F4F6] leading-relaxed">
                React · TypeScript · Tailwind CSS · Python · SQLite · Node.js · Google Gemini API · Leaflet · Three.js
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#F8F8F6] dark:bg-[#191C24] border border-[#E4E2DC] dark:border-[#232732] rounded-xl p-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-medium text-[#555B66] dark:text-[#9CA3AF]">
                Interactive Sandbox · Campus NL Query &amp; Floor Map
              </span>
              <div className="inline-flex items-center gap-1 p-1 bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg">
                {([1, 2, 3] as const).map((fl) => (
                  <button
                    key={fl}
                    type="button"
                    onClick={() => setCurFloor(fl)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      curFloor === fl
                        ? 'bg-[#2557D6] text-white dark:bg-[#60A5FA] dark:text-[#090D16]'
                        : 'text-[#555B66] dark:text-[#9CA3AF] hover:text-[#111318] dark:hover:text-[#F3F4F6]'
                    }`}
                  >
                    Floor {fl}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                runCampusQuery(queryInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Try: AI Lab, Classroom 304, Vacant rooms..."
                aria-label="Campus natural language query"
                className="flex-1 min-w-0 px-3.5 py-2 text-sm bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg text-[#111318] dark:text-[#F3F4F6] placeholder:text-[#848B98] focus:outline-none focus:ring-2 focus:ring-[#2557D6]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#2557D6] hover:bg-[#1D46B3] dark:bg-[#60A5FA] dark:text-[#090D16] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[38px] cursor-pointer"
              >
                Run Query
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              {[
                { label: 'AI Lab availability', q: 'Find available AI Lab' },
                { label: 'Classroom 304', q: 'Where is Classroom 304?' },
                { label: 'Vacant rooms', q: 'Show vacant rooms' },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setQueryInput(preset.q);
                    runCampusQuery(preset.q);
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-[#555B66] dark:text-[#9CA3AF] hover:text-[#111318] dark:hover:text-[#F3F4F6] bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-md transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg p-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#848B98] dark:text-[#6B7280] mb-2">
                <span>FLOOR {curFloor} SCHEMATIC (CLICK ROOM)</span>
                <span>ELEVATOR → CORRIDOR</span>
              </div>
              <svg viewBox="0 0 420 110" className="w-full h-auto">
                <rect
                  x="6"
                  y="6"
                  width="408"
                  height="98"
                  rx="8"
                  fill="none"
                  className="stroke-[#E4E2DC] dark:stroke-[#232732]"
                />
                <line
                  x1="18"
                  y1="90"
                  x2="402"
                  y2="90"
                  className="stroke-[#CFCCC2] dark:stroke-[#353B4A]"
                  strokeDasharray="4 3"
                />
                <text
                  x="210"
                  y="100"
                  textAnchor="middle"
                  fontSize="9"
                  className="fill-[#848B98] dark:fill-[#6B7280] font-mono"
                >
                  MAIN CORRIDOR · FLOOR {curFloor}
                </text>

                {floorRooms.map((room) => {
                  const isHighlighted = highlightedIds.includes(room.id);
                  return (
                    <g
                      key={room.id}
                      onClick={() => {
                        setHighlightedIds([room.id]);
                        setTraceLines([
                          `Selected: ${room.name} (${room.id})`,
                          `Floor: Floor ${room.floor} · Type: ${room.type} · Status: ${room.status}`,
                        ]);
                      }}
                      className="cursor-pointer"
                    >
                      <rect
                        x={room.x}
                        y={room.y}
                        width={room.w}
                        height={room.h}
                        rx="6"
                        className={
                          isHighlighted
                            ? 'fill-[#2557D6]/12 dark:fill-[#60A5FA]/15 stroke-[#2557D6] dark:stroke-[#60A5FA]'
                            : 'fill-[#F8F8F6] dark:fill-[#191C24] stroke-[#E4E2DC] dark:stroke-[#232732]'
                        }
                        strokeWidth={isHighlighted ? '2' : '1'}
                      />
                      <text
                        x={room.x + 10}
                        y={room.y + 22}
                        fontSize="10"
                        fontWeight="700"
                        className={
                          isHighlighted
                            ? 'fill-[#2557D6] dark:fill-[#60A5FA] font-mono'
                            : 'fill-[#111318] dark:fill-[#F3F4F6] font-mono'
                        }
                      >
                        {room.id}
                      </text>
                      <text
                        x={room.x + 10}
                        y={room.y + 38}
                        fontSize="9.5"
                        className="fill-[#555B66] dark:fill-[#9CA3AF]"
                      >
                        {room.name.length > 18 ? `${room.name.slice(0, 17)}…` : room.name}
                      </text>
                      <text
                        x={room.x + 10}
                        y={room.y + 52}
                        fontSize="9"
                        className="fill-[#848B98] dark:fill-[#6B7280] font-mono"
                      >
                        {room.status}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg px-4 py-3 text-xs font-mono text-[#555B66] dark:text-[#9CA3AF] space-y-1">
              {traceLines.map((line, i) => (
                <div key={i} className={i === traceLines.length - 1 ? 'text-[#111318] dark:text-[#F3F4F6] font-medium' : ''}>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </article>
      )}
    </section>
  );
};
