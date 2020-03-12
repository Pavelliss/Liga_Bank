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

  function pluralize (num, one, two, five) {
    let mod100 = Math.abs(num % 100);
    if (mod100 > 10 && mod100 < 20) {
      return five;
    }

    let mod10 = mod100 % 10;
    if (mod10 > 1 && mod10 < 5) {
      return two;
    }

    return mod10 === 1 ? one : five;
  };

  window.util = {
    isEnterKey: isEnterKey,
    isEscKey: isEscKey,
    DESKTOP_WIDTH: DESKTOP_WIDTH,
    pluralize: pluralize,
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
  const popupButtonShowPass = popupLogin.querySelector('.form-login__show-pass');
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

  function onButtonLoginClick (evt) {
    evt.preventDefault();
    popupLogin.classList.add('popup--active');

    if (storageLogin) {
      popupInputLogin.value = storageLogin;
      popupInputPassword.focus();
    } else {
      popupInputLogin.focus();
    }
  };

  buttonLogin.addEventListener('click', onButtonLoginClick);

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

// calculator
(function (){
  const FIELDS_UNITS = {
    'calculator-cost': ' рублей',
    'calculator-initial': ' рублей',
    'calculator-terms': ' лет',
  };

  const selectToStepTwo = {
    'select-mortgage': '.calculator__item--mortgage',
    'select-auto-loan': '.calculator__item--car-loans',
    'select-consumer': '.calculator__item--consumer-loan',
  };

  const calculatorBlock = document.querySelector('.calculator');
  const calculatorForm = calculatorBlock.querySelector('form');
  const inputRadioList = calculatorForm.querySelectorAll('input[type=radio]');
  const calculatorSelect = calculatorForm.querySelector('.calculator__select');
  const inputFields = calculatorForm.querySelectorAll('input[type=text]');
  const popupOffer = calculatorBlock.querySelector('.popup--offer');

  function showSelect (inputRadio) {
    inputRadio.addEventListener('click', function() {
      calculatorSelect.classList.toggle('calculator__select--active');
    });
  };

  function addSpaces (str) {
    return str.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  };

  function onInputTextFocusout (evt) {
    let input = evt.target;
    input.type = "text";
    if (input.value === '') {
      input.value = '0';
    }
    input.value = addSpaces(input.value) + FIELDS_UNITS[input.id];
  };

  function togglePopup (popup, flag) {
    if (!popup.classList.contains('popup--active')
      && flag === true) {
      popup.classList.add('popup--active');
    } else if (flag === false) {
      popup.classList.remove('popup--active');
    }
  };

  function showStepTwoBlock () {
    let stepTwoActiveBlock = calculatorForm.querySelector('.calculator__item--active');
    let selectChecked = calculatorForm.querySelector('input[type=radio]:checked');
    let stepTwoBlock = calculatorForm.querySelector(selectToStepTwo[selectChecked.id]);

    if (stepTwoActiveBlock) {
      stepTwoActiveBlock.classList.remove('calculator__item--active');
      togglePopup(popupOffer, false);
    };

    if (stepTwoBlock) {
      stepTwoBlock.classList.add('calculator__item--active');
      togglePopup(popupOffer, true);
    };
  };

  function onFormChange () {
    showStepTwoBlock();
  };

  inputFields.forEach(function (input) {
    input.addEventListener('focus', function() {
      input.type = 'number';
    });
    input.addEventListener('focusout', onInputTextFocusout);
  });

  inputRadioList.forEach(showSelect);

  calculatorForm.addEventListener('change', onFormChange);


  const rangeHendler = calculatorForm.querySelector('.range__handle');

  rangeHendler.addEventListener('mousedown', function(evt) {
    evt.preventDefault();

    let startCords = evt.clientX;

    function onMouseMove (moveEvt) {
      moveEvt.preventDefault();

      let shift = startCords - moveEvt.clientX;
      startCords = moveEvt.clientX;

      rangeHendler.style.left = (rangeHendler.offsetLeft - shift) + 'px';
    }

    function onMouseUp (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp, {once: true});
    //console.log('test');
  });
}());

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

// Smooth-Scroll
(function (){
  let scrollCalculator = new SmoothScroll('a[href*="#calculator"]');
});

