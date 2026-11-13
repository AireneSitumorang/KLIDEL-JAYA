<!DOCTYPE html>
<html lang="id" data-theme="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Klinik Maristella') }} — Solusi Kesehatan Modern & Terpercaya</title>
    <link rel="icon" type="image/png" href="{{ asset('images/maristella-icon.png') }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
        <script src="{{ asset('js/app.js') }}" defer></script>
    @endif
</head>
<body class="antialiased selection:bg-[#012D68] selection:text-white">
    <!-- SVG Sprite Definitions -->
    <svg width="0" height="0" class="hidden" style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
        <defs>
            <symbol id="icon-plus" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></symbol>
            <symbol id="icon-home" viewBox="0 0 24 24"><path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></symbol>
            <symbol id="icon-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></symbol>
            <symbol id="icon-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></symbol>
            <symbol id="icon-doc" viewBox="0 0 24 24"><path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></symbol>
            <symbol id="icon-set" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></symbol>
            <symbol id="icon-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></symbol>
            <symbol id="icon-bell" viewBox="0 0 24 24"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0"/></symbol>
            <symbol id="icon-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
            <symbol id="icon-vid" viewBox="0 0 24 24"><rect x="2" y="6" width="14" height="12" rx="3"/><path d="m16 10 6-3v10l-6-3"/></symbol>
            <symbol id="icon-up" viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></symbol>
            <symbol id="icon-left" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></symbol>
            <symbol id="icon-msg" viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></symbol>
            <symbol id="icon-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></symbol>
            <symbol id="icon-close" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></symbol>
            <symbol id="icon-sparkle" viewBox="0 0 24 24"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/></symbol>
            <symbol id="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></symbol>
            <symbol id="icon-moon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></symbol>
            <!-- Billing & Payment SVG Symbols from Zendenta Adapted Spec -->
            <symbol id="i-tooth" viewBox="0 0 24 24"><path d="M7 3c-2.5 0-4 2-4 4.5 0 2 1 3 1.5 5S5 21 7 21c1.5 0 1.5-5 5-5s3.5 5 5 5c2 0 2.5-6.5 3-8.5S21 9.5 21 7.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
            <symbol id="i-pulse" viewBox="0 0 24 24"><path d="M3 12h4l3-8 4 16 3-8h4" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
            <symbol id="i-wallet" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" fill="none" stroke-width="1.8"/><path d="M3 10h18M16 15h2" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round"/></symbol>
            <symbol id="i-card" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" fill="none" stroke-width="1.8"/><path d="M2 10h20" stroke="currentColor" fill="none" stroke-width="1.8"/></symbol>
            <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round"/></symbol>
            <symbol id="i-chev" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
            <symbol id="i-down" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
            <symbol id="i-up2" viewBox="0 0 24 24"><path d="M6 17l6-6 6 6M6 11l6-6 6 6" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
            <symbol id="i-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
            <symbol id="i-more" viewBox="0 0 24 24"><path d="M5 12h.01M12 12h.01M19 12h.01" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round"/></symbol>
            <symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
            <symbol id="i-cash" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" fill="none" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" fill="none" stroke-width="1.8"/></symbol>
            <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="currentColor" fill="none" stroke-width="1.8"/><path d="M12 8h.01M11 12h1v4h1" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round"/></symbol>
            <symbol id="i-wrench" viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 005 5L21 13l-8 8-3-3 8-8-1.3-1.3a4 4 0 01-2-2.4zM3 21l5-5" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
            <symbol id="i-pill" viewBox="0 0 24 24"><rect x="8" y="3" width="8" height="18" rx="4" stroke="currentColor" fill="none" stroke-width="1.8"/><path d="M8 12h8" stroke="currentColor" fill="none" stroke-width="1.8"/></symbol>
            <symbol id="i-cal" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" fill="none" stroke-width="1.8"/><path d="M16 3v4M8 3v4M3 11h18" stroke="currentColor" fill="none" stroke-width="1.8"/></symbol>
            <symbol id="i-money" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" fill="none" stroke-width="1.8"/><path d="M7 12h.01M17 12h.01" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round"/></symbol>
            <symbol id="i-receipt" viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3zM9 8h6M9 12h6" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></symbol>
        </defs>
    </svg>

    <!-- Global Toast Notification -->
    <div id="app-toast" class="app-toast" role="status" aria-live="polite"></div>

    <div class="min-h-screen flex flex-col bg-[var(--color-bg-app)]">
        @yield('content')
    </div>
</body>
</html>
