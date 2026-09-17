import React, { useState } from 'react';

export default function ContactView({ profile }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    topic: 'Biomedical AI Research',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        institution: '',
        topic: 'Biomedical AI Research',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="flex flex-col gap-8 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="border-b border-outline pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="material-symbols-outlined text-secondary text-[24px]">mail</span>
          <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
            Inquiries & Partnerships
          </span>
        </div>
        <h2 className="text-headline-md sm:text-headline-lg font-bold text-on-surface">
          Contact & Collaboration
        </h2>
        <p className="text-body-md text-on-surface-variant mt-1 max-w-2xl">
          Connect with K. M. Safin Kamal for academic joint research, peer-review invitations, guest lectures, or grant collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Academic Profiles & Channels */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 shadow-card flex flex-col gap-4">
            <h3 className="text-headline-sm font-bold text-on-surface">
              Scholarly Channels
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              Direct links to indexed academic repositories, code bases, and research networks:
            </p>

            <div className="flex flex-col gap-2.5 pt-1">
              {(profile?.socialLinks || []).map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface border border-outline/60 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-[20px] group-hover:scale-110 transition-transform">
                      {link.icon}
                    </span>
                    <span className="text-body-md font-medium">{link.label}</span>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-secondary transition-colors">
                    arrow_outward
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Direct Email Card */}
          <div className="bg-surface-container-low border border-outline rounded-2xl p-5 flex flex-col gap-2">
            <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">
              Direct Academic Email
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="text-title-md font-bold text-on-surface hover:text-secondary transition-colors break-all"
            >
              {profile.email}
            </a>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Response window typically within 48–72 hours for scholarly and academic inquiries.
            </p>
          </div>
        </div>

        {/* Right Column: Collaboration Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-surface-container-lowest border border-outline rounded-2xl p-6 sm:p-8 shadow-card flex flex-col gap-5">
            <div>
              <h3 className="text-headline-sm font-bold text-on-surface">
                Submit Research Proposal / Inquiry
              </h3>
              <p className="text-body-sm text-on-surface-variant mt-1">
                Fill out the form below to propose joint papers, symposium panels, or collaborative grants.
              </p>
            </div>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex flex-col items-center gap-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">check_circle</span>
                </div>
                <h4 className="text-title-md font-bold text-emerald-900">Inquiry Received</h4>
                <p className="text-body-sm text-emerald-700 max-w-sm">
                  Thank you for reaching out. Your proposal has been noted and a response will be dispatched to your inbox shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label-sm font-semibold text-on-surface">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Jane Smith"
                      className="h-[42px] px-3.5 bg-surface-container-lowest border border-slate-300 rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label-sm font-semibold text-on-surface">
                      Institutional Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. j.smith@university.edu"
                      className="h-[42px] px-3.5 bg-surface-container-lowest border border-slate-300 rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Institution */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label-sm font-semibold text-on-surface">
                      Affiliation / Institution
                    </label>
                    <input
                      type="text"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="e.g. Stanford University / IEEE"
                      className="h-[42px] px-3.5 bg-surface-container-lowest border border-slate-300 rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    />
                  </div>

                  {/* Topic */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label-sm font-semibold text-on-surface">
                      Inquiry Focus
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="h-[42px] px-3.5 bg-surface-container-lowest border border-slate-300 rounded-lg text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                    >
                      <option value="Biomedical AI Research">Biomedical AI & Oncology</option>
                      <option value="Green Cloud & Scheduling">Green Cloud Computing</option>
                      <option value="Computer Vision">Computer Vision & Sensing</option>
                      <option value="Peer Review / PC Invitation">Program Committee / Peer Review</option>
                      <option value="General Academic Inquiry">General Academic Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-label-sm font-semibold text-on-surface">
                    Proposal / Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe the research context, objectives, dataset availability, or conference details..."
                    className="p-3.5 bg-surface-container-lowest border border-slate-300 rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-primary hover:bg-primary-dark text-on-primary font-semibold text-label-md flex items-center justify-center gap-2 transition-all shadow-sm self-start mt-1 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
