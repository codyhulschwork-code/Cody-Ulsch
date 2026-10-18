import React from 'react';
import { JDStackAnalysis } from '../types';
import {
  CheckCircle2,
  Layers,
  Server,
  Cloud,
  Database,
  Terminal,
  Activity,
  Cpu,
  ShieldCheck,
  Workflow,
  Sparkles,
  GitBranch,
} from 'lucide-react';

interface JDAnalysisViewProps {
  analysis: JDStackAnalysis;
  onProceedToGenerate: () => void;
  isGenerating: boolean;
}

export function JDAnalysisView({
  analysis,
  onProceedToGenerate,
  isGenerating,
}: JDAnalysisViewProps) {
  const stackEntries = [
    { label: 'Backend', items: analysis.stackAnalysis?.backend, icon: Server, color: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40' },
    { label: 'Cloud', items: analysis.stackAnalysis?.cloud, icon: Cloud, color: 'text-sky-400 bg-sky-950/40 border-sky-800/40' },
    { label: 'Database', items: analysis.stackAnalysis?.database, icon: Database, color: 'text-amber-400 bg-amber-950/40 border-amber-800/40' },
    { label: 'Containers & Infra', items: analysis.stackAnalysis?.containersInfra, icon: Cpu, color: 'text-purple-400 bg-purple-950/40 border-purple-800/40' },
    { label: 'DevOps & CI/CD', items: analysis.stackAnalysis?.devopsCiCd, icon: GitBranch, color: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40' },
    { label: 'Messaging & Events', items: analysis.stackAnalysis?.messagingEvents, icon: Workflow, color: 'text-rose-400 bg-rose-950/40 border-rose-800/40' },
    { label: 'Observability', items: analysis.stackAnalysis?.observability, icon: Activity, color: 'text-teal-400 bg-teal-950/40 border-teal-800/40' },
    { label: 'Architecture', items: analysis.stackAnalysis?.architecture, icon: Layers, color: 'text-indigo-400 bg-indigo-950/40 border-indigo-800/40' },
    { label: 'Testing', items: analysis.stackAnalysis?.testing, icon: ShieldCheck, color: 'text-lime-400 bg-lime-950/40 border-lime-800/40' },
    { label: 'Frontend', items: analysis.stackAnalysis?.frontend, icon: Terminal, color: 'text-blue-400 bg-blue-950/40 border-blue-800/40' },
    { label: 'AI & Automation', items: analysis.stackAnalysis?.aiAutomation, icon: Sparkles, color: 'text-fuchsia-400 bg-fuchsia-950/40 border-fuchsia-800/40' },
  ].filter((s) => s.items && s.items.length > 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Step 2: JD Analyzed
            </span>
            {analysis.workModel && (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {analysis.workModel}
              </span>
            )}
            {analysis.experienceLevel && (
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {analysis.experienceLevel}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white mt-1.5">
            {analysis.roleTitle || 'Senior Software Engineer'}
            {analysis.companyName ? ` • ${analysis.companyName}` : ''}
          </h3>
          {analysis.summaryAssessment && (
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              {analysis.summaryAssessment}
            </p>
          )}
        </div>

        <button
          onClick={onProceedToGenerate}
          disabled={isGenerating}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Tailoring Resume & Letter...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Tailored Resume & Letter
            </>
          )}
        </button>
      </div>

      {/* Core Engineering Themes */}
      {analysis.keyEngineeringThemes && analysis.keyEngineeringThemes.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Target Engineering Focus & Responsibilities
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.keyEngineeringThemes.map((theme, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700/60"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Stack Breakdown */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          JD Stack Distribution (Section 9 Analysis)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stackEntries.map((entry, idx) => {
            const IconComp = entry.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <IconComp className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-200">{entry.label}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {entry.items?.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className={`text-xs px-2 py-0.5 rounded border font-mono ${entry.color}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority Skills for Resume (Rule 11) */}
      <div className="pt-2 border-t border-slate-800/60">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Selected High-Priority Skills for Cody's Resume (12–20 limit, no duplicates)
          </h4>
          <span className="text-xs font-mono text-amber-400">
            {analysis.recommendedSkills?.length || 0} skills selected
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {analysis.recommendedSkills?.map((skill, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-1 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/30 font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
