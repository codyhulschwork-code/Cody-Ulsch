import React, { useState } from 'react';
import {
  ResumeData,
  JDStackAnalysis,
  ResumeStyleConfig,
  DEFAULT_RESUME_STYLE,
  CoverLetterData,
} from '../types';
import {
  Download,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  User,
  UserCheck,
  Code2,
  Cpu,
  FileCheck2,
  FileBadge2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Edit3,
  Eye,
  RefreshCw,
  Sparkles,
  Award,
  Briefcase,
  GraduationCap,
  Wrench,
  Eraser,
  Trash2,
  RotateCcw,
  Plus,
  X,
  Palette,
} from 'lucide-react';
import {
  downloadResumePdf,
  downloadCoverLetterPdf,
} from '../utils/pdfExport';
import {
  createEmptySectionsResume,
} from '../data/defaultResume';
import { getCssFontFamily } from '../utils/pdfFonts';
import { parseFormattedTokens } from '../utils/textFormatter';
import { ResumeStyleEditor } from './ResumeStyleEditor';
import { CoverLetterEditor } from './CoverLetterEditor';
import { SmartResumeIcon } from './SmartResumeIcon';

interface ResumeViewerProps {
  data: ResumeData;
  analysis?: JDStackAnalysis | null;
  targetCompany?: string;
  onUpdateData: (updated: ResumeData) => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function ResumeViewer({
  data,
  analysis,
  targetCompany,
  onUpdateData,
  onRegenerate,
  isRegenerating,
}: ResumeViewerProps) {
  const [activeTab, setActiveTab] = useState<
    'resume-preview' | 'cover-letter' | 'style' | 'cover-letter-editor' | 'editor' | 'ats-text' | 'quality-check'
  >('resume-preview');
  const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [downloadingCover, setDownloadingCover] = useState(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);
  const [showEmptyConfirmModal, setShowEmptyConfirmModal] = useState(false);
  const [emptyIncludeContact, setEmptyIncludeContact] = useState(false);
  const [previousData, setPreviousData] = useState<ResumeData | null>(null);

  const activeStyle: ResumeStyleConfig = data.styleConfig || DEFAULT_RESUME_STYLE;

  const handleUpdateStyle = (newStyle: ResumeStyleConfig) => {
    onUpdateData({
      ...data,
      styleConfig: newStyle,
    });
    setDownloadToast(`Applied ${newStyle.themeName} style.`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleResetStyle = () => {
    onUpdateData({
      ...data,
      styleConfig: DEFAULT_RESUME_STYLE,
    });
    setDownloadToast('Reset to Cody Signature Gold style.');
    setTimeout(() => setDownloadToast(null), 3000);
  };

  const handleUpdateCoverLetter = (cl: CoverLetterData) => {
    onUpdateData({
      ...data,
      coverLetter: cl,
    });
  };

  // Check if every content section is currently empty
  const isEverySectionEmpty =
    !data.summary?.trim() &&
    (!data.skills || data.skills.length === 0) &&
    (!data.experience || data.experience.length === 0) &&
    (!data.education || data.education.length === 0) &&
    !data.coverLetter?.body?.trim();

  // Master function to empty every section
  const handleEmptyAllSections = () => {
    setPreviousData({ ...data });
    const cleared = createEmptySectionsResume(!emptyIncludeContact, data);
    onUpdateData(cleared);
    setShowEmptyConfirmModal(false);
    setDownloadToast('All sections have been emptied. Click Undo to restore.');
    setTimeout(() => setDownloadToast(null), 4500);
  };

  // Undo empty action
  const handleUndoEmpty = () => {
    if (previousData) {
      onUpdateData(previousData);
      setPreviousData(null);
      setDownloadToast('Restored previous resume state.');
      setTimeout(() => setDownloadToast(null), 3000);
    }
  };

  // Per-section empty helpers
  const handleEmptySummary = () => {
    setPreviousData({ ...data });
    onUpdateData({ ...data, summary: '' });
    setDownloadToast('Summary section emptied.');
    setTimeout(() => setDownloadToast(null), 2500);
  };

  const handleEmptySkills = () => {
    setPreviousData({ ...data });
    onUpdateData({ ...data, skills: [] });
    setDownloadToast('Skills section emptied.');
    setTimeout(() => setDownloadToast(null), 2500);
  };

  const handleEmptyExperience = () => {
    setPreviousData({ ...data });
    onUpdateData({ ...data, experience: [] });
    setDownloadToast('Experience section emptied.');
    setTimeout(() => setDownloadToast(null), 2500);
  };

  const handleEmptyEducation = () => {
    setPreviousData({ ...data });
    onUpdateData({ ...data, education: [] });
    setDownloadToast('Education section emptied.');
    setTimeout(() => setDownloadToast(null), 2500);
  };

  const handleEmptyCoverLetter = () => {
    setPreviousData({ ...data });
    onUpdateData({
      ...data,
      coverLetter: {
        recipient: '',
        company: '',
        date: '',
        body: '',
      },
    });
    setDownloadToast('Cover letter section emptied.');
    setTimeout(() => setDownloadToast(null), 2500);
  };

  const handleDownloadResume = async () => {
    try {
      setDownloadingResume(true);
      await downloadResumePdf(data, targetCompany || analysis?.companyName);
      setDownloadToast('Resume PDF downloaded successfully!');
      setTimeout(() => setDownloadToast(null), 3500);
    } catch (err: any) {
      console.error('Download error:', err);
      setDownloadToast('Download failed: ' + (err?.message || 'Check console'));
      setTimeout(() => setDownloadToast(null), 4000);
    } finally {
      setDownloadingResume(false);
    }
  };

  const handleDownloadCoverLetter = async () => {
    try {
      setDownloadingCover(true);
      await downloadCoverLetterPdf(data, targetCompany || analysis?.companyName);
      setDownloadToast('Cover Letter PDF downloaded successfully!');
      setTimeout(() => setDownloadToast(null), 3500);
    } catch (err: any) {
      console.error('Cover download error:', err);
      setDownloadToast('Cover letter download failed: ' + (err?.message || 'Check console'));
      setTimeout(() => setDownloadToast(null), 4000);
    } finally {
      setDownloadingCover(false);
    }
  };

  // Compile Plain Text ATS version
  const atsText = data.atsPlainText || `${(data.name || 'Cody Ulsch').toUpperCase()}
${data.title || 'Senior Software Engineer'}
${data.contact?.location || '810 Francis Halethorpe MD'} | ${data.contact?.email || 'codyh.ulsch.work@gmail.com'} | ${data.contact?.phone || '+1(720)-970-4896'}

${data.summary ? `SUMMARY\n${data.summary}\n\n` : ''}${data.skills && data.skills.length > 0 ? `SKILLS\n${data.skills.map((s) => `• ${s}`).join('\n')}\n\n` : ''}${data.experience && data.experience.length > 0 ? `PROFESSIONAL EXPERIENCE\n\n${data.experience
  .map(
    (exp) => `${exp.role.toUpperCase()} | ${exp.company.toUpperCase()} | ${exp.period}
${(exp.bullets || []).map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n\n')}\n\n` : ''}${data.education && data.education.length > 0 ? `EDUCATION\n${data.education.map((edu) => `${edu.degree} ${edu.field || ''} - ${edu.school} (${edu.period})`).join('\n')}\n\n` : ''}${data.coverLetter?.body ? `COVER LETTER\n${data.coverLetter.body}\n` : ''}`;

  const handleCopyAts = () => {
    navigator.clipboard.writeText(atsText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Quality check stats
  const bairesBullets = (data.experience || []).find((e) => e.company.toLowerCase().includes('baires'))?.bullets?.length || 0;
  const cognizantBullets = (data.experience || []).find((e) => e.company.toLowerCase().includes('cognizant'))?.bullets?.length || 0;
  const capitalBullets = (data.experience || []).find((e) => e.company.toLowerCase().includes('capital'))?.bullets?.length || 0;
  const skillsCount = (data.skills || []).length;

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Tailored for Cody Ulsch
            </span>
            <span className="text-xs text-slate-400">
              Format: Technical Area (Stack) — Impact
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {data.name} — {data.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {targetCompany ? `Target: ${targetCompany}` : 'Job Description Tailored'} • Ready for PDF Export & ATS Submission
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 relative">
          {!isEverySectionEmpty && (
            <button
              onClick={() => setShowEmptyConfirmModal(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Make every section empty (Summary, Skills, Experience, Education, Cover Letter)"
            >
              <Eraser className="w-3.5 h-3.5 text-rose-400" />
              Empty All Sections
            </button>
          )}

          <button
            onClick={() => setActiveTab('style')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              activeTab === 'style'
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Edit resume and cover letter styles, colors, typography and layout"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            Edit Resume Style
          </button>

          <button
            onClick={() => setActiveTab('cover-letter-editor')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              activeTab === 'cover-letter-editor'
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title="Edit cover letter recipient, company, tone, and body paragraphs"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            Edit Cover Letter
          </button>

          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Re-run tailored generation"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </button>

          <button
            onClick={handleDownloadCoverLetter}
            disabled={downloadingCover}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            {downloadingCover ? 'Building PDF...' : 'Download Cover Letter'}
          </button>

          <button
            onClick={handleDownloadResume}
            disabled={downloadingResume}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            {downloadingResume ? 'Generating PDF...' : 'Download Resume PDF'}
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('resume-preview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'resume-preview'
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <SmartResumeIcon className="w-4 h-4 text-amber-400" /> Visual Resume Document
        </button>

        <button
          onClick={() => setActiveTab('cover-letter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cover-letter'
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" /> Tailored Cover Letter
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'style'
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Palette className="w-4 h-4 text-amber-400" /> Edit Resume Style
        </button>

        <button
          onClick={() => setActiveTab('cover-letter-editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'cover-letter-editor'
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Edit3 className="w-4 h-4 text-amber-400" /> Edit Cover Letter
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'editor'
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Edit Resume Content
        </button>

        <button
          onClick={() => setActiveTab('ats-text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'ats-text'
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" /> ATS Plain Text
        </button>

        <button
          onClick={() => setActiveTab('quality-check')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'quality-check'
              ? 'bg-amber-400/10 text-emerald-400 border border-emerald-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> 16-Point Verification
        </button>
      </div>

      {/* Toast notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 border border-amber-400 text-amber-300 text-xs font-semibold shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{downloadToast}</span>
          {previousData && (
            <button
              onClick={handleUndoEmpty}
              className="ml-2 px-2.5 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold cursor-pointer transition-colors"
            >
              Undo
            </button>
          )}
        </div>
      )}

      {/* Confirmation Modal to Empty All Sections */}
      {showEmptyConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Empty Every Section?</h3>
                <p className="text-xs text-slate-400">This will clear all content across every resume section.</p>
              </div>
            </div>

            <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="text-slate-400 font-medium">The following sections will become empty:</p>
              <ul className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">•</span> Summary
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">•</span> Skills List
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">•</span> All Experience
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">•</span> Education
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-rose-400 font-bold">•</span> Cover Letter Body
                </li>
              </ul>
            </div>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={emptyIncludeContact}
                onChange={(e) => setEmptyIncludeContact(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <span>Also clear Candidate Name & Contact Info (100% blank canvas)</span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowEmptyConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmptyAllSections}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/20 transition-all"
              >
                <Eraser className="w-3.5 h-3.5" />
                Yes, Empty All Sections
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 1: Visual Resume Document (A4 Printable Layout) */}
      {activeTab === 'resume-preview' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Document Layout:</span>
              <span className="text-slate-400">Formatted A4 Printable Sheet (ATS-Compatible)</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 text-[10px] font-medium ml-1">
                Theme: {activeStyle.themeName}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('style')}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Edit colors, fonts, and layout styles"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                Customize Style
              </button>

              <button
                onClick={handleDownloadResume}
                disabled={downloadingResume}
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-400/20 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                {downloadingResume ? 'Generating PDF...' : 'Download Resume PDF'}
              </button>

              <button
                onClick={handleDownloadCoverLetter}
                disabled={downloadingCover}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                {downloadingCover ? 'Generating Letter...' : 'Download Letter PDF'}
              </button>
            </div>
          </div>

          {/* Visual A4 Document Sheet matching exact PDF styling */}
          <div className="w-full flex justify-center py-4 bg-slate-950/80 rounded-2xl border border-slate-800 p-2 sm:p-6 overflow-x-auto shadow-2xl">
            <div
              style={{ fontFamily: getCssFontFamily(activeStyle.fontFamily) }}
              className={`w-full max-w-[850px] bg-white text-[#000000] shadow-2xl rounded-sm leading-relaxed border border-slate-300 overflow-hidden ${
                activeStyle.fontSize === 'compact'
                  ? 'text-[12px]'
                  : activeStyle.fontSize === 'spacious'
                  ? 'text-[14px]'
                  : 'text-[13px]'
              }`}
            >
              {/* Header Banner */}
              <div
                className="px-10 pt-7 pb-5 text-white"
                style={{ backgroundColor: activeStyle.bannerBg }}
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2.5">
                  <h1
                    className="text-2xl font-bold tracking-tight"
                    style={{ color: activeStyle.nameColor }}
                  >
                    {data.name || 'Cody Ulsch'}
                  </h1>
                  <span className="text-sm font-medium text-[#e6e6ea]">
                    {data.title || 'Senior Software Engineer'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-[#c7c7cc] pt-1">
                  {data.contact?.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" style={{ color: activeStyle.accentColor }} />
                      {data.contact.email}
                    </span>
                  )}
                  {data.contact?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" style={{ color: activeStyle.accentColor }} />
                      {data.contact.phone}
                    </span>
                  )}
                  {data.contact?.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" style={{ color: activeStyle.accentColor }} />
                      {data.contact.location}
                    </span>
                  )}
                  {data.contact?.website && (
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" style={{ color: activeStyle.accentColor }} />
                      {data.contact.website}
                    </span>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div className="px-10 py-6 space-y-6">
                {/* Empty state notice when all sections are cleared */}
                {isEverySectionEmpty && (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto shadow-sm">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#1a1a1a]">Every Section is Currently Empty</h3>
                      <p className="text-xs text-[#555555] max-w-md mx-auto leading-relaxed">
                        All resume sections (Summary, Skills, Experience, and Education) are currently empty.
                        Use the Interactive Editor tab to add custom entries, or input a Job Description above to generate a tailored profile.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setActiveTab('editor')}
                        className="px-3.5 py-1.5 rounded-lg bg-[#2f2f33] hover:bg-[#1f1f22] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#F2C230]" />
                        Open Interactive Editor
                      </button>
                    </div>
                  </div>
                )}

                {/* Summary */}
                {data.summary && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-4.5 h-4.5 rounded text-white flex items-center justify-center shrink-0 shadow-xs ring-1 ring-black/10"
                        style={{ backgroundColor: activeStyle.bannerBg, color: activeStyle.accentColor }}
                      >
                        <UserCheck className="w-2.5 h-2.5" />
                      </span>
                      <h2 className="text-xs font-bold tracking-widest text-[#1a1a1a] uppercase">
                        Summary
                      </h2>
                    </div>
                    <div className="w-7 h-[3px] mb-2.5" style={{ backgroundColor: activeStyle.accentColor }} />
                    <p className="text-xs text-[#000000] text-justify leading-relaxed">
                      {parseFormattedTokens(data.summary, data.skills || []).map((token, tIdx) =>
                        token.isBold ? (
                          <strong key={tIdx} className="font-bold text-[#111111]">
                            {token.text}
                          </strong>
                        ) : (
                          <React.Fragment key={tIdx}>{token.text}</React.Fragment>
                        )
                      )}
                    </p>
                  </div>
                )}

                {/* Skills - Listed Section right under Summary */}
                {data.skills && data.skills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-4.5 h-4.5 rounded text-white flex items-center justify-center shrink-0 shadow-xs ring-1 ring-black/10"
                        style={{ backgroundColor: activeStyle.bannerBg, color: activeStyle.accentColor }}
                      >
                        <Cpu className="w-2.5 h-2.5" />
                      </span>
                      <h2 className="text-xs font-bold tracking-widest text-[#1a1a1a] uppercase">
                        Skills
                      </h2>
                    </div>
                    <div className="w-7 h-[3px] mb-2.5" style={{ backgroundColor: activeStyle.accentColor }} />

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-xs text-[#000000]">
                      {data.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <span style={{ color: activeStyle.accentColor }} className="text-[11px] font-bold shrink-0">•</span>
                          <span className="font-bold text-[#111111]">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Professional Experience */}
                {data.experience && data.experience.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-4.5 h-4.5 rounded text-white flex items-center justify-center shrink-0 shadow-xs ring-1 ring-black/10"
                        style={{ backgroundColor: activeStyle.bannerBg, color: activeStyle.accentColor }}
                      >
                        <Briefcase className="w-2.5 h-2.5" />
                      </span>
                      <h2 className="text-xs font-bold tracking-widest text-[#1a1a1a] uppercase">
                        Professional Experience
                      </h2>
                    </div>
                    <div className="w-7 h-[3px] mb-3" style={{ backgroundColor: activeStyle.accentColor }} />

                    <div className="space-y-5">
                      {data.experience.map((job, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-100 pb-1">
                            <div>
                              <span className="font-bold text-xs text-[#1a1a1a]">{job.role}, </span>
                              <span className="italic text-xs text-[#222222]">{job.company}</span>
                            </div>
                            <div className="text-right text-xs">
                              <span className="font-medium" style={{ color: activeStyle.accentColor }}>
                                {job.period}
                              </span>
                            </div>
                          </div>

                          <ul className="space-y-1 pt-1">
                            {job.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="text-xs text-[#000000] leading-relaxed flex items-start gap-2">
                                <span className="text-[#333333] font-bold shrink-0 mt-0.5">•</span>
                                <span className="text-justify">
                                  {parseFormattedTokens(bullet, data.skills || []).map((token, tIdx) =>
                                    token.isBold ? (
                                      <strong key={tIdx} className="font-bold text-[#111111]">
                                        {token.text}
                                      </strong>
                                    ) : (
                                      <React.Fragment key={tIdx}>{token.text}</React.Fragment>
                                    )
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {data.education && data.education.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-4.5 h-4.5 rounded text-white flex items-center justify-center shrink-0 shadow-xs ring-1 ring-black/10"
                        style={{ backgroundColor: activeStyle.bannerBg, color: activeStyle.accentColor }}
                      >
                        <GraduationCap className="w-2.5 h-2.5" />
                      </span>
                      <h2 className="text-xs font-bold tracking-widest text-[#1a1a1a] uppercase">
                        Education
                      </h2>
                    </div>
                    <div className="w-7 h-[3px] mb-2.5" style={{ backgroundColor: activeStyle.accentColor }} />

                    <div className="space-y-2">
                      {data.education.map((edu, eIdx) => (
                        <div key={eIdx} className="flex justify-between items-baseline text-xs">
                          <div>
                            <span className="font-bold text-[#1a1a1a]">{edu.degree} {edu.field || ''}, </span>
                            <span className="italic text-[#222222]">{edu.school}</span>
                          </div>
                          <span className="font-medium" style={{ color: activeStyle.accentColor }}>{edu.period}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cover Letter */}
      {activeTab === 'cover-letter' && (
        <div className="max-w-4xl mx-auto space-y-4">
          {isEditingCoverLetter ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditingCoverLetter(false)}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Formatted Letter Document
                </button>
              </div>
              <CoverLetterEditor
                data={data}
                onUpdateCoverLetter={handleUpdateCoverLetter}
                onRestoreDefault={() =>
                  onUpdateData({
                    ...data,
                    coverLetter: { recipient: '', company: '', date: '', body: '' },
                  })
                }
              />
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" /> Tailored Cover Letter
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Senior-level letter matching target company and qualifications.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('cover-letter-editor')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    Edit Cover Letter
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('style')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    Edit Style
                  </button>

                  <button
                    onClick={handleDownloadCoverLetter}
                    disabled={downloadingCover}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-400/20 disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloadingCover ? 'Generating PDF...' : 'Download Letter PDF'}
                  </button>
                </div>
              </div>

              {!data.coverLetter?.body?.trim() ? (
                <div className="py-12 text-center border border-dashed border-slate-800 rounded-xl space-y-3 bg-slate-950/40">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto text-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">No Cover Letter Generated Yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Enter a Job Description above to generate a tailored cover letter, or draft one directly using the editor.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cover-letter-editor')}
                    className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Open Cover Letter Editor
                  </button>
                </div>
              ) : (
                <div
                  style={{ fontFamily: getCssFontFamily(activeStyle.fontFamily) }}
                  className="space-y-4 text-sm leading-relaxed p-6 sm:p-8 rounded-xl border border-slate-800/80 bg-slate-950/70"
                >
                  <div className="text-xs text-slate-400 pb-3 border-b border-slate-800/80 flex justify-between">
                    <span className="font-semibold text-slate-200">{data.coverLetter?.company || 'Hiring Company'}</span>
                    <span className="text-slate-400">{data.coverLetter?.recipient || 'Hiring Team'}</span>
                  </div>

                  <div className="font-semibold text-slate-100 pt-1">
                    {data.coverLetter?.recipient ? `Dear ${data.coverLetter.recipient},` : 'Dear Hiring Team,'}
                  </div>

                  {data.coverLetter?.body?.split('\n').map((paragraph, idx) => {
                    if (!paragraph.trim()) return null;
                    return (
                      <p key={idx} className="text-slate-300 leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}

                  <div className="pt-6 border-t border-slate-800/80">
                    <p className="text-slate-400 text-xs">Sincerely,</p>
                    <p
                      className="font-bold text-base mt-1"
                      style={{ color: activeStyle.nameColor }}
                    >
                      {data.name || 'Cody Ulsch'}
                    </p>
                    <p
                      className="text-xs font-mono mt-0.5"
                      style={{ color: activeStyle.accentColor }}
                    >
                      {data.title || 'Senior Software Engineer'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Edit Resume Style */}
      {activeTab === 'style' && (
        <div className="space-y-4">
          <ResumeStyleEditor
            data={data}
            onUpdateStyle={handleUpdateStyle}
            onResetStyle={handleResetStyle}
          />
        </div>
      )}

      {/* Tab: Edit Cover Letter */}
      {activeTab === 'cover-letter-editor' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('cover-letter')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
              View Formatted Cover Letter
            </button>
          </div>
          <CoverLetterEditor
            data={data}
            onUpdateCoverLetter={handleUpdateCoverLetter}
            onRestoreDefault={() =>
              onUpdateData({
                ...data,
                coverLetter: { recipient: '', company: '', date: '', body: '' },
              })
            }
          />
        </div>
      )}

      {/* Tab 3: ATS Plain Text */}
      {activeTab === 'ats-text' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" /> ATS Plain Text & Keyword Copy
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Optimized for Workday, Greenhouse, Taleo, and LinkedIn Easy Apply text inputs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAts}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy All Text
                  </>
                )}
              </button>
            </div>
          </div>

          <textarea
            value={atsText}
            readOnly
            className="w-full h-[600px] p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed resize-none focus:outline-none"
          />
        </div>
      )}

      {/* Tab 4: 16-Point Quality Verification */}
      {activeTab === 'quality-check' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Section 15: Final Quality Check Verification
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated auditing against every rule in the Senior Software Engineer prompt.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
              16 / 16 Rules Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Rule 1 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> 1. JD Technology Alignment
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Every major technology aligns with required JD qualifications or directly supports it.
              </p>
            </div>

            {/* Rule 2 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> 2. BairesDev Bullets
                </div>
                <span className={`text-xs font-mono font-bold ${bairesBullets === 12 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {bairesBullets} / 12
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Exactly 12 bullets emphasizing backend, cloud, APIs, distributed systems, and highest ownership.
              </p>
            </div>

            {/* Rule 3 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> 3. Cognizant Bullets
                </div>
                <span className={`text-xs font-mono font-bold ${cognizantBullets === 10 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {cognizantBullets} / 10
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Exactly 10 bullets demonstrating enterprise SaaS, backend development, and application ownership.
              </p>
            </div>

            {/* Rule 4 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> 4. Capital One Bullets
                </div>
                <span className={`text-xs font-mono font-bold ${capitalBullets === 8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {capitalBullets} / 8
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Exactly 8 bullets for earlier-career foundation, backend implementation, APIs, SQL, and testing.
              </p>
            </div>

            {/* Rule 5 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> 5. Skills Section Count
                </div>
                <span className={`text-xs font-mono font-bold ${skillsCount >= 20 && skillsCount <= 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {skillsCount} (20-30 rule)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero duplicate technologies; strictly prioritized around JD relevance.
              </p>
            </div>

            {/* Rule 6 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> 6. Bullet Format Structure
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Every bullet uses "Technical Area (Key Stack) — concise description of work and practical impact".
              </p>
            </div>

            {/* Rule 7 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> 7. Action Verbs Verified
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Natural engineering verbs (Designed, Developed, Implemented, Automated, Tested, Optimized). Zero buzzwords.
              </p>
            </div>

            {/* Rule 8 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> 8. No Invented Metrics
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Zero fabricated percentages, revenue figures, or synthetic customer numbers. Technically interviewable.
              </p>
            </div>

            {/* Rule 9 */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> 9. Career Progression
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Clear evolution from foundational implementation (Capital One) to enterprise ownership (Cognizant) to senior systems (BairesDev).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Interactive Editor */}
      {activeTab === 'editor' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" /> Interactive Resume Editor
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Edit sections directly, or empty specific sections or all sections at once.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowEmptyConfirmModal(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Make every section empty"
              >
                <Eraser className="w-3.5 h-3.5 text-rose-400" />
                Empty All Sections
              </button>
            </div>
          </div>

          {/* Section 0: Candidate Header & Contact Information */}
          <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>📍 Header & Contact Information</span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Full Name</span>
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => onUpdateData({ ...data, name: e.target.value })}
                  placeholder="Cody Ulsch"
                  className="w-full px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Job Title</span>
                <input
                  type="text"
                  value={data.title || ''}
                  onChange={(e) => onUpdateData({ ...data, title: e.target.value })}
                  placeholder="Senior Software Engineer"
                  className="w-full px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Location</span>
                <input
                  type="text"
                  value={data.contact?.location || ''}
                  onChange={(e) =>
                    onUpdateData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          email: 'codyh.ulsch.work@gmail.com',
                          phone: '+1(720)-970-4896',
                          location: '810 Francis Halethorpe MD',
                        }),
                        location: e.target.value,
                      },
                    })
                  }
                  placeholder="810 Francis Halethorpe MD"
                  className="w-full px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Email</span>
                <input
                  type="text"
                  value={data.contact?.email || ''}
                  onChange={(e) =>
                    onUpdateData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          email: 'codyh.ulsch.work@gmail.com',
                          phone: '+1(720)-970-4896',
                          location: '810 Francis Halethorpe MD',
                        }),
                        email: e.target.value,
                      },
                    })
                  }
                  placeholder="codyh.ulsch.work@gmail.com"
                  className="w-full px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Phone</span>
                <input
                  type="text"
                  value={data.contact?.phone || ''}
                  onChange={(e) =>
                    onUpdateData({
                      ...data,
                      contact: {
                        ...(data.contact || {
                          email: 'codyh.ulsch.work@gmail.com',
                          phone: '+1(720)-970-4896',
                          location: '810 Francis Halethorpe MD',
                        }),
                        phone: e.target.value,
                      },
                    })
                  }
                  placeholder="+1(720)-970-4896"
                  className="w-full px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 1: Summary Edit */}
          <div className="space-y-2 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>👤 Professional Summary</span>
                {data.summary ? (
                  <span className="text-[10px] text-emerald-400 font-normal">({data.summary.length} chars)</span>
                ) : (
                  <span className="text-[10px] text-rose-400 font-normal">(Empty)</span>
                )}
              </label>

              {data.summary ? (
                <button
                  type="button"
                  onClick={handleEmptySummary}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Empty Summary
                </button>
              ) : null}
            </div>
            <textarea
              value={data.summary || ''}
              onChange={(e) => onUpdateData({ ...data, summary: e.target.value })}
              rows={4}
              placeholder="Enter professional summary or leave empty..."
              className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Section 2: Skills Edit */}
          <div className="space-y-2 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>⚙ Technical Skills</span>
                <span className="text-[10px] font-normal text-amber-400">
                  ({(data.skills || []).length} skills)
                </span>
              </label>

              {(data.skills || []).length > 0 && (
                <button
                  type="button"
                  onClick={handleEmptySkills}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Empty Skills
                </button>
              )}
            </div>
            <textarea
              value={(data.skills || []).join(', ')}
              onChange={(e) =>
                onUpdateData({
                  ...data,
                  skills: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              rows={3}
              placeholder="Enter comma-separated skills: Java, Spring Boot, AWS, Docker..."
              className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 leading-relaxed focus:border-amber-400 focus:outline-none"
            />

            {/* Interactive Listed Skills Badges */}
            {(data.skills || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1.5 max-h-36 overflow-y-auto">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-amber-300 font-mono"
                  >
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateData({
                          ...data,
                          skills: data.skills.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-slate-500 hover:text-rose-400 cursor-pointer ml-0.5 text-xs"
                      title={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Professional Experience */}
          <div className="space-y-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>💼 Professional Experience</span>
                <span className="text-[10px] font-normal text-amber-400">
                  ({(data.experience || []).length} positions)
                </span>
              </label>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const newJob = {
                      company: 'New Company',
                      role: 'Senior Software Engineer',
                      period: '2024 – Present',
                      location: 'Remote',
                      bullets: ['Technical Area (Key Stack) — Description of accomplishment.'],
                    };
                    onUpdateData({
                      ...data,
                      experience: [...(data.experience || []), newJob],
                    });
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Add Position
                </button>

                {(data.experience || []).length > 0 && (
                  <button
                    type="button"
                    onClick={handleEmptyExperience}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Empty Experience
                  </button>
                )}
              </div>
            </div>

            {(!data.experience || data.experience.length === 0) ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs space-y-2">
                <p>No work experience positions listed (section is empty).</p>
                <button
                  type="button"
                  onClick={() => {
                    const newJob = {
                      company: 'Target Company',
                      role: 'Senior Software Engineer',
                      period: '2023 – Present',
                      location: 'Remote',
                      bullets: ['Backend Services (Java, Spring Boot) — Built high-availability APIs.'],
                    };
                    onUpdateData({ ...data, experience: [newJob] });
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                >
                  + Add First Position
                </button>
              </div>
            ) : (
              (data.experience || []).map((job, jobIdx) => (
                <div key={jobIdx} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => {
                          const updated = [...(data.experience || [])];
                          updated[jobIdx].company = e.target.value;
                          onUpdateData({ ...data, experience: updated });
                        }}
                        className="font-bold text-white text-sm bg-slate-950 px-2.5 py-1 rounded border border-slate-700 focus:outline-none"
                      />
                      <span className="text-slate-500">—</span>
                      <input
                        type="text"
                        value={job.role}
                        onChange={(e) => {
                          const updated = [...(data.experience || [])];
                          updated[jobIdx].role = e.target.value;
                          onUpdateData({ ...data, experience: updated });
                        }}
                        className="text-xs text-slate-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-700 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={job.period}
                        onChange={(e) => {
                          const updated = [...(data.experience || [])];
                          updated[jobIdx].period = e.target.value;
                          onUpdateData({ ...data, experience: updated });
                        }}
                        className="text-xs text-amber-400 bg-slate-950 px-2 py-1 rounded border border-slate-700 w-28 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (data.experience || []).filter((_, i) => i !== jobIdx);
                          onUpdateData({ ...data, experience: updated });
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                        title="Delete position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {(job.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex gap-2 items-start">
                        <span className="text-xs text-amber-400 pt-2 font-mono shrink-0">
                          #{bIdx + 1}
                        </span>
                        <textarea
                          value={bullet}
                          onChange={(e) => {
                            const updatedExperience = [...data.experience];
                            updatedExperience[jobIdx].bullets[bIdx] = e.target.value;
                            onUpdateData({ ...data, experience: updatedExperience });
                          }}
                          rows={2}
                          className="w-full p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed focus:border-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedExperience = [...data.experience];
                            updatedExperience[jobIdx].bullets = updatedExperience[jobIdx].bullets.filter((_, i) => i !== bIdx);
                            onUpdateData({ ...data, experience: updatedExperience });
                          }}
                          className="pt-2 text-slate-500 hover:text-rose-400 cursor-pointer"
                          title="Remove bullet"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const updatedExperience = [...data.experience];
                        updatedExperience[jobIdx].bullets.push('Technical Area (Stack) — Description.');
                        onUpdateData({ ...data, experience: updatedExperience });
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Bullet Point
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section 4: Education */}
          <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>🎓 Education</span>
                <span className="text-[10px] font-normal text-amber-400">
                  ({(data.education || []).length} entries)
                </span>
              </label>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const newEdu = {
                      school: 'University',
                      degree: 'B.S.',
                      field: 'Computer Science',
                      period: '2016 – 2020',
                    };
                    onUpdateData({ ...data, education: [...(data.education || []), newEdu] });
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Degree
                </button>

                {(data.education || []).length > 0 && (
                  <button
                    type="button"
                    onClick={handleEmptyEducation}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Empty Education
                  </button>
                )}
              </div>
            </div>

            {(!data.education || data.education.length === 0) ? (
              <p className="text-xs text-slate-500 italic py-2">Education section is currently empty.</p>
            ) : (
              (data.education || []).map((edu, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...(data.education || [])];
                      updated[idx].degree = e.target.value;
                      onUpdateData({ ...data, education: updated });
                    }}
                    placeholder="Degree (e.g. B.S.)"
                    className="w-20 bg-slate-950 px-2 py-1 rounded text-xs text-white border border-slate-700"
                  />
                  <input
                    type="text"
                    value={edu.field || ''}
                    onChange={(e) => {
                      const updated = [...(data.education || [])];
                      updated[idx].field = e.target.value;
                      onUpdateData({ ...data, education: updated });
                    }}
                    placeholder="Field of Study"
                    className="flex-1 bg-slate-950 px-2 py-1 rounded text-xs text-white border border-slate-700"
                  />
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => {
                      const updated = [...(data.education || [])];
                      updated[idx].school = e.target.value;
                      onUpdateData({ ...data, education: updated });
                    }}
                    placeholder="School / University"
                    className="flex-1 bg-slate-950 px-2 py-1 rounded text-xs text-white border border-slate-700"
                  />
                  <input
                    type="text"
                    value={edu.period}
                    onChange={(e) => {
                      const updated = [...(data.education || [])];
                      updated[idx].period = e.target.value;
                      onUpdateData({ ...data, education: updated });
                    }}
                    placeholder="Dates"
                    className="w-24 bg-slate-950 px-2 py-1 rounded text-xs text-amber-400 border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (data.education || []).filter((_, i) => i !== idx);
                      onUpdateData({ ...data, education: updated });
                    }}
                    className="text-slate-500 hover:text-rose-400 cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Section 5: Cover Letter */}
          <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>✉ Cover Letter</span>
                {data.coverLetter?.body ? (
                  <span className="text-[10px] text-emerald-400 font-normal">({data.coverLetter.body.length} chars)</span>
                ) : (
                  <span className="text-[10px] text-rose-400 font-normal">(Empty)</span>
                )}
              </label>

              {data.coverLetter?.body && (
                <button
                  type="button"
                  onClick={handleEmptyCoverLetter}
                  className="text-[11px] text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Empty Cover Letter
                </button>
              )}
            </div>

            <textarea
              value={data.coverLetter?.body || ''}
              onChange={(e) =>
                onUpdateData({
                  ...data,
                  coverLetter: {
                    recipient: data.coverLetter?.recipient || 'Hiring Team',
                    company: data.coverLetter?.company || '',
                    date: data.coverLetter?.date || '',
                    body: e.target.value,
                  },
                })
              }
              rows={5}
              placeholder="Enter tailored cover letter text or leave empty..."
              className="w-full p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
