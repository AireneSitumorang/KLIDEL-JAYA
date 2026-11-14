<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;

class ApotekerController extends Controller
{
    /**
     * Display Apoteker Dashboard.
     * Menampilkan resep dari booking yang sudah dibayar.
     */
    public function index(): View
    {
        $authUser = Auth::user();

        // Ambil booking yang sudah dibayar dan memiliki rekam medis.
        $orders = Booking::with([
            'patient',
            'doctor',
            'medicalRecord',
        ])
            ->where('payment_status', 'paid')
            ->whereHas('medicalRecord')
            ->latest('id')
            ->get();

        // Hitung jumlah seluruh item obat dalam resep.
        $totalObat = $orders->sum(function ($booking) {
            $medications = $booking->medicalRecord?->plan['medications'] ?? [];

            return is_array($medications)
                ? count($medications)
                : 0;
        });

        return view('apoteker.dashboard', [
            'apoteker' => [
                'name' => $authUser?->name ?? 'Apoteker',
                'email' => $authUser?->email ?? '-',
                'role' => 'Apoteker',
            ],

            'orders' => $orders,

            'stats' => [
                'total_orders' => $orders->count(),
                'total_obat' => $totalObat,
            ],
        ]);
    }
}
