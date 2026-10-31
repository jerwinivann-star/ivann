document.addEventListener('DOMContentLoaded', function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  // Highlight the current page in the navigation
  var page = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-list a[href]').forEach(function (a) {
    if (a.getAttribute('href') !== page) return;
    if (a.classList.contains('nav-link')) a.classList.add('active-link');
    var menu = a.closest('.dropdown-menu');
    if (menu) {
      a.classList.add('active');
      var t = menu.parentNode.querySelector('.dropdown-toggle');
      if (t) t.classList.add('active-link');
    }
  });

  // Dropdown
  function closeDropdowns(except) {
    $$('.dropdown.open').forEach(function (d) {
      if (d === except) return;
      d.classList.remove('open');
      var t = d.querySelector('.dropdown-toggle');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  $$('.dropdown-toggle').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      var d = b.parentNode;
      closeDropdowns(d);
      var open = d.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () { closeDropdowns(null); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDropdowns(null); });

  // Logout with confirmation
  $$('[data-logout]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
      }
    });
  });

  // Hide broken images so the gradient placeholder shows instead
  $$('img').forEach(function (img) {
    var hide = function () { img.style.opacity = 0; };
    img.addEventListener('error', hide);
    if (img.complete && !img.naturalWidth) hide();
  });

  // Home page slider
  var slides = $$('.slide');
  if (slides.length) {
    var i = 0;
    slides[0].classList.add('active');
    if (slides.length > 1) {
      setInterval(function () {
        slides[i].classList.remove('active');
        i = (i + 1) % slides.length;
        slides[i].classList.add('active');
      }, 3000);
    }
  }

  // Skills tabs
  var tabs = $$('.tablinks');
  function openTab(btn) {
    $$('.tabcontent').forEach(function (c) { c.classList.remove('active'); });
    tabs.forEach(function (t) { t.classList.remove('active'); });
    document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
    btn.classList.add('active');
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { openTab(t); }); });
  if (tabs.length) openTab(tabs[0]);

  // Fun fact cards: tap to flip on touch devices (hover handles desktop)
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
    $$('.funfact-card').forEach(function (c) {
      c.addEventListener('click', function () { c.classList.toggle('flipped'); });
    });
  }

  // Goal cards
  $$('.goal-card').forEach(function (c) {
    var toggle = function () { c.querySelector('.goal-details').classList.toggle('active'); };
    c.addEventListener('click', toggle);
    c.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  // Contact form validation
  var form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('.error').forEach(function (x) { x.textContent = ''; });
      var fail = function (id, text) { document.getElementById(id).textContent = text; ok = false; };
      var email = $('#email').value.trim();
      if ($('#name').value.trim() === '') fail('nameError', 'Name is required');
      if (email === '') fail('emailError', 'Email is required');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('emailError', 'Please enter a valid email');
      if ($('#message').value.trim() === '') fail('messageError', 'Message is required');
      if (ok) { alert('Your message has been sent successfully!'); form.reset(); }
    });
  }
});