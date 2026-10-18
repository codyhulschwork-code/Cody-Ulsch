import React from 'react';
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Svg,
  G,
  Rect,
  Path,
  Circle,
  Link,
} from '@react-pdf/renderer';
import { ResumeData } from '../types';
import { getPdfFontStyles } from '../utils/pdfFonts';

const INK = '#222222';
const TEXT = '#000000';
const BANNER_BG = '#2f2f33';
const GOLD = '#E0A521';
const NAME_GOLD = '#F2C230';

const ICON_PATHS: Record<string, React.ReactNode> = {
  mail: (
    <>
      <Rect x="2" y="4" width="20" height="16" rx="2" fill="none" />
      <Path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" fill="none" />
    </>
  ),
  phone: (
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  pin: (
    <>
      <Path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" fill="none" />
      <Circle cx="12" cy="10" r="3" fill="none" />
    </>
  ),
};

function Icon({ name, color, size = 11 }: { name: string; color: string; size?: number }) {
  const paths = ICON_PATHS[name];
  if (!paths) return null;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G
        stroke={color}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths}
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: INK,
    lineHeight: 1.6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingTop: 34,
    paddingBottom: 34,
  },
  banner: {
    backgroundColor: BANNER_BG,
    marginHorizontal: -40,
    marginTop: -34,
    paddingHorizontal: 40,
    paddingTop: 26,
    paddingBottom: 20,
    marginBottom: 24,
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    color: NAME_GOLD,
    marginBottom: 14,
  },
  title: {
    fontFamily: 'Helvetica',
    fontSize: 13,
    color: '#e6e6ea',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    marginTop: 4,
  },
  contactText: {
    fontSize: 9,
    color: '#c7c7cc',
    textDecoration: 'none',
    marginLeft: 5,
  },
  dateAndRecipient: {
    marginBottom: 20,
  },
  recipientText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#1a1a1a',
  },
  companyText: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: TEXT,
    marginTop: 2,
  },
  letterBody: {
    marginTop: 8,
  },
  paragraph: {
    fontSize: 10,
    color: TEXT,
    marginBottom: 12,
    textAlign: 'justify',
  },
  signOff: {
    marginTop: 24,
  },
  signOffText: {
    fontSize: 10,
    color: TEXT,
    marginBottom: 18,
  },
  signatureName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: '#1a1a1a',
  },
  signatureTitle: {
    fontSize: 9.5,
    color: '#666666',
    marginTop: 2,
  },
});

export function CoverLetterPDF({ data }: { data: ResumeData }) {
  const c = data.contact || {
    email: 'codyh.ulsch.work@gmail.com',
    phone: '+1(720)-970-4896',
    location: '810 Francis Halethorpe MD',
  };

  const cl = data.coverLetter || {
    recipient: '',
    company: '',
    date: '',
    body: '',
  };

  const st = data.styleConfig || {
    themeId: 'signature-gold',
    themeName: 'Cody Signature Gold',
    bannerBg: BANNER_BG,
    accentColor: GOLD,
    nameColor: NAME_GOLD,
    fontFamily: 'Helvetica',
    fontSize: 'standard',
    spacing: 'standard',
    headerLayout: 'full-banner',
  };

  const fontInfo = getPdfFontStyles(st.fontFamily);
  const boldStyle = fontInfo.isStandard
    ? { fontFamily: fontInfo.boldFont }
    : { fontFamily: fontInfo.boldFont, fontWeight: 700 as const };

  const paragraphs = cl.body
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: fontInfo.regularFont }]}>
        <View style={[styles.banner, { backgroundColor: st.bannerBg }]}>
          <Text style={[styles.name, { color: st.nameColor }, boldStyle]}>{data.name || 'Cody Ulsch'}</Text>
          <Text style={styles.title}>{data.title || 'Senior Software Engineer'}</Text>

          <View style={styles.contactRow}>
            {c.email && (
              <View style={styles.contactItem}>
                <Icon name="mail" color={st.accentColor} size={9} />
                <Link style={styles.contactText} src={`mailto:${c.email}`}>
                  {c.email}
                </Link>
              </View>
            )}
            {c.phone && (
              <View style={styles.contactItem}>
                <Icon name="phone" color={st.accentColor} size={9} />
                <Text style={styles.contactText}>{c.phone}</Text>
              </View>
            )}
            {c.location && (
              <View style={styles.contactItem}>
                <Icon name="pin" color={st.accentColor} size={9} />
                <Text style={styles.contactText}>{c.location}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.dateAndRecipient}>
         
          <Text style={styles.recipientText}>{cl.recipient}</Text>
          <Text style={styles.companyText}>{cl.company}</Text>
        </View>

        <View style={styles.letterBody}>
          {paragraphs.map((p, idx) => (
            <Text key={idx} style={styles.paragraph}>
              {p}
            </Text>
          ))}
        </View>

        <View style={styles.signOff}>
          <Text style={styles.signOffText}>Sincerely,</Text>
          <Text style={styles.signatureName}>{data.name || 'Cody Ulsch'}</Text>
          <Text style={styles.signatureTitle}>{data.title || 'Senior Software Engineer'}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default CoverLetterPDF;
