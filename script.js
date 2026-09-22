const menuButton = document.querySelector('.menu-button');
const topbar = document.querySelector('.topbar');
const estimateForm = document.querySelector('#estimate-form');

menuButton.addEventListener('click', () => {
    const isOpen = topbar.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

document.querySelectorAll('nav a').forEach((link) => link.addEventListener('click', () => {
    topbar.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu';
}));

document.querySelector('nav a[href="#services"]').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('#services').scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#services');
});

estimateForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = estimateForm.querySelector('input[name="name"]').value;
    const email = estimateForm.querySelector('input[name="email"]').value;
    const service = estimateForm.querySelector('select[name="service"]').value;
    const details = estimateForm.querySelector('textarea[name="details"]').value;

    const subject = encodeURIComponent(`Estimate Request - ${service}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject Details:\n${details}`);

    window.location.href = `mailto:test@test.com?subject=${subject}&body=${body}`;

    estimateForm.querySelector('.form-message').textContent = 'Thanks. Your estimate request is on its way.';
    setTimeout(() => {
        estimateForm.querySelector('.form-message').textContent = '';
    }, 5000);
    estimateForm.reset();
});