import React, { useState, useMemo } from 'react';
import { sortTimeline } from '../utils/timelineSort';

export default function AboutView({ profile = {}, onNavigate = () => {} }) {
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' (newest first) | 'asc' (oldest first)

  const sortedTimeline = useMemo(() => {
    return sortTimeline(profile?.timeline || [], sortOrder);
  }, [profile?.timeline, sortOrder]);
  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="border-b border-outline pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-secondary text-[24px]">badge</span>
          <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
            Biographical Dossier
          </span>
        </div>
        <h2 className="text-headline-md sm:text-headline-lg font-bold text-on-surface">
          About & Academic Background
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1 max-w-2xl">
          Academic biography, research appointments, educational background, and technical expertise of K. M. Safin Kamal.
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {profile.photoUrl && (
            <div className="w-full md:w-48 h-56 rounded-2xl overflow-hidden shadow-md border-2 border-outline flex-shrink-0 bg-slate-100">
              <img
                src={profile.photoUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 flex flex-col gap-3">
            <h3 className="text-headline-sm font-bold text-on-surface">
              Scholarly Profile & Vision
            </h3>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              {profile.bio}
            </p>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              Kamal's investigations focus on translating algorithmic innovations in convolutional neural networks, transfer learning, and vision transformers into clinically actionable tools. Concurrently, his work in sustainable cloud computing tackles computational carbon footprints through energy-aware task scheduling and greedy resource allocation strategies.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {profile.affiliations.map((aff, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-container-low text-on-surface text-label-md font-medium border border-outline/60"
            >
              <span className="material-symbols-outlined text-secondary text-[16px]">apartment</span>
              <span>{aff}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Academic Timeline / Journey */}
      <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-outline/50">
          <div className="flex flex-col">
            <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">history_edu</span>
              <span>Academic Journey & Appointments</span>
            </h3>
            <span className="text-[12px] text-on-surface-variant mt-0.5">
              Automatically sorted chronologically according to academic milestones.
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-label-sm font-semibold border border-outline/70 transition-colors shadow-xs active:scale-[0.98]"
            title="Toggle Chronological Direction"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              {sortOrder === 'desc' ? 'arrow_downward' : 'arrow_upward'}
            </span>
            <span>{sortOrder === 'desc' ? 'Newest First (Descending)' : 'Oldest First (Ascending)'}</span>
          </button>
        </div>

        {/* Timeline according to Stitch Design Tokens */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-outline ml-3 sm:ml-4 flex flex-col gap-8">
          {sortedTimeline.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Node dot anchored at entry */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-secondary border-4 border-surface-container-lowest shadow-sm group-hover:scale-125 transition-transform" />

              <div className="flex flex-col gap-1">
                <span className="text-label-sm font-bold text-secondary tracking-wider uppercase">
                  {item.year}
                </span>
                <h4 className="text-title-md font-bold text-on-surface">
                  {item.role}
                </h4>
                <span className="text-body-sm text-slate-500 font-medium">
                  {item.institution}
                </span>
                <p className="text-body-md text-on-surface-variant mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honors & Academic Awards Section (Synced with CV & Admin) */}
      {(profile.honors || []).length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
                Recognitions & Distinctions
              </span>
              <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">military_tech</span>
                <span>Honors & Academic Awards</span>
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.honors.map((h, idx) => (
              <div
                key={idx}
                className="bg-surface-container-lowest border border-outline rounded-2xl p-5 shadow-card flex flex-col justify-between gap-3 hover:border-secondary/40 transition-all group"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-mono text-[11px] font-bold">
                      {h.year}
                    </span>
                  </div>

                  <h4 className="text-title-md font-bold text-on-surface group-hover:text-secondary transition-colors">
                    {h.title}
                  </h4>
                  <span className="text-body-sm text-secondary font-medium">
                    {h.issuer}
                  </span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed mt-0.5">
                    {h.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills & Methodologies Matrix */}
      <div className="flex flex-col gap-4">
        <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">psychology</span>
          <span>Technical Competencies & Methodologies</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {profile.skills.map((skillGroup, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest border border-outline rounded-2xl p-5 shadow-card flex flex-col gap-3"
            >
              <h4 className="text-title-md font-semibold text-on-surface border-b border-outline/50 pb-2">
                {skillGroup.category}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillGroup.items.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface text-label-md font-medium hover:bg-surface-container transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-r from-primary to-primary-container text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <h4 className="text-headline-sm font-bold">Interested in Academic Collaboration?</h4>
          <p className="text-body-sm text-slate-300 mt-1">
            Open for co-authoring, conference program committees, and healthcare AI research initiatives.
          </p>
        </div>
        <button
          onClick={() => onNavigate('contact')}
          className="px-5 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary-dark font-semibold text-label-md whitespace-nowrap transition-colors shadow-sm"
        >
          Initiate Contact
        </button>
      </div>
    </div>
  );
}
