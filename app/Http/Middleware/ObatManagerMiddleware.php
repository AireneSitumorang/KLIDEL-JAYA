<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ObatManagerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Pastikan pengguna sudah login.
        if (! Auth::check()) {
            return redirect()
                ->route('login')
                ->with('warning', 'Silakan masuk terlebih dahulu.');
        }

        $role = Auth::user()->role;

        // Apoteker memiliki akses penuh pengelolaan obat.
        if ($role === 'apoteker') {
            return $next($request);
        }

        // Admin hanya boleh melihat daftar obat.
        if ($role === 'admin') {
            if ($request->routeIs('obat.index')) {
                return $next($request);
            }

            abort(403, 'Admin hanya memiliki akses melihat data obat.');
        }

        // Role lainnya tidak memiliki akses.
        return redirect()
            ->route('home')
            ->with('warning', 'Anda tidak memiliki akses ke halaman obat.');
    }
}
