const { compareResumeToJob } = require('./nlpService');

/**
 * Analyzes resume and job description using LLM if available,
 * with automatic fallback to our intelligent NLP Engine.
 */
const analyzeResumeWithAI = async (resumeData, jobDescriptionText, jobTitle) => {
  // Start with comprehensive local NLP extraction
  const baselineResult = compareResumeToJob(resumeData, jobDescriptionText, jobTitle);

  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  // If Gemini API is configured, try calling it
  if (geminiKey && geminiKey.trim().length > 5) {
    try {
      const prompt = `
You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Analyze this candidate's resume for the target job: "${jobTitle}".

Job Description:
${jobDescriptionText.slice(0, 1500)}

Candidate Resume Text:
${(resumeData.extractedText || '').slice(0, 2000)}

Please return a valid JSON object ONLY with the following structure:
{
  "additionalStrengths": ["string"],
  "additionalIssues": ["string"],
  "customRecommendations": ["string"],
  "summaryCritique": "string"
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          return {
            ...baselineResult,
            strengths: [...baselineResult.strengths, ...(parsed.additionalStrengths || [])].slice(0, 6),
            issues: [...baselineResult.issues, ...(parsed.additionalIssues || [])].slice(0, 6),
            recommendations: [...(parsed.customRecommendations || []), ...baselineResult.recommendations].slice(0, 6),
            summaryCritique: parsed.summaryCritique || '',
            aiMetadata: {
              provider: 'Google Gemini',
              model: 'gemini-1.5-flash',
              processingStatus: 'completed',
            },
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to built-in NLP engine:', err.message);
    }
  }

  // Fallback to our Built-in NLP Engine
  return {
    ...baselineResult,
    summaryCritique: 'Resume evaluated by the built-in ATS semantic matcher. Match score computed against target keywords and structural requirements.',
    aiMetadata: {
      provider: 'Built-in Intelligent NLP Engine',
      model: 'standard-nlp-v1',
      processingStatus: 'completed',
    },
  };
};

module.exports = {
  analyzeResumeWithAI,
};
