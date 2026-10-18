import { pdf, Font } from '@react-pdf/renderer';
import React from 'react';
import { ResumeData } from '../types';
import { ResumePDF } from '../components/ResumePDF';
import { CoverLetterPDF } from '../components/CoverLetterPDF';
import { registerPdfFonts } from './pdfFonts';

// Universal fix: disable word-splitting hyphens in ATS resume outputs and prevent hyphenation package crashes
Font.registerHyphenationCallback((word) => [word]);

// Initialize all custom PDF fonts
registerPdfFonts();

export async function generateResumePdfBlob(data: ResumeData): Promise<Blob> {
  const element = React.createElement(ResumePDF, { data });
  // @ts-expect-error - react-pdf type quirk
  const instance = pdf(element);
  const blob = await instance.toBlob();
  return blob;
}

export async function generateCoverLetterPdfBlob(data: ResumeData): Promise<Blob> {
  const element = React.createElement(CoverLetterPDF, { data });
  // @ts-expect-error - react-pdf type quirk
  const instance = pdf(element);
  const blob = await instance.toBlob();
  return blob;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadResumePdf(data: ResumeData, companyName?: string) {
  const blob = await generateResumePdfBlob(data);
  const safeCompany = (companyName || 'Target').replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadBlob(blob, `Cody_Ulsch_Resume_${safeCompany}.pdf`);
}

export async function downloadCoverLetterPdf(data: ResumeData, companyName?: string) {
  const blob = await generateCoverLetterPdfBlob(data);
  const safeCompany = (companyName || 'Target').replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadBlob(blob, `Cody_Ulsch_Cover_Letter_${safeCompany}.pdf`);
}
