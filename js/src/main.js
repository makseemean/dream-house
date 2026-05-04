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

  initAboutMarquee();
  initServicesAccordion();
  initProjectsAccordion();
});

function initProjectsAccordion() {
  const items = document.querySelectorAll('.projects__item');
  if (!items.length) return;

  items.forEach((item) => {
    const head = item.querySelector('.projects__item-head');
    const body = item.querySelector('.projects__item-body');
    if (!head || !body) return;

    head.addEventListener('click', () => {
      const isActive = item.classList.contains('projects__item_active');

      items.forEach((other) => {
        other.classList.remove('projects__item_active');
        const otherBody = other.querySelector('.projects__item-body');
        if (otherBody) otherBody.style.maxHeight = '';
      });

      if (!isActive) {
        item.classList.add('projects__item_active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

function initServicesAccordion() {
  const items = document.querySelectorAll('.services__item');
  if (!items.length) return;

  items.forEach((item) => {
    const head = item.querySelector('.services__head');
    const body = item.querySelector('.services__body');
    if (!head || !body) return;

    head.addEventListener('click', () => {
      const isActive = item.classList.contains('services__item_active');

      items.forEach((other) => {
        other.classList.remove('services__item_active');
        const otherBody = other.querySelector('.services__body');
        if (otherBody) otherBody.style.maxHeight = '';
      });

      if (!isActive) {
        item.classList.add('services__item_active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}

function initAboutMarquee() {
  const slider = document.querySelector('.about__slider');
  if (!slider) return;
  const track = slider.querySelector('.about__track');
  if (!track) return;

  const originals = Array.from(track.children);
  if (!originals.length) return;

  const PX_PER_SECOND = 24;

  function build() {
    track.querySelectorAll('[data-marquee-clone]').forEach((el) => el.remove());

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const originalsWidth = originals.reduce(
      (sum, el) => sum + el.getBoundingClientRect().width,
      0,
    ) + gap * originals.length;

    const minTrackWidth = slider.clientWidth * 2 + originalsWidth;
    let cycles = 1;
    while (originalsWidth * (cycles + 1) < minTrackWidth) cycles++;

    for (let i = 0; i < cycles; i++) {
      originals.forEach((el) => {
        const clone = el.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.dataset.marqueeClone = 'true';
        track.appendChild(clone);
      });
    }

    track.style.setProperty('--marquee-distance', `${originalsWidth}px`);
    track.style.setProperty('--marquee-duration', `${originalsWidth / PX_PER_SECOND}s`);
  }

  function whenImagesReady(cb) {
    const imgs = track.querySelectorAll('img');
    if (!imgs.length) return cb();
    let pending = 0;
    imgs.forEach((img) => {
      if (img.complete) return;
      pending++;
      const done = () => {
        pending--;
        img.removeEventListener('load', done);
        img.removeEventListener('error', done);
        if (pending === 0) cb();
      };
      img.addEventListener('load', done);
      img.addEventListener('error', done);
    });
    if (pending === 0) cb();
  }

  whenImagesReady(build);

  let resizeTimer;
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
}