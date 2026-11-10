const fs = require('fs');
const path = require('path');

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
  constructor(name = 'Klinik Gabe Medica - UI Design System') {
    this.name = name;
    this.nextId = 2;
    this.nodes = {};
    this.pageId = 1;
    this.nodes['1'] = {
      id: 1,
      type: 'page',
      name: 'Klinik Gabe Medica',
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
      fills: opts.fill ? solidFill(opts.fill) : (opts.fills || solidFill('#FFFFFF')),
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
      fills: opts.fill ? solidFill(opts.fill) : (opts.fills || solidFill('#EFF6FF')),
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
      fills: opts.fill ? solidFill(opts.fill) : (opts.fills || solidFill('#0284C7')),
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
    const approxHeight = opts.height || (fontSize * 1.3);

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

// -------------------------------------------------------------
// BUILD SCREENS
// -------------------------------------------------------------
const b = new FigCraftBuilder('Klinik Gabe Medica - Master UI');

// =========================================================================
// SCREEN 1: Beranda / Dashboard Pasien (1440 x 960) at (0, 0)
// =========================================================================
const s1 = b.createFrame({
  name: '01 - Beranda / Dashboard Pasien',
  x: 0,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

// Sidebar
const sb1 = b.createRect({
  name: 'Sidebar Background',
  parent: s1,
  x: 0,
  y: 0,
  width: 240,
  height: 960,
  fill: '#FFFFFF',
  stroke: '#E2E8F0'
});

// Sidebar Logo
b.createEllipse({ name: 'Logo Icon', parent: s1, x: 24, y: 24, width: 36, height: 36, fill: '#012D68' });
b.createText({ text: '+', parent: s1, x: 36, y: 28, fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Gabe Medica', parent: s1, x: 70, y: 28, fontSize: 18, color: '#012D68', fontWeight: 'bold' });
b.createText({ text: 'Klinik Pratama Rawat Inap', parent: s1, x: 70, y: 48, fontSize: 10, color: '#94A3B8' });

// Sidebar Navigation
const navItems = [
  { label: 'Beranda', active: true, y: 100 },
  { label: 'Jadwal Dokter', active: false, y: 148 },
  { label: 'Rekam Medis', active: false, y: 196 },
  { label: 'Pengaturan', active: false, y: 244 },
  { label: 'Portal Dokter', active: false, y: 310, isSpecial: true },
  { label: 'Portal Admin', active: false, y: 358, isAdmin: true }
];

navItems.forEach(item => {
  if (item.active) {
    b.createRect({ name: 'Nav Active Pill', parent: s1, x: 16, y: item.y, width: 208, height: 40, fill: '#EFF6FF', radius: 10 });
    b.createRect({ name: 'Active Indicator', parent: s1, x: 16, y: item.y + 8, width: 4, height: 24, fill: '#012D68', radius: 2 });
    b.createText({ text: item.label, parent: s1, x: 36, y: item.y + 11, fontSize: 14, color: '#012D68', fontWeight: 'bold' });
  } else if (item.isSpecial) {
    b.createRect({ name: 'Nav Doctor Pill', parent: s1, x: 16, y: item.y, width: 208, height: 40, fill: '#EFF6FF', radius: 10, stroke: '#BFDBFE' });
    b.createText({ text: '👨‍⚕️ ' + item.label, parent: s1, x: 28, y: item.y + 11, fontSize: 13, color: '#012D68', fontWeight: 'bold' });
  } else if (item.isAdmin) {
    b.createRect({ name: 'Nav Admin Pill', parent: s1, x: 16, y: item.y, width: 208, height: 40, fill: '#FAF5FF', radius: 10, stroke: '#E9D5FF' });
    b.createText({ text: '⚙️ ' + item.label, parent: s1, x: 28, y: item.y + 11, fontSize: 13, color: '#7E22CE', fontWeight: 'bold' });
  } else {
    b.createText({ text: item.label, parent: s1, x: 36, y: item.y + 11, fontSize: 14, color: '#475569' });
  }
});

// Sidebar User Profile at bottom
b.createRect({ name: 'User Card Mini', parent: s1, x: 16, y: 880, width: 208, height: 60, fill: '#F8FAFC', radius: 12, stroke: '#E2E8F0' });
b.createEllipse({ name: 'User Avatar', parent: s1, x: 28, y: 890, width: 38, height: 38, fill: '#0284C7' });
b.createText({ text: 'BP', parent: s1, x: 38, y: 900, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Budi Prasetyo', parent: s1, x: 74, y: 894, fontSize: 13, color: '#0F172A', fontWeight: 'bold' });
b.createText({ text: 'Pasien Umum', parent: s1, x: 74, y: 912, fontSize: 11, color: '#64748B' });

// Topbar Header
const tb1 = b.createRect({ name: 'Topbar Background', parent: s1, x: 240, y: 0, width: 1200, height: 72, fill: '#FFFFFF', stroke: '#E2E8F0' });
b.createRect({ name: 'Search Input', parent: s1, x: 272, y: 16, width: 440, height: 42, fill: '#F8FAFC', radius: 21, stroke: '#E2E8F0' });
b.createText({ text: '🔍 Cari dokter spesialis atau layanan...', parent: s1, x: 294, y: 28, fontSize: 13, color: '#94A3B8' });

b.createEllipse({ name: 'Theme Toggle', parent: s1, x: 1310, y: 18, width: 36, height: 36, fill: '#F1F5F9' });
b.createText({ text: '🌙', parent: s1, x: 1320, y: 26, fontSize: 14 });
b.createEllipse({ name: 'Bell Notif', parent: s1, x: 1360, y: 18, width: 36, height: 36, fill: '#F1F5F9' });
b.createText({ text: '🔔', parent: s1, x: 1370, y: 26, fontSize: 14 });
b.createEllipse({ name: 'Red Dot', parent: s1, x: 1386, y: 20, width: 8, height: 8, fill: '#EF4444' });

// Hero Banner
b.createRect({ name: 'Hero Banner Card', parent: s1, x: 272, y: 96, width: 780, height: 180, fill: '#012D68', radius: 20 });
b.createText({ text: 'Selamat Datang di Klinik Gabe Medica', parent: s1, x: 304, y: 128, fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Pelayanan kesehatan keluarga modern, cepat, dan terpercaya dengan dokter spesialis berpengalaman.', parent: s1, x: 304, y: 168, fontSize: 13, color: '#DBEAFE' });
b.createRect({ name: 'CTA Buat Janji', parent: s1, x: 304, y: 204, width: 180, height: 42, fill: '#FFFFFF', radius: 10 });
b.createText({ text: 'Buat Janji Temu ➜', parent: s1, x: 332, y: 216, fontSize: 13, color: '#012D68', fontWeight: 'bold' });

// Active Queue Card
b.createRect({ name: 'Queue Card', parent: s1, x: 272, y: 296, width: 780, height: 130, fill: '#FFFFFF', radius: 16, stroke: '#E2E8F0' });
b.createRect({ name: 'Queue Status Left Bar', parent: s1, x: 272, y: 296, width: 8, height: 130, fill: '#F59E0B', radius: 8 });
b.createText({ text: 'STATUS ANTREAN AKTIF HARI INI', parent: s1, x: 304, y: 316, fontSize: 12, color: '#64748B', fontWeight: 'bold' });
b.createText({ text: 'Poli Umum — dr. Sarah Jenkins, Sp.PD', parent: s1, x: 304, y: 340, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });
b.createText({ text: 'Perkiraan Panggilan: 10:15 WIB (Sisa 2 Pasien lagi)', parent: s1, x: 304, y: 374, fontSize: 13, color: '#475569' });

b.createRect({ name: 'Queue Number Badge', parent: s1, x: 910, y: 316, width: 118, height: 86, fill: '#EFF6FF', radius: 12, stroke: '#BFDBFE' });
b.createText({ text: 'NO ANTREAN', parent: s1, x: 932, y: 328, fontSize: 10, color: '#012D68', fontWeight: 'bold' });
b.createText({ text: 'A-014', parent: s1, x: 928, y: 348, fontSize: 32, color: '#012D68', fontWeight: 'bold' });

// Quick Action Grid (4 Cards)
const quickActions = [
  { title: 'Pendaftaran Poli', subtitle: 'Pilih poli & jadwal dokter', icon: '📝', x: 272 },
  { title: 'Jadwal Dokter', subtitle: 'Lihat kalender praktik', icon: '📅', x: 472 },
  { title: 'Rekam Medis', subtitle: 'Riwayat diagnosa & resep', icon: '📋', x: 672 },
  { title: 'Kontak Darurat', subtitle: 'Unit ambulans 24 jam', icon: '🚑', x: 872 }
];

quickActions.forEach(qa => {
  b.createRect({ name: `Quick Card ${qa.title}`, parent: s1, x: qa.x, y: 446, width: 180, height: 110, fill: '#FFFFFF', radius: 14, stroke: '#E2E8F0' });
  b.createEllipse({ name: 'Icon BG', parent: s1, x: qa.x + 16, y: 462, width: 36, height: 36, fill: '#EFF6FF' });
  b.createText({ text: qa.icon, parent: s1, x: qa.x + 24, y: 470, fontSize: 16 });
  b.createText({ text: qa.title, parent: s1, x: qa.x + 16, y: 508, fontSize: 13, color: '#0F172A', fontWeight: 'bold' });
  b.createText({ text: qa.subtitle, parent: s1, x: qa.x + 16, y: 526, fontSize: 10, color: '#64748B' });
});

// Doctors On Duty Section
b.createText({ text: 'Dokter Praktik Hari Ini', parent: s1, x: 272, y: 580, fontSize: 18, color: '#0F172A', fontWeight: 'bold' });

const doctors = [
  { name: 'dr. Sarah Jenkins, Sp.PD', spec: 'Poli Penyakit Dalam', time: '08:00 - 14:00 WIB', rating: '⭐ 4.9', x: 272 },
  { name: 'dr. Budi Santoso, Sp.A', spec: 'Poli Anak & Tumbuh Kembang', time: '13:00 - 18:00 WIB', rating: '⭐ 4.8', x: 532 },
  { name: 'dr. Maya Anggraini, Sp.KG', spec: 'Poli Gigi & Mulut', time: '16:00 - 20:00 WIB', rating: '⭐ 5.0', x: 792 }
];

doctors.forEach(doc => {
  b.createRect({ name: `Doctor Card ${doc.name}`, parent: s1, x: doc.x, y: 610, width: 246, height: 170, fill: '#FFFFFF', radius: 14, stroke: '#E2E8F0' });
  b.createEllipse({ name: 'Doc Avatar', parent: s1, x: doc.x + 16, y: 626, width: 44, height: 44, fill: '#012D68' });
  b.createText({ text: '🩺', parent: s1, x: doc.x + 28, y: 636, fontSize: 18 });
  b.createText({ text: doc.name, parent: s1, x: doc.x + 16, y: 680, fontSize: 13, color: '#0F172A', fontWeight: 'bold' });
  b.createText({ text: doc.spec, parent: s1, x: doc.x + 16, y: 700, fontSize: 11, color: '#0284C7' });
  b.createText({ text: '🕒 ' + doc.time, parent: s1, x: doc.x + 16, y: 722, fontSize: 11, color: '#64748B' });
  b.createRect({ name: 'Booking Small Button', parent: s1, x: doc.x + 16, y: 742, width: 214, height: 26, fill: '#EFF6FF', radius: 6 });
  b.createText({ text: 'Daftar Konsultasi', parent: s1, x: doc.x + 72, y: 748, fontSize: 11, color: '#012D68', fontWeight: 'bold' });
});

// Right Panel (Mini Calendar & Hotline)
b.createRect({ name: 'Right Panel BG', parent: s1, x: 1080, y: 96, width: 336, height: 830, fill: '#FFFFFF', radius: 16, stroke: '#E2E8F0' });
b.createText({ text: 'Kalender Medis', parent: s1, x: 1104, y: 120, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ name: 'Mini Cal Box', parent: s1, x: 1104, y: 150, width: 288, height: 180, fill: '#F8FAFC', radius: 12, stroke: '#E2E8F0' });
b.createText({ text: 'November 2026', parent: s1, x: 1190, y: 166, fontSize: 14, color: '#012D68', fontWeight: 'bold' });
b.createText({ text: 'Min   Sen   Sel   Rab   Kam   Jum   Sab', parent: s1, x: 1118, y: 196, fontSize: 11, color: '#94A3B8' });
b.createText({ text: ' 1     2     3     4     5     6     7', parent: s1, x: 1118, y: 224, fontSize: 11, color: '#64748B' });
b.createText({ text: ' 8    [9]   10    11    12    13    14', parent: s1, x: 1118, y: 252, fontSize: 11, color: '#012D68', fontWeight: 'bold' });

b.createText({ text: 'Janji Temu Mendatang', parent: s1, x: 1104, y: 350, fontSize: 14, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ name: 'Appointment Card', parent: s1, x: 1104, y: 376, width: 288, height: 80, fill: '#EFF6FF', radius: 12, stroke: '#BFDBFE' });
b.createText({ text: 'Konsultasi Rutin', parent: s1, x: 1120, y: 390, fontSize: 12, color: '#012D68', fontWeight: 'bold' });
b.createText({ text: 'dr. Sarah Jenkins • Poli Penyakit Dalam', parent: s1, x: 1120, y: 408, fontSize: 11, color: '#475569' });
b.createText({ text: '📅 Selasa, 10 Nov 2026 • 10:00 WIB', parent: s1, x: 1120, y: 426, fontSize: 11, color: '#0284C7' });

// Emergency Hotline Box
b.createRect({ name: 'Emergency Card', parent: s1, x: 1104, y: 720, width: 288, height: 180, fill: '#FFF1F2', radius: 14, stroke: '#FECDD3' });
b.createText({ text: '🚨 Layanan Gawat Darurat', parent: s1, x: 1120, y: 742, fontSize: 14, color: '#E11D48', fontWeight: 'bold' });
b.createText({ text: 'UGD dan Ambulans Klinik Gabe Medica siaga 24 jam untuk kondisi darurat medis.', parent: s1, x: 1120, y: 768, fontSize: 11, color: '#881337' });
b.createRect({ name: 'Call Button', parent: s1, x: 1120, y: 820, width: 256, height: 42, fill: '#E11D48', radius: 10 });
b.createText({ text: '📞 Hubungi (021) 555-0199', parent: s1, x: 1152, y: 832, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });


// =========================================================================
// SCREEN 2: Portal Dokter - Pemeriksaan SOAP (1440 x 960) at (1540, 0)
// =========================================================================
const s2 = b.createFrame({
  name: '02 - Portal Dokter (SOAP & Antrean)',
  x: 1540,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

// Topbar Dokter
b.createRect({ name: 'Doctor Header BG', parent: s2, x: 0, y: 0, width: 1440, height: 68, fill: '#012D68' });
b.createText({ text: '+ Gabe Medica', parent: s2, x: 32, y: 22, fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' });
b.createRect({ name: 'Portal Tag', parent: s2, x: 180, y: 20, width: 110, height: 28, fill: '#083E88', radius: 14 });
b.createText({ text: 'PORTAL DOKTER', parent: s2, x: 192, y: 26, fontSize: 11, color: '#93C5FD', fontWeight: 'bold' });

b.createEllipse({ name: 'Doctor Avatar', parent: s2, x: 1210, y: 14, width: 40, height: 40, fill: '#EFF6FF' });
b.createText({ text: 'BS', parent: s2, x: 1220, y: 24, fontSize: 14, color: '#012D68', fontWeight: 'bold' });
b.createText({ text: 'dr. Budi Santoso, Sp.PD', parent: s2, x: 1260, y: 18, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: '🟢 Sedang Praktik Aktif', parent: s2, x: 1260, y: 36, fontSize: 11, color: '#86EFAC' });

// Left Patient Queue List
b.createRect({ name: 'Queue Container', parent: s2, x: 24, y: 88, width: 360, height: 840, fill: '#FFFFFF', radius: 16, stroke: '#E2E8F0' });
b.createText({ text: 'Antrean Pasien Hari Ini', parent: s2, x: 44, y: 110, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ name: 'Badge Total Antrean', parent: s2, x: 280, y: 108, width: 80, height: 26, fill: '#EFF6FF', radius: 13 });
b.createText({ text: 'Total: 24', parent: s2, x: 298, y: 114, fontSize: 12, color: '#012D68', fontWeight: 'bold' });

// Queue Cards
const patientQueues = [
  { no: '014', name: 'Ny. Siti Rahma', age: '34 Th', status: 'Sedang Diperiksa', isCurrent: true, rm: 'RM-2026-08892', y: 150 },
  { no: '015', name: 'Tn. Ahmad Fauzi', age: '45 Th', status: 'Menunggu', isCurrent: false, rm: 'RM-2026-07741', y: 250 },
  { no: '016', name: 'An. Rizky Pratama', age: '8 Th', status: 'Menunggu', isCurrent: false, rm: 'RM-2026-09102', y: 340 },
  { no: '017', name: 'Ibu Ratna Dewi', age: '52 Th', status: 'Menunggu', isCurrent: false, rm: 'RM-2026-06511', y: 430 }
];

patientQueues.forEach(pq => {
  if (pq.isCurrent) {
    b.createRect({ name: 'Current Patient Card', parent: s2, x: 40, y: pq.y, width: 328, height: 86, fill: '#EFF6FF', radius: 12, stroke: '#012D68' });
    b.createEllipse({ name: 'Queue Num BG', parent: s2, x: 54, y: pq.y + 14, width: 36, height: 36, fill: '#012D68' });
    b.createText({ text: pq.no, parent: s2, x: 60, y: pq.y + 24, fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' });
    b.createText({ text: pq.name + ' (' + pq.age + ')', parent: s2, x: 100, y: pq.y + 16, fontSize: 13, color: '#012D68', fontWeight: 'bold' });
    b.createText({ text: pq.rm + ' • Keluhan: Demam 3 Hari', parent: s2, x: 100, y: pq.y + 36, fontSize: 11, color: '#475569' });
    b.createRect({ name: 'Status Active Badge', parent: s2, x: 100, y: pq.y + 56, width: 120, height: 20, fill: '#DCFCE7', radius: 10 });
    b.createText({ text: '● Sedang Diperiksa', parent: s2, x: 112, y: pq.y + 60, fontSize: 10, color: '#166534', fontWeight: 'bold' });
  } else {
    b.createRect({ name: 'Waiting Patient Card', parent: s2, x: 40, y: pq.y, width: 328, height: 76, fill: '#FFFFFF', radius: 12, stroke: '#E2E8F0' });
    b.createEllipse({ name: 'Queue Num Gray', parent: s2, x: 54, y: pq.y + 14, width: 34, height: 34, fill: '#F1F5F9' });
    b.createText({ text: pq.no, parent: s2, x: 62, y: pq.y + 24, fontSize: 13, color: '#475569', fontWeight: 'bold' });
    b.createText({ text: pq.name + ' (' + pq.age + ')', parent: s2, x: 100, y: pq.y + 16, fontSize: 13, color: '#0F172A', fontWeight: 'bold' });
    b.createText({ text: pq.rm + ' • Menunggu di Ruang Tunggu', parent: s2, x: 100, y: pq.y + 38, fontSize: 11, color: '#94A3B8' });
  }
});

// Main Clinical Examination & SOAP Area
b.createRect({ name: 'SOAP Container', parent: s2, x: 404, y: 88, width: 1012, height: 840, fill: '#FFFFFF', radius: 16, stroke: '#E2E8F0' });

// Patient Bio & Vitals Banner
b.createRect({ name: 'Patient Header Strip', parent: s2, x: 424, y: 108, width: 972, height: 84, fill: '#F8FAFC', radius: 12, stroke: '#E2E8F0' });
b.createText({ text: 'Ny. Siti Rahma (34 Th)', parent: s2, x: 444, y: 122, fontSize: 18, color: '#0F172A', fontWeight: 'bold' });
b.createText({ text: 'No. RM: RM-2026-08892  •  Jenis Kelamin: Perempuan  •  Gol. Darah: O+', parent: s2, x: 444, y: 148, fontSize: 12, color: '#64748B' });
b.createRect({ name: 'Allergy Tag', parent: s2, x: 880, y: 122, width: 140, height: 26, fill: '#FEE2E2', radius: 6 });
b.createText({ text: '⚠️ Alergi: Penisilin', parent: s2, x: 894, y: 128, fontSize: 11, color: '#991B1B', fontWeight: 'bold' });

// Vital Signs Pills
const vitals = [
  { label: 'Tekanan Darah', val: '120/80 mmHg', x: 444 },
  { label: 'Denyut Nadi', val: '82 bpm', x: 624 },
  { label: 'Suhu Tubuh', val: '38.4 °C (Demam)', x: 774 },
  { label: 'Berat Badan', val: '58 kg', x: 964 },
  { label: 'Saturasi O2', val: '98%', x: 1124 }
];

b.createRect({ name: 'Vitals Box', parent: s2, x: 424, y: 204, width: 972, height: 60, fill: '#EFF6FF', radius: 10 });
vitals.forEach(v => {
  b.createText({ text: v.label, parent: s2, x: v.x, y: 214, fontSize: 11, color: '#64748B' });
  b.createText({ text: v.val, parent: s2, x: v.x, y: 234, fontSize: 13, color: '#012D68', fontWeight: 'bold' });
});

// SOAP Form Sections
const soapFields = [
  { letter: 'S', title: 'Subjective (Anamnesis / Keluhan Pasien)', desc: 'Pasien mengeluhkan demam menggigil sejak 3 hari yang lalu, disertai pusing kepala, mual, nafsu makan berkurang. Tidak ada batuk pilek.', y: 280, h: 100 },
  { letter: 'O', title: 'Objective (Pemeriksaan Fisik & Penunjang)', desc: 'Keadaan Umum: Tampak sakit sedang. Kesadaran: Compos Mentis. Konjungtiva anemis (-), sklera ikterik (-). Faring hiperemis ringan. Thorax cor/pulmo dalam batas normal.', y: 396, h: 100 },
  { letter: 'A', title: 'Assessment (Diagnosa Medis ICD-10)', desc: 'Diagnosa Kerja: Febris e.c. Viral Infection (ICD-10: A90 / B34.9)\nDiagnosa Banding: Demam Dengue fase awal, Faringitis Akut', y: 512, h: 100 },
  { letter: 'P', title: 'Plan (Terapi, E-Resep & Edukasi Pasien)', desc: '1. Paracetamol 500mg tab 3x1 (prn demam > 38°C)\n2. Curcuma tablet 3x1 p.c\n3. Vitamin C 500mg 1x1\nEdukasi: Minum air putih 2-2.5 liter per hari, kompres hangat, kontrol ulang 3 hari jika demam menetap.', y: 628, h: 130 }
];

soapFields.forEach(f => {
  b.createRect({ name: `SOAP ${f.letter} Card`, parent: s2, x: 424, y: f.y, width: 972, height: f.h, fill: '#FFFFFF', radius: 12, stroke: '#E2E8F0' });
  b.createRect({ name: `SOAP Badge ${f.letter}`, parent: s2, x: 440, y: f.y + 14, width: 28, height: 28, fill: '#012D68', radius: 6 });
  b.createText({ text: f.letter, parent: s2, x: 449, y: f.y + 20, fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' });
  b.createText({ text: f.title, parent: s2, x: 478, y: f.y + 18, fontSize: 13, color: '#012D68', fontWeight: 'bold' });
  b.createText({ text: f.desc, parent: s2, x: 440, y: f.y + 50, fontSize: 12, color: '#334155' });
});

// Action Buttons Footer
b.createRect({ name: 'Save SOAP Button', parent: s2, x: 424, y: 780, width: 260, height: 48, fill: '#012D68', radius: 10 });
b.createText({ text: '✓ Simpan SOAP & Panggil Berikutnya', parent: s2, x: 444, y: 796, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ name: 'Print Prescript Button', parent: s2, x: 700, y: 780, width: 170, height: 48, fill: '#0284C7', radius: 10 });
b.createText({ text: '🖨️ Cetak Resep Obat', parent: s2, x: 724, y: 796, fontSize: 13, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ name: 'Lab Refer Button', parent: s2, x: 886, y: 780, width: 170, height: 48, fill: '#FFFFFF', radius: 10, stroke: '#CBD5E1' });
b.createText({ text: '🧪 Rujuk Laboratorium', parent: s2, x: 906, y: 796, fontSize: 13, color: '#475569', fontWeight: 'bold' });


// =========================================================================
// SCREEN 3: Halaman Login & Autentikasi (1440 x 960) at (3080, 0)
// =========================================================================
const s3 = b.createFrame({
  name: '03 - Halaman Login Portal',
  x: 3080,
  y: 0,
  width: 1440,
  height: 960,
  fill: '#F3F6F9'
});

// Left Hero Banner
b.createRect({ name: 'Hero Left Panel', parent: s3, x: 0, y: 0, width: 720, height: 960, fill: '#012D68' });
b.createEllipse({ name: 'Decor Sphere 1', parent: s3, x: 480, y: 80, width: 340, height: 340, fill: '#083E88' });
b.createEllipse({ name: 'Decor Sphere 2', parent: s3, x: -80, y: 600, width: 420, height: 420, fill: '#001F4D' });

b.createEllipse({ name: 'Hero Logo', parent: s3, x: 80, y: 120, width: 56, height: 56, fill: '#FFFFFF' });
b.createText({ text: '+', parent: s3, x: 98, y: 128, fontSize: 32, color: '#012D68', fontWeight: 'bold' });
b.createText({ text: 'Gabe Medica', parent: s3, x: 150, y: 134, fontSize: 26, color: '#FFFFFF', fontWeight: 'bold' });

b.createText({ text: 'Sistem Informasi Manajemen\nKlinik Pratama Terpadu', parent: s3, x: 80, y: 280, fontSize: 36, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Solusi digital terintegrasi untuk pendaftaran pasien online,\npemeriksaan rekam medis elektronik (RME), dan jadwal praktik dokter.', parent: s3, x: 80, y: 390, fontSize: 15, color: '#BFDBFE' });

const features = [
  '🛡️ Sesuai Standar Kemenkes RI & Rekam Medis Elektronik',
  '⚡ Antrean Real-time dengan Estimasi Waktu Presisi',
  '👨‍⚕️ Portal Khusus Dokter Spesialis dengan Format SOAP Lengkap',
  '🔒 Keamanan Data Enkripsi End-to-End'
];

features.forEach((feat, idx) => {
  b.createRect({ name: 'Feature Card ' + idx, parent: s3, x: 80, y: 490 + (idx * 64), width: 520, height: 48, fill: '#083E88', radius: 10 });
  b.createText({ text: feat, parent: s3, x: 96, y: 504 + (idx * 64), fontSize: 13, color: '#FFFFFF', fontWeight: 'medium' });
});

// Right Form Container
b.createRect({ name: 'Form Container Card', parent: s3, x: 860, y: 140, width: 440, height: 680, fill: '#FFFFFF', radius: 24, stroke: '#E2E8F0' });
b.createText({ text: 'Selamat Datang', parent: s3, x: 900, y: 180, fontSize: 24, color: '#0F172A', fontWeight: 'bold' });
b.createText({ text: 'Silakan masuk ke akun klinik Anda', parent: s3, x: 900, y: 214, fontSize: 13, color: '#64748B' });

// Input 1: Email / No RM
b.createText({ text: 'Email atau Nomor Rekam Medis (RM)', parent: s3, x: 900, y: 260, fontSize: 12, color: '#334155', fontWeight: 'bold' });
b.createRect({ name: 'Input Email BG', parent: s3, x: 900, y: 284, width: 360, height: 46, fill: '#F8FAFC', radius: 8, stroke: '#CBD5E1' });
b.createText({ text: 'contoh: pasien@gabemedica.com', parent: s3, x: 916, y: 298, fontSize: 13, color: '#94A3B8' });

// Input 2: Password
b.createText({ text: 'Kata Sandi (Password)', parent: s3, x: 900, y: 350, fontSize: 12, color: '#334155', fontWeight: 'bold' });
b.createRect({ name: 'Input Pass BG', parent: s3, x: 900, y: 374, width: 360, height: 46, fill: '#F8FAFC', radius: 8, stroke: '#CBD5E1' });
b.createText({ text: '••••••••••••', parent: s3, x: 916, y: 390, fontSize: 14, color: '#0F172A' });
b.createText({ text: '👁️', parent: s3, x: 1226, y: 388, fontSize: 14 });

// Options: Remember Me & Forgot Password
b.createRect({ name: 'Checkbox Remember', parent: s3, x: 900, y: 436, width: 16, height: 16, fill: '#EFF6FF', radius: 4, stroke: '#012D68' });
b.createText({ text: 'Ingat saya', parent: s3, x: 924, y: 436, fontSize: 12, color: '#475569' });
b.createText({ text: 'Lupa Kata Sandi?', parent: s3, x: 1160, y: 436, fontSize: 12, color: '#0284C7', fontWeight: 'bold' });

// Submit Button
b.createRect({ name: 'Submit Login Button', parent: s3, x: 900, y: 476, width: 360, height: 48, fill: '#012D68', radius: 10 });
b.createText({ text: 'Masuk ke Layanan ➜', parent: s3, x: 1010, y: 490, fontSize: 14, color: '#FFFFFF', fontWeight: 'bold' });

// Quick Login Demo Divider
b.createRect({ name: 'Divider Line', parent: s3, x: 900, y: 554, width: 360, height: 1, fill: '#E2E8F0' });
b.createText({ text: 'Atau Masuk Cepat Sebagai Demo', parent: s3, x: 980, y: 566, fontSize: 11, color: '#94A3B8' });

// Quick Switcher Buttons
b.createRect({ name: 'Demo Pasien Btn', parent: s3, x: 900, y: 596, width: 110, height: 38, fill: '#EFF6FF', radius: 8, stroke: '#BFDBFE' });
b.createText({ text: '👤 Pasien', parent: s3, x: 926, y: 608, fontSize: 12, color: '#012D68', fontWeight: 'bold' });

b.createRect({ name: 'Demo Dokter Btn', parent: s3, x: 1025, y: 596, width: 110, height: 38, fill: '#F0FDF4', radius: 8, stroke: '#BBF7D0' });
b.createText({ text: '👨‍⚕️ Dokter', parent: s3, x: 1050, y: 608, fontSize: 12, color: '#166534', fontWeight: 'bold' });

b.createRect({ name: 'Demo Admin Btn', parent: s3, x: 1150, y: 596, width: 110, height: 38, fill: '#FAF5FF', radius: 8, stroke: '#E9D5FF' });
b.createText({ text: '⚙️ Admin', parent: s3, x: 1176, y: 608, fontSize: 12, color: '#7E22CE', fontWeight: 'bold' });

b.createText({ text: 'Belum punya akun? Daftar Pasien Baru di Klinik', parent: s3, x: 940, y: 660, fontSize: 12, color: '#0284C7' });


// =========================================================================
// SCREEN 4: Jadwal Praktik & Kalender (1440 x 960) at (0, 1040)
// =========================================================================
const s4 = b.createFrame({
  name: '04 - Jadwal Praktik & Kalender',
  x: 0,
  y: 1040,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

// Topbar Kalender
b.createRect({ name: 'Calendar Topbar', parent: s4, x: 0, y: 0, width: 1440, height: 72, fill: '#FFFFFF', stroke: '#E2E8F0' });
b.createText({ text: 'Jadwal Praktik Dokter & Booking Antrean', parent: s4, x: 40, y: 24, fontSize: 18, color: '#012D68', fontWeight: 'bold' });

// Poli Filters (Horizontal Tabs)
const poliTabs = [
  { name: 'Semua Poli', active: true, x: 40 },
  { name: 'Poli Penyakit Dalam', active: false, x: 160 },
  { name: 'Poli Anak & Tumbuh Kembang', active: false, x: 330 },
  { name: 'Poli Gigi & Mulut', active: false, x: 550 },
  { name: 'Poli Umum 24 Jam', active: false, x: 710 }
];

poliTabs.forEach(tab => {
  if (tab.active) {
    b.createRect({ name: `Tab ${tab.name}`, parent: s4, x: tab.x, y: 96, width: 110, height: 36, fill: '#012D68', radius: 18 });
    b.createText({ text: tab.name, parent: s4, x: tab.x + 18, y: 106, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });
  } else {
    b.createRect({ name: `Tab ${tab.name}`, parent: s4, x: tab.x, y: 96, width: 160, height: 36, fill: '#FFFFFF', radius: 18, stroke: '#CBD5E1' });
    b.createText({ text: tab.name, parent: s4, x: tab.x + 16, y: 106, fontSize: 12, color: '#475569' });
  }
});

// Weekly Schedule Columns (Senin s/d Sabtu)
const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
days.forEach((day, idx) => {
  const colX = 40 + (idx * 228);
  b.createRect({ name: `Col ${day}`, parent: s4, x: colX, y: 156, width: 216, height: 760, fill: '#FFFFFF', radius: 14, stroke: '#E2E8F0' });
  
  // Day Header
  b.createRect({ name: `Header ${day}`, parent: s4, x: colX, y: 156, width: 216, height: 48, fill: idx === 0 ? '#EFF6FF' : '#F8FAFC', radius: 14 });
  b.createText({ text: day, parent: s4, x: colX + 20, y: 170, fontSize: 14, color: idx === 0 ? '#012D68' : '#0F172A', fontWeight: 'bold' });
  b.createText({ text: `${9 + idx} Nov`, parent: s4, x: colX + 150, y: 172, fontSize: 12, color: '#94A3B8' });

  // Doctor Slot Cards inside day
  b.createRect({ name: `Slot 1 ${day}`, parent: s4, x: colX + 12, y: 220, width: 192, height: 160, fill: '#F8FAFC', radius: 10, stroke: '#E2E8F0' });
  b.createText({ text: 'PAGI (08:00 - 12:00)', parent: s4, x: colX + 24, y: 232, fontSize: 10, color: '#0284C7', fontWeight: 'bold' });
  b.createText({ text: 'dr. Sarah Jenkins', parent: s4, x: colX + 24, y: 254, fontSize: 12, color: '#0F172A', fontWeight: 'bold' });
  b.createText({ text: 'Penyakit Dalam', parent: s4, x: colX + 24, y: 272, fontSize: 11, color: '#64748B' });
  b.createRect({ name: `Badge Slot 1 ${day}`, parent: s4, x: colX + 24, y: 298, width: 168, height: 24, fill: '#DCFCE7', radius: 6 });
  b.createText({ text: 'Tersedia: 8 Kuota', parent: s4, x: colX + 54, y: 304, fontSize: 10, color: '#166534', fontWeight: 'bold' });
  b.createRect({ name: `Book Btn 1 ${day}`, parent: s4, x: colX + 24, y: 330, width: 168, height: 32, fill: '#012D68', radius: 6 });
  b.createText({ text: 'Pilih Jadwal', parent: s4, x: colX + 74, y: 338, fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' });

  b.createRect({ name: `Slot 2 ${day}`, parent: s4, x: colX + 12, y: 400, width: 192, height: 160, fill: '#F8FAFC', radius: 10, stroke: '#E2E8F0' });
  b.createText({ text: 'SORE (16:00 - 20:00)', parent: s4, x: colX + 24, y: 412, fontSize: 10, color: '#D97706', fontWeight: 'bold' });
  b.createText({ text: 'dr. Budi Santoso', parent: s4, x: colX + 24, y: 434, fontSize: 12, color: '#0F172A', fontWeight: 'bold' });
  b.createText({ text: 'Spesialis Anak', parent: s4, x: colX + 24, y: 452, fontSize: 11, color: '#64748B' });
  b.createRect({ name: `Badge Slot 2 ${day}`, parent: s4, x: colX + 24, y: 478, width: 168, height: 24, fill: '#FEF3C7', radius: 6 });
  b.createText({ text: 'Sisa 2 Kuota Terakhir', parent: s4, x: colX + 44, y: 484, fontSize: 10, color: '#92400E', fontWeight: 'bold' });
  b.createRect({ name: `Book Btn 2 ${day}`, parent: s4, x: colX + 24, y: 510, width: 168, height: 32, fill: '#012D68', radius: 6 });
  b.createText({ text: 'Pilih Jadwal', parent: s4, x: colX + 74, y: 518, fontSize: 11, color: '#FFFFFF', fontWeight: 'bold' });
});


// =========================================================================
// SCREEN 5: Rekam Medis Pasien (1440 x 960) at (1540, 1040)
// =========================================================================
const s5 = b.createFrame({
  name: '05 - Rekam Medis Elektronik (RME)',
  x: 1540,
  y: 1040,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

// Topbar Rekam Medis
b.createRect({ name: 'RME Topbar', parent: s5, x: 0, y: 0, width: 1440, height: 72, fill: '#FFFFFF', stroke: '#E2E8F0' });
b.createText({ text: 'Rekam Medis Elektronik Pasien', parent: s5, x: 40, y: 24, fontSize: 18, color: '#012D68', fontWeight: 'bold' });

// Patient Info Banner
b.createRect({ name: 'Patient Profile Box', parent: s5, x: 40, y: 96, width: 1360, height: 110, fill: '#FFFFFF', radius: 16, stroke: '#E2E8F0' });
b.createEllipse({ name: 'RME Avatar', parent: s5, x: 64, y: 120, width: 62, height: 62, fill: '#012D68' });
b.createText({ text: 'BP', parent: s5, x: 80, y: 136, fontSize: 20, color: '#FFFFFF', fontWeight: 'bold' });
b.createText({ text: 'Budi Prasetyo (34 Tahun)', parent: s5, x: 144, y: 124, fontSize: 20, color: '#0F172A', fontWeight: 'bold' });
b.createText({ text: 'No. Rekam Medis: RM-2026-08892  •  NIK: 3171092837490001  •  Gol. Darah: O+', parent: s5, x: 144, y: 156, fontSize: 13, color: '#64748B' });
b.createRect({ name: 'RME Allergy Pill', parent: s5, x: 1180, y: 128, width: 180, height: 32, fill: '#FEE2E2', radius: 8 });
b.createText({ text: '⚠️ Alergi: Amoxicillin', parent: s5, x: 1200, y: 136, fontSize: 12, color: '#991B1B', fontWeight: 'bold' });

// Medical Timeline Header
b.createText({ text: 'Riwayat Kunjungan Medis & Diagnosa', parent: s5, x: 40, y: 236, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });

const visits = [
  {
    date: '02 November 2026',
    doctor: 'dr. Sarah Jenkins, Sp.PD (Poli Penyakit Dalam)',
    diag: 'Dyspepsia Syndrome + Faringitis Akut (ICD-10: K30, J02.9)',
    notes: 'Pasien datang dengan nyeri ulu hati dan nyeri tenggorokan 2 hari. Suhu 37.8 C. Diberikan omeprazole 20mg 2x1 dan paracetamol 500mg 3x1.',
    y: 270
  },
  {
    date: '14 Oktober 2026',
    doctor: 'dr. Maya Anggraini, Sp.KG (Poli Gigi & Mulut)',
    diag: 'Pulpitis Reversible Gigi Molar 1 Kanan Bawah (ICD-10: K04.0)',
    notes: 'Tindakan: Penambalan gigi komposit kelas 1 dan pembersihan karang gigi (scaling) rahang atas dan bawah. Kondisi pasca tindakan baik.',
    y: 430
  },
  {
    date: '18 Agustus 2026',
    doctor: 'dr. Rendy Wijaya (Poli Umum / MCU)',
    diag: 'Medical Check-Up Rutin Tahunan — Hasil Normal',
    notes: 'Gula Darah Puasa: 92 mg/dL, Kolesterol Total: 178 mg/dL, Asam Urat: 5.4 mg/dL. Fungsi ginjal dan hepar dalam batas normal.',
    y: 590
  }
];

visits.forEach(v => {
  b.createRect({ name: `Visit Card ${v.date}`, parent: s5, x: 40, y: v.y, width: 1360, height: 136, fill: '#FFFFFF', radius: 14, stroke: '#E2E8F0' });
  b.createEllipse({ name: 'Dot Timeline', parent: s5, x: 64, y: v.y + 24, width: 14, height: 14, fill: '#012D68' });
  b.createText({ text: v.date, parent: s5, x: 92, y: v.y + 20, fontSize: 14, color: '#012D68', fontWeight: 'bold' });
  b.createText({ text: 'Dokter Pemeriksa: ' + v.doctor, parent: s5, x: 400, y: v.y + 22, fontSize: 13, color: '#64748B' });
  b.createText({ text: 'Diagnosa: ' + v.diag, parent: s5, x: 92, y: v.y + 54, fontSize: 13, color: '#0F172A', fontWeight: 'bold' });
  b.createText({ text: v.notes, parent: s5, x: 92, y: v.y + 82, fontSize: 12, color: '#475569' });
  b.createRect({ name: 'Download PDF Btn', parent: s5, x: 1210, y: v.y + 48, width: 160, height: 38, fill: '#EFF6FF', radius: 8 });
  b.createText({ text: '📄 Unduh Salinan', parent: s5, x: 1240, y: v.y + 60, fontSize: 12, color: '#012D68', fontWeight: 'bold' });
});


// =========================================================================
// SCREEN 6: Design System & Design Tokens (1440 x 960) at (3080, 1040)
// =========================================================================
const s6 = b.createFrame({
  name: '06 - Design System & UI Tokens',
  x: 3080,
  y: 1040,
  width: 1440,
  height: 960,
  fill: '#F8FAFC'
});

// Topbar Design System
b.createRect({ name: 'Tokens Topbar', parent: s6, x: 0, y: 0, width: 1440, height: 72, fill: '#012D68' });
b.createText({ text: 'Gabe Medica — UI Design System & Tokens', parent: s6, x: 40, y: 24, fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' });

// Palette Swatches Section
b.createText({ text: 'Brand & Functional Color Palette', parent: s6, x: 40, y: 100, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });

const colors = [
  { name: 'Primary Navy', hex: '#012D68', textCol: '#FFFFFF', x: 40 },
  { name: 'Primary Dark', hex: '#001F4D', textCol: '#FFFFFF', x: 210 },
  { name: 'Sky Accent', hex: '#0284C7', textCol: '#FFFFFF', x: 380 },
  { name: 'Primary Tint', hex: '#EFF6FF', textCol: '#012D68', x: 550 },
  { name: 'Emerald Success', hex: '#10B981', textCol: '#FFFFFF', x: 720 },
  { name: 'Amber Warning', hex: '#F59E0B', textCol: '#FFFFFF', x: 890 },
  { name: 'Rose Danger', hex: '#F43F5E', textCol: '#FFFFFF', x: 1060 },
  { name: 'Slate Surface', hex: '#FFFFFF', textCol: '#0F172A', x: 1230 }
];

colors.forEach(col => {
  b.createRect({ name: `Swatch ${col.name}`, parent: s6, x: col.x, y: 130, width: 150, height: 90, fill: col.hex, radius: 10, stroke: '#CBD5E1' });
  b.createText({ text: col.name, parent: s6, x: col.x + 12, y: 146, fontSize: 12, color: col.textCol, fontWeight: 'bold' });
  b.createText({ text: col.hex, parent: s6, x: col.x + 12, y: 188, fontSize: 11, color: col.textCol });
});

// Typography Scale Section
b.createText({ text: 'Typography Hierarchy (Inter / Plus Jakarta Sans)', parent: s6, x: 40, y: 260, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ name: 'Type Scale Box', parent: s6, x: 40, y: 290, width: 660, height: 360, fill: '#FFFFFF', radius: 14, stroke: '#E2E8F0' });

b.createText({ text: 'Display Bold (32px) — Sistem Informasi Klinik', parent: s6, x: 64, y: 314, fontSize: 26, color: '#012D68', fontWeight: 'bold' });
b.createText({ text: 'Heading 1 (22px) — Layanan Kesehatan Modern', parent: s6, x: 64, y: 364, fontSize: 20, color: '#0F172A', fontWeight: 'bold' });
b.createText({ text: 'Heading 2 (16px) — Dokter Spesialis Penyakit Dalam', parent: s6, x: 64, y: 410, fontSize: 16, color: '#334155', fontWeight: 'bold' });
b.createText({ text: 'Body Regular (14px) — Pasien mengeluhkan demam sejak 3 hari yang lalu disertai batuk pilek.', parent: s6, x: 64, y: 454, fontSize: 14, color: '#475569' });
b.createText({ text: 'Caption Medium (12px) — No. Rekam Medis: RM-2026-08892', parent: s6, x: 64, y: 494, fontSize: 12, color: '#64748B' });
b.createText({ text: 'Small Badge (10px) — STATUS ANTREAN AKTIF', parent: s6, x: 64, y: 534, fontSize: 10, color: '#94A3B8', fontWeight: 'bold' });

// UI Components Preview Section
b.createText({ text: 'UI Component Library', parent: s6, x: 740, y: 260, fontSize: 16, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ name: 'Components Box', parent: s6, x: 740, y: 290, width: 660, height: 360, fill: '#FFFFFF', radius: 14, stroke: '#E2E8F0' });

// Buttons
b.createText({ text: 'Buttons', parent: s6, x: 764, y: 310, fontSize: 13, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ name: 'Btn Primary', parent: s6, x: 764, y: 334, width: 140, height: 40, fill: '#012D68', radius: 8 });
b.createText({ text: 'Primary Button', parent: s6, x: 788, y: 346, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ name: 'Btn Secondary', parent: s6, x: 920, y: 334, width: 140, height: 40, fill: '#0284C7', radius: 8 });
b.createText({ text: 'Sky Accent', parent: s6, x: 954, y: 346, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });

b.createRect({ name: 'Btn Outline', parent: s6, x: 1076, y: 334, width: 140, height: 40, fill: '#FFFFFF', radius: 8, stroke: '#012D68' });
b.createText({ text: 'Outline Button', parent: s6, x: 1104, y: 346, fontSize: 12, color: '#012D68', fontWeight: 'bold' });

b.createRect({ name: 'Btn Danger', parent: s6, x: 1232, y: 334, width: 140, height: 40, fill: '#F43F5E', radius: 8 });
b.createText({ text: 'Danger Button', parent: s6, x: 1258, y: 346, fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' });

// Badges
b.createText({ text: 'Status & Category Badges', parent: s6, x: 764, y: 400, fontSize: 13, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ name: 'Badge Green', parent: s6, x: 764, y: 424, width: 110, height: 26, fill: '#DCFCE7', radius: 13 });
b.createText({ text: '● Sedang Praktik', parent: s6, x: 778, y: 430, fontSize: 11, color: '#166534', fontWeight: 'bold' });

b.createRect({ name: 'Badge Amber', parent: s6, x: 890, y: 424, width: 110, height: 26, fill: '#FEF3C7', radius: 13 });
b.createText({ text: '⏳ Menunggu', parent: s6, x: 908, y: 430, fontSize: 11, color: '#92400E', fontWeight: 'bold' });

b.createRect({ name: 'Badge Red', parent: s6, x: 1016, y: 424, width: 120, height: 26, fill: '#FEE2E2', radius: 13 });
b.createText({ text: '⚠️ Alergi Obat', parent: s6, x: 1034, y: 430, fontSize: 11, color: '#991B1B', fontWeight: 'bold' });

b.createRect({ name: 'Badge Blue', parent: s6, x: 1152, y: 424, width: 110, height: 26, fill: '#EFF6FF', radius: 13 });
b.createText({ text: 'No Antrean: A-014', parent: s6, x: 1162, y: 430, fontSize: 10, color: '#012D68', fontWeight: 'bold' });

// Form Controls
b.createText({ text: 'Form Inputs', parent: s6, x: 764, y: 480, fontSize: 13, color: '#0F172A', fontWeight: 'bold' });
b.createRect({ name: 'Input Normal', parent: s6, x: 764, y: 504, width: 280, height: 42, fill: '#F8FAFC', radius: 8, stroke: '#CBD5E1' });
b.createText({ text: 'Default input state...', parent: s6, x: 780, y: 516, fontSize: 12, color: '#94A3B8' });

b.createRect({ name: 'Input Focused', parent: s6, x: 1060, y: 504, width: 280, height: 42, fill: '#FFFFFF', radius: 8, stroke: '#012D68' });
b.createText({ text: 'Active focused state |', parent: s6, x: 1076, y: 516, fontSize: 12, color: '#012D68' });

// Save JSON file
const doc = b.buildDocument();
const jsonPath = path.join(__dirname, 'klinik_master_design.json');
fs.writeFileSync(jsonPath, JSON.stringify(doc, null, 2));
console.log(`Document generated with ${Object.keys(doc.nodes).length} nodes! Saved to ${jsonPath}`);
