// Shoreline — window.Shoreline. React 18 globals (window.React / window.ReactDOM).
import type { ReactNode, MouseEventHandler } from 'react';

export interface ButtonProps {
  /** "outline" (default): accent border, fills on hover. "primary": filled. "ghost": text only, accent underline on hover. */
  variant?: 'outline' | 'primary' | 'ghost';
  size?: 'md' | 'sm';
  /** Renders an <a>. With `external`, opens a new tab; with `download`, downloads. */
  href?: string;
  external?: boolean;
  download?: boolean;
  /** A single Unicode glyph placed before the label: ↗ ⤓ ⛶ ↩ */
  glyph?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  children: ReactNode;
}

export interface PillProps {
  /** accent (runtime), gold (CSULB), neutral (tags), kelp (verified / positive), signal (warning), ink (selected). */
  tone?: 'accent' | 'gold' | 'neutral' | 'kelp' | 'signal' | 'ink';
  /** Prefix the gold ticker dot. */
  dot?: boolean;
  children: ReactNode;
}

export interface SectionHeadProps {
  /** Roman numeral shown after §: "i", "ii", "iii" */
  numeral?: string;
  title: ReactNode;
  /** "paper": the LBRHE working-paper variant (kicker + italic h2 over a 2px ink rule). Default: resume variant (numeral · label · line). */
  variant?: 'resume' | 'paper';
  kicker?: string;
}

export interface KpiItem { value: ReactNode; label: string; tone?: 'accent' | 'signal' | 'kelp' }
export interface KpiStripProps { items: KpiItem[]; columns?: 2 | 3 | 4 }

export interface PlateProps {
  /** "FIG. 01 · CITY OF LONG BEACH" */
  figure?: ReactNode;
  /** Right side of the plate header: coordinates, a runtime Pill, a date. */
  meta?: ReactNode;
  caption?: ReactNode;
  /** Right side of the caption, in accent: "[FIG. 00]" */
  tag?: ReactNode;
  /** Accent corner registration ticks (hero plate, resume). */
  ticks?: boolean;
  /** An SVG chart, an <img>, or a screenshot. */
  children: ReactNode;
}

export interface ProjectCardProps {
  figure: string;
  /** Runtime Pill text: "Marimo WASM", "R tidycensus + Tableau", "Excel" */
  runtime?: string;
  runtimeTone?: PillProps['tone'];
  /** The tool-chain eyebrow: "Civic data science · R (tidycensus) · Tableau" */
  label: string;
  title: ReactNode;
  blurb: ReactNode;
  outcomeLabel?: string;
  outcome?: ReactNode;
  cta?: string;
  href?: string;
  onClick?: MouseEventHandler;
  /** Spans two columns with a 4px gold left edge. One per page. */
  flagship?: boolean;
  /** The plate's figure: a mini SVG chart. */
  children?: ReactNode;
}

export interface FilterCategory { id: string; label: string; count?: number }
export interface FilterBarProps {
  categories: FilterCategory[];
  active?: string;
  search?: boolean;
  placeholder?: string;
  onChange?: (state: { category: string; query: string }) => void;
}

export interface NotebookViewerProps {
  title: string;
  figure?: string;
  /** "marimo · WASM" (default), "R · Quarto", "webR", "HTML export" */
  runtime?: string;
  runtimeTone?: PillProps['tone'];
  /** URL of the html-wasm export's index.html (run mode). */
  src?: string;
  /** URL of the --mode edit export; enables the Run / Edit tabs. */
  editSrc?: string;
  mode?: 'run' | 'edit';
  /** The notebook source (.py / .qmd) for the download button. */
  sourceHref?: string;
  sourceLabel?: string;
  /** The no-runtime static HTML fallback. */
  staticHref?: string;
  /** CSS height of the frame; default 70vh (min 320px). */
  height?: string;
  /** Dataset filenames listed in the footer. */
  data?: string[];
  source?: string;
  note?: string;
  bootNote?: string;
  /** Render the boot panel in place of the iframe (design previews, print). */
  placeholder?: boolean;
  placeholderTitle?: string;
}

export interface FileArtifactProps {
  kind: 'xlsx' | 'csv' | 'r' | 'py' | 'pdf' | 'html' | 'qmd' | 'rmd';
  filename: string;
  size?: string;
  rows?: string | number;
  updated?: string;
  /** One sentence naming the sheet, pivot, function or figure to open first. */
  look?: ReactNode;
  /** Sheet names (xlsx) or section names. */
  sheets?: string[];
  href?: string;
  downloadLabel?: string;
  previewHref?: string;
  previewLabel?: string;
  sourceNote?: ReactNode;
  /** First rows of a CSV / sheet, rendered as a mono table. */
  preview?: { columns: string[]; rows: Array<Array<string | number>> };
  previewRows?: number;
}

export interface CertificateCardProps {
  /** As printed on the certificate: "University of Leicester via Coursera" */
  issuer: string;
  title: ReactNode;
  date?: string;
  credentialId?: string;
  /** Issuer verification URL. Present ⇒ state "verified". */
  verifyHref?: string;
  pdfHref?: string;
  /** First page as PNG, 1200px wide. */
  thumb?: string;
  thumbAlt?: string;
  skills?: string[];
  state?: 'verified' | 'issued' | 'in-progress';
  expected?: string;
  note?: ReactNode;
}

export interface CodeDrawerProps { title: string; engine?: string; code?: string; open?: boolean; children?: ReactNode }
export interface WaveDividerProps { single?: boolean }
export interface TideSwitcherProps { value?: 'low-tide' | 'golden-hour' | 'high-tide'; onChange?: (id: string) => void }

export interface NavLink { label: string; href?: string; active?: boolean; onClick?: MouseEventHandler }
export interface NavProps {
  brand?: string; badge?: string; links: NavLink[]; email?: string;
  ticker?: boolean; tickerLeft?: string; tickerRight?: string;
  tides?: boolean; tide?: TideSwitcherProps['value']; onTide?: (id: string) => void;
}

export interface PostcardFooterProps {
  kicker?: string; title?: string; children?: ReactNode; extra?: ReactNode;
  to?: string; email?: string; phone?: string; location?: string; year?: string;
}

export const Button: (p: ButtonProps) => JSX.Element;
export const Pill: (p: PillProps) => JSX.Element;
export const SectionHead: (p: SectionHeadProps) => JSX.Element;
export const KpiStrip: (p: KpiStripProps) => JSX.Element;
export const Plate: (p: PlateProps) => JSX.Element;
export const ProjectCard: (p: ProjectCardProps) => JSX.Element;
export const FilterBar: (p: FilterBarProps) => JSX.Element;
export const NotebookViewer: (p: NotebookViewerProps) => JSX.Element;
export const FileArtifact: (p: FileArtifactProps) => JSX.Element;
export const CertificateCard: (p: CertificateCardProps) => JSX.Element;
export const CodeDrawer: (p: CodeDrawerProps) => JSX.Element;
export const WaveDivider: (p: WaveDividerProps) => JSX.Element;
export const TideSwitcher: (p: TideSwitcherProps) => JSX.Element;
export const Nav: (p: NavProps) => JSX.Element;
export const PostcardFooter: (p: PostcardFooterProps) => JSX.Element;
