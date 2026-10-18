import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Trash2,
  Sparkles,
  RotateCcw,
  Check,
  Building,
  User,
  Eraser,
  FileText,
} from 'lucide-react';
import { CoverLetterData, ResumeData } from '../types';

interface CoverLetterEditorProps {
  data: ResumeData;
  onUpdateCoverLetter: (coverLetter: CoverLetterData) => void;
  onRestoreDefault: () => void;
}

export function CoverLetterEditor({
  data,
  onUpdateCoverLetter,
  onRestoreDefault,
}: CoverLetterEditorProps) {
  const cl: CoverLetterData = data.coverLetter || {
    recipient: 'Hiring Team',
    company: 'Target Company',
    date: '',
    body: '',
  };

  const paragraphs = cl.body ? cl.body.split('\n\n').filter((p) => p.trim()) : [];

  const recipientSuggestions = [
    'Hiring Team',
    'Engineering Hiring Manager',
    'VP of Engineering',
    'Director of Software Engineering',
    'Technical Recruiter',
  ];

  const handleUpdateField = (field: keyof CoverLetterData, value: string) => {
    onUpdateCoverLetter({
      ...cl,
      [field]: value,
    });
  };

  const handleParagraphChange = (index: number, newText: string) => {
    const updated = [...paragraphs];
    updated[index] = newText;
    handleUpdateField('body', updated.join('\n\n'));
  };

  const handleAddParagraph = (text = 'I would welcome the opportunity to discuss how my senior engineering background can contribute to your engineering team.') => {
    const updated = [...paragraphs, text];
    handleUpdateField('body', updated.join('\n\n'));
  };

  const handleRemoveParagraph = (index: number) => {
    const updated = paragraphs.filter((_, i) => i !== index);
    handleUpdateField('body', updated.join('\n\n'));
  };

  const handleInjectTone = (tone: 'scale' | 'leadership' | 'cloud') => {
    let snippet = '';
    if (tone === 'scale') {
      snippet =
        'Throughout my career, I have specialized in architecting high-throughput distributed systems capable of processing millions of daily transactions with sub-second latencies. I prioritize fault tolerance, resilient stream processing with Kafka, and continuous database performance optimization.';
    } else if (tone === 'leadership') {
      snippet =
        'Beyond technical execution, I lead cross-functional engineering initiatives, mentor senior and mid-level engineers, and institutionalize rigorous CI/CD practices. I partner closely with product teams to translate complex business objectives into dependable, maintainable software architectures.';
    } else if (tone === 'cloud') {
      snippet =
        'My cloud engineering expertise centers on AWS, Docker, Kubernetes, and automated infrastructure. I design cloud-native microservices with robust observability, comprehensive automated testing, and secure, zero-downtime deployment pipelines.';
    }

    handleAddParagraph(snippet);
  };

  const handleEmpty = () => {
    onUpdateCoverLetter({
      ...cl,
      body: '',
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" /> Interactive Cover Letter Editor
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Customize recipient, company name, body paragraphs, and professional tone.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleEmpty}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eraser className="w-3.5 h-3.5 text-rose-400" />
            Clear Letter Body
          </button>

          <button
            type="button"
            onClick={onRestoreDefault}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            Restore Default
          </button>
        </div>
      </div>

      {/* Recipient & Company Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recipient */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-400" /> Recipient Name / Title
          </label>
          <input
            type="text"
            value={cl.recipient}
            onChange={(e) => handleUpdateField('recipient', e.target.value)}
            placeholder="e.g. Hiring Team, Engineering Hiring Manager"
            className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />

          <div className="flex flex-wrap gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 self-center">Quick:</span>
            {recipientSuggestions.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => handleUpdateField('recipient', sug)}
                className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
                  cl.recipient === sug
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-semibold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Company Name */}
        <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" /> Target Company Name
          </label>
          <input
            type="text"
            value={cl.company}
            onChange={(e) => handleUpdateField('company', e.target.value)}
            placeholder="e.g. Google, Stripe, Capital One, Target Corp"
            className="w-full px-3 py-2 bg-slate-900 rounded-lg border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />
          <p className="text-[11px] text-slate-500">
            Automatically included in the letter header and salutation.
          </p>
        </div>
      </div>

      {/* Tone & Topic Quick Injectors */}
      <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Insert Pre-Engineered Focus Paragraphs
          </label>
          <span className="text-[10px] text-slate-500">Click to append tailored senior-level paragraph</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleInjectTone('scale')}
            className="p-2.5 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-left text-xs transition-colors cursor-pointer group"
          >
            <span className="font-semibold text-amber-400 block group-hover:text-amber-300">
              + Distributed Systems & Scale
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
              Focuses on high-throughput microservices, sub-second latency, and fault tolerance.
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleInjectTone('leadership')}
            className="p-2.5 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-left text-xs transition-colors cursor-pointer group"
          >
            <span className="font-semibold text-amber-400 block group-hover:text-amber-300">
              + Technical Leadership & Velocity
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
              Focuses on team mentoring, automated CI/CD pipelines, and cross-functional partnerships.
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleInjectTone('cloud')}
            className="p-2.5 bg-slate-900 hover:bg-slate-850 rounded-lg border border-slate-800 text-left text-xs transition-colors cursor-pointer group"
          >
            <span className="font-semibold text-amber-400 block group-hover:text-amber-300">
              + Cloud & Modern Architecture
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">
              Focuses on AWS cloud-native services, Docker, Kubernetes, and observability.
            </span>
          </button>
        </div>
      </div>

      {/* Paragraphs List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-amber-400" /> Letter Paragraphs ({paragraphs.length})
          </label>

          <button
            type="button"
            onClick={() => handleAddParagraph()}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Paragraph
          </button>
        </div>

        {paragraphs.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs space-y-2">
            <p>The cover letter body is currently empty.</p>
            <button
              type="button"
              onClick={() => handleAddParagraph()}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Add Paragraph
            </button>
          </div>
        ) : (
          paragraphs.map((p, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2 relative"
            >
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="font-semibold text-slate-400">Paragraph #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveParagraph(idx)}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                  title="Remove this paragraph"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                value={p}
                onChange={(e) => handleParagraphChange(idx, e.target.value)}
                rows={4}
                className="w-full p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-amber-400"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CoverLetterEditor;
