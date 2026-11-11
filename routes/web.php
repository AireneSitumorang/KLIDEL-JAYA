<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Authentication Routes
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
Route::get('/login/dokter', [AuthController::class, 'showDoctorLoginForm'])->name('login.doctor');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/quick-login/{role}', [AuthController::class, 'quickLogin'])->name('quick-login');

// Patient / User Dashboard, Calendar & Medical Records
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/appointment-status', [HomeController::class, 'getAppointmentStatus'])->name('appointment.status');
Route::post('/booking', [HomeController::class, 'storeBooking'])->name('booking.store');
Route::post('/payment', [HomeController::class, 'processPayment'])->name('payment.process');
Route::get('/calendar', [HomeController::class, 'calendar'])->name('calendar');
Route::get('/rekam-medis', [HomeController::class, 'medicalRecords'])->name('rekam-medis');

// Doctor Routes (Protected by DoctorMiddleware)
Route::middleware(['doctor'])->prefix('doctor')->name('doctor.')->group(function () {
    Route::get('/', [DoctorController::class, 'index'])->name('dashboard');
    Route::post('/soap/{queueId}', [DoctorController::class, 'saveSoap'])->name('saveSoap');
});

// Admin Routes (Protected by AdminMiddleware)
Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('dashboard');
    Route::get('/calendar', [AdminController::class, 'calendar'])->name('calendar');
    Route::get('/export-csv', [AdminController::class, 'exportCsv'])->name('exportCsv');
    Route::post('/transaction', [AdminController::class, 'storeTransaction'])->name('storeTransaction');
});
