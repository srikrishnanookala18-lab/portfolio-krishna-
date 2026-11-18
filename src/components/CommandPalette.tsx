import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { PROFILE, SKILLS_DATA } from '../data/portfolioData';

export interface CommandItem {
  id: string;
  label: string;
  category: string;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelectProject: (proj: 'jiosense' | 'jainsmart') => void;
  onInspectSkill: (skillName: string) => void;
  onToggleTheme: () => void;
  onJumpToEnquiry: () => void;
  onCopyEmail: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onSelectProject,
  onInspectSkill,
  onToggleTheme,
  onJumpToEnquiry,
  onCopyEmail,
}) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems: CommandItem[] = [
    {
      id: 'sec-edu',
      label: 'Jump to Education & GPA (9.02 / 8.86)',
      category: 'Section',
      run: () => {
        window.location.hash = '#education';
      },
    },
    {
      id: 'sec-skills',
      label: 'Jump to Technical Skills',
      category: 'Section',
      run: () => {
        window.location.hash = '#skills';
      },
    },
    {
      id: 'proj-jio',
      label: 'Open Jio Sense Weather Dashboard Project',
      category: 'Project',
      run: () => {
        onSelectProject('jiosense');
        window.location.hash = '#projects';
      },
    },
    {
      id: 'proj-jain',
      label: 'Open JAIN Smart Navigation Project',
      category: 'Project',
      run: () => {
        onSelectProject('jainsmart');
        window.location.hash = '#projects';
      },
    },
    {
      id: 'act-enquiry',
      label: 'Fill Enquiry Form (GitHub, LinkedIn, Email)',
      category: 'Enquiry',
      run: onJumpToEnquiry,
    },
    {
      id: 'act-email',
      label: `Copy Email (${PROFILE.email})`,
      category: 'Action',
      run: onCopyEmail,
    },
    {
      id: 'act-theme',
      label: 'Toggle Light / Dark Theme',
      category: 'Action',
      run: onToggleTheme,
    },
    ...SKILLS_DATA.map((skill) => ({
      id: `skill-${skill.name}`,
      label: `Inspect Skill: ${skill.name} (${skill.level})`,
      category: skill.cat,
      run: () => {
        onInspectSkill(skill.name);
        window.location.hash = '#skills';
      },
    })),
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
      )
    : allItems.slice(0, 8);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      } else if (open) {
        if (e.key === 'Escape') {
          onClose();
        } else if (e.key === 'ArrowDown' && filtered.length > 0) {
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % filtered.length);
        } else if (e.key === 'ArrowUp' && filtered.length > 0) {
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter' && filtered[activeIndex]) {
          e.preventDefault();
          const chosen = filtered[activeIndex];
          onClose();
          chosen.run();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, filtered, activeIndex, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-start justify-center pt-[12vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Quick command palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E4E2DC] dark:border-[#232732]">
          <Search className="w-4 h-4 text-[#848B98]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, projects, GPA, or enquiry..."
            className="flex-1 bg-transparent text-sm text-[#111318] dark:text-[#F3F4F6] placeholder:text-[#848B98] focus:outline-none"
          />
          <kbd className="font-mono text-[11px] px-1.5 py-0.5 rounded border border-[#E4E2DC] dark:border-[#232732] text-[#848B98]">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-xs text-[#848B98]">No matching items.</div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClose();
                  item.run();
                }}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left text-xs rounded-lg transition-colors cursor-pointer ${
                  idx === activeIndex
                    ? 'bg-[#F1F0EC] dark:bg-[#191C24] text-[#111318] dark:text-[#F3F4F6]'
                    : 'text-[#555B66] dark:text-[#9CA3AF] hover:bg-[#F8F8F6] dark:hover:bg-[#191C24]'
                }`}
              >
                <span className="font-medium truncate">{item.label}</span>
                <span className="font-mono text-[11px] text-[#848B98] shrink-0">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
