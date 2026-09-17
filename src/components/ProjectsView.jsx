import React, { useState, useMemo } from 'react';

export default function ProjectsView({
  profile = {},
  publications = [],
  onNavigate = () => {},
  onCiteClick = () => {}
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const projects = profile?.projects || [];
  const pubsCount = publications?.length || 0;

  const categories = [
    { id: 'all', label: 'All Projects', count: projects.length },
    { id: 'biomedical', label: 'Biomedical AI', count: projects.filter(p => p.category === 'biomedical').length },
    { id: 'green-cloud', label: 'Green Cloud', count: projects.filter(p => p.category === 'green-cloud').length },
    { id: 'computer-vision', label: 'Computer Vision', count: projects.filter(p => p.category === 'computer-vision').length },
    { id: 'security', label: 'Security & Privacy', count: projects.filter(p => p.category === 'security').length }
  ];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchSummary = p.summary.toLowerCase().includes(q);
        const matchStack = (p.stack || []).some(s => s.toLowerCase().includes(q));
        return matchTitle || matchSummary || matchStack;
      }
      return true;
    });
  }, [projects, selectedCategory, searchQuery]);

  const categoryLabels = {
    biomedical: 'Biomedical AI',
    'green-cloud': 'Green Cloud Systems',
    'computer-vision': 'Edge Computer Vision',
    security: 'Federated Security'
  };

  const statusColors = {
    'Active Research': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50',
    'Benchmark Published': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50',
    'Open Source': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/50',
    'Deployed System': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50',
    'Under Review': 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-12">
      {/* Masthead Banner */}
      <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-secondary text-[26px]">biotech</span>
              <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
                East West University Research Lab
              </span>
            </div>
            <h1 className="text-headline-md sm:text-headline-lg font-bold text-on-surface">
              Research Projects & Computational Systems
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1.5 max-w-3xl leading-relaxed">
              Bridging mathematical machine learning with real-world healthcare diagnostics, energy-aware datacenter orchestration, and low-latency edge vision.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('publications')}
              className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline text-label-md font-semibold transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">menu_book</span>
              <span>Related Papers ({pubsCount})</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-4 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary-dark font-semibold text-label-md transition-all shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">handshake</span>
              <span>Collaborate</span>
            </button>
          </div>
        </div>

        {/* Project Pillars Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-outline/50">
          <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-outline/70 min-w-0">
            <span className="text-label-sm uppercase font-bold text-secondary block">Research Initiatives</span>
            <span className="text-headline-sm font-bold text-on-surface mt-0.5 block">{projects.length} Active</span>
            <span className="text-[11px] text-on-surface-variant">Healthcare, Cloud & Vision</span>
          </div>

          <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-outline/70 min-w-0">
            <span className="text-label-sm uppercase font-bold text-secondary block">Indexed Articles</span>
            <span className="text-headline-sm font-bold text-on-surface mt-0.5 block">{pubsCount} Papers</span>
            <span className="text-[11px] text-on-surface-variant">IEEE, Springer & Elsevier</span>
          </div>

          <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-outline/70 min-w-0">
            <span className="text-label-sm uppercase font-bold text-secondary block">Verified Citations</span>
            <span className="text-headline-sm font-bold text-on-surface mt-0.5 block">{profile.metrics?.citations || 41}+</span>
            <span className="text-[11px] text-on-surface-variant">Google Scholar Verified</span>
          </div>

          <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-outline/70 min-w-0">
            <span className="text-label-sm uppercase font-bold text-secondary block">Lab Affiliation</span>
            <span className="text-headline-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block">EWU CSE</span>
            <span className="text-[11px] text-on-surface-variant">Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-low/60 border border-outline rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-label-md font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-secondary text-white shadow-sm ring-2 ring-secondary/20'
                    : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, stack, terms..."
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
          />
        </div>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-6">
        {filteredProjects.map((project) => (
          <article
            key={project.id}
            className="bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col gap-5 hover:border-secondary/40 transition-all group"
          >
            {/* Header / Meta Row */}
            <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-secondary text-label-sm font-bold uppercase tracking-wider">
                    {categoryLabels[project.category] || project.category}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusColors[project.status] || 'bg-slate-100 text-slate-700'}`}>
                    {project.status}
                  </span>
                </div>
                <h2 className="text-headline-sm sm:text-headline-md font-bold text-on-surface mt-1 group-hover:text-secondary transition-colors">
                  {project.title}
                </h2>
              </div>

              {/* Benchmark Metric Pill */}
              <div className="px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary text-label-sm font-bold whitespace-nowrap self-start shrink-0 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">speed</span>
                <span>{project.metrics}</span>
              </div>
            </div>

            {/* Project Summary */}
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {project.summary}
            </p>

            {/* Key Innovations & Methodology Highlights */}
            <div className="bg-surface-container-low/70 border border-outline/60 rounded-xl p-4 sm:p-5 flex flex-col gap-2.5">
              <span className="text-label-sm uppercase font-bold text-on-surface tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-secondary text-[16px]">task_alt</span>
                <span>Key Computational Contributions</span>
              </span>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-body-sm text-on-surface-variant pt-1">
                {(project.highlights || []).map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack & Interactive Action Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-outline/50">
              {/* Tech Stack Chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-on-surface-variant mr-1">Stack:</span>
                {(project.stack || []).map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px] font-mono font-medium border border-outline/70"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links & CTA */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <a
                  href={project.links?.scholar || 'https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline text-label-md font-semibold transition-colors flex items-center gap-1.5"
                  title="View related publications on Google Scholar"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">school</span>
                  <span>Scholar Articles</span>
                  <span className="material-symbols-outlined text-[13px] text-on-surface-variant">open_in_new</span>
                </a>

                <button
                  onClick={() => onNavigate('contact')}
                  className="px-3.5 py-1.5 rounded-xl bg-secondary text-white hover:bg-secondary-dark text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <span>Join Research</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Dataset & Laboratory Access Callout */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-md border border-slate-700/30">
        <div className="flex flex-col gap-1 max-w-xl">
          <h3 className="text-headline-sm font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-secondary-fixed">dataset</span>
            <span>Dataset Sharing & Joint Lab Inquiries</span>
          </h3>
          <p className="text-body-sm text-slate-300 leading-relaxed">
            Interested in training medical models on our curated peripheral blood smear callsets, or deploying the GreenCloud scheduler in your cluster environment? Reach out for research access.
          </p>
        </div>
        <button
          onClick={() => onNavigate('contact')}
          className="px-5 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary-dark font-semibold text-label-md whitespace-nowrap transition-all shadow-sm shrink-0 flex items-center gap-2 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
          <span>Initiate Research Inquiry</span>
        </button>
      </div>
    </div>
  );
}
