<?php

namespace App\Models;

use Database\Factories\PoliFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['slug', 'nama_poli', 'name_en', 'deskripsi'])]
class Poli extends Model
{
    /** @use HasFactory<PoliFactory> */
    use HasFactory;

    /**
     * Doctors working in this specialty clinic.
     *
     * @return HasMany<Doctor, $this>
     */
    public function doctors(): HasMany
    {
        return $this->hasMany(Doctor::class);
    }
}
