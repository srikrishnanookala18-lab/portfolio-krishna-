/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { EducationSection } from './components/EducationSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EnquiryContactSection } from './components/EnquiryContactSection';
import { CommandPalette } from './components/CommandPalette';
import { PROFILE } from './data/portfolioData';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nsk_theme') === 'dark';
    } catch {
      return false;
    }
  });

  const [activeSection, setActiveSection] = useState<string>('education');
  const [selectedSkillName, setSelectedSkillName] = useState<string>('Python');
  const [activeSkillCat, setActiveSkillCat] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<'jiosense' | 'jainsmart'>('jiosense');
  const [cmdOpen, setCmdOpen] = useState<boolean>(false);
  const [enquiryFocusTrigger, setEnquiryFocusTrigger] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('nsk_theme', isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  useEffect(() => {
    const sectionIds = ['education', 'skills', 'projects', 'contact'];
    const handleScroll = () => {
      const y = window.scrollY + 160;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      } else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || '').toUpperCase())
      ) {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
  };

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 2600);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const jumpToEnquiry = () => {
    const el = document.getElementById('contact');
    el?.scrollIntoView({ behavior: 'smooth' });
    setEnquiryFocusTrigger((n) => n + 1);
  };

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROFILE.email);
      }
      showToast(`Email copied: ${PROFILE.email}`);
    } catch {
      showToast(PROFILE.email);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] dark:bg-[#0B0C0F] text-[#111318] dark:text-[#F3F4F6] transition-colors duration-150">
      <Header activeSection={activeSection} onSendEnquiryClick={jumpToEnquiry} />

      <main className="max-w-[1160px] mx-auto px-6">
        <HeroSection
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          onOpenCmd={() => setCmdOpen(true)}
          onJumpToEnquiry={jumpToEnquiry}
        />

        <EducationSection />

        <SkillsSection
          selectedSkillName={selectedSkillName}
          onSelectSkill={setSelectedSkillName}
          activeCat={activeSkillCat}
          onChangeCat={setActiveSkillCat}
          onOpenProject={(proj) => setActiveProject(proj)}
        />

        <ProjectsSection
          activeProject={activeProject}
          onChangeProject={setActiveProject}
        />

        <EnquiryContactSection
          focusTrigger={enquiryFocusTrigger}
          onNotify={showToast}
        />

        <footer className="py-8 border-t border-[#E4E2DC] dark:border-[#232732] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#555B66] dark:text-[#9CA3AF]">
          <span>
            {PROFILE.name} · {PROFILE.location}
          </span>
          <span className="font-mono text-[11px] text-[#848B98] dark:text-[#6B7280]">
            {PROFILE.degree} · {PROFILE.university} ({PROFILE.batch})
          </span>
        </footer>
      </main>

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onSelectProject={(proj) => setActiveProject(proj)}
        onInspectSkill={(name) => {
          setActiveSkillCat('All');
          setSelectedSkillName(name);
        }}
        onToggleTheme={() => setIsDark((d) => !d)}
        onJumpToEnquiry={jumpToEnquiry}
        onCopyEmail={handleCopyEmail}
      />

      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-[#111318] dark:bg-[#F3F4F6] text-white dark:text-[#111318] text-xs font-medium shadow-lg"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
