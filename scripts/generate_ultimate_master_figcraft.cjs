const fs = require('fs');
const path = require('path');

const screenshotsDir = 'C:\\laragon\\www\\KLINIK\\web_screenshots';

class MasterScriptBuilder {
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

const b = new MasterScriptBuilder();

console.log('Generating ULTIMATE complete master FigCraft document (12 comprehensive screens)...');

// =========================================================================
// ROW 1: PASIEN PORTAL & UTAMA (Y: 0)
// =========================================================================

// Frame 01: Pasien Beranda Utama
const f01 = b.createFrame({
  name: '01 - Pasien: Beranda Utama & Dashboard Antrean',
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f01,
  path: path.join(screenshotsDir, 'role_patient_home.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Beranda Pasien)'
});
const sb01 = b.createFrame({
  parent: f01,
  name: '🧭 Sidebar Navigasi Pasien',
  x: 0,
  y: 0,
  width: 240,
  height: 960,
  fill: '#FFFFFF',
  stroke: '#E2E8F0'
});
b.createText({ parent: sb01, text: '+ Gabe Medica', x: 24, y: 24, fontSize: 18, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: sb01, text: 'Portal Pasien', x: 24, y: 46, fontSize: 11, color: '#0284C7', fontWeight: 'bold' });
b.createRect({ parent: sb01, name: 'Active Nav Pill', x: 16, y: 96, width: 208, height: 40, fill: '#EFF6FF', radius: 10 });
b.createText({ parent: sb01, text: 'Beranda', x: 36, y: 107, fontSize: 13, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: sb01, text: 'Jadwal Dokter', x: 36, y: 155, fontSize: 13, color: '#475569' });
b.createText({ parent: sb01, text: 'Rekam Medis', x: 36, y: 203, fontSize: 13, color: '#475569' });

// Frame 02: Pendaftaran Sesi Konsultasi
const f02 = b.createFrame({
  name: '02 - Pasien: Form Pendaftaran Sesi Konsultasi Baru',
  x: 1540,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f02,
  path: path.join(screenshotsDir, 'pendaftaran_konsultasi.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Modal Pendaftaran Konsultasi)'
});
const m02 = b.createFrame({
  parent: f02,
  name: '📝 Modal Dialog Pendaftaran Konsultasi',
  x: 470,
  y: 260,
  width: 500,
  height: 440,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: m02, text: 'Buat Konsultasi Baru', x: 24, y: 24, fontSize: 18, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: m02, text: 'Pasien: Rina Anggraini (#GM-0214)', x: 24, y: 56, fontSize: 13, color: '#64748B' });
b.createRect({ parent: m02, name: 'Submit Pendaftaran', x: 24, y: 350, width: 452, height: 46, fill: '#012D68', radius: 10 });
b.createText({ parent: m02, text: 'Kirim Permintaan Konsultasi ➜', x: 150, y: 364, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });

// Frame 03: Booking Jadwal Konsultasi Dokter
const f03 = b.createFrame({
  name: '03 - Pasien: Booking Jadwal Konsultasi Dokter (Interaktif)',
  x: 3080,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f03,
  path: path.join(screenshotsDir, 'booking_modal_active.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Modal Booking Dokter & Anti-Bentrok)'
});
const m03 = b.createFrame({
  parent: f03,
  name: '📅 Modal Booking Jadwal & Anti-Bentrok',
  x: 470,
  y: 120,
  width: 500,
  height: 720,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: m03, text: 'Booking Jadwal Konsultasi Dokter', x: 24, y: 24, fontSize: 18, color: '#012D68', fontWeight: 'bold' });
b.createRect({ parent: m03, name: 'Conflict Box', x: 24, y: 240, width: 452, height: 50, fill: '#F0FDF4', radius: 8, stroke: '#BBF7D0' });
b.createText({ parent: m03, text: '✓ Slot Jadwal Tersedia (Bebas Bentrok)', x: 40, y: 256, fontSize: 11, color: '#166534', fontWeight: 'bold' });
b.createRect({ parent: m03, name: 'Confirm Booking Btn', x: 24, y: 640, width: 452, height: 46, fill: '#012D68', radius: 10 });
b.createText({ parent: m03, text: 'Konfirmasi Booking Jadwal Konsultasi', x: 130, y: 654, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });

// Frame 04: Rekam Medis Lengkap (Full EMR Overview)
const f04 = b.createFrame({
  name: '04 - Pasien: Rekam Medis Lengkap (Full EMR Overview)',
  x: 4620,
  y: 0,
  width: 1440,
  height: 1800,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f04,
  path: path.join(screenshotsDir, 'rekam_medis_full.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 1800,
  name: '📸 Live Web Viewport (Rekam Medis Lengkap 6 Tab)'
});
const p04 = b.createFrame({
  parent: f04,
  name: '👤 Identitas Pasien & Action Bar',
  x: 40,
  y: 88,
  width: 1360,
  height: 110,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: p04, text: 'Rina Anggraini (34 Tahun) — #GM-0214', x: 32, y: 28, fontSize: 20, color: '#0F172A', fontWeight: 'bold' });
b.createText({ parent: p04, text: 'NIK: 3171045206920003  •  Gol. Darah: B+  •  Alergi: Penisilin, Asam Mefenamat', x: 32, y: 62, fontSize: 13, color: '#64748B' });


// =========================================================================
// ROW 2: DETAIL TAB REKAM MEDIS KLINIS (Y: 1900)
// =========================================================================

// Frame 05: Tab Riwayat Medis
const f05 = b.createFrame({
  name: '05 - Pasien: Rekam Medis - Tab Riwayat Medis & Diagnosa',
  x: 0,
  y: 1900,
  width: 1440,
  height: 1400,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f05,
  path: path.join(screenshotsDir, 'rm_tab_history.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 1400,
  name: '📸 Live Web Viewport (Tab Riwayat Kunjungan)'
});
const h05 = b.createFrame({
  parent: f05,
  name: '📜 Riwayat Kunjungan Medis Pasien',
  x: 40,
  y: 88,
  width: 1360,
  height: 80,
  fill: '#FFFFFF',
  radius: 14,
  stroke: '#E2E8F0'
});
b.createText({ parent: h05, text: 'Timeline Riwayat Kunjungan & Diagnosa ICD-10 Pasien', x: 32, y: 28, fontSize: 18, color: '#012D68', fontWeight: 'bold' });

// Frame 06: Tab Resep & Obat-obatan
const f06 = b.createFrame({
  name: '06 - Pasien: Rekam Medis - Tab Resep Obat & Farmakologi',
  x: 1540,
  y: 1900,
  width: 1440,
  height: 1400,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f06,
  path: path.join(screenshotsDir, 'rm_tab_meds.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 1400,
  name: '📸 Live Web Viewport (Tab Resep Obat Aktif)'
});
const h06 = b.createFrame({
  parent: f06,
  name: '💊 Daftar Terapi Obat Pasien Berjalan',
  x: 40,
  y: 88,
  width: 1360,
  height: 80,
  fill: '#FFFFFF',
  radius: 14,
  stroke: '#E2E8F0'
});
b.createText({ parent: h06, text: 'Daftar Resep Obat Aktif & Aturan Pakai Farmakologi', x: 32, y: 28, fontSize: 18, color: '#012D68', fontWeight: 'bold' });

// Frame 07: Tab Dokumen & Lab
const f07 = b.createFrame({
  name: '07 - Pasien: Rekam Medis - Tab Dokumen & Hasil Lab',
  x: 3080,
  y: 1900,
  width: 1440,
  height: 1400,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f07,
  path: path.join(screenshotsDir, 'rm_tab_docs.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 1400,
  name: '📸 Live Web Viewport (Tab Dokumen & Hasil Lab)'
});
const h07 = b.createFrame({
  parent: f07,
  name: '📑 Dokumen & Hasil Pemeriksaan Penunjang',
  x: 40,
  y: 88,
  width: 1360,
  height: 80,
  fill: '#FFFFFF',
  radius: 14,
  stroke: '#E2E8F0'
});
b.createText({ parent: h07, text: 'Berkas Dokumen Medis, Hasil Laboratorium & EKG', x: 32, y: 28, fontSize: 18, color: '#012D68', fontWeight: 'bold' });


// =========================================================================
// ROW 3: PORTAL DOKTER LENGKAP (Y: 3400)
// =========================================================================

// Frame 08: Dokter SOAP Full Height
const f08 = b.createFrame({
  name: '08 - Dokter: Lembar Pemeriksaan SOAP Klinis & Antrean (Full Height)',
  x: 0,
  y: 3400,
  width: 1440,
  height: 1800,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f08,
  path: path.join(screenshotsDir, 'doctor_full.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 1800,
  name: '📸 Live Web Viewport (Portal Dokter - SOAP Full Height)'
});
const dTop = b.createFrame({
  parent: f08,
  name: '🩺 Topbar & Status Dokter Spesialis',
  x: 0,
  y: 0,
  width: 1440,
  height: 64,
  fill: '#012D68'
});
b.createText({ parent: dTop, text: '+ Gabe Medica', x: 32, y: 20, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ parent: dTop, text: 'Dr. Anaya Kapoor, Sp.S • 🟢 Sedang Praktik Aktif', x: 1100, y: 24, fontSize: 13, color: '#86EFAC', fontWeight: 'bold' });

// Frame 09: Dokter Tab Data Pasien Demografis & Riwayat
const f09 = b.createFrame({
  name: '09 - Dokter: Tab Data Demografis & Riwayat Pasien',
  x: 1540,
  y: 3400,
  width: 1440,
  height: 1400,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f09,
  path: path.join(screenshotsDir, 'doc_tab_patient.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 1400,
  name: '📸 Live Web Viewport (Dokter: Data Pasien & Riwayat)'
});
const dHeader09 = b.createFrame({
  parent: f09,
  name: '📋 Data Pasien & Rekam Terintegrasi',
  x: 420,
  y: 190,
  width: 996,
  height: 80,
  fill: '#FFFFFF',
  radius: 14,
  stroke: '#E2E8F0'
});
b.createText({ parent: dHeader09, text: 'Data Pasien Terintegrasi & Riwayat Diagnosa Dokter Lain', x: 32, y: 28, fontSize: 18, color: '#012D68', fontWeight: 'bold' });


// =========================================================================
// ROW 4: ADMINISTRATOR, AUTENTIKASI & DESIGN SYSTEM (Y: 4900)
// =========================================================================

// Frame 10: Administrator Dashboard & Kalender
const f10 = b.createFrame({
  name: '10 - Admin: Manajemen Jadwal Dokter & Antrean Poli',
  x: 0,
  y: 4900,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: f10,
  path: path.join(screenshotsDir, 'role_admin_dashboard.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Portal Administrator)'
});
const aTop = b.createFrame({
  parent: f10,
  name: '⚙️ Topbar Administrator',
  x: 0,
  y: 0,
  width: 1440,
  height: 64,
  fill: '#6B21A8'
});
b.createText({ parent: aTop, text: '+ Gabe Medica — Portal Administrator', x: 32, y: 20, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ parent: aTop, text: 'Amélie Laurent (Admin Utama)', x: 1180, y: 24, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });

// Frame 11: Autentikasi Login Portal
const f11 = b.createFrame({
  name: '11 - Auth: Halaman Login Portal (Multi-Role Switcher)',
  x: 1540,
  y: 4900,
  width: 1440,
  height: 960,
  fill: '#F3F6F9'
});
b.placeImage({
  parent: f11,
  path: path.join(screenshotsDir, 'role_auth_login.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Login Multi-Role)'
});
const lCard = b.createFrame({
  parent: f11,
  name: '🔐 Form Login Card Container',
  x: 860,
  y: 140,
  width: 440,
  height: 680,
  fill: '#FFFFFF',
  radius: 24,
  stroke: '#E2E8F0'
});
b.createText({ parent: lCard, text: 'Masuk ke Portal Layanan', x: 40, y: 40, fontSize: 22, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ parent: lCard, name: 'Submit Login Btn', x: 40, y: 336, width: 360, height: 48, fill: '#012D68', radius: 10 });
b.createText({ parent: lCard, text: 'Masuk ke Layanan ➜', x: 140, y: 350, fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' });

// Frame 12: Design System & UI Kit Tokens
const f12 = b.createFrame({
  name: '12 - System: Gabe Medica UI Design System & Tokens',
  x: 3080,
  y: 4900,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
const dsHeader = b.createFrame({
  parent: f12,
  name: '🎨 Header Design Tokens',
  x: 0,
  y: 0,
  width: 1440,
  height: 72,
  fill: '#012D68'
});
b.createText({ parent: dsHeader, text: 'Gabe Medica — UI Design System & UI Tokens Master', x: 40, y: 24, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });

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
  b.createRect({ parent: f12, name: `Color ${c.name}`, x: c.x, y: 110, width: 150, height: 90, fill: c.hex, radius: 10, stroke: '#CBD5E1' });
  b.createText({ parent: f12, text: c.name, x: c.x + 12, y: 126, fontSize: 12, color: c.textCol, fontWeight: 'bold' });
  b.createText({ parent: f12, text: c.hex, x: c.x + 12, y: 168, fontSize: 11, color: c.textCol });
});

// Save script
const outScript = path.join(__dirname, 'ultimate_master_cmds.json');
fs.writeFileSync(outScript, JSON.stringify(b.commands, null, 2));
console.log(`Ultimate Master Script built with ${b.commands.length} commands across 12 screens! Saved to ${outScript}`);
