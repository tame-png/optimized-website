// Every piece of copy and every figure on the site lives here.
// Pages read from this file; a title or number is never written into a component.

export const SITE = {
  name: 'Andy Molina',
  description:
    'Applied-statistics portfolio: marimo notebooks that run in the browser, R pipelines, workbooks and certificates from a Long Beach State student.',
};

export const PROFILE = {
  name: 'Andy Molina',
  school: 'California State University, Long Beach',
  degree: 'B.S. Applied Statistics, expected May 2028',
  gpa: '3.38',
  email: 'AndyxMolina@outlook.com',
  phone: '(714) 679-6494',
  github: 'https://github.com/tame-png',
  coordinates: '33.7838° N, 118.1141° W',
  tagline:
    'Statistical readings of everyday life: what a city counts, what a freeway carries, what a marketplace forgets.',
  resumePdf: 'resume/Andy_Molina_Resume.pdf',
  resumeUpdated: 'May 2026',
};

export const KPIS = [
  { value: 5e6, display: '5.0M+', label: 'Census PUMS rows handled' },
  { value: 500, display: '500+', label: 'Variables engineered' },
  { value: 48204, display: '48,204', label: 'Hours of freeway traffic read' },
  { value: 3, display: '3', label: 'Notebooks that run in your browser' },
];

// Date the notebook exports under public/notebooks/<slug>/ were last rebuilt.
const EXPORTED = '27 Oct 2026';

export const PROJECTS = [
  {
    id: 'lbrhe',
    title: 'Racial and health equity in Long Beach',
    kind: 'paper',
    runtime: 'r',
    runtimeLabel: 'R · tidycensus · Tableau',
    tools: ['R', 'tidycensus', 'PUMS', 'Tableau'],
    year: 2025,
    blurb:
      'Commissioned by the City of Long Beach to refresh its inequality dashboards from current Census microdata: five million PUMS rows narrowed to five hundred variables that matter to the city, with custom indicators for problems Long Beach has and other cities do not.',
    outcome: '5M+ rows, 500+ variables, four neighborhoods compared',
    rows: '5,000,000+',
    href: '/paper/lbrhe',
    figure: 'pyramid',
    flagship: true,
  },
  {
    id: 'traffic',
    title: 'Indicators of heavy traffic on I-94',
    kind: 'notebook',
    runtime: 'marimo',
    runtimeLabel: 'marimo · Python',
    tools: ['Python', 'pandas', 'Matplotlib'],
    year: 2025,
    blurb:
      'Westbound I-94 averages 3,260 vehicles an hour. Split at 7 am and 7 pm, the daytime hours carry the story: about 5,200 an hour on weekdays against 3,700 at weekends, with a dip every July and another at the end of the year.',
    outcome: 'Weekdays near 5,200 an hour, weekends near 3,700',
    rows: '48,204',
    slug: 'i94',
    views: { studio: 'builds/i94/studio/index.html', explorer: 'notebooks/i94/explorer.py' },
    exported: EXPORTED,
    brief: {
      question: 'Which times and conditions make westbound traffic on I-94 heavy?',
      data: '48,204 hourly readings from Minnesota DOT station ATR 301, October 2012 to September 2018, with weather for each hour.',
      method:
        'Histograms and summary statistics, a day and night split at 7 am and 7 pm, then mean volume by month, by year within July, and by day of the week.',
      result:
        'Daytime weekdays average about 5,200 vehicles an hour and weekends about 3,700; July and the end of the year are the quiet months.',
      limits:
        'One sensor in one direction; two hours are missing in October 2012 and 2014 to 2015 are thinly reported, so yearly comparisons are indicative only.',
    },
    datasets: [
      {
        filename: 'Metro_Interstate_Traffic_Volume.csv',
        size: '3.2 MB',
        rows: '48,204',
        source: 'UCI Machine Learning Repository, John Hogue',
        sourceHref: 'https://archive.ics.uci.edu/dataset/492/metro+interstate+traffic+volume',
        look: 'Hourly westbound volume with temperature, rain, snow, cloud cover and a weather label. The notebook parses date_time and splits day from night.',
        preview: {
          columns: ['date_time', 'holiday', 'temp', 'weather_main', 'traffic_volume'],
          rows: [
            ['2012-10-02 09:00', 'None', 288.28, 'Clouds', 5545],
            ['2012-10-02 10:00', 'None', 289.36, 'Clouds', 4516],
            ['2012-10-02 11:00', 'None', 289.58, 'Clouds', 4767],
            ['2012-10-02 12:00', 'None', 290.13, 'Clouds', 5026],
          ],
        },
      },
    ],
    figure: 'traffic',
  },
  {
    id: 'apps',
    title: 'Profitable app profiles on the App Store and Google Play',
    kind: 'notebook',
    runtime: 'marimo',
    runtimeLabel: 'marimo · Python',
    tools: ['Python', 'csv module'],
    year: 2025,
    blurb:
      'Eighteen thousand app listings from both stores, cleaned by hand with the standard library: a malformed row dropped, duplicates collapsed to the most-reviewed copy, paid apps set aside. Genre frequency tables then show Games leading the App Store and Tools leading Google Play.',
    outcome: 'Games lead iOS, Tools lead Google Play',
    rows: '18,038',
    slug: 'apps',
    exported: EXPORTED,
    brief: {
      question: 'Which kinds of free app attract the most users on each store, so a developer knows what to build?',
      data: '10,841 Google Play rows and 7,197 App Store rows from two Kaggle datasets, September 2018.',
      method:
        'Pure-Python cleaning with the csv module: drop the broken row, keep one copy of each app (the one with most reviews), keep free apps, then frequency tables of genre on each store.',
      result:
        'Games dominate the App Store listings; Tools lead Google Play, whose catalogue is spread far more evenly across genres.',
      limits:
        'Counts of listings, not of users or revenue; a crowded genre can still be a poor bet, which is where the next step (installs and ratings per genre) would go.',
    },
    datasets: [
      {
        filename: 'AppleStore.csv',
        size: '0.7 MB',
        rows: '7,197',
        source: 'Kaggle, Ramanathan',
        sourceHref: 'https://www.kaggle.com/datasets/ramamet4/app-store-apple-data-set-10k-apps',
        look: 'App Store metadata. rating_count_tot stands in for the number of users; price is a float with 0.0 for free apps.',
      },
      {
        filename: 'googleplaystore.csv',
        size: '1.3 MB',
        rows: '10,841',
        source: 'Kaggle, Lavanya',
        sourceHref: 'https://www.kaggle.com/datasets/lava18/google-play-store-apps',
        look: 'Google Play metadata. Row 10,472 is missing a column and is the first thing the notebook removes; Installs needs its plus signs stripped.',
      },
    ],
    figure: 'bars',
  },
  {
    id: 'ebay',
    title: 'Used-car listings on eBay Kleinanzeigen',
    kind: 'notebook',
    runtime: 'marimo',
    runtimeLabel: 'marimo · Python',
    tools: ['Python', 'pandas', 'NumPy'],
    year: 2025,
    blurb:
      'Fifty thousand listings from the German classifieds. Columns renamed, prices and odometer readings turned from strings into integers, implausible prices and registration years cut, then the six brands with over five percent of listings compared on mean price and mileage.',
    outcome: 'Six brands over 5% of listings; the German makes price highest',
    rows: '50,000',
    slug: 'ebay',
    exported: EXPORTED,
    brief: {
      question: 'What does the asking price of a used car on the German eBay classifieds follow?',
      data: '50,000 listings scraped from eBay Kleinanzeigen in 2016, from Kaggle, with price, odometer, registration year, brand and model.',
      method:
        'pandas cleaning: snake_case column names, price and odometer parsed to integers, prices kept between $1 and $350,000 and registration years between 1900 and 2017, then mean price and mileage by brand for brands with over 5% of listings.',
      result:
        'Volkswagen, BMW, Opel, Mercedes-Benz, Audi and Ford pass the 5% cut; the German premium makes carry the highest mean asking prices.',
      limits:
        'Asking prices, not sale prices; one scrape from one country; brand means hide model and age, which the next step would hold fixed.',
    },
    datasets: [
      {
        filename: 'autos.csv',
        size: '9.7 MB',
        rows: '50,000',
        source: 'Kaggle, Sijo VM',
        sourceHref: 'https://www.kaggle.com/datasets/sijovm/used-cars-data-from-ebay-kleinanzeigen',
        look: 'The raw scrape, Latin-1 encoded. price and odometer arrive as strings with $, km and thousands separators; the notebook cleans both.',
      },
    ],
    figure: 'decay',
  },
  {
    id: 'ledger',
    title: 'Portfolio exit ledger and tax-loss harvester',
    kind: 'workbook',
    runtime: 'excel',
    runtimeLabel: 'Excel · 4 sheets',
    tools: ['Excel', 'XIRR', 'pivot tables', 'pytest'],
    year: 2026,
    blurb:
      'A lot-level ledger with ATR trailing stops and wash-sale windows, reconciled against brokerage exports. Twenty automated checks mirror the workbook formulas so the sheet and the Python agree.',
    outcome: 'Ledger · Stops · XIRR · Audit',
    href: '/files',
    figure: 'sheet',
  },
];

// Stand-alone files. Add `href` (a path under public/) once a file is published.
export const FILES = [
  {
    kind: 'r',
    filename: 'tidycensus_lbrhe_pums.R',
    size: '18 KB',
    project: 'Racial and health equity in Long Beach',
    look: 'Lines 40 to 88 build the equity priority index from GRPIP, HICOV and POVPIP; the srvyr block after it computes replicate-weight standard errors.',
  },
  {
    kind: 'xlsx',
    filename: 'exit-ledger-2025.xlsx',
    size: '412 KB',
    project: 'Portfolio exit ledger and tax-loss harvester',
    look: 'Open the Stops sheet: column H is the Wilder ATR trailing stop, column K flags the wash-sale window. The XIRR sheet reconciles to brokerage lots.',
    sheets: ['Ledger', 'Stops', 'XIRR', 'Audit'],
  },
];

// A certificate is "verified" only with a verifyHref, "issued" with a pdfHref, otherwise pending.
export const CERTIFICATES = [
  {
    issuer: 'CSULB College of Natural Sciences and Mathematics',
    title: 'Student Research Symposium 2025, poster 28: Racial and health equity in Long Beach City',
    date: 'Sep 2025',
    pdfHref: 'paper/cnsm-symposium-abstract-booklet-2025.pdf',
    skills: ['tidycensus', 'PUMS', 'Tableau'],
    note: 'Listed in the symposium abstract booklet; no online verification.',
  },
  {
    issuer: 'Bloomberg for Education',
    title: 'Bloomberg Market Concepts',
    expected: 'In progress',
    skills: ['Economics', 'Fixed income', 'Equities', 'Terminal'],
  },
];

export const SKILLS = {
  Languages: ['Python', 'R', 'SQL', 'Bash', 'Excel'],
  'Data and quant': ['pandas', 'polars', 'NumPy', 'tidycensus', 'scikit-learn', 'Tableau'],
  'Platforms and AI': ['marimo', 'AWS', 'Docker', 'Git', 'LangChain', 'Ollama', 'Hugging Face'],
};

export const EXPERIENCE = [
  {
    when: 'Jun – Sep 2025',
    org: 'City of Long Beach · CSULB',
    title: 'Data scientist, Racial and Health Equity Research',
    bullets: [
      'Updated municipal inequality boards from U.S. Census data to inform policy and resource allocation.',
      'Used tidycensus in R to extract and clean over 5 million PUMS records across 500+ variables.',
      'Engineered composite socio-economic variables and interactive Tableau dashboards for officials and residents.',
    ],
  },
  {
    when: '2025 – 2026',
    org: 'Independent',
    title: 'Quantitative portfolio dashboard and exit engine',
    bullets: [
      'Reactive Python engine (marimo, polars, NumPy) with Wilder ATR trailing stops, CAPM regressions and XIRR.',
      'Lot-level tax netting and brokerage reconciliation verified by 20 pytest checks.',
    ],
  },
  {
    when: 'Jun – Sep 2025',
    org: 'Independent',
    title: 'Three exploratory analyses, published as browser-run notebooks',
    bullets: [
      'I-94 traffic, App Store and Google Play profiles, eBay Kleinanzeigen used cars: pandas and pure-Python cleaning, then summary statistics and charts.',
      'Each one re-runs in the browser through marimo and WebAssembly, with its data and source alongside.',
    ],
  },
  {
    when: 'Jan 2022 – present',
    org: "McDonald's",
    title: 'Crew member',
    bullets: [
      'High-throughput customer service and inventory restocking while completing full-time quantitative coursework.',
    ],
  },
];
