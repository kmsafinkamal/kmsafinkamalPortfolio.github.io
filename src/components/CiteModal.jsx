import React, { useState, useEffect } from 'react';

export default function CiteModal({ paper, onClose }) {
  const [format, setFormat] = useState('bibtex');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!paper) return null;

  const getFormattedContent = () => {
    switch (format) {
      case 'apa':
        return paper.apa || `${paper.authors} (${paper.year}). ${paper.title}. ${paper.venue}.`;
      case 'ieee':
        return paper.ieee || `${paper.authors}, "${paper.title}," in ${paper.venue}, ${paper.year}.`;
      case 'bibtex':
      default:
        return paper.bibtex || `@inproceedings{kamal${paper.year}${paper.id},
  title={${paper.title}},
  author={${paper.authors}},
  booktitle={${paper.venue}},
  year={${paper.year}}
}`;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFormattedContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownloadRis = () => {
    const risContent = `TY  - CONF
TI  - ${paper.title}
AU  - ${paper.authors}
JO  - ${paper.venue}
PY  - ${paper.year}
ER  - 
`;
    const blob = new Blob([risContent], { type: 'application/x-research-info-systems' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citation-${paper.id}.ris`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-floating border border-outline overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">format_quote</span>
            <h3 className="text-headline-sm font-semibold text-on-surface">Export Citation</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex flex-col gap-4">
          <div>
            <span className="text-label-sm uppercase font-semibold text-secondary tracking-wider block mb-1">
              {paper.venue} • {paper.year}
            </span>
            <p className="text-title-md font-semibold text-on-surface line-clamp-2">
              {paper.title}
            </p>
          </div>

          {/* Format Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-lg">
            {['bibtex', 'apa', 'ieee'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`flex-1 py-1.5 text-label-md font-semibold rounded-md transition-all uppercase ${
                  format === fmt
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Citation Code View */}
          <div className="relative">
            <div className="bg-surface-container-low border border-outline/70 p-3.5 rounded-xl font-mono text-body-sm text-on-surface select-all overflow-x-auto max-h-48">
              <pre className="whitespace-pre-wrap text-[12px] leading-relaxed break-words font-mono">
                {getFormattedContent()}
              </pre>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopy}
              className={`flex-1 h-11 rounded-xl font-semibold text-label-md flex items-center justify-center gap-2 transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary text-on-primary hover:bg-primary-dark active:scale-[0.98]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied to Clipboard!' : `Copy ${format.toUpperCase()}`}</span>
            </button>
            <button
              onClick={handleDownloadRis}
              className="h-11 px-4 bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline rounded-xl flex items-center justify-center gap-1.5 text-label-md font-medium transition-colors"
              title="Download EndNote / Zotero / Mendeley RIS file"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>.RIS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
