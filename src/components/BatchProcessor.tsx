import React, { useState } from 'react';
import { BatchItem, ResumeData } from '../types';
import {
  Layers,
  Plus,
  Trash2,
  Play,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Mail,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { downloadResumePdf, downloadCoverLetterPdf } from '../utils/pdfExport';

interface BatchProcessorProps {
  onSelectResume: (resume: ResumeData, company: string) => void;
}

export function BatchProcessor({ onSelectResume }: BatchProcessorProps) {
  const [items, setItems] = useState<BatchItem[]>([
    {
      id: 'batch-1',
      title: '',
      company: '',
      url: '',
      text: '',
      status: 'idle',
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `batch-${Date.now()}`,
        title: '',
        company: '',
        url: '',
        text: '',
        status: 'idle',
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setProcessingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleUpdateItem = (id: string, updates: Partial<BatchItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const handleFetchUrl = async (id: string, url: string) => {
    if (!url.trim()) return;
    try {
      handleUpdateItem(id, { status: 'analyzing', errorMessage: undefined });
      const res = await fetch('/api/fetch-jd-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch JD URL');

      handleUpdateItem(id, {
        text: data.text,
        title: data.title || 'Senior Software Engineer',
        status: 'idle',
      });
    } catch (err: any) {
      handleUpdateItem(id, {
        status: 'error',
        errorMessage: err.message || 'URL fetch failed',
      });
    }
  };

  // Reprocess a single specific Job Description
  const handleReprocessItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (!item.text.trim()) {
      handleUpdateItem(id, {
        status: 'error',
        errorMessage: 'Please enter or fetch Job Description text before processing.',
      });
      return;
    }

    setProcessingIds((prev) => new Set(prev).add(id));
    handleUpdateItem(id, { status: 'generating', errorMessage: undefined });

    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jdText: item.text,
          targetRole: item.title || 'Senior Software Engineer',
          targetCompany: item.company || 'Hiring Company',
        }),
      });

      const resumeData = await res.json();
      if (!res.ok) throw new Error(resumeData.error || 'Generation failed');

      handleUpdateItem(id, {
        status: 'completed',
        resumeData,
        title: item.title || resumeData.title || 'Senior Software Engineer',
        company: item.company || resumeData.coverLetter?.company || 'Hiring Company',
        errorMessage: undefined,
      });
    } catch (err: any) {
      handleUpdateItem(id, {
        status: 'error',
        errorMessage: err.message || 'Reprocessing failed',
      });
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleProcessAll = async () => {
    setIsProcessing(true);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.text.trim()) continue;

      setActiveItemIndex(i);
      await handleReprocessItem(item.id);
    }

    setIsProcessing(false);
    setActiveItemIndex(null);
  };

  const handleDownloadAll = async () => {
    const completed = items.filter((i) => i.status === 'completed' && i.resumeData);
    for (const item of completed) {
      if (item.resumeData) {
        await downloadResumePdf(item.resumeData, item.company || item.title);
        await new Promise((r) => setTimeout(r, 400));
        await downloadCoverLetterPdf(item.resumeData, item.company || item.title);
        await new Promise((r) => setTimeout(r, 400));
      }
    }
  };

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const hasValidText = items.some((i) => i.text.trim().length > 10);

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Automated Multi-JD Batch Mode
            </span>
            <span className="text-xs text-slate-400">
              {items.length} Target Roles in Queue
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Batch Resume & Cover Letter Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Process multiple Job Descriptions concurrently. Each job can be individually processed or reprocessed at any time, or run all in sequence with one click.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAddItem}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Job
          </button>

          {completedCount > 0 && (
            <button
              onClick={handleDownloadAll}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download All PDFs ({completedCount})
            </button>
          )}

          <button
            onClick={handleProcessAll}
            disabled={isProcessing || !hasValidText}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                Processing Job #{activeItemIndex !== null ? activeItemIndex + 1 : ''}...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                Process All JDs ({items.filter((i) => i.text.trim().length > 10).length})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Items list */}
      <div className="space-y-4">
        {items.map((item, idx) => {
          const isItemProcessing = processingIds.has(item.id) || item.status === 'generating';

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all ${
                item.status === 'completed'
                  ? 'bg-slate-900/90 border-emerald-800/60 shadow-lg shadow-emerald-950/20'
                  : isItemProcessing || item.status === 'analyzing'
                  ? 'bg-slate-900 border-amber-500/50 shadow-lg shadow-amber-950/20 animate-pulse'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              {/* Card Header Row */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {item.title ? `${item.title}${item.company ? ` • ${item.company}` : ''}` : `Job Posting #${idx + 1}`}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  {item.status === 'completed' && !isItemProcessing && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tailored & Ready
                    </span>
                  )}
                  {isItemProcessing && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      {item.resumeData ? 'Reprocessing JD...' : 'Tailoring with Gemini...'}
                    </span>
                  )}
                  {item.status === 'analyzing' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" /> Fetching JD...
                    </span>
                  )}
                  {item.status === 'error' && !isItemProcessing && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-400/10 text-rose-400 border border-rose-400/20 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Error
                    </span>
                  )}

                  {/* Individual Reprocess / Process Button */}
                  {item.status === 'completed' ? (
                    <button
                      onClick={() => handleReprocessItem(item.id)}
                      disabled={isItemProcessing || !item.text.trim()}
                      className="px-2.5 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                      title="Reprocess this Job Description"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isItemProcessing ? 'animate-spin' : ''}`} />
                      {isItemProcessing ? 'Reprocessing...' : 'Reprocess JD'}
                    </button>
                  ) : item.status === 'error' ? (
                    <button
                      onClick={() => handleReprocessItem(item.id)}
                      disabled={isItemProcessing || !item.text.trim()}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                      title="Retry reprocessing this Job Description"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isItemProcessing ? 'animate-spin' : ''}`} />
                      {isItemProcessing ? 'Retrying...' : 'Retry Reprocess'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReprocessItem(item.id)}
                      disabled={isItemProcessing || !item.text.trim()}
                      className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 shadow-sm"
                      title="Process this specific Job Description"
                    >
                      {isItemProcessing ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" /> Process JD
                        </>
                      )}
                    </button>
                  )}

                  {/* Actions when completed */}
                  {item.resumeData && (
                    <>
                      <button
                        onClick={() => onSelectResume(item.resumeData!, item.company || item.title)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Inspect and edit in Full Viewer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>

                      <button
                        onClick={() => downloadResumePdf(item.resumeData!, item.company || item.title)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Download Resume PDF"
                      >
                        <Download className="w-3.5 h-3.5" /> Resume
                      </button>

                      <button
                        onClick={() => downloadCoverLetterPdf(item.resumeData!, item.company || item.title)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                        title="Download Cover Letter PDF"
                      >
                        <Mail className="w-3.5 h-3.5 text-amber-400" /> Letter
                      </button>
                    </>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove job from batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Target Role & Target Company Input Row */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Target Role / Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Software Engineer"
                    value={item.title || ''}
                    onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-400 block mb-1">
                    Target Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Amazon, Google"
                    value={item.company || ''}
                    onChange={(e) => handleUpdateItem(item.id, { company: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* URL fetch row */}
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="url"
                  placeholder="Paste Job Posting URL to auto-fetch (Greenhouse, Lever, LinkedIn, etc.)"
                  value={item.url || ''}
                  onChange={(e) => handleUpdateItem(item.id, { url: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={() => handleFetchUrl(item.id, item.url || '')}
                  disabled={!item.url || item.status === 'analyzing'}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium disabled:opacity-40 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                >
                  {item.status === 'analyzing' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching...
                    </>
                  ) : (
                    'Fetch JD Text'
                  )}
                </button>
              </div>

              {/* JD Text preview & Edit */}
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Job Description Text ({item.text.length} characters)</span>
                  {item.status === 'completed' && (
                    <span className="text-amber-400/90 text-[10px]">
                      Tip: Modify JD text and click &ldquo;Reprocess JD&rdquo; to re-tailor
                    </span>
                  )}
                </div>
                <textarea
                  placeholder="Paste Job Description text here..."
                  value={item.text}
                  onChange={(e) => handleUpdateItem(item.id, { text: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed placeholder-slate-600 focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              {/* Tailored Summary Details Card (if completed) */}
              {item.status === 'completed' && item.resumeData && !isItemProcessing && (
                <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-400" /> Tailored for {item.company || 'Hiring Company'}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/20 font-mono">
                        {item.resumeData.skills?.length || 0} Skills Matched
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        12 / 10 / 8 Bullets
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {item.resumeData.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReprocessItem(item.id)}
                      disabled={isItemProcessing || !item.text.trim()}
                      className="px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                      title="Reprocess this Job Description"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                      Reprocess JD
                    </button>
                    <button
                      onClick={() => onSelectResume(item.resumeData!, item.company || item.title)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" /> Full Editor
                    </button>
                  </div>
                </div>
              )}

              {/* Error message */}
              {item.errorMessage && (
                <div className="mt-2.5 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{item.errorMessage}</span>
                  </div>
                  <button
                    onClick={() => handleReprocessItem(item.id)}
                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-200 underline cursor-pointer"
                  >
                    Retry Reprocess
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
