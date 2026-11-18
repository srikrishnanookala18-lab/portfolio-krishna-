import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SKILL_CATEGORIES, SKILLS_DATA, SkillItem } from '../data/portfolioData';

interface SkillsSectionProps {
  selectedSkillName: string;
  onSelectSkill: (name: string) => void;
  activeCat: string;
  onChangeCat: (cat: string) => void;
  onOpenProject: (proj: 'jiosense' | 'jainsmart') => void;
}

const SHORT_LABELS: Record<string, string> = {
  All: 'All (14)',
  'Programming Languages': 'Languages',
  'Python / AI-ML Libraries': 'AI / ML Libraries',
  'Web & Database': 'Web & Database',
  'Core Concepts': 'Core CS',
  'Development Tools': 'Tools',
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  selectedSkillName,
  onSelectSkill,
  activeCat,
  onChangeCat,
  onOpenProject,
}) => {
  const filteredSkills =
    activeCat === 'All' ? SKILLS_DATA : SKILLS_DATA.filter((s) => s.cat === activeCat);

  const selectedSkill: SkillItem =
    SKILLS_DATA.find((s) => s.name === selectedSkillName) || SKILLS_DATA[0];

  const handleCatClick = (cat: string) => {
    onChangeCat(cat);
    const nextList = cat === 'All' ? SKILLS_DATA : SKILLS_DATA.filter((s) => s.cat === cat);
    if (nextList.length > 0 && !nextList.some((s) => s.name === selectedSkillName)) {
      onSelectSkill(nextList[0].name);
    }
  };

  return (
    <section id="skills" className="py-12 border-t border-[#E4E2DC] dark:border-[#232732]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-7">
        <div>
          <p className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] mb-1">
            02. Technical Stack
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Skills &amp; Context Inspector
          </h2>
        </div>
        <p className="text-xs text-[#555B66] dark:text-[#9CA3AF]">
          Filter by category or select any skill to inspect its context
        </p>
      </div>

      {/* Interactive Segmented Filter Tabs */}
      <div
        className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F1F0EC] dark:bg-[#191C24] border border-[#E4E2DC] dark:border-[#232732] rounded-xl mb-6"
        role="tablist"
        aria-label="Skill categories"
      >
        {SKILL_CATEGORIES.map((cat) => {
          const isActive = activeCat === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleCatClick(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[36px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6] ${
                isActive
                  ? 'bg-white dark:bg-[#12141A] text-[#111318] dark:text-[#F3F4F6] shadow-xs'
                  : 'text-[#555B66] dark:text-[#9CA3AF] hover:text-[#111318] dark:hover:text-[#F3F4F6]'
              }`}
            >
              {SHORT_LABELS[cat] || cat}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Skills Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredSkills.map((skill) => {
            const isSelected = skill.name === selectedSkill.name;
            return (
              <button
                key={skill.name}
                type="button"
                onClick={() => onSelectSkill(skill.name)}
                className={`text-left p-4 rounded-xl border transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6] ${
                  isSelected
                    ? 'bg-white dark:bg-[#12141A] border-[#2557D6] dark:border-[#60A5FA] shadow-xs'
                    : 'bg-white dark:bg-[#12141A] border-[#E4E2DC] dark:border-[#232732] hover:border-[#CFCCC2] dark:hover:border-[#353B4A]'
                }`}
              >
                <div className="text-[11px] text-[#848B98] dark:text-[#6B7280] truncate">
                  {skill.cat}
                </div>
                <div className="font-display text-sm font-bold text-[#111318] dark:text-[#F3F4F6] mt-1">
                  {skill.name}
                </div>
                <div
                  className={`text-xs mt-1.5 font-medium ${
                    isSelected
                      ? 'text-[#2557D6] dark:text-[#60A5FA]'
                      : 'text-[#555B66] dark:text-[#9CA3AF]'
                  }`}
                >
                  {skill.level}
                </div>
              </button>
            );
          })}
        </div>

        {/* Skill Inspector */}
        <aside className="lg:col-span-5 bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-6">
          <div className="text-xs font-medium text-[#848B98] dark:text-[#6B7280]">
            Skill Inspector
          </div>
          <h3 className="font-display text-xl font-bold text-[#111318] dark:text-[#F3F4F6] mt-1">
            {selectedSkill.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-[#2557D6] dark:text-[#60A5FA] font-medium mt-1.5 mb-4">
            <span>{selectedSkill.level}</span>
            <span aria-hidden="true" className="text-[#848B98]">·</span>
            <span className="text-[#555B66] dark:text-[#9CA3AF]">{selectedSkill.cat}</span>
          </div>

          <p className="text-sm text-[#555B66] dark:text-[#9CA3AF] leading-relaxed">
            {selectedSkill.desc}
          </p>

          <div className="mt-5 pt-4 border-t border-[#E4E2DC] dark:border-[#232732] flex flex-col gap-2">
            {selectedSkill.refs.map((ref) =>
              ref.external ? (
                <a
                  key={ref.label}
                  href={ref.external}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-[#111318] dark:text-[#F3F4F6] bg-[#F8F8F6] hover:bg-[#F1F0EC] dark:bg-[#191C24] dark:hover:bg-[#212530] border border-[#E4E2DC] dark:border-[#232732] rounded-lg transition-colors"
                >
                  <span>{ref.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#2557D6] dark:text-[#60A5FA]" />
                </a>
              ) : (
                <a
                  key={ref.label}
                  href={ref.target || '#skills'}
                  onClick={() => {
                    if (ref.proj) onOpenProject(ref.proj);
                  }}
                  className="inline-flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-[#111318] dark:text-[#F3F4F6] bg-[#F8F8F6] hover:bg-[#F1F0EC] dark:bg-[#191C24] dark:hover:bg-[#212530] border border-[#E4E2DC] dark:border-[#232732] rounded-lg transition-colors"
                >
                  <span>{ref.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#555B66] dark:text-[#9CA3AF]" />
                </a>
              )
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};
