<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DoctorMiddleware
{
    /**
     * Handle an incoming request for doctor portal.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check()) {
            return redirect()->route('login')->with('warning', 'Silakan masuk dengan akun Dokter terlebih dahulu.');
        }

        /** @var User $user */
        $user = Auth::user();

        if ($user->role !== 'doctor' && $user->role !== 'admin') {
            return redirect()->route('home')->with('warning', 'Akses terbatas hanya untuk Dokter & Tenaga Medis.');
        }

        return $next($request);
    }
}
