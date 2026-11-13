<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\MedicalRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MedicalRecord>
 */
class MedicalRecordFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_id' => Booking::factory(),
            'subjective' => fake()->paragraph(),
            'objective' => [
                'bp' => '120/80',
                'hr' => '80',
                'rr' => '18',
                'temp' => '36.5',
                'spo2' => '99',
            ],
            'assessmen' => [
                'primary_diagnosis' => fake()->sentence(),
            ],
            'plan' => [
                'clinical_action' => fake()->sentence(),
            ],
        ];
    }
}
