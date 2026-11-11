<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Auto-heal orphaned Vite hot file if Vite dev server is offline
        $hotFile = public_path('hot');
        if (file_exists($hotFile) && file_exists(public_path('build/manifest.json'))) {
            $hotUrl = trim((string) @file_get_contents($hotFile));
            $port = (int) (parse_url($hotUrl, PHP_URL_PORT) ?: 5173);
            $fp = @fsockopen('127.0.0.1', $port, $errno, $errstr, 0.05);
            if (! $fp) {
                @unlink($hotFile);
            } else {
                fclose($fp);
            }
        }
    }
}
