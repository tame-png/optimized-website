export const PERSON = {
  name: 'Andy Molina',
  role: 'Applied Statistics · Data Science',
  affiliation: 'California State University, Long Beach',
  expectedGrad: 'B.S. expected May 2028 · GPA 3.38',
  location: 'Long Beach, California',
  email: 'AndyxMolina@outlook.com',
  phone: '(714) 679-6494',
  tagline:
    'A working portfolio of statistical readings of everyday life — what a city counts, what a freeway carries, what a marketplace forgets.',
};

export const SKILLS = {
  Languages: ['Python', 'SQL', 'R', 'Bash'],
  'Cloud & DevOps': ['AWS', 'Git', 'Docker'],
  'Data Science': ['Scikit-learn', 'LangChain', 'Ollama', 'Hugging Face',
    'Pandas', 'NumPy', 'Tableau', 'Excel'],
};

export const HERO_SERIES = (() => {
  const pts = [];
  for (let h = 0; h < 168; h++) {
    const day = Math.floor(h / 24);
    const hod = h % 24;
    const isWeekend = day >= 5;
    const morning = 3200 * Math.exp(-Math.pow((hod - 7) / 1.6, 2));
    const evening = 3500 * Math.exp(-Math.pow((hod - 17) / 2.0, 2));
    const base = 1100 + 1500 * Math.exp(-Math.pow((hod - 13) / 6, 2));
    let v = base + morning + evening;
    if (isWeekend) v = 800 + 2400 * Math.exp(-Math.pow((hod - 14) / 4.5, 2));
    v += 90 * Math.sin(h * 0.7) + 60 * Math.cos(h * 0.31);
    pts.push({ hour: h, day, hod, value: Math.max(0, Math.round(v)) });
  }
  return pts;
})();

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const PROJECTS = [
  {
    id: 'equity',
    fig: 'I',
    title: 'Long Beach Racial & Health Equity',
    field: 'Civic',
    year: 2025,
    month: 'Aug',
    role: 'Data Scientist · City of Long Beach',
    languages: ['R', 'SQL'],
    tools: ['Tidycensus', 'PUMS', 'Tableau', 'ggplot2'],
    methods: ['R', 'Tidycensus', 'PUMS', 'Tableau'],
    href: '/lbrhe',
    blurb:
      'Updated the city\u2019s inequality dashboards from current U.S. Census data \u2014 5M+ rows of PUMS microdata, narrowed to 500+ variables relevant to Long Beach, with custom indicators built for issues unique to the city.',
    figureKind: 'pyramid',
    art: 'longbeach',
    rows: '5,000,000+',
  },
  {
    id: 'apps',
    fig: 'II',
    title: 'Profitable App Profiles, App Store & Google Play',
    field: 'Market',
    year: 2025,
    month: 'Jul',
    role: 'Independent study',
    languages: ['Python'],
    tools: ['Pandas', 'NumPy', 'Jupyter'],
    methods: ['Python', 'Pandas', 'frequency tables', 'sentiment'],
    href: '/viewer/apps',
    blurb:
      'Surveyed app metadata across both stores to find which genres reliably draw users. After cleaning and de-duplication, Games dominated iOS and Tools dominated Google Play.',
    figureKind: 'paletteStrip',
    art: 'apps',
    rows: '17,000+',
  },
  {
    id: 'traffic',
    fig: 'III',
    title: 'Indicators of Heavy Traffic on I-94',
    field: 'Civic',
    year: 2025,
    month: 'Jun',
    role: 'Independent study',
    languages: ['Python'],
    tools: ['Pandas', 'Matplotlib', 'Seaborn', 'Jupyter'],
    methods: ['Python', 'time-series', 'EDA', 'Matplotlib'],
    href: '/viewer/traffic',
    blurb:
      'Volume on the westbound I-94 averages 3,260 vehicles per hour, but weekdays carry 4,762 and weekends 1,785. Two daily peaks at 7AM and 5PM, weather a weak signal once you control for hour-of-day.',
    figureKind: 'lineMini',
    art: 'i94',
    rows: '48,204',
  },
  {
    id: 'ebay',
    fig: 'IV',
    title: 'eBay Kleinanzeigen \u2014 Used Car Listings',
    field: 'Market',
    year: 2025,
    month: 'May',
    role: 'Independent study',
    languages: ['Python'],
    tools: ['Pandas', 'Seaborn', 'NumPy', 'Jupyter'],
    methods: ['Python', 'EDA', 'regression', 'Seaborn'],
    href: '/viewer/ebay',
    blurb:
      '50,000 listings from the German classifieds, cleaned (price\u2192int, odometer\u2192int, three near-constant columns dropped), then explored for the make/model/year/mileage signals that actually move price.',
    figureKind: 'sentiment',
    art: 'ebay',
    rows: '50,000',
  },
];

export const THEME = { ink: '#e8dcc4', accent: '#d97a5a', paper: '#1c1814', panel: '#26211a' };
export const FONTS = { serif: "'Spectral', 'EB Garamond', serif", display: "'Spectral', 'EB Garamond', serif" };
export const MONO = "'JetBrains Mono', ui-monospace, monospace";
