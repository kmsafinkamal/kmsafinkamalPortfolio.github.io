import React, { useState } from 'react';

export default function AdminHonorsManager({
  honors = [],
  onUpdateHonors,
  onSaveAll,
  isSaving
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingIdx, setEditingIdx] = useState(null);

  const blankHonor = {
    title: '',
    issuer: '',
    year: '',
    description: ''
  };

  const [formData, setFormData] = useState(blankHonor);

  const openAddModal = () => {
    setFormData({ ...blankHonor, year: new Date().getFullYear().toString() });
    setEditingIdx(null);
    setShowModal(true);
  };

  const openEditModal = (honor, idx) => {
    setFormData({
      title: honor.title || '',
      issuer: honor.issuer || '',
      year: honor.year || '',
      description: honor.description || ''
    });
    setEditingIdx(idx);
    setShowModal(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuer.trim() || !formData.year.trim()) {
      return;
    }

    const savedItem = {
      title: formData.title.trim(),
      issuer: formData.issuer.trim(),
      year: formData.year.trim(),
      description: formData.description.trim()
    };

    let updated = [...honors];
    if (editingIdx !== null) {
      updated[editingIdx] = savedItem;
    } else {
      updated = [savedItem, ...updated];
    }

    onUpdateHonors(updated);
    setShowModal(false);
  };

  const handleDelete = (idx) => {
    const item = honors[idx];
    if (window.confirm(`Are you sure you want to delete honor: "${item.title}"?`)) {
      const updated = honors.filter((_, i) => i !== idx);
      onUpdateHonors(updated);
    }
  };

  const handleMove = (idx, direction) => {
    const target = idx + direction;
    if (target < 0 || target >= honors.length) return;
    const updated = [...honors];
    const temp = updated[idx];
    updated[idx] = updated[target];
    updated[target] = temp;
    onUpdateHonors(updated);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col gap-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-[24px]">military_tech</span>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              Distinctions & Recognitions
            </span>
          </div>
          <h3 className="text-headline-sm font-bold text-on-surface">
            Honors & Academic Awards ({honors.length})
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Manage your faculty awards, research accolades, and academic distinctions. These are synchronized in real-time across the <strong>About page</strong> and the <strong>Curriculum Vitae (CV)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add Honor / Award</span>
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

      {/* Sync Status Banner */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between gap-3 text-body-sm">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium">
          <span className="material-symbols-outlined text-[20px] text-amber-600 dark:text-amber-400">sync_alt</span>
          <span>CV & About Page Synchronization Active — changes made here immediately appear on both pages.</span>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-800 dark:text-amber-200">
          profile.honors
        </span>
      </div>

      {/* Honors List */}
      <div className="flex flex-col gap-3.5">
        {honors.map((h, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-surface-container-low border border-outline/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-secondary/40 transition-all group"
          >
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
              </div>

              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md bg-surface-container-high text-on-surface text-label-sm font-bold font-mono">
                    {h.year}
                  </span>
                  <span className="text-body-sm text-secondary font-semibold">
                    {h.issuer}
                  </span>
                </div>

                <h4 className="text-title-md font-bold text-on-surface">
                  {h.title}
                </h4>

                {h.description && (
                  <p className="text-body-sm text-on-surface-variant leading-relaxed mt-0.5">
                    {h.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
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
                disabled={idx === honors.length - 1}
                className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant disabled:opacity-30 flex items-center justify-center transition-colors"
                title="Move Down"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </button>
              <button
                type="button"
                onClick={() => openEditModal(h, idx)}
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

        {honors.length === 0 && (
          <div className="text-center py-12 bg-surface-container-lowest border border-dashed border-outline rounded-2xl">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2">
              military_tech
            </span>
            <p className="text-body-md font-bold text-on-surface">No Honors or Awards Recorded</p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Click "Add Honor / Award" above to add research recognitions, fellowships, or distinctions.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Honor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-surface-container-lowest border border-outline rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col gap-5 animate-slideUp">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {editingIdx !== null ? 'edit_note' : 'add_circle'}
                </span>
                <span>{editingIdx !== null ? 'Edit Honor or Award' : 'Add Honor or Award'}</span>
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
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Award / Honor Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Faculty Research Recognition, Best Paper Award"
                  className="h-11 px-3.5 bg-surface-container-lowest border border-slate-300 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Granting Institution / Body *</label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g., East West University"
                    className="h-11 px-3.5 bg-surface-container-lowest border border-slate-300 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Year *</label>
                  <input
                    type="text"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g., 2024"
                    className="h-11 px-3.5 bg-surface-container-lowest border border-slate-300 rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">Citation Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Citation details, criteria, impact of the recognition..."
                  className="p-3.5 bg-surface-container-lowest border border-slate-300 rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all leading-relaxed"
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
                  {editingIdx !== null ? 'Update Honor' : 'Save Honor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
