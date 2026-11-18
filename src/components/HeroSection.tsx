import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownRight, Code2, Moon, Search, Sun, Upload, RotateCcw } from 'lucide-react';
import { KPI_METRICS, PROFILE } from '../data/portfolioData';

interface HeroSectionProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCmd: () => void;
  onJumpToEnquiry: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  isDark,
  onToggleTheme,
  onOpenCmd,
  onJumpToEnquiry,
}) => {
  const [istTime, setIstTime] = useState<string>('--:--');
  const [customPhoto, setCustomPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('nsk_custom_photo_dataurl');
    } catch {
      return null;
    }
  });
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date());
        setIstTime(formatted);
      } catch {
        setIstTime('IST');
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 30000);
    return () => clearInterval(timer);
  }, []);

  const handlePhotoUpload = (file: File | undefined) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = typeof ev.target?.result === 'string' ? ev.target.result : null;
      if (!dataUrl) return;
      setCustomPhoto(dataUrl);
      setImgError(false);
      try {
        localStorage.setItem('nsk_custom_photo_dataurl', dataUrl);
      } catch {
        // Ignore storage quota errors
      }
    };
    reader.readAsDataURL(file);
  };

  const resetPhoto = () => {
    setCustomPhoto(null);
    setImgError(false);
    try {
      localStorage.removeItem('nsk_custom_photo_dataurl');
    } catch {
      // Ignore storage errors
    }
  };

  const activeImageSrc = customPhoto || PROFILE.heroImage;

  return (
    <section id="top" className="pt-8 pb-10">
      {/* Compact Workspace Utility Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E4E2DC] dark:border-[#232732]">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#555B66] dark:text-[#9CA3AF]">
          <span className="font-medium text-[#111318] dark:text-[#F3F4F6]">{PROFILE.location}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">IST {istTime}</span>
          <span aria-hidden="true">·</span>
          <span>B.Tech CSE (AI &amp; ML)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCmd}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#555B66] dark:text-[#9CA3AF] hover:text-[#111318] dark:hover:text-[#F3F4F6] bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6]"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Quick Search</span>
            <kbd className="font-mono text-[11px] text-[#848B98]">⌘K</kbd>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#555B66] dark:text-[#9CA3AF] hover:text-[#111318] dark:hover:text-[#F3F4F6] bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6]"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Balanced Hero Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-7 md:p-9 flex flex-col justify-between gap-8">
          <div>
            <p className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] mb-3">
              Python Developer &amp; AI/ML Engineer Aspirant
            </p>
            <h1
              className="font-display font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6] leading-[1.08] mb-4"
              style={{ fontSize: 'clamp(2.25rem, 4vw, 3.35rem)', textWrap: 'balance' }}
            >
              {PROFILE.name}
            </h1>
            <p className="text-sm font-medium text-[#555B66] dark:text-[#9CA3AF] mb-4">
              {PROFILE.degree} · {PROFILE.university} ({PROFILE.batch})
            </p>
            <p className="text-[15px] leading-[1.65] text-[#555B66] dark:text-[#9CA3AF] max-w-[65ch]">
              {PROFILE.summary}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#E4E2DC] dark:border-[#232732]">
            <button
              type="button"
              onClick={onJumpToEnquiry}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2557D6] hover:bg-[#1D46B3] dark:bg-[#60A5FA] dark:text-[#090D16] dark:hover:bg-[#93C5FD] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[42px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6]"
            >
              <span>Fill Enquiry &amp; Message</span>
              <ArrowDownRight className="w-4 h-4" />
            </button>

            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#111318] dark:text-[#F3F4F6] bg-[#F1F0EC] hover:bg-[#EAE8E2] dark:bg-[#191C24] dark:hover:bg-[#212530] border border-[#E4E2DC] dark:border-[#232732] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[42px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6]"
            >
              <span>Explore Projects</span>
            </a>

            <span className="text-xs text-[#848B98] dark:text-[#6B7280] pl-1">
              Messages accepted via Email, LinkedIn &amp; GitHub only
            </span>
          </div>
        </div>

        {/* Right Column Focal Visual */}
        <aside className="lg:col-span-5 bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-3 flex flex-col">
          <div className="relative flex-1 min-h-[280px] lg:min-h-0 rounded-xl overflow-hidden bg-[#F1F0EC] dark:bg-[#191C24]">
            {!imgError ? (
              <img
                src={activeImageSrc}
                alt="Nookala Sri Krishna AI & software engineering desk setup"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F1F0EC] to-[#E4E2DC] dark:from-[#191C24] dark:to-[#12141A]">
                <Code2 className="w-8 h-8 text-[#2557D6] dark:text-[#60A5FA] mb-3" />
                <p className="font-display font-semibold text-sm text-[#111318] dark:text-[#F3F4F6]">
                  Nookala Sri Krishna
                </p>
                <p className="text-xs text-[#555B66] dark:text-[#9CA3AF] mt-1">
                  B.Tech CSE (AI &amp; ML) · Jain University
                </p>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end justify-between gap-2">
              <div className="text-white">
                <p className="text-xs font-semibold tracking-tight">{PROFILE.name}</p>
                <p className="text-[11px] text-white/80">B.Tech AI &amp; ML · Jain University</p>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-white bg-black/55 hover:bg-black/75 border border-white/20 rounded-md backdrop-blur-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  title="Upload custom portrait photo"
                >
                  <Upload className="w-3 h-3" />
                  <span>{customPhoto ? 'Change' : 'Upload Photo'}</span>
                </button>
                {customPhoto && (
                  <button
                    type="button"
                    onClick={resetPhoto}
                    className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium text-white bg-black/55 hover:bg-black/75 border border-white/20 rounded-md backdrop-blur-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    title="Reset to studio workspace photo"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Full-Width 4-Column KPI Strip Below Hero Split */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {KPI_METRICS.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-xl px-5 py-4"
          >
            <div className="text-xs font-medium text-[#555B66] dark:text-[#9CA3AF]">{item.label}</div>
            <div className="font-display text-2xl font-bold text-[#111318] dark:text-[#F3F4F6] tabular-nums mt-1">
              {item.value}
            </div>
            <div className="text-xs text-[#848B98] dark:text-[#6B7280] mt-0.5">{item.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
