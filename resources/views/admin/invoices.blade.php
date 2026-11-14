
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Tagihan Pasien | Klinik Maristella</title>

    @if (file_exists(public_path('build/manifest.json')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script src="https://cdn.tailwindcss.com"></script>
    @endif

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <style>
        * {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        body {
            background: #f5f7fb;
            color: #172033;
        }

        .sidebar {
            width: 260px;
            min-height: 100vh;
            background: #fff;
            border-right: 1px solid #e8edf5;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 20;
        }

        .main-content {
            margin-left: 260px;
            padding: 32px;
        }

        .nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            border-radius: 12px;
            color: #64748b;
            font-size: 13px;
            font-weight: 600;
            transition: .2s;
        }

        .nav-link:hover,
        .nav-link.active {
            background: #eff6ff;
            color: #2563eb;
        }

        .card {
            background: #fff;
            border: 1px solid #e9eef5;
            border-radius: 18px;
        }

        .table-wrap {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 850px;
        }

        th {
            padding: 15px 18px;
            background: #f8fafc;
            color: #64748b;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: .04em;
        }

        td {
            padding: 16px 18px;
            border-top: 1px solid #edf1f6;
            font-size: 12px;
        }

        .status {
            display: inline-flex;
            padding: 6px 10px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
        }

        .status-paid {
            background: #dcfce7;
            color: #15803d;
        }

        .status-pending {
            background: #fef3c7;
            color: #b45309;
        }

        .status-changed {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .status-canceled {
            background: #fee2e2;
            color: #b91c1c;
        }

        @media (max-width: 900px) {
            .sidebar {
                display: none;
            }

            .main-content {
                margin-left: 0;
                padding: 20px 14px 35px;
            }
        }
    </style>
</head>

<body>

@php
    $statusLabels = [
        'confirmed' => 'Lunas',
        'paid' => 'Lunas',
        'pending' => 'Belum Dibayar',
        'changed' => 'Perlu Verifikasi',
        'canceled' => 'Dibatalkan',
    ];
@endphp

<!-- SIDEBAR -->
<aside class="sidebar p-5 flex flex-col">
    <div class="mb-9">
        <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg">
                M
            </div>
            <div>
                <h1 class="font-extrabold text-lg text-slate-800">
                    Maristella
                </h1>
                <p class="text-xs text-slate-400">
                    Clinic Management
                </p>
            </div>
        </div>
    </div>

    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
        Menu Keuangan
    </p>

    <nav class="space-y-2">
        <a href="{{ route('admin.dashboard') }}" class="nav-link">
            <span>▦</span> Dashboard Keuangan
        </a>

        <a href="{{ route('admin.transactions') }}" class="nav-link">
            <span>⇄</span> Transaksi
        </a>

        <a href="{{ route('admin.invoices') }}" class="nav-link active">
            <span>▤</span> Tagihan Pasien
        </a>

        <a href="{{ route('admin.paymentHistory') }}" class="nav-link">
            <span>◷</span> Riwayat Pembayaran
        </a>

        <a href="{{ route('admin.revenue') }}" class="nav-link">
            <span>↗</span> Rekap Pendapatan
        </a>

        <a href="{{ route('admin.reports') }}" class="nav-link">
            <span>▧</span> Laporan Keuangan
        </a>
    </nav>

    <div class="mt-auto pt-6">
        <div class="border-t border-slate-100 pt-4 mb-4">
            <p class="font-bold text-sm text-slate-700">
                {{ $user['name'] ?? 'Admin Klinik' }}
            </p>
            <p class="text-xs text-slate-400">Administrator</p>
        </div>

        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button type="submit" class="nav-link w-full text-red-500 hover:bg-red-50">
                <span>↪</span> Logout
            </button>
        </form>
    </div>
</aside>

<!-- MAIN CONTENT -->
<main class="main-content">

    <!-- HEADER -->
    <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
            <p class="text-xs text-slate-400 mb-2">
                Admin / Manajemen Keuangan / Tagihan Pasien
            </p>

            <h2 class="text-2xl md:text-3xl font-extrabold text-slate-800">
                Tagihan Pasien
            </h2>

            <p class="text-sm text-slate-500 mt-2">
                Kelola dan pantau seluruh tagihan pembayaran pasien klinik.
            </p>
        </div>

        <a href="{{ route('admin.exportCsv') }}"
           class="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 text-xs font-bold text-center">
            Unduh Data CSV
        </a>
    </header>

    <!-- FLASH MESSAGE -->
    @if (session('success'))
        <div class="mb-5 p-4 rounded-xl bg-green-50 text-green-700 text-sm">
            {{ session('success') }}
        </div>
    @endif

    @if ($errors->any())
        <div class="mb-5 p-4 rounded-xl bg-red-50 text-red-700 text-sm">
            {{ $errors->first() }}
        </div>
    @endif

    <!-- SUMMARY CARDS -->
    <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">

        <div class="card p-5">
            <p class="text-xs font-semibold text-slate-400">
                Total Tagihan
            </p>
            <h3 class="text-2xl font-extrabold mt-3">
                {{ number_format($totalInvoices ?? 0, 0, ',', '.') }}
            </h3>
            <p class="text-xs text-slate-400 mt-2">
                Seluruh tagihan pasien
            </p>
        </div>

        <div class="card p-5">
            <p class="text-xs font-semibold text-slate-400">
                Tagihan Lunas
            </p>
            <h3 class="text-2xl font-extrabold text-green-600 mt-3">
                {{ number_format($paidInvoices ?? 0, 0, ',', '.') }}
            </h3>
            <p class="text-xs text-slate-400 mt-2">
                Pembayaran berhasil
            </p>
        </div>

        <div class="card p-5">
            <p class="text-xs font-semibold text-slate-400">
                Belum Dibayar
            </p>
            <h3 class="text-2xl font-extrabold text-amber-600 mt-3">
                {{ number_format($unpaidInvoices ?? 0, 0, ',', '.') }}
            </h3>
            <p class="text-xs text-slate-400 mt-2">
                Menunggu pembayaran
            </p>
        </div>

        <div class="card p-5">
            <p class="text-xs font-semibold text-slate-400">
                Perlu Verifikasi
            </p>
            <h3 class="text-2xl font-extrabold text-blue-600 mt-3">
                {{ number_format($verificationInvoices ?? 0, 0, ',', '.') }}
            </h3>
            <p class="text-xs text-slate-400 mt-2">
                Pembayaran perlu diperiksa
            </p>
        </div>

    </section>

    <!-- TOTAL INVOICE -->
    <section class="card p-5 mb-7">
        <p class="text-xs font-semibold text-slate-400">
            Total Nominal Tagihan
        </p>

        <h3 class="text-2xl font-extrabold text-blue-700 mt-2">
            Rp {{ number_format($totalInvoiceAmount ?? 0, 0, ',', '.') }}
        </h3>

        <p class="text-xs text-slate-400 mt-2">
            Akumulasi nominal seluruh tagihan, termasuk yang belum dibayar.
        </p>
    </section>

    <!-- TABLE -->
    <section class="card overflow-hidden">

        <div class="p-5 md:p-6 border-b border-slate-100">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                <div>
                    <h3 class="font-extrabold text-slate-800">
                        Daftar Tagihan Pasien
                    </h3>

                    <p class="text-xs text-slate-400 mt-1">
                        Informasi tagihan dan status pembayaran.
                    </p>
                </div>

                <form action="{{ route('admin.invoices') }}"
                      method="GET"
                      class="flex flex-col sm:flex-row gap-2">

                    <input
                        type="text"
                        name="search"
                        value="{{ $search ?? '' }}"
                        placeholder="Cari pasien atau invoice..."
                        class="border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500"
                    >

                    <select
                        name="status"
                        class="border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-blue-500"
                    >
                        <option value="all" {{ ($status ?? 'all') === 'all' ? 'selected' : '' }}>
                            Semua Status
                        </option>

                        <option value="confirmed" {{ ($status ?? '') === 'confirmed' ? 'selected' : '' }}>
                            Lunas
                        </option>

                        <option value="pending" {{ ($status ?? '') === 'pending' ? 'selected' : '' }}>
                            Belum Dibayar
                        </option>

                        <option value="changed" {{ ($status ?? '') === 'changed' ? 'selected' : '' }}>
                            Perlu Verifikasi
                        </option>

                        <option value="canceled" {{ ($status ?? '') === 'canceled' ? 'selected' : '' }}>
                            Dibatalkan
                        </option>
                    </select>

                    <button type="submit"
                            class="bg-blue-600 text-white rounded-xl px-5 py-3 text-xs font-bold">
                        Cari
                    </button>

                </form>
            </div>
        </div>

        <div class="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Nomor Invoice</th>
                        <th>Pasien</th>
                        <th>Dokter</th>
                        <th>Layanan</th>
                        <th>Metode Pembayaran</th>
                        <th>Nominal</th>
                        <th>Status</th>
                        <th>Tanggal</th>
                    </tr>
                </thead>

                <tbody>
                    @forelse ($payments as $index => $payment)

                        @php
                            $paymentStatus = $payment->status ?? 'pending';

                            $statusClass = match ($paymentStatus) {
                                'confirmed', 'paid' => 'status-paid',
                                'pending' => 'status-pending',
                                'changed' => 'status-changed',
                                'canceled' => 'status-canceled',
                                default => 'status-pending',
                            };

                            $statusLabel = $statusLabels[$paymentStatus]
                                ?? 'Status Lainnya';

                            $patientName = $payment->patient_name
                                ?? $payment->patient?->full_name
                                ?? $payment->booking?->patient?->full_name
                                ?? '-';

                            $doctorName = $payment->doctor_name
                                ?? $payment->doctor?->nama_dokter
                                ?? $payment->booking?->doctor?->nama_dokter
                                ?? '-';
                        @endphp

                        <tr>
                            <td>
                                {{ $payments->firstItem() + $index }}
                            </td>

                            <td>
                                <span class="font-bold text-blue-700">
                                    {{ $payment->invoice_number ?? '-' }}
                                </span>
                            </td>

                            <td>
                                <span class="font-bold text-slate-700">
                                    {{ $patientName }}
                                </span>
                            </td>

                            <td>
                                {{ $doctorName }}
                            </td>

                            <td>
                                {{ $payment->service_type ?? '-' }}
                            </td>

                            <td>
                                {{ strtoupper($payment->payment_method ?? '-') }}
                            </td>

                            <td>
                                <span class="font-bold">
                                    Rp {{ number_format((float) $payment->net_amount, 0, ',', '.') }}
                                </span>
                            </td>

                            <td>
                                <span class="status {{ $statusClass }}">
                                    {{ $statusLabel }}
                                </span>
                            </td>

                            <td>
                                {{ $payment->created_at
                                    ? $payment->created_at->format('d/m/Y')
                                    : '-' }}
                            </td>
                        </tr>

                    @empty
                        <tr>
                            <td colspan="9" class="text-center py-12 text-slate-400">
                                Belum ada data tagihan pasien.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        <!-- PAGINATION -->
        <div class="p-5 border-t border-slate-100">
            {{ $payments->links() }}
        </div>

    </section>

    <footer class="text-center text-xs text-slate-400 mt-8">
        © {{ date('Y') }} Klinik Maristella. Admin Financial Management.
    </footer>

</main>

</body>
</html>
