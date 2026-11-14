
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Dashboard Keuangan | Klinik Maristella</title>

    <link rel="icon" type="image/png" href="{{ asset('images/maristella-icon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    @endif

    @php
        $invoiceRoute = \Illuminate\Support\Facades\Route::has('admin.invoices')
            ? route('admin.invoices')
            : route('admin.transactions');

        $revenueRoute = \Illuminate\Support\Facades\Route::has('admin.revenue')
            ? route('admin.revenue')
            : route('admin.transactions');

        $reportRoute = \Illuminate\Support\Facades\Route::has('admin.reports')
            ? route('admin.reports')
            : route('admin.transactions');
    @endphp

    <style>
        :root {
            --brand-primary: #012D68;
            --brand-hover: #083E88;
            --brand-tint: #EFF6FF;
            --border: #E2E8F0;
            --text-primary: #0F172A;
            --text-secondary: #475569;
            --text-muted: #94A3B8;
            --page-bg: #F8FAFC;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: "Plus Jakarta Sans", "Inter", sans-serif;
            font-size: 13px;
            line-height: 20px;
            color: var(--text-secondary);
            background: var(--page-bg);
            -webkit-font-smoothing: antialiased;
        }

        .app {
            display: flex;
            width: 100%;
            max-width: 1440px;
            min-height: 100vh;
            margin: 0 auto;
            background: var(--page-bg);
        }

        /* SIDEBAR */
        .sidebar {
            width: 255px;
            min-width: 255px;
            height: 100vh;
            padding: 20px 16px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            position: sticky;
            top: 0;
            z-index: 20;
            overflow-y: auto;
            background: white;
            border-right: 1px solid var(--border);
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 24px;
            padding: 0 4px;
        }

        .brand img {
            width: auto;
            height: 36px;
            object-fit: contain;
        }

        .role-indicator-badge {
            margin-left: auto;
            padding: 2px 7px;
            color: var(--brand-primary);
            background: var(--brand-tint);
            border: 1px solid #BFDBFE;
            border-radius: 5px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .sidebar-heading {
            margin: 4px 0 8px;
            padding: 0 12px;
            color: var(--text-muted);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 4px;
            width: 100%;
        }

        .sidebar-nav .nav-item {
            position: relative;
            display: flex;
            align-items: center;
            gap: 11px;
            width: 100%;
            padding: 10px 11px;
            color: var(--text-secondary);
            border-radius: 11px;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            transition: .15s;
        }

        .sidebar-nav .nav-item svg {
            width: 19px;
            height: 19px;
            flex-shrink: 0;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.75;
        }

        .sidebar-nav .nav-item:hover,
        .sidebar-nav .nav-item.active {
            color: var(--brand-primary);
            background: var(--brand-tint);
        }

        .sidebar-nav .nav-item.active {
            font-weight: 800;
        }

        .active-indicator {
            position: absolute;
            left: -16px;
            top: 9px;
            bottom: 9px;
            width: 3px;
            background: var(--brand-primary);
            border-radius: 0 4px 4px 0;
        }

        .sidebar-spacer {
            flex: 1;
            min-height: 20px;
        }

        .user-card {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            background: white;
            border: 1px solid var(--border);
            border-radius: 14px;
        }

        .avatar {
            position: relative;
            display: grid;
            place-items: center;
            width: 34px;
            height: 34px;
            flex-shrink: 0;
            color: white;
            background: var(--brand-primary);
            border-radius: 50%;
            font-size: 12px;
            font-weight: 800;
        }

        .avatar .status {
            position: absolute;
            right: -1px;
            bottom: -1px;
            width: 9px;
            height: 9px;
            background: #10B981;
            border: 2px solid white;
            border-radius: 50%;
        }

        .user-card strong {
            display: block;
            color: var(--text-primary);
            font-size: 12px;
            font-weight: 700;
        }

        .user-card small {
            display: block;
            color: var(--text-muted);
            font-size: 11px;
        }

        .logout-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 7px;
            width: 100%;
            height: 38px;
            margin-top: 8px;
            color: var(--text-secondary);
            background: white;
            border: 1px solid var(--border);
            border-radius: 8px;
            font-size: 11.5px;
            font-weight: 700;
            cursor: pointer;
            transition: .15s;
        }

        .logout-btn:hover {
            color: #DC2626;
            background: #FEE2E2;
        }

        /* MAIN CONTENT */
        .main {
            flex: 1;
            min-width: 0;
            padding: 24px 32px 48px;
            overflow-x: hidden;
            background: var(--page-bg);
        }

        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #CBD5E1;
            border-radius: 999px;
        }

        /* MOBILE NAVIGATION */
        .floating-bottom-nav {
            display: none;
        }

        @media (max-width: 860px) {
            .sidebar {
                display: none;
            }

            .main {
                padding: 16px 16px 105px;
            }

            .floating-bottom-nav {
                position: fixed;
                left: 50%;
                bottom: 12px;
                z-index: 40;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                gap: 3px;
                width: calc(100% - 20px);
                max-width: 540px;
                padding: 6px;
                overflow-x: auto;
                transform: translateX(-50%);
                background: white;
                border: 1px solid var(--border);
                border-radius: 999px;
                box-shadow: 0 12px 30px rgba(15, 23, 42, .14);
                scrollbar-width: none;
            }

            .floating-bottom-nav::-webkit-scrollbar {
                display: none;
            }

            .floating-bottom-nav a,
            .floating-bottom-nav form {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1 0 42px;
                min-width: 42px;
                height: 44px;
                border-radius: 50%;
            }

            .floating-bottom-nav a {
                color: var(--text-secondary);
                text-decoration: none;
            }

            .floating-bottom-nav a.active {
                color: white;
                background: var(--brand-primary);
            }

            .floating-bottom-nav form button {
                display: grid;
                place-items: center;
                width: 100%;
                height: 44px;
                color: var(--text-secondary);
                background: transparent;
                border: none;
                border-radius: 50%;
                cursor: pointer;
            }

            .floating-bottom-nav form button:hover {
                color: #DC2626;
                background: #FEE2E2;
            }

            .floating-bottom-nav svg {
                width: 19px;
                height: 19px;
            }
        }

        @media (min-width: 861px) {
            .floating-bottom-nav {
                display: none;
            }
        }

        @media (max-width: 480px) {
            .main {
                padding-right: 12px;
                padding-left: 12px;
            }
        }
    </style>
</head>

<body class="text-slate-800 antialiased min-h-screen">

<!-- ICON DEFINITIONS -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
    <defs>
        <symbol id="i-dashboard" viewBox="0 0 24 24">
            <rect x="3" y="3" width="8" height="8" rx="2"/>
            <rect x="13" y="3" width="8" height="5" rx="2"/>
            <rect x="13" y="10" width="8" height="11" rx="2"/>
            <rect x="3" y="13" width="8" height="8" rx="2"/>
        </symbol>

        <symbol id="i-bill" viewBox="0 0 24 24">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
            <path d="M7 15h2M12 15h5"/>
        </symbol>

        <symbol id="i-receipt" viewBox="0 0 24 24">
            <path d="M4 3h16v18l-3-2-3 2-2-2-3 2-2-2-3 2z"/>
            <path d="M8 8h8M8 12h8M8 16h4"/>
        </symbol>

        <symbol id="i-history" viewBox="0 0 24 24">
            <path d="M3 12a9 9 0 1 0 2.64-6.36"/>
            <path d="M3 4v4h4"/>
            <path d="M12 7v5l3 2"/>
        </symbol>

        <symbol id="i-chart" viewBox="0 0 24 24">
            <path d="M3 3v18h18"/>
            <path d="m7 14 4-4 4 3 6-7"/>
            <path d="M17 6h4v4"/>
        </symbol>

        <symbol id="i-report" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/>
        </symbol>

        <symbol id="i-logout" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
        </symbol>

        <symbol id="i-download" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </symbol>
    </defs>
</svg>

<div class="app">

    <!-- SIDEBAR ADMIN -->
    <aside class="sidebar">

        <div class="brand">
            <a href="{{ route('home') }}" title="Klinik Maristella">
                <img src="{{ asset('images/maristella-logo-horizontal.png') }}" alt="Klinik Maristella">
            </a>
            <span class="role-indicator-badge">Admin</span>
        </div>

        <div class="sidebar-heading">Manajemen Keuangan</div>

        <nav class="sidebar-nav" aria-label="Navigasi Admin">

            <a href="{{ route('admin.dashboard') }}"
               class="nav-item {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                @if(request()->routeIs('admin.dashboard'))
                    <span class="active-indicator"></span>
                @endif
                <svg><use href="#i-dashboard"/></svg>
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

            <a href="{{ $invoiceRoute }}"
               class="nav-item {{ request()->routeIs('admin.invoices') ? 'active' : '' }}">
                @if(request()->routeIs('admin.invoices'))
                    <span class="active-indicator"></span>
                @endif
                <svg><use href="#i-receipt"/></svg>
                <span>Tagihan Pasien</span>
            </a>

            <a href="{{ route('admin.paymentHistory') }}"
               class="nav-item {{ request()->routeIs('admin.paymentHistory') ? 'active' : '' }}">
                @if(request()->routeIs('admin.paymentHistory'))
                    <span class="active-indicator"></span>
                @endif
                <svg><use href="#i-history"/></svg>
                <span>Riwayat Pembayaran</span>
            </a>

            <a href="{{ $revenueRoute }}"
               class="nav-item {{ request()->routeIs('admin.revenue') ? 'active' : '' }}">
                @if(request()->routeIs('admin.revenue'))
                    <span class="active-indicator"></span>
                @endif
                <svg><use href="#i-chart"/></svg>
                <span>Rekap Pendapatan</span>
            </a>

            <a href="{{ $reportRoute }}"
               class="nav-item {{ request()->routeIs('admin.reports') ? 'active' : '' }}">
                @if(request()->routeIs('admin.reports'))
                    <span class="active-indicator"></span>
                @endif
                <svg><use href="#i-report"/></svg>
                <span>Laporan Keuangan</span>
            </a>

        </nav>

        <div class="sidebar-spacer"></div>

        <div class="user-card">
            <div class="avatar">
                {{ $user['initials'] ?? 'AL' }}
                <i class="status"></i>
            </div>

            <div class="min-w-0 flex-1">
                <strong>{{ $user['name'] ?? 'Administrator' }}</strong>
                <small>{{ $user['role'] ?? 'Administrator' }}</small>
            </div>
        </div>

        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button type="submit" class="logout-btn">
                <svg style="width:15px;height:15px">
                    <use href="#i-logout"/>
                </svg>
                <span>Logout</span>
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
                        Dashboard Keuangan
                    </h1>

                    <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#012D68] border border-blue-200">
                        Admin
                    </span>
                </div>

                <p class="text-xs text-slate-500 font-medium mt-0.5">
                    Manajemen Transaksi dan Keuangan Klinik Maristella
                </p>
            </div>

            <div class="flex items-center gap-2.5 flex-wrap">

                <select id="timeframe-select"
                        onchange="window.location.href='{{ route('admin.dashboard') }}?timeframe=' + this.value"
                        class="h-9.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700">

                    <option value="week" {{ ($timeframe ?? 'week') === 'week' ? 'selected' : '' }}>Minggu Ini</option>
                    <option value="month" {{ ($timeframe ?? 'week') === 'month' ? 'selected' : '' }}>Bulan Ini</option>
                    <option value="year" {{ ($timeframe ?? 'week') === 'year' ? 'selected' : '' }}>Tahun Ini</option>
                    <option value="all" {{ ($timeframe ?? 'week') === 'all' ? 'selected' : '' }}>Semua Data</option>

                </select>

                <a href="{{ route('admin.exportCsv', ['timeframe' => $timeframe ?? 'all']) }}"
                   class="h-9.5 px-4 rounded-xl bg-[#012D68] hover:bg-[#083E88] text-white text-xs font-bold flex items-center gap-2">

                    <svg class="w-4 h-4"><use href="#i-download"/></svg>
                    Export CSV
                </a>

            </div>
        </header>

        <!-- NOTIFICATION -->
        @if (session('success'))
            <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold">
                {{ session('success') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs">
                <p class="font-bold mb-1">Terdapat kesalahan input:</p>
                <ul class="list-disc pl-5">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- STATISTICS -->
        <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Transaksi</p>
                <p class="text-3xl font-extrabold text-slate-900 mt-3">
                    {{ number_format($totalTransactions ?? 0, 0, ',', '.') }}
                </p>
                <p class="text-[11px] text-slate-400 mt-2">Seluruh transaksi tercatat</p>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pembayaran Berhasil</p>
                <p class="text-3xl font-extrabold text-emerald-600 mt-3">
                    {{ number_format($successfulPaymentCount ?? 0, 0, ',', '.') }}
                </p>
                <p class="text-[11px] text-slate-400 mt-2">Transaksi lunas</p>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Belum Dibayar</p>
                <p class="text-3xl font-extrabold text-amber-600 mt-3">
                    {{ number_format($pendingPayments ?? 0, 0, ',', '.') }}
                </p>
                <p class="text-[11px] text-slate-400 mt-2">Menunggu pembayaran pasien</p>
            </div>

            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Pendapatan</p>
                <p class="text-2xl font-extrabold text-[#012D68] mt-3">
                    Rp{{ number_format($totalRevenue ?? 0, 0, ',', '.') }}
                </p>
                <p class="text-[11px] text-slate-400 mt-2">Dari pembayaran berhasil</p>
            </div>

        </section>

        <!-- CHART AND CALENDAR -->
        <section class="grid grid-cols-1 xl:grid-cols-3 gap-5">

            <div class="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">

                <div class="flex items-center justify-between mb-5">
                    <div>
                        <h2 class="font-extrabold text-slate-800 text-sm">Statistik Kunjungan</h2>
                        <p class="text-[11px] text-slate-400 mt-1">Jumlah kunjungan pasien berdasarkan hari</p>
                    </div>

                    <span class="text-[10px] font-bold text-[#012D68] bg-blue-50 px-3 py-1.5 rounded-lg">
                        {{ ucfirst($timeframe ?? 'week') }}
                    </span>
                </div>

                <div class="flex items-end justify-between gap-3 h-48 pt-4">

                    @forelse(($dailyStats ?? []) as $day => $stat)

                        @php
                            $dayLabel = is_array($stat) ? ($stat['day'] ?? $day) : $day;
                            $dayCount = is_array($stat) ? ($stat['count'] ?? $stat['total'] ?? 0) : $stat;

                            $barHeight = ($maxChartVal ?? 0) > 0
                                ? max(5, ((float) $dayCount / $maxChartVal) * 100)
                                : 5;
                        @endphp

                        <div class="flex-1 flex flex-col items-center justify-end h-full gap-2">
                            <span class="text-[10px] font-bold text-slate-500">{{ $dayCount }}</span>

                            <div class="w-full max-w-[42px] bg-blue-50 rounded-t-lg flex items-end h-32 overflow-hidden">
                                <div class="w-full rounded-t-lg bg-[#012D68]"
                                     style="height: {{ $barHeight }}%">
                                </div>
                            </div>

                            <span class="text-[10px] font-semibold text-slate-400">{{ $dayLabel }}</span>
                        </div>

                    @empty

                        <div class="w-full text-center text-xs text-slate-400 py-12">
                            Belum ada data statistik kunjungan.
                        </div>

                    @endforelse

                </div>
            </div>

            <!-- CALENDAR -->
            <div class="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">

                <div class="flex items-center justify-between mb-4">
                    <div>
                        <h2 class="font-extrabold text-slate-800 text-sm">Kalender</h2>
                        <p class="text-[11px] text-slate-400 mt-1">Ringkasan jadwal klinik</p>
                    </div>

                    <a href="{{ route('admin.calendar') }}"
                       class="text-[11px] font-bold text-[#012D68] hover:underline">
                        Lihat Jadwal
                    </a>
                </div>

                <div class="grid grid-cols-7 gap-1 text-center">

                    @foreach(['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'] as $dayName)
                        <div class="text-[10px] font-bold text-slate-400 py-2">{{ $dayName }}</div>
                    @endforeach

                    @php
                        $calendarDate = now();
                        $firstDay = $calendarDate->copy()->startOfMonth()->dayOfWeek;
                        $daysInMonth = $calendarDate->daysInMonth;
                    @endphp

                    @for($i = 0; $i < $firstDay; $i++)
                        <div class="py-2"></div>
                    @endfor

                    @for($day = 1; $day <= $daysInMonth; $day++)
                        <div class="py-2 rounded-lg text-[11px] font-semibold
                            {{ $day === now()->day
                                ? 'bg-[#012D68] text-white'
                                : 'text-slate-600 hover:bg-blue-50' }}">
                            {{ $day }}
                        </div>
                    @endfor

                </div>
            </div>

        </section>

        <!-- FINANCIAL ACTIVITIES -->
        <section class="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">

            <div class="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">

                <div>
                    <h2 class="text-sm font-extrabold text-slate-800">Aktivitas Keuangan Klinik</h2>
                    <p class="text-[11px] text-slate-400 mt-1">
                        Pantau aktivitas pembayaran dan informasi pasien
                    </p>
                </div>

                <div class="flex gap-2 flex-wrap">

                    <a href="{{ route('admin.transactions') }}"
                       class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#012D68] text-[#012D68] hover:bg-blue-50 text-xs font-bold">
                        <svg class="w-4 h-4"><use href="#i-bill"/></svg>
                        Lihat Transaksi
                    </a>

                    <button type="button"
                            onclick="openTransactionModal()"
                            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#012D68] hover:bg-[#083E88] text-white text-xs font-bold">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14"/>
                        </svg>
                        Transaksi Baru
                    </button>

                </div>
            </div>

            <!-- TABS -->
            <div class="flex flex-wrap gap-2 px-5 py-4 border-b border-slate-100">

                <button type="button"
                        onclick="switchAdminView('payments')"
                        id="tab-payments"
                        class="admin-tab px-4 py-2 rounded-lg text-xs font-bold bg-[#012D68] text-white">
                    Aktivitas Pembayaran
                </button>

                <button type="button"
                        onclick="switchAdminView('patients')"
                        id="tab-patients"
                        class="admin-tab px-4 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
                    Data Pasien
                </button>

            </div>

            <!-- PAYMENT TAB -->
            <div id="view-payments" class="admin-view">

                <div class="p-5 space-y-4">

                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div>
                            <h3 class="text-sm font-extrabold text-slate-800">Aktivitas Pembayaran</h3>
                            <p class="text-[11px] text-slate-400 mt-1">
                                Ringkasan aktivitas transaksi pasien berdasarkan status
                            </p>
                        </div>

                        <div class="relative">
                            <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                 fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="7"/>
                                <path d="m20 20-4-4"/>
                            </svg>

                            <input type="text"
                                   id="paymentSearch"
                                   oninput="applyPaymentFilters()"
                                   placeholder="Cari pasien atau invoice..."
                                   class="w-full sm:w-64 pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-400">
                        </div>
                    </div>

                    <!-- STATUS FILTER -->
                    <div class="flex flex-wrap gap-2">

                        <button type="button" onclick="filterByStatus('all', this)"
                                class="status-filter px-3 py-2 rounded-lg text-[11px] font-bold bg-[#012D68] text-white">
                            Semua
                        </button>

                        <button type="button" onclick="filterByStatus('confirmed', this)"
                                class="status-filter px-3 py-2 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600">
                            Lunas
                        </button>

                        <button type="button" onclick="filterByStatus('pending', this)"
                                class="status-filter px-3 py-2 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600">
                            Belum Dibayar
                        </button>

                        <button type="button" onclick="filterByStatus('changed', this)"
                                class="status-filter px-3 py-2 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600">
                            Perlu Verifikasi
                        </button>

                        <button type="button" onclick="filterByStatus('canceled', this)"
                                class="status-filter px-3 py-2 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600">
                            Dibatalkan
                        </button>

                    </div>

                    <!-- PAYMENT TABLE -->
                    <div class="overflow-x-auto custom-scrollbar">

                        <table class="w-full min-w-[850px] text-left" id="paymentTable">

                            <thead>
                                <tr class="bg-slate-50 border-y border-slate-100">
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">No.</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Pasien</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">No. Invoice</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Tanggal</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Layanan</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Dokter</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Nominal</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Status</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Aksi</th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">

                                @forelse(($payments ?? []) as $index => $payment)

                                    @php
                                        $status = strtolower($payment->status ?? 'unknown');

                                        $statusConfig = match($status) {
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
                                                'label' => 'Status lainnya',
                                                'badge' => 'text-slate-600 bg-slate-100 border-slate-200',
                                                'dot' => 'bg-slate-400'
                                            ]
                                        };

                                        $patientName = $payment->patient_name
                                            ?? $payment->patient?->full_name
                                            ?? 'Pasien';

                                        $doctorName = $payment->doctor_name
                                            ?? $payment->doctor?->nama_dokter
                                            ?? '-';

                                        $paymentDate = $payment->paid_at
                                            ?? $payment->created_at;

                                        $amount = $payment->net_amount
                                            ?? $payment->amount
                                            ?? 0;
                                    @endphp

                                    <tr class="payment-row hover:bg-slate-50/70"
                                        data-status="{{ $status }}"
                                        data-search="{{ strtolower($patientName . ' ' . ($payment->invoice_number ?? '') . ' ' . $doctorName) }}">

                                        <td class="px-4 py-4 text-xs text-slate-400">
                                            {{ $index + 1 }}
                                        </td>

                                        <td class="px-4 py-4">
                                            <div class="font-bold text-slate-800 text-xs">{{ $patientName }}</div>
                                        </td>

                                        <td class="px-4 py-4">
                                            <span class="font-semibold text-xs text-[#012D68]">
                                                {{ $payment->invoice_number ?? '-' }}
                                            </span>
                                        </td>

                                        <td class="px-4 py-4 text-xs text-slate-500">
                                            {{ $paymentDate ? \Carbon\Carbon::parse($paymentDate)->format('d/m/Y H:i') : '-' }}
                                        </td>

                                        <td class="px-4 py-4 text-xs text-slate-600">
                                            {{ $payment->service_type ?? '-' }}
                                        </td>

                                        <td class="px-4 py-4 text-xs text-slate-600">
                                            {{ $doctorName }}
                                        </td>

                                        <td class="px-4 py-4">
                                            <span class="font-extrabold text-slate-800 text-xs">
                                                Rp{{ number_format((float) $amount, 0, ',', '.') }}
                                            </span>
                                        </td>

                                        <td class="px-4 py-4">
                                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold {{ $statusConfig['badge'] }}">
                                                <span class="w-1.5 h-1.5 rounded-full {{ $statusConfig['dot'] }}"></span>
                                                {{ $statusConfig['label'] }}
                                            </span>
                                        </td>

                                        <td class="px-4 py-4">
                                            <button type="button"
                                                    onclick="showPaymentDetail(
                                                        @js($patientName),
                                                        @js($payment->invoice_number ?? '-'),
                                                        @js($payment->service_type ?? '-'),
                                                        @js($doctorName),
                                                        @js(number_format((float) $amount, 0, ',', '.')),
                                                        @js($statusConfig['label']),
                                                        @js($payment->payment_method ?? '-')
                                                    )"
                                                    class="px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#012D68] bg-blue-50 hover:bg-blue-100">
                                                Detail
                                            </button>
                                        </td>

                                    </tr>

                                @empty

                                    <tr>
                                        <td colspan="9" class="px-4 py-12 text-center text-xs text-slate-400">
                                            Belum ada aktivitas pembayaran.
                                        </td>
                                    </tr>

                                @endforelse

                            </tbody>
                        </table>

                        <div id="noPaymentResults" class="hidden py-8 text-center text-xs text-slate-400">
                            Tidak ada transaksi yang sesuai dengan pencarian.
                        </div>

                    </div>

                    <div class="flex justify-end pt-2">
                        <a href="{{ route('admin.transactions') }}"
                           class="text-xs font-bold text-[#012D68] hover:underline">
                            Lihat seluruh transaksi →
                        </a>
                    </div>

                </div>
            </div>

            <!-- PATIENT TAB -->
            <div id="view-patients" class="admin-view hidden">

                <div class="p-5 space-y-4">

                    <div>
                        <h3 class="text-sm font-extrabold text-slate-800">Daftar Seluruh Pasien</h3>
                        <p class="text-[11px] text-slate-400 mt-1">
                            Informasi pasien yang terdaftar pada klinik
                        </p>
                    </div>

                    <div class="relative max-w-sm">

                        <svg class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                             fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="7"/>
                            <path d="m20 20-4-4"/>
                        </svg>

                        <input type="text"
                               id="patientSearch"
                               oninput="searchPatients()"
                               placeholder="Cari nama pasien..."
                               class="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-400">
                    </div>

                    <div class="overflow-x-auto custom-scrollbar">

                        <table class="w-full min-w-[650px] text-left" id="patientTable">

                            <thead>
                                <tr class="bg-slate-50 border-y border-slate-100">
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">No.</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Nama Pasien</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">No. Telepon</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Jenis Kelamin</th>
                                    <th class="px-4 py-3 text-[10px] font-extrabold text-slate-500 uppercase">Tanggal Terdaftar</th>
                                </tr>
                            </thead>

                            <tbody class="divide-y divide-slate-100">

                                @forelse(($patients ?? []) as $index => $patient)

                                    <tr class="patient-row hover:bg-slate-50/70"
                                        data-search="{{ strtolower($patient->full_name ?? '') }}">

                                        <td class="px-4 py-4 text-xs text-slate-400">
                                            {{ $index + 1 }}
                                        </td>

                                        <td class="px-4 py-4 text-xs font-bold text-slate-800">
                                            {{ $patient->full_name ?? '-' }}
                                        </td>

                                        <td class="px-4 py-4 text-xs text-slate-600">
                                            {{ $patient->phone ?? '-' }}
                                        </td>

                                        <td class="px-4 py-4 text-xs text-slate-600">
                                            {{ $patient->gender ?? '-' }}
                                        </td>

                                        <td class="px-4 py-4 text-xs text-slate-600">
                                            {{ $patient->created_at ? $patient->created_at->format('d/m/Y') : '-' }}
                                        </td>

                                    </tr>

                                @empty

                                    <tr>
                                        <td colspan="5" class="px-4 py-12 text-center text-xs text-slate-400">
                                            Belum ada data pasien.
                                        </td>
                                    </tr>

                                @endforelse

                            </tbody>

                        </table>

                        <div id="noPatientResults" class="hidden py-8 text-center text-xs text-slate-400">
                            Pasien tidak ditemukan.
                        </div>

                    </div>

                </div>
            </div>

        </section>

        <!-- TRANSACTION MODAL -->
        <div id="transactionModal"
             class="fixed inset-0 z-50 hidden items-center justify-center bg-slate-900/50 p-4">

            <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

                <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">

                    <div>
                        <h2 class="font-extrabold text-slate-800 text-base">
                            Proses Transaksi
                        </h2>
                        <p class="text-[11px] text-slate-400 mt-1">
                            Pilih kunjungan pasien yang sudah terdaftar
                        </p>
                    </div>

                    <button type="button"
                            onclick="closeTransactionModal()"
                            class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-lg">
                        &times;
                    </button>

                </div>

                <form action="{{ route('admin.storeTransaction') }}"
                      method="POST"
                      class="p-6 space-y-5">

                    @csrf

                    <!-- EXISTING BOOKING -->
                    <div>

                        <h3 class="text-xs font-extrabold text-[#012D68] uppercase tracking-wider mb-3">
                            Data Kunjungan Pasien
                        </h3>

                        <label class="block text-xs font-bold text-slate-600 mb-1.5">
                            Pilih Kunjungan
                        </label>

                        <select name="booking_id"
                                id="bookingSelect"
                                required
                                class="w-full border border-slate-200 rounded-xl px-3 py-3 text-xs outline-none focus:border-blue-400">

                            <option value="">Pilih kunjungan pasien</option>

                            @forelse(($bookingsForPayment ?? []) as $booking)

                                <option value="{{ $booking->id }}"
                                    {{ old('booking_id') == $booking->id ? 'selected' : '' }}>

                                    {{ $booking->booking_code ?? 'Booking #' . $booking->id }}
                                    —
                                    {{ $booking->patient?->full_name ?? 'Pasien' }}
                                    —
                                    {{ $booking->doctor?->nama_dokter ?? 'Dokter' }}
                                    —
                                    {{ $booking->booking_date
                                        ? \Carbon\Carbon::parse($booking->booking_date)->format('d/m/Y')
                                        : '-' }}
                                    —
                                    {{ ucfirst($booking->payment_status ?? 'unpaid') }}

                                </option>

                            @empty

                                <option value="" disabled>
                                    Belum ada kunjungan pasien
                                </option>

                            @endforelse

                        </select>

                        @error('booking_id')
                            <p class="text-rose-500 text-[10px] mt-1">{{ $message }}</p>
                        @enderror

                        <p class="text-[10px] text-slate-400 mt-2">
                            Data pasien, dokter, dan nominal transaksi mengikuti data kunjungan yang dipilih.
                        </p>

                    </div>

                    <!-- PAYMENT INFORMATION -->
                    <div class="border-t border-slate-100 pt-5">

                        <h3 class="text-xs font-extrabold text-[#012D68] uppercase tracking-wider mb-3">
                            Informasi Pembayaran
                        </h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-1.5">
                                    Metode Pembayaran
                                </label>

                                <select name="payment_method"
                                        required
                                        class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-400">

                                    <option value="cash" {{ old('payment_method', 'cash') === 'cash' ? 'selected' : '' }}>
                                        Tunai
                                    </option>

                                    <option value="credit_card" {{ old('payment_method') === 'credit_card' ? 'selected' : '' }}>
                                        Kartu Kredit
                                    </option>

                                    <option value="debit_card" {{ old('payment_method') === 'debit_card' ? 'selected' : '' }}>
                                        Kartu Debit
                                    </option>

                                    <option value="transfer" {{ old('payment_method') === 'transfer' ? 'selected' : '' }}>
                                        Transfer Bank
                                    </option>

                                    <option value="e_wallet" {{ old('payment_method') === 'e_wallet' ? 'selected' : '' }}>
                                        E-Wallet
                                    </option>

                                </select>

                                @error('payment_method')
                                    <p class="text-rose-500 text-[10px] mt-1">{{ $message }}</p>
                                @enderror
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-600 mb-1.5">
                                    Status Pembayaran
                                </label>

                                <select name="payment_status"
                                        required
                                        class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-400">

                                    <option value="paid" {{ old('payment_status', 'paid') === 'paid' ? 'selected' : '' }}>
                                        Sudah Dibayar
                                    </option>

                                    <option value="unpaid" {{ old('payment_status') === 'unpaid' ? 'selected' : '' }}>
                                        Belum Dibayar
                                    </option>

                                </select>

                                @error('payment_status')
                                    <p class="text-rose-500 text-[10px] mt-1">{{ $message }}</p>
                                @enderror
                            </div>

                        </div>

                    </div>

                    <!-- NOTES -->
                    <div class="border-t border-slate-100 pt-5">

                        <label class="block text-xs font-bold text-slate-600 mb-1.5">
                            Catatan Transaksi
                        </label>

                        <textarea name="notes"
                                  rows="3"
                                  class="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-blue-400"
                                  placeholder="Tambahkan catatan pembayaran jika diperlukan...">{{ old('notes') }}</textarea>

                        @error('notes')
                            <p class="text-rose-500 text-[10px] mt-1">{{ $message }}</p>
                        @enderror

                    </div>

                    <!-- BUTTONS -->
                    <div class="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">

                        <button type="button"
                                onclick="closeTransactionModal()"
                                class="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">
                            Batal
                        </button>

                        <button type="submit"
                                class="px-5 py-2.5 rounded-xl bg-[#012D68] hover:bg-[#083E88] text-white text-xs font-bold">
                            Simpan Transaksi
                        </button>

                    </div>

                </form>

            </div>
        </div>

    </main>
</div>

<!-- MOBILE NAVIGATION -->
<nav class="floating-bottom-nav" aria-label="Navigasi Admin Mobile">

    <a href="{{ route('admin.dashboard') }}"
       class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}"
       title="Dashboard Keuangan" aria-label="Dashboard Keuangan">
        <svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-dashboard"/>
        </svg>
    </a>

    <a href="{{ route('admin.transactions') }}"
       class="{{ request()->routeIs('admin.transactions') ? 'active' : '' }}"
       title="Transaksi" aria-label="Transaksi">
        <svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-bill"/>
        </svg>
    </a>

    <a href="{{ $invoiceRoute }}"
       class="{{ request()->routeIs('admin.invoices') ? 'active' : '' }}"
       title="Tagihan Pasien" aria-label="Tagihan Pasien">
        <svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-receipt"/>
        </svg>
    </a>

    <a href="{{ route('admin.paymentHistory') }}"
       class="{{ request()->routeIs('admin.paymentHistory') ? 'active' : '' }}"
       title="Riwayat Pembayaran" aria-label="Riwayat Pembayaran">
        <svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-history"/>
        </svg>
    </a>

    <a href="{{ $revenueRoute }}"
       class="{{ request()->routeIs('admin.revenue') ? 'active' : '' }}"
       title="Rekap Pendapatan" aria-label="Rekap Pendapatan">
        <svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-chart"/>
        </svg>
    </a>

    <a href="{{ $reportRoute }}"
       class="{{ request()->routeIs('admin.reports') ? 'active' : '' }}"
       title="Laporan Keuangan" aria-label="Laporan Keuangan">
        <svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <use href="#i-report"/>
        </svg>
    </a>

    <form action="{{ route('logout') }}" method="POST">
        @csrf
        <button type="submit" title="Logout" aria-label="Logout">
            <svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <use href="#i-logout"/>
            </svg>
        </button>
    </form>

</nav>

<script>
    // TAB PEMBAYARAN DAN PASIEN
    function switchAdminView(view) {
        const paymentView = document.getElementById('view-payments');
        const patientView = document.getElementById('view-patients');
        const paymentTab = document.getElementById('tab-payments');
        const patientTab = document.getElementById('tab-patients');

        if (!paymentView || !patientView || !paymentTab || !patientTab) return;

        const activeClass = ['bg-[#012D68]', 'text-white'];
        const inactiveClass = ['bg-slate-100', 'text-slate-600'];

        if (view === 'patients') {
            paymentView.classList.add('hidden');
            patientView.classList.remove('hidden');

            paymentTab.classList.remove(...activeClass);
            paymentTab.classList.add(...inactiveClass);

            patientTab.classList.remove(...inactiveClass);
            patientTab.classList.add(...activeClass);
        } else {
            patientView.classList.add('hidden');
            paymentView.classList.remove('hidden');

            patientTab.classList.remove(...activeClass);
            patientTab.classList.add(...inactiveClass);

            paymentTab.classList.remove(...inactiveClass);
            paymentTab.classList.add(...activeClass);
        }
    }

    // PAYMENT FILTER
    let activePaymentStatus = 'all';

    function applyPaymentFilters() {
        const searchInput = document.getElementById('paymentSearch');
        const rows = document.querySelectorAll('.payment-row');
        const noResults = document.getElementById('noPaymentResults');

        const keyword = searchInput
            ? searchInput.value.toLowerCase().trim()
            : '';

        let visibleCount = 0;

        rows.forEach(row => {
            const rowStatus = (row.dataset.status || '').toLowerCase();
            const searchText = (row.dataset.search || '').toLowerCase();

            const isSuccessful = ['confirmed', 'paid'].includes(rowStatus);

            const statusMatch =
                activePaymentStatus === 'all' ||
                (activePaymentStatus === 'confirmed' && isSuccessful) ||
                rowStatus === activePaymentStatus;

            const searchMatch = searchText.includes(keyword);
            const visible = statusMatch && searchMatch;

            row.classList.toggle('hidden', !visible);

            if (visible) visibleCount++;
        });

        if (noResults) {
            noResults.classList.toggle('hidden', visibleCount > 0);
        }
    }

    function searchPayments() {
        applyPaymentFilters();
    }

    function filterByStatus(status, button) {
        activePaymentStatus = status;

        const buttons = document.querySelectorAll('.status-filter');

        buttons.forEach(item => {
            item.classList.remove('bg-[#012D68]', 'text-white');
            item.classList.add('bg-slate-100', 'text-slate-600');
        });

        if (button) {
            button.classList.remove('bg-slate-100', 'text-slate-600');
            button.classList.add('bg-[#012D68]', 'text-white');
        }

        applyPaymentFilters();
    }

    // PATIENT SEARCH
    function searchPatients() {
        const searchInput = document.getElementById('patientSearch');
        const rows = document.querySelectorAll('.patient-row');
        const noResults = document.getElementById('noPatientResults');

        if (!searchInput) return;

        const keyword = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        rows.forEach(row => {
            const searchText = row.dataset.search || '';
            const visible = searchText.includes(keyword);

            row.classList.toggle('hidden', !visible);

            if (visible) visibleCount++;
        });

        if (noResults) {
            noResults.classList.toggle('hidden', visibleCount > 0);
        }
    }

    // OPEN MODAL
    function openTransactionModal() {
        const modal = document.getElementById('transactionModal');

        if (!modal) return;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }

    // CLOSE MODAL
    function closeTransactionModal() {
        const modal = document.getElementById('transactionModal');

        if (!modal) return;

        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }

    // PAYMENT DETAIL
    function showPaymentDetail(patient, invoice, service, doctor, amount, status, method) {
        alert(
            'DETAIL PEMBAYARAN\n\n' +
            'Nama Pasien: ' + patient + '\n' +
            'Nomor Invoice: ' + invoice + '\n' +
            'Layanan: ' + service + '\n' +
            'Dokter: ' + doctor + '\n' +
            'Metode Pembayaran: ' + method + '\n' +
            'Nominal: Rp' + amount + '\n' +
            'Status: ' + status
        );
    }

    // PAGE INITIALIZATION
    document.addEventListener('DOMContentLoaded', function () {

        // Buka modal kembali jika validasi gagal.
        @if ($errors->any())
            openTransactionModal();
        @endif

        applyPaymentFilters();
    });

    // CLICK OUTSIDE MODAL
    document.getElementById('transactionModal')?.addEventListener('click', function (event) {
        if (event.target === this) {
            closeTransactionModal();
        }
    });

    // ESCAPE TO CLOSE MODAL
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeTransactionModal();
        }
    });
</script>

</body>
</html>
