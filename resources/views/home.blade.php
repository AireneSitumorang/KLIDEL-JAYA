@extends('layouts.app')

@section('content')
<div class="relative w-full min-h-screen">

    <!-- ========================================== -->
    <!-- 1. DESKTOP LAYOUT (Screen width >= 1024px) -->
    <!-- ========================================== -->
    <div class="desktop-layout hidden lg:grid lg:grid-cols-[72px_1fr_340px] xl:grid-cols-[240px_1fr_360px] max-w-[1440px] w-full mx-auto min-h-screen">
        
        <!-- SIDEBAR -->
        <aside class="side bg-[var(--color-surface)] border-r border-[var(--color-border)] p-5 flex flex-col gap-1.5 sticky top-0 h-screen z-20">
            <!-- Logo (Klinik Maristella) -->
            <a href="{{ route('home') }}" class="logo flex items-center gap-2.5 mb-6 no-underline" title="Klinik Maristella">
                <img src="{{ asset('images/maristella-logo-horizontal.png') }}" alt="Klinik Maristella" class="h-9 w-auto object-contain hidden xl:block" style="max-height: 36px; max-width: 170px;" />
                <img src="{{ asset('images/maristella-icon.png') }}" alt="Klinik Maristella" class="h-9 w-auto object-contain block xl:hidden" style="max-height: 36px; max-width: 36px;" />
            </a>

            <!-- Navigation Items -->
            <nav class="flex flex-col gap-1 w-full" aria-label="Navigasi Utama">
                <!-- Beranda (Active) -->
                <button class="nav flex items-center gap-3 p-2.5 rounded-xl text-[var(--color-primary)] bg-[var(--color-primary-tint)] font-semibold relative text-left w-full transition-colors" aria-current="page">
                    <span class="hidden xl:block absolute -left-5 top-2.5 bottom-2.5 w-[3px] rounded-r bg-[var(--color-primary)]"></span>
                    <svg class="app-svg-icon text-[var(--color-primary)]"><use href="#icon-home"/></svg>
                    <span class="hidden xl:inline text-[14px]">Beranda</span>
                </button>

                <!-- Jadwal -->
                <a href="{{ route('calendar') }}" class="nav flex items-center gap-3 p-2.5 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-tint)]/60 text-left w-full transition-colors">
                    <svg class="app-svg-icon"><use href="#icon-cal"/></svg>
                    <span class="hidden xl:inline text-[14px]">Jadwal</span>
                </a>

                <!-- Rekam Medis -->
                <a href="{{ route('rekam-medis') }}" class="nav flex items-center gap-3 p-2.5 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-tint)]/60 text-left w-full transition-colors">
                    <svg class="app-svg-icon"><use href="#icon-doc"/></svg>
                    <span class="hidden xl:inline text-[14px]">Rekam Medis</span>
                </a>

                <!-- Pengaturan -->
                <button class="nav flex items-center gap-3 p-2.5 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-primary-tint)]/60 text-left w-full transition-colors" onclick="window.showToast('Membuka Pengaturan...')">
                    <svg class="app-svg-icon"><use href="#icon-set"/></svg>
                    <span class="hidden xl:inline text-[14px]">Pengaturan</span>
                </button>

                @auth
                    @if (auth()->user()->isAdmin())
                        <a href="{{ route('admin.dashboard') }}" class="nav flex items-center gap-3 p-2.5 rounded-xl text-purple-700 bg-purple-50 hover:bg-purple-100 text-left w-full transition-colors font-medium">
                            <svg class="app-svg-icon text-purple-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            <span class="hidden xl:inline text-[14px]">Portal Admin</span>
                        </a>
                    @endif
                    @if (auth()->user()->isDoctor())
                        <a href="{{ route('doctor.dashboard') }}" class="nav flex items-center gap-3 p-2.5 rounded-xl text-blue-800 bg-blue-50 hover:bg-blue-100 text-left w-full transition-colors font-medium">
                            <svg class="app-svg-icon text-[#012D68]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            <span class="hidden xl:inline text-[14px]">Portal Dokter</span>
                        </a>
                    @endif

                    <!-- Logout -->
                    <form action="{{ route('logout') }}" method="POST" class="w-full">
                        @csrf
                        <button type="submit" class="nav flex items-center gap-3 p-2.5 rounded-xl text-red-600 hover:bg-red-50 text-left w-full transition-colors font-medium">
                            <svg class="app-svg-icon text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            <span class="hidden xl:inline text-[14px]">Keluar</span>
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="nav flex items-center gap-3 p-2.5 rounded-xl text-[var(--color-primary)] bg-[var(--color-primary-tint)] hover:brightness-105 text-left w-full transition-colors font-semibold">
                        <svg class="app-svg-icon text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                        <span class="hidden xl:inline text-[14px]">Masuk / Login</span>
                    </a>
                @endauth
            </nav>
        </aside>

        <!-- MAIN CONTENT AREA -->
        <main class="main-content px-8 py-6 min-w-0 flex flex-col gap-6">
            
            <!-- Top Bar -->
            <header class="top-bar flex items-center gap-4">
                <!-- Search Input Pill -->
                <div class="search-box flex-1 max-w-[480px] flex items-center gap-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-4 h-11 text-[var(--color-text-muted)] focus-within:border-[var(--color-primary)] focus-within:shadow-[var(--focus-ring)] transition-all">
                    <svg class="app-svg-icon w-4 h-4 text-[var(--color-text-muted)]"><use href="#icon-search"/></svg>
                    <input id="search-input" type="search" placeholder="Cari dokter atau spesialisasi..." class="flex-1 bg-transparent border-none text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-[13.5px] outline-none h-full" aria-label="Cari dokter">
                </div>

                <div class="flex-1"></div>

                <!-- Theme Toggle Button -->
                <button id="theme-toggle" class="glass-btn !bg-[var(--color-surface)] !text-[var(--color-text)] !border-[var(--color-border)] hover:!border-[var(--color-primary)]" aria-label="Ubah tema gelap / terang" title="Ubah tema">
                    <svg class="app-svg-icon w-4 h-4"><use href="#icon-sun"/></svg>
                </button>

                <!-- Notification Bell -->
                <button class="glass-btn !bg-[var(--color-surface)] !text-[var(--color-text)] !border-[var(--color-border)] relative hover:!border-[var(--color-primary)]" aria-label="Notifikasi" onclick="window.showToast('Tidak ada notifikasi baru.')">
                    <svg class="app-svg-icon w-4 h-4"><use href="#icon-bell"/></svg>
                    <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500"></span>
                </button>

                <!-- User Profile / Auth Action -->
                @auth
                    <div class="user-pill flex items-center gap-2.5 pl-2">
                        <div class="avatar-initials w-11 h-11 text-[14px]">{{ $user['initials'] }}</div>
                        <div class="hidden xl:block leading-tight text-left">
                            <b class="block text-[13.5px] text-[var(--color-text)]">{{ $user['name'] }}</b>
                            <small class="block text-[11.5px] text-[var(--color-text-muted)]">{{ $user['role'] }}</small>
                        </div>
                    </div>
                @else
                    <a href="{{ route('login') }}" class="btn-primary !h-11 !px-5 !py-0 flex items-center gap-2 text-[13.5px] rounded-full font-semibold shadow-sm hover:opacity-95 transition-all">
                        <svg class="app-svg-icon w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                        <span>Masuk</span>
                    </a>
                @endauth
            </header>

            <!-- Greeting Banner with Integrated Next Appointment Card (Solid Klinik Maristella Navy) -->
            <section class="banner rounded-[24px] p-7 flex justify-between items-center gap-6 flex-wrap text-white shadow-sm">
                <div class="max-w-[340px]">
                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#001F4D] text-blue-100 border border-blue-700/60 text-xs font-semibold mb-2.5 shadow-xs">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Layanan Prioritas Klinik Maristella
                    </div>
                    <small class="text-white/80 text-[13px] block">Selamat siang,</small>
                    <h1 class="text-[30px] font-bold leading-[1.2] mt-1 text-white">What’s on your health today?</h1>
                </div>

                <!-- Next Appointment Card (Solid Pure White Surface) -->
                <div class="next-appt-card bg-white text-slate-900 rounded-[22px] p-4 w-[370px] max-w-full shadow-md border border-slate-100">
                    <div class="flex items-center justify-between mb-2.5">
                        <small class="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Next Appointment</small>
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            Upcoming
                        </span>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="w-[52px] h-[52px] rounded-[14px] bg-blue-50 overflow-hidden flex items-end justify-center flex-shrink-0 border border-blue-100">
                            <img src="{{ asset($nextAppointment['image']) }}" alt="{{ $nextAppointment['doctor_name'] }}" class="h-full w-auto object-contain object-bottom">
                        </div>
                        <div class="min-w-0">
                            <b class="block text-[14.5px] text-slate-900 truncate font-bold">{{ $nextAppointment['doctor_name'] }}</b>
                            <small class="block text-slate-500 text-[11.5px] mt-0.5 truncate">{{ $nextAppointment['specialty'] }}</small>
                            <small class="block text-[#012D68] font-semibold text-[11px] mt-0.5">{{ $nextAppointment['date_time'] }}</small>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2.5 mt-3.5">
                        <button class="btn-reschedule h-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-[12px] hover:bg-slate-100 transition-colors">Reschedule</button>
                        <button class="btn-join-call h-9 rounded-xl bg-[#012D68] hover:bg-[#023E8A] text-white font-bold text-[12px] flex items-center justify-center gap-1.5 transition-all shadow-xs">
                            <svg class="app-svg-icon w-3.5 h-3.5"><use href="#icon-vid"/></svg>
                            Join Call
                        </button>
                    </div>
                </div>
            </section>

            <!-- Category Specialty Chips with Dynamic Color Dots -->
            <div class="specialty-chips-wrapper flex flex-wrap gap-2.5 pt-1" role="group" aria-label="Kategori Spesialisasi">
                @foreach ($categories as $cat)
                    <button class="specialty-chip desktop-chip {{ $cat['id'] === 'all' ? 'active' : '' }}" data-cat="{{ $cat['id'] }}">
                        @if ($cat['id'] === 'Cardiologist')
                            <span class="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0"></span>
                        @elseif ($cat['id'] === 'Neurologist')
                            <span class="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                        @elseif ($cat['id'] === 'Orthopedist')
                            <span class="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0"></span>
                        @endif
                        {{ $cat['name'] }}
                    </button>
                @endforeach
            </div>

            <!-- Doctors Section Header -->
            <div class="section-header flex justify-between items-center mt-2">
                <h2 class="text-[20px] font-semibold text-[var(--color-text)]">Find a Doctor</h2>
                <a href="javascript:void(0)" onclick="window.showToast('Menampilkan seluruh dokter')" class="text-[var(--color-primary)] hover:underline text-[13px] font-medium">View All</a>
            </div>

            <!-- Doctor Grid with Dynamic Specialty Pastel Colors -->
            <div id="doctors-grid" class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 pb-8">
                @foreach ($doctors as $index => $doc)
                    @php
                        $cardBg = match($doc['category']) {
                            'Cardiologist' => 'bg-rose-50/90 border-b border-rose-100',
                            'Neurologist' => 'bg-indigo-50/90 border-b border-indigo-100',
                            default => 'bg-blue-50/90 border-b border-blue-100'
                        };
                        $slotClass = match($doc['category']) {
                            'Cardiologist' => 'bg-rose-100/90 text-rose-800',
                            'Neurologist' => 'bg-indigo-100/90 text-indigo-800',
                            default => 'bg-blue-100/90 text-[#012D68]'
                        };
                        $pulseClass = match($doc['category']) {
                            'Cardiologist' => 'bg-rose-600',
                            'Neurologist' => 'bg-indigo-600',
                            default => 'bg-[#012D68]'
                        };
                        $slotText = match($index) {
                            0 => '4 Slots Available',
                            1 => '6 Slots Available',
                            default => '5 Slots Available'
                        };
                    @endphp
                    <button class="doctor-card group {{ $index === 2 ? 'selected' : '' }}" 
                            data-id="{{ $doc['id'] }}"
                            data-name="{{ $doc['name'] }}"
                            data-specialty="{{ $doc['specialty'] }}"
                            data-category="{{ $doc['category'] }}"
                            data-rating="{{ $doc['rating'] }}"
                            data-price="{{ $doc['price'] }}"
                            data-initials="{{ $doc['initials'] }}"
                            data-image="{{ asset($doc['image']) }}"
                            data-availability="{{ $doc['availability'] }}"
                            data-experience="{{ $doc['experience'] }}"
                            data-patients="{{ $doc['patients'] }}">
                        
                        <!-- 3D Microscope Icon (Out-of-Bounds Pop-out at Top Right) -->
                        <div class="absolute -top-7 -right-2 w-16 h-16 sm:w-20 sm:h-20 z-30 pointer-events-none transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-6 drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)]">
                            <img src="{{ asset('images/3d/microscope.png') }}" alt="3D Microscope" class="w-full h-full object-contain">
                        </div>

                        <!-- 3D Stethoscope with Heart (Subtle Depth in Background) -->
                        <div class="absolute top-12 left-3 w-14 h-14 sm:w-16 sm:h-16 z-0 pointer-events-none opacity-20 -rotate-12 transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-105">
                            <img src="{{ asset('images/3d/stethoscope.png') }}" alt="3D Stethoscope" class="w-full h-full object-contain">
                        </div>

                        <!-- Top pastel block with dynamic specialty tone -->
                        <div class="relative w-full h-[180px] {{ $cardBg }} rounded-t-[22px] flex items-end justify-center overflow-visible">
                            <!-- Rating pill at top left -->
                            <div class="absolute top-3 left-3 z-30 inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-slate-100">
                                <svg class="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                <span class="text-xs font-bold text-slate-900 leading-none">{{ $doc['rating'] }}</span>
                            </div>

                            <!-- Doctor Cut-out Photo with Out-of-Bounds Pop-out Effect -->
                            <div class="relative w-full h-full flex items-end justify-center overflow-visible">
                                <img src="{{ asset($doc['image']) }}" 
                                     alt="{{ $doc['name'] }}" 
                                     class="relative z-20 h-[126%] w-auto max-w-none object-contain object-bottom -top-6 sm:-top-7 pointer-events-none transition-transform duration-300 ease-out group-hover:scale-108 group-hover:-translate-y-2 drop-shadow-[0_14px_18px_rgba(1,45,104,0.20)]">
                            </div>
                        </div>

                        <!-- Bottom content area (solid white background, rounded bottom) -->
                        <div class="relative z-20 p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white rounded-b-[22px] text-left">
                            <div>
                                <h3 class="text-lg font-bold text-slate-900 truncate leading-snug">{{ $doc['name'] }}</h3>
                                <p class="text-sm font-normal text-slate-500 truncate mt-0.5">{{ $doc['specialty'] }}</p>
                                <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold {{ $slotClass }} px-2.5 py-0.5 rounded-full mt-2">
                                    <span class="w-1.5 h-1.5 rounded-full {{ $pulseClass }} animate-pulse"></span>
                                    {{ $slotText }}
                                </span>
                            </div>
                            <div class="mt-3.5 flex items-baseline gap-1">
                                <span class="text-base font-extrabold text-[#012D68]">{{ $doc['price'] }}</span>
                                <span class="text-xs font-normal text-slate-400">/per session</span>
                            </div>
                        </div>
                    </button>
                @endforeach
            </div>

            <div id="doctors-empty" class="hidden text-center py-12 text-[var(--color-text-muted)]">
                Tidak ada dokter yang cocok dengan kriteria pencarian.
            </div>
        </main>

        <!-- RIGHT PANEL (Doctor Details & Booking) -->
        <aside class="panel bg-[var(--color-surface)] border-l border-[var(--color-border)] p-6 sticky top-0 h-screen overflow-y-auto flex flex-col z-20">
            <!-- Doctor Header -->
            <div class="flex items-center gap-3.5">
                <div class="w-[84px] h-[84px] rounded-[18px] bg-blue-50 overflow-hidden flex items-end justify-center flex-shrink-0 shadow-sm border border-blue-100">
                    <img id="pav-img" src="{{ asset($doctors[2]['image']) }}" alt="{{ $doctors[2]['name'] }}" class="h-full w-auto object-contain object-bottom">
                </div>
                <div class="min-w-0">
                    <h3 id="pn" class="text-[19px] font-bold text-[var(--color-text)] leading-tight truncate">{{ $doctors[2]['name'] }}</h3>
                    <small id="ps" class="text-[var(--color-text-secondary)] text-[12.5px] block mt-0.5">{{ $doctors[2]['specialty'] }}</small>
                    <div class="text-[12px] text-slate-600 mt-1 flex items-center gap-1 font-semibold">
                        <span class="text-amber-500">★</span> <span id="pr">{{ $doctors[2]['rating'] }}</span>
                    </div>
                </div>
            </div>

            <!-- Pricing & Stats Card (Solid Clean Surface, No Gradient) -->
            <div class="pricing-card mt-5 border border-slate-200/90 rounded-[22px] p-4 bg-slate-50 shadow-xs">
                <small class="text-slate-500 text-[11.5px] font-medium">Starting from</small>
                <b id="pp" class="block text-[24px] font-extrabold text-slate-900 my-0.5">
                    {{ $doctors[2]['price'] }} <span class="text-[11px] font-normal text-slate-400">/per session</span>
                </b>

                <!-- 3 Stat Tiles with Vibrant Solid Icons -->
                <div class="grid grid-cols-3 gap-2 mt-3.5">
                    <div class="stat-tile bg-white border border-slate-200/80 rounded-[14px] p-2.5 text-center shadow-xs">
                        <i class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center mx-auto mb-1">
                            <svg class="app-svg-icon w-3.5 h-3.5"><use href="#icon-clock"/></svg>
                        </i>
                        <small class="text-[9.5px] text-slate-400 font-medium block">Availability</small>
                        <b id="pav-avail" class="text-[11px] text-slate-900 font-bold block mt-0.5">{{ $doctors[2]['availability'] }}</b>
                    </div>
                    <div class="stat-tile bg-white border border-slate-200/80 rounded-[14px] p-2.5 text-center shadow-xs">
                        <i class="w-7 h-7 rounded-full bg-sky-100 text-sky-700 grid place-items-center mx-auto mb-1">
                            <svg class="app-svg-icon w-3.5 h-3.5"><use href="#icon-cal"/></svg>
                        </i>
                        <small class="text-[9.5px] text-slate-400 font-medium block">Experience</small>
                        <b id="pav-exp" class="text-[11px] text-slate-900 font-bold block mt-0.5">{{ $doctors[2]['experience'] }}</b>
                    </div>
                    <div class="stat-tile bg-white border border-slate-200/80 rounded-[14px] p-2.5 text-center shadow-xs">
                        <i class="w-7 h-7 rounded-full bg-amber-100 text-amber-700 grid place-items-center mx-auto mb-1">
                            <svg class="app-svg-icon w-3.5 h-3.5"><use href="#icon-user"/></svg>
                        </i>
                        <small class="text-[9.5px] text-slate-400 font-medium block">Patients</small>
                        <b id="pav-patients" class="text-[11px] text-slate-900 font-bold block mt-0.5">{{ $doctors[2]['patients'] }}</b>
                    </div>
                </div>
            </div>

            <!-- Date Picker -->
            <div class="font-bold text-[14.5px] mt-5 mb-2.5 text-slate-900">Select a date &amp; time</div>
            <div class="days-container grid grid-cols-7 gap-1.5">
                @php
                    $days = [
                        ['name' => 'Su', 'date' => '10'],
                        ['name' => 'Mo', 'date' => '11'],
                        ['name' => 'Tu', 'date' => '12'],
                        ['name' => 'We', 'date' => '13'],
                        ['name' => 'Th', 'date' => '14'],
                        ['name' => 'Fr', 'date' => '15'],
                        ['name' => 'Sa', 'date' => '16'],
                    ];
                @endphp
                @foreach ($days as $day)
                    <button class="day-pill {{ $day['date'] === '12' ? 'active' : '' }}" data-day="{{ $day['name'] }}" data-date="{{ $day['date'] }}">
                        <small>{{ $day['name'] }}</small>
                        <b>{{ $day['date'] }}</b>
                    </button>
                @endforeach
            </div>

            <!-- Time Slots -->
            <div class="slots-container grid grid-cols-3 gap-2 mt-3">
                @php
                    $slots = ['09 AM', '10 AM', '11 AM', '12 PM', '01 PM', '02 PM'];
                @endphp
                @foreach ($slots as $slot)
                    <button class="slot-pill {{ $slot === '01 PM' ? 'active' : '' }}" data-time="{{ $slot }}">
                        {{ $slot }}
                    </button>
                @endforeach
            </div>

            <!-- Sticky CTA Button (Solid White Container with Border) -->
            <div class="mt-auto pt-5 sticky bottom-0 bg-white border-t border-slate-100 pb-1">
                <button class="btn-book-session w-full h-12 rounded-[16px] bg-[#012D68] hover:bg-[#023E8A] active:bg-[#001F4D] text-white font-bold text-[14.5px] transition-all shadow-md">
                    Book a Session
                </button>
            </div>
        </aside>
    </div>


    <!-- ========================================== -->
    <!-- 2. MOBILE LAYOUT (Screen width < 1024px)   -->
    <!-- ========================================== -->
    <div class="mobile-layout block lg:hidden min-h-screen relative pb-28">

        <!-- Solid Dynamic Klinik Maristella Navy Header (No Gradient) -->
        <header class="bg-[#012D68] pt-12 px-5 pb-8 text-white">
            <div class="flex justify-between items-center">
                <!-- User Avatar -->
                <div class="avatar-initials w-10 h-10 border-2 border-white text-[14px]">
                    {{ $user['initials'] }}
                </div>

                <!-- Klinik Maristella Brand Logo -->
                <a href="{{ route('home') }}" class="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 no-underline shadow-sm" title="Klinik Maristella">
                    <img src="{{ asset('images/maristella-logo-white.png') }}" alt="Klinik Maristella" class="h-5 w-auto object-contain" style="max-height: 20px; max-width: 120px;" />
                </a>

                <!-- Right Glass Buttons -->
                <div class="flex items-center gap-2">
                    <button id="mobile-search-trigger" class="glass-btn" aria-label="Cari Dokter">
                        <svg class="app-svg-icon w-4 h-4"><use href="#icon-search"/></svg>
                    </button>
                    <button class="glass-btn" aria-label="Notifikasi" onclick="window.showToast('Tidak ada notifikasi baru.')">
                        <svg class="app-svg-icon w-4 h-4"><use href="#icon-bell"/></svg>
                    </button>
                </div>
            </div>

            <!-- Expandable Search Bar on Mobile -->
            <div id="mobile-search-bar" class="hidden mt-4">
                <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 h-10 border border-white/30 text-white">
                    <svg class="app-svg-icon w-4 h-4 text-white"><use href="#icon-search"/></svg>
                    <input id="mobile-search-input" type="search" placeholder="Cari dokter atau spesialis..." class="flex-1 bg-transparent border-none text-white placeholder-white/70 text-[13px] outline-none">
                </div>
            </div>

            <!-- Personal Greeting -->
            <div class="text-center mt-5">
                <span class="text-white/80 text-[13px]">Selamat siang,</span>
                <b class="block text-[21px] font-bold text-white mt-0.5">What’s on your health today?</b>
            </div>

            <!-- Next Appointment Label -->
            <div class="text-center text-blue-100 text-[11px] font-bold tracking-wider mt-4 mb-2 uppercase">
                Next Appointment
            </div>

            <!-- Stacked Appointment Card (Solid Pure White Surface) -->
            <div class="stacked-card mx-1 bg-white text-slate-900 rounded-[22px] p-4 shadow-md border border-slate-100">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-[14px] bg-blue-50 overflow-hidden flex items-end justify-center flex-shrink-0 border border-blue-100">
                        <img src="{{ asset($nextAppointment['image']) }}" alt="{{ $nextAppointment['doctor_name'] }}" class="h-full w-auto object-contain object-bottom">
                    </div>
                    <div class="min-w-0 flex-1">
                        <b class="text-[14px] text-slate-900 truncate block font-bold">{{ $nextAppointment['doctor_name'] }}</b>
                        <small class="text-slate-500 text-[11px] block mt-0.5">{{ $nextAppointment['specialty'] }}</small>
                        <small class="text-[#012D68] text-[11px] font-semibold block mt-0.5">{{ $nextAppointment['date_time'] }}</small>
                    </div>
                    <span class="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-700 flex-shrink-0">
                        <svg class="app-svg-icon w-3.5 h-3.5"><use href="#icon-up"/></svg>
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-3.5">
                    <button class="btn-reschedule h-8 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-[11.5px] hover:bg-slate-100 transition-colors">Reschedule</button>
                    <button class="btn-join-call h-8 rounded-xl bg-[#012D68] hover:bg-[#023E8A] text-white font-bold text-[11.5px] flex items-center justify-center gap-1 shadow-xs">
                        <svg class="app-svg-icon w-3 h-3"><use href="#icon-vid"/></svg>
                        Join Call
                    </button>
                </div>
            </div>
        </header>

        <!-- White Curved Sheet -->
        <section class="sheet bg-[var(--color-surface)] rounded-t-[28px] -mt-4 px-4 pt-5 pb-6 min-h-[500px]">
            <!-- Specialty Chips (Horizontal Scrollable with Dynamic Color Dots) -->
            <div class="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                @foreach ($categories as $cat)
                    <button class="specialty-chip mobile-chip flex-none text-[12px] h-[32px] px-3.5 {{ $cat['id'] === 'all' ? 'active' : '' }}" data-cat="{{ $cat['id'] }}">
                        @if ($cat['id'] === 'Cardiologist')
                            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0"></span>
                        @elseif ($cat['id'] === 'Neurologist')
                            <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                        @elseif ($cat['id'] === 'Orthopedist')
                            <span class="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                        @endif
                        {{ $cat['name'] }}
                    </button>
                @endforeach
            </div>

            <!-- Section Header -->
            <div class="flex justify-between items-center mt-4 mb-3 px-1">
                <b class="text-[15px] text-slate-900 font-bold">Find a Doctor</b>
                <a href="javascript:void(0)" onclick="window.showToast('Menampilkan seluruh dokter')" class="text-[12px] text-[#012D68] font-bold">View All</a>
            </div>

            <!-- Horizontal Doctor Cards (Scrollable with Dynamic Specialty Pastels) -->
            <div class="flex gap-4 overflow-x-auto overflow-y-visible no-scrollbar pt-6 pb-3 px-1">
                @foreach ($doctors as $index => $doc)
                    @php
                        $mCardBg = match($doc['category']) {
                            'Cardiologist' => 'bg-rose-50/90 border-b border-rose-100',
                            'Neurologist' => 'bg-indigo-50/90 border-b border-indigo-100',
                            default => 'bg-blue-50/90 border-b border-blue-100'
                        };
                    @endphp
                    <div class="doctor-card flex-none w-[155px] cursor-pointer group {{ $index === 2 ? 'selected' : '' }}"
                         data-id="{{ $doc['id'] }}"
                         data-name="{{ $doc['name'] }}"
                         data-specialty="{{ $doc['specialty'] }}"
                         data-category="{{ $doc['category'] }}"
                         data-rating="{{ $doc['rating'] }}"
                         data-price="{{ $doc['price'] }}"
                         data-initials="{{ $doc['initials'] }}"
                         data-image="{{ asset($doc['image']) }}"
                         data-availability="{{ $doc['availability'] }}"
                         data-experience="{{ $doc['experience'] }}"
                         data-patients="{{ $doc['patients'] }}">
                        
                        <!-- 3D Microscope Icon (Out-of-bounds top right) -->
                        <div class="absolute -top-5 -right-1.5 w-12 h-12 z-30 pointer-events-none drop-shadow-sm">
                            <img src="{{ asset('images/3d/microscope.png') }}" alt="3D Microscope" class="w-full h-full object-contain">
                        </div>

                        <!-- Top pastel block (rounded top, dynamic specialty pastel) -->
                        <div class="relative w-full h-[135px] {{ $mCardBg }} rounded-t-[22px] flex items-end justify-center overflow-visible">
                            <div class="absolute top-2 left-2 z-30 inline-flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-full shadow-xs border border-slate-100">
                                <svg class="w-3 h-3 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                                <span class="text-[10px] font-bold text-slate-900 leading-none">{{ $doc['rating'] }}</span>
                            </div>
                            <div class="relative w-full h-full flex items-end justify-center overflow-visible">
                                <img src="{{ asset($doc['image']) }}" alt="{{ $doc['name'] }}" class="relative z-20 h-[122%] w-auto max-w-none object-contain object-bottom -top-4 pointer-events-none drop-shadow-[0_8px_12px_rgba(1,45,104,0.18)]">
                            </div>
                        </div>

                        <!-- Bottom content area -->
                        <div class="relative z-20 p-3 bg-white rounded-b-[22px] text-left">
                            <b class="text-sm font-bold text-slate-900 block truncate">{{ $doc['name'] }}</b>
                            <small class="text-slate-500 font-normal text-xs block truncate mt-0.5">{{ $doc['specialty'] }}</small>
                            <div class="mt-2 flex items-baseline gap-1">
                                <span class="text-xs font-extrabold text-[#012D68]">{{ $doc['price'] }}</span>
                                <span class="text-[10px] font-normal text-slate-400">/per session</span>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </section>

        <!-- Floating Bottom Navigation -->
        <nav class="floating-bottom-nav" aria-label="Navigasi Bawah">
            <a href="{{ route('calendar') }}" aria-label="Jadwal" class="grid place-items-center w-11 h-11 rounded-full text-[var(--color-text-secondary)] hover:text-[#012D68] hover:bg-[#EFF6FF] transition-all">
                <svg class="app-svg-icon w-5 h-5"><use href="#icon-cal"/></svg>
            </a>
            <button class="active" aria-label="Beranda">
                <svg class="app-svg-icon w-5 h-5"><use href="#icon-home"/></svg>
            </button>
            <button aria-label="Pengaturan" onclick="window.showToast('Tab Pengaturan...')">
                <svg class="app-svg-icon w-5 h-5"><use href="#icon-set"/></svg>
            </button>
        </nav>

        <!-- Mobile Doctor Detail & Booking Bottom Sheet Modal -->
        <div id="mobile-sheet-backdrop" class="mobile-sheet-backdrop"></div>
        <div id="mobile-detail-sheet" class="mobile-sheet">
            <!-- Drag Handle & Close -->
            <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-1 bg-[var(--color-border)] rounded-full mx-auto"></div>
                <button id="mobile-sheet-close" class="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)]" aria-label="Tutup Detail">
                    <svg class="app-svg-icon w-5 h-5"><use href="#icon-close"/></svg>
                </button>
            </div>

            <!-- Doctor Profile -->
            <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-[14px] bg-blue-50 overflow-hidden flex items-end justify-center flex-shrink-0 shadow-sm border border-blue-100">
                    <img id="m-pav-img" src="{{ asset($doctors[2]['image']) }}" alt="{{ $doctors[2]['name'] }}" class="h-full w-auto object-contain object-bottom">
                </div>
                <div class="min-w-0">
                    <span class="rating-pill text-[11px] mb-1 inline-flex">★ <span id="m-pr">{{ $doctors[2]['rating'] }}</span></span>
                    <h3 id="m-pn" class="text-[17px] font-bold text-slate-900 leading-tight truncate">{{ $doctors[2]['name'] }}</h3>
                    <small id="m-ps" class="text-slate-500 text-[12px] block">{{ $doctors[2]['specialty'] }}</small>
                </div>
            </div>

            <!-- Price & Stat Tiles (Solid Clean Surface, No Gradient) -->
            <div class="pricing-card mt-4 border border-slate-200/90 rounded-[20px] p-3.5 bg-slate-50 shadow-xs">
                <small class="text-slate-500 text-[11px] font-medium">Starting from</small>
                <b id="m-pp" class="block text-[22px] font-extrabold text-slate-900 my-0.5">
                    {{ $doctors[2]['price'] }} <span class="text-[10px] font-normal text-slate-400">/per session</span>
                </b>

                <div class="grid grid-cols-3 gap-1.5 mt-2.5">
                    <div class="stat-tile bg-white border border-slate-200/80 rounded-[12px] p-2 text-center shadow-xs">
                        <i class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center mx-auto mb-1">
                            <svg class="app-svg-icon w-3 h-3"><use href="#icon-clock"/></svg>
                        </i>
                        <small class="text-[8.5px] text-slate-400 font-medium block">Availability</small>
                        <b id="m-pav-avail" class="text-[10.5px] text-slate-900 font-bold block mt-0.5">{{ $doctors[2]['availability'] }}</b>
                    </div>
                    <div class="stat-tile bg-white border border-slate-200/80 rounded-[12px] p-2 text-center shadow-xs">
                        <i class="w-6 h-6 rounded-full bg-sky-100 text-sky-700 grid place-items-center mx-auto mb-1">
                            <svg class="app-svg-icon w-3 h-3"><use href="#icon-cal"/></svg>
                        </i>
                        <small class="text-[8.5px] text-slate-400 font-medium block">Experience</small>
                        <b id="m-pav-exp" class="text-[10.5px] text-slate-900 font-bold block mt-0.5">{{ $doctors[2]['experience'] }}</b>
                    </div>
                    <div class="stat-tile bg-white border border-slate-200/80 rounded-[12px] p-2 text-center shadow-xs">
                        <i class="w-6 h-6 rounded-full bg-amber-100 text-amber-700 grid place-items-center mx-auto mb-1">
                            <svg class="app-svg-icon w-3 h-3"><use href="#icon-user"/></svg>
                        </i>
                        <small class="text-[8.5px] text-slate-400 font-medium block">Patients</small>
                        <b id="m-pav-patients" class="text-[10.5px] text-slate-900 font-bold block mt-0.5">{{ $doctors[2]['patients'] }}</b>
                    </div>
                </div>
            </div>

            <!-- Date Selection -->
            <div class="font-semibold text-[13.5px] mt-4 mb-2 text-[var(--color-text)]">Select a date &amp; time</div>
            <div class="days-container grid grid-cols-7 gap-1">
                @foreach ($days as $day)
                    <button class="day-pill text-[10px] py-1 {{ $day['date'] === '12' ? 'active' : '' }}" data-day="{{ $day['name'] }}" data-date="{{ $day['date'] }}">
                        <small class="text-[8.5px]">{{ $day['name'] }}</small>
                        <b class="text-[13px]">{{ $day['date'] }}</b>
                    </button>
                @endforeach
            </div>

            <!-- Time Slots Selection -->
            <div class="slots-container grid grid-cols-3 gap-1.5 mt-2.5">
                @foreach ($slots as $slot)
                    <button class="slot-pill h-8 text-[11px] {{ $slot === '01 PM' ? 'active' : '' }}" data-time="{{ $slot }}">
                        {{ $slot }}
                    </button>
                @endforeach
            </div>

            <!-- CTA Button -->
            <button class="btn-book-session w-full h-11 rounded-[14px] bg-[var(--color-primary)] text-white font-semibold text-[14px] mt-5 shadow-md">
                Book a Session
            </button>
        </div>
    </div>

    <!-- ========================================== -->
    <!-- 3. BOOKING REGISTRATION MODAL              -->
    <!-- ========================================== -->
    <div id="booking-modal-backdrop" class="modal-backdrop fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-200 flex items-center justify-center p-4">
        <div id="booking-modal" class="modal-dialog bg-white dark:bg-[#101E35] w-full max-w-lg rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden transform scale-95 transition-all duration-200" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            
            <!-- Modal Header -->
            <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#101E35] sticky top-0 z-10">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#012D68] dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    </div>
                    <div>
                        <h3 id="modal-title" class="text-[17px] font-bold text-slate-900 dark:text-white leading-tight">Pendaftaran Sesi Konsultasi</h3>
                        <p class="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Lengkapi keluhan dan detail kesehatan Anda sebelum sesi dimulai</p>
                    </div>
                </div>
                <button type="button" id="btn-close-modal" class="w-8 h-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 flex items-center justify-center transition-colors" aria-label="Tutup formulir">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>

            <!-- Modal Body (Scrollable) -->
            <div class="p-6 overflow-y-auto space-y-5 text-slate-800 dark:text-slate-200">
                
                <!-- Doctor & Schedule Summary Pill -->
                <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="w-12 h-12 rounded-xl bg-blue-100/70 overflow-hidden flex items-end justify-center flex-shrink-0 border border-blue-200">
                            <img id="modal-doc-img" src="{{ asset('images/doctors/doctor-2.png') }}" alt="Dokter" class="w-full h-full object-cover object-bottom">
                            <span id="modal-doc-initials" class="hidden font-bold text-blue-900 text-sm">AK</span>
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-1.5">
                                <b id="modal-doc-name" class="text-[14px] text-slate-900 dark:text-white font-bold truncate">Dr. Anaya Kapoor</b>
                                <span class="inline-flex items-center gap-0.5 text-[11px] font-semibold text-amber-600">
                                    ★ <span id="modal-doc-rating">4.8</span>
                                </span>
                            </div>
                            <span id="modal-doc-specialty" class="text-[12px] text-slate-500 dark:text-slate-400 block truncate">Neurologist</span>
                            <div class="flex items-center gap-2 mt-1 text-[11.5px] font-medium text-[#012D68] dark:text-blue-300">
                                <span class="inline-flex items-center gap-1">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                    <span id="modal-doc-schedule">Tu 12 · 01 PM</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0">
                        <small class="text-[11px] text-slate-400 block">Tarif Sesi</small>
                        <b id="modal-doc-price" class="text-[15px] font-bold text-[#012D68] dark:text-blue-400">$18.0</b>
                    </div>
                </div>

                <!-- Form Inputs -->
                <form id="booking-intake-form" onsubmit="return false;" class="space-y-4">
                    
                    <!-- Patient Name & Phone -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label for="reg-patient-name" class="block text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Nama Pasien <span class="text-rose-500">*</span>
                            </label>
                            <input type="text" id="reg-patient-name" value="{{ $user['name'] }}" required placeholder="Nama lengkap pasien" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[13px] focus:border-[#012D68] focus:ring-2 focus:ring-blue-100 outline-none transition-all">
                        </div>
                        <div>
                            <label for="reg-patient-phone" class="block text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                No. WhatsApp / HP <span class="text-rose-500">*</span>
                            </label>
                            <input type="tel" id="reg-patient-phone" value="0812-9988-7766" required placeholder="Contoh: 081234567890" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[13px] focus:border-[#012D68] focus:ring-2 focus:ring-blue-100 outline-none transition-all">
                        </div>
                    </div>

                    <!-- Symptoms / Gejala (Wajib) -->
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <label for="reg-symptoms" class="text-[12.5px] font-semibold text-slate-700 dark:text-slate-300">
                                Gejala / Keluhan Utama <span class="text-rose-500">*</span>
                            </label>
                            <span class="text-[11px] text-slate-400">Pilih cepat atau ketik manual</span>
                        </div>

                        <!-- Quick Symptom Tags -->
                        <div class="flex flex-wrap gap-1.5 mb-2" id="quick-symptoms-chips">
                            <button type="button" class="symptom-chip text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#012D68] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 transition-colors" data-symptom="Sakit kepala berdenyut">+ Sakit Kepala</button>
                            <button type="button" class="symptom-chip text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#012D68] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 transition-colors" data-symptom="Demam tinggi">+ Demam</button>
                            <button type="button" class="symptom-chip text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#012D68] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 transition-colors" data-symptom="Pusing & mual">+ Pusing / Vertigo</button>
                            <button type="button" class="symptom-chip text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#012D68] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 transition-colors" data-symptom="Nyeri persendian & kaku">+ Nyeri Sendi</button>
                            <button type="button" class="symptom-chip text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#012D68] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 transition-colors" data-symptom="Sesak napas ringan">+ Sesak Napas</button>
                            <button type="button" class="symptom-chip text-[11px] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#012D68] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 transition-colors" data-symptom="Nyeri dada sebelah kiri">+ Nyeri Dada</button>
                        </div>

                        <textarea id="reg-symptoms" rows="3" required placeholder="Jelaskan secara spesifik keluhan atau rasa sakit yang Anda alami..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[13px] focus:border-[#012D68] focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"></textarea>
                        <p id="symptoms-error" class="hidden text-rose-500 text-[11.5px] mt-1 font-medium">Mohon tuliskan gejala atau keluhan yang dirasakan.</p>
                    </div>

                    <!-- Duration (Sudah Berapa Lama) (Wajib) -->
                    <div>
                        <label class="block text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Sudah Berapa Lama Dirasakan? <span class="text-rose-500">*</span>
                        </label>
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2" id="duration-selector">
                            <button type="button" class="duration-pill py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-[12px] font-medium text-slate-700 dark:text-slate-300 hover:border-[#012D68] transition-all" data-duration="< 24 Jam">
                                &lt; 24 Jam
                                <small class="block text-[10px] text-slate-400 font-normal">Baru muncul</small>
                            </button>
                            <button type="button" class="duration-pill active py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-[12px] font-medium text-slate-700 dark:text-slate-300 hover:border-[#012D68] transition-all" data-duration="1 - 3 Hari">
                                1 - 3 Hari
                                <small class="block text-[10px] text-slate-400 font-normal">Beberapa hari</small>
                            </button>
                            <button type="button" class="duration-pill py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-[12px] font-medium text-slate-700 dark:text-slate-300 hover:border-[#012D68] transition-all" data-duration="1 - 2 Minggu">
                                1 - 2 Minggu
                                <small class="block text-[10px] text-slate-400 font-normal">Subakut</small>
                            </button>
                            <button type="button" class="duration-pill py-2 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-[12px] font-medium text-slate-700 dark:text-slate-300 hover:border-[#012D68] transition-all" data-duration="> 1 Bulan">
                                &gt; 1 Bulan
                                <small class="block text-[10px] text-slate-400 font-normal">Kronis / Menahun</small>
                            </button>
                        </div>
                        <input type="hidden" id="reg-duration" value="1 - 3 Hari">
                    </div>

                    <!-- Severity Level -->
                    <div>
                        <label class="block text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            Tingkat Keparahan / Skala Gangguan
                        </label>
                        <div class="grid grid-cols-3 gap-2" id="severity-selector">
                            <button type="button" class="severity-pill py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-[12px] font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-all" data-severity="Ringan">
                                <span class="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Ringan
                                <small class="block text-[10px] text-slate-400 font-normal">Bisa beraktivitas</small>
                            </button>
                            <button type="button" class="severity-pill active py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-[12px] font-medium text-slate-700 dark:text-slate-300 hover:border-amber-500 transition-all" data-severity="Sedang">
                                <span class="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1"></span> Sedang
                                <small class="block text-[10px] text-slate-400 font-normal">Terganggu</small>
                            </button>
                            <button type="button" class="severity-pill py-2 px-2 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-[12px] font-medium text-slate-700 dark:text-slate-300 hover:border-rose-500 transition-all" data-severity="Berat">
                                <span class="inline-block w-2 h-2 rounded-full bg-rose-500 mr-1"></span> Berat
                                <small class="block text-[10px] text-slate-400 font-normal">Butuh segera</small>
                            </button>
                        </div>
                        <input type="hidden" id="reg-severity" value="Sedang">
                    </div>

                    <!-- Additional Notes / Allergies (Optional) -->
                    <div>
                        <label for="reg-notes" class="block text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Riwayat Alergi / Catatan Tambahan <span class="text-slate-400 text-[11px] font-normal">(Opsional)</span>
                        </label>
                        <input type="text" id="reg-notes" placeholder="Contoh: Alergi obat penisilin, riwayat asam lambung..." class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[13px] focus:border-[#012D68] focus:ring-2 focus:ring-blue-100 outline-none transition-all">
                    </div>
                </form>

            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 sticky bottom-0">
                <button type="button" id="btn-cancel-booking" class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-[13px] transition-colors">
                    Batal
                </button>
                <button type="button" id="btn-confirm-booking" class="px-6 py-2.5 rounded-xl bg-[#012D68] hover:bg-[#023E8A] active:bg-[#001F4D] text-white font-bold text-[13.5px] transition-all shadow-md flex items-center gap-2">
                    <span>Konfirmasi Pemesanan</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
            </div>
        </div>
    </div>
</div>
@endsection
