'use strict';
document.querySelector('.nojs').classList.remove('nojs');

// util
(function () {
  const DESKTOP_WIDTH = 1024;

  const KeyBoardKey = {
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    ESCAPE_IE: 'Esc',
  }

  function isEnterKey (evt) {
    return evt.key === KeyBoardKey.ENTER;
  }

  function isEscKey (evt) {
    return evt.key === KeyBoardKey.ESCAPE
    || evt.key === KeyBoardKey.ESCAPE_IE;
  }

  window.util = {
    isEnterKey: isEnterKey,
    isEscKey: isEscKey,
    DESKTOP_WIDTH: DESKTOP_WIDTH,
  }
}());

// form login
(function () {
  const popupLogin = document.querySelector('.popup--login');
  const buttonLogin = document.querySelector('.header__authorized');
  const popupButtonClose = popupLogin.querySelector('.popup__button-close');
  const popupBackground = popupLogin.querySelector('.popup__background');
  const popupInputPassword = popupLogin.querySelector('#login-password');
  const popupInputLogin = popupLogin.querySelector('#user-login');
  const popupButtonShowPass = popupLogin.querySelector('.popup__show-pass');
  const popupForm = popupLogin.querySelector('form');

  let isStorageSupport = true;
  var storageLogin = '';

  try {
    storageLogin = localStorage.getItem('login');
  } catch (err) {
    isStorageSupport = false;
  };

  function onPopupButtonClick (evt) {
    evt.preventDefault();
    popupLogin.classList.remove('popup--active');
  };

  function onPopupButtonEscPress (evt) {
    if (window.util.isEscKey(evt)) {
      if (popupLogin.classList.contains('popup--active')) {
        popupLogin.classList.remove('popup--active');
        window.removeEventListener('keydown', onPopupButtonEscPress);
      }
    }
  };

  function onBodyClick () {
    popupLogin.classList.remove('popup--active');
  };

  function onButtonShowPass (evt) {
    evt.preventDefault();
    popupInputPassword.setAttribute('type', 'text');
  };

  function onButtonHidePass (evt) {
    evt.preventDefault();
    popupInputPassword.setAttribute('type', 'password');
  };

  buttonLogin.addEventListener('click', function (evt) {
    evt.preventDefault();
    popupLogin.classList.add('popup--active');

    if (storageLogin) {
      popupInputLogin.value = storageLogin;
      popupInputPassword.focus();
    } else {
      popupInputLogin.focus();
    }
  });

  popupForm.addEventListener('submit', function () {
    if (isStorageSupport) {
      localStorage.setItem('login', popupInputLogin.value);
    }
  });


  popupButtonClose.addEventListener('click', onPopupButtonClick);
  popupBackground.addEventListener('click', onBodyClick);
  window.addEventListener('keydown', onPopupButtonEscPress);

  popupButtonShowPass.addEventListener('mousedown', onButtonShowPass);
  popupButtonShowPass.addEventListener('mouseup', onButtonHidePass);
}());

// nav
const nav = document.querySelector('.header__nav');
const buttonShowNav = document.querySelector('.header__button');

buttonShowNav.addEventListener('click', function () {
  nav.classList.toggle('header__nav--active');
});

// servises
const services = document.querySelector('.services');
const servisesItems = services.querySelectorAll('.services__item');

let removeClass = function (element) {
  if (element.classList.contains('services__item--active')) {
    element.classList.remove('services__item--active');
  }
};

if (window.innerWidth >= window.util.DESKTOP_WIDTH) {
  const swiperWrapper = services.querySelector('.swiper-wrapper');
  const swiperSlide = services.querySelectorAll('.swiper-slide');

  services.classList.remove('swiper-container');
  swiperWrapper.classList.remove('swiper-wrapper');
  swiperSlide.forEach(function (element) {
    element.classList.remove('swiper-slide');
  });
};

servisesItems.forEach(function (element) {
  let buttonTab = element.querySelector('.services__tab');
  buttonTab.addEventListener('click', function () {
    servisesItems.forEach(removeClass);
    element.classList.add('services__item--active');
  });
});

// swiper
(function (){
  let mainSlider = new Swiper('#main-slider', {
    centeredSlides: true,
    loop: true,
    autoplay: {
      delay: 4000, //4 sec
      disableOnInteraction: false,
    },
    pagination: {
      el: '.main-slider__pagination',
      clickable: true,
    },
  });

  if (window.innerWidth < window.util.DESKTOP_WIDTH) {
    let servicesSwiper = new Swiper('#servises-slider', {
      centeredSlides: true,
      loop: true,
      pagination: {
        el: '.services__pagination',
        clickable: true,
      },
    });
  }
}());
