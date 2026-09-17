import React, { useState } from 'react';

export default function AdminProjectsManager({
  projects = [],
  onUpdateProjects,
  onSaveAll,
  isSaving
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const blankProject = {
    id: '',
    category: 'biomedical',
    title: '',
    status: 'Active Research',
    summary: '',
    metrics: '',
    stack: [],
    stackInput: '',
    highlights: [],
    highlightsInput: '',
    links: {
      scholar: 'https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en',
      code: 'https://github.com'
    }
  };

  const [formData, setFormData] = useState(blankProject);

  const openAddModal = () => {
    setFormData({ ...blankProject });
    setEditingIndex(null);
    setShowModal(true);
  };

  const openEditModal = (proj, idx) => {
    setFormData({
      ...proj,
      stackInput: (proj.stack || []).join(', '),
      highlightsInput: (proj.highlights || []).join('\n'),
      links: {
        scholar: proj.links?.scholar || '',
        code: proj.links?.code || ''
      }
    });
    setEditingIndex(idx);
    setShowModal(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedStack = formData.stackInput
      ? formData.stackInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const parsedHighlights = formData.highlightsInput
      ? formData.highlightsInput.split('\n').map((h) => h.trim()).filter(Boolean)
      : [];

    const slugId =
      formData.id ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const savedItem = {
      id: slugId,
      category: formData.category,
      title: formData.title.trim(),
      status: formData.status,
      summary: formData.summary.trim(),
      metrics: formData.metrics.trim() || 'Active Research Initiative',
      stack: parsedStack,
      highlights: parsedHighlights,
      links: {
        scholar: formData.links?.scholar?.trim() || '',
        code: formData.links?.code?.trim() || ''
      }
    };

    let updated;
    if (editingIndex !== null) {
      updated = [...projects];
      updated[editingIndex] = savedItem;
    } else {
      updated = [savedItem, ...projects];
    }

    onUpdateProjects(updated);
    setShowModal(false);
  };

  const handleDelete = (idx) => {
    const p = projects[idx];
    if (window.confirm(`Are you sure you want to delete project "${p.title}"?`)) {
      const updated = projects.filter((_, i) => i !== idx);
      onUpdateProjects(updated);
    }
  };

  const handleMove = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= projects.length) return;
    const updated = [...projects];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onUpdateProjects(updated);
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q) ||
      (p.stack || []).some((s) => s.toLowerCase().includes(q))
    );
  });

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
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Action & Summary Bar */}
      <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-[22px]">folder_special</span>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              Projects & Systems
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
              {projects.length} Total
            </span>
          </div>
          <h3 className="text-headline-sm font-bold text-on-surface">
            Research Projects Manager
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Add, update, or remove research software architectures, benchmark metrics, and open-source models displayed on the public Projects page.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-surface-container-low/60 border border-outline rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search projects by title, stack, category..."
            className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
          />
        </div>

        <div className="text-body-sm text-on-surface-variant">
          Showing <strong className="text-on-surface">{filteredProjects.length}</strong> of {projects.length} projects
        </div>
      </div>

      {/* Project Cards List */}
      <div className="flex flex-col gap-4">
        {filteredProjects.map((p, idx) => {
          const originalIdx = projects.findIndex((orig) => orig.id === p.id);
          return (
            <div
              key={p.id || idx}
              className="bg-surface-container-lowest border border-outline rounded-2xl p-5 sm:p-6 shadow-card flex flex-col gap-4 hover:border-secondary/40 transition-all"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-secondary text-label-sm font-bold uppercase tracking-wider">
                      {categoryLabels[p.category] || p.category}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusColors[p.status] || 'bg-slate-100 text-slate-700'}`}>
                      {p.status}
                    </span>
                    <span className="text-[12px] font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-lg border border-secondary/20">
                      {p.metrics}
                    </span>
                  </div>

                  <h4 className="text-title-md sm:text-headline-sm font-bold text-on-surface">
                    {p.title}
                  </h4>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    {p.summary}
                  </p>
                </div>

                {/* Card Controls */}
                <div className="flex items-center gap-1.5 shrink-0 self-start">
                  <button
                    type="button"
                    onClick={() => handleMove(originalIdx, -1)}
                    disabled={originalIdx === 0}
                    className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant disabled:opacity-30 flex items-center justify-center transition-colors"
                    title="Move Up"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(originalIdx, 1)}
                    disabled={originalIdx === projects.length - 1}
                    className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface-variant disabled:opacity-30 flex items-center justify-center transition-colors"
                    title="Move Down"
                  >
                    <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(p, originalIdx)}
                    className="px-3 py-1.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 text-secondary font-semibold text-label-sm flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(originalIdx)}
                    className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 font-semibold text-label-sm flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Highlights & Stack */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-outline/50 text-body-sm">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-on-surface-variant">Tech Stack:</span>
                  {(p.stack || []).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-surface-container text-on-surface text-[11px] font-mono border border-outline/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-[12px] text-on-surface-variant">
                  {p.links?.scholar && (
                    <a
                      href={p.links.scholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline flex items-center gap-1 font-medium"
                    >
                      <span className="material-symbols-outlined text-[14px]">school</span>
                      <span>Scholar Link</span>
                    </a>
                  )}
                  {p.links?.code && (
                    <a
                      href={p.links.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:underline flex items-center gap-1 font-medium"
                    >
                      <span className="material-symbols-outlined text-[14px]">code</span>
                      <span>Code Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-surface-container-lowest border border-dashed border-outline rounded-2xl">
            <span className="material-symbols-outlined text-[40px] text-on-surface-variant mb-2">
              folder_off
            </span>
            <p className="text-body-md font-bold text-on-surface">No projects found</p>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {searchFilter ? 'Try clearing your search query' : 'Click "Add New Project" to create your first research project.'}
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-surface-container-lowest border border-outline rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-5 animate-slideUp my-8">
            <div className="flex items-center justify-between pb-3 border-b border-outline">
              <h3 className="text-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">
                  {editingIndex !== null ? 'edit_note' : 'add_circle'}
                </span>
                <span>{editingIndex !== null ? 'Edit Research Project' : 'Create New Project'}</span>
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
              {/* Project Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., OncoVision AI: Multi-Modal Deep Neural Ensemble"
                  className="h-11 px-4 bg-surface-container-lowest border border-outline rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  >
                    <option value="biomedical">Biomedical AI</option>
                    <option value="green-cloud">Green Cloud Systems</option>
                    <option value="computer-vision">Edge Computer Vision</option>
                    <option value="security">Security & Privacy</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  >
                    <option value="Active Research">Active Research</option>
                    <option value="Benchmark Published">Benchmark Published</option>
                    <option value="Open Source">Open Source</option>
                    <option value="Deployed System">Deployed System</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>

              {/* Metrics Badge */}
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Metrics & Impact Badge
                </label>
                <input
                  type="text"
                  value={formData.metrics}
                  onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
                  placeholder="e.g., 98.4% Diagnostic Accuracy • 5 Publications"
                  className="h-11 px-4 bg-surface-container-lowest border border-outline rounded-xl text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
              </div>

              {/* Summary */}
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Project Summary *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Comprehensive description of the algorithmic problem, architecture, and deployment..."
                  className="p-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all leading-relaxed"
                />
              </div>

              {/* Tech Stack */}
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.stackInput}
                  onChange={(e) => setFormData({ ...formData, stackInput: e.target.value })}
                  placeholder="e.g., PyTorch, DenseNet-121, Grad-CAM, Flask, OpenCV"
                  className="h-11 px-4 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                />
                <span className="text-[11px] text-on-surface-variant">Separate libraries and frameworks with commas.</span>
              </div>

              {/* Highlights (One per line) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-label-sm font-semibold text-on-surface">
                  Key Computational Contributions (One per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.highlightsInput}
                  onChange={(e) => setFormData({ ...formData, highlightsInput: e.target.value })}
                  placeholder="Automated leukocyte morphology segmentation&#10;Grad-CAM visual attribution maps providing clinical evidence&#10;Validated on EWU medical partner datasets"
                  className="p-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all leading-relaxed font-sans"
                />
              </div>

              {/* Links: Scholar & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Scholar Article URL</label>
                  <input
                    type="url"
                    value={formData.links?.scholar || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...formData.links, scholar: e.target.value }
                      })
                    }
                    placeholder="https://scholar.google.com/..."
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">Code / GitHub Repository URL</label>
                  <input
                    type="url"
                    value={formData.links?.code || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        links: { ...formData.links, code: e.target.value }
                      })
                    }
                    placeholder="https://github.com/..."
                    className="h-11 px-3 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
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
                  {editingIndex !== null ? 'Update Project' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
