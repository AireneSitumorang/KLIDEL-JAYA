<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Schedule;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_code' => 'BK-'.fake()->unique()->numerify('########-###'),
            'patient_id' => Patient::factory(),
            'doctor_id' => Doctor::factory(),
            'schedule_id' => Schedule::factory(),
            'booking_date' => fake()->date(),
            'booking_time' => '09:00 AM',
            'booking_source' => 'online',
            'symptoms' => fake()->sentence(),
            'duration' => '1 - 3 Hari',
            'severity' => 'Sedang',
            'notes' => fake()->sentence(),
            'status' => 'confirmed',
            'tariff_plan' => 'with_medicine',
            'total_amount' => 435.00,
            'payment_status' => 'unpaid',
        ];
    }
}
