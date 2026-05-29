import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environmental variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Middlewares
app.use(cors());
app.use(express.json());

// API route to generate document pages using Google Gemini API
app.post('/api/generate', async (req, res) => {
  const { topic, pageCount, modelName, customApiKey, provider } = req.body;

  if (!topic || !pageCount) {
    return res.status(400).json({ error: 'Topic and page count are required.' });
  }

  // Determine LLM provider and appropriate key
  const isOpenAI = provider === 'openai';
  const isGrok = provider === 'grok';
  const apiKey = customApiKey || (isGrok ? process.env.GROK_API_KEY : isOpenAI ? process.env.OPENAI_API_KEY : process.env.GEMINI_API_KEY);

  const keyLog = apiKey ? `${apiKey.substring(0, 6)}...${apiKey.slice(-4)}` : 'None';
  const sourceLog = customApiKey ? 'Client Custom Key' : 'Server Env Key';
  const logMessage = `[${new Date().toISOString()}] Provider: ${provider || 'Gemini'}, Topic: "${topic}", Pages: ${pageCount}, Model: ${modelName || 'default'}, Key Source: ${sourceLog} (${keyLog})\n`;

  try {
    import('fs').then(fs => fs.appendFileSync('server.log', logMessage));
  } catch (e) {
    console.error('Failed to write log to file:', e);
  }
  console.log(logMessage.trim());

  if (!apiKey) {
    let errorMsg = 'Gemini API Key missing. Please provide a Gemini key in the settings panel or configure a server-side GEMINI_API_KEY env variable.';
    if (isOpenAI) {
      errorMsg = 'OpenAI API Key missing. Please provide an OpenAI key in the settings panel or configure an OPENAI_API_KEY env variable.';
    } else if (isGrok) {
      errorMsg = 'Grok API Key missing. Please provide a Grok key in the settings panel or configure a GROK_API_KEY env variable.';
    }
    return res.status(400).json({ error: errorMsg });
  }

  const model = modelName || (isGrok ? 'grok-2' : isOpenAI ? 'gpt-4o-mini' : 'gemini-2.5-flash');

  const prompt = `
You are an expert technical writer and visual communications strategist.
Generate a highly detailed, professional, publication-ready document about "${topic}".

━━━ OUTPUT CONTRACT ━━━
Return ONLY a valid JSON object. No markdown, no explanation, no wrapping text.
The root object has exactly one key: "pages"
"pages" is an array of EXACTLY ${pageCount} objects, in document order.
Every string field must contain fully realized, non-placeholder prose.

━━━ IMAGE STRATEGY (READ FIRST) ━━━
Images are a first-class content element — not decorations.
The document must contain images on AT LEAST 60% of all pages.
Images appear in four distinct roles across the document:

  ROLE 1 — Hero Image (mandatory on cover):
    One large, cinematic image that establishes the document's visual identity.

  ROLE 2 — Section Opener Image (mandatory on first page of EVERY chapter):
    One wide, thematic image that sets the visual tone for that chapter's subject matter.

  ROLE 3 — Inline Contextual Image (optional on any chapter-page):
    A focused image that directly illustrates a specific claim or concept on that page.

  ROLE 4 — Supporting Pair (optional — two small side-by-side images):
    Two narrow images that contrast or compare two aspects being discussed.

For every image, always include these three sub-fields:
  "photoQuery"  : 4–7 descriptive, specific keywords for stock photo search
                  (e.g. "autonomous vehicle lidar sensor urban street rain")
  "photoCaption": A substantive 20–35 word caption tying the image to the argument
  "photoAlt"    : A concise alt-text string (10–15 words) for accessibility

━━━ GLOBAL QUALITY STANDARDS ━━━
- All paragraphs: minimum 100 words, analytically rigorous, domain-accurate.
- No filler phrases: "In conclusion," "It is worth noting," "As mentioned above."
- Formal third-person academic register. Active voice preferred.
- All data, citations, statistics, and named frameworks must be plausible and internally consistent.
- Every visual element (image, chart, table) must reinforce the prose — not be decorative.
- Images distributed across the document — never cluster more than 3 image-bearing pages in a row,
  and never have more than 2 consecutive pages with no image at all.

━━━ PAGE SPECIFICATIONS ━━━

──────────────────────────────────────────────
PAGE 1 — Cover (type: "cover")
──────────────────────────────────────────────
{
  "type": "cover",
  "title": "${topic}",
  "subtitle": "A Comprehensive Strategic Analysis and Operational Framework",
  "authors": "Research & Intelligence Division",
  "dateStr": "${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}",
  "abstract": "Single sentence (25–40 words) distilling the document's core thesis.",

  // ROLE 1 — Hero image (REQUIRED)
  "heroImage": {
    "photoQuery": "...",    // Wide, cinematic, high-concept image representing ${topic}
    "photoCaption": "...",
    "photoAlt": "..."
  }
}

──────────────────────────────────────────────
PAGE 2 — Table of Contents (type: "toc")
──────────────────────────────────────────────
{
  "type": "toc",
  "title": "Table of Contents",
  "entries": [
    { "label": "Preface & Scope",              "page": 3 },
    // One entry per chapter with accurate page numbers
    { "label": "Summary & Strategic Conclusion", "page": ${pageCount - 1} },
    { "label": "References & Bibliography",     "page": ${pageCount} }
  ],

  // Optional: one thematic image to break whitespace on TOC page
  "tocImage": {
    "photoQuery": "...",   // Abstract or conceptual image related to ${topic}
    "photoCaption": "...",
    "photoAlt": "..."
  }
}

──────────────────────────────────────────────
PAGE 3 — Preface / Executive Summary (type: "preface")
──────────────────────────────────────────────
{
  "type": "preface",
  "title": "Preface & Scope",
  "paragraphs": [
    "Paragraph 1 (≥100 words): Context, motivation, and urgency of the topic.",
    "Paragraph 2 (≥100 words): Methodological scope, analytical lens, document structure."
  ],
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],

  // Preface image (REQUIRED on this page)
  "prefaceImage": {
    "photoQuery": "...",   // Image representing the research domain or analytical process
    "photoCaption": "...",
    "photoAlt": "..."
  }
}

──────────────────────────────────────────────
PAGES 4 through ${pageCount - 2} — Chapter Pages (type: "chapter-page")
──────────────────────────────────────────────
Distribute into 3–5 thematically distinct chapters, each spanning multiple sequential pages.

Every chapter-page MUST include:
{
  "type": "chapter-page",
  "chapterTitle":  "Chapter N: [Descriptive Title Specific to ${topic}]",
  "chapterIndex":  <integer>,   // 1-based
  "pageIndex":     <integer>,   // 1-based within this chapter
  "sectionHeading": "...",      // Sub-heading for this page's specific focus
  "paragraphs":    ["...", "...", "..."]  // 2–3 paragraphs, each ≥100 words
}

── IMAGE RULES FOR CHAPTER PAGES ──────────────────

  A) FIRST page of every chapter: include "chapterOpenerImage" (REQUIRED):
     "chapterOpenerImage": {
       "photoQuery":   "...",   // Wide thematic image for this chapter's subject
       "photoCaption": "...",
       "photoAlt":     "..."
     }

  B) On approximately every OTHER interior chapter page: include ONE of:

     SINGLE INLINE IMAGE (most common):
     "inlineImage": {
       "photoQuery":   "...",   // Focused, specific to this page's argument
       "photoCaption": "...",
       "photoAlt":     "...",
       "position":     "left" | "right" | "full-width"
         // left/right = text wraps beside it; full-width = image spans the column
     }

     SUPPORTING IMAGE PAIR (use when contrasting two things):
     "imagePair": {
       "imageA": { "photoQuery": "...", "photoCaption": "...", "photoAlt": "..." },
       "imageB": { "photoQuery": "...", "photoCaption": "...", "photoAlt": "..." },
       "pairCaption": "One sentence explaining what the juxtaposition illustrates."
     }

  C) Pages that already have a chapterOpenerImage may ALSO have one inlineImage
     lower on the page if the content warrants it.

── ADDITIONAL VISUAL ELEMENTS (one per chapter-page, alongside images) ──

  ALSO include EXACTLY ONE of the following per chapter-page.
  Spread types evenly — no type on more than 30% of chapter pages.

  TYPE A — Callout Quote:
  "hasCallout": true,
  "calloutText": "Precise, insightful statement (15–25 words) from this page's content."

  TYPE B — Structured List:
  "hasList": true,
  "listTitle": "Key Considerations / Steps / Principles",
  "listItems": [
    "Item 1: Full sentence with specific detail.",
    "Item 2: ...", "Item 3: ...", "Item 4: ..."
  ]

  TYPE C — Comparison Table:
  "hasTable": true,
  "tableCaption": "Descriptive caption explaining what this table shows.",
  "tableHeaders": ["Dimension", "Current State", "Target State", "Gap Analysis"],
  "tableRows": [
    { "dimension": "...", "current": "...", "target": "...", "gap": "..." },
    { "dimension": "...", "current": "...", "target": "...", "gap": "..." },
    { "dimension": "...", "current": "...", "target": "...", "gap": "..." }
  ]

  TYPE D — Data Visualization:
  "hasChart": true,
  "chartType":    "<line-chart | bar-chart | donut-chart | flow-chart | radar-chart>",
  "chartTitle":   "Chart title directly relevant to this page.",
  "chartCaption": "1–2 sentences interpreting what this chart reveals.",
  "chartData": {
    "labels": [...],  // For bar/line/donut/radar: realistic labels
    "values": [...]   // Corresponding numeric values
    // For flow-chart: "nodes": [...], "edges": [[...],[...]]
  }

──────────────────────────────────────────────
PAGE ${pageCount - 1} — Conclusion (type: "conclusion")
──────────────────────────────────────────────
{
  "type": "conclusion",
  "title": "Summary & Strategic Conclusion",
  "paragraphs": [
    "Paragraph 1 (≥120 words): Synthesize core findings without restating chapter titles.",
    "Paragraph 2 (≥120 words): Forward-looking, concrete, prioritized recommendations."
  ],
  "strategicPriorities": [
    { "priority": "Short-term (0–12 months)", "action": "..." },
    { "priority": "Medium-term (1–3 years)",  "action": "..." },
    { "priority": "Long-term (3–5 years)",    "action": "..." }
  ],

  // Conclusion image (REQUIRED)
  "conclusionImage": {
    "photoQuery":   "...",  // Forward-looking, optimistic image — outcome, horizon, growth
    "photoCaption": "...",
    "photoAlt":     "..."
  }
}

──────────────────────────────────────────────
PAGE ${pageCount} — References (type: "references")
──────────────────────────────────────────────
{
  "type": "references",
  "title": "References & Bibliography",
  "references": [
    // 6 plausible citations in APA 7th edition
    // Mix: journal articles, books, authoritative industry/government reports
    // All relevant to ${topic}, internally consistent (year/author/publisher)
    "Author, A. B., & Author, C. D. (Year). Title of article. Journal Name, Volume(Issue), pp–pp. https://doi.org/xxxxx",
    ...
  ]
  // No image on references page
}

━━━ FINAL VALIDATION CHECKLIST ━━━
Apply before returning output:

□ "pages" array has EXACTLY ${pageCount} elements
□ Page type order: cover → toc → preface → [chapter-pages] → conclusion → references
□ cover has "heroImage"
□ preface has "prefaceImage"
□ Every chapter's FIRST page has "chapterOpenerImage"
□ conclusion has "conclusionImage"
□ At least 60% of all pages contain at least one image field
□ No more than 2 consecutive pages are completely image-free
□ Every image object has all three sub-fields: photoQuery, photoCaption, photoAlt
□ photoQuery strings are specific (4–7 keywords), never generic ("people working")
□ Each chapter-page has EXACTLY ONE visual element (hasCallout/hasList/hasTable/hasChart)
□ chartData populated with realistic values whenever hasChart is true
□ TOC entries match actual page positions in the array
□ No placeholder text remains (no "[INSERT...]", "TBD", "Lorem ipsum", etc.)
□ JSON is syntactically valid (no trailing commas, all strings properly escaped)
`;

  try {
    let cleanText = '';

    if (isOpenAI || isGrok) {
      const url = isGrok ? 'https://api.x.ai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        const errLog = `[${new Date().toISOString()}] ERROR: ${isGrok ? 'Grok' : 'OpenAI'} API returned ${response.status} ${response.statusText}. Details: ${errText}\n`;
        try {
          import('fs').then(fs => fs.appendFileSync('server.log', errLog));
        } catch (e) { }
        console.error(errLog.trim());
        return res.status(response.status).json({
          error: `${isGrok ? 'Grok' : 'OpenAI'} API returned an error: ${response.statusText}`,
          details: errText
        });
      }

      const result = await response.json();
      cleanText = result.choices[0].message.content;
    } else {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        const errLog = `[${new Date().toISOString()}] ERROR: Gemini API returned ${response.status} ${response.statusText}. Details: ${errText}\n`;
        try {
          import('fs').then(fs => fs.appendFileSync('server.log', errLog));
        } catch (e) { }
        console.error(errLog.trim());
        return res.status(response.status).json({
          error: `Gemini API returned an error: ${response.statusText}`,
          details: errText
        });
      }

      const result = await response.json();
      cleanText = result.candidates[0].content.parts[0].text;
    }

    if (cleanText.includes('```json')) {
      cleanText = cleanText.split('```json')[1].split('```')[0];
    } else if (cleanText.includes('```')) {
      cleanText = cleanText.split('```')[1].split('```')[0];
    }
    cleanText = cleanText.trim();

    const parsedData = JSON.parse(cleanText);

    if (!parsedData.pages || !Array.isArray(parsedData.pages)) {
      throw new Error(`Invalid JSON format structure from ${isOpenAI ? 'OpenAI' : 'Gemini'} API`);
    }

    res.json({ pages: parsedData.pages });

  } catch (err) {
    console.error(`Server error calling ${isOpenAI ? 'OpenAI' : 'Gemini'}:`, err);
    res.status(500).json({
      error: `Failed to generate document content using ${isOpenAI ? 'OpenAI' : 'Gemini'} AI.`,
      details: err.message
    });
  }
});

// Serve built React static assets in production
app.use(express.static(path.join(__dirname, 'dist')));

// Send all other requests to built index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 DocForge Express server running on http://localhost:${PORT}`);
});
