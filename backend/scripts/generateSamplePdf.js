const fs = require('fs');
const path = require('path');

function createSimplePdf(filePath, lines) {
  const streamLines = ['BT', '/F1 12 Tf', '50 750 Td', '16 TL'];
  for (const line of lines) {
    const clean = line.replace(/[()\\\\]/g, '');
    streamLines.push(`(${clean}) Tj`);
    streamLines.push('T*');
  }
  streamLines.push('ET');
  const stream = streamLines.join('\n');
  const streamLen = Buffer.byteLength(stream);

  const pdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
5 0 obj << /Length ${streamLen} >>
stream
${stream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000222 00000 n 
0000000299 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
${400 + streamLen}
%%EOF`;

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, pdf);
  console.log('Sample PDF created at:', filePath);
}

const sampleLines = [
  'John Doe - Full Stack Developer',
  'Email: john.doe@example.com | Phone: 555-0199 | Indore, MP',
  'LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe',
  ' ',
  'PROFESSIONAL SUMMARY',
  'Enthusiastic and results-driven Software Engineer with 2+ years of experience in full-stack web development.',
  'Proficient in building modern, responsive user interfaces and high-performance backend microservices.',
  ' ',
  'TECHNICAL SKILLS',
  'Languages: JavaScript, TypeScript, Python, Java, SQL, HTML5, CSS3',
  'Frameworks & Libraries: React, Node.js, Express, Tailwind CSS, Redux, Next.js',
  'Databases: MongoDB, PostgreSQL, MySQL, Redis',
  'Tools & Cloud: Git, Docker, Kubernetes, AWS, Linux, CI/CD, Agile, Scrum, Jest',
  ' ',
  'WORK EXPERIENCE',
  'Full Stack Software Developer Intern - TechNova Systems (2025 - Present)',
  '- Developed and deployed responsive web applications using React.js, Express, and MongoDB.',
  '- Optimized backend database queries, reducing average API response times by 32%.',
  '- Collaborated in an Agile Scrum team of 8 engineers and conducted regular code reviews.',
  '- Integrated secure authentication with JSON Web Tokens (JWT) and role-based access control.',
  ' ',
  'EDUCATION',
  'Bachelor of Technology in Computer Science and Engineering',
  'Medicaps University (2023 - 2027) | CGPA: 8.7/10',
  ' ',
  'PROJECTS',
  'AI Resume Analyzer & ATS Score Optimizer',
  '- Engineered a full-stack MERN application that extracts text from PDF resumes and evaluates ATS compatibility.',
  '- Implemented keyword gap extraction and recommendation engine using NLP.',
  '- Served 500+ student evaluations with 99% uptime.',
  ' ',
  'CERTIFICATIONS',
  'AWS Certified Cloud Practitioner (2025)',
  'Full Stack Web Development - Meta Professional Certificate'
];

createSimplePdf(path.join(__dirname, '../sample_resumes/John_Doe_Software_Engineer_Resume.pdf'), sampleLines);

