// Common tech and professional keywords taxonomy
const KNOWN_KEYWORDS = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'golang', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'r', 'scala', 'dart', 'html', 'html5', 'css', 'css3',
  // Frameworks & Libraries
  'react', 'react.js', 'reactjs', 'node.js', 'nodejs', 'express', 'express.js', 'next.js', 'vue', 'vue.js', 'angular', 'django', 'flask', 'fastapi', 'spring boot', 'spring', 'laravel', 'asp.net', '.net core', 'tailwind', 'bootstrap', 'jquery', 'redux', 'graphql',
  // Databases & Stores
  'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'elasticsearch', 'dynamodb', 'firebase', 'supabase', 'oracle',
  // Cloud & DevOps
  'aws', 'amazon web services', 'azure', 'google cloud', 'gcp', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'jenkins', 'github actions', 'terraform', 'ansible', 'linux', 'nginx', 'apache', 'git', 'github', 'gitlab',
  // Core Concepts & Architectures
  'data structures', 'algorithms', 'object-oriented programming', 'oop', 'rest api', 'restful apis', 'microservices', 'mvc', 'system design', 'agile', 'scrum', 'kanban', 'unit testing', 'test-driven development', 'tdd', 'jest', 'cypress', 'selenium',
  // AI / ML / Data
  'machine learning', 'deep learning', 'artificial intelligence', 'nlp', 'natural language processing', 'computer vision', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'data analysis', 'power bi', 'tableau',
  // Soft & Leadership Skills
  'problem solving', 'communication', 'team leadership', 'collaboration', 'critical thinking', 'project management', 'cross-functional', 'mentoring',
];

// Action verbs common in strong resumes
const ACTION_VERBS = [
  'developed', 'engineered', 'built', 'created', 'designed', 'implemented', 'optimized',
  'led', 'spearheaded', 'managed', 'deployed', 'orchestrated', 'streamlined', 'reduced',
  'increased', 'improved', 'automated', 'integrated', 'architected', 'resolved', 'analyzed'
];

const checkWordPresence = (text, keyword) => {
  const normText = text.toLowerCase();
  const kw = keyword.toLowerCase().trim();

  // Special cases for symbols like C++, C#, .NET
  if (kw === 'c++') {
    return /(?:^|[\s,;|/])c\+\+(?:$|[\s,;|/])/.test(normText);
  }
  if (kw === 'c#') {
    return /(?:^|[\s,;|/])c#(?:$|[\s,;|/])/.test(normText);
  }
  if (kw === '.net' || kw === '.net core') {
    return /(?:^|[\s,;|/])\.net(?:\s*core)?(?:$|[\s,;|/])/.test(normText);
  }
  if (kw === 'node.js' || kw === 'nodejs') {
    return /\bnode(\.?js)?\b/.test(normText);
  }
  if (kw === 'react' || kw === 'react.js' || kw === 'reactjs') {
    return /\breact(\.?js)?\b/.test(normText);
  }
  if (kw === 'vue' || kw === 'vue.js') {
    return /\bvue(\.?js)?\b/.test(normText);
  }

  // Normal boundary search
  try {
    const escaped = escapeRegex(kw);
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'i');
    return regex.test(text);
  } catch (e) {
    return normText.includes(kw);
  }
};

/**
 * Extract matched keywords from a text based on taxonomy or word extraction
 */
const extractKeywords = (text) => {
  if (!text) return [];
  const matched = new Set();

  for (const kw of KNOWN_KEYWORDS) {
    if (checkWordPresence(text, kw)) {
      matched.add(kw);
    }
  }

  return Array.from(matched);
};

const canonicalizeSkill = (skill) => {
  const s = skill.toLowerCase().trim();
  if (['react', 'react.js', 'reactjs'].includes(s)) return 'React';
  if (['node', 'node.js', 'nodejs'].includes(s)) return 'Node.js';
  if (['express', 'express.js'].includes(s)) return 'Express.js';
  if (['vue', 'vue.js'].includes(s)) return 'Vue.js';
  if (['next.js', 'nextjs'].includes(s)) return 'Next.js';
  if (['html', 'html5'].includes(s)) return 'HTML5';
  if (['css', 'css3'].includes(s)) return 'CSS3';
  if (['k8s', 'kubernetes'].includes(s)) return 'Kubernetes';
  if (['aws', 'amazon web services'].includes(s)) return 'AWS';
  if (['gcp', 'google cloud'].includes(s)) return 'Google Cloud';
  if (['ci/cd', 'cicd'].includes(s)) return 'CI/CD';
  if (['rest api', 'restful apis', 'rest'].includes(s)) return 'REST API';
  if (['mongodb', 'mongo'].includes(s)) return 'MongoDB';
  if (['postgres', 'postgresql'].includes(s)) return 'PostgreSQL';
  // Capitalize words
  return s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const formatKeywordsList = (list) => {
  const seen = new Set();
  const result = [];
  for (const item of list) {
    const canon = canonicalizeSkill(item);
    if (!seen.has(canon.toLowerCase())) {
      seen.add(canon.toLowerCase());
      result.push(canon);
    }
  }
  return result;
};

/**
 * Compare Resume against Job Description
 */
const compareResumeToJob = (resumeData, jobDescriptionText, jobTitle = 'Target Role') => {
  const resumeText = (resumeData.extractedText || resumeData.text || '').toLowerCase();
  const jdText = (jobDescriptionText || '').toLowerCase();

  const jdKeywords = extractKeywords(jobDescriptionText);
  // If JD has few keywords, extract significant frequent nouns/tokens
  const extraJdTokens = extractExtraJdTokens(jobDescriptionText, jdKeywords);
  const allTargetKeywords = Array.from(new Set([...jdKeywords, ...extraJdTokens]));

  const matchedKeywords = [];
  const missingKeywords = [];

  for (const kw of allTargetKeywords) {
    if (checkWordPresence(resumeText, kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  // Calculate Skills Score
  let skillsScore = 70;
  if (allTargetKeywords.length > 0) {
    skillsScore = Math.round((matchedKeywords.length / allTargetKeywords.length) * 100);
  }

  // Calculate Experience Score
  let experienceScore = 60;
  const sections = resumeData.sections || {};
  let actionVerbCount = 0;
  for (const verb of ACTION_VERBS) {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(resumeText)) actionVerbCount++;
  }
  const hasNumbersOrMetrics = (resumeText.match(/\b\d+(\.\d+)?%|\$\d+|\b\d+\+\s*(years|users|clients|projects)/gi) || []).length;

  if (sections.experience && sections.experience.length > 0) experienceScore += 15;
  if (actionVerbCount >= 4) experienceScore += 15;
  if (hasNumbersOrMetrics >= 2) experienceScore += 10;
  experienceScore = Math.min(100, Math.max(30, experienceScore));

  // Calculate Education Score
  let educationScore = 65;
  const eduRegex = /\b(bachelor|master|b\.?tech|b\.?e|b\.?s|m\.?tech|m\.?s|mca|bca|phd|degree|computer science|engineering|university|college|institute)\b/i;
  if (eduRegex.test(resumeText)) {
    educationScore = 90;
  }
  if (sections.education && sections.education.length > 0) {
    educationScore = Math.min(100, educationScore + 10);
  }

  // Calculate ATS Formatting & Readability Score
  let formattingScore = 60;
  let sectionCount = 0;
  if (sections.summary && sections.summary.length > 20) { formattingScore += 8; sectionCount++; }
  if (sections.skills && sections.skills.length > 0) { formattingScore += 10; sectionCount++; }
  if (sections.experience && sections.experience.length > 0) { formattingScore += 10; sectionCount++; }
  if (sections.education && sections.education.length > 0) { formattingScore += 8; sectionCount++; }
  if (sections.projects && sections.projects.length > 0) { formattingScore += 8; sectionCount++; }
  if (sections.certifications && sections.certifications.length > 0) { formattingScore += 6; sectionCount++; }

  // Check email and phone
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  if (hasEmail) formattingScore += 5;
  if (hasPhone) formattingScore += 5;

  formattingScore = Math.min(100, Math.max(40, formattingScore));

  // Overall Score (Weighted: Skills 40%, Experience 25%, Education 20%, Formatting 15%)
  const overallScore = Math.round(
    skillsScore * 0.4 +
    experienceScore * 0.25 +
    educationScore * 0.2 +
    formattingScore * 0.15
  );

  // Generate Strengths
  const strengths = [];
  if (matchedKeywords.length >= 5) {
    strengths.push(`Strong core keyword match with ${matchedKeywords.length} matching technical qualifications.`);
  }
  if (actionVerbCount >= 4) {
    strengths.push('Effective usage of high-impact action verbs (e.g., developed, optimized, implemented) in descriptions.');
  }
  if (hasNumbersOrMetrics >= 2) {
    strengths.push('Contains quantifiable achievements and metrics, which significantly boosts ATS ranking.');
  }
  if (sections.skills && sections.skills.length >= 5) {
    strengths.push('Dedicated skills section present with clear categorization.');
  }
  if (hasEmail && hasPhone) {
    strengths.push('Standard contact details (email and phone number) are easily discoverable for recruiter contact.');
  }
  if (strengths.length === 0) {
    strengths.push('Good foundation provided for the target role.');
  }

  // Generate Issues
  const issues = [];
  if (missingKeywords.length > 0) {
    issues.push(`Missing ${missingKeywords.length} target skills/technologies mentioned in the job description: ${missingKeywords.slice(0, 5).join(', ')}.`);
  }
  if (!sections.summary || sections.summary.length < 20) {
    issues.push('Missing or very short Professional Summary section to highlight your value proposition.');
  }
  if (hasNumbersOrMetrics === 0) {
    issues.push('Lack of measurable outcomes or statistics (e.g. "% improvement", "reduced latency by Xms", "served X users").');
  }
  if (actionVerbCount < 3) {
    issues.push('Weak reliance on passive language. Experience bullets could use stronger action verbs.');
  }
  if (!sections.projects || sections.projects.length === 0) {
    issues.push('No dedicated Projects section identified. Adding showcase projects improves candidate appeal.');
  }
  if (!hasPhone || !hasEmail) {
    issues.push('Contact information could not be cleanly extracted. Ensure email and phone are plain text in the header.');
  }

  // Actionable Recommendations
  const recommendations = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Incorporate key missing terms: Add relevant experience with ${missingKeywords.slice(0, 4).join(', ')} into your Skills and Project descriptions.`
    );
  }
  recommendations.push(
    'Tailor bullet points to the STAR format: Situation, Task, Action taken, and measurable Result.'
  );
  if (hasNumbersOrMetrics < 2) {
    recommendations.push(
      'Quantify results: Replace generic claims with concrete figures (e.g., "Increased performance by 35% through query optimization").'
    );
  }
  if (!sections.summary || sections.summary.length < 20) {
    recommendations.push(
      'Add a 3-4 sentence Professional Summary at the top highlighting your years of experience, primary tech stack, and top achievement.'
    );
  }
  recommendations.push(
    'Ensure standard section headers (Summary, Technical Skills, Experience, Education, Projects) for 100% ATS parser compatibility.'
  );

  const formattedMatched = formatKeywordsList(matchedKeywords);
  const formattedMissing = formatKeywordsList(missingKeywords);

  return {
    overallScore,
    categoryScores: {
      skills: skillsScore,
      experience: experienceScore,
      education: educationScore,
      formatting: formattingScore,
    },
    matchedKeywords: formattedMatched,
    missingKeywords: formattedMissing,
    strengths,
    issues,
    recommendations,
  };
};

const extractExtraJdTokens = (jdText, existingKeywords) => {
  if (!jdText) return [];
  const words = jdText.toLowerCase().split(/[^a-z0-9+#.-]+/);
  const stopWords = new Set([
    'the', 'and', 'with', 'for', 'you', 'will', 'are', 'that', 'this', 'from', 'have',
    'work', 'role', 'team', 'candidate', 'experience', 'responsibilities', 'qualifications',
    'years', 'preferred', 'required', 'skills', 'about', 'join', 'company', 'must', 'should',
    'ability', 'strong', 'good', 'knowledge', 'understanding', 'working', 'including', 'such',
  ]);

  const counts = {};
  for (const word of words) {
    if (word.length >= 4 && !stopWords.has(word) && !existingKeywords.includes(word)) {
      counts[word] = (counts[word] || 0) + 1;
    }
  }

  return Object.entries(counts)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);
};

module.exports = {
  extractKeywords,
  compareResumeToJob,
};
