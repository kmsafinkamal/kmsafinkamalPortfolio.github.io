import React from 'react';

export default function TeachingView({ profile = {}, onNavigate = () => {} }) {
  const teachingInfo = profile?.teachingInfo || {};
  const courses = profile?.teaching || [];
  const mentorship = profile?.mentorship || [];

  const pageTitle = teachingInfo.pageTitle || 'Teaching & Academic Mentorship';
  const departmentEyebrow = teachingInfo.departmentEyebrow || profile?.department || 'Department of Computer Science & Engineering';
  const tagline = teachingInfo.tagline || 'Lecturer at East West University, educating undergraduate engineers in deep learning, algorithms, pattern recognition, and supervising peer-reviewed capstone research.';

  const campusName = teachingInfo.campusName || profile?.institution || 'East West Univ';
  const campusLocation = teachingInfo.campusLocation || profile?.location || 'Aftabnagar, Dhaka';
  const officeRoom = teachingInfo.officeRoom || profile?.officeRoom || profile?.room || 'Room CSE-512';
  const officeNote = teachingInfo.officeNote || 'Open Student Advising';

  const actionButtonText = teachingInfo.actionButtonText || 'Schedule Office Hours';
  const actionButtonLink = teachingInfo.actionButtonLink || '';

  const philosophyTitle = teachingInfo.philosophyTitle || 'Teaching Philosophy: Rigorous Theory with Reproducible Empirical Code';
  const philosophyText = teachingInfo.philosophyText || 'My teaching pedagogy bridges mathematical rigor with hands-on computational reproducibility. Whether deriving backpropagation gradients on the whiteboard or profiling PyTorch GPU tensors, students are trained not merely as tool consumers, but as rigorous researchers capable of questioning architectures, interpreting loss landscapes, and deploying models with ethical awareness.';

  const coursesHeading = teachingInfo.coursesHeading || 'University Courses Taught';
  const coursesEyebrow = teachingInfo.coursesEyebrow || 'Curricula & Instruction';

  const mentorshipHeading = teachingInfo.mentorshipHeading || 'Supervised Undergraduate Capstone & Thesis Groups';
  const mentorshipEyebrow = teachingInfo.mentorshipEyebrow || 'Student Research Leadership';

  const normalizeBookingLink = (link) => {
    if (!link) return '';
    const trimmed = link.trim();
    if (!trimmed) return '';
    // Internal app routes
    if (/^(overview|research|publications|projects|teaching|cv|about|contact|admin)$/i.test(trimmed)) {
      return trimmed.toLowerCase();
    }
    // Explicit protocols
    if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
      return trimmed;
    }
    // Web address without protocol (e.g., calendly.com/user, calendar.app.google/...)
    return `https://${trimmed}`;
  };

  const isExternalTarget = (target) => {
    return target && (target.startsWith('http://') || target.startsWith('https://') || target.startsWith('mailto:') || target.startsWith('tel:'));
  };

  const handleActionButtonClick = () => {
    const target = normalizeBookingLink(actionButtonLink);
    if (!target) {
      onNavigate('contact');
      return;
    }
    if (isExternalTarget(target)) {
      window.open(target, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate(target);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-12">
      {/* Faculty Masthead */}
      <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-secondary text-[26px]">school</span>
              <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
                {departmentEyebrow}
              </span>
            </div>
            <h1 className="text-headline-md sm:text-headline-lg font-bold text-on-surface">
              {pageTitle}
            </h1>
            <p className="text-body-md text-on-surface-variant mt-1.5 max-w-3xl leading-relaxed whitespace-pre-line">
              {tagline}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleActionButtonClick}
              className="px-4 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary-dark font-semibold text-label-md transition-all shadow-sm flex items-center gap-1.5 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExternalTarget(normalizeBookingLink(actionButtonLink)) ? 'open_in_new' : 'schedule'}
              </span>
              <span>{actionButtonText}</span>
            </button>
          </div>
        </div>

        {/* Teaching Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-outline/50">
          <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-outline/70 min-w-0">
            <span className="text-label-sm uppercase font-bold text-secondary block">Courses Instructed</span>
            <span className="text-headline-sm font-bold text-on-surface mt-0.5 block">{courses.length} Curricula</span>
            <span className="text-[11px] text-on-surface-variant">Theory & Software Labs</span>
          </div>

          <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-outline/70 min-w-0">
            <span className="text-label-sm uppercase font-bold text-secondary block">Mentored Capstones</span>
            <span className="text-headline-sm font-bold text-on-surface mt-0.5 block">{mentorship.length} Groups</span>
            <span className="text-[11px] text-on-surface-variant">Published in IEEE & Springer</span>
          </div>

          <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-outline/70 min-w-0">
            <span className="text-label-sm uppercase font-bold text-secondary block">University Campus</span>
            <span className="text-headline-sm font-bold text-on-surface mt-0.5 block">{campusName}</span>
            <span className="text-[11px] text-on-surface-variant">{campusLocation}</span>
          </div>

          <div className="bg-surface-container-low/70 p-3.5 rounded-xl border border-outline/70 min-w-0">
            <span className="text-label-sm uppercase font-bold text-secondary block">Office Location</span>
            <span className="text-headline-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 block">{officeRoom}</span>
            <span className="text-[11px] text-on-surface-variant">{officeNote}</span>
          </div>
        </div>
      </div>

      {/* Teaching Philosophy Callout */}
      <div className="bg-surface-container-low border border-outline rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[26px]">psychology</span>
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-title-md font-bold text-on-surface">
            {philosophyTitle}
          </h3>
          <p className="text-body-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
            {philosophyText}
          </p>
        </div>
      </div>

      {/* Courses Portfolio */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              {coursesEyebrow}
            </span>
            <h2 className="text-headline-md font-bold text-on-surface">
              {coursesHeading}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course) => (
            <div
              key={course.code}
              className="bg-surface-container-lowest border border-outline rounded-2xl p-6 shadow-card flex flex-col justify-between gap-4 hover:border-secondary/40 transition-all group"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-secondary text-white text-[11px] font-mono font-bold tracking-wider mb-1">
                      {course.code}
                    </span>
                    <h3 className="text-title-md font-bold text-on-surface group-hover:text-secondary transition-colors">
                      {course.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold shrink-0">
                    {course.term}
                  </span>
                </div>

                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  {course.description}
                </p>

                {/* Topics Covered */}
                {course.topics && course.topics.length > 0 && (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                      Syllabus Highlights
                    </span>
                    <ul className="space-y-1 text-body-sm text-on-surface-variant">
                      {course.topics.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[13px]">
                          <span className="material-symbols-outlined text-secondary text-[15px] shrink-0 mt-0.5">
                            arrow_right
                          </span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Course Footer / Office Hours & Room */}
              <div className="pt-3 border-t border-outline/50 flex flex-col gap-2 text-label-sm text-on-surface-variant">
                <div className="flex items-center justify-between gap-2 flex-wrap text-[12px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-secondary font-medium">
                      <span className="material-symbols-outlined text-[15px]">timer</span>
                      <span>{course.officeHours}</span>
                    </span>
                    {course.officeHoursLink && (
                      <a
                        href={course.officeHoursLink.startsWith('http') ? course.officeHoursLink : `https://${course.officeHoursLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary hover:underline px-2 py-0.5 rounded-md bg-secondary/10 hover:bg-secondary/20 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[13px]">calendar_month</span>
                        <span>Book Slot</span>
                      </a>
                    )}
                  </div>
                  <span className="font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                    {course.room}
                  </span>
                </div>

                {course.link && (
                  <div className="pt-1 flex items-center justify-end">
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-secondary font-semibold hover:underline"
                    >
                      <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      <span>Course Portal / Syllabus Materials</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="col-span-full text-center py-12 bg-surface-container-lowest border border-dashed border-outline rounded-2xl">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2">
                school
              </span>
              <p className="text-body-md font-bold text-on-surface">No courses currently listed</p>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Add courses from the Teaching Manager in your Admin Panel.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Undergraduate Thesis & Capstone Supervision */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              {mentorshipEyebrow}
            </span>
            <h2 className="text-headline-md font-bold text-on-surface">
              {mentorshipHeading}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mentorship.map((m, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest border border-outline rounded-2xl p-5 shadow-card flex flex-col justify-between gap-3 hover:border-secondary/40 transition-all"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-surface-container text-secondary text-[11px] font-bold uppercase">
                    {m.domain}
                  </span>
                  <span className="text-[11px] text-on-surface-variant font-medium">
                    {m.year}
                  </span>
                </div>
                <h4 className="text-body-md font-bold text-on-surface leading-snug">
                  {m.title}
                </h4>
                <p className="text-[12px] text-on-surface-variant">
                  Supervised: <strong className="text-on-surface font-semibold">{m.students}</strong>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="pt-2 border-t border-outline/50 flex items-start gap-1.5 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                    workspace_premium
                  </span>
                  <span>{m.outcome}</span>
                </div>

                {m.link && (
                  <a
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-secondary font-semibold hover:underline self-end"
                  >
                    <span className="material-symbols-outlined text-[13px]">description</span>
                    <span>View Publication</span>
                  </a>
                )}
              </div>
            </div>
          ))}

          {mentorship.length === 0 && (
            <div className="col-span-full text-center py-12 bg-surface-container-lowest border border-dashed border-outline rounded-2xl">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2">
                diversity_3
              </span>
              <p className="text-body-md font-bold text-on-surface">No capstone records listed</p>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Add student thesis records from the Teaching Manager in your Admin Panel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
