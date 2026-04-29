'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const menu = document.querySelector('.menu');
  const overlay = document.querySelector('.overlay');

  function addBodyStyles() {
    document.body.style.overflow = 'hidden';
  }

  function removeBodyStyles() {
    document.body.style.overflow = '';
  }

  function openMenu() {
    menu.classList.add('menu_active');
    burger.classList.add('burger_active');
    overlay.classList.add('overlay_active');
    addBodyStyles();
  }

  function closeMenu() {
    menu.classList.remove('menu_active');
    burger.classList.remove('burger_active');
    overlay.classList.remove('overlay_active');
    removeBodyStyles();
  }

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('menu_active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('menu_active')) return;
    if (e.target.closest('.menu') || e.target.closest('.burger')) return;
    closeMenu();
  });

  if (typeof Swiper !== 'undefined' && document.querySelector('.about__slider')) {
    new Swiper('.about__slider', {
      slidesPerView: 'auto',
      spaceBetween: 16,
      freeMode: true,
      grabCursor: true,
      breakpoints: {
        769: {
          spaceBetween: 20,
        },
      },
    });
  }
});