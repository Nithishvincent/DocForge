import React, { useState, useEffect } from 'react';

// Pre-defined Accent Color presets
const ACCENT_PRESETS = [
  { name: 'Royal Indigo', value: '#6366f1' },
  { name: 'Emerald Forest', value: '#10b981' },
  { name: 'Deep Crimson', value: '#dc2626' },
  { name: 'Solar Amber', value: '#f59e0b' },
  { name: 'Sleek Obsidian', value: '#0f172a' },
];

// Curated Unsplash images for high-fidelity illustration mapping
const ILLUSTRATION_MAP = {
  tech: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
  finance: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1000&auto=format&fit=crop&q=80',
  science: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=1000&auto=format&fit=crop&q=80',
  nature: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80',
  business: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
  education: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1000&auto=format&fit=crop&q=80',
  general: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1000&auto=format&fit=crop&q=80',
};

// Rich set of accurate stock photos grouped by topic category
const TOPIC_IMAGES = {
  tech: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80'
  ],
  finance: [
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop&q=80'
  ],
  science: [
    'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1000&auto=format&fit=crop&q=80'
  ],
  nature: [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1000&auto=format&fit=crop&q=80'
  ],
  business: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80'
  ],
  education: [
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1000&auto=format&fit=crop&q=80'
  ],
  general: [
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1000&auto=format&fit=crop&q=80'
  ]
};

const getPhotoUrl = (query) => {
  const q = (query || '').toLowerCase();
  let category = 'general';
  if (q.includes('tech') || q.includes('code') || q.includes('comput') || q.includes('system') || q.includes('network') || q.includes('software')) category = 'tech';
  else if (q.includes('finance') || q.includes('market') || q.includes('money') || q.includes('stock') || q.includes('business') || q.includes('analysis') || q.includes('strateg')) category = 'business';
  else if (q.includes('science') || q.includes('lab') || q.includes('chem') || q.includes('bio') || q.includes('research') || q.includes('medic') || q.includes('health')) category = 'science';
  else if (q.includes('nature') || q.includes('green') || q.includes('environment') || q.includes('forest') || q.includes('tree') || q.includes('earth') || q.includes('garden')) category = 'nature';
  else if (q.includes('learn') || q.includes('book') || q.includes('educat') || q.includes('school') || q.includes('student') || q.includes('teach')) category = 'education';
  
  const list = TOPIC_IMAGES[category] || TOPIC_IMAGES.general;
  const index = Math.abs(q.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % list.length;
  return list[index];
};

// Default high-fidelity sample document displayed on load
const MOCK_DOCUMENT_PAGES = [
  {
    type: 'cover',
    title: 'DocForge AI: Next-Generation Enterprise Document Architect',
    subtitle: 'A Comprehensive Strategic Study and Operational Framework for Digital-First Organizations',
    dateStr: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    author: 'DocForge Synthesis Engine',
    version: 'v2.4.0',
    classification: 'Confidential / Internal Use Only'
  },
  {
    type: 'toc',
    title: 'Table of Contents'
  },
  {
    type: 'preface',
    title: 'Preface & Scope',
    paragraphs: [
      'As organizations transition rapidly into intelligence-driven ecosystems, the demand for structured, dynamic, and publication-ready communications has never been higher. This strategic blueprint introduces the foundational principles of DocForge, a full-stack document compilation architecture designed to automate, customize, and serialize enterprise knowledge assets.',
      'Our primary scope encompasses the structural layout, styling mechanics, and AI-enabled generation systems that permit business professionals to compile 12-to-50-page highly accurate manuals, research monographs, and strategic reports. Through algorithmic layout enforcement, custom-themed SVG data projections, and synchronized print pagination pipelines, this framework establishes a new benchmark for business communication standards.'
    ]
  },
  {
    type: 'chapter-page',
    chapterTitle: 'Chapter 1: Technological Landscape of Enterprise Documentation',
    chapterIndex: 1,
    pageIndex: 1,
    paragraphs: [
      'Modern digital assets require more than simple static layouts. They demand responsive typesetting systems that honor high-fidelity grid alignment, flexible margin sizes, and context-dependent margins. The primary technical bottleneck in document compilation remains the translation of unstructured layout coordinates into standardized PDF formats without introducing element cropping, text overlapping, or vertical shifting.',
      'Our framework targets these challenges directly by binding logical document schemas with an interactive CSS variable system. Using dynamic layout grids, pages are isolated as self-contained A4 units on the web canvas, meaning adjustments to margin dimensions or fonts immediately recalculate boundaries without breaking downstream pagination grids.'
    ],
    hasCallout: true,
    calloutText: 'Strategic Quote: "A highly aligned documentation model reduces structural friction and accelerates team synchronization by over 40%."'
  },
  {
    type: 'chapter-page',
    chapterTitle: 'Chapter 2: Operational Data Metrics and Visualizations',
    chapterIndex: 2,
    pageIndex: 1,
    paragraphs: [
      'Visual clarity is a foundational pillar of communication. Standard spreadsheets and unstyled tables often obscure critical milestones. Instead, embedding dynamic SVG data graphs styled with the active brand palette ensures that the document tells a cohesive, visually engaging story.',
      'The data below highlights three distinct operational metrics tracked during the validation phase of DocForge. Notice the relationship between automated document alignment and client download completion rates.'
    ],
    hasTable: true,
    tableRows: [
      { metric: 'Layout Alignment Accuracy', baseline: '74.2% variance', target: '99.9% pixel-aligned' },
      { metric: 'Average Rendering Time', baseline: '12.4 seconds', target: '1.8 seconds (cached)' },
      { metric: 'Compilation Success Rate', baseline: '81.0% reliability', target: '100% fail-safe export' }
    ]
  },
  {
    type: 'chapter-page',
    chapterTitle: 'Chapter 3: Interactive Scaling & Dynamic Data Visualizations',
    chapterIndex: 3,
    pageIndex: 1,
    paragraphs: [
      'Adding interactive SVG elements like line and bar charts enables readers to grasp performance trends instantly. Because these diagrams are rendered using pure vectors directly inside the browser, they scale flawlessly when exported to PDF and maintain perfect crispness even at 300 DPI.',
      'Below is a visual representation of user satisfaction metrics across various template designs, demonstrating that polished Editorial and Tech templates drive the highest engagement rates.'
    ],
    hasChart: true,
    chartType: 'line-chart'
  },
  {
    type: 'conclusion',
    title: 'Summary & Strategic Conclusion',
    paragraphs: [
      'In conclusion, the DocForge compilation architecture offers a seamless, dual-pane editing environment that bridges the gap between AI generation and professional print publishing. By automating layout margins, font systems, and Table of Contents calculations, organizations can produce beautiful multi-page materials in seconds instead of hours.',
      'Moving forward, our roadmap includes deeper integration of advanced vector diagrams and dynamic data pipelines, ensuring that enterprise documentation remains a living, evolving asset that drives clarity and corporate alignment.'
    ]
  },
  {
    type: 'references',
    title: 'References & Bibliography',
    references: [
      'Gemini AI Documentation. (2025). Google Generative Language Model Reference API. Mountain View, CA: Google Press.',
      'Smith, A. R., & Doe, J. E. (2024). Principles of Dynamic Layout Systems in Modern Web Application Scaffolding. Journal of Typesetting, 14(2), 112-128.',
      'DocForge Standards Board. (2026). Strategic Frameworks for Corporate Asset Formatting and PDF Pagination. New York, NY: Enterprise Press.',
      'Wilson, K. L. (2025). The Power of Visual Vector Graphics in Digital Document Translation. Computer Graphics Review, 39(4), 45-56.'
    ]
  }
];

// --- High-fidelity Dynamic Offline Generator ---
const generateMockPages = (topic, pageCount) => {
  const pages = [];
  
  // 1. Cover
  pages.push({
    type: 'cover',
    title: topic,
    subtitle: 'A Comprehensive Strategic Study and Operational Framework',
    dateStr: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    author: 'DocForge Synthesis Engine',
    version: 'v1.0.0',
    classification: 'Official Study Report / Demo Mode'
  });

  // 2. TOC
  pages.push({
    type: 'toc',
    title: 'Table of Contents'
  });

  // 3. Preface
  pages.push({
    type: 'preface',
    title: 'Preface & Scope',
    paragraphs: [
      `As organizations transition rapidly into intelligence-driven ecosystems, the demand for structured, dynamic, and publication-ready communications regarding "${topic}" has never been higher. This strategic blueprint introduces the foundational principles of "${topic}" compilation architecture designed to automate, customize, and serialize enterprise knowledge assets.`,
      `Our primary scope encompasses the structural layout, styling mechanics, and systems that permit professionals to compile manuals, research monographs, and strategic reports on "${topic}". Through algorithmic layout enforcement and themed projections, this framework establishes a new benchmark for business communication standards.`
    ]
  });

  // 4. Chapter pages (Page 4 to pageCount - 2)
  const chapters = [
    { num: 1, title: `Foundations and Core Background of ${topic}` },
    { num: 2, title: `Technical and Operational Dimensions of ${topic}` },
    { num: 3, title: `Strategic Implementation and Integration of ${topic}` },
    { num: 4, title: `Advanced Analytics, Case Studies, and reference models` },
    { num: 5, title: `Key Stakeholder Alignment and Policy Guidelines` }
  ];

  const totalChapterPages = pageCount - 4; // Total pages for chapters
  let currentChapterIdx = 0;
  let pageInCurrentChapter = 1;

  for (let i = 0; i < totalChapterPages; i++) {
    const ch = chapters[currentChapterIdx % chapters.length];
    
    const pageObj = {
      type: 'chapter-page',
      chapterTitle: `Chapter ${ch.num}: ${ch.title}`,
      chapterIndex: ch.num,
      pageIndex: pageInCurrentChapter,
      paragraphs: [
        `Analyzing the landscape of "${topic}" requires a deep understanding of its functional components. First, teams must map the workflow dependencies that influence production. Unaligned variables can lead to cascading delays, structural conflicts, and compliance errors during execution.`,
        `By leveraging modern design principles, organizations can standardize their approach to "${topic}". The data gathered during initial phases indicates that structured layout coordinates reduce operational friction by up to 35%, ensuring cross-functional teams operate from a single, unified source of truth.`
      ]
    };

    // Cycle layouts (Callout + Photo -> Table -> Flow Chart -> Donut Chart -> List + Photo)
    const layoutType = i % 5;
    if (layoutType === 0) {
      pageObj.hasCallout = true;
      pageObj.calloutText = `Strategic Quote: "Developing a comprehensive roadmap for ${topic} is essential for achieving long-term operational excellence and organization-wide alignment."`;
      pageObj.hasPhoto = true;
      pageObj.photoQuery = `${topic} roadmap system`;
      pageObj.photoCaption = `Figure ${ch.num}.${pageInCurrentChapter}: Strategic roadmap alignment and milestone check targets.`;
    } else if (layoutType === 1) {
      pageObj.hasTable = true;
      pageObj.tableRows = [
        { metric: `${topic} Performance`, baseline: '74.2% variance', target: '99.9% aligned' },
        { metric: 'Average Compile Time', baseline: '12.4 seconds', target: '1.8 seconds (cached)' },
        { metric: 'Operational Compliance', baseline: '81.0% reliability', target: '100% fail-safe standards' }
      ];
    } else if (layoutType === 2) {
      pageObj.hasChart = true;
      pageObj.chartType = 'flow-chart';
    } else if (layoutType === 3) {
      pageObj.hasChart = true;
      pageObj.chartType = 'donut-chart';
    } else if (layoutType === 4) {
      pageObj.hasList = true;
      pageObj.listItems = [
        `Establish clear strategic goals for ${topic} integration.`,
        `Train operational personnel on core safety and quality protocols.`,
        `Deploy continuous auditing systems to track execution metrics.`,
        `Refine compliance metrics quarterly to match market developments.`
      ];
      pageObj.hasPhoto = true;
      pageObj.photoQuery = `${topic} brainstorm collaboration`;
      pageObj.photoCaption = `Figure ${ch.num}.${pageInCurrentChapter}: Joint development and validation mapping.`;
    }

    pages.push(pageObj);

    if (pageInCurrentChapter >= 2) {
      currentChapterIdx++;
      pageInCurrentChapter = 1;
    } else {
      pageInCurrentChapter++;
    }
  }

  // 5. Conclusion
  pages.push({
    type: 'conclusion',
    title: 'Summary & Strategic Conclusion',
    paragraphs: [
      `In conclusion, compiling a robust framework for "${topic}" offers a seamless path toward high efficiency and professional communication. By automating structural margins, font systems, and data projections, teams can produce high-impact assets in minutes instead of days.`,
      `Moving forward, our roadmap includes deeper integration of advanced data pipelines, ensuring that enterprise documentation on "${topic}" remains a living, evolving asset that drives clarity and corporate alignment.`
    ]
  });

  // 6. References
  pages.push({
    type: 'references',
    title: 'References & Bibliography',
    references: [
      `"${topic}" Standards Board. (2026). Strategic Frameworks for Asset Formatting. New York, NY: Enterprise Press.`,
      `Smith, A. R., & Doe, J. E. (2025). Principles of Dynamic Layout Systems in ${topic}. Journal of Systemics, 14(2), 112-128.`,
      `Wilson, K. L. (2025). The Power of Visual Vector Graphics in ${topic} Documents. Computer Graphics Review, 39(4), 45-56.`,
      `DocForge AI Documentation. (2026). LLM Document Architect Reference API. Mountain View, CA: Tech Press.`
    ]
  });

  return pages;
};

export default function App() {
  // --- UI State Management ---
  const [topic, setTopic] = useState('Enterprise Document Automation');
  const [pageCount, setPageCount] = useState(8);
  const [template, setTemplate] = useState('tech'); // minimalist, executive, academic, editorial, tech
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [fontFamily, setFontFamily] = useState('Outfit'); // Outfit, Poppins, Playfair Display
  const [marginSize, setMarginSize] = useState('60px'); // 40px, 60px, 80px
  const [alignment, setAlignment] = useState('justify'); // left, center, justify
  const [zoom, setZoom] = useState(0.8);
  const [editMode, setEditMode] = useState(false);
  const [provider, setProvider] = useState('gemini'); // gemini, openai, or grok
  const [modelName, setModelName] = useState('gemini-2.5-flash');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [grokApiKey, setGrokApiKey] = useState('');
  
  // --- Generation State ---
  const [pages, setPages] = useState(MOCK_DOCUMENT_PAGES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Save/Load API Keys from localStorage
  useEffect(() => {
    const savedGeminiKey = localStorage.getItem('docforge_gemini_api_key') || localStorage.getItem('docforge_api_key') || '';
    const savedOpenaiKey = localStorage.getItem('docforge_openai_api_key') || '';
    const savedGrokKey = localStorage.getItem('docforge_grok_api_key') || '';
    
    if (savedGeminiKey) setGeminiApiKey(savedGeminiKey);
    if (savedOpenaiKey) setOpenaiApiKey(savedOpenaiKey);
    if (savedGrokKey) setGrokApiKey(savedGrokKey);
  }, []);

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    if (newProvider === 'gemini') {
      setModelName('gemini-2.5-flash');
    } else if (newProvider === 'openai') {
      setModelName('gpt-4o-mini');
    } else if (newProvider === 'grok') {
      setModelName('grok-2');
    }
  };

  const handleGeminiKeyChange = (val) => {
    setGeminiApiKey(val);
    localStorage.setItem('docforge_gemini_api_key', val);
  };

  const handleOpenaiKeyChange = (val) => {
    setOpenaiApiKey(val);
    localStorage.setItem('docforge_openai_api_key', val);
  };

  const handleGrokKeyChange = (val) => {
    setGrokApiKey(val);
    localStorage.setItem('docforge_grok_api_key', val);
  };

  // Sync state modifications with CSS custom properties
  useEffect(() => {
    document.documentElement.style.setProperty('--doc-accent', accentColor);
    document.documentElement.style.setProperty('--doc-margin', marginSize);
    document.documentElement.style.setProperty('--doc-align', alignment);
    
    let fontHead = 'Outfit, sans-serif';
    let fontBody = 'Poppins, sans-serif';
    
    if (fontFamily === 'Poppins') {
      fontHead = 'Poppins, sans-serif';
      fontBody = 'Poppins, sans-serif';
    } else if (fontFamily === 'Playfair') {
      fontHead = 'Playfair Display, serif';
      fontBody = 'Georgia, serif';
    } else if (fontFamily === 'Outfit') {
      fontHead = 'Outfit, sans-serif';
      fontBody = 'Poppins, sans-serif';
    }
    
    document.documentElement.style.setProperty('--doc-font-heading', fontHead);
    document.documentElement.style.setProperty('--doc-font-body', fontBody);
  }, [accentColor, fontFamily, marginSize, alignment]);

  // Dynamically sync zoom scale
  useEffect(() => {
    document.documentElement.style.setProperty('--zoom-factor', zoom.toString());
  }, [zoom]);

  // Match topic keywords to curate cover photos
  const getCoverPhoto = () => {
    const lowerTopic = topic.toLowerCase();
    if (lowerTopic.includes('tech') || lowerTopic.includes('ai') || lowerTopic.includes('code') || lowerTopic.includes('comput')) {
      return ILLUSTRATION_MAP.tech;
    }
    if (lowerTopic.includes('financ') || lowerTopic.includes('money') || lowerTopic.includes('market') || lowerTopic.includes('stock')) {
      return ILLUSTRATION_MAP.finance;
    }
    if (lowerTopic.includes('science') || lowerTopic.includes('chem') || lowerTopic.includes('bio') || lowerTopic.includes('med')) {
      return ILLUSTRATION_MAP.science;
    }
    if (lowerTopic.includes('nature') || lowerTopic.includes('green') || lowerTopic.includes('climat') || lowerTopic.includes('forest')) {
      return ILLUSTRATION_MAP.nature;
    }
    if (lowerTopic.includes('learn') || lowerTopic.includes('book') || lowerTopic.includes('school') || lowerTopic.includes('educat')) {
      return ILLUSTRATION_MAP.education;
    }
    if (lowerTopic.includes('business') || lowerTopic.includes('work') || lowerTopic.includes('corp') || lowerTopic.includes('strateg')) {
      return ILLUSTRATION_MAP.business;
    }
    return ILLUSTRATION_MAP.general;
  };

  // --- API Document Generation Handler ---
  const handleGenerate = async () => {
    if (!topic.trim()) {
      setErrorMessage('Please provide a document topic.');
      return;
    }
    setErrorMessage('');
    setIsGenerating(true);
    setGenerationProgress(10);

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => (prev < 90 ? (provider === 'mock' ? prev + 15 : prev + 8) : prev));
    }, provider === 'mock' ? 300 : 1500);

    if (provider === 'mock') {
      setTimeout(() => {
        clearInterval(progressInterval);
        setGenerationProgress(100);
        
        const mockPages = generateMockPages(topic, pageCount);
        
        setTimeout(() => {
          setPages(mockPages);
          setIsGenerating(false);
        }, 300);
      }, 1500);
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          pageCount,
          modelName,
          customApiKey: provider === 'gemini' ? geminiApiKey : (provider === 'openai' ? openaiApiKey : grokApiKey),
          provider
        })
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.details || 'Server returned an error');
      }

      const data = await response.json();
      setGenerationProgress(100);
      
      // Inject standard cover design parameters not generated by Gemini
      const enrichedPages = data.pages.map(page => {
        if (page.type === 'cover') {
          return {
            ...page,
            author: 'DocForge Synthesis Engine',
            version: 'v1.0.0',
            classification: 'Official Study Report'
          };
        }
        return page;
      });

      setTimeout(() => {
        setPages(enrichedPages);
        setIsGenerating(false);
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);
      setErrorMessage(err.message);
      setIsGenerating(false);
    }
  };

  // --- Inline Content Editor Sync ---
  const updateContent = (pageIdx, field, val, pIdx = null, isList = false, isTable = false, rowIdx = null, colKey = null) => {
    setPages(prevPages => {
      const copy = [...prevPages];
      const page = { ...copy[pageIdx] };
      
      if (isList && pIdx !== null) {
        const listItems = [...page.listItems];
        listItems[pIdx] = val;
        page.listItems = listItems;
      } else if (isTable && rowIdx !== null && colKey !== null) {
        const tableRows = [...page.tableRows];
        tableRows[rowIdx] = { ...tableRows[rowIdx], [colKey]: val };
        page.tableRows = tableRows;
      } else if (pIdx !== null) {
        const paragraphs = [...page.paragraphs];
        paragraphs[pIdx] = val;
        page.paragraphs = paragraphs;
      } else {
        page[field] = val;
      }

      copy[pageIdx] = page;
      return copy;
    });
  };

  // --- PDF Export Handler (Style Reset & html2pdf) ---
  const handleExportPDF = () => {
    const element = document.getElementById('document-canvas');
    if (!element) return;

    // Preserve original scale/styling properties
    const originalZoom = zoom;
    const canvasPages = element.querySelectorAll('.page');

    // 1. Temporarily disable zoom, border styles, and spacing in DOM
    // DO NOT call setZoom(1.0) to prevent React from re-rendering and detaching active DOM nodes!
    document.documentElement.style.setProperty('--zoom-factor', '1');
    element.classList.add('pdf-mode');
    canvasPages.forEach(p => p.classList.add('pdf-page-break'));

    // 2. Temporarily inline CSS variables with computed static values
    const elementsWithVars = element.querySelectorAll('*');
    const originalStyles = [];
    const allElements = [element, ...Array.from(elementsWithVars)];

    allElements.forEach(el => {
      const computed = window.getComputedStyle(el);
      const styleToApply = {};

      // Check and copy styles that use custom variables to static values
      if (computed.padding && computed.padding !== '0px') {
        styleToApply.padding = computed.padding;
      }
      if (computed.fontFamily) {
        styleToApply.fontFamily = computed.fontFamily;
      }
      if (computed.textAlign) {
        styleToApply.textAlign = computed.textAlign;
      }
      if (computed.color && (
        el.classList.contains('cover-header-brand') || 
        el.classList.contains('toc-item-page') || 
        el.classList.contains('chapter-header-badge') ||
        el.classList.contains('custom-list-item')
      )) {
        styleToApply.color = computed.color;
      }
      if (computed.backgroundColor && (
        el.classList.contains('cover-divider') ||
        el.classList.contains('legend-color')
      )) {
        styleToApply.backgroundColor = computed.backgroundColor;
      }
      if (computed.borderBottomStyle && computed.borderBottomStyle !== 'none' && computed.borderBottomWidth !== '0px') {
        styleToApply.borderBottom = computed.borderBottom;
      }
      if (computed.borderLeftStyle && computed.borderLeftStyle !== 'none' && computed.borderLeftWidth !== '0px') {
        styleToApply.borderLeft = computed.borderLeft;
      }
      if (computed.left && computed.left !== 'auto') {
        styleToApply.left = computed.left;
      }
      if (computed.right && computed.right !== 'auto') {
        styleToApply.right = computed.right;
      }

      originalStyles.push({
        el,
        styleAttr: el.getAttribute('style')
      });

      Object.assign(el.style, styleToApply);
    });

    const cleanFilename = topic.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'document';
    const opt = {
      margin: 0,
      filename: `docforge_${cleanFilename}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        scrollX: 0, 
        scrollY: 0 
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const restoreStyles = () => {
      // Restore styles
      originalStyles.forEach(item => {
        if (item.styleAttr === null) {
          item.el.removeAttribute('style');
        } else {
          item.el.setAttribute('style', item.styleAttr);
        }
      });
      // Restore zoom and layouts directly in DOM
      document.documentElement.style.setProperty('--zoom-factor', originalZoom.toString());
      element.classList.remove('pdf-mode');
      canvasPages.forEach(p => p.classList.remove('pdf-page-break'));
    };

    // 3. Generate PDF via html2pdf after a small timeout to let the browser reflow styles and transform scales
    setTimeout(() => {
      window.html2pdf()
        .from(element)
        .set(opt)
        .save()
        .then(() => {
          restoreStyles();
        })
        .catch(err => {
          console.error('PDF Generation Error:', err);
          restoreStyles();
        });
    }, 250);
  };

  // --- HTML Export Handler (Standalone styling integration) ---
  const handleExportHTML = () => {
    const element = document.getElementById('document-canvas');
    if (!element) return;

    // Gather active variables
    const fontHead = document.documentElement.style.getPropertyValue('--doc-font-heading') || 'Outfit, sans-serif';
    const fontBody = document.documentElement.style.getPropertyValue('--doc-font-body') || 'Poppins, sans-serif';

    // Clone the node to export the static markup
    const docClone = element.cloneNode(true);
    // Remove controls, edit wrappers and page scales
    docClone.classList.remove('pdf-mode');
    docClone.style.transform = 'none';
    docClone.style.gap = '40px';

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${topic} - DocForge AI Export</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --doc-accent: ${accentColor};
      --doc-margin: ${marginSize};
      --doc-align: ${alignment};
      --doc-font-heading: ${fontHead};
      --doc-font-body: ${fontBody};
    }
    body {
      background-color: #f1f5f9;
      margin: 0;
      padding: 40px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }
    
    /* Core Document Layout Styling */
    .page {
      width: 794px;
      height: 1123px;
      background-color: #ffffff;
      color: #1e293b;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: var(--doc-margin);
      box-sizing: border-box;
      page-break-after: always;
      break-after: page;
    }
    .page h1, .page h2, .page h3, .page h4 {
      font-family: var(--doc-font-heading);
      color: #0f172a;
      margin-top: 0;
    }
    .page p, .page li, .page td, .page th {
      font-family: var(--doc-font-body);
      font-size: 13.5px;
      line-height: 1.6;
      color: #334155;
      text-align: var(--doc-align);
    }
    .page-header {
      position: absolute;
      top: 25px;
      left: var(--doc-margin);
      right: var(--doc-margin);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      font-size: 10px;
      color: #64748b;
      font-family: var(--doc-font-heading);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .page-footer {
      position: absolute;
      bottom: 25px;
      left: var(--doc-margin);
      right: var(--doc-margin);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      font-size: 10px;
      color: #64748b;
      font-family: var(--doc-font-heading);
    }
    .page-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      margin-top: 15px;
      margin-bottom: 15px;
      overflow: hidden;
      position: relative;
    }
    
    /* Cover Styling */
    .page-cover { justify-content: space-between; height: 100%; }
    .cover-header-brand { font-family: var(--doc-font-heading); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; color: var(--doc-accent); }
    .cover-main-content { flex: 1; display: flex; flex-direction: column; justify-content: center; margin-bottom: 40px; }
    .cover-title { font-size: 38px; font-weight: 800; line-height: 1.15; margin-bottom: 16px; color: #0f172a; letter-spacing: -1px; }
    .cover-subtitle { font-size: 16px; color: #475569; line-height: 1.5; margin-bottom: 30px; }
    .cover-divider { width: 80px; height: 6px; background-color: var(--doc-accent); border-radius: 3px; margin-bottom: 40px; }
    .cover-meta { border-top: 1px solid #e2e8f0; padding-top: 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .meta-item { display: flex; flex-direction: column; }
    .meta-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 2px; }
    .meta-value { font-size: 12px; font-weight: 600; color: #334155; font-family: var(--doc-font-heading); }
    .cover-graphic-container { margin-top: 20px; width: 100%; height: 240px; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
    .cover-graphic-img { width: 100%; height: 100%; object-fit: cover; }
    
    /* Elements */
    .page-toc-title { font-size: 26px; font-weight: 700; margin-bottom: 32px; border-bottom: 2px solid var(--doc-accent); padding-bottom: 8px; }
    .toc-list { display: flex; flex-direction: column; gap: 16px; padding: 0; list-style: none; }
    .toc-item { display: flex; justify-content: space-between; align-items: flex-end; font-size: 13.5px; font-weight: 500; }
    .toc-item-title { flex: 1; display: flex; align-items: flex-end; color: #334155; }
    .toc-item-title::after { content: " . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . "; color: #cbd5e1; margin-left: 8px; white-space: nowrap; overflow: hidden; }
    .toc-item-page { font-weight: 600; color: var(--doc-accent); margin-left: 8px; }
    
    .chapter-header-badge { display: inline-block; background-color: rgba(99, 102, 241, 0.1); color: var(--doc-accent); padding: 4px 10px; border-radius: 20px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .page-chapter-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; }
    .page-paragraph { margin-bottom: 18px; }
    
    .callout-box { background-color: #f8fafc; border-left: 4px solid var(--doc-accent); padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; font-style: italic; color: #475569; }
    
    .custom-list { padding-left: 20px; margin: 18px 0; }
    .custom-list-item { margin-bottom: 10px; position: relative; list-style: none; }
    .custom-list-item::before { content: "■"; color: var(--doc-accent); font-size: 9px; position: absolute; left: -20px; top: 1px; }
    
    .custom-table { width: 100%; border-collapse: collapse; margin: 22px 0; font-size: 12px; }
    .custom-table th { background-color: #f1f5f9; color: #1e293b; font-weight: 600; text-transform: uppercase; padding: 10px 14px; border-bottom: 2px solid #cbd5e1; }
    .custom-table td { padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #475569; }
    
    .chart-container { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 22px 0; display: flex; flex-direction: column; align-items: center; }
    .chart-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 15px; color: #475569; }
    .chart-svg { width: 100%; max-width: 440px; height: 160px; }
    .chart-legend { display: flex; gap: 15px; font-size: 10px; color: #64748b; margin-top: 10px; }
    .legend-item { display: flex; align-items: center; gap: 6px; }
    .legend-color { width: 8px; height: 8px; border-radius: 2px; }
    
    .reference-item { margin-bottom: 16px; padding-left: 24px; text-indent: -24px; font-size: 13px; color: #475569; }
    
    /* Templates */
    .template-minimalist { --doc-font-heading: 'Outfit', sans-serif; --doc-font-body: 'Outfit', sans-serif; }
    .template-executive { --doc-font-heading: 'Poppins', sans-serif; --doc-font-body: 'Poppins', sans-serif; }
    .template-executive .page-header { border-bottom: 2px solid var(--doc-accent); }
    .template-academic { --doc-font-heading: 'Playfair Display', serif; --doc-font-body: Georgia, serif; }
    .template-editorial { --doc-font-heading: 'Playfair Display', serif; --doc-font-body: 'Poppins', sans-serif; }
    .template-editorial .page { background-color: #fdfbf7; }
    .template-tech { --doc-font-heading: 'Outfit', sans-serif; --doc-font-body: 'Poppins', sans-serif; }
    .template-tech .custom-table th { background-color: #0f172a; color: white; }
    
    @media print {
      body { background: none; padding: 0; }
      .page { box-shadow: none; margin: 0; border: none; }
    }
  </style>
</head>
<body class="template-${template}">
  ${docClone.innerHTML}
</body>
</html>`;

    // Download dynamic block wrapper
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const cleanFilename = topic.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'document';
    link.setAttribute('download', `docforge_${cleanFilename}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Dynamic Table of Contents Compilation ---
  // Compiles page number indexing in React dynamically so that pages match exactly
  const getTOCItems = () => {
    let currentPageNum = 1;
    const tocItems = [];

    pages.forEach((page) => {
      if (page.type === 'cover') {
        // Page 1
        currentPageNum = 1;
      } else if (page.type === 'toc') {
        // Page 2
        currentPageNum = 2;
      } else if (page.type === 'preface') {
        tocItems.push({ title: page.title || 'Preface', pageIndex: 3 });
        currentPageNum = 3;
      } else if (page.type === 'chapter-page') {
        currentPageNum++;
        // Avoid duplicate chapter headers in TOC if they span multiple pages
        const isNewTitle = !tocItems.some(item => item.title === page.chapterTitle);
        if (isNewTitle) {
          tocItems.push({ title: page.chapterTitle, pageIndex: currentPageNum });
        }
      } else if (page.type === 'conclusion') {
        currentPageNum++;
        tocItems.push({ title: page.title || 'Conclusion', pageIndex: currentPageNum });
      } else if (page.type === 'references') {
        currentPageNum++;
        tocItems.push({ title: page.title || 'References', pageIndex: currentPageNum });
      }
    });

    return tocItems;
  };

  // --- Render custom dynamic SVG charts ---
  const renderSVGChart = (type) => {
    if (type === 'line-chart') {
      return (
        <div className="chart-container">
          <div className="chart-title">Client Satisfaction vs. Document Quality Index</div>
          <svg className="chart-svg" viewBox="0 0 400 150">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0.4"/>
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.0"/>
              </linearGradient>
            </defs>
            {/* Gridlines */}
            <line x1="40" y1="20" x2="380" y2="20" stroke="#e2e8f0" strokeDasharray="3" />
            <line x1="40" y1="60" x2="380" y2="60" stroke="#e2e8f0" strokeDasharray="3" />
            <line x1="40" y1="100" x2="380" y2="100" stroke="#e2e8f0" strokeDasharray="3" />
            <line x1="40" y1="130" x2="380" y2="130" stroke="#cbd5e1" strokeWidth="1.5" />
            
            {/* Area Path */}
            <path d="M 40 130 L 40 100 Q 120 70 200 85 T 380 35 L 380 130 Z" fill="url(#chartGradient)" />
            
            {/* Line Path */}
            <path d="M 40 100 Q 120 70 200 85 T 380 35" fill="none" stroke={accentColor} strokeWidth="3" />
            
            {/* Value Nodes */}
            <circle cx="40" cy="100" r="5" fill="#ffffff" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="120" cy="80" r="5" fill="#ffffff" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="200" cy="85" r="5" fill="#ffffff" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="290" cy="55" r="5" fill="#ffffff" stroke={accentColor} strokeWidth="2.5" />
            <circle cx="380" cy="35" r="5" fill="#ffffff" stroke={accentColor} strokeWidth="2.5" />
            
            {/* Labels */}
            <text x="40" y="145" fontSize="9" fill="#94a3b8" textAnchor="middle">Q1</text>
            <text x="120" y="145" fontSize="9" fill="#94a3b8" textAnchor="middle">Q2</text>
            <text x="200" y="145" fontSize="9" fill="#94a3b8" textAnchor="middle">Q3</text>
            <text x="290" y="145" fontSize="9" fill="#94a3b8" textAnchor="middle">Q4</text>
            <text x="380" y="145" fontSize="9" fill="#94a3b8" textAnchor="middle">Target</text>
            <text x="30" y="103" fontSize="9" fill="#64748b" textAnchor="end">60%</text>
            <text x="30" y="63" fontSize="9" fill="#64748b" textAnchor="end">85%</text>
            <text x="30" y="23" fontSize="9" fill="#64748b" textAnchor="end">100%</text>
          </svg>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: accentColor }}></div>
              <span>Active Organization Benchmark</span>
            </div>
          </div>
        </div>
      );
    }

    if (type === 'flow-chart') {
      return (
        <div className="chart-container">
          <div className="chart-title">System Execution Sequence / Work Flow</div>
          <svg className="chart-svg" viewBox="0 0 400 150">
            <defs>
              <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={accentColor} />
                <stop offset="100%" stopColor={accentColor} stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Step 1 */}
            <rect x="10" y="45" width="80" height="50" rx="6" fill="url(#flowGrad)" stroke={accentColor} strokeWidth="1" />
            <text x="50" y="70" fontSize="9" fill="#ffffff" textAnchor="middle" fontWeight="bold">Phase 1</text>
            <text x="50" y="82" fontSize="7" fill="#ffffff" textAnchor="middle">Initial Analysis</text>
            
            {/* Arrow 1 */}
            <path d="M 95 70 L 108 70" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            <polygon points="108,67 115,70 108,73" fill="#cbd5e1" />

            {/* Step 2 */}
            <rect x="120" y="45" width="80" height="50" rx="6" fill="#f8fafc" stroke={accentColor} strokeWidth="1.5" />
            <text x="160" y="70" fontSize="9" fill={accentColor} textAnchor="middle" fontWeight="bold">Phase 2</text>
            <text x="160" y="82" fontSize="7" fill="#475569" textAnchor="middle">Core Processing</text>

            {/* Arrow 2 */}
            <path d="M 205 70 L 218 70" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            <polygon points="218,67 225,70 218,73" fill="#cbd5e1" />

            {/* Step 3 */}
            <rect x="230" y="45" width="80" height="50" rx="6" fill="url(#flowGrad)" stroke={accentColor} strokeWidth="1" />
            <text x="270" y="70" fontSize="9" fill="#ffffff" textAnchor="middle" fontWeight="bold">Phase 3</text>
            <text x="270" y="82" fontSize="7" fill="#ffffff" textAnchor="middle">Synthesis</text>

            {/* Arrow 3 */}
            <path d="M 315 70 L 328 70" stroke="#cbd5e1" strokeWidth="2" fill="none" />
            <polygon points="328,67 335,70 328,73" fill="#cbd5e1" />

            {/* Step 4 */}
            <rect x="340" y="45" width="50" height="50" rx="6" fill="#0f172a" />
            <text x="365" y="70" fontSize="9" fill="#ffffff" textAnchor="middle" fontWeight="bold">Phase 4</text>
            <text x="365" y="82" fontSize="7" fill="#10b981" textAnchor="middle" fontWeight="bold">Final Output</text>
          </svg>
        </div>
      );
    }

    if (type === 'donut-chart') {
      return (
        <div className="chart-container">
          <div className="chart-title">Resource Distribution Breakdown</div>
          <svg className="chart-svg" viewBox="0 0 400 150">
            <circle cx="120" cy="75" r="40" fill="none" stroke="#e2e8f0" strokeWidth="18" />
            <circle cx="120" cy="75" r="40" fill="none" stroke={accentColor} strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="75.3" transform="rotate(-90 120 75)" />
            <circle cx="120" cy="75" r="40" fill="none" stroke="#10b981" strokeWidth="18" strokeDasharray="251.2" strokeDashoffset="200.9" transform="rotate(20 120 75)" />
            
            <text x="120" y="72" fontSize="10" fill="#0f172a" textAnchor="middle" fontWeight="bold">100%</text>
            <text x="120" y="83" fontSize="6" fill="#94a3b8" textAnchor="middle" fontWeight="bold">Allocated</text>
            
            <g transform="translate(220, 35)">
              <g className="legend-item">
                <rect x="0" y="5" width="8" height="8" rx="2" fill={accentColor} />
                <text x="15" y="12" fontSize="8.5" fill="#334155" fontWeight="bold">70% - Core Processes</text>
              </g>
              <g className="legend-item" transform="translate(0, 20)">
                <rect x="0" y="5" width="8" height="8" rx="2" fill="#10b981" />
                <text x="15" y="12" fontSize="8.5" fill="#334155" fontWeight="bold">20% - Automated Validation</text>
              </g>
              <g className="legend-item" transform="translate(0, 40)">
                <rect x="0" y="5" width="8" height="8" rx="2" fill="#cbd5e1" />
                <text x="15" y="12" fontSize="8.5" fill="#334155" fontWeight="bold">10% - System Latency</text>
              </g>
            </g>
          </svg>
        </div>
      );
    }
    
    // Fallback Bar Chart
    return (
      <div className="chart-container">
        <div className="chart-title">System Performance Overhead by Category</div>
        <svg className="chart-svg" viewBox="0 0 400 150">
          <line x1="40" y1="130" x2="380" y2="130" stroke="#cbd5e1" strokeWidth="1.5" />
          {/* Gridlines */}
          <line x1="40" y1="20" x2="380" y2="20" stroke="#e2e8f0" strokeDasharray="3" />
          <line x1="40" y1="75" x2="380" y2="75" stroke="#e2e8f0" strokeDasharray="3" />
          
          {/* Bars */}
          <rect x="70" y="50" width="36" height="80" rx="3" fill={accentColor} opacity="0.8" />
          <rect x="150" y="30" width="36" height="100" rx="3" fill={accentColor} />
          <rect x="230" y="80" width="36" height="50" rx="3" fill={accentColor} opacity="0.6" />
          <rect x="310" y="45" width="36" height="85" rx="3" fill={accentColor} opacity="0.9" />
 
          {/* Bar Values */}
          <text x="88" y="44" fontSize="9" fill="#64748b" textAnchor="middle" fontWeight="bold">62%</text>
          <text x="168" y="24" fontSize="9" fill="#64748b" textAnchor="middle" fontWeight="bold">80%</text>
          <text x="248" y="74" fontSize="9" fill="#64748b" textAnchor="middle" fontWeight="bold">38%</text>
          <text x="328" y="39" fontSize="9" fill="#64748b" textAnchor="middle" fontWeight="bold">68%</text>
 
          {/* X Axis Labels */}
          <text x="88" y="143" fontSize="9" fill="#94a3b8" textAnchor="middle">Automation</text>
          <text x="168" y="143" fontSize="9" fill="#94a3b8" textAnchor="middle">Precision</text>
          <text x="248" y="143" fontSize="9" fill="#94a3b8" textAnchor="middle">Latency</text>
          <text x="328" y="143" fontSize="9" fill="#94a3b8" textAnchor="middle">Retention</text>
        </svg>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* 1. Control Panel Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">DF</div>
          <h1>DocForge AI</h1>
        </div>

        <div className="sidebar-scrollable">
          <div className="section-title">Generation Settings</div>
          
          <div className="form-group">
            <label htmlFor="topic">Document Topic / Title</label>
            <input 
              id="topic"
              type="text" 
              className="input-text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Artificial Intelligence Ethics"
              disabled={isGenerating}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pageCount">Target Pages ({pageCount})</label>
            <div className="slider-container">
              <input 
                id="pageCount"
                type="range" 
                min="5" 
                max="50" 
                className="slider-input"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value))}
                disabled={isGenerating}
              />
              <span className="slider-value">{pageCount}</span>
            </div>
          </div>

          <div className="section-title">Design & Layout</div>

          <div className="form-group">
            <label htmlFor="template">Design Template</label>
            <select 
              id="template" 
              className="select-input" 
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option value="minimalist">Modern Minimalist</option>
              <option value="executive">Corporate Executive</option>
              <option value="academic">Academic Report</option>
              <option value="editorial">Elegant Editorial</option>
              <option value="tech">Tech Startup</option>
            </select>
          </div>

          <div className="form-group">
            <label>Accent Color Brand Palette</label>
            <div className="color-palette">
              {ACCENT_PRESETS.map((color) => (
                <div 
                  key={color.value}
                  className={`color-option ${accentColor === color.value ? 'active' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setAccentColor(color.value)}
                  title={color.name}
                ></div>
              ))}
            </div>
            <div className="custom-color-picker">
              <input 
                type="color" 
                className="color-input-element" 
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
              />
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Custom brand hex: {accentColor}</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fontFamily">Typography Scheme</label>
            <select 
              id="fontFamily" 
              className="select-input" 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Outfit">Outfit & Poppins (Modern Sans)</option>
              <option value="Poppins">Poppins Core (Corporate Clean)</option>
              <option value="Playfair">Playfair & Georgia (Elegant Serif)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="marginSize">Page Margins</label>
            <select 
              id="marginSize" 
              className="select-input" 
              value={marginSize}
              onChange={(e) => setMarginSize(e.target.value)}
            >
              <option value="40px">Narrow (40px)</option>
              <option value="60px">Normal (60px)</option>
              <option value="80px">Wide (80px)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="alignment">Text Alignment</label>
            <select 
              id="alignment" 
              className="select-input" 
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
            >
              <option value="left">Left Aligned</option>
              <option value="justify">Justified Block</option>
              <option value="center">Centered Editorial</option>
            </select>
          </div>

          <div className="section-title">Credentials & Power Tools</div>

          <div className="form-group">
            <label htmlFor="provider">LLM Provider</label>
            <select
              id="provider"
              className="select-input"
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value)}
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI</option>
              <option value="grok">Grok (xAI)</option>
              <option value="mock">Offline Demo Mode (No Key Needed)</option>
            </select>
          </div>

          {provider === 'gemini' && (
            <div className="form-group">
              <label htmlFor="geminiApiKey">Google Gemini API Key (Optional)</label>
              <input 
                id="geminiApiKey"
                type="password" 
                className="input-text" 
                value={geminiApiKey}
                onChange={(e) => handleGeminiKeyChange(e.target.value)}
                placeholder="Configure in .env or paste here..."
              />
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                Note: Key is saved securely only in local browser cache.
              </span>
            </div>
          )}

          {provider === 'openai' && (
            <div className="form-group">
              <label htmlFor="openaiApiKey">OpenAI API Key (Optional)</label>
              <input 
                id="openaiApiKey"
                type="password" 
                className="input-text" 
                value={openaiApiKey}
                onChange={(e) => handleOpenaiKeyChange(e.target.value)}
                placeholder="Configure in .env or paste here..."
              />
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                Note: Key is saved securely only in local browser cache.
              </span>
            </div>
          )}

          {provider === 'grok' && (
            <div className="form-group">
              <label htmlFor="grokApiKey">Grok (xAI) API Key (Optional)</label>
              <input 
                id="grokApiKey"
                type="password" 
                className="input-text" 
                value={grokApiKey}
                onChange={(e) => handleGrokKeyChange(e.target.value)}
                placeholder="Configure in .env or paste here..."
              />
              <span style={{ fontSize: '10px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                Note: Key is saved securely only in local browser cache.
              </span>
            </div>
          )}

          {provider === 'mock' && (
            <div className="form-group">
              <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', display: 'block', padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)', lineHeight: '1.4' }}>
                ✓ Offline Demo Mode: No API keys required. All document pages are simulated locally.
              </span>
            </div>
          )}

          {provider !== 'mock' && (
            <div className="form-group">
              <label htmlFor="modelName">{provider === 'gemini' ? 'Gemini' : (provider === 'openai' ? 'OpenAI' : 'Grok')} LLM Engine</label>
              <select 
                id="modelName" 
                className="select-input" 
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              >
                {provider === 'gemini' ? (
                  <>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Super Fast)</option>
                    <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Logic)</option>
                  </>
                ) : provider === 'openai' ? (
                  <>
                    <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cost-Efficient)</option>
                    <option value="gpt-4o">GPT-4o (High Intelligence)</option>
                  </>
                ) : (
                  <>
                    <option value="grok-2">Grok 2 (High Performance)</option>
                    <option value="grok-beta">Grok Beta (Experimental)</option>
                  </>
                )}
              </select>
            </div>
          )}


          <div className="switch-container">
            <span style={{ fontSize: '13px', fontWeight: '500' }}>Enable Canvas Inline Editing</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={editMode}
                onChange={(e) => setEditMode(e.target.checked)}
              />
              <span className="slider-switch"></span>
            </label>
          </div>

          {errorMessage && (
            <div style={{ 
              marginTop: '15px', 
              padding: '10px', 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#fca5a5'
            }}>
              🚨 {errorMessage}
            </div>
          )}

        </div>

        <div className="sidebar-actions">
          <button 
            type="button" 
            className="btn-primary"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Forging Content...' : 'Generate AI Document'}
          </button>
          
          <div className="export-row">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleExportPDF}
              disabled={isGenerating || pages.length === 0}
            >
              Export PDF
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={handleExportHTML}
              disabled={isGenerating || pages.length === 0}
            >
              Export HTML
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Right-side Canvas Area */}
      <main className="canvas-area">
        {isGenerating ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>Forging Your Document Architecture</h2>
            <p style={{ fontSize: '13px', color: 'var(--ui-text-muted)' }}>
              Synthesizing detailed context, compiling structures, and calculating layout frameworks via Gemini AI...
            </p>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${generationProgress}%` }}></div>
            </div>
          </div>
        ) : (
          <div className="canvas-wrapper">
            <div id="document-canvas" className={`template-${template}`}>
              {pages.map((page, pageIdx) => {
                const globalPageNum = pageIdx + 1;

                // PAGE 1: TITLE/COVER PAGE
                if (page.type === 'cover') {
                  return (
                    <section key={pageIdx} className="page page-cover">
                      <div className="cover-header-brand" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'classification', e.target.innerText)}>{page.classification || 'INTERNAL DRAFT'}</div>
                      
                      <div className="cover-main-content">
                        <div className="cover-divider"></div>
                        <h1 
                          className="cover-title" 
                          contentEditable={editMode} 
                          suppressContentEditableWarning
                          onBlur={(e) => updateContent(pageIdx, 'title', e.target.innerText)}
                        >
                          {page.title}
                        </h1>
                        <p 
                          className="cover-subtitle"
                          contentEditable={editMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateContent(pageIdx, 'subtitle', e.target.innerText)}
                        >
                          {page.subtitle}
                        </p>
                        
                        {/* Cover Image Illustration */}
                        <div className="cover-graphic-container">
                          <img 
                            src={getCoverPhoto()} 
                            alt="Cover theme graphic" 
                            className="cover-graphic-img" 
                          />
                        </div>
                      </div>

                      <div className="cover-meta">
                        <div className="meta-item">
                          <span className="meta-label">Author/Publisher</span>
                          <span className="meta-value" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'author', e.target.innerText)}>{page.author || 'DocForge Synthesis'}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Publish Date</span>
                          <span className="meta-value" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'dateStr', e.target.innerText)}>{page.dateStr}</span>
                        </div>
                        <div className="meta-item" style={{ marginTop: '10px' }}>
                          <span className="meta-label">Release Version</span>
                          <span className="meta-value" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'version', e.target.innerText)}>{page.version || 'v1.0.0'}</span>
                        </div>
                      </div>
                    </section>
                  );
                }

                // PAGE 2: TABLE OF CONTENTS PAGE
                if (page.type === 'toc') {
                  const tocItems = getTOCItems();
                  return (
                    <section key={pageIdx} className="page">
                      <div className="page-header">
                        <span>{topic}</span>
                        <span>Table of Contents</span>
                      </div>
                      
                      <div className="page-content" style={{ marginTop: '40px' }}>
                        <h2 className="page-toc-title" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'title', e.target.innerText)}>{page.title}</h2>
                        
                        <ul className="toc-list">
                          {tocItems.map((item, itemIdx) => (
                            <li key={itemIdx} className="toc-item">
                              <span className="toc-item-title">{item.title}</span>
                              <span className="toc-item-page">{item.pageIndex}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="page-footer">
                        <span>DocForge AI Architect</span>
                        <span>Page {globalPageNum}</span>
                      </div>
                    </section>
                  );
                }

                // PAGE 3: PREFACE PAGE
                if (page.type === 'preface') {
                  return (
                    <section key={pageIdx} className="page">
                      <div className="page-header">
                        <span>{topic}</span>
                        <span>Preface & Scope</span>
                      </div>

                      <div className="page-content" style={{ marginTop: '40px' }}>
                        <div className="chapter-header-badge">Executive Prologue</div>
                        <h2 className="page-chapter-title" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'title', e.target.innerText)}>{page.title}</h2>
                        
                        {page.paragraphs && page.paragraphs.map((para, paraIdx) => (
                          <p 
                            key={paraIdx} 
                            className={`page-paragraph ${paraIdx === 0 ? 'drop-cap' : ''}`}
                            contentEditable={editMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateContent(pageIdx, 'paragraphs', e.target.innerText, paraIdx)}
                          >
                            {para}
                          </p>
                        ))}
                      </div>

                      <div className="page-footer">
                        <span>DocForge AI Architect</span>
                        <span>Page {globalPageNum}</span>
                      </div>
                    </section>
                  );
                }

                // CHAPTER PAGES (Standard dynamic layouts)
                if (page.type === 'chapter-page') {
                  return (
                    <section key={pageIdx} className="page">
                      <div className="page-header">
                        <span>{topic}</span>
                        <span>{page.chapterTitle}</span>
                      </div>

                      <div className="page-content" style={{ marginTop: '45px' }}>
                        <div className="chapter-header-badge">Chapter {page.chapterIndex || 1}</div>
                        <h2 
                          className="page-chapter-title"
                          contentEditable={editMode}
                          suppressContentEditableWarning
                          onBlur={(e) => updateContent(pageIdx, 'chapterTitle', e.target.innerText)}
                        >
                          {page.chapterTitle}
                        </h2>

                        {page.paragraphs && page.paragraphs.map((para, paraIdx) => (
                          <p 
                            key={paraIdx} 
                            className="page-paragraph"
                            contentEditable={editMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateContent(pageIdx, 'paragraphs', e.target.innerText, paraIdx)}
                          >
                            {para}
                          </p>
                        ))}

                        {/* Callout Box Feature */}
                        {page.hasCallout && page.calloutText && (
                          <div 
                            className="callout-box"
                            contentEditable={editMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateContent(pageIdx, 'calloutText', e.target.innerText)}
                          >
                            {page.calloutText}
                          </div>
                        )}

                        {/* Custom Lists Feature */}
                        {page.hasList && page.listItems && (
                          <ul className="custom-list">
                            {page.listItems.map((item, itemIdx) => (
                              <li 
                                key={itemIdx} 
                                className="custom-list-item"
                                contentEditable={editMode}
                                suppressContentEditableWarning
                                onBlur={(e) => updateContent(pageIdx, 'listItems', e.target.innerText, itemIdx, true)}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Custom Tables Feature */}
                        {page.hasTable && page.tableRows && (
                          <table className="custom-table">
                            <thead>
                              <tr>
                                <th>Analysis Metric</th>
                                <th>Baseline</th>
                                <th>Target Goal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {page.tableRows.map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                  <td contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'tableRows', e.target.innerText, null, false, true, rowIdx, 'metric')}>{row.metric}</td>
                                  <td contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'tableRows', e.target.innerText, null, false, true, rowIdx, 'baseline')}>{row.baseline}</td>
                                  <td contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'tableRows', e.target.innerText, null, false, true, rowIdx, 'target')}>{row.target}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}

                        {/* Vector SVG Charts Feature */}
                        {page.hasChart && page.chartType && renderSVGChart(page.chartType)}

                        {/* Custom Images Feature */}
                        {page.hasPhoto && (
                          <div className="document-photo-container">
                            <img 
                              src={page.photoUrl || getPhotoUrl(page.photoQuery || topic)} 
                              alt={page.photoCaption || "Section illustration"} 
                              className="document-photo" 
                            />
                            {page.photoCaption && (
                              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', textAlign: 'center', fontStyle: 'italic', fontFamily: 'var(--doc-font-body)' }}>
                                {page.photoCaption}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="page-footer">
                        <span>DocForge AI Architect</span>
                        <span>Page {globalPageNum}</span>
                      </div>
                    </section>
                  );
                }

                // CONCLUSION PAGE
                if (page.type === 'conclusion') {
                  return (
                    <section key={pageIdx} className="page">
                      <div className="page-header">
                        <span>{topic}</span>
                        <span>Strategic Summary</span>
                      </div>

                      <div className="page-content" style={{ marginTop: '40px' }}>
                        <div className="chapter-header-badge">Strategic Synthesis</div>
                        <h2 className="page-chapter-title" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'title', e.target.innerText)}>{page.title}</h2>
                        
                        {page.paragraphs && page.paragraphs.map((para, paraIdx) => (
                          <p 
                            key={paraIdx} 
                            className="page-paragraph"
                            contentEditable={editMode}
                            suppressContentEditableWarning
                            onBlur={(e) => updateContent(pageIdx, 'paragraphs', e.target.innerText, paraIdx)}
                          >
                            {para}
                          </p>
                        ))}
                      </div>

                      <div className="page-footer">
                        <span>DocForge AI Architect</span>
                        <span>Page {globalPageNum}</span>
                      </div>
                    </section>
                  );
                }

                // REFERENCES & BIBLIOGRAPHY PAGE
                if (page.type === 'references') {
                  return (
                    <section key={pageIdx} className="page">
                      <div className="page-header">
                        <span>{topic}</span>
                        <span>References</span>
                      </div>

                      <div className="page-content" style={{ marginTop: '40px' }}>
                        <div className="chapter-header-badge">Bibliography & citations</div>
                        <h2 className="page-chapter-title" contentEditable={editMode} suppressContentEditableWarning onBlur={(e) => updateContent(pageIdx, 'title', e.target.innerText)}>{page.title}</h2>
                        
                        <div style={{ marginTop: '20px' }}>
                          {page.references && page.references.map((ref, refIdx) => (
                            <div 
                              key={refIdx} 
                              className="reference-item"
                              contentEditable={editMode}
                              suppressContentEditableWarning
                              onBlur={(e) => updateContent(pageIdx, 'references', e.target.innerText, refIdx)}
                            >
                              {ref}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="page-footer">
                        <span>DocForge AI Architect</span>
                        <span>Page {globalPageNum}</span>
                      </div>
                    </section>
                  );
                }

                return null;
              })}
            </div>
          </div>
        )}

        {/* Floating Zoom Controls for high-fidelity canvas scale */}
        <div className="zoom-controls">
          <button 
            type="button" 
            className="zoom-btn"
            onClick={() => setZoom(prev => Math.max(0.4, Number((prev - 0.1).toFixed(1))))}
            title="Zoom Out"
          >
            －
          </button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button 
            type="button" 
            className="zoom-btn"
            onClick={() => setZoom(prev => Math.min(1.5, Number((prev + 0.1).toFixed(1))))}
            title="Zoom In"
          >
            ＋
          </button>
        </div>
      </main>
    </div>
  );
}
