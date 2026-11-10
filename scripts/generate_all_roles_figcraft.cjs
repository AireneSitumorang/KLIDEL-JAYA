const fs = require('fs');
const path = require('path');

const screenshotsDir = 'C:\\laragon\\www\\KLINIK\\web_screenshots';

class FigCraftScript {
  constructor() {
    this.commands = [];
    this.currentId = 2;
  }

  createFrame(opts) {
    const id = this.currentId++;
    const params = {
      name: opts.name || `Frame ${id}`,
      x: opts.x || 0,
      y: opts.y || 0,
      width: opts.width || 1440,
      height: opts.height || 960,
      props: {
        fill: opts.fill || '#FFFFFF'
      }
    };
    if (opts.parent) params.parent = opts.parent;
    if (opts.stroke) {
      params.props.stroke = opts.stroke;
      params.props.strokeWeight = opts.strokeWeight || 1;
    }
    if (opts.radius) {
      params.props.cornerRadius = opts.radius;
    }
    this.commands.push({ command: 'frame.create', params });
    return id;
  }

  placeImage(opts) {
    const id = this.currentId++;
    const params = {
      path: opts.path,
      x: opts.x || 0,
      y: opts.y || 0,
      width: opts.width || 1440,
      height: opts.height || 960,
      name: opts.name || `Image ${id}`
    };
    if (opts.parent) params.parent = opts.parent;
    this.commands.push({ command: 'image.place', params });
    return id;
  }

  createRect(opts) {
    const id = this.currentId++;
    const params = {
      name: opts.name || `Rect ${id}`,
      x: opts.x || 0,
      y: opts.y || 0,
      width: opts.width || 100,
      height: opts.height || 100,
      props: {
        fill: opts.fill || '#EFF6FF'
      }
    };
    if (opts.parent) params.parent = opts.parent;
    if (opts.stroke) {
      params.props.stroke = opts.stroke;
      params.props.strokeWeight = opts.strokeWeight || 1;
    }
    if (opts.radius) {
      params.props.cornerRadius = opts.radius;
    }
    this.commands.push({ command: 'shape.rectangle', params });
    return id;
  }

  createText(opts) {
    const id = this.currentId++;
    const params = {
      text: String(opts.text || 'Text'),
      x: opts.x || 0,
      y: opts.y || 0,
      name: opts.name || String(opts.text || 'Text').slice(0, 32),
      props: {
        fontSize: opts.fontSize || 14,
        fontFamily: opts.fontFamily || 'Inter',
        fill: opts.color || '#0F172A'
      }
    };
    if (opts.parent) params.parent = opts.parent;
    if (opts.width) params.width = opts.width;
    if (opts.fontWeight === 'bold') params.props.fontStyle = 'Bold';
    else if (opts.fontWeight === 'medium') params.props.fontStyle = 'Medium';
    else params.props.fontStyle = 'Regular';

    this.commands.push({ command: 'text.create', params });
    return id;
  }
}

const b = new FigCraftScript();

console.log('Generating complete multi-role FigCraft project (Pasien, Dokter, Administrator)...');

// =========================================================================
// ROLE 1: PASIEN (PATIENT PORTAL)
// =========================================================================

// 1.1 Pasien - Beranda & Antrean (0, 0)
const fPasienHome = b.createFrame({
  name: '[PASIEN] 01 - Beranda & Antrean Pasien',
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fPasienHome,
  path: path.join(screenshotsDir, 'role_patient_home.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});
const sbPasien = b.createFrame({
  parent: fPasienHome,
  name: '🧭 Sidebar Navigasi Pasien',
  x: 0,
  y: 0,
  width: 240,
  height: 960,
  fill: '#FFFFFF',
  stroke: '#E2E8F0'
});
b.createText({ parent: sbPasien, text: '+ Gabe Medica', x: 24, y: 24, fontSize: 18, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: sbPasien, text: 'Portal Pasien', x: 24, y: 46, fontSize: 11, color: '#0284C7', fontWeight: 'bold' });
b.createRect({ parent: sbPasien, name: 'Active Pill', x: 16, y: 96, width: 208, height: 40, fill: '#EFF6FF', radius: 10 });
b.createText({ parent: sbPasien, text: 'Beranda', x: 36, y: 107, fontSize: 13, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: sbPasien, text: 'Jadwal Dokter', x: 36, y: 155, fontSize: 13, color: '#475569' });
b.createText({ parent: sbPasien, text: 'Rekam Medis', x: 36, y: 203, fontSize: 13, color: '#475569' });
b.createText({ parent: sbPasien, text: 'Pengaturan', x: 36, y: 251, fontSize: 13, color: '#475569' });

// 1.2 Pasien - Rekam Medis Elektronik (1540, 0)
const fPasienRM = b.createFrame({
  name: '[PASIEN] 02 - Rekam Medis Pasien (RME)',
  x: 1540,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fPasienRM,
  path: path.join(screenshotsDir, 'role_patient_records.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});
const cardPasienProfile = b.createFrame({
  parent: fPasienRM,
  name: '👤 Profil Pasien Rina Anggraini',
  x: 40,
  y: 88,
  width: 1360,
  height: 110,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: cardPasienProfile, text: 'Rina Anggraini (34 Tahun) — #GM-0214', x: 32, y: 28, fontSize: 20, color: '#0F172A', fontWeight: 'bold' });
b.createText({ parent: cardPasienProfile, text: 'NIK: 3171045206920003  •  Gol. Darah: B+  •  Alergi: Penisilin, Asam Mefenamat', x: 32, y: 62, fontSize: 13, color: '#64748B' });
b.createRect({ parent: cardPasienProfile, name: 'Allergy Tag', x: 1140, y: 24, width: 190, height: 32, fill: '#FEE2E2', radius: 8 });
b.createText({ parent: cardPasienProfile, text: '⚠️ Alergi: Penisilin', x: 1166, y: 32, fontSize: 12, color: '#991B1B', fontWeight: 'bold' });

// 1.3 Pasien - Kalender & Booking (3080, 0)
const fPasienCal = b.createFrame({
  name: '[PASIEN] 03 - Jadwal Dokter & Booking Kalender',
  x: 3080,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fPasienCal,
  path: path.join(screenshotsDir, 'role_patient_calendar.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});
const headerPasienCal = b.createFrame({
  parent: fPasienCal,
  name: '📅 Filter & Topbar Kalender',
  x: 0,
  y: 0,
  width: 1440,
  height: 120,
  fill: '#FFFFFF',
  stroke: '#E2E8F0'
});
b.createText({ parent: headerPasienCal, text: 'Jadwal Praktik Dokter & Janji Temu Pasien', x: 40, y: 24, fontSize: 20, color: '#012D68', fontWeight: 'bold' });


// =========================================================================
// ROLE 2: DOKTER (DOCTOR PORTAL)
// =========================================================================

// 2.1 Dokter - Dashboard Antrean & SOAP (0, 1040)
const fDoctor = b.createFrame({
  name: '[DOKTER] 04 - Portal Dokter (Antrean & SOAP Klinis)',
  x: 0,
  y: 1040,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fDoctor,
  path: path.join(screenshotsDir, 'role_doctor_dashboard.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});
const topDoctor = b.createFrame({
  parent: fDoctor,
  name: '🩺 Topbar Dokter Spesialis',
  x: 0,
  y: 0,
  width: 1440,
  height: 64,
  fill: '#012D68'
});
b.createText({ parent: topDoctor, text: '+ Gabe Medica', x: 32, y: 20, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createRect({ parent: topDoctor, name: 'Badge Dokter', x: 170, y: 18, width: 110, height: 26, fill: '#083E88', radius: 13 });
b.createText({ parent: topDoctor, text: 'PORTAL DOKTER', x: 182, y: 24, fontSize: 11, color: '#93C5FD', fontWeight: 'bold' });

const queueDoctor = b.createFrame({
  parent: fDoctor,
  name: '👥 Daftar Antrean Pasien Hari Ini',
  x: 24,
  y: 84,
  width: 360,
  height: 844,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: queueDoctor, text: 'Antrean Pasien Hari Ini (10)', x: 24, y: 24, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });

const soapDoctor = b.createFrame({
  parent: fDoctor,
  name: '📋 Panel Pemeriksaan SOAP Pasien',
  x: 404,
  y: 84,
  width: 1012,
  height: 844,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: soapDoctor, text: 'Rina Anggraini (34 th) — Diagnosa: G43.1 Migraine with aura', x: 32, y: 28, fontSize: 18, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ parent: soapDoctor, name: 'Save SOAP Btn', x: 32, y: 760, width: 260, height: 48, fill: '#012D68', radius: 10 });
b.createText({ parent: soapDoctor, text: '✓ Simpan SOAP & Panggil Berikutnya', x: 52, y: 776, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });


// =========================================================================
// ROLE 3: ADMINISTRATOR (ADMIN PORTAL)
// =========================================================================

// 3.1 Administrator - Dashboard & Kalender Operasional (1540, 1040)
const fAdmin = b.createFrame({
  name: '[ADMIN] 05 - Portal Administrator (Kalender & Manajemen)',
  x: 1540,
  y: 1040,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fAdmin,
  path: path.join(screenshotsDir, 'role_admin_dashboard.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});
const topAdmin = b.createFrame({
  parent: fAdmin,
  name: '⚙️ Topbar Administrator',
  x: 0,
  y: 0,
  width: 1440,
  height: 64,
  fill: '#6B21A8'
});
b.createText({ parent: topAdmin, text: '+ Gabe Medica', x: 32, y: 20, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createRect({ parent: topAdmin, name: 'Admin Tag', x: 170, y: 18, width: 140, height: 26, fill: '#581C87', radius: 13 });
b.createText({ parent: topAdmin, text: 'PORTAL ADMINISTRATOR', x: 178, y: 24, fontSize: 10, color: '#E9D5FF', fontWeight: 'bold' });
b.createText({ parent: topAdmin, text: 'Amélie Laurent (Admin Utama)', x: 1180, y: 24, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });


// =========================================================================
// ROLE 4: AUTENTIKASI / LOGIN (3080, 1040)
// =========================================================================
const fLogin = b.createFrame({
  name: '[AUTH] 06 - Halaman Login Portal (Multi-Role Switcher)',
  x: 3080,
  y: 1040,
  width: 1440,
  height: 960,
  fill: '#F3F6F9'
});
b.placeImage({
  parent: fLogin,
  path: path.join(screenshotsDir, 'role_auth_login.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});
const loginCard = b.createFrame({
  parent: fLogin,
  name: '🔐 Form Login Card',
  x: 860,
  y: 140,
  width: 440,
  height: 680,
  fill: '#FFFFFF',
  radius: 24,
  stroke: '#E2E8F0'
});
b.createText({ parent: loginCard, text: 'Masuk ke Portal Layanan', x: 40, y: 40, fontSize: 22, color: '#0F172A', fontWeight: 'bold' });
b.createText({ parent: loginCard, text: 'Pilih role akun Anda di bawah ini', x: 40, y: 72, fontSize: 13, color: '#64748B' });


// =========================================================================
// ROLE 5: GABE MEDICA UI DESIGN SYSTEM & TOKENS (4620, 520)
// =========================================================================
const fTokens = b.createFrame({
  name: '[SYSTEM] 07 - Gabe Medica UI Design System & Tokens',
  x: 4620,
  y: 520,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
const dsHeader = b.createFrame({
  parent: fTokens,
  name: '🎨 Header Design Tokens',
  x: 0,
  y: 0,
  width: 1440,
  height: 72,
  fill: '#012D68'
});
b.createText({ parent: dsHeader, text: 'Gabe Medica — UI Design System & Tokens (Pasien, Dokter, Admin)', x: 40, y: 24, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });

// Palette swatches
const swatches = [
  { name: 'Primary Navy', hex: '#012D68', textCol: '#FFFFFF', x: 40 },
  { name: 'Admin Purple', hex: '#6B21A8', textCol: '#FFFFFF', x: 210 },
  { name: 'Sky Accent', hex: '#0284C7', textCol: '#FFFFFF', x: 380 },
  { name: 'Primary Tint', hex: '#EFF6FF', textCol: '#012D68', x: 550 },
  { name: 'Emerald Success', hex: '#10B981', textCol: '#FFFFFF', x: 720 },
  { name: 'Amber Warning', hex: '#F59E0B', textCol: '#FFFFFF', x: 890 },
  { name: 'Rose Danger', hex: '#F43F5E', textCol: '#FFFFFF', x: 1060 },
  { name: 'Pure White', hex: '#FFFFFF', textCol: '#0F172A', x: 1230 }
];
swatches.forEach(c => {
  b.createRect({ parent: fTokens, name: `Color ${c.name}`, x: c.x, y: 110, width: 150, height: 90, fill: c.hex, radius: 10, stroke: '#CBD5E1' });
  b.createText({ parent: fTokens, text: c.name, x: c.x + 12, y: 126, fontSize: 12, color: c.textCol, fontWeight: 'bold' });
  b.createText({ parent: fTokens, text: c.hex, x: c.x + 12, y: 168, fontSize: 11, color: c.textCol });
});

// Save script
const outScript = path.join(__dirname, 'all_roles_cmds.json');
fs.writeFileSync(outScript, JSON.stringify(b.commands, null, 2));
console.log(`Script built with ${b.commands.length} commands across all roles! Saved to ${outScript}`);
