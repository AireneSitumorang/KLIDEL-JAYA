<?php

namespace Database\Factories;

use App\Models\Poli;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Poli>
 */
class PoliFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement(['Kardiologi', 'Neurologi', 'Ortopedi', 'Pediatri', 'Dermatologi']);
        $slug = match ($name) {
            'Kardiologi' => 'Cardiologist',
            'Neurologi' => 'Neurologist',
            'Ortopedi' => 'Orthopedist',
            default => strtolower($name),
        };

        return [
            'slug' => $slug,
            'nama_poli' => $name,
            'name_en' => fake()->word(),
            'deskripsi' => fake()->sentence(),
        ];
    }
}
