(function () {
  'use strict';

  // ─── State ─────────────────────────────────────────────────
  const state = {
    trin: 1,
    behandling: null,
    dato: null,
    tid: null,
  };

  // ─── Tilgængelige tidspunkter (mandag–fredag) ───────────────
  const tidspunkter = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  const maanedNavne = [
    'januar', 'februar', 'marts', 'april', 'maj', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'december',
  ];

  const behandlingNavne = {
    fysioterapi: 'Fysioterapi',
    formthotics: 'Formthotics indlægssåler',
    massage: 'Massage & Velvære',
  };

  // ─── DOM-referencer ─────────────────────────────────────────
  const trinElementer    = document.querySelectorAll('.booking__trin');
  const behandlingRadios = document.querySelectorAll('input[name="behandling"]');
  const naeste1          = document.getElementById('booking-naeste-1');
  const tilbage2         = document.getElementById('booking-tilbage-2');
  const naeste2          = document.getElementById('booking-naeste-2');
  const kalenderGrid     = document.getElementById('kalender-grid');
  const maanedLabel      = document.getElementById('kalender-maaned-label');
  const forrigeKnap      = document.getElementById('kalender-forrige');
  const naesteMaaned     = document.getElementById('kalender-naeste');
  const tidslotsTitel    = document.getElementById('tidslots-titel');
  const tidslotGrid      = document.getElementById('tidslots-grid');
  const formular         = document.getElementById('booking-formular');
  const tilbage3         = document.getElementById('booking-tilbage-3');

  // Kalender viser denne måned som udgangspunkt
  let vismaaned = new Date();
  vismaaned.setDate(1);

  // ─── Hjælpefunktioner ───────────────────────────────────────
  function visTrin(nummer) {
    const sektionIds = {
      1: 'booking-trin-1',
      2: 'booking-trin-2',
      3: 'booking-trin-3',
      4: 'booking-bekraeftelse',
    };

    Object.values(sektionIds).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.add('booking__sektion--skjult');
    });

    var aktiv = document.getElementById(sektionIds[nummer] || sektionIds[4]);
    if (aktiv) aktiv.classList.remove('booking__sektion--skjult');

    trinElementer.forEach(function (el) {
      el.classList.remove('booking__trin--aktiv', 'booking__trin--fuldfoert');
      var n = parseInt(el.dataset.trin, 10);
      if (n < nummer) el.classList.add('booking__trin--fuldfoert');
      if (n === nummer) el.classList.add('booking__trin--aktiv');
    });

    state.trin = nummer;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function datoStreng(dato) {
    return dato.toLocaleDateString('da-DK', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  // ─── Kalender ───────────────────────────────────────────────
  function bygKalender() {
    var aar    = vismaaned.getFullYear();
    var maaned = vismaaned.getMonth();

    maanedLabel.textContent = maanedNavne[maaned] + ' ' + aar;

    var foersteDag = new Date(aar, maaned, 1);
    var sidsteDag  = new Date(aar, maaned + 1, 0);
    var iDag       = new Date();
    iDag.setHours(0, 0, 0, 0);

    // ISO: Mandag = offset 0
    var startOffset = foersteDag.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    kalenderGrid.innerHTML = '';

    // Tomme celler
    for (var i = 0; i < startOffset; i++) {
      var tom = document.createElement('div');
      tom.className = 'booking__kalender-celle booking__kalender-celle--tom';
      kalenderGrid.appendChild(tom);
    }

    for (var dag = 1; dag <= sidsteDag.getDate(); dag++) {
      (function (d) {
        var dato      = new Date(aar, maaned, d);
        var erWeekend = dato.getDay() === 0 || dato.getDay() === 6;
        var erFortid  = dato < iDag;
        var erValgt   = state.dato && dato.toDateString() === state.dato.toDateString();

        var celle = document.createElement('button');
        celle.type = 'button';
        celle.textContent = d;

        var klasser = 'booking__kalender-celle';
        if (erWeekend || erFortid) {
          klasser += ' booking__kalender-celle--deaktiveret';
          celle.disabled = true;
        } else {
          klasser += ' booking__kalender-celle--tilgaengelig';
        }
        if (erValgt) klasser += ' booking__kalender-celle--valgt';
        celle.className = klasser;

        if (!erWeekend && !erFortid) {
          celle.addEventListener('click', function () {
            state.dato = dato;
            state.tid  = null;
            naeste2.disabled = true;
            bygKalender();
            visTimeslots();
          });
        }

        kalenderGrid.appendChild(celle);
      }(dag));
    }
  }

  function visTimeslots() {
    if (!state.dato) {
      tidslotsTitel.textContent = '';
      tidslotGrid.innerHTML = '';
      return;
    }

    tidslotsTitel.textContent = 'Ledige tider – ' + datoStreng(state.dato);
    tidslotGrid.innerHTML = '';

    tidspunkter.forEach(function (tid) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = tid;
      btn.className = 'booking__tidslot' + (state.tid === tid ? ' booking__tidslot--valgt' : '');

      btn.addEventListener('click', function () {
        state.tid = tid;
        naeste2.disabled = false;
        visTimeslots();
      });

      tidslotGrid.appendChild(btn);
    });
  }

  // ─── Trin 1 – Behandlingsvalg ────────────────────────────────
  behandlingRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      state.behandling = this.value;
      naeste1.disabled = false;
      document.querySelectorAll('.booking__behandling-kort').forEach(function (k) {
        k.classList.remove('booking__behandling-kort--valgt');
      });
      this.closest('.booking__behandling-kort').classList.add('booking__behandling-kort--valgt');
    });
  });

  naeste1.addEventListener('click', function () {
    visTrin(2);
    bygKalender();
    visTimeslots();
  });

  // ─── Trin 2 – Kalendernavigering ─────────────────────────────
  forrigeKnap.addEventListener('click', function () {
    var iDagStart = new Date();
    iDagStart.setDate(1);
    iDagStart.setHours(0, 0, 0, 0);
    var forrige = new Date(vismaaned.getFullYear(), vismaaned.getMonth() - 1, 1);
    if (forrige >= iDagStart) {
      vismaaned = forrige;
      bygKalender();
    }
  });

  naesteMaaned.addEventListener('click', function () {
    vismaaned = new Date(vismaaned.getFullYear(), vismaaned.getMonth() + 1, 1);
    bygKalender();
  });

  tilbage2.addEventListener('click', function () { visTrin(1); });
  naeste2.addEventListener('click',  function () { visTrin(3); });

  // ─── Trin 3 – Formular ───────────────────────────────────────
  tilbage3.addEventListener('click', function () { visTrin(2); });

  formular.addEventListener('submit', function (e) {
    e.preventDefault();

    var fornavn   = document.getElementById('booking-fornavn').value.trim();
    var efternavn = document.getElementById('booking-efternavn').value.trim();
    var telefon   = document.getElementById('booking-telefon').value.trim();
    var email     = document.getElementById('booking-email').value.trim();

    // Simpel validering
    if (!fornavn || !efternavn || !telefon || !email) {
      return;
    }

    var besked = document.getElementById('bekraeftelse-besked');
    besked.textContent =
      'Tak, ' + fornavn + ' ' + efternavn + '! ' +
      'Din booking af ' + behandlingNavne[state.behandling] + ' ' +
      datoStreng(state.dato) + ' kl. ' + state.tid + ' er modtaget.';

    visTrin(4);
  });

  // ─── Start ───────────────────────────────────────────────────
  visTrin(1);
}());
