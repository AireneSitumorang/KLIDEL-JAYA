const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Helper to convert hex to FigCraft RGB (0..1)
function hexToColor(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: ((num >> 16) & 255) / 255,
    g: ((num >> 8) & 255) / 255,
    b: (num & 255) / 255,
    a: 1.0
  };
}

function solidFill(hex, opacity = 1.0) {
  return [{
    type: 'solid',
    color: hexToColor(hex),
    opacity: opacity,
    visible: true,
    blend: 'normal'
  }];
}

function solidStroke(hex, opacity = 1.0) {
  return [{
    type: 'solid',
    color: hexToColor(hex),
    opacity: opacity,
    visible: true,
    blend: 'normal'
  }];
}

class FigCraftBuilder {
  constructor(name = 'Klinik Maristella - Master UI') {
    this.name = name;
    this.nextId = 2;
    this.nodes = {};
    this.pageId = 1;
    this.nodes['1'] = {
      id: 1,
      type: 'page',
      name: 'Klinik Maristella',
      width: 0.0,
      height: 0.0,
      children: [],
      background: hexToColor('#0F172A'),
      flows: [],
      prototype: {
        device: 'None',
        rotation: 'portrait',
        background: { r: 0.08, g: 0.12, b: 0.2, a: 1.0 }
      }
    };
  }

  createFrame(opts) {
    const id = this.nextId++;
    const parentId = opts.parent || this.pageId;
    const node = {
      id: id,
      parent: parentId,
      type: 'frame',
      name: opts.name || `Frame ${id}`,
      width: opts.width || 400.0,
      height: opts.height || 300.0,
      clip: opts.clip !== undefined ? opts.clip : true,
      transform: [1.0, 0.0, 0.0, 1.0, opts.x || 0.0, opts.y || 0.0],
      fills: opts.fill ? solidFill(opts.fill, opts.opacity !== undefined ? opts.opacity : 1.0) : (opts.fills || solidFill('#FFFFFF')),
      children: []
    };

    if (opts.stroke) {
      node.strokes = solidStroke(opts.stroke);
      node.stroke_weight = opts.strokeWeight || 1.0;
    }

    if (opts.radius) {
      const r = Number(opts.radius);
      node.corners = { radii: [r, r, r, r], smoothing: 0.0 };
    }

    this.nodes[id] = node;
    if (this.nodes[parentId]) {
      this.nodes[parentId].children.push(id);
    }
    return id;
  }

  createRect(opts) {
    const id = this.nextId++;
    const parentId = opts.parent || this.pageId;
    const node = {
      id: id,
      parent: parentId,
      type: 'rectangle',
      name: opts.name || `Rectangle ${id}`,
      width: opts.width || 100.0,
      height: opts.height || 100.0,
      transform: [1.0, 0.0, 0.0, 1.0, opts.x || 0.0, opts.y || 0.0],
      fills: opts.fill ? solidFill(opts.fill, opts.opacity !== undefined ? opts.opacity : 1.0) : (opts.fills || solidFill('#EFF6FF')),
      blend: 'normal'
    };

    if (opts.stroke) {
      node.strokes = solidStroke(opts.stroke);
      node.stroke_weight = opts.strokeWeight || 1.0;
    }

    if (opts.radius) {
      const r = Number(opts.radius);
      node.corners = { radii: [r, r, r, r], smoothing: 0.0 };
    }

    this.nodes[id] = node;
    if (this.nodes[parentId]) {
      this.nodes[parentId].children.push(id);
    }
    return id;
  }

  createEllipse(opts) {
    const id = this.nextId++;
    const parentId = opts.parent || this.pageId;
    const node = {
      id: id,
      parent: parentId,
      type: 'ellipse',
      name: opts.name || `Ellipse ${id}`,
      width: opts.width || 48.0,
      height: opts.height || 48.0,
      transform: [1.0, 0.0, 0.0, 1.0, opts.x || 0.0, opts.y || 0.0],
      fills: opts.fill ? solidFill(opts.fill, opts.opacity !== undefined ? opts.opacity : 1.0) : (opts.fills || solidFill('#006383')),
      inner: 0.0,
      start: 0.0,
      sweep: 6.283185307179586,
      blend: 'normal'
    };

    if (opts.stroke) {
      node.strokes = solidStroke(opts.stroke);
    }

    this.nodes[id] = node;
    if (this.nodes[parentId]) {
      this.nodes[parentId].children.push(id);
    }
    return id;
  }

  createText(opts) {
    const id = this.nextId++;
    const parentId = opts.parent || this.pageId;
    const text = String(opts.text || 'Text');
    const fontSize = opts.fontSize || 14.0;
    const approxWidth = opts.width || Math.max(20, Math.min(text.length * (fontSize * 0.62), 1200));
    const approxHeight = opts.height || (fontSize * 1.35);

    const node = {
      id: id,
      parent: parentId,
      type: 'text',
      name: opts.name || text.slice(0, 32),
      characters: text,
      width: approxWidth,
      height: approxHeight,
      transform: [1.0, 0.0, 0.0, 1.0, opts.x || 0.0, opts.y || 0.0],
      fills: opts.color ? solidFill(opts.color) : solidFill('#0F172A'),
      style: {
        font_family: opts.fontFamily || 'Inter',
        font_size: fontSize,
        font_style: opts.fontWeight === 'bold' ? 'Bold' : (opts.fontWeight === 'medium' ? 'Medium' : 'Regular'),
        line_height: { unit: 'auto' },
        letter_spacing: { unit: 'percent', value: 0.0 },
        case: 'original',
        decoration: 'none',
        link: null,
        fills: null
      },
      child_layout: {
        absolute: false,
        grid_column: null,
        grid_column_span: 0,
        grid_row: null,
        grid_row_span: 0,
        max_h: null,
        max_w: null,
        min_h: null,
        min_w: null,
        sizing_h: 'hug',
        sizing_v: 'hug'
      },
      blend: 'normal'
    };

    this.nodes[id] = node;
    if (this.nodes[parentId]) {
      this.nodes[parentId].children.push(id);
    }
    return id;
  }

  buildDocument() {
    return {
      format: 'figcraft',
      version: 1,
      name: this.name,
      current_page: 1,
      pages: [1],
      document_colors: [],
      comments: [],
      imageIndex: [],
      styles: [],
      variables: {
        collections: [],
        variables: []
      },
      next_id: this.nextId,
      nodes: this.nodes
    };
  }
}

// -------------------------------------------------------------------------------------------------
// INITIALIZE BUILDER
// -------------------------------------------------------------------------------------------------
const b = new FigCraftBuilder('Klinik Maristella - Master UI Design System & Mockups');

// Brand Colors
const NAVY = '#012D68';
const TEAL = '#006383';
const CYAN = '#00A8B5';
const TINT = '#EFF6FF';
const SURFACE = '#FFFFFF';
const BG_PAGE = '#F8FAFC';
const TEXT_MAIN = '#0F172A';
const TEXT_MUTED = '#64748B';
const BORDER = '#E2E8F0';
const SUCCESS = '#10B981';
const WARNING = '#F59E0B';
const DANGER = '#F43F5E';

// Helper: Common Sidebar
function buildSidebar(screenId, activeLabel = 'Beranda') {
  // Sidebar Container
  b.createRect({ name: 'Sidebar BG', parent: screenId, x: 0, y: 0, width: 240, height: 960, fill: '#FFFFFF', stroke: BORDER });

  // Sidebar Logo Klinik Maristella
  b.createRect({ name: 'Logo Cross Base', parent: screenId, x: 24, y: 24, width: 36, height: 36, fill: TINT, radius: 8, stroke: CYAN });
  b.createText({ text: '✚', parent: screenId, x: 34, y: 28, fontSize: 18, color: TEAL, fontWeight: 'bold' });
  b.createText({ text: 'Klinik Maristella', parent: screenId, x: 68, y: 26, fontSize: 16, color: TEAL, fontWeight: 'bold' });
  b.createText({ text: 'Layanan Kesehatan Modern', parent: screenId, x: 68, y: 46, fontSize: 10, color: TEXT_MUTED });

  // Sidebar Menu Items
  const items = [
    { label: 'Beranda', y: 100 },
    { label: 'Jadwal Dokter', y: 148 },
    { label: 'Rekam Medis', y: 196 },
    { label: 'Pengaturan', y: 244 },
    { label: 'Portal Dokter', y: 310, isDoctor: true },
    { label: 'Portal Admin', y: 358, isAdmin: true }
  ];

  items.forEach(item => {
    const isActive = item.label === activeLabel;
    if (isActive) {
      b.createRect({ name: `Nav Pill ${item.label}`, parent: screenId, x: 16, y: item.y, width: 208, height: 40, fill: TINT, radius: 10 });
      b.createRect({ name: 'Active Indicator', parent: screenId, x: 16, y: item.y + 8, width: 4, height: 24, fill: TEAL, radius: 2 });
      b.createText({ text: item.label, parent: screenId, x: 36, y: item.y + 11, fontSize: 14, color: TEAL, fontWeight: 'bold' });
    } else if (item.isDoctor) {
      b.createRect({ name: 'Doctor Pill', parent: screenId, x: 16, y: item.y, width: 208, height: 40, fill: '#F0FDF4', radius: 10, stroke: '#BBF7D0' });
      b.createText({ text: '👨‍⚕️ ' + item.label, parent: screenId, x: 28, y: item.y + 11, fontSize: 13, color: '#166534', fontWeight: 'bold' });
    } else if (item.isAdmin) {
      b.createRect({ name: 'Admin Pill', parent: screenId, x: 16, y: item.y, width: 208, height: 40, fill: '#FAF5FF', radius: 10, stroke: '#E9D5FF' });
      b.createText({ text: '⚙️ ' + item.label, parent: screenId, x: 28, y: item.y + 11, fontSize: 13, color: '#7E22CE', fontWeight: 'bold' });
    } else {
      b.createText({ text: item.label, parent: screenId, x: 36, y: item.y + 11, fontSize: 14, color: '#475569' });
    }
  });

  // Sidebar User Profile Card
  b.createRect({ name: 'Sidebar User Card', parent: screenId, x: 16, y: 880, width: 208, height: 60, fill: BG_PAGE, radius: 12, stroke: BORDER });
  b.createEllipse({ name: 'User Avatar', parent: screenId, x: 28, y: 890, width: 38, height: 38, fill: TEAL });
  b.createText({ text: 'BP', parent: screenId, x: 38, y: 900, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });
  b.createText({ text: 'Budi Prasetyo', parent: screenId, x: 74, y: 894, fontSize: 13, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: 'Pasien Terdaftar', parent: screenId, x: 74, y: 912, fontSize: 11, color: TEXT_MUTED });
}

// Helper: Common Topbar
function buildTopbar(screenId, titleText = '') {
  b.createRect({ name: 'Topbar BG', parent: screenId, x: 240, y: 0, width: 1200, height: 72, fill: '#FFFFFF', stroke: BORDER });
  if (titleText) {
    b.createText({ text: titleText, parent: screenId, x: 272, y: 24, fontSize: 18, color: TEAL, fontWeight: 'bold' });
  } else {
    b.createRect({ name: 'Search Input', parent: screenId, x: 272, y: 16, width: 440, height: 42, fill: BG_PAGE, radius: 21, stroke: BORDER });
    b.createText({ text: '🔍 Cari dokter spesialis, jadwal poli, atau layanan...', parent: screenId, x: 294, y: 28, fontSize: 13, color: '#94A3B8' });
  }

  // Right Topbar Controls
  b.createEllipse({ name: 'Theme Toggle', parent: screenId, x: 1310, y: 18, width: 36, height: 36, fill: '#F1F5F9' });
  b.createText({ text: '🌙', parent: screenId, x: 1320, y: 26, fontSize: 14 });
  b.createEllipse({ name: 'Bell Notif', parent: screenId, x: 1360, y: 18, width: 36, height: 36, fill: '#F1F5F9' });
  b.createText({ text: '🔔', parent: screenId, x: 1370, y: 26, fontSize: 14 });
  b.createEllipse({ name: 'Red Dot Notif', parent: screenId, x: 1386, y: 20, width: 8, height: 8, fill: DANGER });
}

// =================================================================================================
// 01 - PASIEN: BERANDA UTAMA & DASHBOARD ANTREAN (x: 0, y: 0)
// =================================================================================================
const s1 = b.createFrame({ name: '01 - Pasien: Beranda Utama & Dashboard Antrean', x: 0, y: 0, width: 1440, height: 960, fill: BG_PAGE });
buildSidebar(s1, 'Beranda');
buildTopbar(s1);

// Hero Banner Klinik Maristella
b.createRect({ name: 'Hero Banner Card', parent: s1, x: 272, y: 96, width: 780, height: 180, fill: TEAL, radius: 20 });
b.createEllipse({ name: 'Decor Sphere 1', parent: s1, x: 920, y: 80, width: 140, height: 140, fill: CYAN, opacity: 0.2 });
b.createText({ text: 'Selamat Datang di Klinik Maristella', parent: s1, x: 304, y: 126, fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Pelayanan kesehatan keluarga modern, cepat, dan terpercaya dengan dokter spesialis berpengalaman.', parent: s1, x: 304, y: 166, fontSize: 13, color: '#E0F2FE' });
b.createRect({ name: 'CTA Buat Janji', parent: s1, x: 304, y: 204, width: 220, height: 42, fill: '#FFFFFF', radius: 10 });
b.createText({ text: '+ Pendaftaran Konsultasi Baru ➜', parent: s1, x: 320, y: 216, fontSize: 12, color: TEAL, fontWeight: 'bold' });

// Active Queue Card
b.createRect({ name: 'Queue Card', parent: s1, x: 272, y: 296, width: 780, height: 130, fill: '#FFFFFF', radius: 16, stroke: BORDER });
b.createRect({ name: 'Queue Stripe', parent: s1, x: 272, y: 296, width: 8, height: 130, fill: CYAN, radius: 8 });
b.createText({ text: 'STATUS ANTREAN AKTIF HARI INI', parent: s1, x: 304, y: 316, fontSize: 11, color: TEXT_MUTED, fontWeight: 'bold' });
b.createText({ text: 'Poli Penyakit Dalam — dr. Sarah Jenkins, Sp.PD', parent: s1, x: 304, y: 340, fontSize: 16, color: TEXT_MAIN, fontWeight: 'bold' });
b.createText({ text: 'Perkiraan Panggilan: 10:15 WIB (Sisa 2 Pasien lagi)', parent: s1, x: 304, y: 374, fontSize: 13, color: '#475569' });
b.createRect({ name: 'Status Pill Menunggu', parent: s1, x: 304, y: 396, width: 120, height: 22, fill: '#FEF3C7', radius: 6 });
b.createText({ text: '● Menunggu Giliran', parent: s1, x: 316, y: 400, fontSize: 10, color: '#92400E', fontWeight: 'bold' });

b.createRect({ name: 'Queue Num Box', parent: s1, x: 910, y: 316, width: 118, height: 86, fill: TINT, radius: 12, stroke: '#BFDBFE' });
b.createText({ text: 'NO ANTREAN', parent: s1, x: 932, y: 328, fontSize: 10, color: TEAL, fontWeight: 'bold' });
b.createText({ text: 'A-014', parent: s1, x: 928, y: 348, fontSize: 32, color: TEAL, fontWeight: 'bold' });

// Quick Action Grid (4 Cards)
const quickActions = [
  { title: 'Pendaftaran Poli', subtitle: 'Pilih poli & jadwal dokter', icon: '📝', x: 272 },
  { title: 'Jadwal Dokter', subtitle: 'Lihat kalender praktik', icon: '📅', x: 472 },
  { title: 'Rekam Medis', subtitle: 'Riwayat diagnosa & resep', icon: '📋', x: 672 },
  { title: 'Kontak Darurat', subtitle: 'Unit ambulans 24 jam', icon: '🚑', x: 872 }
];

quickActions.forEach(qa => {
  b.createRect({ name: `Quick Card ${qa.title}`, parent: s1, x: qa.x, y: 446, width: 180, height: 110, fill: '#FFFFFF', radius: 14, stroke: BORDER });
  b.createEllipse({ name: 'Icon BG', parent: s1, x: qa.x + 16, y: 462, width: 36, height: 36, fill: TINT });
  b.createText({ text: qa.icon, parent: s1, x: qa.x + 24, y: 470, fontSize: 16 });
  b.createText({ text: qa.title, parent: s1, x: qa.x + 16, y: 508, fontSize: 13, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: qa.subtitle, parent: s1, x: qa.x + 16, y: 526, fontSize: 10, color: TEXT_MUTED });
});

// Doctors On Duty Section
b.createText({ text: 'Dokter Praktik Hari Ini di Klinik Maristella', parent: s1, x: 272, y: 580, fontSize: 18, color: TEXT_MAIN, fontWeight: 'bold' });

const doctors = [
  { name: 'dr. Sarah Jenkins, Sp.PD', spec: 'Poli Penyakit Dalam', time: '08:00 - 14:00 WIB', rating: '⭐ 4.9', x: 272 },
  { name: 'dr. Budi Santoso, Sp.A', spec: 'Poli Anak & Tumbuh Kembang', time: '13:00 - 18:00 WIB', rating: '⭐ 4.8', x: 532 },
  { name: 'dr. Maya Anggraini, Sp.KG', spec: 'Poli Gigi & Mulut', time: '16:00 - 20:00 WIB', rating: '⭐ 5.0', x: 792 }
];

doctors.forEach(doc => {
  b.createRect({ name: `Doctor Card ${doc.name}`, parent: s1, x: doc.x, y: 610, width: 246, height: 170, fill: '#FFFFFF', radius: 14, stroke: BORDER });
  b.createEllipse({ name: 'Doc Avatar', parent: s1, x: doc.x + 16, y: 626, width: 44, height: 44, fill: TEAL });
  b.createText({ text: '🩺', parent: s1, x: doc.x + 28, y: 636, fontSize: 18 });
  b.createText({ text: doc.name, parent: s1, x: doc.x + 16, y: 680, fontSize: 13, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: doc.spec, parent: s1, x: doc.x + 16, y: 700, fontSize: 11, color: CYAN });
  b.createText({ text: '🕒 ' + doc.time, parent: s1, x: doc.x + 16, y: 722, fontSize: 11, color: TEXT_MUTED });
  b.createRect({ name: 'Booking Small Button', parent: s1, x: doc.x + 16, y: 742, width: 214, height: 26, fill: TINT, radius: 6 });
  b.createText({ text: 'Daftar Konsultasi', parent: s1, x: doc.x + 72, y: 748, fontSize: 11, color: TEAL, fontWeight: 'bold' });
});

// Right Panel (Mini Calendar & Emergency)
b.createRect({ name: 'Right Panel BG', parent: s1, x: 1080, y: 96, width: 336, height: 830, fill: '#FFFFFF', radius: 16, stroke: BORDER });
b.createText({ text: 'Kalender Medis Pasien', parent: s1, x: 1104, y: 120, fontSize: 16, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Mini Cal Box', parent: s1, x: 1104, y: 150, width: 288, height: 180, fill: BG_PAGE, radius: 12, stroke: BORDER });
b.createText({ text: 'November 2026', parent: s1, x: 1190, y: 166, fontSize: 14, color: TEAL, fontWeight: 'bold' });
b.createText({ text: 'Min   Sen   Sel   Rab   Kam   Jum   Sab', parent: s1, x: 1118, y: 196, fontSize: 11, color: '#94A3B8' });
b.createText({ text: ' 1     2     3     4     5     6     7', parent: s1, x: 1118, y: 224, fontSize: 11, color: TEXT_MUTED });
b.createText({ text: ' 8    [9]   10    11    12    13    14', parent: s1, x: 1118, y: 252, fontSize: 11, color: TEAL, fontWeight: 'bold' });

b.createText({ text: 'Janji Temu Mendatang', parent: s1, x: 1104, y: 350, fontSize: 14, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Appointment Card', parent: s1, x: 1104, y: 376, width: 288, height: 80, fill: TINT, radius: 12, stroke: '#BFDBFE' });
b.createText({ text: 'Konsultasi Rutin Poli Internis', parent: s1, x: 1120, y: 390, fontSize: 12, color: TEAL, fontWeight: 'bold' });
b.createText({ text: 'dr. Sarah Jenkins • Poli Penyakit Dalam', parent: s1, x: 1120, y: 408, fontSize: 11, color: '#475569' });
b.createText({ text: '📅 Selasa, 10 Nov 2026 • 10:00 WIB', parent: s1, x: 1120, y: 426, fontSize: 11, color: CYAN });

// Emergency Hotline Box
b.createRect({ name: 'Emergency Card', parent: s1, x: 1104, y: 720, width: 288, height: 180, fill: '#FFF1F2', radius: 14, stroke: '#FECDD3' });
b.createText({ text: '🚨 Layanan Gawat Darurat', parent: s1, x: 1120, y: 742, fontSize: 14, color: '#E11D48', fontWeight: 'bold' });
b.createText({ text: 'UGD dan Ambulans Klinik Maristella siaga 24 jam untuk kondisi darurat medis.', parent: s1, x: 1120, y: 768, fontSize: 11, color: '#881337' });
b.createRect({ name: 'Call Button', parent: s1, x: 1120, y: 820, width: 256, height: 42, fill: '#E11D48', radius: 10 });
b.createText({ text: '📞 Hubungi (021) 555-0199', parent: s1, x: 1152, y: 832, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });


// =================================================================================================
// 02 - PASIEN: FORM PENDAFTARAN SESI KONSULTASI BARU (x: 1540, y: 0)
// =================================================================================================
const s2 = b.createFrame({ name: '02 - Pasien: Form Pendaftaran Sesi Konsultasi Baru', x: 1540, y: 0, width: 1440, height: 960, fill: '#0F172A' });

// Modal Container
const m2 = b.createRect({ name: 'Modal Box', parent: s2, x: 360, y: 50, width: 720, height: 860, fill: '#FFFFFF', radius: 20, stroke: BORDER });

// Modal Header
b.createRect({ name: 'Modal Header Strip', parent: s2, x: 360, y: 50, width: 720, height: 72, fill: TEAL, radius: 20 });
b.createRect({ name: 'Header Square Fix', parent: s2, x: 360, y: 92, width: 720, height: 30, fill: TEAL });
b.createText({ text: 'Pendaftaran Sesi Konsultasi Baru', parent: s2, x: 392, y: 70, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Klinik Maristella — Pelayanan Rawat Jalan & Poli Spesialis Terpadu', parent: s2, x: 392, y: 94, fontSize: 12, color: '#E0F2FE' });
b.createText({ text: '✕', parent: s2, x: 1030, y: 72, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });

// Field 1: Nama Lengkap
b.createText({ text: 'Nama Lengkap Pasien *', parent: s2, x: 392, y: 140, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Input Nama', parent: s2, x: 392, y: 162, width: 656, height: 42, fill: BG_PAGE, radius: 8, stroke: BORDER });
b.createText({ text: 'Budi Prasetyo (Auto-filled)', parent: s2, x: 408, y: 174, fontSize: 13, color: TEXT_MAIN });

// Field 2: NIK & No RM
b.createText({ text: 'Nomor Rekam Medis (No. RM) & NIK KTP', parent: s2, x: 392, y: 220, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Input RM', parent: s2, x: 392, y: 242, width: 316, height: 42, fill: BG_PAGE, radius: 8, stroke: BORDER });
b.createText({ text: 'KM-2026-08892', parent: s2, x: 408, y: 254, fontSize: 13, color: TEAL, fontWeight: 'bold' });

b.createRect({ name: 'Input NIK', parent: s2, x: 732, y: 242, width: 316, height: 42, fill: BG_PAGE, radius: 8, stroke: BORDER });
b.createText({ text: '3171092837490001', parent: s2, x: 748, y: 254, fontSize: 13, color: TEXT_MUTED });

// Field 3: Pilih Poli Spesialis
b.createText({ text: 'Poli Tujuan *', parent: s2, x: 392, y: 300, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Select Poli', parent: s2, x: 392, y: 322, width: 656, height: 42, fill: '#FFFFFF', radius: 8, stroke: TEAL });
b.createText({ text: 'Poli Penyakit Dalam (Sp.PD) ▾', parent: s2, x: 408, y: 334, fontSize: 13, color: TEAL, fontWeight: 'bold' });

// Field 4: Pilih Dokter
b.createText({ text: 'Dokter Spesialis Pemeriksa *', parent: s2, x: 392, y: 380, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Select Dokter', parent: s2, x: 392, y: 402, width: 656, height: 42, fill: '#FFFFFF', radius: 8, stroke: BORDER });
b.createText({ text: 'dr. Sarah Jenkins, Sp.PD (Tersedia Kuota) ▾', parent: s2, x: 408, y: 414, fontSize: 13, color: TEXT_MAIN });

// Field 5: Tanggal & Sesi Waktu
b.createText({ text: 'Tanggal & Sesi Jam Praktik *', parent: s2, x: 392, y: 460, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Date Box', parent: s2, x: 392, y: 482, width: 220, height: 42, fill: BG_PAGE, radius: 8, stroke: BORDER });
b.createText({ text: '📅 10 Nov 2026', parent: s2, x: 408, y: 494, fontSize: 13, color: TEXT_MAIN });

// Sesi Pills
b.createRect({ name: 'Pill Sesi Pagi', parent: s2, x: 630, y: 482, width: 130, height: 42, fill: TINT, radius: 8, stroke: TEAL });
b.createText({ text: 'Pagi (08:00 - 12:00)', parent: s2, x: 640, y: 494, fontSize: 11, color: TEAL, fontWeight: 'bold' });

b.createRect({ name: 'Pill Sesi Sore', parent: s2, x: 775, y: 482, width: 130, height: 42, fill: BG_PAGE, radius: 8, stroke: BORDER });
b.createText({ text: 'Sore (16:00 - 20:00)', parent: s2, x: 785, y: 494, fontSize: 11, color: TEXT_MUTED });

// Field 6: Keluhan Utama
b.createText({ text: 'Keluhan Utama & Catatan Gejala Pasien *', parent: s2, x: 392, y: 540, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Textarea Keluhan', parent: s2, x: 392, y: 562, width: 656, height: 80, fill: BG_PAGE, radius: 8, stroke: BORDER });
b.createText({ text: 'Pasien mengeluhkan nyeri ulu hati perih melilit disertai mual selama 2 hari setelah makan pedas.', parent: s2, x: 408, y: 578, fontSize: 12, color: '#334155' });

// Field 7: Penjamin Pembayaran
b.createText({ text: 'Metode Penjamin / Pembayaran *', parent: s2, x: 392, y: 658, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Radio BPJS', parent: s2, x: 392, y: 680, width: 200, height: 42, fill: '#F0FDF4', radius: 8, stroke: SUCCESS });
b.createText({ text: '✓ BPJS Kesehatan', parent: s2, x: 430, y: 692, fontSize: 13, color: '#166534', fontWeight: 'bold' });

b.createRect({ name: 'Radio Asuransi', parent: s2, x: 610, y: 680, width: 200, height: 42, fill: BG_PAGE, radius: 8, stroke: BORDER });
b.createText({ text: 'Asuransi Swasta', parent: s2, x: 650, y: 692, fontSize: 13, color: TEXT_MUTED });

b.createRect({ name: 'Radio Umum', parent: s2, x: 828, y: 680, width: 220, height: 42, fill: BG_PAGE, radius: 8, stroke: BORDER });
b.createText({ text: 'Pasien Mandiri / Umum', parent: s2, x: 855, y: 692, fontSize: 13, color: TEXT_MUTED });

// Modal Action Buttons
b.createRect({ name: 'Btn Batal', parent: s2, x: 392, y: 770, width: 200, height: 48, fill: BG_PAGE, radius: 10, stroke: BORDER });
b.createText({ text: 'Batal', parent: s2, x: 470, y: 786, fontSize: 13, color: TEXT_MUTED, fontWeight: 'bold' });

b.createRect({ name: 'Btn Submit', parent: s2, x: 610, y: 770, width: 438, height: 48, fill: TEAL, radius: 10 });
b.createText({ text: '✓ Konfirmasi & Ambil Nomor Antrean', parent: s2, x: 710, y: 786, fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' });


// =================================================================================================
// 03 - PASIEN: BOOKING JADWAL KONSULTASI DOKTER (x: 3080, y: 0)
// =================================================================================================
const s3 = b.createFrame({ name: '03 - Pasien: Booking Jadwal Konsultasi Dokter (Interaktif)', x: 3080, y: 0, width: 1440, height: 960, fill: BG_PAGE });
buildSidebar(s3, 'Jadwal Dokter');
buildTopbar(s3, 'Jadwal Praktik Dokter & Booking Antrean — Klinik Maristella');

// Poli Filters (Horizontal Tabs)
const poliTabs = [
  { name: 'Semua Poli', active: true, x: 272 },
  { name: 'Poli Penyakit Dalam', active: false, x: 392 },
  { name: 'Poli Anak & Tumbuh Kembang', active: false, x: 562 },
  { name: 'Poli Gigi & Mulut', active: false, x: 782 },
  { name: 'Poli Jantung & Pembuluh Darah', active: false, x: 942 },
  { name: 'Poli Umum 24 Jam', active: false, x: 1182 }
];

poliTabs.forEach(tab => {
  if (tab.active) {
    b.createRect({ name: `Tab ${tab.name}`, parent: s3, x: tab.x, y: 96, width: 110, height: 36, fill: TEAL, radius: 18 });
    b.createText({ text: tab.name, parent: s3, x: tab.x + 18, y: 106, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });
  } else {
    b.createRect({ name: `Tab ${tab.name}`, parent: s3, x: tab.x, y: 96, width: 160, height: 36, fill: '#FFFFFF', radius: 18, stroke: '#CBD5E1' });
    b.createText({ text: tab.name, parent: s3, x: tab.x + 14, y: 106, fontSize: 11, color: '#475569' });
  }
});

// Weekly Schedule Columns (Senin s/d Sabtu)
const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
days.forEach((day, idx) => {
  const colX = 272 + (idx * 190);
  b.createRect({ name: `Col ${day}`, parent: s3, x: colX, y: 156, width: 180, height: 760, fill: '#FFFFFF', radius: 14, stroke: BORDER });
  
  // Day Header
  b.createRect({ name: `Header ${day}`, parent: s3, x: colX, y: 156, width: 180, height: 48, fill: idx === 1 ? TINT : BG_PAGE, radius: 14 });
  b.createText({ text: day, parent: s3, x: colX + 16, y: 170, fontSize: 13, color: idx === 1 ? TEAL : TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: `${9 + idx} Nov`, parent: s3, x: colX + 120, y: 172, fontSize: 11, color: '#94A3B8' });

  // Slot 1: Pagi
  b.createRect({ name: `Slot 1 ${day}`, parent: s3, x: colX + 10, y: 216, width: 160, height: 160, fill: BG_PAGE, radius: 10, stroke: BORDER });
  b.createText({ text: 'PAGI (08:00 - 12:00)', parent: s3, x: colX + 18, y: 226, fontSize: 9, color: CYAN, fontWeight: 'bold' });
  b.createText({ text: 'dr. Sarah Jenkins', parent: s3, x: colX + 18, y: 246, fontSize: 11, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: 'Penyakit Dalam', parent: s3, x: colX + 18, y: 262, fontSize: 10, color: TEXT_MUTED });
  b.createRect({ name: `Badge Slot 1 ${day}`, parent: s3, x: colX + 18, y: 286, width: 144, height: 22, fill: '#DCFCE7', radius: 6 });
  b.createText({ text: 'Tersedia: 8 Kuota', parent: s3, x: colX + 42, y: 290, fontSize: 9, color: '#166534', fontWeight: 'bold' });
  b.createRect({ name: `Book Btn 1 ${day}`, parent: s3, x: colX + 18, y: 316, width: 144, height: 30, fill: TEAL, radius: 6 });
  b.createText({ text: 'Pilih Jadwal', parent: s3, x: colX + 58, y: 324, fontSize: 10, color: '#FFFFFF', fontWeight: 'bold' });

  // Slot 2: Sore
  b.createRect({ name: `Slot 2 ${day}`, parent: s3, x: colX + 10, y: 390, width: 160, height: 160, fill: BG_PAGE, radius: 10, stroke: BORDER });
  b.createText({ text: 'SORE (16:00 - 20:00)', parent: s3, x: colX + 18, y: 400, fontSize: 9, color: WARNING, fontWeight: 'bold' });
  b.createText({ text: 'dr. Budi Santoso', parent: s3, x: colX + 18, y: 420, fontSize: 11, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: 'Spesialis Anak', parent: s3, x: colX + 18, y: 436, fontSize: 10, color: TEXT_MUTED });
  b.createRect({ name: `Badge Slot 2 ${day}`, parent: s3, x: colX + 18, y: 460, width: 144, height: 22, fill: '#FEF3C7', radius: 6 });
  b.createText({ text: 'Sisa 2 Kuota Terakhir', parent: s3, x: colX + 34, y: 464, fontSize: 9, color: '#92400E', fontWeight: 'bold' });
  b.createRect({ name: `Book Btn 2 ${day}`, parent: s3, x: colX + 18, y: 490, width: 144, height: 30, fill: TEAL, radius: 6 });
  b.createText({ text: 'Pilih Jadwal', parent: s3, x: colX + 58, y: 498, fontSize: 10, color: '#FFFFFF', fontWeight: 'bold' });
});


// =================================================================================================
// 04 - PASIEN: REKAM MEDIS LENGKAP (FULL EMR OVERVIEW) (x: 4620, y: 0)
// =================================================================================================
const s4 = b.createFrame({ name: '04 - Pasien: Rekam Medis Lengkap (Full EMR Overview)', x: 4620, y: 0, width: 1440, height: 960, fill: BG_PAGE });
buildSidebar(s4, 'Rekam Medis');
buildTopbar(s4, 'Rekam Medis Elektronik (RME) — Klinik Maristella');

// Patient Profile Banner
b.createRect({ name: 'Profile Card', parent: s4, x: 272, y: 96, width: 1144, height: 110, fill: '#FFFFFF', radius: 16, stroke: BORDER });
b.createEllipse({ name: 'RME Avatar', parent: s4, x: 296, y: 120, width: 62, height: 62, fill: TEAL });
b.createText({ text: 'BP', parent: s4, x: 312, y: 136, fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Budi Prasetyo (34 Tahun)', parent: s4, x: 376, y: 124, fontSize: 20, color: TEXT_MAIN, fontWeight: 'bold' });
b.createText({ text: 'No. Rekam Medis: KM-2026-08892  •  NIK: 3171092837490001  •  Gol. Darah: O+', parent: s4, x: 376, y: 156, fontSize: 13, color: TEXT_MUTED });
b.createRect({ name: 'Allergy Tag', parent: s4, x: 1210, y: 128, width: 180, height: 32, fill: '#FEE2E2', radius: 8 });
b.createText({ text: '⚠️ Alergi: Amoxicillin', parent: s4, x: 1230, y: 136, fontSize: 12, color: '#991B1B', fontWeight: 'bold' });

// 4 Stat Cards
const rmeStats = [
  { label: 'Total Kunjungan Medis', val: '12 Kali', sub: 'Terakhir 02 Nov 2026', x: 272 },
  { label: 'Resep Obat Terakhir', val: '3 Macam Obat', sub: 'Omeprazole, Paracetamol, Curcuma', x: 568 },
  { label: 'Diagnosa Terakhir', val: 'Dyspepsia + Faringitis', sub: 'ICD-10: K30, J02.9', x: 864 },
  { label: 'Hasil Laboratorium', val: 'Darah Lengkap: Normal', sub: '02 Nov 2026', x: 1160 }
];

rmeStats.forEach(st => {
  b.createRect({ name: `Stat ${st.label}`, parent: s4, x: st.x, y: 226, width: 256, height: 90, fill: '#FFFFFF', radius: 12, stroke: BORDER });
  b.createText({ text: st.label, parent: s4, x: st.x + 16, y: 240, fontSize: 11, color: TEXT_MUTED });
  b.createText({ text: st.val, parent: s4, x: st.x + 16, y: 260, fontSize: 15, color: TEAL, fontWeight: 'bold' });
  b.createText({ text: st.sub, parent: s4, x: st.x + 16, y: 284, fontSize: 10, color: '#94A3B8' });
});

// 3 Tab Navigators
b.createRect({ name: 'Tab 1 Btn', parent: s4, x: 272, y: 340, width: 260, height: 42, fill: TEAL, radius: 10 });
b.createText({ text: '📋 Riwayat Medis & Diagnosa', parent: s4, x: 310, y: 352, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ name: 'Tab 2 Btn', parent: s4, x: 552, y: 340, width: 260, height: 42, fill: '#FFFFFF', radius: 10, stroke: BORDER });
b.createText({ text: '💊 Resep Obat & Farmasi', parent: s4, x: 600, y: 352, fontSize: 13, color: TEXT_MAIN });

b.createRect({ name: 'Tab 3 Btn', parent: s4, x: 832, y: 340, width: 260, height: 42, fill: '#FFFFFF', radius: 10, stroke: BORDER });
b.createText({ text: '🔬 Dokumen & Hasil Lab', parent: s4, x: 880, y: 352, fontSize: 13, color: TEXT_MAIN });

// Visit Summaries
const overviewVisits = [
  { date: '02 November 2026', doc: 'dr. Sarah Jenkins, Sp.PD (Poli Penyakit Dalam)', diag: 'Dyspepsia Syndrome + Faringitis Akut (ICD-10: K30, J02.9)', notes: 'Nyeri ulu hati 2 hari, mual, rasa terbakar. Terapi omeprazole 20mg 2x1 dan paracetamol 500mg.', y: 406 },
  { date: '14 Oktober 2026', doc: 'dr. Maya Anggraini, Sp.KG (Poli Gigi & Mulut)', diag: 'Pulpitis Reversible Gigi Molar 1 Kanan Bawah (ICD-10: K04.0)', notes: 'Penambalan resin komposit dan scaling rahang atas-bawah. Tidak ada keluhan pasca tindakan.', y: 536 },
  { date: '18 Agustus 2026', doc: 'dr. Rendy Wijaya (Poli Umum / MCU)', diag: 'Medical Check-Up Rutin Tahunan (ICD-10: Z00.0)', notes: 'GDP: 92 mg/dL, Kolesterol: 178 mg/dL, Asam Urat: 5.4 mg/dL. Seluruh profil fisiologis dalam batas normal.', y: 666 }
];

overviewVisits.forEach(v => {
  b.createRect({ name: `Overview Visit ${v.date}`, parent: s4, x: 272, y: v.y, width: 1144, height: 110, fill: '#FFFFFF', radius: 14, stroke: BORDER });
  b.createEllipse({ name: 'Dot Timeline', parent: s4, x: 292, y: v.y + 24, width: 12, height: 12, fill: TEAL });
  b.createText({ text: v.date, parent: s4, x: 316, y: v.y + 20, fontSize: 14, color: TEAL, fontWeight: 'bold' });
  b.createText({ text: 'Pemeriksa: ' + v.doc, parent: s4, x: 560, y: v.y + 22, fontSize: 12, color: TEXT_MUTED });
  b.createText({ text: 'Diagnosa: ' + v.diag, parent: s4, x: 316, y: v.y + 50, fontSize: 13, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: v.notes, parent: s4, x: 316, y: v.y + 74, fontSize: 11, color: '#475569' });
  b.createRect({ name: 'Unduh Btn', parent: s4, x: 1250, y: v.y + 36, width: 140, height: 36, fill: TINT, radius: 8 });
  b.createText({ text: '📄 Unduh PDF', parent: s4, x: 1282, y: v.y + 46, fontSize: 11, color: TEAL, fontWeight: 'bold' });
});


// =================================================================================================
// 05 - PASIEN: REKAM MEDIS - TAB RIWAYAT MEDIS & DIAGNOSA (x: 0, y: 1060)
// =================================================================================================
const s5 = b.createFrame({ name: '05 - Pasien: Rekam Medis - Tab Riwayat Medis & Diagnosa', x: 0, y: 1060, width: 1440, height: 960, fill: BG_PAGE });
buildSidebar(s5, 'Rekam Medis');
buildTopbar(s5, 'Riwayat Medis & Diagnosa Pasien — Klinik Maristella');

// Banner RME
b.createRect({ name: 'RME Banner', parent: s5, x: 272, y: 96, width: 1144, height: 80, fill: TEAL, radius: 14 });
b.createText({ text: 'Budi Prasetyo (KM-2026-08892)', parent: s5, x: 304, y: 114, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Tab 1: Riwayat Diagnosa Klinis, Vital Signs, dan Anamnesis Terverifikasi', parent: s5, x: 304, y: 140, fontSize: 12, color: '#E0F2FE' });

// 3 Detailed Visit Cards
const detailedVisits = [
  {
    date: '02 November 2026',
    doctor: 'dr. Sarah Jenkins, Sp.PD (Poli Penyakit Dalam)',
    diag: 'Dyspepsia Syndrome + Faringitis Akut (ICD-10: K30, J02.9)',
    vitals: 'TD: 120/80 mmHg  •  Nadi: 82 bpm  •  Suhu: 37.8 °C  •  SpO2: 99%',
    notes: 'Anamnesis: Nyeri ulu hati terasa perih melilit 2 hari terakhir setelah makanan pedas. Disertai mual dan tenggorokan mengganjal.\nPemeriksaan: Abdomen supel, nyeri tekan epigastrium (+), faring hiperemis (+). Terapi: Omeprazole 20mg, Paracetamol 500mg, Curcuma tab.',
    y: 196
  },
  {
    date: '14 Oktober 2026',
    doctor: 'dr. Maya Anggraini, Sp.KG (Poli Gigi & Mulut)',
    diag: 'Pulpitis Reversible Gigi Molar 1 Kanan Bawah (ICD-10: K04.0)',
    vitals: 'TD: 118/76 mmHg  •  Nadi: 78 bpm  •  Suhu: 36.6 °C',
    notes: 'Anamnesis: Linu saat minum es dan manis pada gigi geraham kanan bawah.\nTindakan: Ekskavasi jaringan karies, etsa & bonding, penambalan nano-hybrid composite kelas 1, polishing, scaling seluruh regio.',
    y: 386
  },
  {
    date: '18 Agustus 2026',
    doctor: 'dr. Rendy Wijaya (Poli Umum / MCU)',
    diag: 'Medical Check-Up Rutin Tahunan (ICD-10: Z00.0)',
    vitals: 'TD: 120/80 mmHg  •  Nadi: 76 bpm  •  Suhu: 36.5 °C  •  BMI: 22.4 (Normal)',
    notes: 'Hasil Laboratorium: Gula Darah Puasa: 92 mg/dL, Kolesterol Total: 178 mg/dL, Asam Urat: 5.4 mg/dL. Fungsi ginjal (Ureum/Kreatinin) dan hepar (SGOT/SGPT) normal.\nKesimpulan: Kondisi fisik dan profil darah sangat baik.',
    y: 576
  }
];

detailedVisits.forEach(dv => {
  b.createRect({ name: `Detail Card ${dv.date}`, parent: s5, x: 272, y: dv.y, width: 1144, height: 170, fill: '#FFFFFF', radius: 14, stroke: BORDER });
  b.createRect({ name: 'Header Strip', parent: s5, x: 272, y: dv.y, width: 1144, height: 42, fill: BG_PAGE, radius: 14 });
  b.createText({ text: '📅 ' + dv.date, parent: s5, x: 292, y: dv.y + 12, fontSize: 13, color: TEAL, fontWeight: 'bold' });
  b.createText({ text: 'Pemeriksa: ' + dv.doctor, parent: s5, x: 500, y: dv.y + 12, fontSize: 12, color: TEXT_MUTED });
  b.createText({ text: dv.vitals, parent: s5, x: 960, y: dv.y + 12, fontSize: 11, color: CYAN, fontWeight: 'bold' });

  b.createText({ text: 'Diagnosa ICD-10: ' + dv.diag, parent: s5, x: 292, y: dv.y + 56, fontSize: 14, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: dv.notes, parent: s5, x: 292, y: dv.y + 84, fontSize: 11, color: '#475569' });
  b.createRect({ name: 'Download PDF', parent: s5, x: 1230, y: dv.y + 116, width: 160, height: 38, fill: TINT, radius: 8 });
  b.createText({ text: '📄 Unduh Salinan', parent: s5, x: 1260, y: dv.y + 128, fontSize: 11, color: TEAL, fontWeight: 'bold' });
});


// =================================================================================================
// 06 - PASIEN: REKAM MEDIS - TAB RESEP OBAT & FARMAKOLOGI (x: 1540, y: 1060)
// =================================================================================================
const s6 = b.createFrame({ name: '06 - Pasien: Rekam Medis - Tab Resep Obat & Farmakologi', x: 1540, y: 1060, width: 1440, height: 960, fill: BG_PAGE });
buildSidebar(s6, 'Rekam Medis');
buildTopbar(s6, 'Resep Obat & Layanan Farmasi — Klinik Maristella');

// Banner Farmasi
b.createRect({ name: 'Farmasi Banner', parent: s6, x: 272, y: 96, width: 1144, height: 80, fill: CYAN, radius: 14 });
b.createText({ text: 'Daftar Resep Digital & Riwayat Pengambilan Obat', parent: s6, x: 304, y: 114, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Apotek Farmasi Klinik Maristella buka 24 jam dengan verifikasi ganda barcode SatuSehat Kemenkes.', parent: s6, x: 304, y: 140, fontSize: 12, color: '#E0F2FE' });

// Table Header
b.createRect({ name: 'Table Header', parent: s6, x: 272, y: 196, width: 1144, height: 48, fill: TEAL, radius: 10 });
b.createText({ text: 'NAMA OBAT & SEDIAAN', parent: s6, x: 296, y: 212, fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'DOSIS & ATURAN PAKAI', parent: s6, x: 530, y: 212, fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'JUMLAH', parent: s6, x: 790, y: 212, fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'DOKTER PERESEP', parent: s6, x: 890, y: 212, fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'STATUS PENGAMBILAN', parent: s6, x: 1120, y: 212, fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' });

// Table Rows
const prescripts = [
  { name: 'Omeprazole 20mg', form: 'Kapsul Pelepasan Tunda', dose: '2 x 1 Kapsul (30 mnt sebelum makan)', qty: '14 Kapsul', doc: 'dr. Sarah Jenkins, Sp.PD', status: '✓ Selesai Ditebus', statCol: SUCCESS, y: 254 },
  { name: 'Paracetamol 500mg', form: 'Tablet Salut', dose: '3 x 1 Tablet (prn demam / pusing)', qty: '10 Tablet', doc: 'dr. Sarah Jenkins, Sp.PD', status: '✓ Selesai Ditebus', statCol: SUCCESS, y: 334 },
  { name: 'Curcuma FCT', form: 'Tablet Ekstrak Temulawak', dose: '3 x 1 Tablet (sesudah makan)', qty: '10 Tablet', doc: 'dr. Sarah Jenkins, Sp.PD', status: '✓ Selesai Ditebus', statCol: SUCCESS, y: 414 },
  { name: 'Amoxicillin 500mg', form: 'Kaplet Antibiotik', dose: 'DIBATALKAN KARENA RIWAYAT ALERGI', qty: '0 Kaplet', doc: 'dr. Sarah Jenkins, Sp.PD', status: '✕ Dibatalkan (Alergi)', statCol: DANGER, y: 494 }
];

prescripts.forEach(row => {
  b.createRect({ name: `Row ${row.name}`, parent: s6, x: 272, y: row.y, width: 1144, height: 70, fill: '#FFFFFF', radius: 10, stroke: BORDER });
  b.createText({ text: row.name, parent: s6, x: 296, y: row.y + 16, fontSize: 13, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: row.form, parent: s6, x: 296, y: row.y + 38, fontSize: 11, color: TEXT_MUTED });
  b.createText({ text: row.dose, parent: s6, x: 530, y: row.y + 26, fontSize: 12, color: TEXT_MAIN });
  b.createText({ text: row.qty, parent: s6, x: 790, y: row.y + 26, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: row.doc, parent: s6, x: 890, y: row.y + 26, fontSize: 12, color: TEXT_MUTED });
  
  b.createRect({ name: 'Badge Stat', parent: s6, x: 1110, y: row.y + 20, width: 160, height: 28, fill: row.statCol === SUCCESS ? '#DCFCE7' : '#FEE2E2', radius: 14 });
  b.createText({ text: row.status, parent: s6, x: 1126, y: row.y + 26, fontSize: 11, color: row.statCol === SUCCESS ? '#166534' : '#991B1B', fontWeight: 'bold' });
});

// Farmasi Info Card
b.createRect({ name: 'Apotek Info Box', parent: s6, x: 272, y: 600, width: 1144, height: 160, fill: TINT, radius: 14, stroke: '#BFDBFE' });
b.createText({ text: 'ℹ️ Petunjuk Konsumsi & Edukasi Farmasi Klinik Maristella', parent: s6, x: 304, y: 624, fontSize: 14, color: TEAL, fontWeight: 'bold' });
b.createText({ text: '1. Konsumsi obat lambung (Omeprazole) selalu dalam kondisi perut kosong, sekurang-kurangnya 30 menit sebelum makan pagi dan malam.\n2. Paracetamol diminum hanya jika timbul gejala demam >38°C atau sakit kepala berlebih, hentikan pemakaian jika gejala reda.\n3. Laporkan segera ke nomor darurat (021) 555-0199 apabila timbul ruam kulit, gatal, atau sesak nafas setelah meminum obat apapun.', parent: s6, x: 304, y: 654, fontSize: 12, color: '#334155' });


// =================================================================================================
// 07 - PASIEN: REKAM MEDIS - TAB DOKUMEN & HASIL LAB (x: 3080, y: 1060)
// =================================================================================================
const s7 = b.createFrame({ name: '07 - Pasien: Rekam Medis - Tab Dokumen & Hasil Lab', x: 3080, y: 1060, width: 1440, height: 960, fill: BG_PAGE });
buildSidebar(s7, 'Rekam Medis');
buildTopbar(s7, 'Dokumen Medis & Hasil Laboratorium — Klinik Maristella');

// Banner Lab
b.createRect({ name: 'Lab Banner', parent: s7, x: 272, y: 96, width: 1144, height: 80, fill: NAVY, radius: 14 });
b.createText({ text: 'Hasil Tes Laboratorium, Radiologi & Berkas Digital Pasien', parent: s7, x: 304, y: 114, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Semua hasil uji laboratorium telah divalidasi oleh Dokter Spesialis Patologi Klinik & Radiologi Klinik Maristella.', parent: s7, x: 304, y: 140, fontSize: 12, color: '#BFDBFE' });

// 4 Document Cards (2 x 2)
const docCards = [
  {
    title: 'Hematologi Rutin Darah Lengkap',
    date: '02 November 2026',
    doctor: 'dr. Hendarmin, Sp.PK',
    results: 'Hemoglobin: 14.8 g/dL (Normal)  •  Leukosit: 8.200 /uL  •  Hematokrit: 44%  •  Trombosit: 245.000 /uL',
    status: '✓ Semua Parameter Normal',
    x: 272, y: 196
  },
  {
    title: 'Profil Lipid & Kolesterol Total',
    date: '18 Agustus 2026',
    doctor: 'dr. Hendarmin, Sp.PK',
    results: 'Kolesterol Total: 178 mg/dL (<200)  •  Trigliserida: 135 mg/dL  •  HDL: 52 mg/dL  •  LDL: 99 mg/dL',
    status: '✓ Tingkat Risiko Rendah',
    x: 864, y: 196
  },
  {
    title: 'Rontgen Thorax Foto PA (Dada)',
    date: '18 Agustus 2026',
    doctor: 'dr. Haryono, Sp.Rad',
    results: 'Kesan: Cor dan pulmo dalam batas normal. Tidak tampak infiltrat aktif maupun pembesaran jantung (CTR < 50%).',
    status: '✓ Foto Thorax Normal',
    x: 272, y: 440
  },
  {
    title: 'Surat Keterangan Dokter Sakit',
    date: '02 November 2026',
    doctor: 'dr. Sarah Jenkins, Sp.PD',
    results: 'Diberikan izin istirahat sakit selama 3 (tiga) hari kerja, terhitung mulai tanggal 02 s/d 04 November 2026.',
    status: '✓ Tervalidasi BSrE Kemenkes',
    x: 864, y: 440
  }
];

docCards.forEach(dc => {
  b.createRect({ name: `Doc Card ${dc.title}`, parent: s7, x: dc.x, y: dc.y, width: 552, height: 220, fill: '#FFFFFF', radius: 14, stroke: BORDER });
  b.createRect({ name: 'Card Header', parent: s7, x: dc.x, y: dc.y, width: 552, height: 44, fill: BG_PAGE, radius: 14 });
  b.createText({ text: '📄 ' + dc.title, parent: s7, x: dc.x + 16, y: dc.y + 12, fontSize: 13, color: TEAL, fontWeight: 'bold' });
  b.createText({ text: dc.date, parent: s7, x: dc.x + 440, y: dc.y + 14, fontSize: 11, color: TEXT_MUTED });

  b.createText({ text: 'Dokter Penanggung Jawab: ' + dc.doctor, parent: s7, x: dc.x + 16, y: dc.y + 56, fontSize: 11, color: TEXT_MUTED });
  b.createText({ text: dc.results, parent: s7, x: dc.x + 16, y: dc.y + 84, fontSize: 12, color: TEXT_MAIN });

  b.createRect({ name: 'Badge Status', parent: s7, x: dc.x + 16, y: dc.y + 160, width: 220, height: 28, fill: '#DCFCE7', radius: 6 });
  b.createText({ text: dc.status, parent: s7, x: dc.x + 28, y: dc.y + 166, fontSize: 11, color: '#166534', fontWeight: 'bold' });

  b.createRect({ name: 'Download Btn', parent: s7, x: dc.x + 396, y: dc.y + 154, width: 140, height: 40, fill: TINT, radius: 8 });
  b.createText({ text: '📥 Unduh PDF', parent: s7, x: dc.x + 424, y: dc.y + 166, fontSize: 12, color: TEAL, fontWeight: 'bold' });
});


// =================================================================================================
// 08 - DOKTER: LEMBAR PEMERIKSAAN SOAP KLINIS & ANTREAN (x: 4620, y: 1060)
// =================================================================================================
const s8 = b.createFrame({ name: '08 - Dokter: Lembar Pemeriksaan SOAP Klinis & Antrean', x: 4620, y: 1060, width: 1440, height: 960, fill: BG_PAGE });

// Topbar Dokter Spesialis
b.createRect({ name: 'Doctor Header BG', parent: s8, x: 0, y: 0, width: 1440, height: 68, fill: TEAL });
b.createText({ text: '✚ Klinik Maristella', parent: s8, x: 32, y: 22, fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' });
b.createRect({ name: 'Portal Tag', parent: s8, x: 230, y: 20, width: 180, height: 28, fill: NAVY, radius: 14 });
b.createText({ text: 'PORTAL DOKTER SPESIALIS', parent: s8, x: 242, y: 26, fontSize: 10, color: '#93C5FD', fontWeight: 'bold' });

b.createEllipse({ name: 'Doctor Avatar', parent: s8, x: 1210, y: 14, width: 40, height: 40, fill: TINT });
b.createText({ text: 'SJ', parent: s8, x: 1222, y: 24, fontSize: 14, color: TEAL, fontWeight: 'bold' });
b.createText({ text: 'dr. Sarah Jenkins, Sp.PD', parent: s8, x: 1260, y: 18, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: '🟢 Praktik Aktif (Poli Penyakit Dalam)', parent: s8, x: 1260, y: 36, fontSize: 11, color: '#86EFAC' });

// Left Patient Queue List
b.createRect({ name: 'Queue Container', parent: s8, x: 24, y: 88, width: 360, height: 840, fill: '#FFFFFF', radius: 16, stroke: BORDER });
b.createText({ text: 'Antrean Pasien Hari Ini', parent: s8, x: 44, y: 110, fontSize: 16, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Badge Total Antrean', parent: s8, x: 280, y: 108, width: 80, height: 26, fill: TINT, radius: 13 });
b.createText({ text: 'Total: 24', parent: s8, x: 298, y: 114, fontSize: 12, color: TEAL, fontWeight: 'bold' });

// Queue Cards
const patientQueues = [
  { no: '014', name: 'Ny. Siti Rahma', age: '34 Th', status: 'Sedang Diperiksa', isCurrent: true, rm: 'KM-2026-08892', y: 150 },
  { no: '015', name: 'Tn. Ahmad Fauzi', age: '45 Th', status: 'Menunggu', isCurrent: false, rm: 'KM-2026-07741', y: 250 },
  { no: '016', name: 'An. Rizky Pratama', age: '8 Th', status: 'Menunggu', isCurrent: false, rm: 'KM-2026-09102', y: 340 },
  { no: '017', name: 'Ibu Ratna Dewi', age: '52 Th', status: 'Menunggu', isCurrent: false, rm: 'KM-2026-06511', y: 430 }
];

patientQueues.forEach(pq => {
  if (pq.isCurrent) {
    b.createRect({ name: 'Current Patient Card', parent: s8, x: 40, y: pq.y, width: 328, height: 86, fill: TINT, radius: 12, stroke: TEAL });
    b.createEllipse({ name: 'Queue Num BG', parent: s8, x: 54, y: pq.y + 14, width: 36, height: 36, fill: TEAL });
    b.createText({ text: pq.no, parent: s8, x: 60, y: pq.y + 24, fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' });
    b.createText({ text: pq.name + ' (' + pq.age + ')', parent: s8, x: 100, y: pq.y + 16, fontSize: 13, color: TEAL, fontWeight: 'bold' });
    b.createText({ text: pq.rm + ' • Keluhan: Demam 3 Hari', parent: s8, x: 100, y: pq.y + 36, fontSize: 11, color: '#475569' });
    b.createRect({ name: 'Status Active Badge', parent: s8, x: 100, y: pq.y + 56, width: 120, height: 20, fill: '#DCFCE7', radius: 10 });
    b.createText({ text: '● Sedang Diperiksa', parent: s8, x: 112, y: pq.y + 60, fontSize: 10, color: '#166534', fontWeight: 'bold' });
  } else {
    b.createRect({ name: 'Waiting Patient Card', parent: s8, x: 40, y: pq.y, width: 328, height: 76, fill: '#FFFFFF', radius: 12, stroke: BORDER });
    b.createEllipse({ name: 'Queue Num Gray', parent: s8, x: 54, y: pq.y + 14, width: 34, height: 34, fill: '#F1F5F9' });
    b.createText({ text: pq.no, parent: s8, x: 62, y: pq.y + 24, fontSize: 13, color: '#475569', fontWeight: 'bold' });
    b.createText({ text: pq.name + ' (' + pq.age + ')', parent: s8, x: 100, y: pq.y + 16, fontSize: 13, color: TEXT_MAIN, fontWeight: 'bold' });
    b.createText({ text: pq.rm + ' • Menunggu di Ruang Tunggu', parent: s8, x: 100, y: pq.y + 38, fontSize: 11, color: '#94A3B8' });
  }
});

// Main Clinical Examination & SOAP Area
b.createRect({ name: 'SOAP Container', parent: s8, x: 404, y: 88, width: 1012, height: 840, fill: '#FFFFFF', radius: 16, stroke: BORDER });

// Patient Bio & Vitals Banner
b.createRect({ name: 'Patient Header Strip', parent: s8, x: 424, y: 108, width: 972, height: 84, fill: BG_PAGE, radius: 12, stroke: BORDER });
b.createText({ text: 'Ny. Siti Rahma (34 Th)', parent: s8, x: 444, y: 122, fontSize: 18, color: TEXT_MAIN, fontWeight: 'bold' });
b.createText({ text: 'No. RM: KM-2026-08892  •  Jenis Kelamin: Perempuan  •  Gol. Darah: O+', parent: s8, x: 444, y: 148, fontSize: 12, color: TEXT_MUTED });
b.createRect({ name: 'Allergy Tag', parent: s8, x: 880, y: 122, width: 140, height: 26, fill: '#FEE2E2', radius: 6 });
b.createText({ text: '⚠️ Alergi: Penisilin', parent: s8, x: 894, y: 128, fontSize: 11, color: '#991B1B', fontWeight: 'bold' });

// Vital Signs Pills
const vitals = [
  { label: 'Tekanan Darah', val: '120/80 mmHg', x: 444 },
  { label: 'Denyut Nadi', val: '82 bpm', x: 624 },
  { label: 'Suhu Tubuh', val: '38.4 °C (Demam)', x: 774 },
  { label: 'Berat Badan', val: '58 kg', x: 964 },
  { label: 'Saturasi O2', val: '98%', x: 1124 }
];

b.createRect({ name: 'Vitals Box', parent: s8, x: 424, y: 204, width: 972, height: 60, fill: TINT, radius: 10 });
vitals.forEach(v => {
  b.createText({ text: v.label, parent: s8, x: v.x, y: 214, fontSize: 11, color: TEXT_MUTED });
  b.createText({ text: v.val, parent: s8, x: v.x, y: 234, fontSize: 13, color: TEAL, fontWeight: 'bold' });
});

// SOAP Form Sections
const soapFields = [
  { letter: 'S', title: 'Subjective (Anamnesis / Keluhan Pasien)', desc: 'Pasien mengeluhkan demam menggigil sejak 3 hari yang lalu, disertai pusing kepala, mual, nafsu makan berkurang. Tidak ada batuk pilek.', y: 280, h: 100 },
  { letter: 'O', title: 'Objective (Pemeriksaan Fisik & Penunjang)', desc: 'Keadaan Umum: Tampak sakit sedang. Kesadaran: Compos Mentis. Konjungtiva anemis (-), sklera ikterik (-). Faring hiperemis ringan. Thorax cor/pulmo dalam batas normal.', y: 396, h: 100 },
  { letter: 'A', title: 'Assessment (Diagnosa Medis ICD-10)', desc: 'Diagnosa Kerja: Febris e.c. Viral Infection (ICD-10: A90 / B34.9)\nDiagnosa Banding: Demam Dengue fase awal, Faringitis Akut', y: 512, h: 100 },
  { letter: 'P', title: 'Plan (Terapi, E-Resep & Edukasi Pasien)', desc: '1. Paracetamol 500mg tab 3x1 (prn demam > 38°C)\n2. Curcuma tablet 3x1 p.c\n3. Vitamin C 500mg 1x1\nEdukasi: Minum air putih 2-2.5 liter per hari, kompres hangat, kontrol ulang 3 hari jika demam menetap.', y: 628, h: 130 }
];

soapFields.forEach(f => {
  b.createRect({ name: `SOAP ${f.letter} Card`, parent: s8, x: 424, y: f.y, width: 972, height: f.h, fill: '#FFFFFF', radius: 12, stroke: BORDER });
  b.createRect({ name: `SOAP Badge ${f.letter}`, parent: s8, x: 440, y: f.y + 14, width: 28, height: 28, fill: TEAL, radius: 6 });
  b.createText({ text: f.letter, parent: s8, x: 449, y: f.y + 20, fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' });
  b.createText({ text: f.title, parent: s8, x: 478, y: f.y + 18, fontSize: 13, color: TEAL, fontWeight: 'bold' });
  b.createText({ text: f.desc, parent: s8, x: 440, y: f.y + 50, fontSize: 12, color: '#334155' });
});

// Action Buttons Footer
b.createRect({ name: 'Save SOAP Button', parent: s8, x: 424, y: 780, width: 280, height: 48, fill: TEAL, radius: 10 });
b.createText({ text: '✓ Simpan SOAP & Panggil Berikutnya', parent: s8, x: 440, y: 796, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ name: 'Print Prescript Button', parent: s8, x: 720, y: 780, width: 170, height: 48, fill: CYAN, radius: 10 });
b.createText({ text: '🖨️ Cetak Resep Obat', parent: s8, x: 744, y: 796, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ name: 'Lab Refer Button', parent: s8, x: 906, y: 780, width: 170, height: 48, fill: '#FFFFFF', radius: 10, stroke: '#CBD5E1' });
b.createText({ text: '🧪 Rujuk Laboratorium', parent: s8, x: 926, y: 796, fontSize: 13, color: '#475569', fontWeight: 'bold' });


// =================================================================================================
// 09 - DOKTER: TAB DATA DEMOGRAFIS & RIWAYAT PASIEN (x: 0, y: 2120)
// =================================================================================================
const s9 = b.createFrame({ name: '09 - Dokter: Tab Data Demografis & Riwayat Pasien', x: 0, y: 2120, width: 1440, height: 960, fill: BG_PAGE });

// Topbar Dokter
b.createRect({ name: 'Doctor Header BG 2', parent: s9, x: 0, y: 0, width: 1440, height: 68, fill: TEAL });
b.createText({ text: '✚ Klinik Maristella', parent: s9, x: 32, y: 22, fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'PORTAL DOKTER — DATA DEMOGRAFIS PASIEN', parent: s9, x: 230, y: 26, fontSize: 12, color: '#E0F2FE', fontWeight: 'bold' });

// Sidebar Antrean Mini
b.createRect({ name: 'Sidebar Demografis', parent: s9, x: 24, y: 88, width: 320, height: 840, fill: '#FFFFFF', radius: 16, stroke: BORDER });
b.createText({ text: 'Daftar Pasien Terjadwal', parent: s9, x: 44, y: 110, fontSize: 16, color: TEXT_MAIN, fontWeight: 'bold' });

// Main Demografis Content
b.createRect({ name: 'Demografis Container', parent: s9, x: 364, y: 88, width: 1052, height: 840, fill: '#FFFFFF', radius: 16, stroke: BORDER });
b.createText({ text: 'Profil Demografis & Riwayat Penyakit Pasien', parent: s9, x: 396, y: 116, fontSize: 18, color: TEAL, fontWeight: 'bold' });

// Grid Demografis Cards
const demoFields = [
  { label: 'Nama Lengkap', val: 'Ny. Siti Rahma' },
  { label: 'Nomor Rekam Medis', val: 'KM-2026-08892' },
  { label: 'NIK KTP', val: '3171095512900003' },
  { label: 'Tempat, Tanggal Lahir', val: 'Jakarta, 12 Mei 1990 (34 Tahun)' },
  { label: 'Jenis Kelamin', val: 'Perempuan' },
  { label: 'Golongan Darah & Rhesus', val: 'O Positif (O+)' },
  { label: 'Nomor Telepon / WhatsApp', val: '0812-9876-5432' },
  { label: 'Alamat Domisili', val: 'Jl. Melati Indah No. 45, Kebayoran Baru, Jakarta Selatan' },
  { label: 'Pekerjaan', val: 'Pegawai Swasta' },
  { label: 'Status Pernikahan', val: 'Menikah' },
  { label: 'Kontak Darurat (Suami)', val: 'Tn. Hendra Wijaya (0813-1122-3344)' },
  { label: 'Penjamin Medis', val: 'BPJS Kesehatan (No. 0001928374829)' }
];

demoFields.forEach((df, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const cardX = 396 + (col * 506);
  const cardY = 160 + (row * 68);

  b.createRect({ name: `Demo Box ${idx}`, parent: s9, x: cardX, y: cardY, width: 490, height: 56, fill: BG_PAGE, radius: 8, stroke: BORDER });
  b.createText({ text: df.label, parent: s9, x: cardX + 16, y: cardY + 10, fontSize: 10, color: TEXT_MUTED });
  b.createText({ text: df.val, parent: s9, x: cardX + 16, y: cardY + 28, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
});

// Riwayat Penyakit Terdahulu
b.createRect({ name: 'Past History Card', parent: s9, x: 396, y: 590, width: 1002, height: 200, fill: TINT, radius: 12, stroke: '#BFDBFE' });
b.createText({ text: '⚠️ Riwayat Alergi & Kondisi Medis Khusus', parent: s9, x: 420, y: 610, fontSize: 14, color: TEAL, fontWeight: 'bold' });
b.createText({ text: '• Alergi Obat: Penisilin & Golongan Beta-Laktam (Reaksi: Urtikaria kulit, sesak nafas ringan).\n• Alergi Makanan: Tidak ada riwayat alergi makanan laut atau kacang-kacangan.\n• Riwayat Bedah / Rawat Inap: Appendektomi laparoskopi pada tahun 2018 di RS Hermina.\n• Riwayat Penyakit Keluarga: Ayah memiliki riwayat Hipertensi, Ibu riwayat Diabetes Melitus Tipe 2.', parent: s9, x: 420, y: 640, fontSize: 12, color: '#334155' });


// =================================================================================================
// 10 - ADMIN: MANAJEMEN JADWAL DOKTER & ANTREAN POLI (x: 1540, y: 2120)
// =================================================================================================
const s10 = b.createFrame({ name: '10 - Admin: Manajemen Jadwal Dokter & Antrean Poli', x: 1540, y: 2120, width: 1440, height: 960, fill: BG_PAGE });

// Topbar Admin
b.createRect({ name: 'Admin Header BG', parent: s10, x: 0, y: 0, width: 1440, height: 68, fill: NAVY });
b.createText({ text: '✚ Klinik Maristella', parent: s10, x: 32, y: 22, fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' });
b.createRect({ name: 'Portal Admin Tag', parent: s10, x: 230, y: 20, width: 220, height: 28, fill: '#083E88', radius: 14 });
b.createText({ text: 'PORTAL ADMINISTRATOR & OPERASIONAL', parent: s10, x: 242, y: 26, fontSize: 10, color: '#93C5FD', fontWeight: 'bold' });

b.createEllipse({ name: 'Admin Avatar', parent: s10, x: 1210, y: 14, width: 40, height: 40, fill: '#FAF5FF' });
b.createText({ text: 'RS', parent: s10, x: 1222, y: 24, fontSize: 14, color: '#7E22CE', fontWeight: 'bold' });
b.createText({ text: 'Ratna Susanti (Admin)', parent: s10, x: 1260, y: 18, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Operasional & Jadwal Poli', parent: s10, x: 1260, y: 36, fontSize: 11, color: '#E9D5FF' });

// 4 Admin Stat Metrics
const adminStats = [
  { label: 'Total Dokter Aktif', val: '14 Dokter', sub: 'Semua spesialisasi', x: 24 },
  { label: 'Poli Beroperasi', val: '6 Poliklinik', sub: 'Pagi & Sore', x: 380 },
  { label: 'Total Pasien Hari Ini', val: '86 Pasien', sub: 'Rawat jalan & UGD', x: 736 },
  { label: 'Kapasitas Kuota', val: '92% Terisi', sub: 'Maksimal 120 kuota', x: 1092 }
];

adminStats.forEach(as => {
  b.createRect({ name: `Admin Stat ${as.label}`, parent: s10, x: as.x, y: 88, width: 332, height: 90, fill: '#FFFFFF', radius: 14, stroke: BORDER });
  b.createText({ text: as.label, parent: s10, x: as.x + 18, y: 102, fontSize: 11, color: TEXT_MUTED });
  b.createText({ text: as.val, parent: s10, x: as.x + 18, y: 122, fontSize: 18, color: NAVY, fontWeight: 'bold' });
  b.createText({ text: as.sub, parent: s10, x: as.x + 18, y: 148, fontSize: 10, color: '#94A3B8' });
});

// Schedule Management Table
b.createRect({ name: 'Table Container', parent: s10, x: 24, y: 200, width: 1392, height: 720, fill: '#FFFFFF', radius: 16, stroke: BORDER });
b.createText({ text: 'Manajemen Kuota Antrean & Jadwal Praktik Poliklinik', parent: s10, x: 48, y: 224, fontSize: 16, color: TEXT_MAIN, fontWeight: 'bold' });

b.createRect({ name: 'Btn Tambah Jadwal', parent: s10, x: 1210, y: 216, width: 180, height: 38, fill: TEAL, radius: 8 });
b.createText({ text: '+ Tambah Jadwal Dokter', parent: s10, x: 1230, y: 228, fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' });

// Table Header
b.createRect({ name: 'Table Header Strip', parent: s10, x: 48, y: 270, width: 1344, height: 42, fill: BG_PAGE, radius: 8 });
b.createText({ text: 'NAMA POLIKLINIK', parent: s10, x: 68, y: 284, fontSize: 11, color: TEXT_MUTED, fontWeight: 'bold' });
b.createText({ text: 'DOKTER SPESIALIS', parent: s10, x: 280, y: 284, fontSize: 11, color: TEXT_MUTED, fontWeight: 'bold' });
b.createText({ text: 'HARI & JAM PRAKTIK', parent: s10, x: 540, y: 284, fontSize: 11, color: TEXT_MUTED, fontWeight: 'bold' });
b.createText({ text: 'KUOTA / TERISI', parent: s10, x: 800, y: 284, fontSize: 11, color: TEXT_MUTED, fontWeight: 'bold' });
b.createText({ text: 'STATUS POLI', parent: s10, x: 1020, y: 284, fontSize: 11, color: TEXT_MUTED, fontWeight: 'bold' });
b.createText({ text: 'AKSI', parent: s10, x: 1240, y: 284, fontSize: 11, color: TEXT_MUTED, fontWeight: 'bold' });

// Table Rows
const adminRows = [
  { poli: 'Poli Penyakit Dalam', doc: 'dr. Sarah Jenkins, Sp.PD', time: 'Senin - Jumat (08:00 - 14:00)', quota: '30 / 28 Pasien', status: '● Beroperasi', statCol: SUCCESS, y: 324 },
  { poli: 'Poli Anak & Tumbuh Kembang', doc: 'dr. Budi Santoso, Sp.A', time: 'Senin - Sabtu (13:00 - 18:00)', quota: '25 / 25 Pasien', status: '● Kuota Penuh', statCol: WARNING, y: 394 },
  { poli: 'Poli Gigi & Mulut', doc: 'dr. Maya Anggraini, Sp.KG', time: 'Senin - Jumat (16:00 - 20:00)', quota: '20 / 14 Pasien', status: '● Beroperasi', statCol: SUCCESS, y: 464 },
  { poli: 'Poli Jantung & Pembuluh Darah', doc: 'dr. Hendra Kurnia, Sp.JP', time: 'Selasa & Kamis (09:00 - 13:00)', quota: '15 / 12 Pasien', status: '● Beroperasi', statCol: SUCCESS, y: 534 },
  { poli: 'Poli Saraf (Neurologi)', doc: 'dr. Anita Wijaya, Sp.S', time: 'Rabu & Jumat (13:00 - 17:00)', quota: '15 / 10 Pasien', status: '● Beroperasi', statCol: SUCCESS, y: 604 },
  { poli: 'Poli Umum & UGD 24 Jam', doc: 'dr. Rendy Wijaya & Tim', time: 'Setiap Hari (24 Jam Non-Stop)', quota: 'Tanpa Batas Kuota', status: '● Siaga 24 Jam', statCol: CYAN, y: 674 }
];

adminRows.forEach(r => {
  b.createRect({ name: `Row ${r.poli}`, parent: s10, x: 48, y: r.y, width: 1344, height: 58, fill: '#FFFFFF', radius: 8, stroke: BORDER });
  b.createText({ text: r.poli, parent: s10, x: 68, y: r.y + 20, fontSize: 12, color: TEXT_MAIN, fontWeight: 'bold' });
  b.createText({ text: r.doc, parent: s10, x: 280, y: r.y + 20, fontSize: 12, color: TEAL });
  b.createText({ text: r.time, parent: s10, x: 540, y: r.y + 20, fontSize: 11, color: '#475569' });
  b.createText({ text: r.quota, parent: s10, x: 800, y: r.y + 20, fontSize: 11, color: TEXT_MAIN, fontWeight: 'bold' });

  b.createRect({ name: 'Badge Stat', parent: s10, x: 1010, y: r.y + 14, width: 140, height: 28, fill: r.statCol === SUCCESS ? '#DCFCE7' : (r.statCol === WARNING ? '#FEF3C7' : TINT), radius: 14 });
  b.createText({ text: r.status, parent: s10, x: 1030, y: r.y + 20, fontSize: 11, color: r.statCol === SUCCESS ? '#166534' : (r.statCol === WARNING ? '#92400E' : TEAL), fontWeight: 'bold' });

  b.createRect({ name: 'Edit Btn', parent: s10, x: 1220, y: r.y + 14, width: 70, height: 28, fill: TINT, radius: 6 });
  b.createText({ text: 'Edit', parent: s10, x: 1242, y: r.y + 20, fontSize: 11, color: TEAL, fontWeight: 'bold' });
});


// =================================================================================================
// 11 - AUTH: HALAMAN LOGIN PORTAL (MULTI-ROLE SWITCHER) (x: 3080, y: 2120)
// =================================================================================================
const s11 = b.createFrame({ name: '11 - Auth: Halaman Login Portal (Multi-Role Switcher)', x: 3080, y: 2120, width: 1440, height: 960, fill: '#F3F6F9' });

// Left Hero Banner
b.createRect({ name: 'Hero Left Panel', parent: s11, x: 0, y: 0, width: 720, height: 960, fill: TEAL });
b.createEllipse({ name: 'Decor Sphere 1', parent: s11, x: 480, y: 80, width: 340, height: 340, fill: CYAN, opacity: 0.3 });
b.createEllipse({ name: 'Decor Sphere 2', parent: s11, x: -80, y: 600, width: 420, height: 420, fill: NAVY, opacity: 0.4 });

b.createRect({ name: 'Hero Logo Cross', parent: s11, x: 80, y: 120, width: 56, height: 56, fill: '#FFFFFF', radius: 14 });
b.createText({ text: '✚', parent: s11, x: 94, y: 128, fontSize: 32, color: TEAL, fontWeight: 'bold' });
b.createText({ text: 'Klinik Maristella', parent: s11, x: 150, y: 134, fontSize: 26, color: '#FFFFFF', fontWeight: 'bold' });

b.createText({ text: 'Sistem Informasi Manajemen\nKlinik Pratama Terpadu', parent: s11, x: 80, y: 280, fontSize: 36, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Solusi digital terintegrasi untuk pendaftaran pasien online,\npemeriksaan rekam medis elektronik (RME), dan jadwal praktik dokter.', parent: s11, x: 80, y: 390, fontSize: 15, color: '#E0F2FE' });

const features = [
  '🛡️ Sesuai Standar Kemenkes RI & Rekam Medis Elektronik (RME)',
  '⚡ Antrean Real-time dengan Estimasi Waktu Panggilan Presisi',
  '👨‍⚕️ Portal Khusus Dokter Spesialis dengan Format SOAP Lengkap',
  '🔒 Keamanan Data Enkripsi End-to-End'
];

features.forEach((feat, idx) => {
  b.createRect({ name: 'Feature Card ' + idx, parent: s11, x: 80, y: 490 + (idx * 64), width: 520, height: 48, fill: NAVY, opacity: 0.6, radius: 10 });
  b.createText({ text: feat, parent: s11, x: 96, y: 504 + (idx * 64), fontSize: 13, color: '#FFFFFF', fontWeight: 'medium' });
});

// Right Form Container
b.createRect({ name: 'Form Container Card', parent: s11, x: 860, y: 140, width: 440, height: 680, fill: '#FFFFFF', radius: 24, stroke: BORDER });
b.createText({ text: 'Selamat Datang', parent: s11, x: 900, y: 180, fontSize: 24, color: TEXT_MAIN, fontWeight: 'bold' });
b.createText({ text: 'Silakan masuk ke akun Klinik Maristella Anda', parent: s11, x: 900, y: 214, fontSize: 13, color: TEXT_MUTED });

// Input 1: Email / No RM
b.createText({ text: 'Email atau Nomor Rekam Medis (RM)', parent: s11, x: 900, y: 260, fontSize: 12, color: '#334155', fontWeight: 'bold' });
b.createRect({ name: 'Input Email BG', parent: s11, x: 900, y: 284, width: 360, height: 46, fill: BG_PAGE, radius: 8, stroke: '#CBD5E1' });
b.createText({ text: 'contoh: pasien@maristella.com / KM-2026-08892', parent: s11, x: 916, y: 298, fontSize: 12, color: '#94A3B8' });

// Input 2: Password
b.createText({ text: 'Kata Sandi (Password)', parent: s11, x: 900, y: 350, fontSize: 12, color: '#334155', fontWeight: 'bold' });
b.createRect({ name: 'Input Pass BG', parent: s11, x: 900, y: 374, width: 360, height: 46, fill: BG_PAGE, radius: 8, stroke: '#CBD5E1' });
b.createText({ text: '••••••••••••', parent: s11, x: 916, y: 390, fontSize: 14, color: TEXT_MAIN });
b.createText({ text: '👁️', parent: s11, x: 1226, y: 388, fontSize: 14 });

// Options: Remember Me & Forgot Password
b.createRect({ name: 'Checkbox Remember', parent: s11, x: 900, y: 436, width: 16, height: 16, fill: TINT, radius: 4, stroke: TEAL });
b.createText({ text: 'Ingat saya', parent: s11, x: 924, y: 436, fontSize: 12, color: '#475569' });
b.createText({ text: 'Lupa Kata Sandi?', parent: s11, x: 1160, y: 436, fontSize: 12, color: CYAN, fontWeight: 'bold' });

// Submit Button
b.createRect({ name: 'Submit Login Button', parent: s11, x: 900, y: 476, width: 360, height: 48, fill: TEAL, radius: 10 });
b.createText({ text: 'Masuk ke Portal Layanan ➜', parent: s11, x: 990, y: 490, fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' });

// Quick Login Demo Divider
b.createRect({ name: 'Divider Line', parent: s11, x: 900, y: 554, width: 360, height: 1, fill: BORDER });
b.createText({ text: 'Atau Masuk Cepat Sebagai Demo', parent: s11, x: 980, y: 566, fontSize: 11, color: '#94A3B8' });

// Quick Switcher Buttons
b.createRect({ name: 'Demo Pasien Btn', parent: s11, x: 900, y: 596, width: 110, height: 38, fill: TINT, radius: 8, stroke: '#BFDBFE' });
b.createText({ text: '👤 Pasien', parent: s11, x: 926, y: 608, fontSize: 12, color: TEAL, fontWeight: 'bold' });

b.createRect({ name: 'Demo Dokter Btn', parent: s11, x: 1025, y: 596, width: 110, height: 38, fill: '#F0FDF4', radius: 8, stroke: '#BBF7D0' });
b.createText({ text: '👨‍⚕️ Dokter', parent: s11, x: 1050, y: 608, fontSize: 12, color: '#166534', fontWeight: 'bold' });

b.createRect({ name: 'Demo Admin Btn', parent: s11, x: 1150, y: 596, width: 110, height: 38, fill: '#FAF5FF', radius: 8, stroke: '#E9D5FF' });
b.createText({ text: '⚙️ Admin', parent: s11, x: 1176, y: 608, fontSize: 12, color: '#7E22CE', fontWeight: 'bold' });

b.createText({ text: 'Belum punya akun? Pendaftaran Pasien Baru di Klinik Maristella', parent: s11, x: 900, y: 660, fontSize: 11, color: CYAN });


// =================================================================================================
// 12 - SYSTEM: KLINIK MARISTELLA UI DESIGN SYSTEM & TOKENS (x: 4620, y: 2120)
// =================================================================================================
const s12 = b.createFrame({ name: '12 - System: Klinik Maristella UI Design System & Tokens', x: 4620, y: 2120, width: 1440, height: 960, fill: BG_PAGE });

// Topbar Design System
b.createRect({ name: 'Tokens Topbar', parent: s12, x: 0, y: 0, width: 1440, height: 72, fill: TEAL });
b.createText({ text: '✚ Klinik Maristella — UI Design System & Component Tokens', parent: s12, x: 40, y: 24, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });

// Palette Swatches Section
b.createText({ text: 'Brand & Functional Color Palette', parent: s12, x: 40, y: 100, fontSize: 16, color: TEXT_MAIN, fontWeight: 'bold' });

const colors = [
  { name: 'Primary Teal', hex: TEAL, textCol: '#FFFFFF', x: 40 },
  { name: 'Primary Deep Navy', hex: NAVY, textCol: '#FFFFFF', x: 210 },
  { name: 'Cyan Accent', hex: CYAN, textCol: '#FFFFFF', x: 380 },
  { name: 'Blue Tint', hex: TINT, textCol: TEAL, x: 550 },
  { name: 'Emerald Success', hex: SUCCESS, textCol: '#FFFFFF', x: 720 },
  { name: 'Amber Warning', hex: WARNING, textCol: '#FFFFFF', x: 890 },
  { name: 'Rose Danger', hex: DANGER, textCol: '#FFFFFF', x: 1060 },
  { name: 'Surface White', hex: '#FFFFFF', textCol: TEXT_MAIN, x: 1230 }
];

colors.forEach(col => {
  b.createRect({ name: `Swatch ${col.name}`, parent: s12, x: col.x, y: 130, width: 150, height: 90, fill: col.hex, radius: 10, stroke: '#CBD5E1' });
  b.createText({ text: col.name, parent: s12, x: col.x + 12, y: 146, fontSize: 11, color: col.textCol, fontWeight: 'bold' });
  b.createText({ text: col.hex, parent: s12, x: col.x + 12, y: 188, fontSize: 11, color: col.textCol });
});

// Typography Scale Section
b.createText({ text: 'Typography Hierarchy (Inter / Plus Jakarta Sans)', parent: s12, x: 40, y: 260, fontSize: 16, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Type Scale Box', parent: s12, x: 40, y: 290, width: 660, height: 360, fill: '#FFFFFF', radius: 14, stroke: BORDER });

b.createText({ text: 'Display Bold (32px) — Klinik Maristella', parent: s12, x: 64, y: 314, fontSize: 26, color: TEAL, fontWeight: 'bold' });
b.createText({ text: 'Heading 1 (22px) — Pelayanan Rawat Jalan & Poli Spesialis', parent: s12, x: 64, y: 364, fontSize: 20, color: TEXT_MAIN, fontWeight: 'bold' });
b.createText({ text: 'Heading 2 (16px) — dr. Sarah Jenkins, Sp.PD (Internis)', parent: s12, x: 64, y: 410, fontSize: 16, color: '#334155', fontWeight: 'bold' });
b.createText({ text: 'Body Regular (14px) — Pasien mengeluhkan demam sejak 3 hari yang lalu disertai batuk pilek.', parent: s12, x: 64, y: 454, fontSize: 14, color: '#475569' });
b.createText({ text: 'Caption Medium (12px) — No. Rekam Medis: KM-2026-08892', parent: s12, x: 64, y: 494, fontSize: 12, color: TEXT_MUTED });
b.createText({ text: 'Small Badge (10px) — STATUS ANTREAN AKTIF HARI INI', parent: s12, x: 64, y: 534, fontSize: 10, color: '#94A3B8', fontWeight: 'bold' });

// UI Components Preview Section
b.createText({ text: 'UI Component Library', parent: s12, x: 740, y: 260, fontSize: 16, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Components Box', parent: s12, x: 740, y: 290, width: 660, height: 360, fill: '#FFFFFF', radius: 14, stroke: BORDER });

// Buttons
b.createText({ text: 'Buttons', parent: s12, x: 764, y: 310, fontSize: 13, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Btn Primary', parent: s12, x: 764, y: 334, width: 140, height: 40, fill: TEAL, radius: 8 });
b.createText({ text: 'Primary Button', parent: s12, x: 788, y: 346, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ name: 'Btn Accent', parent: s12, x: 920, y: 334, width: 140, height: 40, fill: CYAN, radius: 8 });
b.createText({ text: 'Cyan Accent', parent: s12, x: 954, y: 346, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ name: 'Btn Outline', parent: s12, x: 1076, y: 334, width: 140, height: 40, fill: '#FFFFFF', radius: 8, stroke: TEAL });
b.createText({ text: 'Outline Button', parent: s12, x: 1104, y: 346, fontSize: 12, color: TEAL, fontWeight: 'bold' });

b.createRect({ name: 'Btn Danger', parent: s12, x: 1232, y: 334, width: 140, height: 40, fill: DANGER, radius: 8 });
b.createText({ text: 'Danger Button', parent: s12, x: 1258, y: 346, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });

// Badges
b.createText({ text: 'Status & Category Badges', parent: s12, x: 764, y: 400, fontSize: 13, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Badge Green', parent: s12, x: 764, y: 424, width: 110, height: 26, fill: '#DCFCE7', radius: 13 });
b.createText({ text: '● Sedang Praktik', parent: s12, x: 778, y: 430, fontSize: 11, color: '#166534', fontWeight: 'bold' });

b.createRect({ name: 'Badge Amber', parent: s12, x: 890, y: 424, width: 110, height: 26, fill: '#FEF3C7', radius: 13 });
b.createText({ text: '⏳ Menunggu', parent: s12, x: 908, y: 430, fontSize: 11, color: '#92400E', fontWeight: 'bold' });

b.createRect({ name: 'Badge Red', parent: s12, x: 1016, y: 424, width: 120, height: 26, fill: '#FEE2E2', radius: 13 });
b.createText({ text: '⚠️ Alergi Obat', parent: s12, x: 1034, y: 430, fontSize: 11, color: '#991B1B', fontWeight: 'bold' });

b.createRect({ name: 'Badge Blue', parent: s12, x: 1152, y: 424, width: 110, height: 26, fill: TINT, radius: 13 });
b.createText({ text: 'No Antrean: A-014', parent: s12, x: 1162, y: 430, fontSize: 10, color: TEAL, fontWeight: 'bold' });

// Form Controls
b.createText({ text: 'Form Inputs', parent: s12, x: 764, y: 480, fontSize: 13, color: TEXT_MAIN, fontWeight: 'bold' });
b.createRect({ name: 'Input Normal', parent: s12, x: 764, y: 504, width: 280, height: 42, fill: BG_PAGE, radius: 8, stroke: '#CBD5E1' });
b.createText({ text: 'Default input state...', parent: s12, x: 780, y: 516, fontSize: 12, color: '#94A3B8' });

b.createRect({ name: 'Input Focused', parent: s12, x: 1060, y: 504, width: 280, height: 42, fill: '#FFFFFF', radius: 8, stroke: TEAL });
b.createText({ text: 'Active focused state |', parent: s12, x: 1076, y: 516, fontSize: 12, color: TEAL });


// -------------------------------------------------------------------------------------------------
// FINALIZE & EXPORT DOCUMENT
// -------------------------------------------------------------------------------------------------
const doc = b.buildDocument();
const jsonPath = path.join(__dirname, '..', 'klinik_maristella_master.json');
fs.writeFileSync(jsonPath, JSON.stringify(doc, null, 2));

console.log(`Master document generated successfully!`);
console.log(`Total nodes created: ${Object.keys(doc.nodes).length}`);
console.log(`Saved JSON to: ${jsonPath}`);
