import React from 'react';
import {
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Type,
  Sliders,
  Layout,
  Layers,
} from 'lucide-react';
import {
  ResumeStyleConfig,
  RESUME_THEME_PRESETS,
  DEFAULT_RESUME_STYLE,
  ResumeData,
} from '../types';
import { SUPPORTED_FONTS } from '../utils/pdfFonts';

interface ResumeStyleEditorProps {
  data: ResumeData;
  onUpdateStyle: (style: ResumeStyleConfig) => void;
  onResetStyle: () => void;
}

export function ResumeStyleEditor({
  data,
  onUpdateStyle,
  onResetStyle,
}: ResumeStyleEditorProps) {
  const currentStyle: ResumeStyleConfig = data.styleConfig || DEFAULT_RESUME_STYLE;
  const [fontCategory, setFontCategory] = React.useState<'all' | 'Sans-Serif' | 'Serif' | 'Monospace'>('all');
  const [fontSearch, setFontSearch] = React.useState('');

  const handleSelectPreset = (preset: ResumeStyleConfig) => {
    onUpdateStyle({
      ...preset,
      fontSize: currentStyle.fontSize,
      spacing: currentStyle.spacing,
    });
  };

  const handleUpdate = (updates: Partial<ResumeStyleConfig>) => {
    onUpdateStyle({
      ...currentStyle,
      ...updates,
      themeId: 'custom',
      themeName: 'Custom Theme',
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-amber-400" /> Resume & Cover Letter Style Customizer
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Customize colors, typography, density, and layout. Styles apply seamlessly to both the visual document and PDF exports.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetStyle}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          Reset to Signature Style
        </button>
      </div>

      {/* Preset Themes Grid */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Designer Theme Presets
        </label>
        <p className="text-xs text-slate-400">
          Select an ATS-optimized, executive color palette engineered for readability and high contrast.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {RESUME_THEME_PRESETS.map((preset) => {
            const isSelected =
              currentStyle.bannerBg === preset.bannerBg &&
              currentStyle.accentColor === preset.accentColor &&
              currentStyle.nameColor === preset.nameColor;

            return (
              <button
                key={preset.themeId}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-28 ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                {/* Visual miniature banner preview */}
                <div
                  className="w-full h-8 rounded-lg p-1.5 flex items-center justify-between shadow-inner"
                  style={{ backgroundColor: preset.bannerBg }}
                >
                  <span
                    className="font-bold text-[11px] truncate"
                    style={{ color: preset.nameColor }}
                  >
                    CODY ULSCH
                  </span>
                  <div
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">
                      {preset.themeName}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                      {preset.accentColor} • {preset.bannerBg}
                    </span>
                  </div>

                  {isSelected && (
                    <span className="p-1 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Tuning */}
      <div className="space-y-4 pt-2 border-t border-slate-800">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-amber-400" /> Fine-Tune Custom Colors
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Banner Background */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 block">
              Header Banner Background
            </span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={currentStyle.bannerBg}
                onChange={(e) => handleUpdate({ bannerBg: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={currentStyle.bannerBg}
                onChange={(e) => handleUpdate({ bannerBg: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              The primary dark backdrop for the executive top banner.
            </p>
          </div>

          {/* Accent Color */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 block">
              Accent Color (Gold / Underlines / Dates)
            </span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={currentStyle.accentColor}
                onChange={(e) => handleUpdate({ accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={currentStyle.accentColor}
                onChange={(e) => handleUpdate({ accentColor: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Highlights dates, section divider bars, and icons.
            </p>
          </div>

          {/* Name Color */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 block">
              Candidate Name Color
            </span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={currentStyle.nameColor}
                onChange={(e) => handleUpdate({ nameColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              />
              <input
                type="text"
                value={currentStyle.nameColor}
                onChange={(e) => handleUpdate({ nameColor: e.target.value })}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 uppercase focus:outline-none focus:border-amber-400"
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Header brand text color for high visual impact.
            </p>
          </div>
        </div>
      </div>

      {/* Typography Font Section */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-400" /> Typography Font Selection ({SUPPORTED_FONTS.length} Professional Fonts)
          </label>
          <span className="text-xs text-slate-400">
            Active: <span className="text-amber-300 font-semibold">{currentStyle.fontFamily}</span>
          </span>
        </div>

        {/* Filter categories & search */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: `All (${SUPPORTED_FONTS.length})` },
              { id: 'Sans-Serif', label: `Sans-Serif (${SUPPORTED_FONTS.filter(f => f.category === 'Sans-Serif').length})` },
              { id: 'Serif', label: `Serif (${SUPPORTED_FONTS.filter(f => f.category === 'Serif').length})` },
              { id: 'Monospace', label: `Monospace (${SUPPORTED_FONTS.filter(f => f.category === 'Monospace').length})` },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFontCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  fontCategory === cat.id
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={fontSearch}
            onChange={(e) => setFontSearch(e.target.value)}
            placeholder="Search fonts..."
            className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 w-36 sm:w-44"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
          {SUPPORTED_FONTS.filter((f) => {
            const matchesCat = fontCategory === 'all' || f.category === fontCategory;
            const matchesSearch =
              !fontSearch.trim() ||
              f.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
              f.desc.toLowerCase().includes(fontSearch.toLowerCase());
            return matchesCat && matchesSearch;
          }).map((f) => {
            const isSelected = currentStyle.fontFamily === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => handleUpdate({ fontFamily: f.id })}
                className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-amber-400/10 border-amber-400/50 text-amber-300 font-semibold shadow-md shadow-amber-400/10'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-semibold truncate tracking-tight text-white"
                      style={{ fontFamily: f.cssFont }}
                    >
                      {f.name}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0 uppercase tracking-wider font-mono">
                      {f.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight line-clamp-1">
                    {f.desc}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Density & Header Layout Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
        {/* Content Density */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Content Density & Spacing
          </label>
          <div className="grid grid-cols-1 gap-2 pt-1">
            {[
              { id: 'compact', name: 'Compact Density', desc: 'Tighter lines for dense content & 1-page fit' },
              { id: 'standard', name: 'Balanced Standard', desc: 'Recommended default for optimal readability' },
              { id: 'spacious', name: 'Spacious Executive', desc: 'Extra breathing room for senior leadership' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() =>
                  handleUpdate({
                    fontSize: d.id as any,
                    spacing: d.id as any,
                  })
                }
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${
                  currentStyle.fontSize === d.id
                    ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div>
                  <span className="block">{d.name}</span>
                  <span className="text-[10px] text-slate-500">{d.desc}</span>
                </div>
                {currentStyle.fontSize === d.id && (
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Header Layout */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layout className="w-3.5 h-3.5 text-amber-400" /> Header Layout Style
          </label>
          <div className="grid grid-cols-1 gap-2 pt-1">
            {[
              { id: 'full-banner', name: 'Executive Full Dark Banner', desc: 'Signature dark top block with gold name' },
              { id: 'clean-minimal', name: 'Clean Minimalist Header', desc: 'Light background with bold accent border' },
            ].map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => handleUpdate({ headerLayout: l.id as any })}
                className={`p-2.5 rounded-xl border text-left text-xs transition-colors cursor-pointer flex items-center justify-between ${
                  currentStyle.headerLayout === l.id
                    ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div>
                  <span className="block">{l.name}</span>
                  <span className="text-[10px] text-slate-500">{l.desc}</span>
                </div>
                {currentStyle.headerLayout === l.id && (
                  <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeStyleEditor;
