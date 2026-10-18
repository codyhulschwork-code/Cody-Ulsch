import { Font } from '@react-pdf/renderer';
import { ResumeFontFamily } from '../types';

export interface FontDefinition {
  id: ResumeFontFamily;
  name: string;
  category: 'Sans-Serif' | 'Serif' | 'Monospace';
  desc: string;
  cssFont: string;
  isStandard: boolean;
  packageSlug?: string;
  localFiles?: { regular: string; bold: string };
}

export const SUPPORTED_FONTS: FontDefinition[] = [
  // =========================================================================
  // Standard Core PDF Fonts (3)
  // =========================================================================
  {
    id: 'Helvetica',
    name: 'Helvetica / Arial',
    category: 'Sans-Serif',
    desc: 'Clean, contemporary, 100% ATS standard',
    cssFont: 'Helvetica, Arial, -apple-system, BlinkMacSystemFont, sans-serif',
    isStandard: true,
  },
  {
    id: 'Times-Roman',
    name: 'Times-Roman',
    category: 'Serif',
    desc: 'Prestigious, traditional editorial look',
    cssFont: '"Times New Roman", Times, Georgia, serif',
    isStandard: true,
  },
  {
    id: 'Courier',
    name: 'Courier',
    category: 'Monospace',
    desc: 'Classic technical typewriter & systems feel',
    cssFont: '"Courier New", Courier, monospace',
    isStandard: true,
  },

  // =========================================================================
  // Modern Sans-Serif Fonts (14)
  // =========================================================================
  {
    id: 'Roboto',
    name: 'Roboto',
    category: 'Sans-Serif',
    desc: 'Google modern tech sans-serif, high legibility',
    cssFont: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    localFiles: { regular: 'Roboto-Regular.ttf', bold: 'Roboto-Bold.ttf' },
    packageSlug: 'roboto',
  },
  {
    id: 'Inter',
    name: 'Inter',
    category: 'Sans-Serif',
    desc: 'Silicon Valley tech product standard (Stripe, GitHub)',
    cssFont: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    localFiles: { regular: 'inter-latin-400-normal.woff', bold: 'inter-latin-700-normal.woff' },
    packageSlug: 'inter',
  },
  {
    id: 'Open Sans',
    name: 'Open Sans',
    category: 'Sans-Serif',
    desc: 'Friendly, balanced humanist typography',
    cssFont: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    localFiles: { regular: 'open-sans-latin-400-normal.woff', bold: 'open-sans-latin-700-normal.woff' },
    packageSlug: 'open-sans',
  },
  {
    id: 'Lato',
    name: 'Lato',
    category: 'Sans-Serif',
    desc: 'Warm, corporate executive sans-serif',
    cssFont: '"Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    localFiles: { regular: 'lato-latin-400-normal.woff', bold: 'lato-latin-700-normal.woff' },
    packageSlug: 'lato',
  },
  {
    id: 'Montserrat',
    name: 'Montserrat',
    category: 'Sans-Serif',
    desc: 'Modern geometric architectural typography',
    cssFont: '"Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    localFiles: { regular: 'montserrat-latin-400-normal.woff', bold: 'montserrat-latin-700-normal.woff' },
    packageSlug: 'montserrat',
  },
  {
    id: 'Poppins',
    name: 'Poppins',
    category: 'Sans-Serif',
    desc: 'Contemporary geometric sans with friendly rounded curves',
    cssFont: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    packageSlug: 'poppins',
  },
  {
    id: 'Raleway',
    name: 'Raleway',
    category: 'Sans-Serif',
    desc: 'Sophisticated, elegant sans-serif with bespoke character',
    cssFont: '"Raleway", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    packageSlug: 'raleway',
  },
  {
    id: 'Nunito',
    name: 'Nunito',
    category: 'Sans-Serif',
    desc: 'Balanced well-proportioned rounded sans for leadership',
    cssFont: '"Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    packageSlug: 'nunito',
  },
  {
    id: 'Work Sans',
    name: 'Work Sans',
    category: 'Sans-Serif',
    desc: 'Optimized specifically for print & on-screen technical reading',
    cssFont: '"Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    packageSlug: 'work-sans',
  },
  {
    id: 'DM Sans',
    name: 'DM Sans',
    category: 'Sans-Serif',
    desc: 'Low-contrast, highly legible precision geometric sans',
    cssFont: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    packageSlug: 'dm-sans',
  },
  {
    id: 'Rubik',
    name: 'Rubik',
    category: 'Sans-Serif',
    desc: 'Soft rectangular geometry with exceptional readability',
    cssFont: '"Rubik", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    packageSlug: 'rubik',
  },
  {
    id: 'Cabin',
    name: 'Cabin',
    category: 'Sans-Serif',
    desc: 'Humanist sans with modernist personality and clean curves',
    cssFont: '"Cabin", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    packageSlug: 'cabin',
  },
  {
    id: 'Oxygen',
    name: 'Oxygen',
    category: 'Sans-Serif',
    desc: 'Clear open counters designed for high technical clarity',
    cssFont: '"Oxygen", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    packageSlug: 'oxygen',
  },
  {
    id: 'Plus Jakarta Sans',
    name: 'Plus Jakarta Sans',
    category: 'Sans-Serif',
    desc: 'Contemporary modern tech typography with crisp accents',
    cssFont: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    isStandard: false,
    packageSlug: 'plus-jakarta-sans',
  },

  // =========================================================================
  // Executive & Editorial Serif Fonts (9)
  // =========================================================================
  {
    id: 'Merriweather',
    name: 'Merriweather',
    category: 'Serif',
    desc: 'Refined literary executive serif for senior leaders',
    cssFont: '"Merriweather", Georgia, "Times New Roman", serif',
    isStandard: false,
    localFiles: { regular: 'merriweather-latin-400-normal.woff', bold: 'merriweather-latin-700-normal.woff' },
    packageSlug: 'merriweather',
  },
  {
    id: 'Lora',
    name: 'Lora',
    category: 'Serif',
    desc: 'Contemporary calligraphic serif, perfectly balanced',
    cssFont: '"Lora", Georgia, "Times New Roman", serif',
    isStandard: false,
    packageSlug: 'lora',
  },
  {
    id: 'Playfair Display',
    name: 'Playfair Display',
    category: 'Serif',
    desc: 'High-contrast luxury editorial serif with dramatic elegance',
    cssFont: '"Playfair Display", Georgia, "Times New Roman", serif',
    isStandard: false,
    packageSlug: 'playfair-display',
  },
  {
    id: 'PT Serif',
    name: 'PT Serif',
    category: 'Serif',
    desc: 'Universal publishing serif designed for dense technical copy',
    cssFont: '"PT Serif", Georgia, "Times New Roman", serif',
    isStandard: false,
    packageSlug: 'pt-serif',
  },
  {
    id: 'Source Serif Pro',
    name: 'Source Serif Pro',
    category: 'Serif',
    desc: 'Adobe premier digital serif pairing for technical documents',
    cssFont: '"Source Serif Pro", Georgia, "Times New Roman", serif',
    isStandard: false,
    packageSlug: 'source-serif-pro',
  },
  {
    id: 'Cinzel',
    name: 'Cinzel',
    category: 'Serif',
    desc: 'Classical Roman monument proportions for distinguished headers',
    cssFont: '"Cinzel", Georgia, "Times New Roman", serif',
    isStandard: false,
    packageSlug: 'cinzel',
  },
  {
    id: 'EB Garamond',
    name: 'EB Garamond',
    category: 'Serif',
    desc: 'Masterwork classical revival of 16th-century Garamond',
    cssFont: '"EB Garamond", Georgia, "Times New Roman", serif',
    isStandard: false,
    packageSlug: 'eb-garamond',
  },
  {
    id: 'Cormorant Garamond',
    name: 'Cormorant Garamond',
    category: 'Serif',
    desc: 'Graceful, high-contrast traditional executive aesthetic',
    cssFont: '"Cormorant Garamond", Georgia, "Times New Roman", serif',
    isStandard: false,
    packageSlug: 'cormorant-garamond',
  },
  {
    id: 'Baskervville',
    name: 'Baskervville',
    category: 'Serif',
    desc: 'Crisp transitional serif with historical authority and punch',
    cssFont: '"Baskervville", Georgia, "Times New Roman", serif',
    isStandard: false,
    packageSlug: 'baskervville',
  },

  // =========================================================================
  // Engineering Monospace Fonts (4)
  // =========================================================================
  {
    id: 'JetBrains Mono',
    name: 'JetBrains Mono',
    category: 'Monospace',
    desc: 'Modern developer code & engineering monospace',
    cssFont: '"JetBrains Mono", "Courier New", monospace',
    isStandard: false,
    localFiles: { regular: 'jetbrains-mono-latin-400-normal.woff', bold: 'jetbrains-mono-latin-700-normal.woff' },
    packageSlug: 'jetbrains-mono',
  },
  {
    id: 'Fira Code',
    name: 'Fira Code',
    category: 'Monospace',
    desc: 'Beloved programmer monospace typeface with clean metrics',
    cssFont: '"Fira Code", "Courier New", monospace',
    isStandard: false,
    packageSlug: 'fira-code',
  },
  {
    id: 'Source Code Pro',
    name: 'Source Code Pro',
    category: 'Monospace',
    desc: 'Adobe premier developer monospace for UI & terminal',
    cssFont: '"Source Code Pro", "Courier New", monospace',
    isStandard: false,
    packageSlug: 'source-code-pro',
  },
  {
    id: 'Inconsolata',
    name: 'Inconsolata',
    category: 'Monospace',
    desc: 'Humanist monospace with clean proportions and high legibility',
    cssFont: '"Inconsolata", "Courier New", monospace',
    isStandard: false,
    packageSlug: 'inconsolata',
  },
];

let fontsRegistered = false;

function resolveFontUrl(filename: string): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/fonts/${filename}`;
  }
  return `/fonts/${filename}`;
}

export function registerPdfFonts() {
  if (fontsRegistered) return;

  try {
    for (const fontDef of SUPPORTED_FONTS) {
      if (fontDef.isStandard) continue;

      if (fontDef.localFiles) {
        Font.register({
          family: fontDef.id,
          fonts: [
            { src: resolveFontUrl(fontDef.localFiles.regular), fontWeight: 400 },
            { src: resolveFontUrl(fontDef.localFiles.bold), fontWeight: 700 },
          ],
        });
      } else if (fontDef.packageSlug) {
        const slug = fontDef.packageSlug;
        Font.register({
          family: fontDef.id,
          fonts: [
            {
              src: `https://cdn.jsdelivr.net/npm/@fontsource/${slug}@5.0.0/files/${slug}-latin-400-normal.woff`,
              fontWeight: 400,
            },
            {
              src: `https://cdn.jsdelivr.net/npm/@fontsource/${slug}@5.0.0/files/${slug}-latin-700-normal.woff`,
              fontWeight: 700,
            },
          ],
        });
      }
    }

    fontsRegistered = true;
  } catch (err) {
    console.warn('Custom font registration note:', err);
  }
}

export function getPdfFontStyles(fontFamily: string) {
  if (fontFamily === 'Times-Roman') {
    return {
      regularFont: 'Times-Roman',
      boldFont: 'Times-Bold',
      italicFont: 'Times-Italic',
      isStandard: true,
    };
  }

  if (fontFamily === 'Courier') {
    return {
      regularFont: 'Courier',
      boldFont: 'Courier-Bold',
      italicFont: 'Courier-Oblique',
      isStandard: true,
    };
  }

  if (fontFamily === 'Helvetica') {
    return {
      regularFont: 'Helvetica',
      boldFont: 'Helvetica-Bold',
      italicFont: 'Helvetica-Oblique',
      isStandard: true,
    };
  }

  // Registered fonts (Roboto, Inter, Poppins, Merriweather, etc.)
  return {
    regularFont: fontFamily,
    boldFont: fontFamily,
    italicFont: fontFamily,
    isStandard: false,
  };
}

export function getCssFontFamily(fontFamily: string): string {
  const match = SUPPORTED_FONTS.find((f) => f.id === fontFamily);
  return match ? match.cssFont : 'Helvetica, Arial, sans-serif';
}
