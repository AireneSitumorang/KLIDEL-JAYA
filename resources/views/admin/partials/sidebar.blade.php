
@php
    $activeMenu = $activeMenu ?? 'dashboard';

    $menus = [
        [
            'key' => 'dashboard',
            'label' => 'Dashboard Keuangan',
            'icon' => '▦',
            'route' => 'admin.dashboard',
        ],
        [
            'key' => 'transactions',
            'label' => 'Transaksi',
            'icon' => '↔',
            'route' => 'admin.transactions',
        ],
        [
            'key' => 'invoices',
            'label' => 'Tagihan Pasien',
            'icon' => '▤',
            'route' => 'admin.invoices',
        ],
        [
            'key' => 'payment-history',
            'label' => 'Riwayat Pembayaran',
            'icon' => '◷',
            'route' => 'admin.paymentHistory',
        ],
        [
            'key' => 'revenue',
            'label' => 'Rekap Pendapatan',
            'icon' => '▥',
            'route' => 'admin.revenue',
        ],
        [
            'key' => 'reports',
            'label' => 'Laporan Keuangan',
            'icon' => '▧',
            'route' => 'admin.reports',
        ],
    ];
@endphp

<style>
    .admin-sidebar {
        background: #172554;
        min-height: 100vh;
        width: 256px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        padding: 20px;
    }

    .admin-menu-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 15px;
        border-radius: 10px;
        color: #cbd5e1;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        transition: .2s;
    }

    .admin-menu-link:hover {
        background: #1e40af;
        color: #ffffff;
    }

    .admin-menu-link.active {
        background: #2563eb;
        color: #ffffff;
    }

    .admin-logout-button {
        width: 100%;
        border: 0;
        background: transparent;
        cursor: pointer;
        text-align: left;
    }

    .admin-logout-button:hover {
        background: #dc2626;
        color: #ffffff;
    }

    @media (max-width: 768px) {
        .admin-sidebar {
            width: 100%;
            min-height: auto;
        }
    }
</style>

<aside class="admin-sidebar">
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
        @foreach ($menus as $menu)
            <a href="{{ route($menu['route']) }}"
               class="admin-menu-link {{ $activeMenu === $menu['key'] ? 'active' : '' }}">

                <span class="text-base">{{ $menu['icon'] }}</span>

                <span>{{ $menu['label'] }}</span>
            </a>
        @endforeach
    </nav>

    <form action="{{ route('logout') }}" method="POST" class="mt-6">
        @csrf

        <button type="submit"
                class="admin-menu-link admin-logout-button">
            <span>⇥</span>
            <span>Logout</span>
        </button>
    </form>
</aside>
