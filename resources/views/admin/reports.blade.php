
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Laporan Keuangan | Klinik Maristella</title>

    @if (file_exists(public_path('build/manifest.json')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script src="https://cdn.tailwindcss.com"></script>
    @endif

    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background: #f5f7fb;
        }

        .sidebar {
            background: #172554;
            min-height: 100vh;
        }

        .menu-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 15px;
            border-radius: 10px;
            color: #cbd5e1;
            font-size: 13px;
            font-weight: 600;
            transition: .2s;
        }

        .menu-link:hover,
        .menu-active {
            background: #2563eb;
            color: white;
        }

        .card {
            background: white;
            border-radius: 15px;
            padding: 22px;
            border: 1px solid #e8edf5;
        }

        .table-container {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 650px;
        }

        th {
            background: #f8fafc;
            color: #64748b;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .5px;
            padding: 15px;
            text-align: left;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 12px;
            color: #334155;
        }

        .report-label {
            color: #64748b;
            font-size: 12px;
        }

        .report-value {
            color: #1e293b;
            font-size: 14px;
            font-weight: 800;
        }
    </style>
</head>

<body>
@php
    $formatRupiah = fn ($value) => 'Rp ' . number_format((float) $value, 0, ',', '.');

    $timeframeLabels = [
        'today' => 'Hari Ini',
        'week' => 'Minggu Ini',
        'month' => 'Bulan Ini',
        'year' => 'Tahun Ini',
        'all' => 'Semua Waktu',
    ];

    $currentTimeframe = $timeframe ?? 'month';
@endphp

<div class="flex min-h-screen">

    {{-- SIDEBAR --}}
    <aside class="sidebar w-64 p-5 flex flex-col shrink-0">
        <div class="mb-9">
            <h1 class="text-white text-xl font-extrabold tracking-wide">
                MARISTELLA
            </h1>

            <p class="text-blue-300 text-xs mt-1">
                Clinic Management System
            </p>
        </div>

        <p class="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-3">
            Menu Admin
        </p>

        <nav class="space-y-2 flex-1">
            <a href="{{ route('admin.dashboard') }}" class="menu-link">
                <span>▦</span> Dashboard Keuangan
            </a>

            <a href="{{ route('admin.transactions') }}" class="menu-link">
                <span>↔</span> Transaksi
            </a>

            <a href="{{ route('admin.invoices') }}" class="menu-link">
                <span>▤</span> Tagihan Pasien
            </a>

            <a href="{{ route('admin.paymentHistory') }}" class="menu-link">
                <span>◷</span> Riwayat Pembayaran
            </a>

            <a href="{{ route('admin.revenue') }}" class="menu-link">
                <span>▥</span> Rekap Pendapatan
            </a>

            <a href="{{ route('admin.reports') }}" class="menu-link menu-active">
                <span>▧</span> Laporan Keuangan
            </a>
        </nav>

        <form action="{{ route('logout') }}" method="POST" class="mt-6">
            @csrf
            <button type="submit"
                class="menu-link w-full text-left hover:bg-red-600">
                <span>⇥</span> Logout
            </button>
        </form>
    </aside>

    {{-- MAIN CONTENT --}}
    <main class="flex-1 min-w-0 p-5 md:p-8">

        <header class="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div>
                <p class="text-xs text-slate-400 font-semibold mb-1">
                    ADMIN / LAPORAN KEUANGAN
                </p>

                <h2 class="text-2xl font-extrabold text-slate-800">
                    Laporan Keuangan
                </h2>

                <p class="text-sm text-slate-500 mt-1">
                    Informasi transaksi dan kondisi keuangan klinik.
                </p>
            </div>

            <div class="bg-white border rounded-xl px-4 py-3">
                <p class="text-xs text-slate-400">Login sebagai</p>

                <p class="text-sm font-bold text-slate-700">
                    {{ $user['name'] ?? $admin['name'] ?? 'Admin' }}
                </p>
            </div>
        </header>

        {{-- FILTER --}}
        <section class="card mb-6">
            <form action="{{ route('admin.reports') }}" method="GET"
                class="flex flex-wrap items-end gap-4">

                <div class="flex-1 min-w-48">
                    <label class="block text-xs font-bold text-slate-600 mb-2">
                        Periode Laporan
                    </label>

                    <select name="timeframe"
                        class="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-500">

                        @foreach ($timeframeLabels as $value => $label)
                            <option value="{{ $value }}"
                                {{ $currentTimeframe === $value ? 'selected' : '' }}>
                                {{ $label }}
                            </option>
                        @endforeach

                    </select>
                </div>

                <button type="submit"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm font-bold">
                    Tampilkan Laporan
                </button>

                <a href="{{ route('admin.exportCsv') }}"
                    class="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg text-sm font-bold">
                    Export CSV
                </a>
            </form>
        </section>

        {{-- SUMMARY --}}
        <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-7">

            <div class="card">
                <p class="report-label">Total Transaksi</p>

                <h3 class="text-2xl font-extrabold text-slate-800 mt-3">
                    {{ number_format((int) ($totalTransactions ?? 0), 0, ',', '.') }}
                </h3>
            </div>

            <div class="card">
                <p class="report-label">Pembayaran Berhasil</p>

                <h3 class="text-2xl font-extrabold text-emerald-600 mt-3">
                    {{ number_format((int) ($totalSuccessfulPayments ?? 0), 0, ',', '.') }}
                </h3>
            </div>

            <div class="card">
                <p class="report-label">Total Pendapatan</p>

                <h3 class="text-2xl font-extrabold text-blue-600 mt-3">
                    {{ $formatRupiah($totalRevenue ?? 0) }}
                </h3>
            </div>

            <div class="card">
                <p class="report-label">Menunggu Pembayaran</p>

                <h3 class="text-2xl font-extrabold text-amber-600 mt-3">
                    {{ number_format((int) ($pendingPayments ?? 0), 0, ',', '.') }}
                </h3>
            </div>

            <div class="card">
                <p class="report-label">Perlu Verifikasi</p>

                <h3 class="text-2xl font-extrabold text-orange-600 mt-3">
                    {{ number_format((int) ($verificationPayments ?? 0), 0, ',', '.') }}
                </h3>
            </div>

            <div class="card">
                <p class="report-label">Transaksi Dibatalkan</p>

                <h3 class="text-2xl font-extrabold text-red-600 mt-3">
                    {{ number_format((int) ($canceledPayments ?? 0), 0, ',', '.') }}
                </h3>
            </div>

        </section>

        {{-- AVERAGE PAYMENT --}}
        <section class="card mb-7">
            <p class="text-xs text-slate-500 font-semibold">
                Rata-rata Pembayaran Berhasil
            </p>

            <h3 class="text-3xl font-extrabold text-violet-600 mt-3">
                {{ $formatRupiah($averagePayment ?? 0) }}
            </h3>

            <p class="text-xs text-slate-400 mt-2">
                Berdasarkan jumlah pembayaran berhasil dalam periode laporan.
            </p>
        </section>

        {{-- PAYMENT METHOD SUMMARY --}}
        <section class="card mb-7">
            <div class="mb-5">
                <h3 class="text-base font-extrabold text-slate-800">
                    Rekap Metode Pembayaran
                </h3>

                <p class="text-xs text-slate-400 mt-1">
                    Pengelompokan pembayaran berdasarkan metode yang digunakan.
                </p>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Metode Pembayaran</th>
                            <th>Jumlah Transaksi</th>
                            <th>Total Pendapatan</th>
                        </tr>
                    </thead>

                    <tbody>
                        @forelse ($paymentMethods ?? [] as $index => $method)
                            <tr>
                                <td>{{ $index + 1 }}</td>

                                <td class="font-bold">
                                    {{ ucfirst(str_replace('_', ' ', $method->payment_method ?? 'Tidak diketahui')) }}
                                </td>

                                <td>
                                    {{ number_format((int) ($method->total_transactions ?? 0), 0, ',', '.') }}
                                </td>

                                <td class="font-bold text-emerald-600">
                                    {{ $formatRupiah($method->total_amount ?? 0) }}
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="4" class="text-center py-10 text-slate-400">
                                    Belum ada data metode pembayaran.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </section>

        {{-- TRANSACTION DETAILS --}}
        <section class="card">
            <div class="mb-5">
                <h3 class="text-base font-extrabold text-slate-800">
                    Detail Laporan Transaksi
                </h3>

                <p class="text-xs text-slate-400 mt-1">
                    Daftar transaksi keuangan sesuai periode yang dipilih.
                </p>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Pasien</th>
                            <th>Metode Pembayaran</th>
                            <th>Tanggal</th>
                            <th>Jumlah</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        @forelse ($payments ?? [] as $index => $payment)
                            @php
                                $status = strtolower($payment->status ?? 'pending');

                                $statusLabels = [
                                    'paid' => 'Lunas',
                                    'confirmed' => 'Lunas',
                                    'pending' => 'Belum Dibayar',
                                    'changed' => 'Perlu Verifikasi',
                                    'canceled' => 'Dibatalkan',
                                ];

                                $statusColors = [
                                    'paid' => 'bg-emerald-100 text-emerald-700',
                                    'confirmed' => 'bg-emerald-100 text-emerald-700',
                                    'pending' => 'bg-amber-100 text-amber-700',
                                    'changed' => 'bg-orange-100 text-orange-700',
                                    'canceled' => 'bg-red-100 text-red-700',
                                ];
                            @endphp

                            <tr>
                                <td>{{ $index + 1 }}</td>

                                <td class="font-bold">
                                    {{ $payment->patient->name ?? $payment->patient->nama ?? 'Pasien' }}
                                </td>

                                <td>
                                    {{ ucfirst(str_replace('_', ' ', $payment->payment_method ?? '-')) }}
                                </td>

                                <td>
                                    {{ $payment->created_at
                                        ? \Carbon\Carbon::parse($payment->created_at)->format('d M Y')
                                        : '-' }}
                                </td>

                                <td class="font-bold">
                                    {{ $formatRupiah($payment->net_amount ?? 0) }}
                                </td>

                                <td>
                                    <span class="px-3 py-1 rounded-full text-[10px] font-bold {{ $statusColors[$status] ?? 'bg-slate-100 text-slate-600' }}">
                                        {{ $statusLabels[$status] ?? ucfirst($status) }}
                                    </span>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="6" class="text-center py-10 text-slate-400">
                                    Belum ada transaksi pada periode ini.
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </section>

        <footer class="text-center text-xs text-slate-400 mt-8">
            © {{ date('Y') }} Klinik Maristella. Laporan Keuangan Admin.
        </footer>

    </main>
</div>
</body>
</html>
