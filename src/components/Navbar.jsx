import React, { useState } from 'react';

export default function Navbar({
  activeTab,
  onSelectTab,
  publicationsCount,
  profile,
  darkMode,
  onToggleDarkMode,
  onOpenSearch,
  unreadInquiriesCount = 0
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const projectsCount = profile?.projects?.length || 0;

  const navItems = [
    { id: 'research', label: 'Overview', shortLabel: 'Overview', icon: 'science' },
    { id: 'publications', label: 'Publications', shortLabel: 'Papers', icon: 'menu_book', count: publicationsCount },
    { id: 'projects', label: 'Projects', shortLabel: 'Projects', icon: 'folder_special', count: projectsCount },
    { id: 'teaching', label: 'Teaching', shortLabel: 'Teaching', icon: 'school' },
    { id: 'cv', label: 'CV', shortLabel: 'CV', icon: 'description' },
    { id: 'about', label: 'About', shortLabel: 'About', icon: 'badge' },
    { id: 'contact', label: 'Contact', shortLabel: 'Contact', icon: 'mail' },
  ];

  // Dynamic Scholar URL from profile socialLinks
  const scholarLink =
    profile?.socialLinks?.find((l) => l.label?.toLowerCase().includes('scholar'))?.url ||
    'https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en';

  const handleSelect = (id) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 sm:top-3 z-40 w-full px-2 sm:px-4 md:px-6 pointer-events-none transition-all duration-300 no-print">
      <div className="max-w-6xl mx-auto bg-surface/85 dark:bg-surface/80 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] rounded-2xl sm:rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3 pointer-events-auto transition-all relative">
        {/* Apple-style Brand & Faculty Identity */}
        <div
          onClick={() => handleSelect('research')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink min-w-0"
        >
          {/* Squircle Avatar / Monogram */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[14px] bg-gradient-to-br from-primary-container to-primary text-white overflow-hidden flex items-center justify-center font-bold text-sm tracking-wider shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-black/5 dark:ring-white/15 group-hover:scale-105 transition-transform duration-300 shrink-0">
            {profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name || 'Safin Kamal'}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-on-primary font-bold tracking-wider">SK</span>
            )}
          </div>

          {/* Brand Titles with responsive truncation */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-on-surface text-[14px] sm:text-[15px] tracking-tight group-hover:text-secondary transition-colors leading-snug truncate">
                {profile?.name || 'K. M. Safin Kamal'}
              </span>
              <span
                className="material-symbols-outlined text-secondary text-[15px] leading-none shrink-0"
                title="Verified Faculty Researcher • East West University"
              >
                verified
              </span>
            </div>
            <span className="text-[10.5px] sm:text-[11px] text-on-surface-variant font-medium leading-tight truncate">
              East West University • CSE
            </span>
          </div>
        </div>

        {/* Unified Capsule Dock (Contains ALL 7 options on tablet & desktop without exception) */}
        <nav className="hidden md:flex items-center gap-0.5 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 lg:px-3 xl:px-3.5 py-1.5 rounded-full text-[11.5px] lg:text-[12px] xl:text-[12.5px] transition-all duration-200 ${
                  isActive
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/40 font-medium'
                }`}
                title={item.label}
              >
                <span className={`material-symbols-outlined text-[15px] lg:text-[16px] ${isActive ? 'text-secondary' : ''}`}>
                  {item.icon}
                </span>
                <span className="hidden lg:inline">{item.label}</span>
                <span className="inline lg:hidden">{item.shortLabel}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-secondary text-white'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions - Apple Glass Capsule Style */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Omnisearch Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-9 rounded-full bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-on-surface border border-black/[0.04] dark:border-white/[0.06] text-label-md font-medium transition-all group shrink-0"
            title="Search papers, projects, courses, news (Ctrl+K or Cmd+K)"
            aria-label="Search site"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary group-hover:scale-110 transition-transform">
              search
            </span>
            <span className="hidden xl:inline text-on-surface-variant text-[12px]">Search</span>
            <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/[0.04] dark:bg-white/[0.08] text-on-surface-variant">
              ⌘K
            </kbd>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="w-9 h-9 rounded-full bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-on-surface border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-center transition-all group shrink-0"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary group-hover:rotate-45 transition-transform duration-300">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Scholar Profile Quick Link (Hidden on small mobile, compact on tablet, full on desktop) */}
          <a
            href={scholarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 px-2.5 sm:px-3 h-9 rounded-full bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-on-surface hover:text-secondary border border-black/[0.04] dark:border-white/[0.06] text-[12px] font-medium transition-all group shrink-0"
            title="Google Scholar Citations Profile"
          >
            <span className="material-symbols-outlined text-secondary text-[17px] group-hover:scale-110 transition-transform">
              school
            </span>
            <span className="hidden md:inline">Scholar</span>
          </a>

          {/* Faculty Portal Toggle Button */}
          <button
            onClick={() => handleSelect(activeTab === 'admin' ? 'research' : 'admin')}
            className={`relative inline-flex items-center gap-1.5 px-3 sm:px-3.5 h-9 rounded-full border text-[12.5px] font-semibold transition-all shrink-0 ${
              activeTab === 'admin'
                ? 'bg-primary text-white border-primary shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-2 ring-primary/20'
                : 'bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-on-surface border-black/[0.05] dark:border-white/[0.08] hover:text-secondary'
            }`}
            title="Faculty Management Portal & Database Controls"
          >
            <span className="material-symbols-outlined text-[17px]">
              {activeTab === 'admin' ? 'close' : 'tune'}
            </span>
            <span className="hidden sm:inline">
              {activeTab === 'admin' ? 'Exit Portal' : 'Faculty Portal'}
            </span>
            {unreadInquiriesCount > 0 && activeTab !== 'admin' && (
              <span className="inline-flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[9.5px] font-bold rounded-full bg-rose-500 text-white animate-pulse shadow-xs">
                {unreadInquiriesCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button (Visible only on mobile < md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-black/[0.03] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] text-on-surface border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-center transition-all group shrink-0"
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[19px] text-secondary">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Dropdown Capsule Menu (When mobileMenuOpen is true) */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-surface/95 dark:bg-surface/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] p-4 flex flex-col gap-1.5 animate-fadeIn z-50">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-secondary px-3 pb-1 border-b border-black/[0.05] dark:border-white/[0.08] mb-1 flex items-center justify-between">
              <span>All Portfolio Options</span>
              <span className="text-on-surface-variant font-normal">7 Sections</span>
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition-all ${
                    isActive
                      ? 'bg-secondary/15 text-secondary font-semibold'
                      : 'text-on-surface hover:bg-black/[0.03] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[18px] text-secondary">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-secondary/20 text-secondary">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.08] flex items-center justify-between gap-2">
              <a
                href={scholarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] text-[12px] font-semibold text-on-surface hover:text-secondary"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">school</span>
                <span>Google Scholar</span>
              </a>
              <button
                onClick={() => handleSelect('admin')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary text-white text-[12px] font-semibold"
              >
                <span className="material-symbols-outlined text-[16px]">tune</span>
                <span>Faculty Portal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
