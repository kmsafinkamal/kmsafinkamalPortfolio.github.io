import React, { useState, useMemo } from 'react';
import PublicationCard from './PublicationCard';

export default function PublicationsView({ publications, profile, onCiteClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState(null);
  const [sortBy, setSortBy] = useState('citations'); // 'citations', 'year', 'title'
  const [timelineMode, setTimelineMode] = useState('citations'); // 'citations' or 'papers'

  // Dynamic Scholar URL
  const scholarUrl =
    profile?.socialLinks?.find((l) => l.label?.toLowerCase().includes('scholar'))?.url ||
    'https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en';

  // Citation Timeline Data (Per Year) - Auto-synced strictly from Google Scholar Profile Histogram
  const citationTimeline = (profile?.citationTimeline && profile.citationTimeline.length > 0)
    ? profile.citationTimeline
    : [
        { year: 2024, citations: 3, percentage: 17 },
        { year: 2025, citations: 18, percentage: 100 },
        { year: 2026, citations: 17, percentage: 94 },
      ];

  // Papers Published Timeline (Per Year) - Auto-synced from all 46 Google Scholar publications
  const papersTimeline = useMemo(() => {
    if (profile?.papersTimeline && profile.papersTimeline.length > 0) {
      return profile.papersTimeline;
    }
    const counts = {};
    publications.forEach((p) => {
      const yr = p.year || 2024;
      counts[yr] = (counts[yr] || 0) + 1;
    });
    const years = Object.keys(counts).map(Number).sort((a, b) => a - b);
    const maxP = Math.max(...Object.values(counts), 1);
    return years.map((yr) => ({
      year: yr,
      count: counts[yr],
      percentage: Math.round((counts[yr] / maxP) * 100)
    }));
  }, [profile?.papersTimeline, publications]);

  // Active Timeline based on user-selected mode
  const activeTimeline = timelineMode === 'citations' ? citationTimeline : papersTimeline;

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { all: publications.length };
    publications.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [publications]);

  const categories = [
    { id: 'all', label: 'All', count: categoryCounts.all || 0 },
    { id: 'biomedical', label: 'Biomedical AI', count: categoryCounts.biomedical || 0 },
    { id: 'green-cloud', label: 'Green Cloud', count: categoryCounts['green-cloud'] || 0 },
    { id: 'computer-vision', label: 'Computer Vision', count: categoryCounts['computer-vision'] || 0 },
    { id: 'security', label: 'Security & Espionage', count: categoryCounts.security || 0 },
  ];

  // Filtering and sorting
  const filteredAndSorted = useMemo(() => {
    let result = publications.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Year filter (from spark-bar click)
      if (selectedYear !== null && p.year !== selectedYear) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchAuthors = p.authors.toLowerCase().includes(query);
        const matchVenue = p.venue.toLowerCase().includes(query);
        const matchAbstract = p.abstract?.toLowerCase().includes(query);
        return matchTitle || matchAuthors || matchVenue || matchAbstract;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'citations') {
        return b.citations - a.citations || b.year - a.year;
      }
      if (sortBy === 'year') {
        return b.year - a.year || b.citations - a.citations;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [publications, selectedCategory, selectedYear, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedYear(null);
    setSortBy('citations');
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-12">
      {/* Profile & Metrics Summary Section (Stitch Spec) */}
      <section className="flex flex-col gap-4">
        {/* Academic Bio Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline/60 shadow-card flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex flex-col">
              <span className="text-label-sm font-bold text-secondary tracking-wider uppercase">
                {profile?.institution || 'East West University'} • CSE
              </span>
              <h2 className="text-headline-md sm:text-headline-lg font-bold text-on-surface mt-0.5">
                {profile?.name || 'K. M. Safin Kamal'}
              </h2>
              <p className="text-body-sm text-on-surface-variant mt-0.5 max-w-xl">
                {profile?.title || 'Lecturer • Machine Learning, Computer Vision & Biomedical AI'}
              </p>
            </div>

            <a
              href={scholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3.5 rounded-xl bg-surface-container-low text-secondary flex items-center gap-1.5 text-label-md font-semibold hover:bg-secondary hover:text-white transition-all shrink-0 border border-outline/60 self-start shadow-xs group"
              title="View on Google Scholar"
            >
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">
                school
              </span>
              <span>Scholar Profile</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>

          {/* Core Citation Indices */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            <div className="bg-surface-container-low/70 p-3 rounded-xl border border-outline/50 flex flex-col items-center justify-center text-center transition-all hover:bg-surface-container-low">
              <span className="text-headline-sm sm:text-headline-md font-bold text-on-surface leading-tight">
                {profile?.metrics?.citations ?? 41}
              </span>
              <span className="text-label-sm text-on-surface-variant mt-0.5 font-medium">
                Citations
              </span>
            </div>

            <div className="bg-surface-container-low/70 p-3 rounded-xl border border-outline/50 flex flex-col items-center justify-center text-center transition-all hover:bg-surface-container-low">
              <span className="text-headline-sm sm:text-headline-md font-bold text-on-surface leading-tight">
                {profile?.metrics?.hIndex ?? 4}
              </span>
              <span className="text-label-sm text-on-surface-variant mt-0.5 font-medium">
                h-index
              </span>
            </div>

            <div className="bg-surface-container-low/70 p-3 rounded-xl border border-outline/50 flex flex-col items-center justify-center text-center transition-all hover:bg-surface-container-low">
              <span className="text-headline-sm sm:text-headline-md font-bold text-on-surface leading-tight">
                {profile?.metrics?.i10Index ?? 0}
              </span>
              <span className="text-label-sm text-on-surface-variant mt-0.5 font-medium">
                i10-index
              </span>
            </div>

            <div className="bg-surface-container-low/70 p-3 rounded-xl border border-outline/50 flex flex-col items-center justify-center text-center transition-all hover:bg-surface-container-low">
              <span className="text-headline-sm sm:text-headline-md font-bold text-on-surface leading-tight">
                {publications.length}
              </span>
              <span className="text-label-sm text-on-surface-variant mt-0.5 font-medium">
                Articles
              </span>
            </div>
          </div>

          {/* Citation & Research Output Progression (Auto-synced from Google Scholar) */}
          <div className="bg-surface-container-low/70 rounded-xl p-4 border border-outline/50 mt-1">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-label-sm text-on-surface-variant font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    {timelineMode === 'citations' ? 'trending_up' : 'bar_chart'}
                  </span>
                  <span className="font-semibold text-on-surface">
                    {timelineMode === 'citations'
                      ? `Citations Timeline (${citationTimeline[0]?.year || 2024} - ${citationTimeline[citationTimeline.length - 1]?.year || 2026})`
                      : `Papers Published (${papersTimeline[0]?.year || 2023} - ${papersTimeline[papersTimeline.length - 1]?.year || 2026})`}
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Scholar Synced
                  </span>
                </span>
              </div>

              {/* Dual-Mode Selector: Citations Received vs Papers Published */}
              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-lg bg-surface-container p-1 border border-outline/60 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setTimelineMode('citations')}
                    className={`px-2.5 py-1 rounded-md text-label-sm font-semibold transition-all flex items-center gap-1 ${
                      timelineMode === 'citations'
                        ? 'bg-secondary text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="View citations received per year according to Google Scholar profile graph"
                  >
                    <span className="material-symbols-outlined text-[15px]">trending_up</span>
                    <span>Citations ({profile?.metrics?.citations ?? 41})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimelineMode('papers')}
                    className={`px-2.5 py-1 rounded-md text-label-sm font-semibold transition-all flex items-center gap-1 ${
                      timelineMode === 'papers'
                        ? 'bg-secondary text-white shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                    title="View research papers published per year from Google Scholar articles"
                  >
                    <span className="material-symbols-outlined text-[15px]">menu_book</span>
                    <span>Papers ({publications.length})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Spark-Bar Columns (Dynamically rendered for active timeline) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${activeTimeline.length}, minmax(0, 1fr))`
              }}
              className="items-end gap-3 sm:gap-4 h-28 pt-2 px-2"
            >
              {activeTimeline.map((item) => {
                const isSelected = selectedYear === item.year;
                const isHighest = item.percentage === 100;
                const value = timelineMode === 'citations' ? item.citations : item.count;
                
                // Cross-reference data
                const cMatch = citationTimeline.find((c) => c.year === item.year);
                const pMatch = papersTimeline.find((p) => p.year === item.year);
                const subtitle =
                  timelineMode === 'citations'
                    ? `${pMatch?.count || 0} paper${(pMatch?.count || 0) === 1 ? '' : 's'}`
                    : `${cMatch?.citations || 0} cit${(cMatch?.citations || 0) === 1 ? '' : 's'}`;

                return (
                  <div
                    key={item.year}
                    onClick={() => setSelectedYear(selectedYear === item.year ? null : item.year)}
                    title={`Year ${item.year}: ${
                      timelineMode === 'citations'
                        ? `${item.citations} citations on Google Scholar (${pMatch?.count || 0} papers published)`
                        : `${item.count} papers published (${cMatch?.citations || 0} citations on Google Scholar)`
                    } • Click to filter papers`}
                    className={`flex flex-col items-center h-full justify-end group cursor-pointer p-1 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-secondary/15 ring-2 ring-secondary'
                        : 'hover:bg-surface-container/60'
                    }`}
                  >
                    {/* Primary Value Badge above Bar */}
                    <span
                      className={`text-title-sm mb-1 font-bold transition-all ${
                        isSelected
                          ? 'text-secondary scale-110'
                          : isHighest
                          ? 'text-secondary'
                          : 'text-on-surface group-hover:text-secondary'
                      }`}
                    >
                      {value}
                    </span>

                    {/* Bar Pill */}
                    <div
                      style={{ height: `${Math.max(item.percentage, 12)}%` }}
                      className={`w-full max-w-[36px] rounded-t transition-all duration-300 ${
                        isSelected
                          ? 'bg-secondary shadow-md ring-2 ring-secondary/30'
                          : isHighest
                          ? 'bg-secondary shadow-sm group-hover:brightness-110'
                          : 'bg-secondary/50 group-hover:bg-secondary'
                      }`}
                    />

                    {/* Year Label */}
                    <span
                      className={`text-label-sm font-bold mt-1.5 transition-colors ${
                        isSelected
                          ? 'text-secondary'
                          : isHighest
                          ? 'text-on-surface'
                          : 'text-on-surface-variant group-hover:text-on-surface'
                      }`}
                    >
                      {item.year}
                    </span>

                    {/* Secondary Context Metric (Papers or Citations) */}
                    <span className="text-[10px] text-slate-600 font-medium whitespace-nowrap hidden sm:block">
                      {subtitle}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Active Year Filter Notice */}
            {selectedYear && (
              <div className="mt-3 pt-2.5 border-t border-outline/40 flex items-center justify-between text-label-sm text-secondary">
                <span className="flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                  <span>
                    Filtered to <strong>{selectedYear}</strong>: {filteredAndSorted.length} publication{filteredAndSorted.length === 1 ? '' : 's'}
                    {citationTimeline.find((c) => c.year === selectedYear) && (
                      <span className="text-on-surface-variant font-normal">
                        {' '}• {citationTimeline.find((c) => c.year === selectedYear).citations} citations on Google Scholar
                      </span>
                    )}
                  </span>
                </span>
                <button
                  onClick={() => setSelectedYear(null)}
                  className="hover:underline font-bold text-on-surface-variant hover:text-on-surface flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                  <span>Show all years</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Controls Container: Search & Sort */}
      <div className="flex flex-col gap-3.5 bg-surface-container-low/60 p-4 rounded-2xl border border-outline">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, venue (e.g. IEEE, anemia, cloud)..."
              className="w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline rounded-xl text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface p-0.5 rounded-full"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-label-md text-on-surface-variant font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">sort</span>
              <span>Sort:</span>
            </span>
            <div className="inline-flex rounded-xl bg-surface-container-lowest border border-outline p-1 shadow-sm">
              {[
                { id: 'citations', label: 'Citations' },
                { id: 'year', label: 'Year' },
                { id: 'title', label: 'Title' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSortBy(s.id)}
                  className={`px-3 py-1 text-label-md font-medium rounded-lg transition-all ${
                    sortBy === s.id
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-label-md font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-secondary text-white shadow-sm ring-2 ring-secondary/20'
                    : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header / Active Filters Summary */}
      <div className="flex items-center justify-between text-body-sm text-on-surface-variant px-1">
        <span>
          Showing <strong className="text-on-surface">{filteredAndSorted.length}</strong> of{' '}
          {publications.length} publications
          {selectedCategory !== 'all' && (
            <span> in <span className="text-secondary font-medium">"{categories.find(c => c.id === selectedCategory)?.label}"</span></span>
          )}
          {searchQuery && (
            <span> matching <span className="text-secondary font-medium">"{searchQuery}"</span></span>
          )}
        </span>

        {(selectedCategory !== 'all' || searchQuery || sortBy !== 'citations') && (
          <button
            onClick={handleResetFilters}
            className="text-label-sm font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Publications List Grid */}
      {filteredAndSorted.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredAndSorted.map((paper) => (
            <PublicationCard
              key={paper.id}
              paper={paper}
              onCiteClick={onCiteClick}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface-container-lowest border border-outline rounded-2xl p-12 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[30px]">search_off</span>
          </div>
          <h4 className="text-headline-sm font-semibold text-on-surface">No publications found</h4>
          <p className="text-body-md text-on-surface-variant max-w-md">
            No papers matched your search query or selected topic filter. Try broadening your keywords or clearing the active filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-dark font-medium text-label-md transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
