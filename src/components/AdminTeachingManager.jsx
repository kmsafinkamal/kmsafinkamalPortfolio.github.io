import React, { useState, useEffect } from 'react';

export default function AdminTeachingManager({
  teaching = [],
  mentorship = [],
  teachingInfo = {},
  officeRoom = 'Room CSE-512',
  onUpdateTeaching,
  onUpdateMentorship,
  onUpdateTeachingInfo,
  onUpdateOfficeRoom,
  onSaveAll,
  isSaving
}) {
  const [subTab, setSubTab] = useState('page-content'); // 'page-content' | 'courses' | 'mentorship'

  // Editable Teaching Info state
  const defaultInfo = {
    pageTitle: 'Teaching & Academic Mentorship',
    departmentEyebrow: 'Department of Computer Science & Engineering',
    tagline: 'Lecturer at East West University, educating undergraduate engineers in deep learning, algorithms, pattern recognition, and supervising peer-reviewed capstone research.',
    campusName: 'East West Univ',
    campusLocation: 'Aftabnagar, Dhaka',
    officeRoom: officeRoom || 'Room CSE-512',
    officeNote: 'Open Student Advising',
    actionButtonText: 'Schedule Office Hours',
    actionButtonLink: '',
    philosophyTitle: 'Teaching Philosophy: Rigorous Theory with Reproducible Empirical Code',
    philosophyText: 'My teaching pedagogy bridges mathematical rigor with hands-on computational reproducibility. Whether deriving backpropagation gradients on the whiteboard or profiling PyTorch GPU tensors, students are trained not merely as tool consumers, but as rigorous researchers capable of questioning architectures, interpreting loss landscapes, and deploying models with ethical awareness.',
    coursesHeading: 'University Courses Taught',
    coursesEyebrow: 'Curricula & Instruction',
    mentorshipHeading: 'Supervised Undergraduate Capstone & Thesis Groups',
    mentorshipEyebrow: 'Student Research Leadership'
  };

  const [infoForm, setInfoForm] = useState({
    ...defaultInfo,
    ...teachingInfo,
    officeRoom: teachingInfo?.officeRoom || officeRoom || 'Room CSE-512'
  });

  const [isSavedInfo, setIsSavedInfo] = useState(false);

  useEffect(() => {
    setInfoForm({
      ...defaultInfo,
      ...teachingInfo,
      officeRoom: teachingInfo?.officeRoom || officeRoom || 'Room CSE-512'
    });
  }, [teachingInfo, officeRoom]);

  const handleSaveInfoForm = (e) => {
    if (e) e.preventDefault();
    if (onUpdateTeachingInfo) {
      onUpdateTeachingInfo(infoForm);
      if (onUpdateOfficeRoom && infoForm.officeRoom) {
        onUpdateOfficeRoom(infoForm.officeRoom);
      }
      setIsSavedInfo(true);
      setTimeout(() => setIsSavedInfo(false), 2500);
    }
  };

  // Course Modal State
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseIdx, setEditingCourseIdx] = useState(null);
  const blankCourse = {
    code: '',
    title: '',
    term: 'Spring & Fall',
    level: 'Undergraduate (Final Year)',
    role: 'Course Instructor & Lab Coordinator',
    description: '',
    room: infoForm.officeRoom || 'Room CSE-512 / Software Lab 3',
    officeHours: `Sun & Tue: 2:00 PM - 4:30 PM (${infoForm.officeRoom || 'Room CSE-512'})`,
    topics: [],
    topicsInput: '',
    link: ''
  };
  const [courseForm, setCourseForm] = useState(blankCourse);

  // Mentorship Modal State
  const [showMentorshipModal, setShowMentorshipModal] = useState(false);
  const [editingMentorshipIdx, setEditingMentorshipIdx] = useState(null);
  const blankMentorship = {
    title: '',
    students: 'Undergraduate Research Group (East West University)',
    outcome: 'Accepted for publication in IEEE / Springer',
    year: new Date().getFullYear().toString(),
    domain: 'Biomedical AI',
    link: ''
  };
  const [mentorshipForm, setMentorshipForm] = useState(blankMentorship);

  // Course Handlers
  const openAddCourse = () => {
    setCourseForm({ ...blankCourse, room: infoForm.officeRoom || 'Room CSE-512' });
    setEditingCourseIdx(null);
    setShowCourseModal(true);
  };

  const openEditCourse = (course, idx) => {
    setCourseForm({
      ...course,
      topicsInput: (course.topics || []).join('\n'),
      link: course.link || ''
    });
    setEditingCourseIdx(idx);
    setShowCourseModal(true);
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    if (!courseForm.code.trim() || !courseForm.title.trim()) return;

    const parsedTopics = courseForm.topicsInput
      ? courseForm.topicsInput.split('\n').map((t) => t.trim()).filter(Boolean)
      : [];

    const saved = {
      code: courseForm.code.trim().toUpperCase(),
      title: courseForm.title.trim(),
      term: courseForm.term.trim(),
      level: courseForm.level.trim(),
      role: courseForm.role.trim(),
      description: courseForm.description.trim(),
      room: courseForm.room.trim(),
      officeHours: courseForm.officeHours.trim(),
      topics: parsedTopics,
      link: courseForm.link ? courseForm.link.trim() : ''
    };

    let updated;
    if (editingCourseIdx !== null) {
      updated = [...teaching];
      updated[editingCourseIdx] = saved;
    } else {
      updated = [...teaching, saved];
    }

    onUpdateTeaching(updated);
    setShowCourseModal(false);
  };

  const handleDeleteCourse = (idx) => {
    const c = teaching[idx];
    if (window.confirm(`Are you sure you want to delete course ${c.code} (${c.title})?`)) {
      const updated = teaching.filter((_, i) => i !== idx);
      onUpdateTeaching(updated);
    }
  };

  const handleMoveCourse = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= teaching.length) return;
    const updated = [...teaching];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onUpdateTeaching(updated);
  };

  // Mentorship Handlers
  const openAddMentorship = () => {
    setMentorshipForm({ ...blankMentorship });
    setEditingMentorshipIdx(null);
    setShowMentorshipModal(true);
  };

  const openEditMentorship = (item, idx) => {
    setMentorshipForm({ ...item, link: item.link || '' });
    setEditingMentorshipIdx(idx);
    setShowMentorshipModal(true);
  };

  const handleSaveMentorship = (e) => {
    e.preventDefault();
    if (!mentorshipForm.title.trim()) return;

    const saved = {
      title: mentorshipForm.title.trim(),
      students: mentorshipForm.students.trim(),
      outcome: mentorshipForm.outcome.trim(),
      year: mentorshipForm.year.trim(),
      domain: mentorshipForm.domain.trim(),
      link: mentorshipForm.link ? mentorshipForm.link.trim() : ''
    };

    let updated;
    if (editingMentorshipIdx !== null) {
      updated = [...mentorship];
      updated[editingMentorshipIdx] = saved;
    } else {
      updated = [...mentorship, saved];
    }

    onUpdateMentorship(updated);
    setShowMentorshipModal(false);
  };

  const handleDeleteMentorship = (idx) => {
    const m = mentorship[idx];
    if (window.confirm(`Are you sure you want to delete capstone "${m.title}"?`)) {
      const updated = mentorship.filter((_, i) => i !== idx);
      onUpdateMentorship(updated);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-[22px]">school</span>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              Academic Curricula, Pedagogy & Mentorship
            </span>
          </div>
          <h3 className="text-headline-sm font-bold text-on-surface">
            Teaching Page Administration
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Configure every detail of your public Teaching page: masthead titles, campus & room locations, teaching philosophy, university syllabi, and student capstones.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {subTab === 'page-content' && (
            <button
              type="button"
              onClick={handleSaveInfoForm}
              className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSavedInfo ? 'check_circle' : 'save'}
              </span>
              <span>{isSavedInfo ? 'Page Info Saved!' : 'Save Page Info'}</span>
            </button>
          )}

          {subTab === 'courses' && (
            <button
              type="button"
              onClick={openAddCourse}
              className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Add Course</span>
            </button>
          )}

          {subTab === 'mentorship' && (
            <button
              type="button"
              onClick={openAddMentorship}
              className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">group_add</span>
              <span>Add Capstone</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Section Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-outline pb-2 flex-wrap">
        <button
          type="button"
          onClick={() => setSubTab('page-content')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-label-md font-semibold transition-all ${
            subTab === 'page-content'
              ? 'bg-secondary text-white shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          <span>Page Overview, Campus & Philosophy</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('courses')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-label-md font-semibold transition-all ${
            subTab === 'courses'
              ? 'bg-secondary text-white shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          <span>University Courses ({teaching.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('mentorship')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-label-md font-semibold transition-all ${
            subTab === 'mentorship'
              ? 'bg-secondary text-white shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-outline'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">diversity_3</span>
          <span>Capstone Mentorship ({mentorship.length})</span>
        </button>
      </div>

      {/* ---------------- SUBTAB 1: PAGE OVERVIEW & PHILOSOPHY ---------------- */}
      {subTab === 'page-content' && (
        <form onSubmit={handleSaveInfoForm} className="flex flex-col gap-6">
          {/* Card 1: Hero & Masthead Settings */}
          <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 shadow-card flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">badge</span>
                <h4 className="text-title-md font-bold text-on-surface">
                  Masthead Header & Tagline
                </h4>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                Public Header
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Page Title</label>
                <input
                  type="text"
                  required
                  value={infoForm.pageTitle}
                  onChange={(e) => setInfoForm({ ...infoForm, pageTitle: e.target.value })}
                  placeholder="e.g., Teaching & Academic Mentorship"
                  className="h-11 px-3.5 bg-surface-container-low border border-outline rounded-xl text-body-md text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Department Eyebrow Subtitle</label>
                <input
                  type="text"
                  value={infoForm.departmentEyebrow}
                  onChange={(e) => setInfoForm({ ...infoForm, departmentEyebrow: e.target.value })}
                  placeholder="e.g., Department of Computer Science & Engineering"
                  className="h-11 px-3.5 bg-surface-container-low border border-outline rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-sm font-semibold text-on-surface">Overview / Tagline Summary</label>
              <textarea
                rows={3}
                value={infoForm.tagline}
                onChange={(e) => setInfoForm({ ...infoForm, tagline: e.target.value })}
                placeholder="Overview of your faculty instruction role and student supervision..."
                className="p-3.5 bg-surface-container-low border border-outline rounded-xl text-body-sm text-on-surface leading-relaxed focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline/50">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Action Button Text</label>
                <input
                  type="text"
                  value={infoForm.actionButtonText}
                  onChange={(e) => setInfoForm({ ...infoForm, actionButtonText: e.target.value })}
                  placeholder="e.g., Schedule Office Hours"
                  className="h-11 px-3.5 bg-surface-container-low border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Action Button Target Link (Optional)</label>
                <input
                  type="text"
                  value={infoForm.actionButtonLink}
                  onChange={(e) => setInfoForm({ ...infoForm, actionButtonLink: e.target.value })}
                  placeholder="Leave empty for Contact page, or add Calendly / booking URL"
                  className="h-11 px-3.5 bg-surface-container-low border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Campus, Room & Office Location Details */}
          <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 shadow-card flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">location_on</span>
                <h4 className="text-title-md font-bold text-on-surface">
                  Campus & Office Advising Location
                </h4>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                Live Public Badges
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">University Campus Name</label>
                <input
                  type="text"
                  value={infoForm.campusName}
                  onChange={(e) => setInfoForm({ ...infoForm, campusName: e.target.value })}
                  placeholder="e.g., East West Univ"
                  className="h-11 px-3.5 bg-surface-container-low border border-outline rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Campus Geographic Location</label>
                <input
                  type="text"
                  value={infoForm.campusLocation}
                  onChange={(e) => setInfoForm({ ...infoForm, campusLocation: e.target.value })}
                  placeholder="e.g., Aftabnagar, Dhaka"
                  className="h-11 px-3.5 bg-surface-container-low border border-outline rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Faculty Office / Room Number *
                </label>
                <input
                  type="text"
                  required
                  value={infoForm.officeRoom}
                  onChange={(e) => setInfoForm({ ...infoForm, officeRoom: e.target.value })}
                  placeholder="e.g., Room CSE-512"
                  className="h-11 px-3.5 bg-surface-container-low border border-outline rounded-xl text-body-md text-on-surface font-bold focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
                <span className="text-[11px] text-on-surface-variant">
                  Automatically syncs with the Curriculum Vitae header and course schedules.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Advising Status Subtitle
                </label>
                <input
                  type="text"
                  value={infoForm.officeNote}
                  onChange={(e) => setInfoForm({ ...infoForm, officeNote: e.target.value })}
                  placeholder="e.g., Open Student Advising"
                  className="h-11 px-3.5 bg-surface-container-low border border-outline rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Teaching Philosophy Statement */}
          <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 shadow-card flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">psychology</span>
                <h4 className="text-title-md font-bold text-on-surface">
                  Teaching Philosophy Callout
                </h4>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-sm font-semibold text-on-surface">Philosophy Callout Title</label>
              <input
                type="text"
                value={infoForm.philosophyTitle}
                onChange={(e) => setInfoForm({ ...infoForm, philosophyTitle: e.target.value })}
                placeholder="e.g., Teaching Philosophy: Rigorous Theory with Reproducible Empirical Code"
                className="h-11 px-3.5 bg-surface-container-low border border-outline rounded-xl text-body-md text-on-surface font-semibold focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-label-sm font-semibold text-on-surface">
                Pedagogy & Philosophy Essay Statement
              </label>
              <textarea
                rows={5}
                value={infoForm.philosophyText}
                onChange={(e) => setInfoForm({ ...infoForm, philosophyText: e.target.value })}
                placeholder="Detail your pedagogical principles, active classroom strategies, and hands-on laboratory expectations..."
                className="p-3.5 bg-surface-container-low border border-outline rounded-xl text-body-sm text-on-surface leading-relaxed focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
              />
            </div>
          </div>

          {/* Card 4: Section Headings & Eyebrows */}
          <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 shadow-card flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">format_list_bulleted</span>
                <h4 className="text-title-md font-bold text-on-surface">
                  Section Headings & Custom Labels
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Courses Section Eyebrow</label>
                <input
                  type="text"
                  value={infoForm.coursesEyebrow}
                  onChange={(e) => setInfoForm({ ...infoForm, coursesEyebrow: e.target.value })}
                  placeholder="e.g., Curricula & Instruction"
                  className="h-10 px-3 bg-surface-container-low border border-outline rounded-xl text-body-sm text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Courses Section Title</label>
                <input
                  type="text"
                  value={infoForm.coursesHeading}
                  onChange={(e) => setInfoForm({ ...infoForm, coursesHeading: e.target.value })}
                  placeholder="e.g., University Courses Taught"
                  className="h-10 px-3 bg-surface-container-low border border-outline rounded-xl text-body-sm text-on-surface font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Mentorship Section Eyebrow</label>
                <input
                  type="text"
                  value={infoForm.mentorshipEyebrow}
                  onChange={(e) => setInfoForm({ ...infoForm, mentorshipEyebrow: e.target.value })}
                  placeholder="e.g., Student Research Leadership"
                  className="h-10 px-3 bg-surface-container-low border border-outline rounded-xl text-body-sm text-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Mentorship Section Title</label>
                <input
                  type="text"
                  value={infoForm.mentorshipHeading}
                  onChange={(e) => setInfoForm({ ...infoForm, mentorshipHeading: e.target.value })}
                  placeholder="e.g., Supervised Undergraduate Capstone & Thesis Groups"
                  className="h-10 px-3 bg-surface-container-low border border-outline rounded-xl text-body-sm text-on-surface font-semibold"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-outline flex items-center justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSavedInfo ? 'check_circle' : 'save'}
                </span>
                <span>{isSavedInfo ? 'Teaching Info Saved to Database!' : 'Save All Teaching Page Settings'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ---------------- SUBTAB 2: COURSES ---------------- */}
      {subTab === 'courses' && (
        <div className="flex flex-col gap-4">
          {teaching.map((course, idx) => (
            <div
              key={course.code || idx}
              className="bg-surface-container-lowest border border-outline rounded-2xl p-5 sm:p-6 shadow-card flex flex-col gap-4 hover:border-secondary/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono px-2.5 py-0.5 rounded-md bg-secondary/10 text-secondary text-label-sm font-bold border border-secondary/20">
                      {course.code}
                    </span>
                    <span className="text-[12px] font-semibold text-on-surface-variant px-2 py-0.5 rounded-full bg-surface-container">
                      {course.level}
                    </span>
                    <span className="text-[12px] font-semibold text-on-surface-variant px-2 py-0.5 rounded-full bg-surface-container">
                      {course.term}
                    </span>
                  </div>

                  <h4 className="text-title-md sm:text-headline-sm font-bold text-on-surface mt-1">
                    {course.title}
                  </h4>
                  <p className="text-body-sm text-secondary font-medium">
                    {course.role} • {course.room}
                  </p>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed mt-1">
                    {course.description}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5 shrink-0 self-start">
                  <button
                    type="button"
                    onClick={() => handleMoveCourse(idx, -1)}
                    disabled={idx === 0}
                    className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant disabled:opacity-30 flex items-center justify-center transition-colors"
                    title="Move Up"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveCourse(idx, 1)}
                    disabled={idx === teaching.length - 1}
                    className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant disabled:opacity-30 flex items-center justify-center transition-colors"
                    title="Move Down"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditCourse(course, idx)}
                    className="px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold text-label-sm flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(idx)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 font-semibold text-label-sm flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Course Topics & Office Hours Footer */}
              <div className="pt-3 border-t border-outline/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-body-sm">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-on-surface-variant">Key Topics:</span>
                  {(course.topics || []).slice(0, 3).map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px]"
                    >
                      {t}
                    </span>
                  ))}
                  {(course.topics || []).length > 3 && (
                    <span className="text-[11px] text-on-surface-variant font-medium">
                      +{course.topics.length - 3} more
                    </span>
                  )}
                </div>

                <div className="text-[12px] text-on-surface-variant flex items-center gap-3">
                  <span className="flex items-center gap-1 text-secondary font-medium">
                    <span className="material-symbols-outlined text-[15px]">timer</span>
                    <span>{course.officeHours}</span>
                  </span>
                  <span className="font-mono text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                    {course.room}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {teaching.length === 0 && (
            <div className="text-center py-12 bg-surface-container-lowest border border-dashed border-outline rounded-2xl">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2">
                school
              </span>
              <p className="text-body-md font-bold text-on-surface">No courses configured</p>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Click "Add Course" to create university curricula listings.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---------------- SUBTAB 3: MENTORSHIP ---------------- */}
      {subTab === 'mentorship' && (
        <div className="flex flex-col gap-4">
          {mentorship.map((item, idx) => (
            <div
              key={idx}
              className="bg-surface-container-lowest border border-outline rounded-2xl p-5 sm:p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-secondary/40 transition-all"
            >
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-secondary/10 text-secondary text-label-sm font-bold">
                    {item.domain}
                  </span>
                  <span className="text-[12px] font-semibold text-on-surface-variant px-2 py-0.5 rounded-full bg-surface-container">
                    Year: {item.year}
                  </span>
                </div>

                <h4 className="text-title-md font-bold text-on-surface mt-0.5">
                  {item.title}
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  Supervised: <strong className="text-on-surface">{item.students}</strong>
                </p>
                <div className="flex items-center gap-1.5 text-body-sm text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                  <span>{item.outcome}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => openEditMentorship(item, idx)}
                  className="px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold text-label-sm flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteMentorship(idx)}
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 font-semibold text-label-sm flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}

          {mentorship.length === 0 && (
            <div className="text-center py-12 bg-surface-container-lowest border border-dashed border-outline rounded-2xl">
              <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2">
                diversity_3
              </span>
              <p className="text-body-md font-bold text-on-surface">No mentorship records</p>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Click "Add Capstone" to record supervised student theses.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-surface-container-lowest border border-outline rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-5 animate-slideUp my-8">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {editingCourseIdx !== null ? 'edit_note' : 'add_circle'}
                </span>
                <span>{editingCourseIdx !== null ? 'Edit University Course' : 'Create New Course'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCourseModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Course Code *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.code}
                    onChange={(e) => setCourseForm({ ...courseForm, code: e.target.value })}
                    placeholder="e.g., CSE 425"
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-md text-on-surface uppercase focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    placeholder="e.g., Neural Networks & Deep Learning"
                    className="h-11 px-4 bg-surface-container-lowest border border-outline rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Academic Term</label>
                  <input
                    type="text"
                    value={courseForm.term}
                    onChange={(e) => setCourseForm({ ...courseForm, term: e.target.value })}
                    placeholder="e.g., Spring & Fall"
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Target Student Level</label>
                  <input
                    type="text"
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    placeholder="e.g., Undergraduate (Final Year)"
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Instructor Role</label>
                  <input
                    type="text"
                    value={courseForm.role}
                    onChange={(e) => setCourseForm({ ...courseForm, role: e.target.value })}
                    placeholder="e.g., Course Instructor & Lab Coordinator"
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Room / Classroom / Lab</label>
                  <input
                    type="text"
                    value={courseForm.room}
                    onChange={(e) => setCourseForm({ ...courseForm, room: e.target.value })}
                    placeholder="e.g., Room CSE-512 / Software Lab 3"
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Weekly Office Hours</label>
                  <input
                    type="text"
                    value={courseForm.officeHours}
                    onChange={(e) => setCourseForm({ ...courseForm, officeHours: e.target.value })}
                    placeholder="e.g., Sun & Tue: 2:00 PM - 4:30 PM"
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Course Portal / Syllabus Link (Optional)</label>
                <input
                  type="text"
                  value={courseForm.link}
                  onChange={(e) => setCourseForm({ ...courseForm, link: e.target.value })}
                  placeholder="e.g., https://ewubd.edu/cse425 or link to syllabus PDF"
                  className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Description</label>
                <textarea
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Syllabus overview, theoretical depth, and laboratory expectations..."
                  className="p-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all leading-relaxed"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Syllabus Topics (One per line)
                </label>
                <textarea
                  rows={3}
                  value={courseForm.topicsInput}
                  onChange={(e) => setCourseForm({ ...courseForm, topicsInput: e.target.value })}
                  placeholder="Optimization Foundations & Loss Surfaces&#10;Convolutional Networks (ResNet, DenseNet)&#10;Recurrent Sequences (LSTM)&#10;Explainable AI & Attribution"
                  className="p-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-outline flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline font-medium text-label-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md transition-all shadow-sm"
                >
                  {editingCourseIdx !== null ? 'Update Course' : 'Add Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Mentorship Modal */}
      {showMentorshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-surface-container-lowest border border-outline rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-5 animate-slideUp my-8">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">diversity_3</span>
                <span>{editingMentorshipIdx !== null ? 'Edit Mentorship Record' : 'Record Capstone Advising'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMentorshipModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveMentorship} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Capstone Project Title *</label>
                <input
                  type="text"
                  required
                  value={mentorshipForm.title}
                  onChange={(e) => setMentorshipForm({ ...mentorshipForm, title: e.target.value })}
                  placeholder="e.g., Automated Acute Lymphoblastic Leukemia Detection"
                  className="h-11 px-4 bg-surface-container-lowest border border-outline rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Research Domain</label>
                  <input
                    type="text"
                    value={mentorshipForm.domain}
                    onChange={(e) => setMentorshipForm({ ...mentorshipForm, domain: e.target.value })}
                    placeholder="e.g., Biomedical AI"
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Year / Cohort</label>
                  <input
                    type="text"
                    value={mentorshipForm.year}
                    onChange={(e) => setMentorshipForm({ ...mentorshipForm, year: e.target.value })}
                    placeholder="e.g., 2024"
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Student Team / Group</label>
                <input
                  type="text"
                  value={mentorshipForm.students}
                  onChange={(e) => setMentorshipForm({ ...mentorshipForm, students: e.target.value })}
                  placeholder="e.g., Undergraduate Research Group (East West University)"
                  className="h-11 px-4 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Outcome & Publication Distinction</label>
                <input
                  type="text"
                  value={mentorshipForm.outcome}
                  onChange={(e) => setMentorshipForm({ ...mentorshipForm, outcome: e.target.value })}
                  placeholder="e.g., Accepted for publication in IEEE ICACCM & Best Capstone Award"
                  className="h-11 px-4 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Paper / Publication Link (Optional)</label>
                <input
                  type="text"
                  value={mentorshipForm.link}
                  onChange={(e) => setMentorshipForm({ ...mentorshipForm, link: e.target.value })}
                  placeholder="e.g., DOI link or IEEE Xplore link"
                  className="h-11 px-4 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="pt-3 border-t border-outline flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowMentorshipModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline font-medium text-label-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md transition-all shadow-sm"
                >
                  {editingMentorshipIdx !== null ? 'Update Record' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
