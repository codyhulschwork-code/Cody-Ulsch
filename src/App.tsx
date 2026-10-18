/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { JDInputSection } from './components/JDInputSection';
import { JDAnalysisView } from './components/JDAnalysisView';
import { ResumeViewer } from './components/ResumeViewer';
import { BatchProcessor } from './components/BatchProcessor';
import { INITIAL_CODY_RESUME, EMPTY_RESUME } from './data/defaultResume';
import { ResumeData, JDStackAnalysis } from './types';
import {
  Sparkles,
  Layers,
  FileText,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_CODY_RESUME);
  const [analysis, setAnalysis] = useState<JDStackAnalysis | null>(null);
  const [targetCompany, setTargetCompany] = useState<string>('');
  const [targetRole, setTargetRole] = useState<string>('');
  const [lastJdText, setLastJdText] = useState<string>('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);

  // Step 2: Analyze JD
  const handleAnalyzeJD = async (jdText: string) => {
    setIsAnalyzing(true);
    setAppError(null);
    setLastJdText(jdText);

    try {
      const res = await fetch('/api/analyze-jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jdText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze JD');

      setAnalysis(data);
      if (data.companyName) setTargetCompany(data.companyName);
      if (data.roleTitle) setTargetRole(data.roleTitle);
    } catch (err: any) {
      setAppError(err.message || 'Error analyzing Job Description.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Step 3: Generate Tailored Resume
  const handleGenerateTailoredResume = async (jdText?: string) => {
    const textToUse = jdText || lastJdText;
    if (!textToUse.trim()) {
      setAppError('Please provide a job description first.');
      return;
    }

    setIsGenerating(true);
    setAppError(null);

    const effectiveRole = targetRole || analysis?.roleTitle || 'Senior Software Engineer';
    const effectiveCompany = targetCompany || analysis?.companyName || 'Hiring Company';

    try {
      const res = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jdText: textToUse,
          targetRole: effectiveRole,
          targetCompany: effectiveCompany,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate tailored resume');

      setResumeData(data);
      if (data.coverLetter?.company) setTargetCompany(data.coverLetter.company);
      if (data.title) setTargetRole(data.title);
    } catch (err: any) {
      setAppError(err.message || 'Error generating tailored resume.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectFromBatch = (selectedResume: ResumeData, company: string) => {
    setResumeData(selectedResume);
    setTargetCompany(company);
    setMode('single');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation */}
      <Header mode={mode} onModeChange={setMode} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {appError && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs text-rose-300 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{appError}</span>
            </div>
            <button
              onClick={() => setAppError(null)}
              className="text-xs text-rose-400 hover:text-rose-200 font-semibold cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {mode === 'single' ? (
          <div className="space-y-8">
            {/* Step 1: Input JD (URL or Text) */}
            <JDInputSection
              onAnalyze={handleAnalyzeJD}
              onDirectGenerate={(text) => {
                setLastJdText(text);
                return handleGenerateTailoredResume(text);
              }}
              isAnalyzing={isAnalyzing}
              isGenerating={isGenerating}
            />

            {/* Step 2: JD Analysis Breakdown (if analyzed) */}
            {analysis && (
              <JDAnalysisView
                analysis={analysis}
                onProceedToGenerate={() => handleGenerateTailoredResume()}
                isGenerating={isGenerating}
              />
            )}

            {/* Step 3, 4, 5: Tailored Resume & Cover Letter Viewer with exact React-PDF styling & downloads */}
            {resumeData ? (
              <ResumeViewer
                data={resumeData}
                analysis={analysis}
                targetCompany={targetCompany}
                onUpdateData={setResumeData}
                onRegenerate={() => handleGenerateTailoredResume()}
                isRegenerating={isGenerating}
              />
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto text-2xl">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1.5 max-w-lg mx-auto">
                  <h3 className="text-lg font-bold text-white">
                    No Resume or Cover Letter Loaded
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Paste a Job Description or Job Posting URL above and click <span className="text-amber-400 font-semibold">Direct Tailor Resume</span> to generate an ATS-friendly resume and targeted cover letter tailored to the role.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setResumeData(EMPTY_RESUME)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-400" />
                    Open Blank Document Editor
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 6: Multi-JD Automated Batch Processing */
          <BatchProcessor onSelectResume={handleSelectFromBatch} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Cody Ulsch — Senior Software Engineer Resume & Cover Letter Engine (2026 Edition)
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>ATS-Optimized</span>
            <span>•</span>
            <span>React-PDF Vector Rendering</span>
            <span>•</span>
            <span>Strict 12 / 10 / 8 Bullet Hierarchy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
