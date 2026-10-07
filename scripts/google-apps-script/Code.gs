/**
 * Build with SSU — Google Sheets webhook
 * ---------------------------------------
 * Paste this whole file into Extensions › Apps Script of the
 * "Build with SSU — Submissions" Google Sheet, fill the three constants,
 * then Deploy › New deployment › Web app (Execute as: Me, Who has access: Anyone).
 * Full steps: README.md › "Google Sheets setup".
 */

const SHEET_ID = 'PASTE_SHEET_ID';
const SECRET   = 'PASTE_SHARED_SECRET';
   // must equal SHEETS_SHARED_SECRET in Vercel / .env.local
const NOTIFY   = 'akshat.s@srisriuniversity.edu.in, dilip.s@srisriuniversity.edu.in'; // + FET coordinator

/** Same order as FLAT_KEYS in src/lib/flatten.ts. Unknown keys are appended as new columns automatically. */
const HEADERS = [
  'referenceId', 'submittedAt', 'intents',
  'orgName', 'orgWebsite', 'orgType', 'industry', 'companySize', 'hqLocation', 'orgAbout',
  'contactName', 'designation', 'contactEmail', 'freeMail', 'contactPhone', 'preferredContact', 'isAlumnus', 'alumnusConnection',
  'build_problem', 'build_domains', 'build_deliverable', 'build_timeline', 'build_teamSize', 'build_techPrefs',
  'build_dataAvailability', 'build_budget', 'build_budgetRange', 'build_ipPreference', 'build_nda', 'build_mentor',
  'research_area', 'research_type', 'research_duration', 'research_funding', 'research_faculty', 'research_description',
  'interns_count', 'interns_programs', 'interns_role', 'interns_skills', 'interns_mode', 'interns_location',
  'interns_duration', 'interns_startMonth', 'interns_stipend', 'interns_ppo', 'interns_selection',
  'fulltime_openings', 'fulltime_role', 'fulltime_programs', 'fulltime_minCgpa', 'fulltime_backlogsAllowed',
  'fulltime_batches', 'fulltime_skills', 'fulltime_locations', 'fulltime_ctc', 'fulltime_bond',
  'fulltime_joiningTimeline', 'fulltime_selection', 'fulltime_jdLink', 'fulltime_jdText',
  'otherEngagement', 'heardFrom', 'consent', 'sendCopy',
  'userAgent', 'sourcePage',
];

/** One triage tab per intent. */
const TAB_NAME = {
  build: 'Build — Projects',
  research: 'Research',
  interns: 'Hire — Interns',
  fulltime: 'Hire — Full-time',
};

const INTENT_LABEL = {
  build: 'Build a Project',
  research: 'Research',
  interns: 'Hire Interns',
  fulltime: 'Hire Full-time',
};

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: 'bad_json' });
  }
  if (body.secret !== SECRET) return json({ ok: false, error: 'unauthorized' });
  delete body.secret;

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const master = getOrCreate(ss, 'All Submissions', HEADERS);
    appendRecord(master, body);

    // one tab per intent for easy triage
    String(body.intents || '').split(',').map(s => s.trim()).filter(Boolean).forEach(i => {
      const tab = getOrCreate(ss, TAB_NAME[i] || i, HEADERS);
      appendRecord(tab, body);
    });
  } finally {
    lock.releaseLock();
  }

  const intentsText = labelIntents(body.intents);
  try {
    MailApp.sendEmail({
      to: NOTIFY,
      replyTo: body.contactEmail || undefined,
      subject: `[Build with SSU] ${intentsText} — ${body.orgName} (${body.referenceId})`,
      htmlBody: renderEmail(body),
    });
    if (body.sendCopy === 'true' && body.contactEmail) {
      MailApp.sendEmail({
        to: body.contactEmail,
        subject: `We received your request — ${body.referenceId}`,
        htmlBody: renderAck(body),
        name: 'Build with SSU · Sri Sri University',
      });
    }
  } catch (err) {
    // Data is already safely in the sheet; don't fail the request because of mail quota.
    console.error('Mail failed: ' + err);
  }

  return json({ ok: true });
}

/** Health check: open the web-app URL in a browser. */
function doGet() {
  return json({ ok: true, service: 'build-with-ssu-webhook' });
}

// ───────────────────────── helpers ─────────────────────────

function getOrCreate(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight('bold').setBackground('#6E0F1F').setFontColor('#FFF8E7');
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(1);
  }
  return sheet;
}

/** Appends using the sheet's actual header row; adds columns for keys it hasn't seen. */
function appendRecord(sheet, body) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  let header = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String).filter(Boolean);
  if (header.length === 0) {
    header = HEADERS.slice();
    sheet.getRange(1, 1, 1, header.length).setValues([header]);
  }
  const missing = Object.keys(body).filter(k => header.indexOf(k) === -1);
  if (missing.length) {
    sheet.getRange(1, header.length + 1, 1, missing.length).setValues([missing])
      .setFontWeight('bold').setBackground('#6E0F1F').setFontColor('#FFF8E7');
    header = header.concat(missing);
  }
  sheet.appendRow(header.map(h => (body[h] === null || body[h] === undefined ? '' : body[h])));
}

function labelIntents(intents) {
  return String(intents || '').split(',').filter(Boolean).map(i => INTENT_LABEL[i] || i).join(' + ') || 'Enquiry';
}

function esc(v) {
  return String(v === null || v === undefined ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function row(label, value) {
  if (value === null || value === undefined || value === '') return '';
  return `<tr><td style="padding:6px 12px 6px 0;color:#6b5a60;vertical-align:top;white-space:nowrap">${esc(label)}</td>` +
         `<td style="padding:6px 0;color:#1A1216">${esc(value)}</td></tr>`;
}

function section(title, rows) {
  const inner = rows.join('');
  if (!inner) return '';
  return `<h3 style="font-family:Georgia,serif;color:#6E0F1F;margin:24px 0 6px;border-bottom:1px solid #C9A227;padding-bottom:4px">${esc(title)}</h3>` +
         `<table style="border-collapse:collapse;font-size:14px">${inner}</table>`;
}

function renderEmail(b) {
  const has = k => String(b.intents || '').split(',').indexOf(k) !== -1;
  const parts = [
    `<div style="font-family:Arial,sans-serif;max-width:680px">`,
    `<div style="background:#6E0F1F;color:#FFF8E7;padding:18px 22px;border-radius:10px">`,
    `<div style="font-size:12px;letter-spacing:2px;color:#E8CF7A">BUILD WITH SSU · NEW SUBMISSION</div>`,
    `<div style="font-size:22px;font-family:Georgia,serif;margin-top:4px">${esc(b.orgName)} — ${esc(labelIntents(b.intents))}</div>`,
    `<div style="font-size:13px;margin-top:4px;opacity:.8">${esc(b.referenceId)} · ${esc(b.submittedAt)}</div></div>`,
    section('Organisation', [
      row('Name', b.orgName), row('Website', b.orgWebsite), row('Type', b.orgType), row('Industry', b.industry),
      row('Size', b.companySize), row('HQ', b.hqLocation), row('About', b.orgAbout),
    ]),
    section('Contact', [
      row('Name', b.contactName), row('Designation', b.designation),
      row('Email', b.contactEmail + (b.freeMail === 'true' ? '  (personal address)' : '')),
      row('Phone', b.contactPhone), row('Prefers', b.preferredContact),
      row('SSU / AoL connection', b.isAlumnus === 'Yes' ? b.alumnusConnection : ''),
    ]),
  ];
  if (has('build')) parts.push(section('Build a Project', [
    row('Problem', b.build_problem), row('Domains', b.build_domains), row('Deliverable', b.build_deliverable),
    row('Timeline', b.build_timeline), row('Team size', b.build_teamSize), row('Stack', b.build_techPrefs),
    row('Data', b.build_dataAvailability), row('Budget', b.build_budget), row('Sponsorship', b.build_budgetRange),
    row('IP', b.build_ipPreference), row('NDA', b.build_nda), row('Industry mentor', b.build_mentor),
  ]));
  if (has('research')) parts.push(section('Research', [
    row('Area', b.research_area), row('Type', b.research_type), row('Duration', b.research_duration),
    row('Funding', b.research_funding), row('Faculty', b.research_faculty), row('Description', b.research_description),
  ]));
  if (has('interns')) parts.push(section('Hire Interns', [
    row('Count', b.interns_count), row('Role', b.interns_role), row('Programs', b.interns_programs),
    row('Skills', b.interns_skills), row('Mode', b.interns_mode), row('Location', b.interns_location),
    row('Duration', b.interns_duration), row('Start', b.interns_startMonth), row('Stipend', b.interns_stipend),
    row('PPO', b.interns_ppo), row('Selection', b.interns_selection),
  ]));
  if (has('fulltime')) parts.push(section('Hire Full-time', [
    row('Openings', b.fulltime_openings), row('Role', b.fulltime_role), row('Programs', b.fulltime_programs),
    row('Min CGPA', b.fulltime_minCgpa), row('Backlogs allowed', b.fulltime_backlogsAllowed), row('Batch', b.fulltime_batches),
    row('Skills', b.fulltime_skills), row('Location(s)', b.fulltime_locations), row('CTC', b.fulltime_ctc),
    row('Bond', b.fulltime_bond), row('Joining', b.fulltime_joiningTimeline), row('Selection', b.fulltime_selection),
    row('JD link', b.fulltime_jdLink), row('JD text', b.fulltime_jdText),
  ]));
  parts.push(section('Other', [
    row('Also interested in', b.otherEngagement), row('Heard via', b.heardFrom), row('Source page', b.sourcePage),
  ]));
  parts.push(`<p style="font-size:12px;color:#6b5a60;margin-top:24px">Reply to this email to respond directly to ${esc(b.contactName)}.</p></div>`);
  return parts.join('');
}

function renderAck(b) {
  return [
    `<div style="font-family:Arial,sans-serif;max-width:600px;color:#1A1216">`,
    `<div style="background:#6E0F1F;color:#FFF8E7;padding:18px 22px;border-radius:10px">`,
    `<div style="font-size:12px;letter-spacing:2px;color:#E8CF7A">BUILD WITH SSU</div>`,
    `<div style="font-size:22px;font-family:Georgia,serif;margin-top:4px">Thank you, ${esc(b.contactName)}.</div></div>`,
    `<p>We've received your request on behalf of <b>${esc(b.orgName)}</b> (${esc(labelIntents(b.intents))}).</p>`,
    `<p>Your reference ID is <b style="font-family:monospace;font-size:16px">${esc(b.referenceId)}</b>.</p>`,
    `<p><b>What happens next</b></p><ol>`,
    `<li>Acknowledgement from our team within 24 hours.</li>`,
    `<li>A fit call with FET faculty and Training &amp; Placement within 2 working days.</li>`,
    `<li>A proposal or candidate shortlist within 5 working days.</li></ol>`,
    `<p>Questions? Reply to this email or write to akshat.s@srisriuniversity.edu.in quoting your reference ID.</p>`,
    `<p style="color:#6E0F1F;font-family:Georgia,serif">Faculty of Engineering &amp; Technology · Sri Sri University<br>Learn · Lead · Serve</p>`,
    `</div>`,
  ].join('');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
