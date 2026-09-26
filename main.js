/**
 * My Village - Custom JavaScript
 */

(function() {
  "use strict";

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add active class to navbar links on scroll
  window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.navbar-nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // Mobile nav toggle
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', function(e) {
      document.querySelector('body').classList.toggle('mobile-nav-active');
      this.classList.toggle('bi-list');
      this.classList.toggle('bi-x');
    });
  }

  // Toggle mobile nav dropdowns
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(toggleBtn => {
    toggleBtn.addEventListener('click', function(e) {
      if (window.innerWidth < 1200) {
        e.preventDefault();
        e.stopPropagation();
        
        const parentLi = this.closest('li.dropdown');
        if (parentLi) {
          const childUl = parentLi.querySelector('ul');
          if (childUl) {
            childUl.classList.toggle('dropdown-active');
          }
          this.classList.toggle('bi-chevron-down');
          this.classList.toggle('bi-chevron-up');
        }
      }
    });
  });

  // Close mobile nav when clicking a link
  document.querySelectorAll('#navmenu a').forEach(link => {
    link.addEventListener('click', function(e) {
      // Don't close if they clicked a dropdown toggle icon specifically
      if (e.target.classList.contains('toggle-dropdown')) {
        return;
      }
      
      const body = document.querySelector('body');
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        if (mobileNavToggleBtn) {
          mobileNavToggleBtn.classList.add('bi-list');
          mobileNavToggleBtn.classList.remove('bi-x');
        }
      }
    });
  });

  // Initialize AOS (Animate on Scroll)
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  console.log('My Village website loaded successfully!');

})();