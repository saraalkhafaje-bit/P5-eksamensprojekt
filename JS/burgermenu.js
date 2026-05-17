/* Channe Lykke Krog - Inspiration til burger menuen er hentet fra ChatGPT - Se AI Prompt dokument */
/* burger menu navigation */
const menuItems = [
    { menuName: 'Behandlinger', link: 'behandlinger.html' },
    { menuName: 'Holdtræning', link: 'holdtraening.html' },
    { menuName: 'Om klinikken', link: 'omklinikken.html' },
    { menuName: 'Priser', link: 'priser.html' },
    { menuName: 'Til forældre', link: 'tilforaeldre.html' },
    { menuName: 'Til erhverv', link: 'tilerhverv.html' },
    { menuName: 'Kontakt', link: 'kontakt.html' },
    { menuName: 'Book tid', link: 'booking.html' }
];

const navbarMenu = document.getElementById('navbarMenu');
const navbarBurger = document.getElementById('navbarBurger');

// Tøm menu
navbarMenu.innerHTML = '';

// Loop + DOM manipulation
for (let i = 0; i < menuItems.length; i++) {
    const link = document.createElement('a');
    link.href = menuItems[i].link;
    link.textContent = menuItems[i].menuName;
    link.classList.add('navbar__menu-link');

    navbarMenu.appendChild(link);
}

/* burger menu toggle */
const navbarLinks = document.querySelectorAll('.navbar__menu-link');

navbarBurger.addEventListener('click', function () {
    const isExpanded = navbarBurger.getAttribute('aria-expanded') === 'true';
    navbarMenu.classList.toggle('active');
    navbarBurger.classList.toggle('active');
    navbarBurger.setAttribute('aria-expanded', String(!isExpanded));
    navbarBurger.setAttribute('aria-label', isExpanded ? 'Åbn menu' : 'Luk menu');
});

// Luk menu når man klikker på et link
for (let i = 0; i < navbarLinks.length; i++) {
    navbarLinks[i].addEventListener('click', function () {
        navbarMenu.classList.remove('active');
        navbarBurger.classList.remove('active');
        navbarBurger.setAttribute('aria-expanded', 'false');
        navbarBurger.setAttribute('aria-label', 'Åbn menu');
    });
}

// Luk menu hvis man klikker udenfor
document.addEventListener('click', function (event) {
    if (!navbarMenu.contains(event.target) && !navbarBurger.contains(event.target)) {
        navbarMenu.classList.remove('active');
        navbarBurger.classList.remove('active');
        navbarBurger.setAttribute('aria-expanded', 'false');
        navbarBurger.setAttribute('aria-label', 'Åbn menu');
    }
});