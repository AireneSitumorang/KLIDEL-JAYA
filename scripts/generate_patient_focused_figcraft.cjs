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

console.log('Generating complete FigCraft document with full-height doctor portal...');

// =========================================================================
// 1. PENDAFTARAN SESI KONSULTASI PASIEN (0, 0)
// =========================================================================
const fPendaftaran = b.createFrame({
  name: '[PASIEN] 01 - Pendaftaran Sesi Konsultasi Baru',
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fPendaftaran,
  path: path.join(screenshotsDir, 'pendaftaran_konsultasi.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Modal Pendaftaran Aktif)'
});
const mPendaftaran = b.createFrame({
  parent: fPendaftaran,
  name: '📝 Modal Dialog Pendaftaran Konsultasi',
  x: 470,
  y: 260,
  width: 500,
  height: 440,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: mPendaftaran, text: 'Buat Konsultasi Baru', x: 24, y: 24, fontSize: 18, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: mPendaftaran, text: 'Pasien: Rina Anggraini (#GM-0214)', x: 24, y: 56, fontSize: 13, color: '#64748B' });
b.createRect({ parent: mPendaftaran, name: 'Input Keluhan Box', x: 24, y: 100, width: 452, height: 80, fill: '#F8FAFC', radius: 10, stroke: '#CBD5E1' });
b.createText({ parent: mPendaftaran, text: 'Contoh: Keluhan flu, batuk, migrain, atau konsultasi dokter...', x: 38, y: 116, fontSize: 12, color: '#94A3B8' });
b.createRect({ parent: mPendaftaran, name: 'Submit Pendaftaran Btn', x: 24, y: 350, width: 452, height: 46, fill: '#012D68', radius: 10 });
b.createText({ parent: mPendaftaran, text: 'Kirim Permintaan Konsultasi ➜', x: 150, y: 364, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });


// =========================================================================
// 2. BOOKING JADWAL KONSULTASI DOKTER (1540, 0)
// =========================================================================
const fBooking = b.createFrame({
  name: '[PASIEN] 02 - Booking Jadwal Konsultasi Dokter (Interaktif)',
  x: 1540,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fBooking,
  path: path.join(screenshotsDir, 'booking_modal_active.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Modal Booking Aktif)'
});
const mBooking = b.createFrame({
  parent: fBooking,
  name: '📅 Modal Booking Jadwal Dokter',
  x: 470,
  y: 120,
  width: 500,
  height: 720,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: mBooking, text: 'Booking Jadwal Konsultasi Dokter', x: 24, y: 24, fontSize: 18, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: mBooking, text: 'Pilih Dokter Spesialis:', x: 24, y: 70, fontSize: 12, color: '#334155', fontWeight: 'bold' });
b.createRect({ parent: mBooking, name: 'Select Doctor Box', x: 24, y: 92, width: 452, height: 44, fill: '#F8FAFC', radius: 8, stroke: '#CBD5E1' });
b.createText({ parent: mBooking, text: 'Dr. Saran Mitchell — Spesialis Tulang (Orthopedist)', x: 38, y: 106, fontSize: 12, color: '#0F172A', fontWeight: 'bold' });

b.createText({ parent: mBooking, text: 'Tanggal & Jam Praktik:', x: 24, y: 156, fontSize: 12, color: '#334155', fontWeight: 'bold' });
b.createRect({ parent: mBooking, name: 'Date Box', x: 24, y: 178, width: 220, height: 44, fill: '#F8FAFC', radius: 8, stroke: '#CBD5E1' });
b.createText({ parent: mBooking, text: '📅 2026-11-10', x: 38, y: 192, fontSize: 12, color: '#0F172A' });
b.createRect({ parent: mBooking, name: 'Hour Box', x: 256, y: 178, width: 220, height: 44, fill: '#F8FAFC', radius: 8, stroke: '#CBD5E1' });
b.createText({ parent: mBooking, text: '🕒 02:00 PM - 03:00 PM', x: 270, y: 192, fontSize: 12, color: '#0F172A' });

b.createRect({ parent: mBooking, name: 'Conflict Detection Box', x: 24, y: 240, width: 452, height: 50, fill: '#F0FDF4', radius: 8, stroke: '#BBF7D0' });
b.createText({ parent: mBooking, text: '✓ Slot Jadwal Tersedia (Tidak Bentrok dengan Pasien Lain)', x: 40, y: 256, fontSize: 11, color: '#166534', fontWeight: 'bold' });

b.createRect({ parent: mBooking, name: 'Submit Booking Btn', x: 24, y: 640, width: 452, height: 46, fill: '#012D68', radius: 10 });
b.createText({ parent: mBooking, text: 'Konfirmasi Booking Jadwal Konsultasi', x: 130, y: 654, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });


// =========================================================================
// 3. BAGIAN REKAM MEDIS PASIEN LENGKAP (FULL EMR 1440 x 1800) (3080, 0)
// =========================================================================
const fRekamMedisFull = b.createFrame({
  name: '[PASIEN] 03 - Bagian Rekam Medis Pasien Lengkap (Full EMR)',
  x: 3080,
  y: 0,
  width: 1440,
  height: 1800,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fRekamMedisFull,
  path: path.join(screenshotsDir, 'rekam_medis_full.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 1800,
  name: '📸 Live Web Viewport (Seluruh 6 Tab & Data Medis Lengkap)'
});
const rmHeader = b.createFrame({
  parent: fRekamMedisFull,
  name: '👤 Identitas Pasien Lengkap & Aksi',
  x: 40,
  y: 88,
  width: 1360,
  height: 110,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: rmHeader, text: 'Rina Anggraini (34 Tahun) — #GM-0214', x: 32, y: 28, fontSize: 20, color: '#0F172A', fontWeight: 'bold' });
b.createText({ parent: rmHeader, text: 'NIK: 3171045206920003  •  Gol. Darah: B+  •  Alamat: Jl. Senopati No. 42, Jakarta Selatan', x: 32, y: 62, fontSize: 13, color: '#64748B' });
b.createRect({ parent: rmHeader, name: 'Btn Buat Konsultasi', x: 1160, y: 28, width: 170, height: 42, fill: '#012D68', radius: 10 });
b.createText({ parent: rmHeader, text: '+ Buat Konsultasi', x: 1196, y: 40, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });

const rmTabs = b.createFrame({
  parent: fRekamMedisFull,
  name: '📑 6 Tab Navigasi Rekam Medis',
  x: 40,
  y: 218,
  width: 1360,
  height: 52,
  fill: '#FFFFFF',
  radius: 12,
  stroke: '#E2E8F0'
});
b.createText({ parent: rmTabs, text: '1. Ringkasan (Overview)', x: 24, y: 18, fontSize: 13, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: rmTabs, text: '2. Riwayat Medis', x: 230, y: 18, fontSize: 13, color: '#475569' });
b.createText({ parent: rmTabs, text: '3. Alergi Pasien (⚠️ Penisilin)', x: 410, y: 18, fontSize: 13, color: '#DC2626', fontWeight: 'bold' });
b.createText({ parent: rmTabs, text: '4. Obat-obatan', x: 670, y: 18, fontSize: 13, color: '#475569' });
b.createText({ parent: rmTabs, text: '5. Dokumen & Lab', x: 860, y: 18, fontSize: 13, color: '#475569' });
b.createText({ parent: rmTabs, text: '6. Catatan Dokter', x: 1070, y: 18, fontSize: 13, color: '#475569' });


// =========================================================================
// 4. PORTAL DOKTER - FULL PANJANG & LENGKAP (1440 x 1800) (0, 1900)
// =========================================================================
const fDocFull = b.createFrame({
  name: '[DOKTER] 04 - Portal Dokter Lengkap (Antrean & Lembar SOAP Full Height)',
  x: 0,
  y: 1900,
  width: 1440,
  height: 1800,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fDocFull,
  path: path.join(screenshotsDir, 'doctor_full.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 1800,
  name: '📸 Live Web Viewport (Portal Dokter - Full Panjang & Lengkap)'
});

// Structured Component Group: Topbar Dokter
const dTopFull = b.createFrame({
  parent: fDocFull,
  name: '🩺 Topbar & Status Praktik Dokter',
  x: 0,
  y: 0,
  width: 1440,
  height: 64,
  fill: '#012D68'
});
b.createText({ parent: dTopFull, text: '+ Gabe Medica', x: 32, y: 20, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createRect({ parent: dTopFull, name: 'Badge Dokter', x: 170, y: 18, width: 140, height: 26, fill: '#083E88', radius: 13 });
b.createText({ parent: dTopFull, text: 'PORTAL DOKTER SPESIALIS', x: 180, y: 24, fontSize: 10, color: '#93C5FD', fontWeight: 'bold' });
b.createText({ parent: dTopFull, text: 'Dr. Anaya Kapoor, Sp.S • 🟢 Sedang Praktik Aktif', x: 1100, y: 24, fontSize: 13, color: '#86EFAC', fontWeight: 'bold' });

// Stat Counters
const dStats = b.createFrame({
  parent: fDocFull,
  name: '📊 Indikator Antrean & Statistik Harian',
  x: 24,
  y: 84,
  width: 1392,
  height: 84,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: dStats, text: 'Pasien Diperiksa: 1', x: 32, y: 32, fontSize: 14, color: '#012D68', fontWeight: 'bold' });
b.createText({ parent: dStats, text: 'Menunggu: 3', x: 280, y: 32, fontSize: 14, color: '#D97706', fontWeight: 'bold' });
b.createText({ parent: dStats, text: 'Selesai Hari Ini: 14', x: 500, y: 32, fontSize: 14, color: '#16A34A', fontWeight: 'bold' });
b.createText({ parent: dStats, text: 'Total Kuota Pasien: 24', x: 740, y: 32, fontSize: 14, color: '#475569', fontWeight: 'bold' });

// Clinical SOAP & Queue Containers
const dSoapFull = b.createFrame({
  parent: fDocFull,
  name: '📋 Lembar Pemeriksaan SOAP Lengkap & Resep',
  x: 420,
  y: 190,
  width: 996,
  height: 1560,
  fill: '#FFFFFF',
  radius: 16,
  stroke: '#E2E8F0'
});
b.createText({ parent: dSoapFull, text: 'Ny. Rina Anggraini (34 Th) — Keluhan: Sakit Kepala Berdenyut Unilateral', x: 32, y: 28, fontSize: 18, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ parent: dSoapFull, name: 'Allergy Pill', x: 810, y: 24, width: 160, height: 32, fill: '#FEE2E2', radius: 8 });
b.createText({ parent: dSoapFull, text: '⚠️ Alergi: Penisilin', x: 826, y: 32, fontSize: 12, color: '#991B1B', fontWeight: 'bold' });

b.createRect({ parent: dSoapFull, name: 'Submit SOAP Btn Full', x: 32, y: 1480, width: 340, height: 50, fill: '#012D68', radius: 12 });
b.createText({ parent: dSoapFull, text: '✓ Simpan Rekam Medis SOAP & Selesaikan Sesi', x: 50, y: 1496, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });


// =========================================================================
// 5. PORTAL ADMINISTRATOR (1540, 1900)
// =========================================================================
const fAdm = b.createFrame({
  name: '[ADMIN] 05 - Portal Administrator (Kalender & Operasional)',
  x: 1540,
  y: 1900,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});
b.placeImage({
  parent: fAdm,
  path: path.join(screenshotsDir, 'role_admin_dashboard.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Portal Admin)'
});


// =========================================================================
// 6. HALAMAN LOGIN PORTAL (3080, 1900)
// =========================================================================
const fLog = b.createFrame({
  name: '[AUTH] 06 - Halaman Login Portal (Multi-Role Switcher)',
  x: 3080,
  y: 1900,
  width: 1440,
  height: 960,
  fill: '#F3F6F9'
});
b.placeImage({
  parent: fLog,
  path: path.join(screenshotsDir, 'role_auth_login.png'),
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  name: '📸 Live Web Viewport (Login Portal)'
});


// =========================================================================
// 7. GABE MEDICA UI TOKENS (4620, 1900)
// =========================================================================
const fTokens = b.createFrame({
  name: '[SYSTEM] 07 - Gabe Medica UI Design System & Tokens',
  x: 4620,
  y: 1900,
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
b.createText({ parent: dsHeader, text: 'Gabe Medica — UI Design System & Tokens', x: 40, y: 24, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });

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
const outScript = path.join(__dirname, 'doctor_full_cmds.json');
fs.writeFileSync(outScript, JSON.stringify(b.commands, null, 2));
console.log(`Script built with ${b.commands.length} commands! Saved to ${outScript}`);
