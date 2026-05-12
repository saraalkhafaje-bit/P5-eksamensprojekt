/* Channe Lykke Krog - Inspiration til burger menuen er hentet fra ChatGPT - Se AI Prompt dokument */
/* burger menu navigation */
const menuItems = [
    { menuName: 'Forside', link: 'index.html' },
    { menuName: 'Events', link: 'events.html' },
    { menuName: 'Om os', link: 'om-os.html' },
    { menuName: 'FAQ', link: 'faq.html' },
    { menuName: 'Kontakt', link: 'kontakt.html' },
    { menuName: 'Bliv frivillig', link: 'blivfrivillig.html' }
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
    navbarMenu.classList.toggle('active');
    navbarBurger.classList.toggle('active');
});

// Luk menu når man klikker på et link
for (let i = 0; i < navbarLinks.length; i++) {
    navbarLinks[i].addEventListener('click', function () {
        navbarMenu.classList.remove('active');
        navbarBurger.classList.remove('active');
    });
}

// Luk menu hvis man klikker udenfor
document.addEventListener('click', function (event) {
    if (!navbarMenu.contains(event.target) && !navbarBurger.contains(event.target)) {
        navbarMenu.classList.remove('active');
        navbarBurger.classList.remove('active');
    }
});