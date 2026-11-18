import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Lock,
  Mail,
  Pencil,
  Send,
} from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

export interface EnquirySubmission {
  id: string;
  name: string;
  email: string;
  doubt: string;
  description: string;
  createdAt: string;
  dispatchedVia?: 'Email' | 'LinkedIn' | 'GitHub';
}

interface EnquiryContactSectionProps {
  focusTrigger: number;
  onNotify: (msg: string) => void;
}

const STORAGE_KEY = 'nsk_enquiries_history';

export const EnquiryContactSection: React.FC<EnquiryContactSectionProps> = ({
  focusTrigger,
  onNotify,
}) => {
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [doubt, setDoubt] = useState('');
  const [description, setDescription] = useState('');

  const [errors, setErrors] = useState<Partial<Record<'name' | 'email' | 'doubt' | 'description', string>>>({});
  const [channelPrompt, setChannelPrompt] = useState<string | null>(null);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<EnquirySubmission | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);

  const [history, setHistory] = useState<EnquirySubmission[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as EnquirySubmission[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (focusTrigger > 0) {
      nameInputRef.current?.focus();
    }
  }, [focusTrigger]);

  const persistHistory = (items: EnquirySubmission[]) => {
    setHistory(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 5)));
    } catch {
      // Ignore storage quota errors
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<'name' | 'email' | 'doubt' | 'description', string>> = {};
    if (!name.trim()) nextErrors.name = 'Please enter your name.';
    if (!email.trim()) {
      nextErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!doubt.trim()) nextErrors.doubt = 'Please enter your doubt or topic.';
    if (!description.trim() || description.trim().length < 10) {
      nextErrors.description = 'Please add a clear description about your doubt (at least 10 characters).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const formatMessage = (item: EnquirySubmission) =>
    [
      `Hello Sri Krishna,`,
      ``,
      `Name: ${item.name}`,
      `Email: ${item.email}`,
      `Doubt / Topic: ${item.doubt}`,
      ``,
      `Description about my doubt:`,
      `${item.description}`,
    ].join('\n');

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fallback below
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChannelPrompt(null);
    if (!validateForm()) return;

    const entry: EnquirySubmission = {
      id: `${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      doubt: doubt.trim(),
      description: description.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSubmittedEnquiry(entry);
    persistHistory([entry, ...history.filter((h) => h.id !== entry.id)].slice(0, 5));
    onNotify('Enquiry ready — choose Email, LinkedIn, or GitHub to send your message.');
  };

  const handleDispatchChannel = async (channel: 'Email' | 'LinkedIn' | 'GitHub') => {
    if (!submittedEnquiry) {
      setChannelPrompt(
        `Please fill out the enquiry form first (Name, Email, Doubt, and Description) before sending via ${channel}.`
      );
      nameInputRef.current?.focus();
      return;
    }

    const formatted = formatMessage(submittedEnquiry);
    const updated: EnquirySubmission = { ...submittedEnquiry, dispatchedVia: channel };
    setSubmittedEnquiry(updated);
    persistHistory([updated, ...history.filter((h) => h.id !== updated.id)].slice(0, 5));

    if (channel === 'Email') {
      const subject = encodeURIComponent(`[Portfolio Enquiry] ${submittedEnquiry.doubt}`);
      const body = encodeURIComponent(formatted);
      await copyToClipboard(formatted);
      window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      onNotify(`Opening Email draft to ${PROFILE.email} (message also copied).`);
      return;
    }

    const copied = await copyToClipboard(formatted);
    if (channel === 'LinkedIn') {
      onNotify(
        copied
          ? 'Enquiry message copied! Opening LinkedIn profile to send your message.'
          : 'Opening LinkedIn profile.'
      );
      window.open(PROFILE.linkedinUrl, '_blank', 'noopener,noreferrer');
    } else if (channel === 'GitHub') {
      onNotify(
        copied
          ? 'Enquiry message copied! Opening GitHub profile to connect.'
          : 'Opening GitHub profile.'
      );
      window.open(PROFILE.githubUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyFormatted = async () => {
    if (!submittedEnquiry) return;
    const ok = await copyToClipboard(formatMessage(submittedEnquiry));
    if (ok) {
      setCopiedMessage(true);
      onNotify('Formatted enquiry copied to clipboard.');
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  return (
    <section id="contact" className="py-12 border-t border-[#E4E2DC] dark:border-[#232732]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-7">
        <div>
          <p className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] mb-1">
            04. Enquiry &amp; Messaging Channels
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#111318] dark:text-[#F3F4F6]">
            Send an Enquiry
          </h2>
        </div>
        <p className="text-xs text-[#555B66] dark:text-[#9CA3AF]">
          Messages accepted strictly via Email, LinkedIn, or GitHub after filling the form
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Structured Enquiry Form */}
        <div className="lg:col-span-7 bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-6 md:p-7">
          {!submittedEnquiry ? (
            <form onSubmit={handleEnquirySubmit} noValidate className="space-y-4">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E4E2DC] dark:border-[#232732]">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#111318] dark:text-[#F3F4F6]">
                    Step 1: Fill Enquiry Details
                  </h3>
                  <p className="text-xs text-[#555B66] dark:text-[#9CA3AF] mt-0.5">
                    Complete all four fields to unlock Email, LinkedIn, or GitHub message dispatch.
                  </p>
                </div>
              </div>

              {channelPrompt && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-[#FEF3C7] dark:bg-[#B45309]/20 border border-[#F59E0B]/40 text-xs text-[#92400E] dark:text-[#FCD34D]"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{channelPrompt}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="enquiry-name"
                    className="block text-xs font-semibold text-[#111318] dark:text-[#F3F4F6] mb-1.5"
                  >
                    Your Name <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    ref={nameInputRef}
                    id="enquiry-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: undefined });
                    }}
                    placeholder="Enter your full name"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#F8F8F6] dark:bg-[#191C24] border text-[#111318] dark:text-[#F3F4F6] placeholder:text-[#848B98] focus:outline-none focus:ring-2 focus:ring-[#2557D6] ${
                      errors.name
                        ? 'border-[#E11D48]'
                        : 'border-[#E4E2DC] dark:border-[#232732]'
                    }`}
                  />
                  {errors.name && (
                    <p className="flex items-center gap-1 text-xs text-[#E11D48] mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="enquiry-email"
                    className="block text-xs font-semibold text-[#111318] dark:text-[#F3F4F6] mb-1.5"
                  >
                    What is your email? <span className="text-[#E11D48]">*</span>
                  </label>
                  <input
                    id="enquiry-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="you@example.com"
                    className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#F8F8F6] dark:bg-[#191C24] border text-[#111318] dark:text-[#F3F4F6] placeholder:text-[#848B98] focus:outline-none focus:ring-2 focus:ring-[#2557D6] ${
                      errors.email
                        ? 'border-[#E11D48]'
                        : 'border-[#E4E2DC] dark:border-[#232732]'
                    }`}
                  />
                  {errors.email && (
                    <p className="flex items-center gap-1 text-xs text-[#E11D48] mt-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="enquiry-doubt"
                  className="block text-xs font-semibold text-[#111318] dark:text-[#F3F4F6] mb-1.5"
                >
                  What is your doubt? <span className="text-[#E11D48]">*</span>
                </label>
                <input
                  id="enquiry-doubt"
                  type="text"
                  value={doubt}
                  onChange={(e) => {
                    setDoubt(e.target.value);
                    if (errors.doubt) setErrors({ ...errors, doubt: undefined });
                  }}
                  placeholder="e.g., Python / AI-ML project collaboration, internship, or technical question"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#F8F8F6] dark:bg-[#191C24] border text-[#111318] dark:text-[#F3F4F6] placeholder:text-[#848B98] focus:outline-none focus:ring-2 focus:ring-[#2557D6] ${
                    errors.doubt
                      ? 'border-[#E11D48]'
                      : 'border-[#E4E2DC] dark:border-[#232732]'
                  }`}
                />
                {errors.doubt && (
                  <p className="flex items-center gap-1 text-xs text-[#E11D48] mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.doubt}</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="enquiry-description"
                    className="block text-xs font-semibold text-[#111318] dark:text-[#F3F4F6]"
                  >
                    Description about your doubt <span className="text-[#E11D48]">*</span>
                  </label>
                  <span className="font-mono text-[11px] text-[#848B98] tabular-nums">
                    {description.trim().length} chars
                  </span>
                </div>
                <textarea
                  id="enquiry-description"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors({ ...errors, description: undefined });
                  }}
                  placeholder="Explain your question, project idea, or collaboration details clearly..."
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#F8F8F6] dark:bg-[#191C24] border text-[#111318] dark:text-[#F3F4F6] placeholder:text-[#848B98] focus:outline-none focus:ring-2 focus:ring-[#2557D6] resize-y ${
                    errors.description
                      ? 'border-[#E11D48]'
                      : 'border-[#E4E2DC] dark:border-[#232732]'
                  }`}
                />
                {errors.description && (
                  <p className="flex items-center gap-1 text-xs text-[#E11D48] mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.description}</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#2557D6] hover:bg-[#1D46B3] dark:bg-[#60A5FA] dark:text-[#090D16] dark:hover:bg-[#93C5FD] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[42px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2557D6]"
                >
                  <Send className="w-4 h-4" />
                  <span>Prepare Enquiry to Send</span>
                </button>
                <span className="text-xs text-[#848B98] dark:text-[#6B7280]">
                  No phone / mobile contact · Direct reply to your email
                </span>
              </div>
            </form>
          ) : (
            /* Step 2: Message Ready & Direct Dispatch via Email / LinkedIn / GitHub */
            <div className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-[#E4E2DC] dark:border-[#232732]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#15803D] dark:text-[#4ADE80] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#111318] dark:text-[#F3F4F6]">
                      Step 2: Send Your Enquiry via Channel
                    </h3>
                    <p className="text-xs text-[#555B66] dark:text-[#9CA3AF] mt-0.5">
                      Choose Email, LinkedIn, or GitHub below to deliver your message.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSubmittedEnquiry(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#555B66] dark:text-[#9CA3AF] hover:text-[#111318] dark:hover:text-[#F3F4F6] bg-[#F1F0EC] dark:bg-[#191C24] rounded-lg transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Enquiry</span>
                </button>
              </div>

              <div className="bg-[#F8F8F6] dark:bg-[#191C24] border border-[#E4E2DC] dark:border-[#232732] rounded-xl p-4 space-y-2.5 text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#848B98]">Name: </span>
                    <span className="font-semibold text-[#111318] dark:text-[#F3F4F6]">
                      {submittedEnquiry.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#848B98]">Email: </span>
                    <span className="font-mono text-[#111318] dark:text-[#F3F4F6]">
                      {submittedEnquiry.email}
                    </span>
                  </div>
                </div>
                <div className="text-xs">
                  <span className="text-[#848B98]">Doubt: </span>
                  <span className="font-semibold text-[#111318] dark:text-[#F3F4F6]">
                    {submittedEnquiry.doubt}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E4E2DC] dark:border-[#232732] text-xs text-[#555B66] dark:text-[#9CA3AF] whitespace-pre-wrap leading-relaxed">
                  {submittedEnquiry.description}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleDispatchChannel('Email')}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-white bg-[#2557D6] hover:bg-[#1D46B3] dark:bg-[#60A5FA] dark:text-[#090D16] dark:hover:bg-[#93C5FD] rounded-xl transition-colors cursor-pointer min-h-[44px]"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>Send via Email</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDispatchChannel('LinkedIn')}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#111318] dark:text-[#F3F4F6] bg-[#F1F0EC] hover:bg-[#EAE8E2] dark:bg-[#191C24] dark:hover:bg-[#212530] border border-[#E4E2DC] dark:border-[#232732] rounded-xl transition-colors cursor-pointer min-h-[44px]"
                >
                  <Linkedin className="w-4 h-4 shrink-0 text-[#2557D6] dark:text-[#60A5FA]" />
                  <span>Send via LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDispatchChannel('GitHub')}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#111318] dark:text-[#F3F4F6] bg-[#F1F0EC] hover:bg-[#EAE8E2] dark:bg-[#191C24] dark:hover:bg-[#212530] border border-[#E4E2DC] dark:border-[#232732] rounded-xl transition-colors cursor-pointer min-h-[44px]"
                >
                  <Github className="w-4 h-4 shrink-0" />
                  <span>Send via GitHub</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleCopyFormatted}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] hover:underline cursor-pointer"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied formatted enquiry</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy formatted enquiry text</span>
                    </>
                  )}
                </button>

                {submittedEnquiry.dispatchedVia && (
                  <span className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                    Ready / opened in {submittedEnquiry.dispatchedVia}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Permitted Messaging Channels (Email, LinkedIn, GitHub ONLY) */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="font-display text-base font-bold text-[#111318] dark:text-[#F3F4F6]">
                Allowed Messaging Channels
              </h3>
              {!submittedEnquiry && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#848B98] dark:text-[#6B7280]">
                  <Lock className="w-3 h-3" />
                  <span>Fill form to unlock</span>
                </span>
              )}
            </div>
            <p className="text-xs text-[#555B66] dark:text-[#9CA3AF] leading-relaxed mb-4">
              Mobile/phone messaging is disabled. After completing the enquiry form, send your message through any of these three channels:
            </p>

            <div className="space-y-2.5">
              {/* Email Channel */}
              <button
                type="button"
                onClick={() => handleDispatchChannel('Email')}
                className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                  submittedEnquiry
                    ? 'bg-[#F8F8F6] hover:bg-[#F1F0EC] dark:bg-[#191C24] dark:hover:bg-[#212530] border-[#2557D6]/40 dark:border-[#60A5FA]/40'
                    : 'bg-[#F8F8F6] hover:bg-[#F1F0EC] dark:bg-[#191C24] dark:hover:bg-[#212530] border-[#E4E2DC] dark:border-[#232732]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] text-[#2557D6] dark:text-[#60A5FA] shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#848B98] dark:text-[#6B7280]">
                      Email
                    </div>
                    <div className="text-sm font-semibold text-[#111318] dark:text-[#F3F4F6] truncate">
                      {PROFILE.email}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] whitespace-nowrap shrink-0 flex items-center gap-1">
                  {submittedEnquiry ? 'Send Email' : 'Fill Form'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </button>

              {/* LinkedIn Channel */}
              <button
                type="button"
                onClick={() => handleDispatchChannel('LinkedIn')}
                className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                  submittedEnquiry
                    ? 'bg-[#F8F8F6] hover:bg-[#F1F0EC] dark:bg-[#191C24] dark:hover:bg-[#212530] border-[#2557D6]/40 dark:border-[#60A5FA]/40'
                    : 'bg-[#F8F8F6] hover:bg-[#F1F0EC] dark:bg-[#191C24] dark:hover:bg-[#212530] border-[#E4E2DC] dark:border-[#232732]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] text-[#2557D6] dark:text-[#60A5FA] shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#848B98] dark:text-[#6B7280]">
                      LinkedIn
                    </div>
                    <div className="text-sm font-semibold text-[#111318] dark:text-[#F3F4F6] truncate">
                      {PROFILE.linkedinHandle}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] whitespace-nowrap shrink-0 flex items-center gap-1">
                  {submittedEnquiry ? 'Message' : 'Fill Form'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </button>

              {/* GitHub Channel */}
              <button
                type="button"
                onClick={() => handleDispatchChannel('GitHub')}
                className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                  submittedEnquiry
                    ? 'bg-[#F8F8F6] hover:bg-[#F1F0EC] dark:bg-[#191C24] dark:hover:bg-[#212530] border-[#2557D6]/40 dark:border-[#60A5FA]/40'
                    : 'bg-[#F8F8F6] hover:bg-[#F1F0EC] dark:bg-[#191C24] dark:hover:bg-[#212530] border-[#E4E2DC] dark:border-[#232732]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] text-[#111318] dark:text-[#F3F4F6] shrink-0">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-[#848B98] dark:text-[#6B7280]">
                      GitHub
                    </div>
                    <div className="text-sm font-semibold text-[#111318] dark:text-[#F3F4F6] truncate">
                      {PROFILE.githubHandle}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#2557D6] dark:text-[#60A5FA] whitespace-nowrap shrink-0 flex items-center gap-1">
                  {submittedEnquiry ? 'Connect' : 'Fill Form'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>

          {history.length > 0 && (
            <div className="bg-white dark:bg-[#12141A] border border-[#E4E2DC] dark:border-[#232732] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-display text-sm font-bold text-[#111318] dark:text-[#F3F4F6]">
                  Recent Enquiries ({history.length})
                </h4>
                <button
                  type="button"
                  onClick={() => persistHistory([])}
                  className="text-xs text-[#848B98] hover:text-[#111318] dark:hover:text-[#F3F4F6] cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {history.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSubmittedEnquiry(item)}
                    className="w-full text-left px-3 py-2.5 rounded-lg bg-[#F8F8F6] hover:bg-[#F1F0EC] dark:bg-[#191C24] dark:hover:bg-[#212530] border border-[#E4E2DC] dark:border-[#232732] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-semibold text-[#111318] dark:text-[#F3F4F6] truncate">
                        {item.doubt}
                      </span>
                      <span className="font-mono text-[11px] text-[#848B98] shrink-0">
                        {item.dispatchedVia || item.createdAt}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#555B66] dark:text-[#9CA3AF] truncate mt-0.5">
                      {item.name} · {item.email}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
