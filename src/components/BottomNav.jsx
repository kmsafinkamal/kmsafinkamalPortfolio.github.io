import React, { useState } from 'react';

export default function BottomNav({ activeTab, onSelectTab, darkMode, onToggleDarkMode }) {
  const [showDrawer, setShowDrawer] = useState(false);

  const primaryItems = [
    { id: 'research', label: 'Overview', icon: 'science' },
    { id: 'publications', label: 'Papers', icon: 'menu_book' },
    { id: 'projects', label: 'Projects', icon: 'folder_special' },
    { id: 'teaching', label: 'Teaching', icon: 'school' },
  ];

  const secondaryItems = [
    { id: 'cv', label: 'Curriculum Vitae', icon: 'description', desc: 'Interactive CV & printable PDF' },
    { id: 'about', label: 'About & Biography', icon: 'badge', desc: 'Background, education & research philosophy' },
    { id: 'contact', label: 'Contact & Collab', icon: 'mail', desc: 'Institutional office & direct email' },
    { id: 'admin', label: 'Admin Dashboard', icon: 'admin_panel_settings', desc: 'Sync Scholar & edit portfolio database' },
  ];

  const handleSelect = (id) => {
    onSelectTab(id);
    setShowDrawer(false);
  };

  const isSecondaryActive = ['cv', 'about', 'contact', 'admin'].includes(activeTab);

  return (
    <>
      {/* Slide-up Drawer Backdrop */}
      {showDrawer && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fadeIn md:hidden"
          onClick={() => setShowDrawer(false)}
        />
      )}

      {/* Slide-up Sheet */}
      {showDrawer && (
        <div className="fixed bottom-16 left-0 right-0 z-50 bg-surface-container-lowest border-t border-outline rounded-t-3xl p-5 shadow-2xl animate-slideUp md:hidden max-h-[75vh] overflow-y-auto">
          <div className="w-12 h-1 bg-outline/80 rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between pb-3 border-b border-outline/50 mb-3">
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              Navigation Menu
            </span>
            <button
              onClick={() => setShowDrawer(false)}
              className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {secondaryItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-3.5 p-3 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-secondary/10 text-secondary font-semibold border border-secondary/20'
                      : 'hover:bg-surface-container-low text-on-surface border border-transparent'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive
                        ? 'bg-secondary text-white'
                        : 'bg-surface-container-low text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-title-sm font-semibold flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.id === 'cv' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 font-bold">
                          PDF
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-on-surface-variant truncate mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                    chevron_right
                  </span>
                </button>
              );
            })}

            {/* Quick Actions in Drawer */}
            <div className="pt-3 mt-1 border-t border-outline/50 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onToggleDarkMode();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-low text-on-surface border border-outline text-label-md font-semibold"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">
                  {darkMode ? 'light_mode' : 'dark_mode'}
                </span>
                <span>{darkMode ? 'Light' : 'Dark'}</span>
              </button>

              <a
                href="https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-low text-on-surface border border-outline text-label-md font-semibold"
              >
                <span className="material-symbols-outlined text-[18px] text-secondary">school</span>
                <span>Scholar</span>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                  open_in_new
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline px-1.5 py-1 shadow-floating no-print">
        <div className="flex items-center justify-around">
          {primaryItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-secondary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[21px] ${
                    isActive ? 'text-secondary font-bold scale-110' : ''
                  } transition-transform`}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] mt-0.5 tracking-tight font-medium">{item.label}</span>
              </button>
            );
          })}

          {/* More Drawer Button */}
          <button
            type="button"
            onClick={() => setShowDrawer(!showDrawer)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isSecondaryActive || showDrawer
                ? 'text-secondary font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[21px] ${
                isSecondaryActive || showDrawer ? 'text-secondary font-bold scale-110' : ''
              } transition-transform`}
            >
              {showDrawer ? 'expand_more' : 'more_horiz'}
            </span>
            <span className="text-[11px] mt-0.5 tracking-tight font-medium">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
