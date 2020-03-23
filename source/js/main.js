'use strict';
document.querySelector('.nojs').classList.remove('nojs');

// UTIL
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

//----------------------------------------------------------
// FORM LOGIN
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

//----------------------------------------------------------
// NAV
const nav = document.querySelector('.header__nav');
const buttonShowNav = document.querySelector('.header__button');

buttonShowNav.addEventListener('click', function () {
  nav.classList.toggle('header__nav--active');
});

//----------------------------------------------------------
// SERVICE
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

//----------------------------------------------------------
// RANGE
(function (){
  const calculatorBlock = document.querySelector('.calculator');
  const calculatorForm = calculatorBlock.querySelector('form');

  let RangeSizes = {
    min: 0,
    max: calculatorForm.offsetWidth,
  };

  function hendlerRange (block, callBack) {
    const rangeBlock = block.querySelector('.range');
    const rangeHendler = block.querySelector('.range__handle');
    const rangeProgressive = block.querySelector('.range__progress');

    rangeHendler.addEventListener('mousedown', function(evt) {
      evt.preventDefault();

      RangeSizes.max = rangeBlock.offsetWidth;
      let startCord = evt.clientX;

      function onMouseMove (moveEvt) {
        moveEvt.preventDefault();

        let shift = startCord - moveEvt.clientX;
        let result = rangeHendler.offsetLeft - shift;

        startCord = moveEvt.clientX;

        if (result >= RangeSizes.min
        && result <= RangeSizes.max) {
          rangeHendler.style.left = result + 'px';
          rangeProgressive.style.width = result + 'px';

          callBack(result);
        };
      };

      function onMouseUp (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
      };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp, {once: true});
    });
  };

  function resetRanges () {
    const ranges = calculatorBlock.querySelectorAll('.range');

    ranges.forEach(function(range) {
      const rangeHendler = range.querySelector('.range__handle');
      const rangeProgressive = range.querySelector('.range__progress');

      rangeHendler.style.left = 0 + 'px';
      rangeProgressive.style.width = 0 + 'px';
    });
  };

  window.range = {
    hendlerRange: hendlerRange,
    resetRanges: resetRanges,
    calculatorForm: calculatorForm,
    calculatorBlock: calculatorBlock,
    RangeSizes: RangeSizes,
  };
}());

//----------------------------------------------------------
// CALCULATOR
(function (){
  const RESTRICTION = {
    mortgage: {
      cost: {min: 1200000, max: 25000000},
      stepButton: 100000,
      initialStyle: 'display: block',
      minPercent: 0.1, // 10%
      percentStep: 5,
      term: {min: 5, max: 30},
      checkbox: [470000],
      minSum: 500000,
      interestRate: {
        initlFeePerc: 0.15, //15%
        min: 0.085, //8.5%
        max: 0.094 //9.4%,
      },
    },
    auto: {
      cost: {min: 500000, max: 5000000},
      stepButton: 50000,
      initialStyle: 'display: block',
      minPercent: 0.2, // 20%
      percentStep: 5,
      term: {min: 1, max: 5},
      checkbox: [0.085, 0.035], // 8.5%, 3.5%
      minSum: 200000,
      interestRate: {
        minCost: 2000000,
        min: 0.15, //15%
        max: 0.16, //16%
      },
    },
    consumer: {
      cost: {min: 50000, max: 3000000},
      stepButton: 50000,
      initialStyle: 'display: none',
      term: {min: 1, max: 7},
      checkbox: [0.005], //0.5%
      interestRate: {
        minCost: 750000,
        maxCost: 2000000,
        min: 0.095, //9.5%
        middle: 0.125, //12.5%
        max: 0.15, //15%
      },
    },
  };

  const calculatorForm = window.range.calculatorForm;

  const popupOffer = window.range.calculatorBlock.querySelector('.popup--offer');
  const calculatorSelect = calculatorForm.querySelector('.calculator__select');
  const rangeValue = calculatorForm.querySelector('.range__value');
  const stepTwoBlock = calculatorForm.querySelector('.calculator__item');
  const initialBlock = calculatorForm.querySelector('.calculator__container--initial');
  const termBlock = calculatorForm.querySelector('.calculator__container--term');

  const inputRadioList = calculatorForm.querySelectorAll('input[type=radio]');
  const inputFields = calculatorForm.querySelectorAll('input[type=text]');
  const inputSelect = calculatorForm.querySelector('#select');
  const inputInitial = calculatorForm.querySelector('#initial');
  const inputCost = calculatorForm.querySelector('#cost');
  const inputTerm = calculatorForm.querySelector('#term');

  const labelCheckboxs = calculatorForm.querySelectorAll('.calculator__checkbox');

  const offerErrTitle = window.range.calculatorBlock.querySelector('.offer__title--error');
  const offerSpanSum = window.range.calculatorBlock.querySelector('.offer__span--sum');

  const spanCheckboxs = calculatorForm.querySelectorAll('.calculator__checkbox-text');
  const spanCost = calculatorForm.querySelector('.calculator__span--cost');
  const spanHintCost = calculatorForm.querySelector('.calculator__hint--cost');
  const spanHintTermMin = calculatorForm.querySelector('.calculator__hint--term-min');
  const spanHintTermMax = calculatorForm.querySelector('.calculator__hint--term-max');

  const buttonMinus = calculatorForm.querySelector('.calculator__button-count--minus');
  const buttonPlus = calculatorForm.querySelector('.calculator__button-count--plus');

  // from '5 000 000 рублей' - string, to '5000000' - number
  function convertInputValue (value) {
    let arr = value.split(' ');
    if (arr.length === 1) {
      return +arr.join('')
    };

    arr.splice(arr.length - 1, 1);
    return +arr.join('');
  };

  // from 5000000 to 5 000 000
  function addSpaces (str) {
    return str.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
  };

  function convertBackValue (one, two, five) {
    return function (value) {
      value = String(value);
      return addSpaces(value) + window.util.pluralize(value, one, two, five);
    };
  };

  let convetBackRubl = convertBackValue(' рубль', ' рубля', ' рублей');
  let convetBackYers = convertBackValue(' год', ' года', ' лет');

  function showSelect (inputRadio) {
    inputRadio.addEventListener('click', function() {
      calculatorSelect.classList.toggle('calculator__select--active');
    });
  };

  function getValueInput (input, defaultValue, convert) {
    input.type = 'text';
    if (input.value === '') {
      input.value = defaultValue;
    }
    input.value = convert(input.value);
    return input.value;
  };

  function upDateinputInitial (costValue) {
    let value = convertInputValue(costValue);
    let percent = Math.floor(value * getCurrentPercent() / 100);

    if (!value) {
      return inputInitial.value = convetBackRubl(0);
    }

    inputInitial.value = convetBackRubl(percent);
    getCurrentPercent();
  };

  function getErrorMessage (input) {
    input.type = 'text';
    return input.value = 'Не коректное значение';
  };

  function getCurrentPercent () {
    let percent = rangeValue.textContent;
    return +percent.slice(0, -1);
  };

  function checkCostValue () {
    let id =  window.selectCheckedId;

    if (+inputCost.value <= RESTRICTION[id].cost.max
     && +inputCost.value >= RESTRICTION[id].cost.min
      || inputCost.value === '') {
        return true;
      };
    return false;
  };

  function checkInitialValue () {
    let id =  window.selectCheckedId;
    let cost = convertInputValue(inputCost.value);
    let costPercent = cost * RESTRICTION[id].minPercent;

    if (+inputInitial.value >= costPercent
     && +inputInitial.value <= cost
      || inputInitial.value === '') {
        return true;
      };
    return false;
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
    if (inputSelect.checked) {
      stepTwoBlock.classList.remove('calculator__item--active');
      togglePopup(popupOffer, false);
    } else {
      stepTwoBlock.classList.add('calculator__item--active');
      togglePopup(popupOffer, true);
    }
  };

  function fillCheckboxText (span) {
    span.textContent = span.dataset[window.selectCheckedId];
  };

  function showCheckbox () {
    let id = window.selectCheckedId;

    let checkboxs = RESTRICTION[id].checkbox;
    labelCheckboxs.forEach(function (label, i) {
      checkboxs[i] ? label.style = label.style = 'display: block' : label.style = 'display: none';
    });
  };

  function fillEntryField (inputRadio) {
    inputRadio.addEventListener('change', function() {
      window.selectCheckedId = calculatorForm.querySelector('input[type=radio]:checked').id;

      if (selectCheckedId === 'select') { return; };

      inputCost.value = inputCost.dataset[selectCheckedId];
      inputCost.min = RESTRICTION[selectCheckedId].cost.min;
      inputCost.max = RESTRICTION[selectCheckedId].cost.max;
      inputInitial.value = inputInitial.dataset[selectCheckedId];
      inputTerm.value = inputTerm.dataset[selectCheckedId];
      initialBlock.style = RESTRICTION[selectCheckedId].initialStyle;

      spanCheckboxs.forEach(fillCheckboxText);
      spanCost.textContent = spanCost.dataset[selectCheckedId];
      spanHintCost.textContent = spanHintCost.dataset[selectCheckedId];
      spanHintTermMin.textContent = spanHintTermMin.dataset[selectCheckedId];
      spanHintTermMax.textContent = spanHintTermMax.dataset[selectCheckedId];

      offerErrTitle.textContent = offerErrTitle.dataset[selectCheckedId];
      offerSpanSum.textContent = offerSpanSum.dataset[selectCheckedId];

      window.range.resetRanges();
      showCheckbox();
    });
  };

  function calculateCost (result) {
    let percentCost = Math.floor(result/window.range.RangeSizes.max * 100);
    let id =  window.selectCheckedId;
    if (percentCost % RESTRICTION[id].percentStep === 0
     && percentCost >= RESTRICTION[id].minPercent) {

      rangeValue.textContent = percentCost + '%';
      let cost = convertInputValue(inputCost.value);
      let total = String(Math.floor((cost * percentCost) / 100));
      inputInitial.value = convetBackRubl(total);
    };
  };

  function changeTerm (result) {
    let id =  window.selectCheckedId;
    let fraction = Math.floor(window.range.RangeSizes.max / (RESTRICTION[id].term.max - RESTRICTION[id].term.min));
    let total = Math.floor(result / fraction + RESTRICTION[id].term.min);
    inputTerm.value = convetBackYers(total);
  };

  function increasNumber (value) {
    let id = window.selectCheckedId;
    let difference = RESTRICTION[id].cost.max - value;

    if (RESTRICTION[id].cost.max > value
     && RESTRICTION[id].stepButton < difference) {
      return value += RESTRICTION[id].stepButton;
    } else if (RESTRICTION[id].cost.max > value
            && RESTRICTION[id].stepButton >= difference) {
      return value += difference;
    }
    return value;
  };

  function reducesNumber (value) {
    let id = window.selectCheckedId;
    let difference = value - RESTRICTION[id].cost.min;

    if (RESTRICTION[id].cost.min < value
     && RESTRICTION[id].stepButton < difference) {
      return value -= RESTRICTION[id].stepButton;
    } else if (RESTRICTION[id].cost.min < value
            && RESTRICTION[id].stepButton >= difference) {
      return value -= difference;
    }
    return value;
  };

  // events

  function onFormChange () {
    showStepTwoBlock();
    setTimeout(window.offer.fillOffer, 1);
  };

  function onInputTextFocus (evt) {
    let input = evt.target;
    input.type = 'number';
  };

  function onInputCostFocusout () {
    let id = window.selectCheckedId;
    let defaultValue = RESTRICTION[id].cost.min;
    let flag = checkCostValue();

    flag ? getValueInput(inputCost, defaultValue, convetBackRubl) : getErrorMessage(inputCost);

    upDateinputInitial(inputCost.value);
  };

  function onInputInitialFocusout (evt) {
    let id = window.selectCheckedId;

    let cost = convertInputValue(inputCost.value);
    let defaultValue = cost * RESTRICTION[id].minPercent;
    let flag = checkInitialValue();

    if (flag) {
      getValueInput(evt.target, defaultValue, convetBackRubl);
    } else {
      inputInitial.type = 'text';
      inputInitial.value = convetBackRubl(defaultValue);
    };
  };

  function onInputTermFocusout (evt) {
    let id = window.selectCheckedId;
    let defaultValue = RESTRICTION[id].term.min;
    let value = +inputTerm.value;

    if (value < RESTRICTION[id].term.min && value !== 0) {
      inputTerm.type= 'text';
      inputTerm.value = convetBackYers(RESTRICTION[id].term.min);
    } else if (value > RESTRICTION[id].term.max) {
      inputTerm.type= 'text';
      inputTerm.value = convetBackYers(RESTRICTION[id].term.max);
    } else {
      getValueInput(inputTerm, defaultValue, convetBackYers);
    };
  };

  function onButtonCounter (evt) {
    evt.preventDefault();
    let button = evt.target;
    let costValue = convertInputValue(inputCost.value);

    if (button.id === 'button-minus') {
      costValue = String(reducesNumber(costValue));
    } else {
      costValue = String(increasNumber(costValue));
    };

    inputCost.value = convetBackRubl(costValue);
  };

  window.range.hendlerRange(initialBlock, calculateCost);
  window.range.hendlerRange(termBlock, changeTerm);

  inputFields.forEach(function (input) {
    input.addEventListener('focus', onInputTextFocus);
  });

  inputCost.addEventListener('focusout', onInputCostFocusout);
  inputInitial.addEventListener('focusout', onInputInitialFocusout);
  inputTerm.addEventListener('focusout', onInputTermFocusout)

  inputRadioList.forEach(showSelect);
  inputRadioList.forEach(fillEntryField);

  buttonPlus.addEventListener('click', onButtonCounter);
  buttonMinus.addEventListener('click', onButtonCounter);

  calculatorForm.addEventListener('change', onFormChange);

  window.calculator = {
    RESTRICTION: RESTRICTION,
    inputInitial: inputInitial,
    inputCost, inputCost,
    convertInputValue: convertInputValue,
    convetBackRubl: convetBackRubl,
  };
}());

//----------------------------------------------------------
// OFFER

(function (){
  const RESTRICTION = window.calculator.RESTRICTION;
  const offerBlock = window.range.calculatorBlock.querySelector('.offer');
  const offerError = window.range.calculatorBlock.querySelector('.offer--error');
  const offerSum = offerBlock.querySelector('#offer-sum');
  const offerInterestRate = offerBlock.querySelector('#offer-Interest-Rate');
  let firstCheckbox = window.range.calculatorForm.querySelector('input[type=checkbox]');

  let convertInputValue = window.calculator.convertInputValue;
  let cost = window.calculator.inputCost;
  let initial = window.calculator.inputInitial;

  // from 0.094 - number, to '9,40' - string
  function convertPercent (percent) {
  	return String((percent * 100).toFixed(2)).replace('.', ',');
  };

  function showOfferError (bolean) {
    if (bolean) {
      offerBlock.classList.add('offer--hidden');
      offerError.classList.remove('offer--hidden');
    } else {
      offerBlock.classList.remove('offer--hidden');
      offerError.classList.add('offer--hidden');
    };
  };

  function calculateSum () {
    let id = window.selectCheckedId;
    let costValue = convertInputValue(cost.value);
    let initialValue = convertInputValue(initial.value);
    if (id === 'consumer') {
      return costValue;
    }
    return costValue - initialValue;
  };

  function checkSum (sum) {
    if (selectCheckedId === 'select') { return };

    let id = window.selectCheckedId;
    let minSum = RESTRICTION[id].minSum;
    let result = sum < minSum ? true : false;

    return result;
  };

  function getInterestRateMorgage () {
    let costValue = convertInputValue(cost.value);
    let initialValue = convertInputValue(initial.value);
    let percent = Math.floor(initialValue / costValue * 100);
    percent /= 100;

    if (percent < RESTRICTION.mortgage.interestRate.initlFeePerc) {
      return RESTRICTION.mortgage.interestRate.max;
    };
    return RESTRICTION.mortgage.interestRate.min;
  };

  function getInterestRateAuto () {
    let costValue = convertInputValue(cost.value);
    let checkboxs = window.range.calculatorForm.querySelectorAll('input[type=checkbox]:checked');
    let percent;

    if (costValue < RESTRICTION.auto.interestRate.minCost) {
      percent = RESTRICTION.auto.interestRate.max;
    } else {
      percent = RESTRICTION.auto.interestRate.min;
    };

    for (let i = 0; i < checkboxs.length; i++) {
      percent = Math.floor((percent - RESTRICTION.auto.checkbox[i]) * 100);
      percent /= 100;
    };
    return percent;
  };

  function getInterestRateConsumer () {
    let costValue = convertInputValue(cost.value);

    let interestRate = RESTRICTION.consumer.interestRate;
    let percent;
    if (costValue < interestRate.minCost) {
      percent = interestRate.max;
    } else if (costValue >= interestRate.minCost &&
               costValue < interestRate.maxCost  ) {
      percent = interestRate.middle;
    } else {
      percent = interestRate.min;
    }

    if (firstCheckbox.checked) {
      percent -= RESTRICTION.consumer.checkbox[0];
    };

    return percent;
  };

  function getInterestRate () {
    let id = window.selectCheckedId;
    let result = '';

    switch (id) {
      case 'mortgage' :
        result = getInterestRateMorgage();
        break;
      case 'auto' :
        result = getInterestRateAuto();
        break;
      case 'consumer' :
        result = getInterestRateConsumer();
        break;
    }

    return result;
  };

  function fillOffer () {
    let sum = calculateSum();
    showOfferError(checkSum(sum));
    offerSum.textContent = window.calculator.convetBackRubl(sum);
    offerInterestRate.textContent = convertPercent(getInterestRate());
  };

  window.offer = {
    fillOffer: fillOffer,
  }
}());

//----------------------------------------------------------
// SWIPER
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

//----------------------------------------------------------
// SMOTH-SCROLL
(function (){
  let scrollCalculator = new SmoothScroll('a[href*="#calculator"]');
});
