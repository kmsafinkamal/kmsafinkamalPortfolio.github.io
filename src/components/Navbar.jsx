import React from 'react';

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

  return (
    <header className="sticky top-0 sm:top-3 z-40 w-full px-2 sm:px-4 md:px-6 pointer-events-none transition-all duration-300 no-print">
      <div className="max-w-6xl mx-auto bg-surface/85 dark:bg-surface/80 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] rounded-2xl sm:rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] px-3.5 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4 pointer-events-auto transition-all">
        {/* Apple-style Brand & Faculty Identity */}
        <div
          onClick={() => onSelectTab('research')}
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

        {/* Desktop Navigation Capsule Dock (XL+: All 7 items with icons & labels) */}
        <nav className="hidden xl:flex items-center gap-0.5 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-md shadow-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12.5px] transition-all duration-200 ${
                  isActive
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50 font-medium'
                }`}
              >
                <span className={`material-symbols-outlined text-[16px] ${isActive ? 'text-secondary' : ''}`}>{item.icon}</span>
                <span>{item.label}</span>
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

        {/* Medium-to-Large Navigation Dock (LG only: 1024px - 1279px) */}
        <nav className="hidden lg:flex xl:hidden items-center gap-0.5 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11.5px] transition-all duration-200 ${
                  isActive
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/40 font-medium'
                }`}
                title={item.label}
              >
                <span className={`material-symbols-outlined text-[15px] ${isActive ? 'text-secondary' : ''}`}>{item.icon}</span>
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Tablet Navigation Dock (MD only: 768px - 1023px) */}
        <nav className="hidden md:flex lg:hidden items-center gap-0.5 bg-black/[0.04] dark:bg-white/[0.06] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06] backdrop-blur-md">
          {navItems.slice(0, 4).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] transition-all duration-200 ${
                  isActive
                    ? 'bg-surface-container-lowest text-on-surface font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface font-medium'
                }`}
                title={item.label}
              >
                <span className={`material-symbols-outlined text-[15px] ${isActive ? 'text-secondary' : ''}`}>{item.icon}</span>
                <span>{item.shortLabel}</span>
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
            onClick={() => onSelectTab(activeTab === 'admin' ? 'research' : 'admin')}
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
        </div>
      </div>
    </header>
  );
}
