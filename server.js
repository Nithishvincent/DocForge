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
  const { topic, pageCount, modelName, customApiKey } = req.body;

  if (!topic || !pageCount) {
    return res.status(400).json({ error: 'Topic and page count are required.' });
  }

  // Use custom API Key if provided, fallback to server environment key
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({ 
      error: 'API Key missing. Please provide a key in the settings panel or configure a server-side GEMINI_API_KEY env variable.' 
    });
  }

  const model = modelName || 'gemini-2.5-flash';

  const prompt = `
Generate a highly detailed, professional document about "${topic}".
The document must have exactly ${pageCount} pages.
You must return a JSON object with a single key "pages" containing an array of exactly ${pageCount} page objects.
Each page object corresponds to a single page in the final document, in chronological order:

1. Page 1: Cover/Title page (type: "cover"). Fields:
   - "title": "${topic}"
   - "subtitle": "A Comprehensive Strategic Study and Operational Framework"
   - "dateStr": "${new Date().toLocaleDateString()}"

2. Page 2: Table of Contents (type: "toc"). Fields:
   - "title": "Table of Contents"

3. Page 3: Preface / Executive Summary (type: "preface"). Fields:
   - "title": "Preface & Scope"
   - "paragraphs": An array of 2 detailed, professional paragraphs (each at least 80 words) describing the purpose and boundaries of this research on "${topic}".

4. Page 4 to Page ${pageCount - 2}: Chapter pages (type: "chapter-page").
   You must distribute these pages into distinct, logical chapters (e.g. Chapter 1, Chapter 2, Chapter 3).
   Each chapter-page object MUST have:
   - "chapterTitle": The title of the chapter (e.g. "Chapter 1: Technological Landscape of ${topic}")
   - "chapterIndex": The chapter number integer
   - "pageIndex": The page number within this chapter integer
   - "paragraphs": An array of 2-3 extremely long, detailed, and highly accurate paragraphs discussing specific dimensions of the topic on this page.
   Additionally, mix visual element configurations across these chapter pages (e.g., have some pages with lists, some with tables, some with charts):
   - Page A can have: "hasCallout": true, "calloutText": "A strategic quote about ${topic}."
   - Page B can have: "hasList": true, "listItems": ["Detailed guideline 1", "Detailed guideline 2", "Detailed guideline 3", "Detailed guideline 4"]
   - Page C can have: "hasTable": true, "tableRows": [
        {"metric": "Parameter Analysis", "baseline": "Standard baseline data", "target": "Strategic target metric"},
        {"metric": "Operational Cost", "baseline": "Initial overhead calculations", "target": "Optimized performance"},
        {"metric": "Compliance Rate", "baseline": "Current local regulations", "target": "100% audit alignment"}
     ]
   - Page D can have: "hasChart": true, "chartType": "line-chart" (or "bar-chart" or "flow-chart")

5. Page ${pageCount - 1}: Summary & Strategic Conclusion (type: "conclusion"). Fields:
   - "title": "Summary & Strategic Conclusion"
   - "paragraphs": An array of 2 long, concluding paragraphs summarizing findings and outlining strategic next steps.

6. Page ${pageCount}: References & Bibliography (type: "references"). Fields:
   - "title": "References & Bibliography"
   - "references": An array of 4 realistic academic citations (APA format) relevant to "${topic}".

Ensure the text generated is highly realistic, detailed, accurate, and completely avoids placeholders. Ensure the JSON is well-formed.
`;

  try {
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
      return res.status(response.status).json({ 
        error: `Gemini API returned an error: ${response.statusText}`, 
        details: errText 
      });
    }

    const result = await response.json();
    const responseText = result.candidates[0].content.parts[0].text;

    let cleanText = responseText;
    if (cleanText.includes('```json')) {
      cleanText = cleanText.split('```json')[1].split('```')[0];
    } else if (cleanText.includes('```')) {
      cleanText = cleanText.split('```')[1].split('```')[0];
    }
    cleanText = cleanText.trim();

    const parsedData = JSON.parse(cleanText);

    if (!parsedData.pages || !Array.isArray(parsedData.pages)) {
      throw new Error('Invalid JSON format structure from Gemini API');
    }

    res.json({ pages: parsedData.pages });

  } catch (err) {
    console.error('Server error calling Gemini:', err);
    res.status(500).json({ 
      error: 'Failed to generate document content using Gemini AI.', 
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
