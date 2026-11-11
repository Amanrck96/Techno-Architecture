// Automated Multi-Agent Architecture Audit & Verification Script
const fs = require('fs');

async function runAudit() {
  console.log('====================================================');
  console.log('PHASE 2 & 3: COMPREHENSIVE REPRODUCTION & AUDIT');
  console.log('====================================================');

  const BASE_URL = 'https://www.technoarchitecture.co.in';

  // 1. Audit all navigation routes
  const routes = [
    '/',
    '/home',
    '/about',
    '/services',
    '/services/architecture',
    '/services/interior-design',
    '/services/structural-design',
    '/projects',
    '/projects/completed',
    '/projects/ongoing',
    '/projects/aikya',
    '/projects/belaku',
    '/gallery',
    '/careers',
    '/contact',
    '/faq',
    '/recognitions',
    '/blog',
    '/admin',
    '/login'
  ];

  console.log('\n--- 1. AUDITING PUBLIC & INTERNAL NAVIGATION ROUTES ---');
  const routeResults = [];
  for (const r of routes) {
    try {
      const start = Date.now();
      const res = await fetch(BASE_URL + r, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        redirect: 'follow'
      });
      const ms = Date.now() - start;
      const html = await res.text();
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : 'No title';
      const passed = (res.status === 200 || res.status === 307 || res.status === 308) && (html.length > 500 || res.status === 307 || res.status === 308);
      routeResults.push({ route: r, status: res.status, ms, length: html.length, title, passed });
      console.log(`[${passed ? 'PASS' : 'FAIL'}] ${r} -> HTTP ${res.status} (${ms}ms, ${html.length} bytes) - "${title.substring(0, 40)}"`);
    } catch (err) {
      console.error(`[FAIL] ${r} -> Network Error: ${err.message}`);
      routeResults.push({ route: r, status: 0, ms: 0, length: 0, title: '', passed: false, error: err.message });
    }
  }

  // 2. Audit Admin CRM Authentication & Operations
  console.log('\n--- 2. AUDITING ADMIN CRM AUTH & PERSISTENCE ---');
  let adminToken = null;
  let adminCookie = null;

  try {
    console.log('Step 2A: Testing /api/admin/login...');
    const loginRes = await fetch(BASE_URL + '/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'TechnoArchitecture#2026' })
    });
    const loginData = await loginRes.json();
    console.log('Login HTTP Status:', loginRes.status);
    console.log('Login Response:', loginData);
    if (loginRes.ok && loginData.token) {
      adminToken = loginData.token;
      adminCookie = loginRes.headers.get('set-cookie');
      console.log('Admin Token successfully obtained:', adminToken.substring(0, 20) + '...');
    } else {
      console.error('Login FAILED!');
    }
  } catch (e) {
    console.error('Login Exception:', e);
  }

  if (adminToken) {
    console.log('\nStep 2B: Testing /api/admin/verify...');
    try {
      const verifyRes = await fetch(BASE_URL + '/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken,
          'Cookie': adminCookie || ''
        }
      });
      const verifyData = await verifyRes.json();
      console.log('Verify HTTP Status:', verifyRes.status);
      console.log('Verify Response:', verifyData);
    } catch (e) {
      console.error('Verify Exception:', e);
    }

    console.log('\nStep 2C: Testing /api/cms GET...');
    let currentCMSData = null;
    try {
      const cmsGetRes = await fetch(BASE_URL + '/api/cms', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken
        }
      });
      currentCMSData = await cmsGetRes.json();
      console.log('CMS GET Status:', cmsGetRes.status);
      console.log('CMS Keys:', Object.keys(currentCMSData));
      console.log('Projects count:', currentCMSData.projects?.length);
      console.log('Storage info:', currentCMSData._storageInfo);
    } catch (e) {
      console.error('CMS GET Exception:', e);
    }

    if (currentCMSData && currentCMSData.projects) {
      console.log('\nStep 2D: Testing /api/cms POST with single entity payload (used by debounced auto-sync)...');
      try {
        const entityRes = await fetch(BASE_URL + '/api/cms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
            'x-admin-token': adminToken,
            'Cookie': adminCookie || ''
          },
          body: JSON.stringify({
            entity: 'projects',
            data: currentCMSData.projects,
            deletedIds: currentCMSData.deletedIds || []
          })
        });
        const entityData = await entityRes.json();
        console.log('Entity Save Status:', entityRes.status);
        console.log('Entity Save Response:', entityData);
      } catch (e) {
        console.error('Entity Save Exception:', e);
      }

      console.log('\nStep 2E: Testing /api/cms POST with allData payload (used by "Save All to Cloud")...');
      try {
        const allDataRes = await fetch(BASE_URL + '/api/cms', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
            'x-admin-token': adminToken,
            'Cookie': adminCookie || ''
          },
          body: JSON.stringify({
            allData: {
              projects: currentCMSData.projects,
              services: currentCMSData.services,
              team: currentCMSData.team,
              blog: currentCMSData.blog,
              faq: currentCMSData.faq,
              gallery: currentCMSData.gallery,
              recognitions: currentCMSData.recognitions,
              siteSettings: currentCMSData.siteSettings,
              testimonials: currentCMSData.testimonials,
              deletedIds: currentCMSData.deletedIds || []
            },
            deletedIds: currentCMSData.deletedIds || []
          })
        });
        const allDataResult = await allDataRes.json();
        console.log('allData Save Status:', allDataRes.status);
        console.log('allData Save Response:', allDataResult);
      } catch (e) {
        console.error('allData Save Exception:', e);
      }
    }
  }

  console.log('\n====================================================');
  console.log('AUDIT COMPLETE');
  console.log('====================================================');
}

runAudit();
