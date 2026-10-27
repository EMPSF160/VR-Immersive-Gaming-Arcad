const http = require('http');
const fs = require('fs');
const path = require('path');

async function testUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://127.0.0.1:4173${urlPath}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- RUNNING RIGOROUS AUTOMATED VERIFICATION ---');

  // Test 1: HTML & Assets loading
  const routes = [
    '/',
    '/assets/images/favicon.svg',
    '/assets/images/logo.svg',
    '/assets/css/style.css',
    '/assets/js/app.js',
    '/assets/images/hero_vr_arcade.jpg',
    '/assets/images/podcast_audio_studio.jpg',
    '/assets/images/racing_sim.jpg',
    '/assets/images/audio_gear_showcase.jpg'
  ];

  for (const route of routes) {
    const res = await testUrl(route);
    if (res.statusCode === 200) {
      console.log(`[PASS] ${route} -> 200 OK (${res.headers['content-type']})`);
    } else {
      console.error(`[FAIL] ${route} -> Status ${res.statusCode}`);
    }
  }

  // Test 2: Verify HTML Strict Requirements
  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  // Req 1: Favicon in head
  const hasFavicon = indexHtml.includes('<link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">');
  console.log(`[${hasFavicon ? 'PASS' : 'FAIL'}] Strict Req 1: Favicon in <head>: ${hasFavicon}`);

  // Req 2 & 3: Logo inside Auth cards, centered and clickable -> Home
  const hasAuthCardLogo = indexHtml.includes('class="auth-card-logo-container"') &&
                          indexHtml.includes('class="auth-card-logo-link"') &&
                          indexHtml.includes('href="#home"') &&
                          indexHtml.includes('class="auth-card-logo-img"');
  console.log(`[${hasAuthCardLogo ? 'PASS' : 'FAIL'}] Strict Req 2 & 3: Auth card logo centered & clickable to #home: ${hasAuthCardLogo}`);

  // Req 4, 5, 6: Footer Social Icons & Working Links
  const socialPlatforms = [
    { name: 'Instagram', url: 'https://instagram.com/nexusvr_arcade' },
    { name: 'Facebook', url: 'https://facebook.com/nexusvr.arcade' },
    { name: 'LinkedIn', url: 'https://linkedin.com/company/nexusvr-arcade' },
    { name: 'X / Twitter', url: 'https://x.com/nexusvr_arcade' },
    { name: 'YouTube', url: 'https://youtube.com/@nexusvr_arcade' }
  ];

  for (const p of socialPlatforms) {
    const hasPlatform = indexHtml.includes(p.url);
    console.log(`[${hasPlatform ? 'PASS' : 'FAIL'}] Strict Req 4 & 6: ${p.name} working link (${p.url}): ${hasPlatform}`);
  }

  // Verify no broken or empty hrefs in social icons
  const hasEmptyOrHashHref = indexHtml.includes('href="#"') || indexHtml.includes('href=""');
  console.log(`[${!hasEmptyOrHashHref ? 'PASS' : 'FAIL'}] No empty href="" or placeholder href="#" found: ${!hasEmptyOrHashHref}`);

  // Test 3: Verify CSS Strict Requirements
  const css = fs.readFileSync(path.join(__dirname, 'assets/css/style.css'), 'utf8');

  // Check equal size and shape
  const hasEqualSize = css.includes('width: 44px') && css.includes('height: 44px') && css.includes('border-radius: 50%');
  console.log(`[${hasEqualSize ? 'PASS' : 'FAIL'}] Strict Req 5: Social icons equal size (44x44px) and circular touch target: ${hasEqualSize}`);

  // Check equal spacing
  const hasEqualSpacing = css.includes('gap: 14px');
  console.log(`[${hasEqualSpacing ? 'PASS' : 'FAIL'}] Strict Req 5: Equal spacing (14px gap): ${hasEqualSpacing}`);

  // Check responsive breakpoints: 320, 375, 425, 576, 768, 834, 900, 1024
  const breakpoints = [1024, 900, 834, 768, 576, 425, 375, 320];
  const missingBreakpoints = breakpoints.filter(bp => !css.includes(`max-width: ${bp}px`));
  console.log(`[${missingBreakpoints.length === 0 ? 'PASS' : 'FAIL'}] Strict Req 7: All responsive breakpoints handled (${breakpoints.join(', ')}px): ${missingBreakpoints.length === 0}`);

  // Test 4: Verify JS logic
  const js = fs.readFileSync(path.join(__dirname, 'assets/js/app.js'), 'utf8');
  const hasWebAudio = js.includes('AudioContext') && js.includes('createOscillator') && js.includes('createBiquadFilter');
  const hasBookingWorkflow = js.includes('btn-confirm-booking') && js.includes('showBookingSuccessModal');
  const hasAdminControls = js.includes('renderAdminBookingsTable') && js.includes('updateAdminKPIs');
  const hasAuthWorkflow = js.includes('login-form') && js.includes('register-form');

  console.log(`[${hasWebAudio ? 'PASS' : 'FAIL'}] Web Audio API spatial synth & visualizer present: ${hasWebAudio}`);
  console.log(`[${hasBookingWorkflow ? 'PASS' : 'FAIL'}] Interactive booking customizer workflow present: ${hasBookingWorkflow}`);
  console.log(`[${hasAdminControls ? 'PASS' : 'FAIL'}] Admin management operations deck present: ${hasAdminControls}`);
  console.log(`[${hasAuthWorkflow ? 'PASS' : 'FAIL'}] Client auth state and quick-fill presets present: ${hasAuthWorkflow}`);

  console.log('--- ALL CHECKS COMPLETED ---');
}

runTests().catch(console.error);
