import React from 'react';
import {
  FileText,
  Layers,
  Sparkles,
  ShieldCheck,
  User,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { SmartResumeIcon } from './SmartResumeIcon';

interface HeaderProps {
  mode: 'single' | 'batch';
  onModeChange: (mode: 'single' | 'batch') => void;
}

export function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand & Candidate */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 ring-1 ring-amber-300/60 transition-transform hover:scale-105">
            <SmartResumeIcon className="w-5 h-5 text-slate-950" glow />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">
                Cody Ulsch — Authentic Senior Software Engineer Resume Generator
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                2026 EDITION
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1 text-slate-300">
                <Mail className="w-3 h-3 text-amber-400" /> codyh.ulsch.work@gmail.com
              </span>
              <span className="hidden md:flex items-center gap-1 text-slate-300">
                <Phone className="w-3 h-3 text-amber-400" /> +1(720)-970-4896
              </span>
              <span className="hidden sm:flex items-center gap-1 text-slate-400">
                <MapPin className="w-3 h-3 text-amber-400" /> 810 Francis Halethorpe MD
              </span>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center">
            <button
              onClick={() => onModeChange('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'single'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SmartResumeIcon className="w-3.5 h-3.5" /> Single JD Flow
            </button>
            <button
              onClick={() => onModeChange('batch')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                mode === 'batch'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Batch Multi-JD Mode
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
