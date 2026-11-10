const fs = require('fs');
const path = require('path');

// Screenshots directory
const screenshotsDir = 'C:\\laragon\\www\\KLINIK\\web_screenshots';

class ScriptBuilder {
  constructor() {
    this.commands = [];
    this.currentId = 2; // Page is 1, next node starts at 2
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

  createEllipse(opts) {
    const id = this.currentId++;
    const params = {
      name: opts.name || `Ellipse ${id}`,
      x: opts.x || 0,
      y: opts.y || 0,
      width: opts.width || 40,
      height: opts.height || 40,
      props: {
        fill: opts.fill || '#0284C7'
      }
    };
    if (opts.parent) params.parent = opts.parent;
    if (opts.stroke) {
      params.props.stroke = opts.stroke;
      params.props.strokeWeight = opts.strokeWeight || 1;
    }
    this.commands.push({ command: 'shape.ellipse', params });
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

const b = new ScriptBuilder();

console.log('Building high-fidelity pixel-perfect FigCraft script...');

// =========================================================================
// SCREEN 1: 01 - Beranda / Dashboard Pasien (1440 x 960) at (0, 0)
// =========================================================================
const s1 = b.createFrame({
  name: '01 - Beranda / Dashboard Pasien',
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

// Baseline Live Web Viewport Render
b.placeImage({
  parent: s1,
  path: path.join(screenshotsDir, '01_home.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});

// Structured Component Group: Sidebar
const sb1 = b.createFrame({
  parent: s1,
  name: '🧭 Sidebar Navigasi',
  x: 0,
  y: 0,
  width: 240,
  height: 960,
  fill: '#FFFFFF',
  stroke: '#E2E8F0'
});
b.createText({ parent: sb1, text: '+ Gabe Medica', x: 24, y: 24, fontSize: 18, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: sb1, text: 'Klinik Pratama Terpadu', x: 24, y: 46, fontSize: 10, color: '#64748B' });

// Sidebar Links
const navLinks1 = [
  { name: 'Beranda', y: 96, active: true },
  { name: 'Jadwal Dokter', y: 144, active: false },
  { name: 'Rekam Medis', y: 192, active: false },
  { name: 'Pengaturan', y: 240, active: false },
  { name: 'Portal Dokter', y: 304, special: true },
  { name: 'Portal Admin', y: 352, admin: true }
];
navLinks1.forEach(link => {
  if (link.active) {
    b.createRect({ parent: sb1, name: 'Active Pill', x: 16, y: link.y, width: 208, height: 40, fill: '#EFF6FF', radius: 10 });
    b.createText({ parent: sb1, text: link.name, x: 36, y: link.y + 11, fontSize: 13, color: '#012D68', fontWeight: 'bold' });
  } else if (link.special) {
    b.createRect({ parent: sb1, name: 'Doctor Pill', x: 16, y: link.y, width: 208, height: 40, fill: '#EFF6FF', radius: 10, stroke: '#BFDBFE' });
    b.createText({ parent: sb1, text: '👨‍⚕️ ' + link.name, x: 28, y: link.y + 11, fontSize: 13, color: '#012D68', fontWeight: 'bold' });
  } else if (link.admin) {
    b.createRect({ parent: sb1, name: 'Admin Pill', x: 16, y: link.y, width: 208, height: 40, fill: '#FAF5FF', radius: 10, stroke: '#E9D5FF' });
    b.createText({ parent: sb1, text: '⚙️ ' + link.name, x: 28, y: link.y + 11, fontSize: 13, color: '#7E22CE', fontWeight: 'bold' });
  } else {
    b.createText({ parent: sb1, text: link.name, x: 36, y: link.y + 11, fontSize: 13, color: '#475569' });
  }
});

// Topbar Component
const tb1 = b.createFrame({
  parent: s1,
  name: '🔍 Header & Search Topbar',
  x: 240,
  y: 0,
  width: 1200,
  height: 72,
  fill: '#FFFFFF',
  stroke: '#E2E8F0'
});
b.createRect({ parent: tb1, name: 'Search Input Box', x: 32, y: 16, width: 440, height: 42, fill: '#F8FAFC', radius: 21, stroke: '#E2E8F0' });
b.createText({ parent: tb1, text: '🔍 Cari dokter atau spesialisasi...', x: 52, y: 28, fontSize: 13, color: '#94A3B8' });

// Hero Banner Layer
const hero1 = b.createFrame({
  parent: s1,
  name: '🌟 Hero Welcome Banner',
  x: 272,
  y: 96,
  width: 780,
  height: 180,
  fill: '#012D68',
  radius: 20
});
b.createText({ parent: hero1, text: 'Selamat Datang di Gabe Medica', x: 32, y: 32, fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ parent: hero1, text: 'Layanan kesehatan keluarga terpercaya dengan dokter spesialis berpengalaman.', x: 32, y: 72, fontSize: 13, color: '#DBEAFE' });
b.createRect({ parent: hero1, name: 'CTA Button', x: 32, y: 110, width: 170, height: 40, fill: '#FFFFFF', radius: 10 });
b.createText({ parent: hero1, text: 'Buat Janji Temu ➜', x: 54, y: 122, fontSize: 12, color: '#012D68', fontWeight: 'bold' });

// Active Queue Card Layer
const qCard = b.createFrame({
  parent: s1,
  name: '🎫 Status Antrean Pasien',
  x: 272,
  y: 296,
  width: 780,
  height: 130,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: qCard, text: 'STATUS ANTREAN AKTIF HARI INI', x: 32, y: 24, fontSize: 11, color: '#64748B', fontWeight: 'bold' });
b.createText({ parent: qCard, text: 'Poli Umum — dr. Sarah Jenkins, Sp.PD', x: 32, y: 48, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });
b.createText({ parent: qCard, text: 'Perkiraan Panggilan: 10:15 WIB (Sisa 2 Pasien)', x: 32, y: 78, fontSize: 13, color: '#475569' });
b.createRect({ parent: qCard, name: 'Queue Number Tag', x: 630, y: 24, width: 118, height: 82, fill: '#EFF6FF', radius: 12, stroke: '#BFDBFE' });
b.createText({ parent: qCard, text: 'A-014', x: 654, y: 52, fontSize: 28, color: '#012D68', fontWeight: 'bold' });


// =========================================================================
// SCREEN 2: 02 - Halaman Login Portal (1440 x 960) at (1540, 0)
// =========================================================================
const s2 = b.createFrame({
  name: '02 - Halaman Login Portal',
  x: 1540,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F3F6F9'
});

b.placeImage({
  parent: s2,
  path: path.join(screenshotsDir, '02_login.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});

// Structured Login Overlays
const lHero = b.createFrame({
  parent: s2,
  name: '🛡️ Hero Branding Panel (Left)',
  x: 0,
  y: 0,
  width: 720,
  height: 960,
  fill: '#012D68'
});
b.createText({ parent: lHero, text: '+ Gabe Medica', x: 80, y: 120, fontSize: 26, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ parent: lHero, text: 'Sistem Informasi Manajemen\nKlinik Pratama Terpadu', x: 80, y: 280, fontSize: 32, color: '#FFFFFF', fontWeight: 'bold' });

const lForm = b.createFrame({
  parent: s2,
  name: '🔐 Form Login Card (Right)',
  x: 860,
  y: 140,
  width: 440,
  height: 680,
  fill: '#FFFFFF',
  radius: 24,
  stroke: '#E2E8F0'
});
b.createText({ parent: lForm, text: 'Selamat Datang Kembali', x: 40, y: 40, fontSize: 22, color: '#0F172A', fontWeight: 'bold' });
b.createText({ parent: lForm, text: 'Silakan masuk ke akun layanan klinik Anda', x: 40, y: 72, fontSize: 13, color: '#64748B' });

// Inputs & Buttons inside Form
b.createRect({ parent: lForm, name: 'Input Email', x: 40, y: 144, width: 360, height: 46, fill: '#F8FAFC', radius: 8, stroke: '#CBD5E1' });
b.createText({ parent: lForm, text: 'pasien@gabemedica.com', x: 56, y: 158, fontSize: 13, color: '#64748B' });

b.createRect({ parent: lForm, name: 'Input Password', x: 40, y: 234, width: 360, height: 46, fill: '#F8FAFC', radius: 8, stroke: '#CBD5E1' });
b.createText({ parent: lForm, text: '••••••••••••', x: 56, y: 250, fontSize: 14, color: '#0F172A' });

b.createRect({ parent: lForm, name: 'Login Button', x: 40, y: 336, width: 360, height: 48, fill: '#012D68', radius: 10 });
b.createText({ parent: lForm, text: 'Masuk ke Layanan ➜', x: 140, y: 350, fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' });

// Demo switcher
b.createRect({ parent: lForm, name: 'Demo Pasien', x: 40, y: 456, width: 110, height: 38, fill: '#EFF6FF', radius: 8, stroke: '#BFDBFE' });
b.createText({ parent: lForm, text: '👤 Pasien', x: 66, y: 468, fontSize: 12, color: '#012D68', fontWeight: 'bold' });

b.createRect({ parent: lForm, name: 'Demo Dokter', x: 165, y: 456, width: 110, height: 38, fill: '#F0FDF4', radius: 8, stroke: '#BBF7D0' });
b.createText({ parent: lForm, text: '👨‍⚕️ Dokter', x: 190, y: 468, fontSize: 12, color: '#166534', fontWeight: 'bold' });

b.createRect({ parent: lForm, name: 'Demo Admin', x: 290, y: 456, width: 110, height: 38, fill: '#FAF5FF', radius: 8, stroke: '#E9D5FF' });
b.createText({ parent: lForm, text: '⚙️ Admin', x: 316, y: 468, fontSize: 12, color: '#7E22CE', fontWeight: 'bold' });


// =========================================================================
// SCREEN 3: 03 - Portal Dokter (SOAP & Antrean) (1440 x 960) at (3080, 0)
// =========================================================================
const s3 = b.createFrame({
  name: '03 - Portal Dokter (SOAP & Antrean)',
  x: 3080,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

b.placeImage({
  parent: s3,
  path: path.join(screenshotsDir, '03_doctor.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});

// Doctor Header Overlay
const dTop = b.createFrame({
  parent: s3,
  name: '🩺 Topbar Portal Dokter',
  x: 0,
  y: 0,
  width: 1440,
  height: 64,
  fill: '#012D68'
});
b.createText({ parent: dTop, text: '+ Gabe Medica', x: 32, y: 20, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createRect({ parent: dTop, name: 'Badge Dokter', x: 170, y: 18, width: 110, height: 26, fill: '#083E88', radius: 13 });
b.createText({ parent: dTop, text: 'PORTAL DOKTER', x: 182, y: 24, fontSize: 11, color: '#93C5FD', fontWeight: 'bold' });

// Patient Queue Sidebar
const dQueue = b.createFrame({
  parent: s3,
  name: '👥 Daftar Antrean Pasien',
  x: 24,
  y: 84,
  width: 360,
  height: 844,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: dQueue, text: 'Antrean Pasien Hari Ini', x: 24, y: 24, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });

// Clinical SOAP Panel
const dSoap = b.createFrame({
  parent: s3,
  name: '📋 Panel Pemeriksaan SOAP',
  x: 404,
  y: 84,
  width: 1012,
  height: 844,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: dSoap, text: 'Ny. Siti Rahma (34 Th) — RM-2026-08892', x: 32, y: 28, fontSize: 18, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ parent: dSoap, name: 'Alergi Tag', x: 820, y: 24, width: 140, height: 28, fill: '#FEE2E2', radius: 6 });
b.createText({ parent: dSoap, text: '⚠️ Alergi: Penisilin', x: 834, y: 30, fontSize: 12, color: '#991B1B', fontWeight: 'bold' });

// Action buttons inside SOAP
b.createRect({ parent: dSoap, name: 'Save SOAP Btn', x: 32, y: 760, width: 260, height: 48, fill: '#012D68', radius: 10 });
b.createText({ parent: dSoap, text: '✓ Simpan SOAP & Panggil Berikutnya', x: 52, y: 776, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });


// =========================================================================
// SCREEN 4: 04 - Jadwal Praktik & Kalender Dokter (1440 x 960) at (0, 1040)
// =========================================================================
const s4 = b.createFrame({
  name: '04 - Jadwal Praktik & Kalender Dokter',
  x: 0,
  y: 1040,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

b.placeImage({
  parent: s4,
  path: path.join(screenshotsDir, '04_calendar.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});

const calHeader = b.createFrame({
  parent: s4,
  name: '📅 Header & Kalender Filter',
  x: 0,
  y: 0,
  width: 1440,
  height: 140,
  fill: '#FFFFFF',
  stroke: '#E2E8F0'
});
b.createText({ parent: calHeader, text: 'Jadwal Praktik Dokter & Booking Antrean', x: 40, y: 24, fontSize: 20, color: '#012D68', fontWeight: 'bold' });


// =========================================================================
// SCREEN 5: 05 - Rekam Medis Elektronik (RME) (1440 x 960) at (1540, 1040)
// =========================================================================
const s5 = b.createFrame({
  name: '05 - Rekam Medis Elektronik (RME)',
  x: 1540,
  y: 1040,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

b.placeImage({
  parent: s5,
  path: path.join(screenshotsDir, '05_rekam_medis.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});

const rmeHeader = b.createFrame({
  parent: s5,
  name: '📜 Header & Pasien Profile',
  x: 40,
  y: 88,
  width: 1360,
  height: 110,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: rmeHeader, text: 'Budi Prasetyo (34 Tahun) — RM-2026-08892', x: 32, y: 28, fontSize: 20, color: '#0F172A', fontWeight: 'bold' });
b.createText({ parent: rmeHeader, text: 'NIK: 3171092837490001  •  Gol. Darah: O+  •  Alergi: Amoxicillin', x: 32, y: 62, fontSize: 13, color: '#64748B' });


// =========================================================================
// SCREEN 6: 06 - Portal Administrator Klinik (1440 x 960) at (3080, 1040)
// =========================================================================
const s6 = b.createFrame({
  name: '06 - Portal Administrator Klinik',
  x: 3080,
  y: 1040,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

b.placeImage({
  parent: s6,
  path: path.join(screenshotsDir, '06_admin.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Pixel-Perfect Render)'
});

const admTop = b.createFrame({
  parent: s6,
  name: '⚙️ Topbar Administrator',
  x: 0,
  y: 0,
  width: 1440,
  height: 64,
  fill: '#6B21A8'
});
b.createText({ parent: admTop, text: '+ Gabe Medica — Portal Administrator', x: 32, y: 20, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });


// =========================================================================
// SCREEN 7: 07 - UI Design System & Tokens (1440 x 960) at (4620, 0)
// =========================================================================
const s7 = b.createFrame({
  name: '07 - Gabe Medica UI Design System & Tokens',
  x: 4620,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

const dsTop = b.createFrame({
  parent: s7,
  name: '🎨 Header Design Tokens',
  x: 0,
  y: 0,
  width: 1440,
  height: 72,
  fill: '#012D68'
});
b.createText({ parent: dsTop, text: 'Gabe Medica — UI Design System & Design Tokens', x: 40, y: 24, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });

// Palette swatches
const swatches = [
  { name: 'Primary Navy', hex: '#012D68', textCol: '#FFFFFF', x: 40 },
  { name: 'Primary Dark', hex: '#001F4D', textCol: '#FFFFFF', x: 210 },
  { name: 'Sky Accent', hex: '#0284C7', textCol: '#FFFFFF', x: 380 },
  { name: 'Primary Tint', hex: '#EFF6FF', textCol: '#012D68', x: 550 },
  { name: 'Emerald Success', hex: '#10B981', textCol: '#FFFFFF', x: 720 },
  { name: 'Amber Warning', hex: '#F59E0B', textCol: '#FFFFFF', x: 890 },
  { name: 'Rose Danger', hex: '#F43F5E', textCol: '#FFFFFF', x: 1060 },
  { name: 'Pure White', hex: '#FFFFFF', textCol: '#0F172A', x: 1230 }
];

swatches.forEach(c => {
  b.createRect({ parent: s7, name: `Color ${c.name}`, x: c.x, y: 110, width: 150, height: 90, fill: c.hex, radius: 10, stroke: '#CBD5E1' });
  b.createText({ parent: s7, text: c.name, x: c.x + 12, y: 126, fontSize: 12, color: c.textCol, fontWeight: 'bold' });
  b.createText({ parent: s7, text: c.hex, x: c.x + 12, y: 168, fontSize: 11, color: c.textCol });
});

// Typography & Components
b.createRect({ parent: s7, name: 'Type Box', x: 40, y: 240, width: 660, height: 400, fill: '#FFFFFF', radius: 14, stroke: '#E2E8F0' });
b.createText({ parent: s7, text: 'Display Bold (32px) — Gabe Medica', x: 64, y: 264, fontSize: 26, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: s7, text: 'Heading 1 (22px) — Sistem Manajemen Pelayanan', x: 64, y: 314, fontSize: 20, color: '#0F172A', fontWeight: 'bold' });
b.createText({ parent: s7, text: 'Heading 2 (16px) — Poli Penyakit Dalam', x: 64, y: 360, fontSize: 16, color: '#334155', fontWeight: 'bold' });
b.createText({ parent: s7, text: 'Body Regular (14px) — Pasien mengeluhkan demam sejak 3 hari.', x: 64, y: 404, fontSize: 14, color: '#475569' });
b.createText({ parent: s7, text: 'Caption Medium (12px) — No. Rekam Medis: RM-2026-08892', x: 64, y: 444, fontSize: 12, color: '#64748B' });

// UI Component Library
b.createRect({ parent: s7, name: 'Components Box', x: 740, y: 240, width: 660, height: 400, fill: '#FFFFFF', radius: 14, stroke: '#E2E8F0' });
b.createText({ parent: s7, text: 'Button Variations & States', x: 764, y: 264, fontSize: 14, color: '#0F172A', fontWeight: 'bold' });

b.createRect({ parent: s7, name: 'Btn Primary', x: 764, y: 298, width: 130, height: 40, fill: '#012D68', radius: 8 });
b.createText({ parent: s7, text: 'Primary Button', x: 782, y: 310, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ parent: s7, name: 'Btn Sky', x: 910, y: 298, width: 130, height: 40, fill: '#0284C7', radius: 8 });
b.createText({ parent: s7, text: 'Sky Accent', x: 940, y: 310, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ parent: s7, name: 'Btn Outline', x: 1056, y: 298, width: 130, height: 40, fill: '#FFFFFF', radius: 8, stroke: '#012D68' });
b.createText({ parent: s7, text: 'Outline Btn', x: 1086, y: 310, fontSize: 12, color: '#012D68', fontWeight: 'bold' });

b.createRect({ parent: s7, name: 'Btn Danger', x: 1202, y: 298, width: 130, height: 40, fill: '#F43F5E', radius: 8 });
b.createText({ parent: s7, text: 'Danger Btn', x: 1234, y: 310, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });

// Badges
b.createText({ parent: s7, text: 'Status & Category Badges', x: 764, y: 370, fontSize: 14, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ parent: s7, name: 'Badge Green', x: 764, y: 400, width: 120, height: 28, fill: '#DCFCE7', radius: 14 });
b.createText({ parent: s7, text: '● Sedang Praktik', x: 780, y: 406, fontSize: 11, color: '#166534', fontWeight: 'bold' });

b.createRect({ parent: s7, name: 'Badge Amber', x: 900, y: 400, width: 120, height: 28, fill: '#FEF3C7', radius: 14 });
b.createText({ parent: s7, text: '⏳ Menunggu', x: 924, y: 406, fontSize: 11, color: '#92400E', fontWeight: 'bold' });

b.createRect({ parent: s7, name: 'Badge Red', x: 1036, y: 400, width: 130, height: 28, fill: '#FEE2E2', radius: 14 });
b.createText({ parent: s7, text: '⚠️ Alergi Obat', x: 1058, y: 406, fontSize: 11, color: '#991B1B', fontWeight: 'bold' });

// Write output JSON
const scriptPath = path.join(__dirname, 'pixel_perfect_cmds.json');
fs.writeFileSync(scriptPath, JSON.stringify(b.commands, null, 2));
console.log(`Script built with ${b.commands.length} commands! Saved to ${scriptPath}`);
