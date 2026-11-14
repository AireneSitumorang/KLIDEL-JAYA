
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Transaksi | Klinik Maristella</title>

    <link rel="icon" type="image/png" href="{{ asset('images/maristella-icon.png') }}">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    @endif

    <style>
        :root {
            --bg-muted: #f8fafc;
            --border: #e2e8f0;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-tertiary: #94a3b8;
            --brand-primary: #012D68;
            --brand-hover: #083E88;
            --brand-tint: #EFF6FF;
            --font-sans: "Plus Jakarta Sans", "Inter", system-ui, sans-serif;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-sans);
            font-size: 13px;
            line-height: 20px;
            color: var(--text-secondary);
            background: var(--bg-muted);
            margin: 0;
        }

        .app {
            display: flex;
            min-height: 100vh;
            max-width: 1440px;
            width: 100%;
            margin: 0 auto;
        }

        .sidebar {
            width: 240px;
            flex-shrink: 0;
            border-right: 1px solid var(--border);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            background: white;
            position: sticky;
            top: 0;
            height: 100vh;
            z-index: 20;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
        }

        .brand img {
            height: 36px;
            width: auto;
            object-fit: contain;
        }

        .role-indicator-badge {
            font-size: 10px;
            font-weight: 700;
            background: var(--brand-tint);
            border: 1px solid #BFDBFE;
            color: var(--brand-primary);
            border-radius: 4px;
            padding: 2px 6px;
            margin-left: auto;
            text-transform: uppercase;
        }

        .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 12px;
            border-radius: 12px;
            color: var(--text-secondary);
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            position: relative;
            transition: .15s;
        }

        .nav-item svg {
            width: 20px;
            height: 20px;
            stroke: currentColor;
            fill: none;
            stroke-width: 1.75;
            flex-shrink: 0;
        }

        .nav-item:hover,
        .nav-item.active {
            background: var(--brand-tint);
            color: var(--brand-primary);
        }

        .nav-item.active {
            font-weight: 700;
        }

        .active-indicator {
            position: absolute;
            left: -20px;
            top: 10px;
            bottom: 10px;
            width: 3px;
            border-radius: 0 4px 4px 0;
            background: var(--brand-primary);
        }

        .spacer {
            flex: 1;
        }

        .user-card {
            display: flex;
            align-items: center;
            gap: 10px;
            border: 1px solid var(--border);
            border-radius: 14px;
            padding: 10px;
            background: white;
        }

        .avatar {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            font-size: 12px;
            font-weight: 700;
            color: white;
            background: var(--brand-primary);
            flex-shrink: 0;
        }

        .user-card strong {
            display: block;
            font-size: 12px;
            color: var(--text-primary);
        }

        .user-card small {
            display: block;
            font-size: 11px;
            color: var(--text-tertiary);
        }

        .logout-btn {
            margin-top: 8px;
            width: 100%;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 11.5px;
            border-radius: 8px;
            border: 1px solid var(--border);
            background: white;
            color: var(--text-secondary);
            cursor: pointer;
        }

        .logout-btn:hover {
            background: #fee2e2;
            color: #dc2626;
        }

        .main {
            flex: 1;
            min-width: 0;
            padding: 24px 32px 48px;
            background: #F8FAFC;
            overflow-x: hidden;
        }

        .card {
            background: white;
            border: 1px solid var(--border);
            border-radius: 16px;
            box-shadow: 0 1px 2px rgba(15, 23, 42, .04);
        }

        .filter-control {
            height: 40px;
            padding: 0 12px;
            border: 1px solid var(--border);
            border-radius: 10px;
            background: white;
            font-size: 12px;
            font-weight: 600;
            color: #334155;
            outline: none;
        }

        .filter-control:focus {
            border-color: #60a5fa;
        }

        .table-heading {
            padding: 13px 15px;
            background: #f8fafc;
            border-top: 1px solid #f1f5f9;
            border-bottom: 1px solid #f1f5f9;
            font-size: 10px;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .table-cell {
            padding: 15px;
            font-size: 12px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: middle;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 5px 10px;
            border-radius: 999px;
            border: 1px solid;
            font-size: 10px;
            font-weight: 800;
            white-space: nowrap;
        }

        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
        }

        .detail-button {
            padding: 7px 12px;
            border-radius: 8px;
            background: #eff6ff;
            color: #012D68;
            font-size: 10px;
            font-weight: 800;
            white-space: nowrap;
            cursor: pointer;
            border: none;
        }

        .detail-button:hover {
            background: #dbeafe;
        }

        .floating-bottom-nav {
            display: none;
        }

        @media (max-width: 860px) {
            .sidebar {
                display: none;
            }

            .main {
                padding: 16px 16px 85px;
            }

            .floating-bottom-nav {
                position: fixed;
                left: 50%;
                transform: translateX(-50%);
                bottom: 20px;
                display: flex;
                gap: 8px;
                background: white;
                padding: 6px 12px;
                border-radius: 999px;
                box-shadow: 0 12px 30px rgba(15, 23, 42, .14);
                border: 1px solid var(--border);
                z-index: 40;
            }

            .floating-bottom-nav a {
                width: 44px;
                height: 44px;
                border-radius: 50%;
                display: grid;
                place-items: center;
                color: var(--text-secondary);
                text-decoration: none;
            }

            .floating-bottom-nav a.active {
                background: var(--brand-primary);
                color: white;
            }
        }
    </style>
</head>

<body class="text-slate-800 antialiased min-h-screen">

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
        <symbol id="i-cal" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="16" rx="3"/>
            <path d="M8 3v4M16 3v4M3 10h18"/>
        </symbol>

        <symbol id="i-bill" viewBox="0 0 24 24">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
            <path d="M7 15h2M12 15h5"/>
        </symbol>

        <symbol id="i-pill" viewBox="0 0 24 24">
            <path d="m10.5 20.5 10-10a5.66 5.66 0 0 0-8-8l-10 10a5.66 5.66 0 0 0 8 8Z"/>
            <path d="m8.5 8.5 7 7"/>
        </symbol>

        <symbol id="i-logout" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
        </symbol>
    </defs>
</svg>

<div class="app">

    <!-- SIDEBAR -->
    <aside class="sidebar">

        <div class="brand">
            <a href="{{ route('home') }}" title="Klinik Maristella">
                <img src="{{ asset('images/maristella-logo-horizontal.png') }}"
                     alt="Klinik Maristella">
            </a>

            <span class="role-indicator-badge">Admin</span>
        </div>

        <nav class="sidebar-nav" aria-label="Navigasi admin">

            <a href="{{ route('admin.calendar') }}"
               class="nav-item {{ request()->routeIs('admin.calendar') ? 'active' : '' }}">
                @if(request()->routeIs('admin.calendar'))
                    <span class="active-indicator"></span>
                @endif
                <svg><use href="#i-cal"/></svg>
                <span>Jadwal Dokter</span>
            </a>

            <a href="{{ route('admin.dashboard') }}"
               class="nav-item {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                @if(request()->routeIs('admin.dashboard'))
                    <span class="active-indicator"></span>
                @endif
                <svg><use href="#i-bill"/></svg>
                <span>Dashboard Keuangan</span>
            </a>

            <a href="{{ route('admin.transactions') }}"
               class="nav-item {{ request()->routeIs('admin.transactions') ? 'active' : '' }}">
                @if(request()->routeIs('admin.transactions'))
                    <span class="active-indicator"></span>
                @endif
                <svg><use href="#i-bill"/></svg>
                <span>Transaksi</span>
            </a>

            <a href="{{ route('obat.index') }}"
               class="nav-item {{ request()->routeIs('obat.*') ? 'active' : '' }}">
                @if(request()->routeIs('obat.*'))
                    <span class="active-indicator"></span>
                @endif
                <svg><use href="#i-pill"/></svg>
                <span>Data Obat</span>
            </a>

        </nav>

        <div class="spacer"></div>

        <div class="user-card">
            <div class="avatar">
                {{ $user['initials'] ?? 'AL' }}
            </div>

            <div class="min-w-0 flex-1">
                <strong>{{ $user['name'] ?? 'Administrator' }}</strong>
                <small>{{ $user['role'] ?? 'Administrator' }}</small>
            </div>
        </div>

        <form action="{{ route('logout') }}" method="POST">
            @csrf

            <button type="submit" class="logout-btn">
                <svg style="width:14px;height:14px">
                    <use href="#i-logout"/>
                </svg>
                <span>Keluar Portal</span>
            </button>
        </form>

    </aside>

    <!-- MAIN CONTENT -->
    <main class="main space-y-6">

        <!-- HEADER -->
        <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/80">

            <div>
                <div class="flex items-center gap-2.5 flex-wrap">
                    <h1 class="text-xl sm:text-2xl font-extrabold text-[#012D68] tracking-tight">
                        Manajemen Transaksi
                    </h1>

                    <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#012D68] border border-blue-200">
                        Admin
                    </span>
                </div>

                <p class="text-xs text-slate-500 font-medium mt-1">
                    Pengelolaan seluruh transaksi pembayaran pasien Klinik Maristella
                </p>
            </div>

            <a href="{{ route('admin.exportCsv', ['timeframe' => 'all']) }}"
               class="h-10 px-4 rounded-xl bg-[#012D68] hover:bg-[#083E88] text-white text-xs font-bold flex items-center justify-center gap-2">

                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                     stroke-width="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>

                Export CSV
            </a>

        </header>

        <!-- NOTIFIKASI -->
        @if(session('success'))
            <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold">
                {{ session('success') }}
            </div>
        @endif

        @if(session('error'))
            <div class="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs font-semibold">
                {{ session('error') }}
            </div>
        @endif

        <!-- STATISTIK -->
        <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            <div class="card p-5">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Total Transaksi
                </p>

                <p class="text-3xl font-extrabold text-slate-900 mt-3">
                    {{ number_format($totalTransactions, 0, ',', '.') }}
                </p>

                <p class="text-[11px] text-slate-400 mt-2">
                    Total transaksi sesuai filter
                </p>
            </div>

            <div class="card p-5">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Pembayaran Berhasil
                </p>

                <p class="text-3xl font-extrabold text-emerald-600 mt-3">
                    {{ number_format($successfulPaymentCount, 0, ',', '.') }}
                </p>

                <p class="text-[11px] text-slate-400 mt-2">
                    Transaksi lunas
                </p>
            </div>

            <div class="card p-5">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Belum Dibayar
                </p>

                <p class="text-3xl font-extrabold text-amber-600 mt-3">
                    {{ number_format($pendingPayments, 0, ',', '.') }}
                </p>

                <p class="text-[11px] text-slate-400 mt-2">
                    Menunggu pembayaran
                </p>
            </div>

            <div class="card p-5">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Perlu Verifikasi
                </p>

                <p class="text-3xl font-extrabold text-blue-600 mt-3">
                    {{ number_format($verificationPayments, 0, ',', '.') }}
                </p>

                <p class="text-[11px] text-slate-400 mt-2">
                    Transaksi perlu diperiksa
                </p>
            </div>

        </section>

        <!-- TABEL TRANSAKSI -->
        <section class="card overflow-hidden">

            <div class="p-5 border-b border-slate-100">

                <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

                    <div>
                        <h2 class="text-sm font-extrabold text-slate-800">
                            Daftar Transaksi Pasien
                        </h2>

                        <p class="text-[11px] text-slate-400 mt-1">
                            Informasi invoice, pasien, dokter, layanan, dan pembayaran
                        </p>
                    </div>

                    <form action="{{ route('admin.transactions') }}"
                          method="GET"
                          class="flex flex-col sm:flex-row gap-2">

                        <input
                            type="text"
                            name="search"
                            value="{{ $search }}"
                            placeholder="Cari nama atau invoice..."
                            class="filter-control w-full sm:w-64"
                        >

                        <select name="status" class="filter-control">
                            <option value="all" {{ $status === 'all' ? 'selected' : '' }}>
                                Semua Status
                            </option>

                            <option value="confirmed" {{ $status === 'confirmed' ? 'selected' : '' }}>
                                Lunas
                            </option>

                            <option value="pending" {{ $status === 'pending' ? 'selected' : '' }}>
                                Belum Dibayar
                            </option>

                            <option value="changed" {{ $status === 'changed' ? 'selected' : '' }}>
                                Perlu Verifikasi
                            </option>

                            <option value="canceled" {{ $status === 'canceled' ? 'selected' : '' }}>
                                Dibatalkan
                            </option>
                        </select>

                        <button type="submit"
                                class="filter-control bg-[#012D68] text-white border-[#012D68] hover:bg-[#083E88]">
                            Cari
                        </button>

                        <a href="{{ route('admin.transactions') }}"
                           class="filter-control flex items-center justify-center">
                            Reset
                        </a>

                    </form>

                </div>

            </div>

            <!-- INFORMASI TABEL -->
            <div class="px-5 py-3 bg-blue-50/60 border-b border-blue-100">
                <p class="text-[11px] text-blue-900 font-medium">
                    Menampilkan {{ $payments->firstItem() ?? 0 }}
                    sampai {{ $payments->lastItem() ?? 0 }}
                    dari {{ $payments->total() }} transaksi.
                </p>
            </div>

            <!-- TABEL -->
            <div class="overflow-x-auto">

                <table class="w-full min-w-[1100px] text-left">

                    <thead>
                        <tr>
                            <th class="table-heading">No.</th>
                            <th class="table-heading">Pasien</th>
                            <th class="table-heading">Invoice</th>
                            <th class="table-heading">Tanggal</th>
                            <th class="table-heading">Layanan</th>
                            <th class="table-heading">Dokter</th>
                            <th class="table-heading">Metode</th>
                            <th class="table-heading">Nominal</th>
                            <th class="table-heading">Status</th>
                            <th class="table-heading">Aksi</th>
                        </tr>
                    </thead>

                    <tbody>

                        @forelse($payments as $index => $payment)

                            @php
                                $paymentStatus = strtolower($payment->status ?? 'unknown');

                                $patientName = $payment->patient_name
                                    ?? $payment->patient?->full_name
                                    ?? $payment->booking?->patient?->full_name
                                    ?? 'Pasien';

                                $doctorName = $payment->doctor_name
                                    ?? $payment->doctor?->nama_dokter
                                    ?? $payment->booking?->doctor?->nama_dokter
                                    ?? '-';

                                $paymentDate = $payment->paid_at
                                    ?? $payment->created_at;

                                $amount = $payment->net_amount
                                    ?? $payment->amount
                                    ?? 0;

                                $statusConfig = match($paymentStatus) {
                                    'confirmed', 'paid' => [
                                        'label' => 'Lunas',
                                        'badge' => 'text-emerald-700 bg-emerald-50 border-emerald-200',
                                        'dot' => 'bg-emerald-500'
                                    ],
                                    'pending' => [
                                        'label' => 'Belum Dibayar',
                                        'badge' => 'text-amber-700 bg-amber-50 border-amber-200',
                                        'dot' => 'bg-amber-500'
                                    ],
                                    'changed' => [
                                        'label' => 'Perlu Verifikasi',
                                        'badge' => 'text-blue-700 bg-blue-50 border-blue-200',
                                        'dot' => 'bg-blue-500'
                                    ],
                                    'canceled' => [
                                        'label' => 'Dibatalkan',
                                        'badge' => 'text-rose-700 bg-rose-50 border-rose-200',
                                        'dot' => 'bg-rose-500'
                                    ],
                                    default => [
                                        'label' => 'Status Lainnya',
                                        'badge' => 'text-slate-600 bg-slate-100 border-slate-200',
                                        'dot' => 'bg-slate-400'
                                    ]
                                };

                                $paymentMethod = match($payment->payment_method) {
                                    'cash' => 'Tunai',
                                    'credit_card' => 'Kartu Kredit',
                                    'debit_card' => 'Kartu Debit',
                                    'transfer' => 'Transfer Bank',
                                    'e_wallet' => 'E-Wallet',
                                    default => ucfirst(str_replace('_', ' ', $payment->payment_method ?? '-'))
                                };
                            @endphp

                            <tr class="hover:bg-slate-50/70">

                                <td class="table-cell text-slate-400">
                                    {{ $payments->firstItem() + $index }}
                                </td>

                                <td class="table-cell">
                                    <div class="font-bold text-slate-800">
                                        {{ $patientName }}
                                    </div>

                                    <div class="text-[10px] text-slate-400 mt-1">
                                        ID Pasien: {{ $payment->patient_id ?? '-' }}
                                    </div>
                                </td>

                                <td class="table-cell">
                                    <span class="font-bold text-[#012D68]">
                                        {{ $payment->invoice_number ?? '-' }}
                                    </span>
                                </td>

                                <td class="table-cell text-slate-500">
                                    {{ $paymentDate
                                        ? \Carbon\Carbon::parse($paymentDate)->format('d/m/Y H:i')
                                        : '-' }}
                                </td>

                                <td class="table-cell text-slate-600">
                                    {{ $payment->service_type ?? '-' }}
                                </td>

                                <td class="table-cell text-slate-600">
                                    {{ $doctorName }}
                                </td>

                                <td class="table-cell text-slate-600">
                                    {{ $paymentMethod }}
                                </td>

                                <td class="table-cell">
                                    <span class="font-extrabold text-slate-800">
                                        Rp{{ number_format((float) $amount, 0, ',', '.') }}
                                    </span>
                                </td>

                                <td class="table-cell">
                                    <span class="status-badge {{ $statusConfig['badge'] }}">
                                        <span class="status-dot {{ $statusConfig['dot'] }}"></span>
                                        {{ $statusConfig['label'] }}
                                    </span>
                                </td>

                                <td class="table-cell">
                                    <button
                                        type="button"
                                        class="detail-button"
                                        onclick="showPaymentDetail(
                                            @js($patientName),
                                            @js($payment->invoice_number ?? '-'),
                                            @js($payment->service_type ?? '-'),
                                            @js($doctorName),
                                            @js(number_format((float) $amount, 0, ',', '.')),
                                            @js($statusConfig['label']),
                                            @js($paymentMethod),
                                            @js($paymentDate ? \Carbon\Carbon::parse($paymentDate)->format('d/m/Y H:i') : '-')
                                        )">
                                        Detail
                                    </button>
                                </td>

                            </tr>

                        @empty

                            <tr>
                                <td colspan="10" class="px-5 py-16 text-center">

                                    <div class="text-slate-300 text-3xl mb-3">
                                        &#128179;
                                    </div>

                                    <p class="font-bold text-slate-700 text-sm">
                                        Belum Ada Transaksi
                                    </p>

                                    <p class="text-xs text-slate-400 mt-1">
                                        Data transaksi akan ditampilkan setelah pembayaran tercatat.
                                    </p>

                                </td>
                            </tr>

                        @endforelse

                    </tbody>

                </table>

            </div>

            <!-- PAGINATION -->
            @if($payments->hasPages())
                <div class="px-5 py-4 border-t border-slate-100">
                    {{ $payments->withQueryString()->links() }}
                </div>
            @endif

        </section>

        <!-- KETERANGAN STATUS -->
        <section class="card p-5">

            <h3 class="text-sm font-extrabold text-slate-800 mb-3">
                Keterangan Status Pembayaran
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

                <div class="flex items-center gap-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <div>
                        <p class="text-xs font-bold text-slate-700">Lunas</p>
                        <p class="text-[10px] text-slate-400">Pembayaran berhasil</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <div>
                        <p class="text-xs font-bold text-slate-700">Belum Dibayar</p>
                        <p class="text-[10px] text-slate-400">Menunggu pembayaran</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <div>
                        <p class="text-xs font-bold text-slate-700">Perlu Verifikasi</p>
                        <p class="text-[10px] text-slate-400">Memerlukan pemeriksaan</p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <div>
                        <p class="text-xs font-bold text-slate-700">Dibatalkan</p>
                        <p class="text-[10px] text-slate-400">Transaksi dibatalkan</p>
                    </div>
                </div>

            </div>

        </section>

    </main>
</div>

<!-- NAVIGASI MOBILE -->
<nav class="floating-bottom-nav">

    <a href="{{ route('admin.calendar') }}"
       class="{{ request()->routeIs('admin.calendar') ? 'active' : '' }}"
       title="Jadwal Dokter">
        <svg class="w-5 h-5" fill="none" stroke="currentColor"
             stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-cal"/>
        </svg>
    </a>

    <a href="{{ route('admin.dashboard') }}"
       class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}"
       title="Dashboard Keuangan">
        <svg class="w-5 h-5" fill="none" stroke="currentColor"
             stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-bill"/>
        </svg>
    </a>

    <a href="{{ route('admin.transactions') }}"
       class="{{ request()->routeIs('admin.transactions') ? 'active' : '' }}"
       title="Transaksi">
        <svg class="w-5 h-5" fill="none" stroke="currentColor"
             stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-bill"/>
        </svg>
    </a>

    <a href="{{ route('obat.index') }}"
       class="{{ request()->routeIs('obat.*') ? 'active' : '' }}"
       title="Data Obat">
        <svg class="w-5 h-5" fill="none" stroke="currentColor"
             stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-pill"/>
        </svg>
    </a>

</nav>

<!-- MODAL DETAIL TRANSAKSI -->
<div id="paymentDetailModal"
     class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/50 p-4">

    <div class="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">

            <div>
                <h2 class="font-extrabold text-slate-800 text-base">
                    Detail Transaksi
                </h2>

                <p class="text-[11px] text-slate-400 mt-1">
                    Informasi pembayaran pasien
                </p>
            </div>

            <button type="button"
                    onclick="closePaymentDetail()"
                    class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-lg">
                &times;
            </button>

        </div>

        <div class="p-6 space-y-4">

            <div class="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <span class="text-xs text-slate-500">Nama Pasien</span>
                <strong id="detailPatient" class="text-xs text-slate-800 text-right">-</strong>
            </div>

            <div class="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <span class="text-xs text-slate-500">Nomor Invoice</span>
                <strong id="detailInvoice" class="text-xs text-[#012D68] text-right">-</strong>
            </div>

            <div class="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <span class="text-xs text-slate-500">Layanan</span>
                <strong id="detailService" class="text-xs text-slate-800 text-right">-</strong>
            </div>

            <div class="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <span class="text-xs text-slate-500">Dokter</span>
                <strong id="detailDoctor" class="text-xs text-slate-800 text-right">-</strong>
            </div>

            <div class="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <span class="text-xs text-slate-500">Metode Pembayaran</span>
                <strong id="detailMethod" class="text-xs text-slate-800 text-right">-</strong>
            </div>

            <div class="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <span class="text-xs text-slate-500">Tanggal Pembayaran</span>
                <strong id="detailDate" class="text-xs text-slate-800 text-right">-</strong>
            </div>

            <div class="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <span class="text-xs text-slate-500">Status</span>
                <strong id="detailStatus" class="text-xs text-slate-800 text-right">-</strong>
            </div>

            <div class="bg-blue-50 rounded-xl p-4 flex items-center justify-between gap-3">
                <span class="text-xs font-bold text-slate-600">Total Pembayaran</span>
                <strong id="detailAmount" class="text-lg font-extrabold text-[#012D68]">
                    Rp0
                </strong>
            </div>

        </div>

        <div class="px-6 pb-6">
            <button type="button"
                    onclick="closePaymentDetail()"
                    class="w-full py-2.5 rounded-xl bg-[#012D68] hover:bg-[#083E88] text-white text-xs font-bold">
                Tutup
            </button>
        </div>

    </div>
</div>

<script>
    function showPaymentDetail(patient, invoice, service, doctor, amount, status, method, date) {
        document.getElementById('detailPatient').textContent = patient;
        document.getElementById('detailInvoice').textContent = invoice;
        document.getElementById('detailService').textContent = service;
        document.getElementById('detailDoctor').textContent = doctor;
        document.getElementById('detailAmount').textContent = 'Rp' + amount;
        document.getElementById('detailStatus').textContent = status;
        document.getElementById('detailMethod').textContent = method;
        document.getElementById('detailDate').textContent = date;

        const modal = document.getElementById('paymentDetailModal');

        modal.classList.remove('hidden');
        modal.classList.add('flex');

        document.body.style.overflow = 'hidden';
    }

    function closePaymentDetail() {
        const modal = document.getElementById('paymentDetailModal');

        modal.classList.add('hidden');
        modal.classList.remove('flex');

        document.body.style.overflow = '';
    }

    document.getElementById('paymentDetailModal')?.addEventListener('click', function(event) {
        if (event.target === this) {
            closePaymentDetail();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closePaymentDetail();
        }
    });
</script>

</body>
</html>
