import React from 'react';
import PublicationCard from './PublicationCard';

export default function ResearchHubView({ profile, publications, onNavigate, onCiteClick }) {
  // Top 3 cited publications for featured section
  const featuredPapers = [...publications]
    .sort((a, b) => b.citations - a.citations)
    .slice(0, 3);

  const newsItems = profile.news || [];
  const projectsCount = profile.projects?.length || 0;
  const coursesCount = profile.teaching?.length || 0;

  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-12">
      {/* Hero Profile Masthead */}
      <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar / Monogram */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-primary-container to-primary text-white overflow-hidden flex items-center justify-center font-bold text-2xl sm:text-3xl shadow-md border-2 border-surface-container-lowest">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                'SK'
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center shadow-sm border-2 border-surface-container-lowest" title="Verified Researcher">
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </div>
          </div>

          {/* Profile Identity */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-headline-md sm:text-headline-lg font-bold text-on-surface">
                {profile.name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-secondary text-label-sm font-semibold border border-blue-100 dark:border-blue-900/50">
                <span className="material-symbols-outlined text-[14px]">school</span>
                Google Scholar Verified
              </span>
            </div>

            <p className="text-title-md text-secondary font-medium mt-1">
              {profile.title}
            </p>

            <p className="text-body-sm text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          </div>
        </div>

        {/* Scholar Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-surface-container-low/70 border border-outline/70 p-4 rounded-xl flex flex-col">
            <div className="flex items-center justify-between text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider mb-1">
              <span>Citations</span>
              <span className="material-symbols-outlined text-secondary text-[18px]">format_quote</span>
            </div>
            <span className="text-headline-md font-bold text-on-surface">{profile.metrics.citations}+</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Across {profile.metrics.publicationsCount} articles</span>
          </div>

          <div className="bg-surface-container-low/70 border border-outline/70 p-4 rounded-xl flex flex-col">
            <div className="flex items-center justify-between text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider mb-1">
              <span>h-index</span>
              <span className="material-symbols-outlined text-secondary text-[18px]">trending_up</span>
            </div>
            <span className="text-headline-md font-bold text-on-surface">{profile.metrics.hIndex}</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">Scholarly impact</span>
          </div>

          <div className="bg-surface-container-low/70 border border-outline/70 p-4 rounded-xl flex flex-col">
            <div className="flex items-center justify-between text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider mb-1">
              <span>i10-index</span>
              <span className="material-symbols-outlined text-secondary text-[18px]">bar_chart</span>
            </div>
            <span className="text-headline-md font-bold text-on-surface">{profile.metrics.i10Index}</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">High-impact papers</span>
          </div>

          <div className="bg-surface-container-low/70 border border-outline/70 p-4 rounded-xl flex flex-col">
            <div className="flex items-center justify-between text-on-surface-variant text-label-sm font-semibold uppercase tracking-wider mb-1">
              <span>Publications</span>
              <span className="material-symbols-outlined text-secondary text-[18px]">menu_book</span>
            </div>
            <span className="text-headline-md font-bold text-on-surface">{profile.metrics.publicationsCount}</span>
            <span className="text-[11px] text-on-surface-variant mt-0.5">IEEE, Springer, Elsevier</span>
          </div>
        </div>

        {/* Hero Actions Bar */}
        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-outline/50">
          <button
            onClick={() => onNavigate('publications')}
            className="px-5 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary-dark font-semibold text-label-md transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">library_books</span>
            <span>View All Publications ({profile.metrics.publicationsCount})</span>
          </button>

          <button
            onClick={() => onNavigate('cv')}
            className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline font-semibold text-label-md transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">description</span>
            <span>Academic CV</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 font-bold">
              PDF
            </span>
          </button>

          <a
            href="https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline font-medium text-label-md transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">school</span>
            <span>Google Scholar</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">open_in_new</span>
          </a>

          <button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline font-medium text-label-md transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">handshake</span>
            <span>Collaborate</span>
          </button>
        </div>
      </div>

      {/* Quick Navigation Cards: Projects, Teaching, CV */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('projects')}
          className="bg-surface-container-lowest border border-outline rounded-2xl p-5 shadow-card hover:border-secondary/50 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">folder_special</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {projectsCount} Systems
            </span>
          </div>
          <div>
            <h3 className="text-title-md font-bold text-on-surface group-hover:text-secondary transition-colors">
              Research Projects & Labs
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
              Open-source AI frameworks, clinical diagnosis pipelines, and edge computing architectures.
            </p>
          </div>
          <div className="pt-2 border-t border-outline/50 flex items-center justify-between text-label-sm font-semibold text-secondary">
            <span>Explore Projects</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('teaching')}
          className="bg-surface-container-lowest border border-outline rounded-2xl p-5 shadow-card hover:border-secondary/50 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">school</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {coursesCount} EWU Courses
            </span>
          </div>
          <div>
            <h3 className="text-title-md font-bold text-on-surface group-hover:text-secondary transition-colors">
              Teaching & Mentorship
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
              Undergraduate coursework in ML/DL and capstone research thesis supervision.
            </p>
          </div>
          <div className="pt-2 border-t border-outline/50 flex items-center justify-between text-label-sm font-semibold text-secondary">
            <span>Course Offerings & Theses</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('cv')}
          className="bg-surface-container-lowest border border-outline rounded-2xl p-5 shadow-card hover:border-secondary/50 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between gap-3 group"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Printable PDF
            </span>
          </div>
          <div>
            <h3 className="text-title-md font-bold text-on-surface group-hover:text-secondary transition-colors">
              Curriculum Vitae
            </h3>
            <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
              Complete academic history, peer-reviewed bibliography, grants, and institutional service.
            </p>
          </div>
          <div className="pt-2 border-t border-outline/50 flex items-center justify-between text-label-sm font-semibold text-secondary">
            <span>View & Download CV</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </div>
      </div>

      {/* Latest News & Announcements */}
      {newsItems.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
                Milestones & Updates
              </span>
              <h2 className="text-headline-md font-bold text-on-surface">
                Recent News & Announcements
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-surface-container-lowest border border-outline rounded-2xl p-5 shadow-card flex flex-col justify-between gap-2.5 hover:border-secondary/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                    {item.badge || item.tag || 'Announcement'}
                  </span>
                  <span className="text-[12px] text-on-surface-variant font-medium">
                    {item.date}
                  </span>
                </div>
                <div>
                  <h3 className="text-title-sm font-bold text-on-surface">
                    {item.title}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                    {item.description || item.venue}
                  </p>
                </div>
                {item.link && (
                  <div className="pt-2 border-t border-outline/50">
                    <button
                      onClick={() => onNavigate(item.link.replace('#', ''))}
                      className="text-label-sm font-semibold text-secondary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Learn more</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Research Pillars */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              Domains of Inquiry
            </span>
            <h2 className="text-headline-md font-bold text-on-surface">
              Core Research Pillars
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.researchPillars.map((pillar) => (
            <div
              key={pillar.id}
              onClick={() => onNavigate('publications')}
              className="bg-surface-container-lowest border border-outline rounded-2xl p-5 shadow-card hover:border-secondary/50 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between gap-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">{pillar.icon}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-sm font-semibold">
                  {pillar.stats}
                </span>
              </div>

              <div>
                <h3 className="text-title-md font-semibold text-on-surface group-hover:text-secondary transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-body-sm text-on-surface-variant mt-1.5 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-2 border-t border-outline/50 flex items-center justify-between text-label-sm text-on-surface-variant">
                <span className="text-secondary font-medium">{pillar.highlight}</span>
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 group-hover:text-secondary transition-all">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Publications Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              High-Impact Work
            </span>
            <h2 className="text-headline-md font-bold text-on-surface">
              Featured Publications
            </h2>
          </div>
          <button
            onClick={() => onNavigate('publications')}
            className="text-label-md font-semibold text-secondary hover:underline flex items-center gap-1"
          >
            <span>View all {profile.metrics.publicationsCount} papers</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {featuredPapers.map((paper) => (
            <PublicationCard
              key={paper.id}
              paper={paper}
              onCiteClick={onCiteClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
