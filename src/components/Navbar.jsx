import React, { useState } from 'react';
import { getPhotoUrl } from '../utils/assetHelper';

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

  const resolvedPhoto = getPhotoUrl(profile?.photoUrl);

  const handleSelect = (id) => {
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-2 sm:top-3.5 z-50 w-full px-2 sm:px-4 pointer-events-none transition-all duration-300 no-print flex justify-center">
      {/* Single Unified Capsule Dock: Every single element is strictly inside this one capsule island */}
      <div className="w-fit max-w-[calc(100vw-16px)] sm:max-w-[calc(100vw-32px)] bg-surface/90 dark:bg-surface/85 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.07),0_1px_3px_rgba(0,0,0,0.03)] px-1.5 sm:px-2.5 h-12 sm:h-13.5 flex items-center gap-0.5 sm:gap-1 pointer-events-auto transition-all relative">
        
        {/* Profile Avatar & Identity Button */}
        <div
          onClick={() => handleSelect('research')}
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0 pl-1 pr-1.5 py-1 rounded-full hover:bg-black/[0.03] dark:hover:bg-white/[0.06] transition-colors"
          title="K. M. Safin Kamal • Overview"
        >
          <div className="w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-full overflow-hidden shrink-0 ring-1.5 ring-primary/30 shadow-xs flex items-center justify-center bg-primary text-white font-bold text-xs group-hover:scale-105 transition-transform duration-200">
            {resolvedPhoto ? (
              <img
                src={resolvedPhoto}
                alt={profile?.name || 'Safin Kamal'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-on-primary font-bold text-[11px] tracking-wider">SK</span>
            )}
          </div>
          
          <span className="font-semibold text-on-surface text-[12.5px] tracking-tight truncate hidden 2xl:inline">
            Safin Kamal
          </span>
        </div>

        {/* Subtle Vertical Divider 1 */}
        <div className="h-4 w-px bg-black/10 dark:bg-white/10 shrink-0 mx-0.5 hidden md:block" />

        {/* Navigation Tabs (Overview, Publications, Projects, Teaching, CV, About, Contact) */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`inline-flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-full text-[11.5px] xl:text-[12px] transition-all duration-150 shrink-0 ${
                  isActive
                    ? 'bg-black/[0.07] dark:bg-white/[0.12] text-on-surface font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/5 dark:ring-white/10'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-black/[0.03] dark:hover:bg-white/[0.06] font-medium'
                }`}
                title={item.label}
              >
                <span
                  className={`material-symbols-outlined text-[15px] xl:text-[16px] ${
                    isActive ? 'text-secondary font-semibold' : 'opacity-85'
                  }`}
                >
                  {item.icon}
                </span>
                <span className="hidden xl:inline">{item.label}</span>
                <span className="inline xl:hidden">{item.shortLabel}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[9px] xl:text-[9.5px] px-1.5 py-0.2 rounded-full font-bold transition-colors ${
                      isActive
                        ? 'bg-secondary text-white'
                        : 'bg-black/[0.06] dark:bg-white/[0.1] text-on-surface-variant'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Subtle Vertical Divider 2 */}
        <div className="h-4 w-px bg-black/10 dark:bg-white/10 shrink-0 mx-0.5 hidden md:block" />

        {/* Action Controls - Strictly inside the exact same capsule */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {/* Quick Omnisearch Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="h-7.5 sm:h-8 px-2 sm:px-2.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-on-surface flex items-center gap-1 text-[11.5px] font-medium transition-all group shrink-0"
            title="Search papers, projects, courses, news (⌘K or Ctrl+K)"
            aria-label="Search site"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary group-hover:scale-110 transition-transform">
              search
            </span>
            <span className="hidden 2xl:inline text-on-surface-variant text-[11.5px]">Search</span>
            <kbd className="hidden lg:inline-flex items-center text-[9px] font-mono px-1 py-0.2 rounded bg-black/[0.05] dark:bg-white/[0.1] text-on-surface-variant">
              ⌘K
            </kbd>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-on-surface flex items-center justify-center transition-all group shrink-0"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            <span className="material-symbols-outlined text-[16px] sm:text-[17px] text-secondary group-hover:rotate-45 transition-transform duration-300">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Scholar Profile Quick Link */}
          <a
            href={scholarLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 h-7.5 sm:h-8 px-2 xl:px-2.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-on-surface hover:text-secondary text-[11.5px] font-medium transition-all group shrink-0"
            title="Google Scholar Citations Profile"
          >
            <span className="material-symbols-outlined text-secondary text-[16px] group-hover:scale-110 transition-transform">
              school
            </span>
            <span className="hidden xl:inline">Scholar</span>
          </a>

          {/* Faculty Portal Toggle Button */}
          <button
            onClick={() => handleSelect(activeTab === 'admin' ? 'research' : 'admin')}
            className={`relative inline-flex items-center gap-1 h-7.5 sm:h-8 px-2.5 xl:px-3 rounded-full text-[11.5px] font-semibold transition-all shrink-0 ${
              activeTab === 'admin'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-primary/10 hover:bg-primary/15 dark:bg-primary/20 text-primary dark:text-blue-300'
            }`}
            title="Faculty Management Portal & Database Controls"
          >
            <span className="material-symbols-outlined text-[15px]">
              {activeTab === 'admin' ? 'close' : 'tune'}
            </span>
            <span className="hidden sm:inline">
              {activeTab === 'admin' ? 'Exit' : 'Portal'}
            </span>
            {unreadInquiriesCount > 0 && activeTab !== 'admin' && (
              <span className="inline-flex items-center justify-center min-w-[15px] h-[15px] px-1 text-[9px] font-bold rounded-full bg-rose-500 text-white animate-pulse shadow-xs">
                {unreadInquiriesCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button (Visible only on screens < md) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-7.5 h-7.5 rounded-full hover:bg-black/[0.04] dark:hover:bg-white/[0.08] text-on-surface flex items-center justify-center transition-all group shrink-0"
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Mobile Dropdown Capsule Menu (When mobileMenuOpen is true on small screens) */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-1/2 -translate-x-1/2 w-[92vw] max-w-sm mt-2 bg-surface/95 dark:bg-surface/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.12] rounded-3xl shadow-[0_16px_40px_rgba(0,0,0,0.14)] p-3.5 flex flex-col gap-1 animate-fadeIn z-50">
            <div className="text-[10.5px] font-bold uppercase tracking-wider text-secondary px-2.5 pb-1 border-b border-black/[0.05] dark:border-white/[0.08] mb-1 flex items-center justify-between">
              <span>All Portfolio Sections</span>
              <span className="text-on-surface-variant font-normal">7 Options</span>
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-[12.5px] font-medium transition-all ${
                    isActive
                      ? 'bg-secondary/15 text-secondary font-semibold'
                      : 'text-on-surface hover:bg-black/[0.03] dark:hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[17px] text-secondary">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && item.count > 0 && (
                    <span className="text-[9.5px] px-2 py-0.5 rounded-full font-bold bg-secondary/20 text-secondary">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 mt-1 border-t border-black/[0.05] dark:border-white/[0.08] flex items-center justify-between gap-2">
              <a
                href={scholarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.06] text-[12px] font-semibold text-on-surface hover:text-secondary"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">school</span>
                <span>Scholar</span>
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
