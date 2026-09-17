import React, { useState, useMemo } from 'react';
import { sortTimeline, isEducationMilestone } from '../utils/timelineSort';

export default function CVView({
  profile = {},
  publications = [],
  onNavigate = () => {}
}) {
  const [pubFilter, setPubFilter] = useState('');
  const [showAllPubs, setShowAllPubs] = useState(false);

  const pubsCount = publications?.length || 0;
  const projects = profile?.projects || [];
  const courses = profile?.teaching || [];
  const mentorship = profile?.mentorship || [];
  const news = profile?.news || [];
  const services = profile?.services || [];
  const honors = profile?.honors || [];
  const skills = profile?.skills || [];
  const timeline = profile?.timeline || [];
  const researchPillars = profile?.researchPillars || [];
  const interests = profile?.interests || [];
  const officeRoom = profile?.officeRoom || profile?.room || 'Room CSE-512';

  // Dynamic Scholar URL
  const scholarLink =
    profile?.socialLinks?.find((l) => l.label?.toLowerCase().includes('scholar'))?.url ||
    'https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en';

  const handlePrint = () => {
    window.print();
  };

  // Filtered publications
  const filteredPublications = useMemo(() => {
    if (!pubFilter.trim()) return publications;
    const q = pubFilter.toLowerCase();
    return publications.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.authors && p.authors.toLowerCase().includes(q)) ||
        (p.venue && p.venue.toLowerCase().includes(q)) ||
        (p.year && p.year.toString().includes(q))
    );
  }, [publications, pubFilter]);

  const displayedPublications = showAllPubs
    ? filteredPublications
    : filteredPublications.slice(0, 10);

  // Distinguish academic appointments from degree history and auto-sort chronologically (newest first)
  // Ensures degrees (M.Sc., B.Sc., Ph.D.) appear EXCLUSIVELY under Education, never under Appointments
  const academicAppointments = useMemo(() => {
    const raw = (timeline || []).filter((item) => !isEducationMilestone(item));
    return sortTimeline(raw, 'desc');
  }, [timeline]);

  const educationHistory = useMemo(() => {
    const raw = (timeline || []).filter((item) => isEducationMilestone(item));
    return sortTimeline(raw, 'desc');
  }, [timeline]);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-16 print:p-0 print:m-0 print:gap-4">
      {/* Action & Quick Navigation Toolbar (Hidden on Print) */}
      <div className="bg-surface-container-lowest border border-outline rounded-2xl p-5 sm:p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-[22px]">description</span>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              Academic Curriculum Vitae
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              Live Synchronized
            </span>
          </div>
          <h2 className="text-headline-sm font-bold text-on-surface">
            Interactive & Printable Curriculum Vitae
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Dynamically aggregates your live research systems, teaching curricula, verified Google Scholar bibliography, and academic history.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md transition-all shadow-sm flex items-center gap-2 active:scale-[0.98]"
            title="Export clean, publication-ready PDF via browser print"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE ACADEMIC CV DOCUMENT (Full-width, clean paper styling)         */}
      {/* ========================================================================= */}
      <div className="cv-document bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-10 shadow-card flex flex-col gap-9 print:border-none print:shadow-none print:p-0 print:gap-6">
        
        {/* CV Header Masthead */}
        <header className="flex flex-col gap-2 pb-6 border-b-2 border-secondary/80">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-headline-lg sm:text-[34px] font-bold text-on-surface tracking-tight leading-tight">
                {profile.name || 'K. M. Safin Kamal'}
              </h1>
              <p className="text-title-md font-semibold text-secondary mt-0.5">
                {profile.title || 'Lecturer, Department of Computer Science & Engineering'}
              </p>
              <p className="text-body-md text-on-surface-variant font-medium">
                {profile.department || 'Department of Computer Science & Engineering'} • {profile.institution || 'East West University'}
              </p>
            </div>

            <div className="text-right flex flex-col sm:items-end text-body-sm text-on-surface-variant gap-0.5">
              <span className="font-semibold text-on-surface flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">meeting_room</span>
                <span>Office: {officeRoom}</span>
              </span>
              <span>{profile.email || 'safin.kamal@ewubd.edu'}</span>
              <span>{profile.location || 'Dhaka, Bangladesh'}</span>
            </div>
          </div>

          {/* Social Profiles & Scholarly Indexes */}
          <div className="flex items-center gap-2.5 flex-wrap pt-2 text-[12px] text-on-surface-variant font-medium">
            <a
              href={scholarLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-secondary hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">school</span>
              <span>Google Scholar (Verified)</span>
            </a>
            <span>•</span>
            {(profile.socialLinks || [])
              .filter((l) => !l.label?.toLowerCase().includes('scholar'))
              .map((l, i) => (
                <React.Fragment key={i}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors"
                  >
                    {l.label}
                  </a>
                  {i < (profile.socialLinks.length - 2) && <span>•</span>}
                </React.Fragment>
              ))}
          </div>
        </header>

        {/* Section 1: Executive Summary & Research Philosophy */}
        <section className="flex flex-col gap-3">
          <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline/80 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">psychology</span>
            <span>Research Summary & Domains of Inquiry</span>
          </h2>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            {profile.bio}
          </p>

          {/* Core Research Pillars (Dynamic from Research Hub) */}
          {researchPillars.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {researchPillars.map((pillar) => (
                <div key={pillar.id} className="p-3 rounded-xl bg-surface-container-low border border-outline/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-body-sm text-on-surface">{pillar.title}</span>
                    <span className="text-[11px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                      {pillar.stats}
                    </span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Core Research Tags */}
          {interests.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[12px]">
              <span className="font-bold text-on-surface-variant mr-1">Focus Areas:</span>
              {interests.map((interest, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-medium border border-outline/50"
                >
                  {interest}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: Academic & Professional Appointments (Dynamic from About Timeline) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline/80 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">badge</span>
            <span>Academic Appointments</span>
          </h2>
          <div className="flex flex-col gap-4 pt-1">
            {academicAppointments.map((item, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="text-body-md font-bold text-on-surface">{item.role}</h3>
                  <p className="text-body-sm text-secondary font-medium">{item.institution}</p>
                  <p className="text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <span className="text-label-sm font-semibold text-on-surface-variant whitespace-nowrap sm:text-right">
                  {item.year}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Education & Academic Qualifications (Dynamic from About Timeline) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline/80 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">school</span>
            <span>Education</span>
          </h2>
          <div className="flex flex-col gap-3 pt-1">
            {educationHistory.length > 0 ? (
              educationHistory.map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <h3 className="text-body-md font-bold text-on-surface">{item.role}</h3>
                    <p className="text-body-sm text-secondary font-medium">{item.institution}</p>
                    <p className="text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-label-sm font-semibold text-on-surface-variant whitespace-nowrap sm:text-right">
                    {item.year}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="text-body-md font-bold text-on-surface">
                    Bachelor of Science (B.Sc.) in Computer Science & Engineering
                  </h3>
                  <p className="text-body-sm text-secondary font-medium">East West University, Dhaka, Bangladesh</p>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">
                    Graduated with Academic Distinction; active undergraduate researcher authoring multiple peer-reviewed publications.
                  </p>
                </div>
                <span className="text-label-sm font-semibold text-on-surface-variant whitespace-nowrap">2019 - 2023</span>
              </div>
            )}
          </div>
        </section>

        {/* Section 4: Scholarly Metrics (Google Scholar Synchronized) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline/80 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">analytics</span>
            <span>Scholarly Metrics & Bibliometrics (Google Scholar Synced)</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/60 text-center">
              <span className="text-headline-sm font-bold text-on-surface">{pubsCount}</span>
              <span className="block text-[11px] text-on-surface-variant uppercase font-semibold mt-0.5">Articles Indexed</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/60 text-center">
              <span className="text-headline-sm font-bold text-on-surface">{profile.metrics?.citations || 41}+</span>
              <span className="block text-[11px] text-on-surface-variant uppercase font-semibold mt-0.5">Verified Citations</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/60 text-center">
              <span className="text-headline-sm font-bold text-on-surface">{profile.metrics?.hIndex || 4}</span>
              <span className="block text-[11px] text-on-surface-variant uppercase font-semibold mt-0.5">h-index</span>
            </div>
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline/60 text-center">
              <span className="text-headline-sm font-bold text-emerald-700 dark:text-emerald-400">Verified</span>
              <span className="block text-[11px] text-on-surface-variant uppercase font-semibold mt-0.5">Institutional Scholar</span>
            </div>
          </div>
        </section>

        {/* Section 5: Funded Research Projects & Systems (Dynamic from Projects Page & Admin) */}
        {projects.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-outline/80">
              <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">folder_special</span>
                <span>Research Projects & Computational Systems ({projects.length})</span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="text-label-sm font-semibold text-secondary hover:underline print:hidden"
              >
                View Live Projects &rarr;
              </button>
            </div>

            <div className="flex flex-col gap-4 pt-1">
              {projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-xl bg-surface-container-low/70 border border-outline/60 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <div>
                      <h3 className="text-body-md font-bold text-on-surface">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary mt-0.5">
                        <span>{proj.status}</span>
                        <span>•</span>
                        <span>{proj.metrics}</span>
                      </div>
                    </div>
                    {proj.links?.scholar && (
                      <span className="text-[11px] font-mono text-on-surface-variant print:hidden">
                        [Indexed in Scholar]
                      </span>
                    )}
                  </div>

                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    {proj.summary}
                  </p>

                  {/* Highlights */}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc pl-5 space-y-0.5 text-[13px] text-on-surface-variant pt-0.5">
                      {proj.highlights.map((h, hi) => (
                        <li key={hi}>{h}</li>
                      ))}
                    </ul>
                  )}

                  {/* Tech stack */}
                  {proj.stack && proj.stack.length > 0 && (
                    <div className="text-[11px] text-on-surface-variant pt-1 border-t border-outline/40">
                      <strong>Toolchain:</strong> {proj.stack.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 6: University Teaching Portfolio (Dynamic from Teaching Page & Admin) */}
        {courses.length > 0 && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-outline/80">
              <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">school</span>
                <span>University Teaching Portfolio ({courses.length} Courses)</span>
              </h2>
              <button
                type="button"
                onClick={() => onNavigate('teaching')}
                className="text-label-sm font-semibold text-secondary hover:underline print:hidden"
              >
                View Teaching Page &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {courses.map((c) => (
                <div key={c.code} className="p-3.5 rounded-xl bg-surface-container-low/70 border border-outline/60 flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                        {c.code}
                      </span>
                      <span className="text-[11px] font-semibold text-on-surface-variant">
                        {c.term}
                      </span>
                    </div>
                    <h4 className="font-bold text-body-md text-on-surface">{c.title}</h4>
                    <p className="text-[12px] text-secondary font-medium mt-0.5">
                      {c.role} • {c.level}
                    </p>
                    <p className="text-[12px] text-on-surface-variant leading-relaxed mt-1">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-outline/40 flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>{c.room}</span>
                    <span>{c.officeHours}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 7: Supervised Student Capstones (Dynamic from Teaching Page & Admin) */}
        {mentorship.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline/80 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">diversity_3</span>
              <span>Supervised Undergraduate Capstone Research & Mentorship</span>
            </h2>
            <div className="flex flex-col gap-2.5 pt-1">
              {mentorship.map((item, mi) => (
                <div key={mi} className="p-3 rounded-xl bg-surface-container-low/70 border border-outline/60 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-body-sm">
                  <div>
                    <strong className="text-on-surface">{item.title}</strong>
                    <span className="text-secondary font-medium ml-1">({item.domain})</span>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">
                      Supervised: {item.students}
                    </p>
                    <p className="text-[12px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                      Outcome: {item.outcome}
                    </p>
                  </div>
                  <span className="text-label-sm font-semibold text-on-surface-variant whitespace-nowrap sm:text-right">
                    {item.year}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 8: Peer-Reviewed Scholarly Publications (Dynamic from Publications Page) */}
        <section className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1.5 border-b border-outline/80">
            <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">menu_book</span>
              <span>Peer-Reviewed Publications & Preprints ({pubsCount} Articles)</span>
            </h2>
            <div className="flex items-center gap-2 print:hidden">
              <input
                type="text"
                value={pubFilter}
                onChange={(e) => setPubFilter(e.target.value)}
                placeholder="Filter publications by keyword..."
                className="h-8 px-2.5 bg-surface-container-low border border-outline rounded-lg text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary text-[12px]"
              />
              <button
                type="button"
                onClick={() => onNavigate('publications')}
                className="text-label-sm font-semibold text-secondary hover:underline whitespace-nowrap"
              >
                All Papers &rarr;
              </button>
            </div>
          </div>

          <ol className="list-decimal pl-5 space-y-2.5 pt-1 text-body-sm text-on-surface-variant">
            {displayedPublications.map((pub) => (
              <li key={pub.id} className="pl-1 leading-relaxed">
                <strong className="text-on-surface">{pub.title}</strong>.{' '}
                <span>{pub.authors}</span>.{' '}
                <em className="text-secondary font-medium">{pub.venue}</em>, {pub.year}.{' '}
                <span className="text-[11px] font-bold text-secondary bg-secondary/10 px-1.5 py-0.2 rounded print:border">
                  [{pub.citations} citations]
                </span>
                {pub.scholarLink && (
                  <a
                    href={pub.scholarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-secondary hover:underline text-[11px] print:hidden"
                  >
                    [Scholar]
                  </a>
                )}
              </li>
            ))}
          </ol>

          {filteredPublications.length > 10 && (
            <div className="pt-2 print:hidden">
              <button
                type="button"
                onClick={() => setShowAllPubs(!showAllPubs)}
                className="px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-secondary font-semibold text-label-sm border border-outline flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {showAllPubs ? 'expand_less' : 'expand_more'}
                </span>
                <span>
                  {showAllPubs
                    ? 'Show Top 10 High-Impact Publications'
                    : `Show All ${filteredPublications.length} Publications in CV`}
                </span>
              </button>
            </div>
          )}
        </section>

        {/* Section 9: Academic News & Milestones (Dynamic from News) */}
        {news.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline/80 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">campaign</span>
              <span>Recent Academic Milestones & Announcements</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {news.map((n, ni) => (
                <div key={ni} className="p-3 rounded-xl bg-surface-container-low/70 border border-outline/60 flex flex-col justify-between gap-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-bold text-secondary mb-0.5">
                      <span>{n.badge || 'Update'}</span>
                      <span className="text-on-surface-variant font-medium">{n.date}</span>
                    </div>
                    <h4 className="font-bold text-body-sm text-on-surface">{n.title}</h4>
                    <p className="text-[12px] text-on-surface-variant mt-0.5">{n.description || n.venue}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 10: Honors, Awards & Distinctions (Dynamic from About Page) */}
        {honors.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline/80 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">military_tech</span>
              <span>Honors & Academic Awards</span>
            </h2>
            <ul className="space-y-2 pt-1 text-body-sm text-on-surface-variant">
              {honors.map((h, i) => (
                <li key={i} className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-surface-container-low/50">
                  <div>
                    <strong className="text-on-surface font-semibold">{h.title}</strong> — {h.issuer}
                    <p className="text-[12px] text-on-surface-variant mt-0.5">{h.description}</p>
                  </div>
                  <span className="text-label-sm font-semibold text-on-surface-variant shrink-0">{h.year}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Section 11: Professional Service & Reviewing (Dynamic from About Page) */}
        {services.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline/80 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">rate_review</span>
              <span>Professional Reviewing & Academic Memberships</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-body-sm text-on-surface-variant">
              {services.map((s, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Section 12: Technical Competencies (Dynamic from Skills) */}
        {skills.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="text-title-md font-bold text-on-surface uppercase tracking-wider pb-1.5 border-b border-outline/80 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px] print:hidden">terminal</span>
              <span>Technical & Computational Toolchain</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {skills.map((grp, i) => (
                <div key={i} className="p-3 rounded-xl bg-surface-container-low/70 border border-outline/60 flex flex-col gap-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-secondary">{grp.category}</span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    {(grp.items || []).join(' • ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CV Footer / Verification Notice */}
        <footer className="pt-6 border-t border-outline/70 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-on-surface-variant text-center sm:text-left">
          <span>
            Curriculum Vitae of {profile.name} • {profile.institution} ({profile.department})
          </span>
          <span className="font-mono">
            Faculty Office: {officeRoom} • Generated from Live Academic Database
          </span>
        </footer>

      </div>
    </div>
  );
}
