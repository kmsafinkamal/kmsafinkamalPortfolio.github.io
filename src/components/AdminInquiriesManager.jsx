import React, { useState, useMemo } from 'react';

export default function AdminInquiriesManager({
  inquiries = [],
  onUpdateStatus,
  onDelete,
  onNotify
}) {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'replied', 'archived'
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = inquiries.filter((i) => i.status === 'unread').length;
  const repliedCount = inquiries.filter((i) => i.status === 'replied').length;

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (filter === 'unread' && inq.status !== 'unread') return false;
      if (filter === 'replied' && inq.status !== 'replied') return false;
      if (filter === 'archived' && inq.status !== 'archived') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (inq.name || '').toLowerCase().includes(q);
        const matchEmail = (inq.email || '').toLowerCase().includes(q);
        const matchInst = (inq.institution || '').toLowerCase().includes(q);
        const matchTopic = (inq.topic || '').toLowerCase().includes(q);
        const matchMsg = (inq.message || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchInst || matchTopic || matchMsg;
      }
      return true;
    });
  }, [inquiries, filter, searchQuery]);

  const handleReplyClick = (inq) => {
    const subject = encodeURIComponent(`Re: [Academic Inquiry] ${inq.topic || 'Research Collaboration'}`);
    const body = encodeURIComponent(
      `Dear ${inq.name},\n\nThank you for reaching out regarding "${inq.topic}".\n\n\n---\nOriginal Proposal Details:\nFrom: ${inq.name} (${inq.email})\nInstitution: ${inq.institution || 'N/A'}\nTopic: ${inq.topic}\n\nMessage:\n"${inq.message}"\n\n---\nBest regards,\nK. M. Safin Kamal\nLecturer, Department of Computer Science & Engineering\nEast West University\nEmail: safin.kamal@ewubd.edu\n`
    );

    window.location.href = `mailto:${inq.email}?subject=${subject}&body=${body}`;

    if (inq.status !== 'replied') {
      onUpdateStatus(inq.id, 'replied');
    }

    if (onNotify) {
      onNotify(`Opened email composer to reply to ${inq.name}!`, 'success');
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest border border-outline rounded-2xl p-5 sm:p-6 shadow-card">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-secondary text-[24px]">mark_email_unread</span>
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              Academic Inbox & Dispatch
            </span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[11px] font-bold animate-pulse">
                {unreadCount} New {unreadCount === 1 ? 'Inquiry' : 'Inquiries'}
              </span>
            )}
          </div>
          <h3 className="text-headline-sm font-bold text-on-surface">
            Research Proposals & Collaboration Messages
          </h3>
          <p className="text-body-sm text-on-surface-variant mt-0.5">
            Review joint paper proposals, guest lecture invites, and graduate mentorship inquiries submitted from the public contact page.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-body-sm font-semibold text-on-surface bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline/70">
            Total Inquiries: <strong>{inquiries.length}</strong>
          </span>
        </div>
      </div>

      {/* Controls: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-low/60 p-4 rounded-2xl border border-outline">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inquiries, names, emails..."
            className="w-full pl-9 pr-8 py-2 bg-surface-container-lowest border border-outline rounded-xl text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All', count: inquiries.length },
            { id: 'unread', label: 'Unread', count: unreadCount, badge: 'bg-red-500 text-white' },
            { id: 'replied', label: 'Replied', count: repliedCount, badge: 'bg-emerald-600 text-white' },
            { id: 'archived', label: 'Archived', count: inquiries.filter((i) => i.status === 'archived').length }
          ].map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-label-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-secondary text-white shadow-xs'
                    : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline/70'
                }`}
              >
                <span>{f.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/25 text-white' : f.badge || 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {f.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline rounded-2xl p-12 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px]">drafts</span>
          </div>
          <h4 className="text-headline-sm font-semibold text-on-surface">No Inquiries Found</h4>
          <p className="text-body-sm text-on-surface-variant max-w-md">
            {searchQuery
              ? `No messages matched "${searchQuery}". Try clearing your search query.`
              : filter === 'unread'
              ? 'You have answered all incoming inquiries! There are no unread proposals.'
              : 'When visitors, collaborators, or students submit inquiries on the Contact page, they will appear here instantly for direct email response.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline text-label-sm font-semibold"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredInquiries.map((inq) => {
            const isUnread = inq.status === 'unread';
            const isReplied = inq.status === 'replied';

            return (
              <div
                key={inq.id}
                className={`bg-surface-container-lowest border rounded-2xl p-5 sm:p-6 transition-all flex flex-col gap-4 shadow-card ${
                  isUnread
                    ? 'border-red-300 dark:border-red-900/60 ring-1 ring-red-500/20'
                    : 'border-outline'
                }`}
              >
                {/* Header row: Inquirer info & status pill */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                        isUnread
                          ? 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-800'
                          : isReplied
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                          : 'bg-surface-container text-secondary border-outline'
                      }`}
                    >
                      {(inq.name || 'SK')
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-title-md text-on-surface leading-tight">
                          {inq.name}
                        </span>
                        {inq.institution && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant border border-outline/50">
                            {inq.institution}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 flex-wrap text-body-sm text-on-surface-variant">
                        <a
                          href={`mailto:${inq.email}`}
                          className="hover:text-secondary font-medium transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">mail</span>
                          <span>{inq.email}</span>
                        </a>
                        <span>•</span>
                        <span className="text-[12px] text-on-surface-variant">
                          {formatDate(inq.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {isUnread && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 text-label-sm font-bold border border-red-200 dark:border-red-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>Unread</span>
                      </span>
                    )}

                    {isReplied && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-label-sm font-bold border border-emerald-200 dark:border-emerald-800">
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Replied</span>
                      </span>
                    )}

                    {inq.status === 'read' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-label-sm font-semibold border border-slate-200 dark:border-slate-700">
                        <span>Reviewed</span>
                      </span>
                    )}

                    {inq.status === 'archived' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 text-label-sm font-semibold border border-amber-200 dark:border-amber-800">
                        <span>Archived</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Topic Pill */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                    Inquiry Focus:
                  </span>
                  <span className="text-label-sm font-semibold px-2.5 py-0.5 rounded-md bg-secondary/10 text-secondary border border-secondary/20">
                    {inq.topic}
                  </span>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline/60 text-body-md text-on-surface whitespace-pre-wrap leading-relaxed">
                  {inq.message}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-outline/50 flex-wrap">
                  {/* Primary Reply Button */}
                  <button
                    onClick={() => handleReplyClick(inq)}
                    className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary-dark text-white font-semibold text-label-md transition-all shadow-xs flex items-center gap-2 active:scale-[0.98]"
                    title={`Reply directly to ${inq.email}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">reply</span>
                    <span>Reply to {inq.name.split(' ')[0]} via Email</span>
                  </button>

                  {/* Secondary Management Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isUnread ? (
                      <button
                        onClick={() => onUpdateStatus(inq.id, 'read')}
                        className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline text-label-sm font-medium transition-colors"
                        title="Mark inquiry as read"
                      >
                        Mark as Read
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(inq.id, 'unread')}
                        className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline text-label-sm font-medium transition-colors"
                        title="Mark inquiry as unread"
                      >
                        Mark as Unread
                      </button>
                    )}

                    {!isReplied && (
                      <button
                        onClick={() => onUpdateStatus(inq.id, 'replied')}
                        className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline text-label-sm font-medium transition-colors"
                        title="Mark as already replied"
                      >
                        Mark as Replied
                      </button>
                    )}

                    {inq.status !== 'archived' ? (
                      <button
                        onClick={() => onUpdateStatus(inq.id, 'archived')}
                        className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline text-label-sm font-medium transition-colors"
                        title="Archive inquiry"
                      >
                        Archive
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(inq.id, 'read')}
                        className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-outline text-label-sm font-medium transition-colors"
                        title="Unarchive inquiry"
                      >
                        Restore
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete inquiry from ${inq.name}?`)) {
                          onDelete(inq.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete inquiry"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
