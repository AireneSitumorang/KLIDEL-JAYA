<?php

namespace Database\Factories;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'mrn' => '#GM-'.fake()->unique()->numerify('####'),
            'nik' => fake()->unique()->numerify('317104520692####'),
            'full_name' => fake()->name(),
            'dob' => fake()->date('Y-m-d', '2005-01-01'),
            'gender' => fake()->randomElement(['Laki-laki', 'Perempuan']),
            'blood_type' => fake()->randomElement(['A+', 'B+', 'AB+', 'O+']),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'allergies' => ['Tidak ada'],
            'past_illnesses' => [],
            'regular_meds' => [],
        ];
    }
}
