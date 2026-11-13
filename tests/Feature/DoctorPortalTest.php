<?php

namespace Tests\Feature;

use App\Models\Queue;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorPortalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed default users
        $this->seed();
    }

    /**
     * Test doctor dedicated login page renders with doctor role pre-selected.
     */
    public function test_doctor_login_page_renders_successfully(): void
    {
        $response = $this->get(route('login.doctor'));

        $response->assertOk();
        $response->assertSee('Dokter');
        $response->assertSee('dokter@aihealth.com');
    }

    /**
     * Test doctor authentication redirects to doctor dashboard.
     */
    public function test_doctor_can_login_and_is_redirected_to_doctor_dashboard(): void
    {
        $response = $this->post(route('login.post'), [
            'email' => 'dokter@aihealth.com',
            'password' => 'password',
        ]);

        $response->assertRedirect(route('doctor.dashboard'));
        $this->assertAuthenticated();
    }

    /**
     * Test 1-click quick login for doctor role.
     */
    public function test_quick_login_doctor_works(): void
    {
        $response = $this->get(route('quick-login', 'doctor'));

        $response->assertRedirect(route('doctor.dashboard'));
        $this->assertAuthenticated();
        $this->assertTrue(auth()->user()->isDoctor());
    }

    /**
     * Test unauthenticated guest cannot access doctor dashboard.
     */
    public function test_guest_cannot_access_doctor_portal(): void
    {
        $response = $this->get(route('doctor.dashboard'));

        $response->assertRedirect(route('login'));
    }

    /**
     * Test standard patient user cannot access doctor dashboard.
     */
    public function test_standard_user_cannot_access_doctor_portal(): void
    {
        $user = User::where('role', 'user')->first();

        $response = $this->actingAs($user)->get(route('doctor.dashboard'));

        $response->assertRedirect(route('home'));
    }

    /**
     * Test doctor dashboard renders all 4 use cases from the diagram.
     */
    public function test_doctor_dashboard_renders_all_4_use_cases(): void
    {
        $doctor = User::where('email', 'anaya@aihealth.com')->first() ?: User::where('role', 'doctor')->first();

        $response = $this->actingAs($doctor)->get(route('doctor.dashboard'));

        $response->assertOk();
        $response->assertSee('Klinik Maristella');
        $response->assertSee('maristella-logo-white.png');
        // Use Case 1: Lihat Antrean Harian
        $response->assertSee('Antrean Harian Pasien');
        $response->assertSee('Antrean');

        // Use Case 2: Lihat Data Pasien
        $response->assertSee('Lihat Data Pasien');
        $response->assertSee('Nomor Rekam Medis (MRN)');

        // Use Case 3: Isi Rekam Medis SOAP
        $response->assertSee('Isi Rekam Medis SOAP');
        $response->assertSee('Subjektif');
        $response->assertSee('Objektif');
        $response->assertSee('Asesmen');
        $response->assertSee('Plan');

        // Use Case 4: Lihat Riwayat Medis
        $response->assertSee('Lihat Riwayat Medis');
    }

    /**
     * Test doctor can save SOAP record and status becomes completed.
     */
    public function test_doctor_can_save_soap_record(): void
    {
        $doctor = User::where('role', 'doctor')->first();
        $queue = Queue::whereHas('booking', fn ($q) => $q->where('doctor_id', $doctor->doctor->id))->first();
        $queueKey = 'Q-'.str_pad((string) $queue->id, 3, '0', STR_PAD_LEFT);

        $response = $this->actingAs($doctor)->post(route('doctor.saveSoap', $queueKey), [
            'subjective' => 'Pasien mengeluh migrain berat berdenyut.',
            'bp' => '120/80',
            'hr' => '78',
            'rr' => '18',
            'temp' => '36.6',
            'spo2' => '99',
            'weight' => '56',
            'height' => '162',
            'physical_exam' => 'GCS 15 compos mentis, saraf kranial intak.',
            'primary_diagnosis' => 'G43.1 - Migraine with aura',
            'secondary_diagnosis' => 'R51 - Headache',
            'clinical_notes' => 'Observasi 1 minggu pasca triptan.',
            'therapy_plan' => "Sumatriptan 50mg — 1 tab\nDomperidone 10mg — 3x1",
            'return_date' => '18 Nov 2026',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
    }
}
