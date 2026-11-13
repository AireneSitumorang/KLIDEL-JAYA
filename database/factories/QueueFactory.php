<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Queue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Queue>
 */
class QueueFactory extends Factory
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
            'queue_number' => 'A-'.fake()->numerify('##'),
            'queue_date' => fake()->date(),
            'time_slot' => '09:00 AM',
            'status' => 'waiting',
        ];
    }
}
