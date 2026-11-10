<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DoctorController extends Controller
{
    /**
     * Get baseline mock queues & patients for the doctor portal.
     * Stored in session for interactive demo state preservation.
     *
     * @return array<string, mixed>
     */
    private function getDailyQueues(): array
    {
        $defaultQueues = [
            'Q-001' => [
                'id' => 'Q-001',
                'queue_no' => 'A-01',
                'time_slot' => '09:00 AM',
                'status' => 'in_progress', // in_progress, waiting, completed
                'patient' => [
                    'id' => 'P-101',
                    'mrn' => '#GM-0214',
                    'nik' => '3171045206920003',
                    'name' => 'Rina Anggraini',
                    'initials' => 'RA',
                    'age' => '34 tahun',
                    'dob' => '12 Juni 1992',
                    'gender' => 'Perempuan',
                    'blood_type' => 'B+',
                    'phone' => '+62 812-5550-1920',
                    'address' => 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
                    'allergies' => ['Penisilin', 'Asam Mefenamat'],
                    'past_illnesses' => ['Migraine with aura (2024)', 'Gastritis fungsional (2025)'],
                    'regular_meds' => ['Vitamin B Kompleks 1x1'],
                ],
                'complaint' => [
                    'symptoms' => 'Sakit kepala berdenyut sebelah kiri, pandangan berkunang-kunang, dan mual hebat.',
                    'duration' => '1 - 3 Hari',
                    'severity' => 'Berat',
                    'notes' => 'Keluhan memburuk jika terpapar cahaya terang dan bising.',
                ],
                'soap' => [
                    'subjective' => 'Pasien mengeluh nyeri kepala berdenyut unilateral di hemikranium sinistra sejak 2 hari lalu. Disertai fotofobia, fonofobia, dan mual tanpa muntah.',
                    'objective' => [
                        'bp' => '120/80',
                        'hr' => '82',
                        'rr' => '18',
                        'temp' => '36.8',
                        'spo2' => '99',
                        'weight' => '56',
                        'height' => '162',
                        'physical_exam' => 'GCS E4M6V5, compos mentis. Pupil isokor 3mm/3mm, refleks cahaya (+/+). Rangsang meningeal (-). Saraf kranialis dalam batas normal. Motorik 5/5 di keempat ekstremitas.',
                    ],
                    'assessment' => [
                        'primary_diagnosis' => 'G43.1 - Migraine with aura',
                        'secondary_diagnosis' => 'R51 - Headache, unspecified',
                        'clinical_notes' => 'Gejala khas migrain klasik berulang dengan pemicu stres dan kurang tidur.',
                    ],
                    'plan' => [
                        'medications' => [
                            ['name' => 'Sumatriptan 50mg', 'dose' => '1 tablet', 'frequency' => 'Saat serangan nyeri timbul', 'notes' => 'Maks. 200mg/24 jam'],
                            ['name' => 'Domperidone 10mg', 'dose' => '1 tablet', 'frequency' => '3x1 sebelum makan', 'notes' => 'Bila mual'],
                            ['name' => 'Paracetamol 500mg', 'dose' => '1 tablet', 'frequency' => '3x1 prn', 'notes' => 'Jika nyeri ringan'],
                        ],
                        'clinical_action' => 'Edukasi identifikasi trigger makanan (keju, kafein berlebih) dan istirahat teratur.',
                        'return_date' => '18 Nov 2026',
                    ],
                ],
                'history' => [
                    [
                        'date' => '14 Agu 2026',
                        'doctor' => 'Dr. Saran Mitchell (Orthopedist)',
                        'diagnosis' => 'M25.5 - Nyeri sendi lutut dextra (Mild strain)',
                        'therapy' => 'Natrium Diklofenak 50mg 2x1, Kompres hangat',
                    ],
                    [
                        'date' => '22 Jan 2026',
                        'doctor' => 'Dr. Anaya Kapoor, Sp.S',
                        'diagnosis' => 'G43.0 - Migraine without aura',
                        'therapy' => 'Ibuprofen 400mg 3x1 pc, Istirahat tirah baring',
                    ],
                ],
            ],
            'Q-002' => [
                'id' => 'Q-002',
                'queue_no' => 'A-02',
                'time_slot' => '10:00 AM',
                'status' => 'waiting',
                'patient' => [
                    'id' => 'P-102',
                    'mrn' => '#GM-0188',
                    'nik' => '3172081504880001',
                    'name' => 'Bambang Sudiro',
                    'initials' => 'BS',
                    'age' => '48 tahun',
                    'dob' => '15 April 1978',
                    'gender' => 'Laki-laki',
                    'blood_type' => 'O+',
                    'phone' => '+62 813-8821-4433',
                    'address' => 'Jl. Tebet Timur Raya No. 18, Jakarta Selatan',
                    'allergies' => ['Tidak ada alergi obat yang diketahui'],
                    'past_illnesses' => ['Hipertensi esensial (sejak 2022)'],
                    'regular_meds' => ['Amlodipine 10mg 1x1 malam'],
                ],
                'complaint' => [
                    'symptoms' => 'Pusing berputar (vertigo) mendadak terutama saat menoleh atau bangun dari tempat tidur.',
                    'duration' => '< 24 Jam',
                    'severity' => 'Sedang',
                    'notes' => 'Telinga berdenging ringan di sebelah kanan.',
                ],
                'soap' => [
                    'subjective' => '',
                    'objective' => [
                        'bp' => '135/85',
                        'hr' => '76',
                        'rr' => '16',
                        'temp' => '36.5',
                        'spo2' => '98',
                        'weight' => '72',
                        'height' => '170',
                        'physical_exam' => 'Tes Dix-Hallpike (+), nistagmus rotatoar ke arah telinga kanan.',
                    ],
                    'assessment' => [
                        'primary_diagnosis' => 'H81.1 - Benign paroxysmal vertigo (BPPV)',
                        'secondary_diagnosis' => 'I10 - Essential hypertension',
                        'clinical_notes' => '',
                    ],
                    'plan' => [
                        'medications' => [
                            ['name' => 'Betahistine Mesilate 12mg', 'dose' => '1 tablet', 'frequency' => '3x1 sesudah makan', 'notes' => 'Selama 5 hari'],
                        ],
                        'clinical_action' => 'Manuver Epley di ruang periksa, hindari perubahan posisi kepala mendadak.',
                        'return_date' => '11 Nov 2026',
                    ],
                ],
                'history' => [
                    [
                        'date' => '05 Mei 2026',
                        'doctor' => 'Dr. Lina Wijaya, Sp.JP',
                        'diagnosis' => 'I10 - Evaluasi Hipertensi Terkontrol',
                        'therapy' => 'Lanjutkan Amlodipine 10mg 1x1 malam, diet rendah garam',
                    ],
                ],
            ],
            'Q-003' => [
                'id' => 'Q-003',
                'queue_no' => 'A-03',
                'time_slot' => '11:00 AM',
                'status' => 'waiting',
                'patient' => [
                    'id' => 'P-103',
                    'mrn' => '#GM-0305',
                    'nik' => '3173094812990002',
                    'name' => 'Dewi Safitri',
                    'initials' => 'DS',
                    'age' => '27 tahun',
                    'dob' => '08 Desember 1999',
                    'gender' => 'Perempuan',
                    'blood_type' => 'A+',
                    'phone' => '+62 856-9122-3344',
                    'address' => 'Jl. Cikini Raya No. 12, Menteng, Jakarta Pusat',
                    'allergies' => ['Sulfa'],
                    'past_illnesses' => ['Tension Headache (2025)'],
                    'regular_meds' => [],
                ],
                'complaint' => [
                    'symptoms' => 'Kesemutan dan kebas di jari jempol, telunjuk, dan jari tengah tangan kanan sejak 2 minggu.',
                    'duration' => '1 - 2 Minggu',
                    'severity' => 'Sedang',
                    'notes' => 'Pekerjaan admin kantor banyak mengetik seharian.',
                ],
                'soap' => null,
                'history' => [],
            ],
            'Q-004' => [
                'id' => 'Q-004',
                'queue_no' => 'A-04',
                'time_slot' => '01:00 PM',
                'status' => 'completed',
                'patient' => [
                    'id' => 'P-104',
                    'mrn' => '#GM-0102',
                    'nik' => '3174061208650004',
                    'name' => 'Hendro Prasetyo',
                    'initials' => 'HP',
                    'age' => '61 tahun',
                    'dob' => '12 Agustus 1965',
                    'gender' => 'Laki-laki',
                    'blood_type' => 'AB+',
                    'phone' => '+62 811-2233-4455',
                    'address' => 'Jl. Bangka IX No. 5, Mampang Prapatan, Jakarta Selatan',
                    'allergies' => ['Tidak ada'],
                    'past_illnesses' => ['Diabetes Mellitus Tipe 2', 'Neuropati Diabetik'],
                    'regular_meds' => ['Metformin 500mg 2x1', 'Mecobalamin 500mcg 3x1'],
                ],
                'complaint' => [
                    'symptoms' => 'Kontrol rutin rasa kebas dan seperti terbakar di telapak kaki.',
                    'duration' => '> 1 Bulan',
                    'severity' => 'Ringan',
                    'notes' => 'Gula darah puasa pagi ini: 118 mg/dL.',
                ],
                'soap' => [
                    'subjective' => 'Pasien kontrol rutin neuropati diabetik perifer. Keluhan baal dan kesemutan berkurang dengan Mecobalamin.',
                    'objective' => [
                        'bp' => '128/78',
                        'hr' => '74',
                        'rr' => '18',
                        'temp' => '36.6',
                        'spo2' => '98',
                        'weight' => '68',
                        'height' => '168',
                        'physical_exam' => 'Sensasi pinprick sedikit berkurang di stocking distribution kaki bilateral. Refleks patella (+/+), achilles (+/+).',
                    ],
                    'assessment' => [
                        'primary_diagnosis' => 'E11.4 - Type 2 diabetes with diabetic polyneuropathy',
                        'secondary_diagnosis' => 'G62.9 - Polyneuropathy, unspecified',
                        'clinical_notes' => 'Glikemia terkontrol baik, keluhan neuropati berangsur stabil.',
                    ],
                    'plan' => [
                        'medications' => [
                            ['name' => 'Mecobalamin 500mcg', 'dose' => '1 kapsul', 'frequency' => '3x1 sesudah makan', 'notes' => 'Untuk 30 hari'],
                            ['name' => 'Metformin 500mg', 'dose' => '1 tablet', 'frequency' => '2x1 bersama makan', 'notes' => 'Rutin'],
                        ],
                        'clinical_action' => 'Perawatan kaki diabetik mandiri, hindari luka atau gesekan alas kaki sempit.',
                        'return_date' => '04 Des 2026',
                    ],
                ],
                'history' => [
                    [
                        'date' => '02 Okt 2026',
                        'doctor' => 'Dr. Anaya Kapoor, Sp.S',
                        'diagnosis' => 'E11.4 - Diabetic Neuropathy Follow Up',
                        'therapy' => 'Mecobalamin 500mcg 3x1, Gabapentin 100mg 1x1 malam',
                    ],
                ],
            ],
        ];

        return session()->get('doctor_queues', $defaultQueues);
    }

    /**
     * Display the Doctor Portal Dashboard (4 Use Cases).
     */
    public function index(Request $request): View
    {
        /** @var User $authUser */
        $authUser = Auth::user();

        $doctor = [
            'name' => $authUser?->name ?? 'Dr. Anaya Kapoor, Sp.S',
            'specialty' => 'Spesialis Saraf (Neurologist)',
            'hospital' => 'Klinik Utama Gabe Medica',
            'initials' => 'AK',
            'email' => $authUser?->email ?? 'dokter@aihealth.com',
            'role' => 'Dokter Spesialis',
            'image' => 'images/doctors/doctor-2.png',
            'is_doctor' => true,
        ];

        $queues = $this->getDailyQueues();

        // Selected active queue for examination
        $activeQueueId = $request->get('queue_id', array_key_first($queues));
        if (! isset($queues[$activeQueueId])) {
            $activeQueueId = array_key_first($queues);
        }

        $activeQueue = $queues[$activeQueueId];

        // Summary Statistics
        $totalPatients = count($queues);
        $waitingCount = count(array_filter($queues, fn ($q) => $q['status'] === 'waiting'));
        $inProgressCount = count(array_filter($queues, fn ($q) => $q['status'] === 'in_progress'));
        $completedCount = count(array_filter($queues, fn ($q) => $q['status'] === 'completed'));

        return view('doctor.dashboard', [
            'doctor' => $doctor,
            'queues' => $queues,
            'activeQueue' => $activeQueue,
            'activeQueueId' => $activeQueueId,
            'stats' => [
                'total' => $totalPatients,
                'waiting' => $waitingCount,
                'in_progress' => $inProgressCount,
                'completed' => $completedCount,
            ],
        ]);
    }

    /**
     * Save SOAP Medical Record & Complete Examination (Use Case 3: Isi Rekam Medis SOAP).
     */
    public function saveSoap(Request $request, string $queueId): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'subjective' => ['required', 'string'],
            'bp' => ['nullable', 'string'],
            'hr' => ['nullable', 'string'],
            'rr' => ['nullable', 'string'],
            'temp' => ['nullable', 'string'],
            'spo2' => ['nullable', 'string'],
            'weight' => ['nullable', 'string'],
            'height' => ['nullable', 'string'],
            'physical_exam' => ['nullable', 'string'],
            'primary_diagnosis' => ['required', 'string'],
            'secondary_diagnosis' => ['nullable', 'string'],
            'clinical_notes' => ['nullable', 'string'],
            'therapy_plan' => ['nullable', 'string'],
            'return_date' => ['nullable', 'string'],
        ]);

        $queues = $this->getDailyQueues();

        if (! isset($queues[$queueId])) {
            return back()->with('error', 'Data antrean tidak ditemukan.');
        }

        // Parse medication lines into structured array if present
        $meds = [];
        if (! empty($validated['therapy_plan'])) {
            $lines = explode("\n", trim($validated['therapy_plan']));
            foreach ($lines as $line) {
                if (trim($line)) {
                    $meds[] = [
                        'name' => trim($line),
                        'dose' => 'Sesuai resep',
                        'frequency' => 'Rutin',
                        'notes' => '',
                    ];
                }
            }
        }

        $queues[$queueId]['status'] = 'completed';
        $queues[$queueId]['soap'] = [
            'subjective' => $validated['subjective'],
            'objective' => [
                'bp' => $validated['bp'] ?? '120/80',
                'hr' => $validated['hr'] ?? '80',
                'rr' => $validated['rr'] ?? '18',
                'temp' => $validated['temp'] ?? '36.5',
                'spo2' => $validated['spo2'] ?? '99',
                'weight' => $validated['weight'] ?? '',
                'height' => $validated['height'] ?? '',
                'physical_exam' => $validated['physical_exam'] ?? 'Dalam batas normal.',
            ],
            'assessment' => [
                'primary_diagnosis' => $validated['primary_diagnosis'],
                'secondary_diagnosis' => $validated['secondary_diagnosis'] ?? '',
                'clinical_notes' => $validated['clinical_notes'] ?? '',
            ],
            'plan' => [
                'medications' => ! empty($meds) ? $meds : [
                    ['name' => $validated['primary_diagnosis'].' Therapy Regimen', 'dose' => '1 unit', 'frequency' => 'Rutin', 'notes' => ''],
                ],
                'clinical_action' => 'Pemeriksaan selesai dicatat oleh dokter.',
                'return_date' => $validated['return_date'] ?? '14 hari ke depan',
            ],
        ];

        // Also append to patient medical history so it immediately appears in "Lihat Riwayat Medis"
        $newHistory = [
            'date' => now()->format('d M Y'),
            'doctor' => Auth::user()?->name ?? 'Dr. Anaya Kapoor, Sp.S',
            'diagnosis' => $validated['primary_diagnosis'],
            'therapy' => ! empty($validated['therapy_plan']) ? substr($validated['therapy_plan'], 0, 80) : 'Terapi simtomatik & edukasi',
        ];

        array_unshift($queues[$queueId]['history'], $newHistory);

        session()->put('doctor_queues', $queues);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Rekam Medis SOAP berhasil disimpan untuk pasien '.$queues[$queueId]['patient']['name'],
                'queue' => $queues[$queueId],
            ]);
        }

        return redirect()->route('doctor.dashboard', ['queue_id' => $queueId])
            ->with('success', 'Rekam Medis SOAP untuk '.$queues[$queueId]['patient']['name'].' berhasil disimpan dan status antrean diselesaikan.');
    }
}
