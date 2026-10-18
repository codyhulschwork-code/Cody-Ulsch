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
  Line,
  Link,
} from '@react-pdf/renderer';
import { ResumeData } from '../types';
import { getPdfFontStyles } from '../utils/pdfFonts';
import { parseFormattedTokens } from '../utils/textFormatter';

const INK = '#222222';
const TEXT = '#000000';
const MUTED = '#0a0a0a';
const BANNER_BG = '#2f2f33';
const GOLD = '#E0A521'; // accents: dates, underlines, icons, bullets
const NAME_GOLD = '#F2C230'; // brighter gold for the name

// ---------------------------------------------------------------------------
// Line icons (24x24 viewBox, Feather-style). Rendered in a <G> so children
// inherit stroke/fill from the group.
// ---------------------------------------------------------------------------
const ICON_PATHS: Record<string, React.ReactNode> = {
  mail: (
    <>
      <Rect x="2.5" y="4.5" width="19" height="15" rx="2.5" fill="none" strokeWidth={1.8} />
      <Path d="m3 6.5 7.8 5.4a2.2 2.2 0 0 0 2.4 0L21 6.5" fill="none" strokeWidth={1.8} strokeLinecap="round" />
    </>
  ),

  phone: (
    <>
      <Rect x="5.5" y="2.5" width="13" height="19" rx="3" fill="none" strokeWidth={1.8} />
      <Line x1="10" y1="5.5" x2="14" y2="5.5" strokeWidth={1.8} strokeLinecap="round" />
      <Circle cx="12" cy="18" r="1" fill="none" strokeWidth={1.5} />
    </>
  ),

  pin: (
    <>
      <Path d="M12 21.5c-3.5-4.2-7-8.5-7-12a7 7 0 0 1 14 0c0 3.5-3.5 7.8-7 12Z" fill="none" strokeWidth={1.8} strokeLinejoin="round" />
      <Circle cx="12" cy="9.5" r="2.5" fill="none" strokeWidth={1.8} />
    </>
  ),

  user: (
    <>
      <Circle cx="12" cy="7.5" r="3.8" fill="none" strokeWidth={1.8} />
      <Path d="M4.5 20.5c0-4 3.5-6.5 7.5-6.5s7.5 2.5 7.5 6.5" fill="none" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="m15.5 10.5 1.5 1.5 3-3" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),

  briefcase: (
    <>
      <Rect x="2.5" y="7" width="19" height="14" rx="2.5" fill="none" strokeWidth={1.8} />
      <Path d="M8 7V4.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V7" fill="none" strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="2.5" y1="12.5" x2="21.5" y2="12.5" strokeWidth={1.5} strokeLinecap="round" />
      <Rect x="10.5" y="11" width="3" height="3" rx="0.5" fill="none" strokeWidth={1.8} />
    </>
  ),

  cap: (
    <>
      <Path d="m2 9.5 10-5 10 5-10 5-10-5Z" fill="none" strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M6 11.5v5c0 2.5 2.7 4.5 6 4.5s6-2 6-4.5v-5" fill="none" strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M22 9.5v7" fill="none" strokeWidth={1.8} strokeLinecap="round" />
    </>
  ),

  code: (
    <>
      <Rect x="5" y="5" width="14" height="14" rx="2.5" fill="none" strokeWidth={1.8} />
      <Rect x="8.5" y="8.5" width="7" height="7" rx="1.2" fill="none" strokeWidth={1.6} />
      <Line x1="9" y1="2" x2="9" y2="5" strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="15" y1="2" x2="15" y2="5" strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="9" y1="19" x2="9" y2="22" strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="15" y1="19" x2="15" y2="22" strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="2" y1="9" x2="5" y2="9" strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="2" y1="15" x2="5" y2="15" strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="19" y1="9" x2="22" y2="9" strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="19" y1="15" x2="22" y2="15" strokeWidth={1.8} strokeLinecap="round" />
    </>
  ),

  gear: (
    <>
      <Rect x="5" y="5" width="14" height="14" rx="2.5" fill="none" strokeWidth={1.8} />
      <Circle cx="12" cy="12" r="3" fill="none" strokeWidth={1.8} />
    </>
  ),

  globe: (
    <>
      <Circle cx="12" cy="12" r="9.5" fill="none" strokeWidth={1.8} />
      <Path d="M12 2.5a13.5 13.5 0 0 0 0 19M12 2.5a13.5 13.5 0 0 1 0 19" fill="none" strokeWidth={1.5} />
      <Line x1="2.5" y1="12" x2="21.5" y2="12" strokeWidth={1.8} strokeLinecap="round" />
    </>
  ),

  award: (
    <>
      <Circle cx="12" cy="8" r="5.5" fill="none" strokeWidth={1.8} />
      <Path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.12" fill="none" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
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
    fontSize: 9.5,
    color: INK,
    lineHeight: 1.45,
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingTop: 34,
    paddingBottom: 34,
  },

  // ---- Header banner (full-bleed) ----
  banner: {
    backgroundColor: BANNER_BG,
    marginHorizontal: -40,
    marginTop: -34,
    paddingHorizontal: 40,
    paddingTop: 26,
    paddingBottom: 18,
  },

  nameLine: {
    marginBottom: 20,
  },

  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    color: NAME_GOLD,
    marginLeft: 0,
  },

  title: {
    fontFamily: 'Helvetica',
    fontSize: 13,
    color: '#e6e6ea',
  },

  // ---- Contact row (inside banner) ----
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
    marginTop: 13,
  },

  contactText: {
    fontSize: 8.5,
    color: '#c7c7cc',
    textDecoration: 'none',
    marginLeft: 5,
  },

  // ---- Section header (icon badge + title + short gold underline) ----
  section: {
    marginTop: 15
  },

  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  badge: {
    width: 16,
    height: 16,
    borderRadius: 3,
    backgroundColor: BANNER_BG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  h2: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 14,
    letterSpacing: 1.4,
    color: '#1a1a1a',
  },

  accentBar: {
    width: 26,
    height: 3,
    backgroundColor: GOLD,
    marginTop: 5,
    marginBottom: 9,
  },

  para: {
    fontSize: 9.5,
    color: TEXT,
    textAlign: 'justify',
  },

  // ---- Entry (experience / education / certificates) ----
  entry: {
    marginBottom: 11,
  },

  entryTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  entryTitle: {
    fontSize: 10,
    flex: 1,
    paddingRight: 14,
    marginBottom: 3,
  },

  roleBold: {
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
  },

  companyItalic: {
    fontFamily: 'Helvetica-Oblique',
    color: TEXT,
  },

  entryMeta: {
    width: 138,
    alignItems: 'flex-end',
  },

  period: {
    fontSize: 9,
    color: GOLD,
    textAlign: 'right',
  },

  location: {
    fontSize: 9,
    color: MUTED,
    textAlign: 'right',
    marginTop: 1,
  },

  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2.5,
  },

  bulletDot: {
    fontSize: 9,
    color: '#333333',
    width: 11,
  },

  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: TEXT,
    textAlign: 'justify',
  },

  // ---- Skills grid ----
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  skillItem: {
    width: '33.33%',
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 8,
  },

  skillBullet: {
    fontSize: 9,
    color: '#333333',
    width: 10,
  },

  skillText: {
    flex: 1,
    fontSize: 9.5,
    color: TEXT,
  },

  // ---- Languages (inline) ----
  langName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: '#1a1a1a',
  },

  langLevel: {
    fontSize: 9.5,
    color: TEXT,
  },

  langSep: {
    fontSize: 9.5,
    color: '#c8c8c8',
  },
});

// ---------------------------------------------------------------------------
// Section header
// The header must never split (icon badge stranded from its title) and must
// stay attached to the first line of content below it.
// ---------------------------------------------------------------------------
function SectionHead({
  icon,
  title,
  accentColor = GOLD,
}: {
  icon: string;
  title: string;
  accentColor?: string;
}) {
  return (
    <View wrap={false}>
      <View style={styles.headRow}>
        <View style={styles.badge}>
          <Icon name={icon} color={accentColor} size={9.5} />
        </View>

        <Text style={styles.h2}>{title}</Text>
      </View>

      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
    </View>
  );
}

// ---------------------------------------------------------------------------
// One entry with a bold title, italic subtitle, right-aligned gold date /
// muted location, and optional bullets.
// Shared by experience / education / certificates.
// ---------------------------------------------------------------------------
function Entry({
  title,
  subtitle,
  date,
  location,
  bullets,
  wrap = true,
  accentColor = GOLD,
  boldStyle,
  skills = [],
}: {
  title: string;
  subtitle?: string | null;
  date?: string | null;
  location?: string | null;
  bullets?: string[];
  wrap?: boolean;
  accentColor?: string;
  boldStyle?: any;
  skills?: string[];
}) {
  return (
    <View style={styles.entry} wrap={wrap}>
      <View style={styles.entryTop} wrap={false}>
        <Text style={styles.entryTitle}>
          <Text style={[styles.roleBold, boldStyle]}>
            {subtitle ? `${title},` : title}
          </Text>

          {subtitle ? (
            <Text style={styles.companyItalic}>
              {` ${subtitle}`}
            </Text>
          ) : null}
        </Text>

        {(date || location) ? (
          <View style={styles.entryMeta}>
            {date ? (
              <Text style={[styles.period, { color: accentColor }]}>
                {date}
              </Text>
            ) : null}

            {location ? (
              <Text style={styles.location}>
                {location}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      {(bullets || [])
        .filter(Boolean)
        .map((b, j) => {
          const tokens = parseFormattedTokens(b, skills);
          return (
            <View
              key={j}
              style={styles.bulletRow}
              wrap={false}
            >
              <Text style={styles.bulletDot}>
                {'•'}
              </Text>

              <Text style={styles.bulletText}>
                {tokens.map((token, tIdx) =>
                  token.isBold ? (
                    <Text key={tIdx} style={boldStyle}>
                      {token.text}
                    </Text>
                  ) : (
                    token.text
                  )
                )}
              </Text>
            </View>
          );
        })}
    </View>
  );
}

export function ResumePDF({ data }: { data: ResumeData }) {
  const c = data.contact || {
    email: 'codyh.ulsch.work@gmail.com',
    phone: '+1(720)-970-4896',
    location: '810 Francis Halethorpe MD',
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

  const skills = (data.skills || []).filter(Boolean);

  const experience = data.experience || [];
  const education = data.education || [];

  // Contact information (LinkedIn is intentionally NOT included per template specification)
  const contactParts: Array<{ icon: string; text: string; href?: string }> = [];

  if (c.email) {
    contactParts.push({
      icon: 'mail',
      text: c.email,
      href: 'mailto:' + c.email,
    });
  }

  if (c.phone) {
    contactParts.push({
      icon: 'phone',
      text: c.phone,
    });
  }

  if (c.location) {
    contactParts.push({
      icon: 'pin',
      text: c.location,
    });
  }

  if (c.website) {
    const websiteHref =
      c.website.indexOf('http') === 0 ? c.website : 'https://' + c.website;
    contactParts.push({
      icon: 'globe',
      text: c.website,
      href: websiteHref,
    });
  }

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily: fontInfo.regularFont }]}>
        {/* ---------------------------------------------------------------
            Header banner
        ---------------------------------------------------------------- */}
        <View style={[styles.banner, { backgroundColor: st.bannerBg }]}>
          <Text style={styles.nameLine}>
            <Text style={[styles.name, { color: st.nameColor }, boldStyle]}>{data.name || 'Cody Ulsch'}</Text>

            {data.title ? (
              <Text style={styles.title}>{`  ${data.title}`}</Text>
            ) : null}
          </Text>

          {contactParts.length ? (
            <View style={styles.contactRow}>
              {contactParts.map((p, i) => (
                <View key={i} style={styles.contactItem}>
                  <Icon name={p.icon} color={st.accentColor} size={9} />

                  {p.href ? (
                    <Link style={styles.contactText} src={p.href}>
                      {p.text}
                    </Link>
                  ) : (
                    <Text style={styles.contactText}>{p.text}</Text>
                  )}
                </View>
              ))}
            </View>
          ) : null}
        </View>

        {/* ---------------------------------------------------------------
            Summary
        ---------------------------------------------------------------- */}
        {data.summary ? (
          <View style={styles.section}>
            <SectionHead icon="user" title="SUMMARY" accentColor={st.accentColor} />

            <Text style={styles.para}>
              {parseFormattedTokens(data.summary, skills).map((token, tIdx) =>
                token.isBold ? (
                  <Text key={tIdx} style={boldStyle}>
                    {token.text}
                  </Text>
                ) : (
                  token.text
                )
              )}
            </Text>
          </View>
        ) : null}
  {/* ---------------------------------------------------------------
            Skills
        ---------------------------------------------------------------- */}
        {skills.length ? (
          <View style={styles.section}>
            <SectionHead icon="code" title="SKILLS" accentColor={st.accentColor} />

            <View style={styles.skillsGrid}>
              {skills.map((s, i) => (
                <View key={i} style={styles.skillItem}>
                  <Text style={[styles.skillBullet, { color: st.accentColor }]}>{'•'}</Text>
                  <Text style={[styles.skillText, boldStyle]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}
        {/* ---------------------------------------------------------------
            Professional Experience
        ---------------------------------------------------------------- */}
        {experience.length ? (
          <View style={styles.section}>
            <SectionHead icon="briefcase" title="PROFESSIONAL EXPERIENCE" accentColor={st.accentColor} />

            {experience.map((job, i) => (
              <Entry
                key={i}
                title={job.role || 'Senior Software Engineer'}
                subtitle={job.company}
                date={job.period}
                bullets={job.bullets}
                accentColor={st.accentColor}
                boldStyle={boldStyle}
                skills={skills}
              />
            ))}
          </View>
        ) : null}

        {/* ---------------------------------------------------------------
            Education
        ---------------------------------------------------------------- */}
        {education.length ? (
          <View style={styles.section}>
            <SectionHead icon="cap" title="EDUCATION" accentColor={st.accentColor} />

            {education.map((e, i) => (
              <Entry
                key={i}
                title={
                  e.degree ? `${e.degree} ${e.field || ''}`.trim() : e.school
                }
                subtitle={e.degree ? e.school : null}
                date={e.period}
                location={e.location}
                accentColor={st.accentColor}
                boldStyle={boldStyle}
                skills={skills}
              />
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

export default ResumePDF;
