import React from 'react';

interface HeaderProps {
  activeSection: string;
  onSendEnquiryClick: () => void;
}

const NAV_ITEMS = [
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Enquiry' },
];

export const Header: React.FC<HeaderProps> = ({ activeSection, onSendEnquiryClick }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#E4E2DC] dark:border-[#232732] bg-[#F8F8F6]/90 dark:bg-[#0B0C0F]/90 backdrop-blur-md">
      <div className="max-w-[1160px] mx-auto px-6 py-4 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6] rounded"
        >
          Nookala Sri Krishna
        </a>

        <nav className="hidden md:flex items-center gap-7" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6] rounded-t ${
                  isActive
                    ? 'text-[#111318] dark:text-[#F3F4F6] border-[#2557D6] dark:border-[#60A5FA]'
                    : 'text-[#555B66] dark:text-[#9CA3AF] border-transparent hover:text-[#111318] dark:hover:text-[#F3F4F6] hover:border-[#CFCCC2] dark:hover:border-[#353B4A]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={onSendEnquiryClick}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#2557D6] hover:bg-[#1D46B3] dark:bg-[#60A5FA] dark:text-[#090D16] dark:hover:bg-[#93C5FD] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6] focus-visible:ring-offset-2"
        >
          Send Enquiry
        </button>
      </div>
    </header>
  );
};
