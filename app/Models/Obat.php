<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Obat extends Model
{
    protected $fillable = [
        'kode_obat',
        'nama_obat',
        'kategori',
        'satuan',
        'harga',
        'stok',
        'deskripsi',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'harga' => 'decimal:2',
            'stok' => 'integer',
            'is_active' => 'boolean',
        ];
    }
}
