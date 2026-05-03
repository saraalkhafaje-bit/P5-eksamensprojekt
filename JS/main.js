/**
 * main.js – Grocott Fysioterapi
 * Handles: mobile nav, video embed, booking calendar, modal flow, smooth scroll, fade-in
 */
(function () {
  'use strict';

  /* ============================================================
     MOBILE NAVIGATION
     ============================================================ */
  var navToggle = document.getElementById('navToggle');
  var mainNav   = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     INTRO VIDEO – lazy-load YouTube iframe on click
     ============================================================ */
  var videoPlaceholder = document.getElementById('videoPlaceholder');

  if (videoPlaceholder) {
    function loadVideo() {
      var container = videoPlaceholder.closest('.video-container');
      var iframe    = document.createElement('iframe');
      /* Replace VIDEO_ID with the real YouTube ID when available */
      iframe.src             = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1';
      iframe.title           = 'Introduktionsvideo – Grocott Fysioterapi';
      iframe.allow           = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      container.innerHTML    = '';
      container.appendChild(iframe);
    }

    videoPlaceholder.addEventListener('click', loadVideo);
    videoPlaceholder.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadVideo(); }
    });
  }

  /* ============================================================
     BOOKING CALENDAR
     ============================================================ */
  var calendarGrid = document.getElementById('calendarGrid');
  var weekLabel    = document.getElementById('weekLabel');
  var prevWeekBtn  = document.getElementById('prevWeek');
  var nextWeekBtn  = document.getElementById('nextWeek');

  var DAYS_DA   = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag'];
  var MONTHS_DA = ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'];

  /* Slot template per weekday (0=Mon … 4=Fri) */
  var SLOT_TEMPLATES = [
    /* Monday */
    [
      { time: '08:00', status: 'booked'    },
      { time: '09:00', status: 'available' },
      { time: '10:00', status: 'available' },
      { time: '11:00', status: 'booked'    },
      { time: '13:00', status: 'few'       },
      { time: '14:00', status: 'available' },
    ],
    /* Tuesday */
    [
      { time: '08:00', status: 'available' },
      { time: '09:00', status: 'booked'    },
      { time: '10:00', status: 'few'       },
      { time: '11:00', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '15:00', status: 'booked'    },
    ],
    /* Wednesday */
    [
      { time: '09:00', status: 'booked'    },
      { time: '10:00', status: 'booked'    },
      { time: '11:00', status: 'few'       },
      { time: '13:00', status: 'available' },
      { time: '14:00', status: 'available' },
      { time: '16:00', status: 'available' },
    ],
    /* Thursday */
    [
      { time: '08:00', status: 'available' },
      { time: '09:00', status: 'available' },
      { time: '10:00', status: 'available' },
      { time: '13:00', status: 'few'       },
      { time: '15:00', status: 'booked'    },
      { time: '16:00', status: 'available' },
    ],
    /* Friday */
    [
      { time: '08:00', status: 'booked'    },
      { time: '09:00', status: 'few'       },
      { time: '10:00', status: 'available' },
      { time: '11:00', status: 'available' },
      { time: '12:00', status: 'available' },
    ],
  ];

  var weekOffset = 0;

  function getWeekStart(offset) {
    var today      = new Date();
    var dayOfWeek  = today.getDay();
    var daysToMon  = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    var monday     = new Date(today);
    monday.setDate(today.getDate() + daysToMon + offset * 7);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }

  function getWeekNumber(date) {
    var d      = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    var dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  }

  function isToday(date) {
    var t = new Date();
    return date.getDate()     === t.getDate() &&
           date.getMonth()    === t.getMonth() &&
           date.getFullYear() === t.getFullYear();
  }

  function renderCalendar() {
    var monday   = getWeekStart(weekOffset);
    var weekNum  = getWeekNumber(monday);
    var monthName = MONTHS_DA[monday.getMonth()];
    weekLabel.textContent = 'Uge ' + weekNum + ' – ' + monthName + ' ' + monday.getFullYear();

    calendarGrid.innerHTML = '';

    for (var i = 0; i < 5; i++) {
      var dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);

      var dayCol  = document.createElement('div');
      dayCol.className = 'calendar-day';
      dayCol.setAttribute('role', 'rowgroup');

      var todayClass = isToday(dayDate) ? ' today' : '';
      dayCol.innerHTML =
        '<div class="day-header">' +
          '<div class="day-name">' + DAYS_DA[i].substring(0, 3) + '</div>' +
          '<div class="day-date' + todayClass + '">' + dayDate.getDate() + '/' + (dayDate.getMonth() + 1) + '</div>' +
        '</div>' +
        '<div class="time-slots"></div>';

      var slotsContainer = dayCol.querySelector('.time-slots');
      var slots          = SLOT_TEMPLATES[i];

      slots.forEach(function (slot) {
        var btn = document.createElement('button');
        btn.className   = 'time-slot ' + slot.status;
        btn.textContent = slot.time;
        btn.setAttribute('role', 'gridcell');

        if (slot.status === 'booked') {
          btn.disabled = true;
          btn.setAttribute('aria-label', DAYS_DA[i] + ' kl. ' + slot.time + ' – optaget');
        } else {
          btn.setAttribute(
            'aria-label',
            'Book tid: ' + DAYS_DA[i] + ' d. ' + dayDate.getDate() + '/' + (dayDate.getMonth() + 1) + ' kl. ' + slot.time
          );
          /* Capture loop variables */
          (function (slotTime, dayName, capturedDate) {
            btn.addEventListener('click', function () {
              openBookingModal({
                dayName: dayName,
                date:    capturedDate.getDate() + '. ' + MONTHS_DA[capturedDate.getMonth()],
                time:    slotTime,
              });
            });
          }(slot.time, DAYS_DA[i], new Date(dayDate)));
        }
        slotsContainer.appendChild(btn);
      });

      calendarGrid.appendChild(dayCol);
    }
  }

  if (calendarGrid) {
    renderCalendar();
    prevWeekBtn.addEventListener('click', function () { weekOffset--; renderCalendar(); });
    nextWeekBtn.addEventListener('click', function () { weekOffset++; renderCalendar(); });
  }

  /* ============================================================
     BOOKING MODAL
     ============================================================ */
  var bookingModal        = document.getElementById('bookingModal');
  var modalClose          = document.getElementById('modalClose');
  var selectedTimeDisplay = document.getElementById('selectedTimeDisplay');
  var stepConfirm         = document.getElementById('stepConfirm');
  var stepSuccess         = document.getElementById('stepSuccess');
  var successMessage      = document.getElementById('successMessage');
  var closeSuccessBtn     = document.getElementById('closeSuccess');
  var loginForm           = document.getElementById('loginForm');
  var registerForm        = document.getElementById('registerForm');
  var modalTabs           = document.querySelectorAll('.modal-tab');

  var selectedSlotData = null;

  function openBookingModal(slotData) {
    selectedSlotData            = slotData;
    selectedTimeDisplay.textContent = slotData.dayName + ' d. ' + slotData.date + ' kl. ' + slotData.time;

    stepConfirm.removeAttribute('hidden');
    stepSuccess.setAttribute('hidden', '');
    loginForm.reset();
    registerForm.reset();
    showTab('login');

    bookingModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    setTimeout(function () { if (modalClose) modalClose.focus(); }, 60);
  }

  function closeBookingModal() {
    bookingModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    selectedSlotData = null;
  }

  function showTab(tabName) {
    modalTabs.forEach(function (tab) {
      var active = tab.dataset.tab === tabName;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
    });

    if (tabName === 'login') {
      loginForm.classList.add('active');
      loginForm.removeAttribute('hidden');
      registerForm.classList.remove('active');
      registerForm.setAttribute('hidden', '');
    } else {
      registerForm.classList.add('active');
      registerForm.removeAttribute('hidden');
      loginForm.classList.remove('active');
      loginForm.setAttribute('hidden', '');
    }
  }

  function showSuccessStep() {
    if (selectedSlotData) {
      successMessage.textContent =
        'Din tid er bekræftet: ' + selectedSlotData.dayName + ' d. ' +
        selectedSlotData.date + ' kl. ' + selectedSlotData.time + '.';
    }
    stepConfirm.setAttribute('hidden', '');
    stepSuccess.removeAttribute('hidden');
  }

  if (bookingModal) {
    modalClose.addEventListener('click', closeBookingModal);

    bookingModal.addEventListener('click', function (e) {
      if (e.target === bookingModal) closeBookingModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !bookingModal.hasAttribute('hidden')) closeBookingModal();
    });

    modalTabs.forEach(function (tab) {
      tab.addEventListener('click', function () { showTab(tab.dataset.tab); });
    });

    loginForm.addEventListener('submit', function (e) { e.preventDefault(); showSuccessStep(); });
    registerForm.addEventListener('submit', function (e) { e.preventDefault(); showSuccessStep(); });

    closeSuccessBtn.addEventListener('click', closeBookingModal);
  }

  /* ============================================================
     SMOOTH SCROLL – offset for sticky header
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      var headerH = document.querySelector('.site-header')
                    ? document.querySelector('.site-header').offsetHeight
                    : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerH - 16;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ============================================================
     INTERSECTION OBSERVER – fade sections into view
     ============================================================ */
  var fadeSections = document.querySelectorAll(
    '.intro-video, .symptoms, .booking, .trustpilot-section, .testimonials, .about, .social-media'
  );

  if ('IntersectionObserver' in window && fadeSections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07 });

    fadeSections.forEach(function (section) {
      section.classList.add('fade-section');
      observer.observe(section);
    });
  }

}());
