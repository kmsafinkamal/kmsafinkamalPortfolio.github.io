import React, { useState, useEffect, useMemo, useRef } from 'react';

export default function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  publications = [],
  profile = {},
  onCiteClick,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Build searchable items list
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();

    // 1. Pages
    const pages = [
      { id: 'research', title: 'Research Overview', category: 'Navigation', icon: 'science', desc: 'Summary metrics, top cited papers, pillars & news' },
      { id: 'publications', title: 'Publications & Preprints', category: 'Navigation', icon: 'menu_book', desc: `Browse ${publications.length} peer-reviewed articles & citations` },
      { id: 'projects', title: 'Research Projects', category: 'Navigation', icon: 'folder_special', desc: 'Biomedical AI, Green Cloud & Vision Systems' },
      { id: 'teaching', title: 'Teaching & Mentorship', category: 'Navigation', icon: 'school', desc: 'University curricula, lab syllabi & capstones' },
      { id: 'cv', title: 'Curriculum Vitae', category: 'Navigation', icon: 'description', desc: 'Interactive CV & printable academic PDF' },
      { id: 'about', title: 'About & Academic Journey', category: 'Navigation', icon: 'badge', desc: 'Biography, appointments & degrees' },
      { id: 'contact', title: 'Contact & Collaboration', category: 'Navigation', icon: 'mail', desc: 'Direct email & academic inquiries' },
    ];

    const matchedPages = !q
      ? pages
      : pages.filter((p) => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));

    // 2. Publications
    const matchedPubs = !q
      ? []
      : publications
          .filter((p) => {
            return (
              p.title.toLowerCase().includes(q) ||
              (p.venue && p.venue.toLowerCase().includes(q)) ||
              (p.authors && p.authors.toLowerCase().includes(q)) ||
              (p.year && p.year.toString().includes(q))
            );
          })
          .slice(0, 8)
          .map((p) => ({
            id: `pub-${p.id}`,
            title: p.title,
            category: 'Publications',
            icon: 'article',
            desc: `${p.venue} (${p.year}) • ${p.citations} citations`,
            data: p,
          }));

    // 3. Projects
    const projects = profile?.projects || [];
    const matchedProjects = !q
      ? []
      : projects
          .filter((prj) => {
            return (
              prj.title.toLowerCase().includes(q) ||
              prj.summary.toLowerCase().includes(q) ||
              (prj.stack && prj.stack.some((s) => s.toLowerCase().includes(q)))
            );
          })
          .slice(0, 4)
          .map((prj) => ({
            id: `prj-${prj.id}`,
            title: prj.title,
            category: 'Projects',
            icon: 'code',
            desc: prj.summary,
            data: prj,
          }));

    // 4. Teaching Courses
    const courses = profile?.teaching || [];
    const matchedCourses = !q
      ? []
      : courses
          .filter((c) => {
            return (
              c.code.toLowerCase().includes(q) ||
              c.title.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q)
            );
          })
          .slice(0, 4)
          .map((c) => ({
            id: `course-${c.code}`,
            title: `${c.code}: ${c.title}`,
            category: 'Teaching',
            icon: 'school',
            desc: c.description,
            data: c,
          }));

    return [...matchedPages, ...matchedPubs, ...matchedProjects, ...matchedCourses];
  }, [query, publications, profile]);

  // Keep selected index within range
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (item) => {
    if (item.category === 'Navigation') {
      onNavigate(item.id);
    } else if (item.category === 'Publications') {
      onNavigate('publications');
      if (onCiteClick && item.data) {
        onCiteClick(item.data);
      }
    } else if (item.category === 'Projects') {
      onNavigate('projects');
    } else if (item.category === 'Teaching') {
      onNavigate('teaching');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-2xl bg-surface-container-lowest border border-outline rounded-2xl shadow-floating overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-outline/70 bg-surface-container-lowest">
          <span className="material-symbols-outlined text-secondary text-[22px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search papers, projects, courses, news, or sections..."
            className="flex-1 bg-transparent border-none text-body-lg text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-md"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-surface-container text-[11px] font-semibold text-on-surface-variant border border-outline/70">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 scrollbar-thin">
          {results.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-[36px] text-on-surface-variant/50">
                search_off
              </span>
              <p className="text-body-md font-medium">No results found for "{query}"</p>
              <p className="text-body-sm text-on-surface-variant/80">
                Try searching for "anemia", "cloud", "vision", "deep learning", or "CV".
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-start gap-3 p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-secondary/10 border border-secondary/30 shadow-xs'
                        : 'hover:bg-surface-container-low border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-secondary text-white'
                          : 'bg-surface-container-low text-secondary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-title-sm font-semibold truncate ${
                          isSelected ? 'text-secondary' : 'text-on-surface'
                        }`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant shrink-0">
                          {item.category}
                        </span>
                      </div>
                      {item.desc && (
                        <p className="text-[12px] text-on-surface-variant line-clamp-1 mt-0.5">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div className="px-4 py-2.5 bg-surface-container-low/60 border-t border-outline/60 flex items-center justify-between text-[11px] text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline/70 font-mono">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline/70 font-mono">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container border border-outline/70 font-mono">↵</kbd>
              <span>Select</span>
            </span>
          </div>
          <span className="hidden sm:inline">Global Academic Omnibar</span>
        </div>
      </div>
    </div>
  );
}
