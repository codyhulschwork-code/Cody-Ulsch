import React, { useState } from 'react';
import {
  Globe,
  FileText,
  Sparkles,
  Search,
  Layers,
  AlertCircle,
} from 'lucide-react';

interface JDInputSectionProps {
  onAnalyze: (jdText: string) => Promise<void>;
  onDirectGenerate: (jdText: string) => Promise<void>;
  isAnalyzing: boolean;
  isGenerating: boolean;
}

export function JDInputSection({
  onAnalyze,
  onDirectGenerate,
  isAnalyzing,
  isGenerating,
}: JDInputSectionProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [url, setUrl] = useState('');
  const [jdText, setJdText] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleFetchUrl = async () => {
    if (!url.trim()) return;
    setIsFetchingUrl(true);
    setFetchError(null);

    try {
      const res = await fetch('/api/fetch-jd-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch JD from URL.');
      }

      setJdText(data.text);
      setActiveTab('text');
    } catch (err: any) {
      setFetchError(err.message || 'Error fetching URL.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const handleAnalyzeClick = () => {
    if (!jdText.trim()) return;
    onAnalyze(jdText);
  };

  const handleGenerateClick = () => {
    if (!jdText.trim()) return;
    onDirectGenerate(jdText);
  };

  const wordCount = jdText.trim() ? jdText.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Step 1: Input Job Description
            </span>
            <span className="text-xs text-slate-400">
              Target Candidate: <strong className="text-slate-200">Cody Ulsch</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Provide Job Description (URL or Text)
          </h2>
        </div>
      </div>

      {/* Input Method Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'url'
                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> 1. Fetch from JD URL
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Paste / Edit JD Text
          </button>
        </div>

        {activeTab === 'url' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://jobs.lever.co/... or Greenhouse / LinkedIn / company careers URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchUrl()}
                className="flex-1 px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <button
                onClick={handleFetchUrl}
                disabled={isFetchingUrl || !url.trim()}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-semibold disabled:opacity-40 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                {isFetchingUrl ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-transparent rounded-full animate-spin" />
                    Fetching JD...
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    Fetch & Extract
                  </>
                )}
              </button>
            </div>

            {fetchError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fetchError} - You can also paste the JD text directly below.</span>
              </div>
            )}
          </div>
        )}

        {/* JD Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Job Description Content</span>
            <span className="font-mono">{wordCount} words</span>
          </div>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={8}
            placeholder="Paste complete Job Description here..."
            className="w-full p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono placeholder-slate-600 focus:border-amber-400 focus:outline-none resize-y"
          />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span>Candidate:</span>
          <span className="font-semibold text-slate-200">Cody Ulsch (Senior Software Engineer)</span>
          <span className="hidden sm:inline">• 810 Francis Halethorpe MD</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing || !jdText.trim()}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-40"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-transparent rounded-full animate-spin" />
                Analyzing JD Stack...
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                2. Analyze JD Stack
              </>
            )}
          </button>

          <button
            onClick={handleGenerateClick}
            disabled={isGenerating || !jdText.trim()}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Generating Tailored Resume...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                3. Tailor Resume & Cover Letter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
