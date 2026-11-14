<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminController extends Controller
{
    /**
     * Informasi administrator.
     */
    private function getAdminUser(): array
    {
        $admin = Auth::user();

        return [
            'name' => $admin?->name ?? 'Admin Klinik',
            'email' => $admin?->email ?? 'admin@klinikmaristella.com',
            'role' => 'Administrator',
            'initials' => $admin
                ? strtoupper(
                    substr($admin->name, 0, 1) .
                    substr(trim(strstr($admin->name, ' ') ?: 'A'), 1, 1)
                )
                : 'AK',
            'is_logged_in' => true,
            'is_admin' => true,
        ];
    }

    /**
     * Filter berdasarkan waktu pembuatan.
     */
    private function applyTimeframe($query, string $timeframe)
    {
        if ($timeframe === 'week') {
            $query->whereBetween('created_at', [
                now()->copy()->startOfWeek(),
                now()->copy()->endOfWeek(),
            ]);
        } elseif ($timeframe === 'month') {
            $query->whereBetween('created_at', [
                now()->copy()->startOfMonth(),
                now()->copy()->endOfMonth(),
            ]);
        } elseif ($timeframe === 'year') {
            $query->whereBetween('created_at', [
                now()->copy()->startOfYear(),
                now()->copy()->endOfYear(),
            ]);
        }

        return $query;
    }

    /**
     * Filter berdasarkan waktu pembayaran.
     */
    private function applyPaidTimeframe($query, string $timeframe)
    {
        if ($timeframe === 'week') {
            $query->whereBetween('paid_at', [
                now()->copy()->startOfWeek(),
                now()->copy()->endOfWeek(),
            ]);
        } elseif ($timeframe === 'month') {
            $query->whereBetween('paid_at', [
                now()->copy()->startOfMonth(),
                now()->copy()->endOfMonth(),
            ]);
        } elseif ($timeframe === 'year') {
            $query->whereBetween('paid_at', [
                now()->copy()->startOfYear(),
                now()->copy()->endOfYear(),
            ]);
        }

        return $query;
    }

    /**
     * =====================================================
     * 1. DASHBOARD KEUANGAN
     * =====================================================
     */
    public function index(Request $request): View
    {
        $admin = Auth::user();
        $user = $this->getAdminUser();

        $timeframe = $request->get('timeframe', 'week');

        if (!in_array($timeframe, ['week', 'month', 'year', 'all'])) {
            $timeframe = 'week';
        }

        /*
        |--------------------------------------------------------------------------
        | Data Pembayaran
        |--------------------------------------------------------------------------
        */

        $paymentsQuery = Payment::with([
            'booking.patient',
            'booking.doctor.poli',
            'patient',
            'doctor',
        ]);

        $this->applyTimeframe($paymentsQuery, $timeframe);

        $payments = (clone $paymentsQuery)
            ->latest('created_at')
            ->latest('id')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Data Pasien
        |--------------------------------------------------------------------------
        */

        $patients = Patient::with([
            'bookings.doctor.poli',
            'bookings.medicalRecord',
            'payments',
        ])
            ->latest('id')
            ->get();

        $doctors = Doctor::with('poli')->get();

        /*
        |--------------------------------------------------------------------------
        | Booking yang Dapat Diproses Admin
        |--------------------------------------------------------------------------
        | Data diambil dari pendaftaran pasien yang sudah ada.
        | Tidak membuat Booking baru.
        */

        $bookingsForPayment = Booking::with([
            'patient',
            'doctor.poli',
            'payment',
        ])
            ->latest('booking_date')
            ->latest('id')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | KPI Keuangan
        |--------------------------------------------------------------------------
        */

        $totalTransactions = (clone $paymentsQuery)->count();

        $successfulPaymentsQuery = (clone $paymentsQuery)
            ->whereIn('status', ['confirmed', 'paid']);

        $successfulPaymentCount = (clone $successfulPaymentsQuery)
            ->count();

        $pendingPayments = (clone $paymentsQuery)
            ->where('status', 'pending')
            ->count();

        $verificationPayments = (clone $paymentsQuery)
            ->where('status', 'changed')
            ->count();

        $totalRevenue = (float) (clone $successfulPaymentsQuery)
            ->sum('net_amount');

        /*
        |--------------------------------------------------------------------------
        | Pertumbuhan Pendapatan
        |--------------------------------------------------------------------------
        */

        $currentPeriodStart = now()->copy()->subDays(6)->startOfDay();
        $previousPeriodStart = now()->copy()->subDays(13)->startOfDay();
        $previousPeriodEnd = now()->copy()->subDays(7)->endOfDay();

        $prevRevenue = (float) Payment::whereIn('status', [
            'confirmed',
            'paid',
        ])
            ->whereNotNull('paid_at')
            ->whereBetween('paid_at', [
                $previousPeriodStart,
                $previousPeriodEnd,
            ])
            ->sum('net_amount');

        $currentWeekRevenue = (float) Payment::whereIn('status', [
            'confirmed',
            'paid',
        ])
            ->whereNotNull('paid_at')
            ->whereBetween('paid_at', [
                $currentPeriodStart,
                now(),
            ])
            ->sum('net_amount');

        $revenueGrowth = $prevRevenue > 0
            ? round(
                (($currentWeekRevenue - $prevRevenue) / $prevRevenue) * 100,
                1
            )
            : ($currentWeekRevenue > 0 ? 100 : 0);

        $revenueGrowthPositive = $revenueGrowth >= 0;

        /*
        |--------------------------------------------------------------------------
        | Statistik Pasien
        |--------------------------------------------------------------------------
        */

        $totalVisitors = Patient::count();

        $currentVisitors = Patient::whereBetween('created_at', [
            $currentPeriodStart,
            now(),
        ])->count();

        $prevVisitors = Patient::whereBetween('created_at', [
            $previousPeriodStart,
            $previousPeriodEnd,
        ])->count();

        $visitorsGrowth = $prevVisitors > 0
            ? round(
                (($currentVisitors - $prevVisitors) / $prevVisitors) * 100,
                1
            )
            : ($currentVisitors > 0 ? 100 : 0);

        $visitorsGrowthPositive = $visitorsGrowth >= 0;

        /*
        |--------------------------------------------------------------------------
        | Statistik Pemeriksaan
        |--------------------------------------------------------------------------
        */

        $totalSurgeries = Booking::where('status', 'completed')->count();

        $currentSurgeries = Booking::where('status', 'completed')
            ->whereBetween('updated_at', [
                $currentPeriodStart,
                now(),
            ])
            ->count();

        $prevSurgeries = Booking::where('status', 'completed')
            ->whereBetween('updated_at', [
                $previousPeriodStart,
                $previousPeriodEnd,
            ])
            ->count();

        $surgeriesGrowth = $prevSurgeries > 0
            ? round(
                (($currentSurgeries - $prevSurgeries) / $prevSurgeries) * 100,
                1
            )
            : ($currentSurgeries > 0 ? 100 : 0);

        $surgeriesGrowthPositive = $surgeriesGrowth >= 0;

        /*
        |--------------------------------------------------------------------------
        | Statistik Booking Mingguan
        |--------------------------------------------------------------------------
        */

        $startOfWeek = now()->copy()->startOfWeek();

        $dailyStats = [];
        $maxChartVal = 1;

        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i);

            $dayCode = strtoupper($date->format('D'));
            $dateStr = $date->toDateString();

            $appointed = Booking::whereDate(
                'booking_date',
                $dateStr
            )->count();

            $medical = Booking::whereDate(
                'booking_date',
                $dateStr
            )
                ->where('status', 'completed')
                ->count();

            $maxChartVal = max(
                $maxChartVal,
                $appointed,
                $medical
            );

            $dailyStats[] = [
                'day' => $dayCode,
                'date' => $dateStr,
                'is_today' => $date->isToday(),
                'appointed' => $appointed,
                'medical' => $medical,
            ];
        }

        foreach ($dailyStats as &$stat) {
            $stat['appointed_pct'] = max(
                round(($stat['appointed'] / $maxChartVal) * 100),
                $stat['appointed'] > 0 ? 10 : 4
            );

            $stat['medical_pct'] = max(
                round(($stat['medical'] / $maxChartVal) * 100),
                $stat['medical'] > 0 ? 10 : 4
            );
        }

        unset($stat);

        /*
        |--------------------------------------------------------------------------
        | Mini Calendar
        |--------------------------------------------------------------------------
        */

        $calMonth = (int) $request->get('month', now()->month);
        $calYear = (int) $request->get('year', now()->year);

        if ($calMonth < 1 || $calMonth > 12) {
            $calMonth = now()->month;
        }

        if ($calYear < 1900 || $calYear > 2200) {
            $calYear = now()->year;
        }

        $calendarDate = Carbon::createFromDate(
            $calYear,
            $calMonth,
            1
        )->startOfMonth();

        $calendarMonthName = $calendarDate->format('F');
        $calendarYear = $calendarDate->year;

        $prevMonthDate = $calendarDate->copy()->subMonth();
        $nextMonthDate = $calendarDate->copy()->addMonth();

        $datesWithBookings = Booking::whereYear(
            'booking_date',
            $calendarDate->year
        )
            ->whereMonth('booking_date', $calendarDate->month)
            ->pluck('booking_date')
            ->map(fn ($date) => Carbon::parse($date)->toDateString())
            ->unique()
            ->toArray();

        $startOfMonth = $calendarDate->copy()->startOfMonth();
        $endOfMonth = $calendarDate->copy()->endOfMonth();

        $startDayOfWeek = $startOfMonth->dayOfWeekIso;
        $totalDaysInMonth = $endOfMonth->day;

        $prevMonthDays = [];
        $prevMonthEnd = $startOfMonth->copy()->subDay();

        for ($i = $startDayOfWeek - 1; $i > 0; $i--) {
            $prevMonthDays[] = [
                'day' => $prevMonthEnd->day - $i + 1,
                'is_current_month' => false,
                'is_today' => false,
                'has_booking' => false,
            ];
        }

        $currentMonthDays = [];

        for ($day = 1; $day <= $totalDaysInMonth; $day++) {
            $dateObject = $calendarDate->copy()->day($day);
            $dateString = $dateObject->toDateString();

            $currentMonthDays[] = [
                'day' => $day,
                'date' => $dateString,
                'is_current_month' => true,
                'is_today' => $dateObject->isToday(),
                'has_booking' => in_array(
                    $dateString,
                    $datesWithBookings
                ),
            ];
        }

        $totalCells = count($prevMonthDays) + count($currentMonthDays);

        $remainingCells = (
            (int) ceil($totalCells / 7) * 7
        ) - $totalCells;

        $nextMonthDays = [];

        for ($day = 1; $day <= $remainingCells; $day++) {
            $nextMonthDays[] = [
                'day' => $day,
                'is_current_month' => false,
                'is_today' => false,
                'has_booking' => false,
            ];
        }

        $calendarGrid = array_merge(
            $prevMonthDays,
            $currentMonthDays,
            $nextMonthDays
        );

        /*
        |--------------------------------------------------------------------------
        | Kirim Data ke Dashboard
        |--------------------------------------------------------------------------
        */

        return view('admin.dashboard', [
            'admin' => $admin,
            'user' => $user,
            'role' => 'admin',

            'timeframe' => $timeframe,

            'payments' => $payments,
            'patients' => $patients,
            'doctors' => $doctors,
            'bookingsForPayment' => $bookingsForPayment,

            'totalTransactions' => $totalTransactions,
            'successfulPaymentCount' => $successfulPaymentCount,
            'pendingPayments' => $pendingPayments,
            'verificationPayments' => $verificationPayments,
            'totalRevenue' => $totalRevenue,

            'revenueGrowth' => $revenueGrowth,
            'revenueGrowthPositive' => $revenueGrowthPositive,

            'totalVisitors' => $totalVisitors,
            'visitorsGrowth' => $visitorsGrowth,
            'visitorsGrowthPositive' => $visitorsGrowthPositive,

            'totalSurgeries' => $totalSurgeries,
            'surgeriesGrowth' => $surgeriesGrowth,
            'surgeriesGrowthPositive' => $surgeriesGrowthPositive,

            'dailyStats' => $dailyStats,
            'maxChartVal' => $maxChartVal,

            'calendarMonthName' => $calendarMonthName,
            'calendarYear' => $calendarYear,

            'prevMonth' => $prevMonthDate->month,
            'prevYear' => $prevMonthDate->year,

            'nextMonth' => $nextMonthDate->month,
            'nextYear' => $nextMonthDate->year,

            'calendarGrid' => $calendarGrid,
        ]);
    }

    /**
     * =====================================================
     * 2. TRANSAKSI
     * =====================================================
     */
    public function transactions(Request $request): View
    {
        $timeframe = $request->get('timeframe', 'all');

        if (!in_array($timeframe, ['week', 'month', 'year', 'all'])) {
            $timeframe = 'all';
        }

        $status = $request->get('status', 'all');

        if (!in_array($status, [
            'all',
            'confirmed',
            'paid',
            'pending',
            'changed',
            'canceled',
        ])) {
            $status = 'all';
        }

        $search = trim($request->get('search', ''));

        $paymentsQuery = Payment::with([
            'booking.patient',
            'booking.doctor.poli',
            'patient',
            'doctor',
        ]);

        $this->applyTimeframe($paymentsQuery, $timeframe);

        if ($status !== 'all') {
            $paymentsQuery->where('status', $status);
        }

        if ($search !== '') {
            $paymentsQuery->where(function ($query) use ($search) {
                $query->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('patient_name', 'like', "%{$search}%")
                    ->orWhere('doctor_name', 'like', "%{$search}%")
                    ->orWhere('service_type', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($patientQuery) use ($search) {
                        $patientQuery->where(
                            'full_name',
                            'like',
                            "%{$search}%"
                        );
                    })
                    ->orWhereHas('doctor', function ($doctorQuery) use ($search) {
                        $doctorQuery->where(
                            'nama_dokter',
                            'like',
                            "%{$search}%"
                        );
                    });
            });
        }

        $payments = $paymentsQuery
            ->latest('created_at')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        $summaryQuery = Payment::query();

        $this->applyTimeframe($summaryQuery, $timeframe);

        $totalTransactions = (clone $summaryQuery)->count();

        $successfulPaymentCount = (clone $summaryQuery)
            ->whereIn('status', ['confirmed', 'paid'])
            ->count();

        $pendingPayments = (clone $summaryQuery)
            ->where('status', 'pending')
            ->count();

        $verificationPayments = (clone $summaryQuery)
            ->where('status', 'changed')
            ->count();

        $totalRevenue = (float) (clone $summaryQuery)
            ->whereIn('status', ['confirmed', 'paid'])
            ->sum('net_amount');

        return view('admin.transactions', [
            'admin' => Auth::user(),
            'user' => $this->getAdminUser(),
            'role' => 'admin',

            'payments' => $payments,

            'timeframe' => $timeframe,
            'status' => $status,
            'search' => $search,

            'totalTransactions' => $totalTransactions,
            'successfulPaymentCount' => $successfulPaymentCount,
            'pendingPayments' => $pendingPayments,
            'verificationPayments' => $verificationPayments,
            'totalRevenue' => $totalRevenue,
        ]);
    }

    /**
     * =====================================================
     * 3. TAGIHAN PASIEN
     * =====================================================
     */
    public function invoices(Request $request): View
    {
        $status = $request->get('status', 'all');
        $search = trim($request->get('search', ''));

        $allowedStatuses = [
            'all',
            'confirmed',
            'paid',
            'pending',
            'changed',
            'canceled',
        ];

        if (!in_array($status, $allowedStatuses)) {
            $status = 'all';
        }

        $paymentsQuery = Payment::with([
            'booking.patient',
            'booking.doctor.poli',
            'patient',
            'doctor',
        ]);

        if ($status !== 'all') {
            $paymentsQuery->where('status', $status);
        }

        if ($search !== '') {
            $paymentsQuery->where(function ($query) use ($search) {
                $query->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('patient_name', 'like', "%{$search}%")
                    ->orWhere('doctor_name', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($patientQuery) use ($search) {
                        $patientQuery->where(
                            'full_name',
                            'like',
                            "%{$search}%"
                        );
                    });
            });
        }

        $payments = $paymentsQuery
            ->latest('created_at')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        $summaryQuery = Payment::query();

        $totalInvoices = (clone $summaryQuery)->count();

        $paidInvoices = (clone $summaryQuery)
            ->whereIn('status', ['confirmed', 'paid'])
            ->count();

        $unpaidInvoices = (clone $summaryQuery)
            ->where('status', 'pending')
            ->count();

        $verificationInvoices = (clone $summaryQuery)
            ->where('status', 'changed')
            ->count();

        $totalInvoiceAmount = (float) (clone $summaryQuery)
            ->sum('net_amount');

        return view('admin.invoices', [
            'admin' => Auth::user(),
            'user' => $this->getAdminUser(),
            'role' => 'admin',

            'payments' => $payments,
            'status' => $status,
            'search' => $search,

            'totalInvoices' => $totalInvoices,
            'paidInvoices' => $paidInvoices,
            'unpaidInvoices' => $unpaidInvoices,
            'verificationInvoices' => $verificationInvoices,
            'totalInvoiceAmount' => $totalInvoiceAmount,
        ]);
    }

    /**
     * =====================================================
     * 4. RIWAYAT PEMBAYARAN
     * =====================================================
     */
    public function paymentHistory(Request $request): View
    {
        $timeframe = $request->get('timeframe', 'all');

        if (!in_array($timeframe, ['week', 'month', 'year', 'all'])) {
            $timeframe = 'all';
        }

        $search = trim($request->get('search', ''));

        $paymentsQuery = Payment::with([
            'booking.patient',
            'booking.doctor.poli',
            'patient',
            'doctor',
        ])
            ->whereIn('status', ['confirmed', 'paid'])
            ->whereNotNull('paid_at');

        $this->applyPaidTimeframe($paymentsQuery, $timeframe);

        if ($search !== '') {
            $paymentsQuery->where(function ($query) use ($search) {
                $query->where('invoice_number', 'like', "%{$search}%")
                    ->orWhere('patient_name', 'like', "%{$search}%")
                    ->orWhere('doctor_name', 'like', "%{$search}%")
                    ->orWhere('service_type', 'like', "%{$search}%")
                    ->orWhereHas('patient', function ($patientQuery) use ($search) {
                        $patientQuery->where(
                            'full_name',
                            'like',
                            "%{$search}%"
                        );
                    })
                    ->orWhereHas('doctor', function ($doctorQuery) use ($search) {
                        $doctorQuery->where(
                            'nama_dokter',
                            'like',
                            "%{$search}%"
                        );
                    });
            });
        }

        $summaryQuery = Payment::query()
            ->whereIn('status', ['confirmed', 'paid'])
            ->whereNotNull('paid_at');

        $this->applyPaidTimeframe($summaryQuery, $timeframe);

        $totalPayments = (clone $summaryQuery)->count();

        $totalRevenue = (float) (clone $summaryQuery)
            ->sum('net_amount');

        $payments = $paymentsQuery
            ->latest('paid_at')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return view('admin.payment-history', [
            'admin' => Auth::user(),
            'user' => $this->getAdminUser(),
            'role' => 'admin',

            'payments' => $payments,
            'timeframe' => $timeframe,
            'search' => $search,

            'totalPayments' => $totalPayments,
            'totalRevenue' => $totalRevenue,
        ]);
    }

    /**
     * =====================================================
     * 5. REKAP PENDAPATAN
     * =====================================================
     */
    public function revenue(Request $request): View
    {
        $timeframe = $request->get('timeframe', 'month');

        if (!in_array($timeframe, ['week', 'month', 'year', 'all'])) {
            $timeframe = 'month';
        }

        $paymentsQuery = Payment::with([
            'patient',
            'doctor',
        ])
            ->whereIn('status', ['confirmed', 'paid'])
            ->whereNotNull('paid_at');

        $this->applyPaidTimeframe($paymentsQuery, $timeframe);

        $payments = $paymentsQuery
            ->latest('paid_at')
            ->latest('id')
            ->get();

        $totalRevenue = (float) $payments->sum('net_amount');

        $totalPayments = $payments->count();

        $averagePayment = $totalPayments > 0
            ? $totalRevenue / $totalPayments
            : 0;

        $dailyRevenue = $payments
            ->groupBy(function ($payment) {
                return Carbon::parse($payment->paid_at)->format('Y-m-d');
            })
            ->map(function ($items, $date) {
                return [
                    'date' => $date,
                    'total' => (float) $items->sum('net_amount'),
                    'transactions' => $items->count(),
                ];
            })
            ->sortKeys()
            ->values();

        return view('admin.revenue', [
            'admin' => Auth::user(),
            'user' => $this->getAdminUser(),
            'role' => 'admin',

            'timeframe' => $timeframe,
            'payments' => $payments,
            'dailyRevenue' => $dailyRevenue,

            'totalRevenue' => $totalRevenue,
            'totalPayments' => $totalPayments,
            'averagePayment' => $averagePayment,
        ]);
    }

    /**
     * =====================================================
     * 6. LAPORAN KEUANGAN
     * =====================================================
     */
    public function reports(Request $request): View
    {
        $timeframe = $request->get('timeframe', 'month');

        if (!in_array($timeframe, ['week', 'month', 'year', 'all'])) {
            $timeframe = 'month';
        }

        $paymentsQuery = Payment::with([
            'patient',
            'doctor',
        ]);

        $this->applyTimeframe($paymentsQuery, $timeframe);

        $payments = $paymentsQuery
            ->latest('created_at')
            ->latest('id')
            ->get();

        $totalTransactions = $payments->count();

        $successfulPayments = $payments->filter(
            fn ($payment) => in_array(
                $payment->status,
                ['confirmed', 'paid']
            )
        );

        $totalSuccessfulPayments = $successfulPayments->count();

        $totalRevenue = (float) $successfulPayments->sum('net_amount');

        $pendingPayments = $payments->where(
            'status',
            'pending'
        )->count();

        $verificationPayments = $payments->where(
            'status',
            'changed'
        )->count();

        $canceledPayments = $payments->where(
            'status',
            'canceled'
        )->count();

        $averagePayment = $totalSuccessfulPayments > 0
            ? $totalRevenue / $totalSuccessfulPayments
            : 0;

        $paymentMethods = $successfulPayments
            ->groupBy(
                fn ($payment) => $payment->payment_method ?: 'Lainnya'
            )
            ->map(function ($items, $method) {
                return [
                    'method' => $method,
                    'transactions' => $items->count(),
                    'total' => (float) $items->sum('net_amount'),
                ];
            })
            ->values();

        return view('admin.reports', [
            'admin' => Auth::user(),
            'user' => $this->getAdminUser(),
            'role' => 'admin',

            'timeframe' => $timeframe,
            'payments' => $payments,

            'totalTransactions' => $totalTransactions,
            'totalSuccessfulPayments' => $totalSuccessfulPayments,
            'pendingPayments' => $pendingPayments,
            'verificationPayments' => $verificationPayments,
            'canceledPayments' => $canceledPayments,

            'totalRevenue' => $totalRevenue,
            'averagePayment' => $averagePayment,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * =====================================================
     * 7. PROSES PEMBAYARAN DARI BOOKING YANG SUDAH ADA
     * =====================================================
     *
     * Admin hanya mengelola pembayaran.
     * Admin tidak membuat Patient, Booking, atau Queue.
     */
    public function storeTransaction(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'booking_id' => [
                'required',
                'integer',
                'exists:bookings,id',
            ],

            'payment_method' => [
                'required',
                'string',
                'max:100',
            ],

            'payment_status' => [
                'required',
                'in:paid,unpaid',
            ],

            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ], [
            'booking_id.required' => 'Silakan pilih kunjungan pasien.',
            'booking_id.exists' => 'Data kunjungan tidak ditemukan.',
            'payment_method.required' => 'Silakan pilih metode pembayaran.',
            'payment_status.required' => 'Silakan pilih status pembayaran.',
        ]);

        try {
            DB::transaction(function () use ($validated) {

                /*
                |--------------------------------------------------------------------------
                | Ambil Booking yang Sudah Ada
                |--------------------------------------------------------------------------
                | Lock mencegah dua proses membuat Payment untuk Booking
                | yang sama secara bersamaan.
                */

                $booking = Booking::with([
                    'patient',
                    'doctor.poli',
                ])
                    ->whereKey($validated['booking_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                /*
                |--------------------------------------------------------------------------
                | Validasi Nominal
                |--------------------------------------------------------------------------
                */

                $amount = (float) $booking->total_amount;

                if ($amount < 0) {
                    throw new \RuntimeException(
                        'Nominal kunjungan tidak valid.'
                    );
                }

                /*
                |--------------------------------------------------------------------------
                | Periksa Payment yang Sudah Terhubung
                |--------------------------------------------------------------------------
                */

                $existingPayments = Payment::where(
                    'booking_id',
                    $booking->id
                )
                    ->lockForUpdate()
                    ->get();

                if ($existingPayments->count() > 1) {
                    throw new \RuntimeException(
                        'Booking ini memiliki lebih dari satu Payment. Perlu pemeriksaan data terlebih dahulu.'
                    );
                }

                $isPaid = $validated['payment_status'] === 'paid';

                $paymentStatus = $isPaid
                    ? 'confirmed'
                    : 'pending';

                $paidAt = $isPaid
                    ? (
                        $existingPayments->first()?->paid_at
                        ?? now()
                    )
                    : null;

                /*
                |--------------------------------------------------------------------------
                | Data Dasar Payment
                |--------------------------------------------------------------------------
                */

                $paymentData = [
                    'booking_id' => $booking->id,
                    'patient_id' => $booking->patient_id,
                    'doctor_id' => $booking->doctor_id,

                    'patient_name' => $booking->patient?->full_name
                        ?? 'Pasien',

                    'doctor_name' => $booking->doctor?->nama_dokter
                        ?? 'Dokter',

                    'service_type' => $booking->doctor?->spesialisasi
                        ?? $booking->doctor?->poli?->nama_poli
                        ?? 'General Consultation',

                    'payment_method' => $validated['payment_method'],
                    'tariff_plan' => $booking->tariff_plan,

                    'status' => $paymentStatus,
                    'paid_at' => $paidAt,

                    'notes' => $validated['notes'] ?? null,
                ];

                /*
                |--------------------------------------------------------------------------
                | Jika Payment Sudah Ada
                |--------------------------------------------------------------------------
                | Perbarui data pembayaran yang sama.
                | Nominal, pajak, dan diskon lama tidak ditimpa.
                */

                if ($existingPayments->isNotEmpty()) {

                    $payment = $existingPayments->first();

                    $payment->update($paymentData);

                } else {

                    /*
                    |--------------------------------------------------------------------------
                    | Jika Payment Belum Ada
                    |--------------------------------------------------------------------------
                    | Buat Payment dari Booking yang sudah terdaftar.
                    | Tidak membuat Booking atau Queue baru.
                    */

                    $invoiceNumber = $booking->booking_code;

                    // Pastikan nomor invoice tidak bentrok dengan Payment lama.
                    $invoiceExists = Payment::where(
                        'invoice_number',
                        $invoiceNumber
                    )->exists();

                    if ($invoiceExists) {
                        $invoiceNumber = 'INV-' .
                            $booking->id . '-' .
                            now()->format('YmdHis');
                    }

                    Payment::create(array_merge(
                        $paymentData,
                        [
                            'invoice_number' => $invoiceNumber,

                            'amount' => $amount,
                            'tax_amount' => 0,
                            'discount_amount' => 0,
                            'net_amount' => $amount,
                        ]
                    ));
                }

                /*
                |--------------------------------------------------------------------------
                | Sinkronisasi Status Pembayaran Booking
                |--------------------------------------------------------------------------
                */

                $booking->update([
                    'payment_status' => $isPaid
                        ? 'paid'
                        : 'unpaid',
                ]);
            });

        } catch (\RuntimeException $exception) {

            return redirect()
                ->route('admin.dashboard')
                ->withInput()
                ->withErrors([
                    'booking_id' => $exception->getMessage(),
                ]);

        } catch (\Throwable $exception) {

            report($exception);

            return redirect()
                ->route('admin.dashboard')
                ->withInput()
                ->withErrors([
                    'booking_id' => 'Pembayaran gagal diproses. Silakan periksa kembali data kunjungan.',
                ]);
        }

        return redirect()
            ->route('admin.dashboard')
            ->with(
                'success',
                'Data pembayaran berhasil diproses.'
            );
    }

    /**
     * =====================================================
     * 8. KALENDER ADMIN
     * =====================================================
     */
    public function calendar(): View
    {
        $admin = Auth::user();

        return view('admin.calendar', [
            'admin' => $admin,
            'user' => $this->getAdminUser(),
            'role' => 'admin',
        ]);
    }

    /**
     * =====================================================
     * 9. EXPORT PEMBAYARAN KE CSV
     * =====================================================
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $fileName = 'riwayat_pembayaran_klinik_maristella_' .
            now()->format('Ymd_His') .
            '.csv';

        $timeframe = $request->get('timeframe', 'all');

        if (!in_array($timeframe, ['week', 'month', 'year', 'all'])) {
            $timeframe = 'all';
        }

        $paymentsQuery = Payment::with([
            'booking',
            'patient',
            'doctor',
        ]);

        $this->applyTimeframe($paymentsQuery, $timeframe);

        $payments = $paymentsQuery
            ->latest('created_at')
            ->latest('id')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($payments) {

            $handle = fopen('php://output', 'w');

            // BOM agar karakter CSV terbaca dengan baik di Excel.
            fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

            fputcsv($handle, [
                'No',
                'Invoice / ID Number',
                'Nama Pasien',
                'Layanan / Poli',
                'Dokter',
                'Metode Bayar',
                'Jumlah (Rp)',
                'Status',
                'Tanggal & Waktu',
            ]);

            $no = 1;

            foreach ($payments as $pay) {

                $statusLabel = match ($pay->status) {
                    'confirmed', 'paid' => 'Lunas',
                    'pending' => 'Belum Bayar',
                    'changed' => 'Perlu Verifikasi',
                    'canceled' => 'Dibatalkan',
                    default => 'Status Lainnya',
                };

                fputcsv($handle, [
                    $no++,

                    $pay->invoice_number,

                    $pay->patient_name
                        ?? ($pay->patient?->full_name ?? '-'),

                    $pay->service_type ?? '-',

                    $pay->doctor_name
                        ?? ($pay->doctor?->nama_dokter ?? '-'),

                    strtoupper($pay->payment_method ?? '-'),

                    number_format(
                        (float) $pay->net_amount,
                        0,
                        ',',
                        '.'
                    ),

                    $statusLabel,

                    $pay->created_at
                        ? $pay->created_at->format('Y-m-d H:i')
                        : '-',
                ]);
            }

            fclose($handle);

        }, 200, $headers);
    }
}
