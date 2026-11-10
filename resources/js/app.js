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
});
