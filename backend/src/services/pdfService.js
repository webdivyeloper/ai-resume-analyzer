const fs = require('fs');
const pdfModule = require('pdf-parse');

/**
 * Extracts text and splits into common sections
 */
const extractTextAndSections = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    let fullText = '';
    let numPages = 1;

    // Check if pdfModule has PDFParse class (v2+) or is a function (v1)
    if (pdfModule.PDFParse) {
      const parser = new pdfModule.PDFParse({ data: dataBuffer });
      try {
        const textResult = await parser.getText();
        if (typeof textResult === 'string') {
          fullText = textResult;
        } else if (textResult && textResult.text) {
          fullText = textResult.text;
        } else if (textResult && Array.isArray(textResult.pages)) {
          fullText = textResult.pages.map((p) => p.text).join('\n');
        }
        numPages = textResult.total || (textResult.pages ? textResult.pages.length : 1);
      } finally {
        if (typeof parser.destroy === 'function') {
          await parser.destroy();
        }
      }
    } else if (typeof pdfModule === 'function') {
      const pdfData = await pdfModule(dataBuffer);
      fullText = pdfData.text || '';
      numPages = pdfData.numpages || 1;
    } else {
      // Fallback: convert buffer to string or raw extraction
      fullText = dataBuffer.toString('utf8');
    }

    // Clean up extracted text
    fullText = fullText.replace(/\r\n/g, '\n').replace(/\u0000/g, '').trim();

    // If PDF text is still empty (e.g. scanned or empty), provide a clear note
    if (!fullText) {
      fullText = 'Resume content uploaded. (No direct text stream detected)';
    }

    const sections = parseSections(fullText);

    return {
      extractedText: fullText,
      text: fullText,
      numPages: numPages || 1,
      sections,
    };
  } catch (error) {
    console.error('Error in PDF parsing:', error.message);
    throw new Error('Failed to parse PDF resume: ' + error.message);
  }
};

/**
 * Heuristic section splitter based on common resume section headers
 */
const parseSections = (text) => {
  const sections = {
    summary: '',
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
  };

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  const sectionKeywords = [
    { key: 'summary', patterns: [/^(professional\s+)?summary/i, /^profile/i, /^objective/i, /^about\s+me/i] },
    { key: 'skills', patterns: [/^(technical\s+)?skills/i, /^technologies/i, /^core\s+competencies/i, /^skill\s+set/i, /^tools/i] },
    { key: 'experience', patterns: [/^(work\s+)?experience/i, /^employment(\s+history)?/i, /^internship(s)?/i, /^work\s+history/i] },
    { key: 'education', patterns: [/^education/i, /^academic\s+background/i, /^qualifications/i, /^degrees/i] },
    { key: 'projects', patterns: [/^(academic\s+)?projects/i, /^personal\s+projects/i, /^key\s+projects/i] },
    { key: 'certifications', patterns: [/^(licenses\s+and\s+)?certifications/i, /^certificates/i, /^courses/i, /^achievements/i] },
  ];

  let currentKey = null;
  const sectionContent = {
    summary: [],
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
  };

  for (const line of lines) {
    let matchedHeader = null;
    if (line.length < 40) {
      for (const sk of sectionKeywords) {
        if (sk.patterns.some((pat) => pat.test(line))) {
          matchedHeader = sk.key;
          break;
        }
      }
    }

    if (matchedHeader) {
      currentKey = matchedHeader;
    } else if (currentKey) {
      sectionContent[currentKey].push(line);
    }
  }

  sections.summary = sectionContent.summary.join(' ');
  sections.skills = extractListItems(sectionContent.skills);
  sections.experience = sectionContent.experience;
  sections.education = sectionContent.education;
  sections.projects = sectionContent.projects;
  sections.certifications = sectionContent.certifications;

  return sections;
};

const extractListItems = (lines) => {
  const items = [];
  for (const line of lines) {
    const splitItems = line.split(/[,|•\-\*;\/]+/).map((s) => s.trim()).filter((s) => s.length > 1);
    if (splitItems.length > 0) {
      items.push(...splitItems);
    } else if (line.length > 2) {
      items.push(line);
    }
  }
  return [...new Set(items)];
};

module.exports = {
  extractTextAndSections,
  parseSections,
};
