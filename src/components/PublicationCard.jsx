import React, { useState } from 'react';

export default function PublicationCard({ paper, onCiteClick }) {
  const [showAbstract, setShowAbstract] = useState(false);

  // Helper to highlight any variation of "K. M. Safin Kamal" in authors string
  const renderAuthors = (authorsText) => {
    if (!authorsText) return null;
    const regex = /(K\.?\s*M\.?\s*Safin\s+Kamal|KMS\s+Kamal|K\.?\s*M\.?\s*S\.?\s+Kamal)/gi;
    const parts = authorsText.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <strong key={i} className="text-on-surface font-semibold underline decoration-secondary/30 decoration-2 underline-offset-2">
          {part}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const categoryLabels = {
    biomedical: 'Biomedical AI',
    'green-cloud': 'Green Cloud',
    'computer-vision': 'Computer Vision',
    security: 'Security & AI',
  };

  return (
    <article
      className="pub-card bg-surface-container-lowest border border-outline rounded-xl p-4 sm:p-5 shadow-card transition-all flex flex-col gap-3"
      data-category={paper.category}
      data-citations={paper.citations}
      data-year={paper.year}
    >
      {/* Top Metadata Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded bg-surface-container text-secondary text-label-sm font-bold tracking-wide uppercase">
            {paper.venue}
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant text-label-sm font-medium">
            {paper.year}
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-label-sm font-medium">
            {categoryLabels[paper.category] || paper.category}
          </span>
        </div>

        {/* Citation Pill Badge */}
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-sm font-semibold">
          <span className="material-symbols-outlined text-[14px]">format_quote</span>
          {paper.citations} {paper.citations === 1 ? 'Citation' : 'Citations'}
        </span>
      </div>

      {/* Paper Title */}
      <h3
        onClick={() => setShowAbstract(!showAbstract)}
        className="text-title-md font-semibold text-on-surface leading-snug cursor-pointer hover:text-secondary transition-colors"
      >
        {paper.title}
      </h3>

      {/* Authors List */}
      <p className="text-body-sm text-on-surface-variant leading-relaxed">
        {renderAuthors(paper.authors)}
      </p>

      {/* Collapsible Abstract */}
      {paper.abstract && (
        <div className="flex flex-col">
          <button
            onClick={() => setShowAbstract(!showAbstract)}
            className="self-start inline-flex items-center gap-1 text-label-sm font-medium text-secondary hover:underline py-0.5 transition-colors"
          >
            <span>{showAbstract ? 'Hide Abstract' : 'View Abstract'}</span>
            <span
              className={`material-symbols-outlined text-[16px] transition-transform duration-200 ${
                showAbstract ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {showAbstract && (
            <div className="mt-2 p-3.5 bg-surface-container-low/70 border-l-2 border-secondary rounded-r-lg text-body-sm text-on-surface-variant leading-relaxed animate-fadeIn">
              <p>{paper.abstract}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-outline/50 mt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Cite Button */}
          <button
            onClick={() => onCiteClick(paper)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-secondary border border-outline/60 transition-colors flex items-center gap-1.5 text-label-md font-medium"
            title="Cite this paper"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">menu_book</span>
            <span>Cite</span>
          </button>

          {/* Links (DOI, PDF, etc.) */}
          {paper.links && (
            <>
              {Object.entries(paper.links).map(([key, url]) => {
                const isPdf = key.toLowerCase().includes('pdf');
                const icon = isPdf ? 'description' : 'link';
                const label = key.replace(/^(description|link)\s*/i, '');
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface hover:text-secondary border border-outline/60 transition-colors flex items-center gap-1.5 text-label-md font-medium"
                  >
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      {icon}
                    </span>
                    <span>{label || (isPdf ? 'PDF' : 'Paper')}</span>
                  </a>
                );
              })}
            </>
          )}
        </div>

        {/* Scholar Citation Link */}
        <a
          href={paper.scholarLink || "https://scholar.google.com/citations?user=gpR1AC8AAAAJ&hl=en"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface-variant hover:text-secondary p-1 rounded-md transition-colors"
          title="View citation on Google Scholar"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        </a>
      </div>
    </article>
  );
}
