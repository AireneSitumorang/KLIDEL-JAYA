
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Apoteker - Klinik Maristella</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            background: #f4f7fb;
            color: #243047;
        }

        .navbar {
            background: #ffffff;
            padding: 18px 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e8edf4;
        }

        .brand {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
        }

        .profile {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .profile-info {
            text-align: right;
        }

        .profile-info strong {
            display: block;
            font-size: 14px;
        }

        .profile-info span {
            font-size: 12px;
            color: #64748b;
        }

        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #dbeafe;
            color: #2563eb;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
        }

        .container {
            max-width: 1200px;
            margin: 30px auto;
            padding: 0 25px;
        }

        .welcome {
            margin-bottom: 25px;
        }

        .welcome h1 {
            font-size: 25px;
            margin-bottom: 8px;
        }

        .welcome p {
            color: #64748b;
            font-size: 14px;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: #ffffff;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #e8edf4;
        }

        .stat-card p {
            color: #64748b;
            font-size: 14px;
            margin-bottom: 12px;
        }

        .stat-card h2 {
            font-size: 28px;
            color: #2563eb;
        }

        .section {
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e8edf4;
            padding: 24px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .section-header h2 {
            font-size: 18px;
        }

        .section-header span {
            font-size: 13px;
            color: #64748b;
        }

        .table-wrapper {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 750px;
        }

        th, td {
            padding: 15px 12px;
            text-align: left;
            border-bottom: 1px solid #edf0f5;
            font-size: 13px;
            vertical-align: top;
        }

        th {
            color: #64748b;
            background: #f8fafc;
            font-weight: 600;
        }

        td {
            line-height: 1.6;
        }

        .medicine-list {
            padding-left: 18px;
        }

        .medicine-list li {
            margin-bottom: 5px;
        }

        .status {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 20px;
            background: #dcfce7;
            color: #15803d;
            font-size: 11px;
            font-weight: bold;
        }

        .empty {
            text-align: center;
            padding: 40px 15px;
            color: #64748b;
        }

        .logout-form button {
            border: none;
            background: #fee2e2;
            color: #dc2626;
            padding: 9px 14px;
            border-radius: 7px;
            cursor: pointer;
            font-weight: bold;
        }

        .logout-form button:hover {
            background: #fecaca;
        }

        @media (max-width: 650px) {
            .navbar {
                padding: 15px;
            }

            .container {
                padding: 0 15px;
            }

            .stats {
                grid-template-columns: 1fr;
            }

            .welcome h1 {
                font-size: 21px;
            }

            .section {
                padding: 15px;
            }

            .profile-info {
                display: none;
            }
        }
    </style>
</head>

<body>

    <!-- NAVBAR -->
    <header class="navbar">
        <div class="brand">
            Klinik Maristella
        </div>

        <div class="profile">
            <div class="profile-info">
                <strong>{{ $apoteker['name'] }}</strong>
                <span>{{ $apoteker['role'] }}</span>
            </div>

            <div class="avatar">
                {{ strtoupper(substr($apoteker['name'], 0, 1)) }}
            </div>

            <form action="{{ route('logout') }}" method="POST" class="logout-form">
                @csrf
                <button type="submit">Logout</button>
            </form>
        </div>
    </header>


    <!-- MAIN CONTENT -->
    <main class="container">

        <!-- WELCOME -->
        <div class="welcome">
            <h1>Dashboard Apoteker</h1>
            <p>
                Selamat datang, {{ $apoteker['name'] }}.
                Berikut adalah daftar pesanan obat pasien.
            </p>
        </div>


        <!-- STATISTICS -->
        <div class="stats">

            <div class="stat-card">
                <p>Total Pesanan Terbayar</p>
                <h2>{{ $stats['total_orders'] }}</h2>
            </div>

            <div class="stat-card">
                <p>Total Item Obat</p>
                <h2>{{ $stats['total_obat'] }}</h2>
            </div>

        </div>


        <!-- ORDER TABLE -->
        <section class="section">

            <div class="section-header">
                <h2>Daftar Pesanan Obat</h2>
                <span>{{ $orders->count() }} pesanan</span>
            </div>

            <div class="table-wrapper">
                <table>

                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Kode Booking</th>
                            <th>Nama Pasien</th>
                            <th>Dokter</th>
                            <th>Daftar Obat</th>
                            <th>Pembayaran</th>
                        </tr>
                    </thead>

                    <tbody>

                        @forelse ($orders as $index => $order)

                            @php
                                $medications = $order->medicalRecord?->plan['medications'] ?? [];
                            @endphp

                            <tr>
                                <td>{{ $index + 1 }}</td>

                                <td>
                                    {{ $order->booking_code ?? '-' }}
                                </td>

                                <td>
                                    {{ $order->patient?->name ?? '-' }}
                                </td>

                                <td>
                                    {{ $order->doctor?->name ?? '-' }}
                                </td>

                                <td>
                                    @if (is_array($medications) && count($medications) > 0)

                                        <ul class="medicine-list">
                                            @foreach ($medications as $medicine)
                                                <li>
                                                    @if (is_array($medicine))
                                                        {{ $medicine['name'] ?? $medicine['nama_obat'] ?? 'Nama obat tidak tersedia' }}

                                                        @if (!empty($medicine['dose']))
                                                            - {{ $medicine['dose'] }}
                                                        @endif

                                                        @if (!empty($medicine['frequency']))
                                                            ({{ $medicine['frequency'] }})
                                                        @endif
                                                    @else
                                                        {{ $medicine }}
                                                    @endif
                                                </li>
                                            @endforeach
                                        </ul>

                                    @else
                                        Belum ada daftar obat.
                                    @endif
                                </td>

                                <td>
                                    <span class="status">Sudah Dibayar</span>
                                </td>
                            </tr>

                        @empty

                            <tr>
                                <td colspan="6" class="empty">
                                    Belum ada pesanan obat yang sudah dibayar.
                                </td>
                            </tr>

                        @endforelse

                    </tbody>

                </table>
            </div>

        </section>

    </main>

</body>
</html>
