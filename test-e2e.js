const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE E2E TESTS ---');
  const baseUrl = 'http://127.0.0.1:5000/api';

  // 1. Test Health
  try {
    const health = await fetch(`${baseUrl}/health`).then((r) => r.json());
    console.log('✔ Health Check:', health.status);
  } catch (e) {
    console.error('❌ Health check failed:', e.message);
  }

  // 2. Test Login with Demo User
  let token = null;
  try {
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@example.com', password: 'password123' }),
    });
    const loginData = await loginRes.json();
    if (loginRes.ok && loginData.token) {
      token = loginData.token;
      console.log('✔ User Login Successful for:', loginData.user.name);
    } else {
      console.error('❌ Login failed:', loginData);
    }
  } catch (e) {
    console.error('❌ Login error:', e.message);
  }

  // 3. Test Sample Templates
  try {
    const tplRes = await fetch(`${baseUrl}/analysis/sample-templates`).then((r) => r.json());
    console.log('✔ Sample Templates returned:', tplRes.templates.length, 'templates');
  } catch (e) {
    console.error('❌ Sample templates error:', e.message);
  }

  // 4. Test Resume Upload
  let uploadedResumeId = null;
  try {
    const samplePdfPath = path.join(__dirname, 'backend/sample_resumes/John_Doe_Software_Engineer_Resume.pdf');
    if (fs.existsSync(samplePdfPath)) {
      const fileBytes = fs.readFileSync(samplePdfPath);
      const blob = new Blob([fileBytes], { type: 'application/pdf' });
      const formData = new FormData();
      formData.append('resume', blob, 'John_Doe_Software_Engineer_Resume.pdf');

      const uploadRes = await fetch(`${baseUrl}/resumes/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (uploadRes.ok) {
        uploadedResumeId = uploadData.resume._id || uploadData.resume.id;
        console.log('✔ Resume PDF Upload & Text Parsing succeeded! ID:', uploadedResumeId);
        console.log('   Sections identified:', Object.keys(uploadData.resume.sections || {}));
      } else {
        console.error('❌ Resume upload failed:', uploadData);
      }
    } else {
      console.warn('Sample PDF not found on disk at:', samplePdfPath);
    }
  } catch (e) {
    console.error('❌ Resume upload error:', e.message);
  }

  // 5. Test Analysis Generation
  let analysisId = null;
  try {
    const jdText = `Looking for a Senior Full Stack Engineer.
Required Skills: React, Node.js, Express, MongoDB, TypeScript, Docker, Kubernetes, AWS, SQL.
Responsibilities: Architect scalable web applications and lead engineering code reviews.`;

    const analyzeRes = await fetch(`${baseUrl}/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resumeId: uploadedResumeId,
        jobTitle: 'Senior Full Stack Engineer',
        jobDescriptionText: jdText,
      }),
    });
    const analyzeData = await analyzeRes.json();
    if (analyzeRes.ok) {
      analysisId = analyzeData.analysis._id || analyzeData.analysis.id;
      console.log('✔ Analysis created successfully! ID:', analysisId);
      console.log('   Overall Score:', analyzeData.analysis.overallScore + '%');
      console.log('   Category Scores:', analyzeData.analysis.categoryScores);
      console.log('   Matched Skills Count:', analyzeData.analysis.matchedKeywords?.length);
      console.log('   Missing Skills Count:', analyzeData.analysis.missingKeywords?.length);
      console.log('   Recommendations Count:', analyzeData.analysis.recommendations?.length);
    } else {
      console.error('❌ Analysis failed:', analyzeData);
    }
  } catch (e) {
    console.error('❌ Analysis creation error:', e.message);
  }

  // 6. Test Fetching Analysis by ID
  try {
    if (analysisId) {
      const getRes = await fetch(`${baseUrl}/analysis/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const getData = await getRes.json();
      console.log('✔ Fetch Analysis Report by ID succeeded! Title:', getData.analysis?.jobTitle);
    }
  } catch (e) {
    console.error('❌ Fetch analysis error:', e.message);
  }

  // 7. Test Admin Login & Stats
  try {
    const adminLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' }),
    }).then((r) => r.json());

    const adminToken = adminLogin.token;
    const stats = await fetch(`${baseUrl}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    console.log('✔ Admin Stats retrieved:', stats.stats);

    const usersList = await fetch(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }).then((r) => r.json());
    console.log('✔ Admin User List retrieved:', usersList.users?.length, 'users registered');
  } catch (e) {
    console.error('❌ Admin test error:', e.message);
  }

  console.log('--- E2E TESTS COMPLETED ---');
}

runTests();

