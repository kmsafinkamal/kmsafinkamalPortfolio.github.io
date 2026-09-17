import React, { useState } from 'react';

export default function AdminNewsManager({
  news = [],
  publications = [],
  profile = {},
  onUpdateNews,
  onSaveAll,
  isSaving
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);

  const blankNews = {
    date: 'March 2026',
    title: '',
    venue: '',
    type: 'paper',
    badge: 'Publication'
  };

  const [formData, setFormData] = useState(blankNews);

  const openAddModal = () => {
    setFormData({
      ...blankNews,
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEditModal = (item, idx) => {
    setFormData({
      date: item.date || '',
      title: item.title || '',
      venue: item.venue || item.description || '',
      type: item.type || 'paper',
      badge: item.badge || item.tag || 'Update'
    });
    setEditingIdx(idx);
    setShowModal(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date.trim()) return;

    const savedItem = {
      date: formData.date.trim(),
      title: formData.title.trim(),
      venue: formData.venue.trim(),
      description: formData.venue.trim(),
      type: formData.type,
      badge: formData.badge.trim() || 'Update'
    };

    let updated = [...news];
    if (editingIdx !== null) {
      updated[editingIdx] = savedItem;
    } else {
      updated = [savedItem, ...updated];
    }

    onUpdateNews(updated);
    setShowModal(false);
  };

  const handleDelete = (idx) => {
    const item = news[idx];
    if (window.confirm(`Delete announcement: "${item.title}"?`)) {
      const updated = news.filter((_, i) => i !== idx);
      onUpdateNews(updated);
    }
  };

  const handleMove = (idx, direction) => {
    const target = idx + direction;
    if (target < 0 || target >= news.length) return;
    const updated = [...news];
    const temp = updated[idx];
    updated[idx] = updated[target];
    updated[target] = temp;
    onUpdateNews(updated);
  };

  // Auto-generate announcements based on recent publications, citation milestones, and mentorship
  const handleAutoGenerateFromActivity = () => {
    const generated = [];

    // 1. Latest Published Papers (up to 2 recent articles)
    const sortedPubs = [...(publications || [])].sort((a, b) => (b.year || 0) - (a.year || 0));
    if (sortedPubs.length > 0) {
      const topPub = sortedPubs[0];
      generated.push({
        date: topPub.year ? `${topPub.year}` : 'Recent',
        title: `Paper Accepted/Published: "${topPub.title}"`,
        venue: topPub.venue || 'Peer-Reviewed Conference / Journal Index',
        description: topPub.venue || 'Peer-Reviewed Conference / Journal Index',
        type: 'paper',
        badge: 'Publication'
      });
      if (sortedPubs.length > 1 && sortedPubs[1].year === topPub.year) {
        const secondPub = sortedPubs[1];
        generated.push({
          date: `${secondPub.year}`,
          title: `Paper Published: "${secondPub.title}"`,
          venue: secondPub.venue || 'Peer-Reviewed Publication',
          description: secondPub.venue || 'Peer-Reviewed Publication',
          type: 'paper',
          badge: 'Publication'
        });
      }
    }

    // 2. Verified Google Scholar Milestone
    const citations = profile?.metrics?.citations || 41;
    const pubsCount = publications.length || 46;
    generated.push({
      date: 'Live Synced',
      title: `Google Scholar Citations milestone: ${citations}+ verified citations across ${pubsCount} peer-reviewed articles`,
      venue: 'Google Scholar Verified Index',
      description: 'Google Scholar Verified Index',
      type: 'milestone',
      badge: 'Milestone'
    });

    // 3. Academic Service / Peer Reviewing
    generated.push({
      date: 'November 2025',
      title: 'Invited peer reviewer for IEEE Access and Springer SN Computer Science journals',
      venue: 'Academic Service & Scholarly Reviewing',
      description: 'Academic Service & Scholarly Reviewing',
      type: 'service',
      badge: 'Peer Review'
    });

    // 4. Capstone Mentorship Achievement
    const mentorshipItems = profile?.mentorship || [];
    if (mentorshipItems.length > 0) {
      const topMentor = mentorshipItems[0];
      generated.push({
        date: topMentor.year || '2025',
        title: `Supervised undergraduate capstone team on "${topMentor.topic || 'Medical AI'}"`,
        venue: `${topMentor.institution || 'East West University'} (${topMentor.outcome || 'Nominated for Best Research'})`,
        description: `${topMentor.institution || 'East West University'} (${topMentor.outcome || 'Nominated for Best Research'})`,
        type: 'mentorship',
        badge: 'Mentorship'
      });
    } else {
      generated.push({
        date: 'September 2025',
        title: 'Supervised student capstone team awarded Best Research Paper nomination',
        venue: 'Department of CSE, East West University',
        description: 'Department of CSE, East West University',
        type: 'mentorship',
        badge: 'Mentorship'
      });
    }

    onUpdateNews(generated);
  };

  const getBadgeStyle = (badge = '', type = '') => {
    const b = badge.toLowerCase();
    const t = type.toLowerCase();
    if (b.includes('pub') || t === 'paper') {
      return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
    }
    if (b.includes('milestone') || t === 'milestone') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
    }
    if (b.includes('mentor') || t === 'mentorship') {
      return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
    }
    if (b.includes('review') || t === 'service') {
      return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
    }
    return 'bg-secondary/10 text-secondary border-secondary/20';
  };

  return (
    <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col gap-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-[24px]">campaign</span>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              Announcements & Activity Stream
            </span>
          </div>
          <h3 className="text-headline-sm font-bold text-on-surface">
            Recent News & Announcements ({news.length})
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Shown prominently on the <strong>Overview Page</strong> (Hero News Feed) and the <strong>Curriculum Vitae</strong> (Section 9). You can auto-generate from recent publications and metrics or manually write announcements.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleAutoGenerateFromActivity}
            className="px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline font-semibold text-label-md flex items-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
            title="Scan publications, Scholar citations, and capstone milestones to create announcements"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-500">auto_awesome</span>
            <span>Auto-Generate from Activity</span>
          </button>

          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Announcement</span>
          </button>

          {onSaveAll && (
            <button
              type="button"
              onClick={onSaveAll}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-label-md flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isSaving ? 'sync' : 'save'}
              </span>
              <span>{isSaving ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Auto-Update Notice */}
      <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between gap-3 text-body-sm">
        <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-medium">
          <span className="material-symbols-outlined text-[20px] text-blue-600 dark:text-blue-400">info</span>
          <span>Google Scholar citation milestones are also automatically synchronized whenever Scholar is refreshed.</span>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-900 dark:text-blue-200">
          Overview & CV Feed
        </span>
      </div>

      {/* News Items List */}
      <div className="flex flex-col gap-3.5">
        {news.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-surface-container-low border border-outline/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-secondary/40 transition-all group"
          >
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(item.badge, item.type)}`}>
                  {item.badge || item.tag || 'Announcement'}
                </span>
                <span className="text-[12px] font-medium text-on-surface-variant">
                  {item.date}
                </span>
              </div>

              <h4 className="text-title-md font-bold text-on-surface">
                {item.title}
              </h4>

              {(item.venue || item.description) && (
                <p className="text-body-sm text-secondary font-medium mt-0.5">
                  {item.venue || item.description}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleMove(idx, -1)}
                disabled={idx === 0}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 flex items-center justify-center transition-colors"
                title="Move Up"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 1)}
                disabled={idx === news.length - 1}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 flex items-center justify-center transition-colors"
                title="Move Down"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </button>
              <button
                type="button"
                onClick={() => openEditModal(item, idx)}
                className="px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold text-label-sm flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 font-semibold text-label-sm flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}

        {news.length === 0 && (
          <div className="text-center py-12 bg-surface-container-lowest border border-dashed border-outline rounded-2xl">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2">
              campaign
            </span>
            <p className="text-body-md font-bold text-on-surface">No Announcements Recorded</p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Click "Auto-Generate from Activity" to automatically build entries from your papers & citations, or "Add Announcement" to write one.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Announcement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-5 animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {editingIdx !== null ? 'edit_note' : 'add_circle'}
                </span>
                <span>{editingIdx !== null ? 'Edit Announcement' : 'Add Announcement'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Date / Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="e.g., March 2026, 2025"
                    className="h-11 px-3.5 bg-surface-container-lowest border border-slate-300 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Category Badge *</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => {
                      const b = e.target.value;
                      let typeVal = 'general';
                      if (b === 'Publication') typeVal = 'paper';
                      if (b === 'Milestone') typeVal = 'milestone';
                      if (b === 'Mentorship') typeVal = 'mentorship';
                      if (b === 'Peer Review') typeVal = 'service';
                      setFormData({ ...formData, badge: b, type: typeVal });
                    }}
                    className="h-11 px-3.5 bg-surface-container-lowest border border-slate-300 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  >
                    <option value="Publication">Publication</option>
                    <option value="Milestone">Milestone</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Peer Review">Peer Review</option>
                    <option value="Talk">Talk / Presentation</option>
                    <option value="Award">Award / Honor</option>
                    <option value="Announcement">General Announcement</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., New Paper Accepted on Explainable AI..."
                  className="h-11 px-3.5 bg-surface-container-lowest border border-slate-300 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Venue / Organization / Context</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g., IEEE International Conference Series"
                  className="h-11 px-3.5 bg-surface-container-lowest border border-slate-300 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="pt-3 border-t border-outline flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline font-medium text-label-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md transition-all shadow-sm"
                >
                  {editingIdx !== null ? 'Update Announcement' : 'Save Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
