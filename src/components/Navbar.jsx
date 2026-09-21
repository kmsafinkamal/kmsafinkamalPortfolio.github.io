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
    { id: 'research', label: 'Overview', icon: 'science' },
    { id: 'publications', label: 'Publications', icon: 'menu_book', count: publicationsCount },
    { id: 'projects', label: 'Projects', icon: 'folder_special', count: projectsCount },
    { id: 'teaching', label: 'Teaching', icon: 'school' },
    { id: 'cv', label: 'CV', icon: 'description' },
    { id: 'about', label: 'About', icon: 'badge' },
    { id: 'contact', label: 'Contact', icon: 'mail' },
  ];

  // Dynamic Scholar URL from profile socialLinks
  const scholarLink =
    profile?.socialLinks?.find((l) => l.label?.toLowerCase().includes('scholar'))?.url ||
    'https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en';

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-xl border-b border-outline/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)] transition-all no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Faculty Identity */}
        <div
          onClick={() => onSelectTab('research')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          {/* Avatar / Monogram Squircle */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-container to-primary text-white overflow-hidden flex items-center justify-center font-bold text-sm tracking-wider group-hover:shadow-md transition-all ring-1 ring-black/5 dark:ring-white/10 shrink-0">
            {profile?.photoUrl ? (
              <img
                src={profile.photoUrl}
                alt={profile.name || 'Safin Kamal'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-on-primary font-bold tracking-wider">SK</span>
            )}
          </div>

          {/* Brand Titles */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-on-surface text-[15px] sm:text-[16px] group-hover:text-secondary transition-colors leading-tight truncate max-w-[150px] sm:max-w-none">
                {profile?.name || 'K. M. Safin Kamal'}
              </span>
              <span
                className="material-symbols-outlined text-secondary text-[16px] leading-none shrink-0"
                title="Verified Faculty Researcher • East West University"
              >
                verified
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant font-medium leading-tight mt-0.5 truncate max-w-[140px] sm:max-w-none">
              East West University • CSE Dept
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs (LG+) */}
        <nav className="hidden lg:flex items-center gap-1 bg-surface-container-low/80 p-1.5 rounded-2xl border border-outline/50 backdrop-blur-md shadow-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[13px] font-semibold transition-all ${
                  isActive
                    ? 'bg-surface-container-lowest text-secondary shadow-xs ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest/50'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
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

        {/* Medium Screen Nav (MD only) */}
        <nav className="hidden md:flex lg:hidden items-center gap-1 bg-surface-container-low/80 p-1.5 rounded-2xl border border-outline/50 backdrop-blur-md">
          {navItems.slice(0, 5).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all ${
                  isActive
                    ? 'bg-surface-container-lowest text-secondary shadow-xs ring-1 ring-black/5'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title={item.label}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Omnisearch / Command Palette Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 h-9 sm:h-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline/60 text-label-md font-medium transition-all group shrink-0"
            title="Search papers, projects, courses, news (Ctrl+K or Cmd+K)"
            aria-label="Search site"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary group-hover:scale-110 transition-transform">
              search
            </span>
            <span className="hidden md:inline text-on-surface-variant text-[12px]">Search</span>
            <kbd className="hidden lg:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-container border border-outline text-on-surface-variant ml-0.5">
              ⌘K
            </kbd>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline/60 flex items-center justify-center transition-all group shrink-0"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-[19px] text-secondary group-hover:scale-110 transition-transform duration-300">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Scholar Profile Quick Link */}
          <a
            href={scholarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-secondary border border-outline/60 text-label-md font-medium transition-all group"
            title="Google Scholar Citations Profile"
          >
            <span className="material-symbols-outlined text-secondary text-[18px] group-hover:scale-110 transition-transform">
              school
            </span>
            <span className="hidden sm:inline">Scholar</span>
            <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-secondary transition-colors">
              open_in_new
            </span>
          </a>

          {/* Faculty Portal Toggle */}
          <button
            onClick={() => onSelectTab(activeTab === 'admin' ? 'research' : 'admin')}
            className={`relative inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl border text-label-md font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-primary text-white border-primary shadow-sm ring-2 ring-primary/20'
                : 'bg-surface-container-low hover:bg-surface-container text-on-surface border-outline/60 hover:text-secondary hover:border-secondary/30'
            }`}
            title="Faculty Management Portal & Database Controls"
          >
            <span className="material-symbols-outlined text-[18px]">
              {activeTab === 'admin' ? 'close' : 'tune'}
            </span>
            <span className="hidden sm:inline">
              {activeTab === 'admin' ? 'Exit Portal' : 'Faculty Portal'}
            </span>
            {unreadInquiriesCount > 0 && activeTab !== 'admin' && (
              <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-red-500 text-white animate-pulse shadow-xs">
                {unreadInquiriesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
