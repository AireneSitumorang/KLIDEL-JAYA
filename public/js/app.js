// Klinik Maristella Application Core JS

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const searchInput = document.getElementById('search-input');
  const mobileSearchInput = document.getElementById('mobile-search-input');
  const desktopChips = document.querySelectorAll('.desktop-chip');
  const mobileChips = document.querySelectorAll('.mobile-chip');
  const doctorCards = document.querySelectorAll('.doctor-card');
  const toastEl = document.getElementById('app-toast');

  // Booking panel elements (Desktop & Mobile)
  const pavEl = document.getElementById('pav');
  const pnEl = document.getElementById('pn');
  const psEl = document.getElementById('ps');
  const prEl = document.getElementById('pr');
  const ppEl = document.getElementById('pp');
  const pavAvailEl = document.getElementById('pav-avail');
  const pavExpEl = document.getElementById('pav-exp');
  const pavPatientsEl = document.getElementById('pav-patients');

  // Mobile Bottom Sheet
  const mobileSheet = document.getElementById('mobile-detail-sheet');
  const mobileSheetBackdrop = document.getElementById('mobile-sheet-backdrop');
  const mobileSheetClose = document.getElementById('mobile-sheet-close');
  const mpavEl = document.getElementById('m-pav');
  const mpnEl = document.getElementById('m-pn');
  const mpsEl = document.getElementById('m-ps');
  const mprEl = document.getElementById('m-pr');
  const mppEl = document.getElementById('m-pp');
  const mpavAvailEl = document.getElementById('m-pav-avail');
  const mpavExpEl = document.getElementById('m-pav-exp');
  const mpavPatientsEl = document.getElementById('m-pav-patients');

  // State
  let currentCategory = 'all';
  let searchQuery = '';
  let selectedDate = '12';
  let selectedDayName = 'Tu';
  let selectedTime = '01 PM';
  let currentDoctor = null;

  // Initial Selected Doctor from currently selected card
  const selectedCard = document.querySelector('.doctor-card.selected') || document.querySelector('.doctor-card');
  if (selectedCard) {
    currentDoctor = extractDoctorData(selectedCard);
  }

  function extractDoctorData(card) {
    return {
      id: card.dataset.id,
      name: card.dataset.name,
      specialty: card.dataset.specialty,
      category: card.dataset.category,
      rating: card.dataset.rating,
      price: card.dataset.price,
      initials: card.dataset.initials,
      image: card.dataset.image,
      availability: card.dataset.availability || '9AM - 8PM',
      experience: card.dataset.experience || '10 years',
      patients: card.dataset.patients || '3.5k Up',
    };
  }

  // Toast Helper
  let toastTimer = null;
  function showToast(message, iconSvg = '') {
    if (!toastEl) return;
    toastEl.innerHTML = iconSvg ? `<span class="toast-icon">${iconSvg}</span> <span>${message}</span>` : `<span>${message}</span>`;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }
  window.showToast = showToast;

  // Filter Doctors
  function filterDoctors() {
    let visibleCount = 0;
    doctorCards.forEach(card => {
      const matchCat = currentCategory === 'all' || card.dataset.category === currentCategory;
      const haystack = (card.dataset.name + ' ' + card.dataset.specialty).toLowerCase();
      const matchSearch = !searchQuery || haystack.includes(searchQuery);

      if (matchCat && matchSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle empty state message
    const emptyState = document.getElementById('doctors-empty');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Category Chip Click Handling
  function setupChips(chips, isMobile = false) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.dataset.cat;
        currentCategory = cat;

        // Sync both desktop and mobile chips
        desktopChips.forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
        mobileChips.forEach(c => c.classList.toggle('active', c.dataset.cat === cat));

        filterDoctors();
      });
    });
  }
  setupChips(desktopChips, false);
  setupChips(mobileChips, true);

  // Search Input Handling
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (mobileSearchInput) mobileSearchInput.value = e.target.value;
      filterDoctors();
    });
  }
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (searchInput) searchInput.value = e.target.value;
      filterDoctors();
    });
  }

  // Update Detail Panel (Desktop)
  function updateDesktopPanel(doc) {
    if (!doc) return;
    const pavImg = document.getElementById('pav-img');
    if (pavImg && doc.image) {
      pavImg.src = doc.image;
      pavImg.alt = doc.name;
    }
    if (pavEl) pavEl.textContent = doc.initials;
    if (pnEl) pnEl.textContent = doc.name;
    if (psEl) psEl.textContent = doc.specialty;
    if (prEl) prEl.textContent = doc.rating;
    if (ppEl) ppEl.innerHTML = `${doc.price} <span style="font-size:11px;font-weight:400;color:var(--color-text-muted)">/per session</span>`;
    if (pavAvailEl) pavAvailEl.textContent = doc.availability;
    if (pavExpEl) pavExpEl.textContent = doc.experience;
    if (pavPatientsEl) pavPatientsEl.textContent = doc.patients;
  }

  // Update Detail Sheet (Mobile)
  function updateMobileSheet(doc) {
    if (!doc) return;
    const mpavImg = document.getElementById('m-pav-img');
    if (mpavImg && doc.image) {
      mpavImg.src = doc.image;
      mpavImg.alt = doc.name;
    }
    if (mpavEl) mpavEl.textContent = doc.initials;
    if (mpnEl) mpnEl.textContent = doc.name;
    if (mpsEl) mpsEl.textContent = doc.specialty;
    if (mprEl) mprEl.textContent = doc.rating;
    if (mppEl) mppEl.innerHTML = `${doc.price} <span style="font-size:11px;font-weight:400;color:var(--color-text-muted)">/per session</span>`;
    if (mpavAvailEl) mpavAvailEl.textContent = doc.availability;
    if (mpavExpEl) mpavExpEl.textContent = doc.experience;
    if (mpavPatientsEl) mpavPatientsEl.textContent = doc.patients;
  }

  function openMobileSheet() {
    if (mobileSheet && mobileSheetBackdrop) {
      mobileSheet.classList.add('open');
      mobileSheetBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileSheet() {
    if (mobileSheet && mobileSheetBackdrop) {
      mobileSheet.classList.remove('open');
      mobileSheetBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (mobileSheetClose) mobileSheetClose.addEventListener('click', closeMobileSheet);
  if (mobileSheetBackdrop) mobileSheetBackdrop.addEventListener('click', closeMobileSheet);

  // Doctor Card Click Handling
  doctorCards.forEach(card => {
    card.addEventListener('click', () => {
      doctorCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      currentDoctor = extractDoctorData(card);
      updateDesktopPanel(currentDoctor);

      // On mobile view (< 768px), open bottom sheet
      if (window.innerWidth < 1024) {
        updateMobileSheet(currentDoctor);
        openMobileSheet();
      }
    });
  });

  // Date selection (Desktop & Mobile)
  const setupDatePicker = (containerSelector) => {
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach(container => {
      const dayButtons = container.querySelectorAll('.day-pill');
      dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          selectedDate = btn.dataset.date;
          selectedDayName = btn.dataset.day;
          document.querySelectorAll('.day-pill').forEach(b => {
            b.classList.toggle('active', b.dataset.date === selectedDate);
          });
        });
      });
    });
  };
  setupDatePicker('.days-container');

  // Time slot selection (Desktop & Mobile)
  const setupTimeSlots = (containerSelector) => {
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach(container => {
      const slotButtons = container.querySelectorAll('.slot-pill');
      slotButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          selectedTime = btn.dataset.time;
          document.querySelectorAll('.slot-pill').forEach(b => {
            b.classList.toggle('active', b.dataset.time === selectedTime);
          });
        });
      });
    });
  };
  setupTimeSlots('.slots-container');

  // Booking Registration Modal Elements
  const bookingModalBackdrop = document.getElementById('booking-modal-backdrop');
  const bookingModal = document.getElementById('booking-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelBooking = document.getElementById('btn-cancel-booking');
  const btnConfirmBooking = document.getElementById('btn-confirm-booking');
  const modalDocImg = document.getElementById('modal-doc-img');
  const modalDocInitials = document.getElementById('modal-doc-initials');
  const modalDocName = document.getElementById('modal-doc-name');
  const modalDocRating = document.getElementById('modal-doc-rating');
  const modalDocSpecialty = document.getElementById('modal-doc-specialty');
  const modalDocSchedule = document.getElementById('modal-doc-schedule');
  const modalDocPrice = document.getElementById('modal-doc-price');

  const regPatientName = document.getElementById('reg-patient-name');
  const regPatientPhone = document.getElementById('reg-patient-phone');
  const regSymptoms = document.getElementById('reg-symptoms');
  const symptomsError = document.getElementById('symptoms-error');
  const regDuration = document.getElementById('reg-duration');
  const regSeverity = document.getElementById('reg-severity');
  const regNotes = document.getElementById('reg-notes');
  const quickSymptomsChips = document.querySelectorAll('#quick-symptoms-chips .symptom-chip');
  const durationPills = document.querySelectorAll('#duration-selector .duration-pill');
  const severityPills = document.querySelectorAll('#severity-selector .severity-pill');

  // Open & Close Booking Intake Modal
  function openBookingModal() {
    if (!currentDoctor) return;

    // Sync modal doctor info
    if (modalDocImg) {
      if (currentDoctor.image) {
        modalDocImg.src = currentDoctor.image;
        modalDocImg.alt = currentDoctor.name;
        modalDocImg.style.display = 'block';
        if (modalDocInitials) modalDocInitials.style.display = 'none';
      } else {
        modalDocImg.style.display = 'none';
        if (modalDocInitials) {
          modalDocInitials.textContent = currentDoctor.initials;
          modalDocInitials.style.display = 'block';
        }
      }
    }
    if (modalDocName) modalDocName.textContent = currentDoctor.name;
    if (modalDocRating) modalDocRating.textContent = currentDoctor.rating;
    if (modalDocSpecialty) modalDocSpecialty.textContent = currentDoctor.specialty;
    if (modalDocSchedule) modalDocSchedule.textContent = `${selectedDayName} ${selectedDate} · ${selectedTime}`;
    if (modalDocPrice) modalDocPrice.textContent = currentDoctor.price;

    // Clear error
    if (symptomsError) symptomsError.classList.add('hidden');
    if (regSymptoms) regSymptoms.classList.remove('!border-rose-500');

    // Display modal
    if (bookingModalBackdrop) {
      bookingModalBackdrop.classList.remove('hidden');
      // slight delay for transition
      requestAnimationFrame(() => {
        bookingModalBackdrop.classList.add('open');
      });
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBookingModal() {
    if (bookingModalBackdrop) {
      bookingModalBackdrop.classList.remove('open');
      setTimeout(() => {
        bookingModalBackdrop.classList.add('hidden');
        document.body.style.overflow = '';
      }, 200);
    }
  }

  // Quick symptom chips handling (toggle/append to textarea)
  quickSymptomsChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const sym = chip.dataset.symptom;
      if (!regSymptoms) return;

      let currentVal = regSymptoms.value.trim();
      if (!currentVal) {
        regSymptoms.value = sym;
        chip.classList.add('added');
      } else if (!currentVal.toLowerCase().includes(sym.toLowerCase())) {
        regSymptoms.value = `${currentVal}, ${sym}`;
        chip.classList.add('added');
      } else {
        // Remove if clicked again
        const regex = new RegExp(`(^|,\\s*)${sym}(,\\s*|$)`, 'i');
        regSymptoms.value = currentVal.replace(regex, '$1').replace(/(^,\s*|,\s*$)/, '').trim();
        chip.classList.remove('added');
      }

      // Clear error
      if (symptomsError) symptomsError.classList.add('hidden');
      if (regSymptoms) regSymptoms.classList.remove('!border-rose-500');
    });
  });

  // Duration selection pills
  durationPills.forEach(pill => {
    pill.addEventListener('click', () => {
      durationPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (regDuration) regDuration.value = pill.dataset.duration;
    });
  });

  // Severity selection pills
  severityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      severityPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (regSeverity) regSeverity.value = pill.dataset.severity;
    });
  });

  // Modal Close Events
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeBookingModal);
  if (btnCancelBooking) btnCancelBooking.addEventListener('click', closeBookingModal);
  if (bookingModalBackdrop) {
    bookingModalBackdrop.addEventListener('click', (e) => {
      if (e.target === bookingModalBackdrop) {
        closeBookingModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModalBackdrop && bookingModalBackdrop.classList.contains('open')) {
      closeBookingModal();
    }
  });

  // Form submission and validation
  if (btnConfirmBooking) {
    btnConfirmBooking.addEventListener('click', () => {
      const symptomsVal = regSymptoms ? regSymptoms.value.trim() : '';
      if (!symptomsVal) {
        if (symptomsError) symptomsError.classList.remove('hidden');
        if (regSymptoms) {
          regSymptoms.classList.add('!border-rose-500');
          regSymptoms.focus();
        }
        return;
      }

      const patientName = regPatientName ? regPatientName.value.trim() : 'Pasien';
      const durationVal = regDuration ? regDuration.value : '1 - 3 Hari';
      const severityVal = regSeverity ? regSeverity.value : 'Sedang';

      // Visual feedback loading state
      const originalText = btnConfirmBooking.innerHTML;
      btnConfirmBooking.disabled = true;
      btnConfirmBooking.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Memproses...</span>
      `;

      setTimeout(() => {
        // Update "Next Appointment" cards in UI to reflect newly registered appointment
        const nextApptDesktop = document.querySelector('.next-appt-card');
        if (nextApptDesktop && currentDoctor) {
          const docImg = nextApptDesktop.querySelector('img');
          const docName = nextApptDesktop.querySelector('b');
          const docSpecialty = nextApptDesktop.querySelectorAll('small')[1];
          const docDateTime = nextApptDesktop.querySelectorAll('small')[2];

          if (docImg && currentDoctor.image) docImg.src = currentDoctor.image;
          if (docName) docName.textContent = currentDoctor.name;
          if (docSpecialty) docSpecialty.textContent = currentDoctor.specialty;
          if (docDateTime) docDateTime.textContent = `${selectedDayName} ${selectedDate}, 2026 · ${selectedTime}`;
        }

        const nextApptMobile = document.querySelector('.stacked-card');
        if (nextApptMobile && currentDoctor) {
          const mDocImg = nextApptMobile.querySelector('img');
          const mDocName = nextApptMobile.querySelector('b');
          const mDocSpecialty = nextApptMobile.querySelectorAll('small')[0];
          const mDocDateTime = nextApptMobile.querySelectorAll('small')[1];

          if (mDocImg && currentDoctor.image) mDocImg.src = currentDoctor.image;
          if (mDocName) mDocName.textContent = currentDoctor.name;
          if (mDocSpecialty) mDocSpecialty.textContent = currentDoctor.specialty;
          if (mDocDateTime) mDocDateTime.textContent = `${selectedDayName} ${selectedDate}, 2026 · ${selectedTime}`;
        }

        // Show Rich Success Toast
        showToast(`Pendaftaran Berhasil! Sesi dengan ${currentDoctor.name} dijadwalkan pada ${selectedDayName} ${selectedDate} · ${selectedTime} (${durationVal})`);

        // Reset button
        btnConfirmBooking.disabled = false;
        btnConfirmBooking.innerHTML = originalText;

        // Reset inputs
        if (regSymptoms) regSymptoms.value = '';
        if (regNotes) regNotes.value = '';
        quickSymptomsChips.forEach(c => c.classList.remove('added'));

        // Close modal and mobile sheet
        closeBookingModal();
        closeMobileSheet();
      }, 500);
    });
  }

  // Booking Buttons Click -> Open Registration Modal
  const bookBtns = document.querySelectorAll('.btn-book-session');
  bookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openBookingModal();
    });
  });

  // Reschedule & Join Call Buttons
  const rescheduleBtns = document.querySelectorAll('.btn-reschedule');
  rescheduleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Permintaan jadwal ulang (Reschedule) telah dikirimkan ke dokter.');
    });
  });

  const joinCallBtns = document.querySelectorAll('.btn-join-call');
  joinCallBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('Menghubungkan panggilan video konsultasi...');
    });
  });

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const updateThemeIcon = (theme) => {
    if (!themeToggle) return;
    const iconUse = themeToggle.querySelector('use');
    if (iconUse) {
      iconUse.setAttribute('href', theme === 'dark' ? '#icon-sun' : '#icon-moon');
    }
  };

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Mode tampilan diubah ke ${newTheme === 'dark' ? 'Gelap' : 'Terang'}`);
    });
  }

  // Reset and ensure default theme is strictly LIGHT
  let currentThemeSetting = localStorage.getItem('theme');
  // If it was previously defaulted to dark, reset to light
  if (!currentThemeSetting || currentThemeSetting === 'dark') {
    currentThemeSetting = 'light';
    localStorage.setItem('theme', 'light');
  }
  document.documentElement.setAttribute('data-theme', currentThemeSetting);
  updateThemeIcon(currentThemeSetting);

  // Mobile search toggle
  const mobileSearchTrigger = document.getElementById('mobile-search-trigger');
  const mobileSearchBar = document.getElementById('mobile-search-bar');
  if (mobileSearchTrigger && mobileSearchBar) {
    mobileSearchTrigger.addEventListener('click', () => {
      mobileSearchBar.classList.toggle('hidden');
      if (!mobileSearchBar.classList.contains('hidden')) {
        mobileSearchInput?.focus();
      }
    });
  }

  // ==========================================================================
  // KLINIK MARISTELLA: APPOINTMENT STATUS SWITCHER & BILLING DRAWER / MODAL
  // ==========================================================================

  let currentAppointmentMode = 'before'; // 'before' | 'after'
  let isBillPaid = false;

  const desktopStateBefore = document.getElementById('desktop-state-before');
  const desktopStateAfter = document.getElementById('desktop-state-after');
  const mobileStateBefore = document.getElementById('mobile-state-before');
  const mobileStateAfter = document.getElementById('mobile-state-after');

  const btnToggleBeforeAll = document.querySelectorAll('.btn-toggle-status-before');
  const btnToggleAfterAll = document.querySelectorAll('.btn-toggle-status-after');

  function setAppointmentMode(mode, showNotification = true) {
    currentAppointmentMode = mode;

    if (mode === 'before') {
      desktopStateBefore?.classList.remove('hidden');
      desktopStateAfter?.classList.add('hidden');
      mobileStateBefore?.classList.remove('hidden');
      mobileStateAfter?.classList.add('hidden');

      btnToggleBeforeAll.forEach(btn => {
        btn.classList.add('bg-white', 'dark:bg-[#101E35]', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-bold');
        btn.classList.remove('text-slate-500', 'dark:text-slate-400', 'font-semibold');
      });
      btnToggleAfterAll.forEach(btn => {
        btn.classList.remove('bg-white', 'dark:bg-[#101E35]', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-bold');
        btn.classList.add('text-slate-500', 'dark:text-slate-400', 'font-semibold');
      });

      if (showNotification) {
        showToast('Tahap Janji Temu: Menunggu waktu konsultasi (Sebelum Periksa)');
      }
    } else {
      desktopStateBefore?.classList.add('hidden');
      desktopStateAfter?.classList.remove('hidden');
      mobileStateBefore?.classList.add('hidden');
      mobileStateAfter?.classList.remove('hidden');

      btnToggleAfterAll.forEach(btn => {
        btn.classList.add('bg-white', 'dark:bg-[#101E35]', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-bold');
        btn.classList.remove('text-slate-500', 'dark:text-slate-400', 'font-semibold');
      });
      btnToggleBeforeAll.forEach(btn => {
        btn.classList.remove('bg-white', 'dark:bg-[#101E35]', 'text-slate-900', 'dark:text-white', 'shadow-xs', 'font-bold');
        btn.classList.add('text-slate-500', 'dark:text-slate-400', 'font-semibold');
      });

      if (showNotification) {
        showToast(isBillPaid ? 'Tahap Janji Temu: Pemeriksaan Selesai (Sudah Lunas)' : 'Tahap Janji Temu: Pemeriksaan Selesai (Meminta Pembayaran)');
      }
    }
  }

  btnToggleBeforeAll.forEach(btn => {
    btn.addEventListener('click', () => setAppointmentMode('before'));
  });

  btnToggleAfterAll.forEach(btn => {
    btn.addEventListener('click', () => setAppointmentMode('after'));
  });

  // Drawer and Modal Elements
  const billOverlay = document.getElementById('overlay');
  const billDrawer = document.getElementById('drawer');
  const cashModal = document.getElementById('modal');
  const paymentSuccessModal = document.getElementById('payment-success-modal');
  const closeDrawerBtn = document.getElementById('closeDrawer');
  const closeModalBtn = document.getElementById('closeModal');
  const successCloseBtn = document.getElementById('successCloseBtn');
  const successBackBtn = document.getElementById('successBackBtn');
  const successPrintBtn = document.getElementById('successPrintBtn');
  const successAmount = document.getElementById('success-amount');
  const successAmountPaid = document.getElementById('success-amount-paid');
  const successItemTreatmentTitle = document.getElementById('success-item-treatment-title');
  const successItemTreatmentAmount = document.getElementById('success-item-treatment-amount');
  const successItemCompTitle = document.getElementById('success-item-component-title');
  const successItemCompAmount = document.getElementById('success-item-component-amount');
  const successItemMedTitle = document.getElementById('success-item-medicine-title');
  const successItemMedAmount = document.getElementById('success-item-medicine-amount');
  const successBodyTreatment = document.getElementById('success-body-treatment');
  const successBodyComponent = document.getElementById('success-body-component');
  const successBodyMedicine = document.getElementById('success-body-medicine');
  const openCashBtn = document.getElementById('openCash');
  const payBtn = document.getElementById('payBtn');
  const noteInput = document.getElementById('note');
  const noteCounter = document.getElementById('cnt');
  const amountInput = document.getElementById('amount');
  const chipButtons = document.querySelectorAll('.chip');
  const btnToggleBreakdown = document.getElementById('btn-toggle-item-breakdown');
  const itemsBreakdownPanel = document.getElementById('items-breakdown-panel');
  const viewDetailsText = document.getElementById('view-details-text');
  const btnShowMoreMethods = document.getElementById('btn-show-more-methods');
  const morePaymentMethods = document.getElementById('more-payment-methods');
  const showMoreText = document.getElementById('show-more-text');
  const showMoreIcon = document.getElementById('show-more-icon');

  function openBillDrawer() {
    billDrawer?.classList.add('show');
    billOverlay?.classList.add('show');
  }

  function closeBillDrawer() {
    billDrawer?.classList.remove('show');
    if (!cashModal?.classList.contains('show') && !paymentSuccessModal?.classList.contains('show')) {
      billOverlay?.classList.remove('show');
    }
  }

  function openCashModal() {
    cashModal?.classList.add('show');
    billOverlay?.classList.add('show');
  }

  function closeCashModal() {
    cashModal?.classList.remove('show');
    if (!billDrawer?.classList.contains('show') && !paymentSuccessModal?.classList.contains('show')) {
      billOverlay?.classList.remove('show');
    }
  }

  function openPaymentSuccessModal() {
    const rate = TARIFF_RATES[currentTariffPlan] || TARIFF_RATES.with_medicine;

    // Close any previous drawers/modals
    billDrawer?.classList.remove('show');
    cashModal?.classList.remove('show');

    // Update dynamic receipt figures & content according to chosen system rate
    if (successAmount) successAmount.textContent = rate.formatted;
    if (successAmountPaid) successAmountPaid.textContent = rate.formatted;

    if (currentTariffPlan === 'with_medicine') {
      if (successItemTreatmentTitle) successItemTreatmentTitle.textContent = 'Treatment (2)';
      if (successItemTreatmentAmount) successItemTreatmentAmount.textContent = 'Total: $300.00';
      if (successBodyTreatment) {
        successBodyTreatment.innerHTML = `
          <div><span>Jasa Konsultasi Dr. Saran Mitchell</span><span>$180.00</span></div>
          <div><span>Terapi Traksi &amp; Fisik Ortopedi</span><span>$120.00</span></div>
        `;
      }

      if (successItemCompTitle) successItemCompTitle.textContent = 'Component used (1)';
      if (successItemCompAmount) successItemCompAmount.textContent = 'Total: $120.00';
      if (successBodyComponent) {
        successBodyComponent.innerHTML = `
          <div><span>Elastic Knee Support Bandage</span><span>$120.00</span></div>
        `;
      }

      if (successItemMedTitle) successItemMedTitle.textContent = 'Medicine (1)';
      if (successItemMedAmount) successItemMedAmount.textContent = 'Total: $15.00';
      if (successBodyMedicine) {
        successBodyMedicine.innerHTML = `
          <div><span>Paket Analgesik &amp; Kalsium Kompleks (10 hari)</span><span>$15.00</span></div>
        `;
      }
    } else {
      // consultation_only
      if (successItemTreatmentTitle) successItemTreatmentTitle.textContent = 'Treatment (1)';
      if (successItemTreatmentAmount) successItemTreatmentAmount.textContent = 'Total: $180.00';
      if (successBodyTreatment) {
        successBodyTreatment.innerHTML = `
          <div><span>Jasa Konsultasi Dr. Saran Mitchell</span><span>$180.00</span></div>
        `;
      }

      if (successItemCompTitle) successItemCompTitle.textContent = 'Component used (0)';
      if (successItemCompAmount) successItemCompAmount.textContent = 'Dilewati ($0.00)';
      if (successBodyComponent) {
        successBodyComponent.innerHTML = `
          <div><span class="italic text-slate-400">Tidak ada komponen medis tambahan</span><span>$0.00</span></div>
        `;
      }

      if (successItemMedTitle) successItemMedTitle.textContent = 'Medicine (0)';
      if (successItemMedAmount) successItemMedAmount.textContent = 'Resep Luar ($0.00)';
      if (successBodyMedicine) {
        successBodyMedicine.innerHTML = `
          <div><span class="italic text-slate-400">Resep obat ditebus mandiri oleh pasien</span><span>$0.00</span></div>
        `;
      }
    }

    billOverlay?.classList.add('show');
    paymentSuccessModal?.classList.add('show');
  }

  function closePaymentSuccessModal() {
    paymentSuccessModal?.classList.remove('show');
    if (!billDrawer?.classList.contains('show') && !cashModal?.classList.contains('show')) {
      billOverlay?.classList.remove('show');
    }
  }

  window.openPaymentSuccessModal = openPaymentSuccessModal;
  window.closePaymentSuccessModal = closePaymentSuccessModal;

  function closeAllBillPopups() {
    billDrawer?.classList.remove('show');
    cashModal?.classList.remove('show');
    paymentSuccessModal?.classList.remove('show');
    billOverlay?.classList.remove('show');
  }

  // Trigger buttons on Next Appointment Card
  document.querySelectorAll('.btn-open-bill-drawer').forEach(btn => {
    btn.addEventListener('click', openBillDrawer);
  });

  document.querySelectorAll('.btn-trigger-payment').forEach(btn => {
    btn.addEventListener('click', () => {
      openBillDrawer();
      setTimeout(() => {
        openCashModal();
      }, 250);
    });
  });

  document.querySelectorAll('.btn-open-success-modal').forEach(btn => {
    btn.addEventListener('click', openPaymentSuccessModal);
  });

  document.querySelectorAll('.btn-print-receipt').forEach(btn => {
    btn.addEventListener('click', () => {
      openPaymentSuccessModal();
      setTimeout(() => {
        window.print();
      }, 350);
    });
  });

  closeDrawerBtn?.addEventListener('click', closeBillDrawer);
  closeModalBtn?.addEventListener('click', closeCashModal);
  successCloseBtn?.addEventListener('click', closePaymentSuccessModal);
  successBackBtn?.addEventListener('click', closePaymentSuccessModal);
  successPrintBtn?.addEventListener('click', () => window.print());

  // Accordion inside payment success modal
  document.querySelectorAll('.success-modal .acc-head').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      if (item) {
        const isOpen = item.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });
  });

  billOverlay?.addEventListener('click', () => {
    if (paymentSuccessModal?.classList.contains('show')) {
      closePaymentSuccessModal();
    } else if (cashModal?.classList.contains('show')) {
      closeCashModal();
    } else {
      closeAllBillPopups();
    }
  });

  openCashBtn?.addEventListener('click', openCashModal);

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (paymentSuccessModal?.classList.contains('show')) {
        closePaymentSuccessModal();
      } else if (cashModal?.classList.contains('show')) {
        closeCashModal();
      } else if (billDrawer?.classList.contains('show')) {
        closeBillDrawer();
      }
    }
  });

  // Note Character Counter
  if (noteInput && noteCounter) {
    noteInput.addEventListener('input', (e) => {
      noteCounter.textContent = `${e.target.value.length}/200`;
    });
  }

  // ==========================================================================
  // CLINIC SYSTEM TARIFF PLAN MANAGEMENT (Determined strictly by clinic rates)
  // ==========================================================================

  let currentTariffPlan = 'with_medicine'; // 'with_medicine' ($435.00) | 'consultation_only' ($180.00)
  const TARIFF_RATES = {
    with_medicine: {
      amount: 435.00,
      formatted: '$435.00',
      serviceDesc: 'Layanan Ortopedi & 1 Resep Obat Klinik',
      packageName: 'Konsultasi + Beli Obat di Klinik',
      treatmentTitle: 'Treatment (2)',
      treatmentDesc: 'Konsultasi Dokter Ortopedi & Terapi Sendi',
      treatmentAmount: 'Total: $300.00',
      componentAmount: 'Total: $120.00',
      medicineAmount: 'Total: $15.00'
    },
    consultation_only: {
      amount: 180.00,
      formatted: '$180.00',
      serviceDesc: 'Hanya Konsultasi Dokter Spesialis (Resep Mandiri)',
      packageName: 'Hanya Konsultasi Dokter Saja',
      treatmentTitle: 'Treatment (1)',
      treatmentDesc: 'Konsultasi Dokter Spesialis Ortopedi',
      treatmentAmount: 'Total: $180.00',
      componentAmount: 'Dilewati ($0.00)',
      medicineAmount: 'Resep Luar ($0.00)'
    }
  };

  function applyTariffPlan(plan) {
    currentTariffPlan = plan;
    const rate = TARIFF_RATES[plan];

    // 1. Update Card displays (Desktop & Mobile)
    const desktopTotalDisplay = document.getElementById('desktop-total-display');
    if (desktopTotalDisplay) desktopTotalDisplay.textContent = rate.formatted;

    const mobileTotalDisplay = document.getElementById('mobile-total-display');
    if (mobileTotalDisplay) mobileTotalDisplay.textContent = rate.formatted;

    const desktopServiceDesc = document.getElementById('desktop-service-desc');
    if (desktopServiceDesc) desktopServiceDesc.textContent = rate.serviceDesc;

    const desktopPayBtnLabel = document.getElementById('desktop-pay-btn-label');
    if (desktopPayBtnLabel) desktopPayBtnLabel.textContent = `Bayar Sekarang (${rate.formatted})`;

    // Update Plan Buttons on Card & Drawer
    document.querySelectorAll('.btn-select-tariff-plan').forEach(btn => {
      const isSelected = btn.dataset.plan === plan;
      if (isSelected) {
        btn.classList.add('border-2', 'border-[#012D68]', 'bg-white', 'dark:bg-[#101E35]', 'text-[#012D68]', 'dark:text-blue-300', 'font-bold', 'shadow-xs');
        btn.classList.remove('border-slate-200', 'dark:border-slate-700', 'bg-transparent', 'text-slate-500', 'dark:text-slate-400', 'font-semibold');
      } else {
        btn.classList.remove('border-2', 'border-[#012D68]', 'bg-white', 'dark:bg-[#101E35]', 'text-[#012D68]', 'dark:text-blue-300', 'font-bold', 'shadow-xs');
        btn.classList.add('border', 'border-slate-200', 'dark:border-slate-700', 'bg-transparent', 'text-slate-500', 'dark:text-slate-400', 'font-semibold');
      }
    });

    // 2. Update Drawer Displays
    const dItemTreatmentTitle = document.getElementById('drawer-item-treatment-title');
    if (dItemTreatmentTitle) dItemTreatmentTitle.textContent = rate.treatmentTitle;

    const dItemTreatmentDesc = document.getElementById('drawer-item-treatment-desc');
    if (dItemTreatmentDesc) dItemTreatmentDesc.textContent = rate.treatmentDesc;

    const dItemTreatmentAmt = document.getElementById('drawer-item-treatment-amount');
    if (dItemTreatmentAmt) dItemTreatmentAmt.textContent = rate.treatmentAmount;

    const dItemCompAmt = document.getElementById('drawer-item-component-amount');
    if (dItemCompAmt) dItemCompAmt.textContent = rate.componentAmount;

    const dItemMedAmt = document.getElementById('drawer-item-medicine-amount');
    if (dItemMedAmt) dItemMedAmt.textContent = rate.medicineAmount;

    const dSubtotal = document.getElementById('drawer-subtotal-display');
    if (dSubtotal) dSubtotal.textContent = rate.formatted;

    const dTotal = document.getElementById('drawer-total-display');
    if (dTotal) dTotal.textContent = rate.formatted;

    // 3. Update Modal Displays
    const modalTotalDisplay = document.getElementById('modal-total-display');
    if (modalTotalDisplay) modalTotalDisplay.textContent = rate.formatted;

    if (payBtn) {
      const spanEl = payBtn.querySelector('span');
      if (spanEl) spanEl.textContent = `Pay ${rate.formatted}`;
    }

    // Modal Radio cards highlight
    document.querySelectorAll('.modal-tariff-card').forEach(card => {
      const radio = card.querySelector('input[type="radio"]');
      const isCardPlan = card.dataset.plan === plan;
      if (radio) radio.checked = isCardPlan;

      if (isCardPlan) {
        card.classList.add('border-2', 'border-[#012D68]', 'bg-blue-50/70', 'dark:bg-blue-950/40');
        card.classList.remove('border-slate-200', 'dark:border-slate-700', 'bg-white', 'dark:bg-slate-900');
      } else {
        card.classList.remove('border-2', 'border-[#012D68]', 'bg-blue-50/70', 'dark:bg-blue-950/40');
        card.classList.add('border', 'border-slate-200', 'dark:border-slate-700', 'bg-white', 'dark:bg-slate-900');
      }
    });
  }

  // Bind click handlers for tariff plan selection across Card & Drawer
  document.querySelectorAll('.btn-select-tariff-plan').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      if (plan) {
        applyTariffPlan(plan);
        showToast(`Tarif sistem diatur: ${TARIFF_RATES[plan].packageName} (${TARIFF_RATES[plan].formatted})`);
      }
    });
  });

  // Bind click handlers for Modal tariff cards
  document.querySelectorAll('.modal-tariff-card').forEach(card => {
    card.addEventListener('click', () => {
      const plan = card.dataset.plan;
      if (plan) {
        applyTariffPlan(plan);
        showToast(`Tarif sistem diatur: ${TARIFF_RATES[plan].packageName} (${TARIFF_RATES[plan].formatted})`);
      }
    });
  });

  // Item breakdown toggle
  btnToggleBreakdown?.addEventListener('click', () => {
    const isHidden = itemsBreakdownPanel?.classList.toggle('hidden');
    if (viewDetailsText) {
      viewDetailsText.textContent = isHidden ? 'View Details' : 'Hide Details';
    }
  });

  // Show more payment methods toggle
  btnShowMoreMethods?.addEventListener('click', () => {
    const isHidden = morePaymentMethods?.classList.toggle('hidden');
    if (showMoreText) {
      showMoreText.textContent = isHidden ? 'Show More' : 'Hide More';
    }
    if (showMoreIcon) {
      const useEl = showMoreIcon.querySelector('use');
      if (useEl) {
        useEl.setAttribute('href', isHidden ? '#i-down' : '#i-up2');
      }
    }
  });

  // Pay Confirmation Process
  payBtn?.addEventListener('click', () => {
    const rate = TARIFF_RATES[currentTariffPlan] || TARIFF_RATES.with_medicine;
    const originalText = payBtn.innerHTML;
    payBtn.disabled = true;
    payBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      <span>Memproses ${rate.formatted}...</span>
    `;

    setTimeout(() => {
      isBillPaid = true;
      payBtn.disabled = false;
      payBtn.innerHTML = originalText;

      closeAllBillPopups();

      // Update Desktop Elements
      const dBadge = document.getElementById('desktop-unpaid-badge');
      if (dBadge) {
        dBadge.className = 'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
        dBadge.textContent = 'PAID / LUNAS';
      }
      const dStatusPill = document.getElementById('desktop-status-pill');
      if (dStatusPill) {
        dStatusPill.className = 'font-bold text-emerald-600 dark:text-emerald-400';
        dStatusPill.textContent = `Lunas: ${rate.packageName}`;
      }
      document.getElementById('desktop-action-buttons-unpaid')?.classList.add('hidden');
      document.getElementById('desktop-action-buttons-paid')?.classList.remove('hidden');

      // Update Mobile Elements
      const mBadge = document.getElementById('mobile-unpaid-badge');
      if (mBadge) {
        mBadge.className = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
        mBadge.textContent = 'PAID';
      }
      const mStatusPill = document.getElementById('mobile-status-pill');
      if (mStatusPill) {
        mStatusPill.className = 'font-bold text-emerald-600 dark:text-emerald-400';
        mStatusPill.textContent = 'Lunas';
      }
      document.getElementById('mobile-action-buttons-unpaid')?.classList.add('hidden');
      document.getElementById('mobile-action-buttons-paid')?.classList.remove('hidden');

      // Update Drawer Badge & Paid Actions
      const drawerBadge = document.getElementById('drawer-bill-badge');
      if (drawerBadge) {
        drawerBadge.className = 'badge paid';
        drawerBadge.textContent = 'PAID';
      }
      const drawerPaidActions = document.getElementById('drawer-paid-actions');
      const drawerUnpaidActions = document.getElementById('drawer-unpaid-actions');
      if (drawerPaidActions) drawerPaidActions.classList.remove('hidden');
      if (drawerUnpaidActions) drawerUnpaidActions.classList.add('hidden');

      showToast(`Pembayaran berhasil diproses! Tagihan #BILL00124 (${rate.packageName}) sebesar ${rate.formatted} telah lunas.`);

      // Automatically display the Payment Success Receipt Modal (Zendenta Adapted)
      setTimeout(() => {
        openPaymentSuccessModal();
      }, 300);
    }, 600);
  });

  window.printInvoiceReceipt = function() {
    openPaymentSuccessModal();
    showToast('Mencetak kuitansi resmi Klinik Maristella #BILL00124...');
    setTimeout(() => {
      window.print();
    }, 400);
  };
});
