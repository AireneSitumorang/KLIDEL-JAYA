<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $amount = fake()->randomElement([180.00, 250.00, 350.00, 435.00]);

        return [
            'booking_id' => Booking::factory(),
            'patient_id' => Patient::factory(),
            'doctor_id' => Doctor::factory(),
            'invoice_number' => '#BILL'.fake()->unique()->numerify('#####'),
            'patient_name' => fake()->name(),
            'doctor_name' => 'Dr. '.fake()->lastName(),
            'service_type' => fake()->randomElement(['Orthopedics', 'Dermatology', 'Neurology', 'Cardiology', 'General Consultation']),
            'payment_method' => fake()->randomElement(['cash', 'credit_card', 'bank_transfer', 'qris']),
            'tariff_plan' => fake()->randomElement(['with_medicine', 'consultation_only']),
            'amount' => $amount,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'net_amount' => $amount,
            'status' => 'paid',
            'notes' => 'Pembayaran tagihan klinik',
            'paid_at' => now(),
        ];
    }
}
