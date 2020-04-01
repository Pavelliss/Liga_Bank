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

  function togglePopup (popup, flag) {
    if (!popup.classList.contains('popup--active')
      && flag === true) {
      popup.classList.add('popup--active');
    } else if (flag === false) {
      popup.classList.remove('popup--active');
    }
  };

  window.util = {
    DESKTOP_WIDTH: DESKTOP_WIDTH,
    isEnterKey: isEnterKey,
    isEscKey: isEscKey,
    pluralize: pluralize,
    togglePopup: togglePopup,
  }
}());

//----------------------------------------------------------
// FORM LOGIN
(function () {
  const body = document.querySelector('body');
  const popupLogin = body.querySelector('.popup--login');
  const buttonLogin = body.querySelector('.header__authorized');
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
    body.classList.remove('body-popup');
  };

  function onPopupButtonEscPress (evt) {
    if (window.util.isEscKey(evt)) {
      if (popupLogin.classList.contains('popup--active')) {
        popupLogin.classList.remove('popup--active');
        body.classList.remove('body-popup');
        window.removeEventListener('keydown', onPopupButtonEscPress);
      }
    }
  };

  function onBodyClick () {
    popupLogin.classList.remove('popup--active');
    body.classList.remove('body-popup');
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
    body.classList.add('body-popup');

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

  function calcMinWidthInitial () {
    let id = window.selectCheckedId;
    return RangeSizes.max * window.calculator.RESTRICTION[id].minPercent;
  }

  function hendlerRange (block, callBack) {
    const rangeBlock = block.querySelector('.range');
    const rangeHendler = block.querySelector('.range__handle');
    const rangeProgressive = block.querySelector('.range__progress');

    rangeHendler.addEventListener('mousedown', function(evt) {
      evt.preventDefault();

      RangeSizes.max = rangeBlock.offsetWidth;
      RangeSizes.min = 0;

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

  function upDataRange (block, value) {
    const rangeHendler = block.querySelector('.range__handle');
    const rangeProgressive = block.querySelector('.range__progress');
    const rangeValue = block.querySelector('.range__value');

    if (rangeValue) { rangeValue.textContent = value + '%'};
    rangeHendler.style.left = value + '%';
    rangeProgressive.style.width = value + '%';
  };

  function resetRanges () {
    const ranges = calculatorBlock.querySelectorAll('.range');

    ranges.forEach(function(range) {
      const rangeHendler = range.querySelector('.range__handle');
      const rangeProgressive = range.querySelector('.range__progress');

      if (range.id === 'range-initial') {
        rangeHendler.style.left = calcMinWidthInitial() + 'px';
        rangeProgressive.style.width = calcMinWidthInitial() + 'px';
      } else {
        rangeHendler.style.left = 0 + 'px';
        rangeProgressive.style.width = 0 + 'px';
      };
    });
  };

  window.range = {
    hendlerRange: hendlerRange,
    resetRanges: resetRanges,
    calculatorForm: calculatorForm,
    calculatorBlock: calculatorBlock,
    RangeSizes: RangeSizes,
    upDataRange: upDataRange,
    calcMinWidthInitial: calcMinWidthInitial,
  };
}());

//----------------------------------------------------------
// CALCULATOR
(function (){
  const ERROR_MESSAGE = 'Не коректное значение';
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
      requiredIncome: 0.45, //45%
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
      requiredIncome: 0.45, //45%
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
      requiredIncome: 0.45, //45%
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
    let percent = getCurrentPercent();
    let fractionNum = Math.floor(costValue * percent / 100);

    if (!costValue) {
      return inputInitial.value = convetBackRubl(0);
    }

    inputInitial.value = convetBackRubl(fractionNum);
    percent = getCurrentPercent();
    window.inputsData.initial = fractionNum;
    window.range.upDataRange(initialBlock, percent);
  };

  function getErrorMessage (input) {
    input.type = 'text';
    return input.value = ERROR_MESSAGE;
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
    let costPercent = window.inputsData.cost * RESTRICTION[id].minPercent;

    if (+inputInitial.value >= costPercent
     && +inputInitial.value <= window.inputsData.cost
      || inputInitial.value === '') {
        return true;
      };
    return false;
  };

  function showStepTwoBlock () {
    if (inputSelect.checked) {
      stepTwoBlock.classList.remove('calculator__item--active');
      window.util.togglePopup(popupOffer, false);
    } else {
      stepTwoBlock.classList.add('calculator__item--active');
      window.util.togglePopup(popupOffer, true);
    }
  };

  function fillCheckboxText (span) {
    span.textContent = span.dataset[window.selectCheckedId];
  };

  function showCheckbox () {
    let id = window.selectCheckedId;

    let checkboxs = RESTRICTION[id].checkbox;
    labelCheckboxs.forEach(function (label, i) {
      checkboxs[i] ? label.classList.remove('calculator__checkbox--hidden') : label.classList.add('calculator__checkbox--hidden');
    });
  };

  function fillEntryField (inputRadio) {
    inputRadio.addEventListener('change', function() {
      window.selectCheckedId = calculatorForm.querySelector('input[type=radio]:checked').id;
      window.util.togglePopup(window.offer.formPopup, false);

      if (selectCheckedId === 'select') { return; };

      inputCost.value = inputCost.dataset[selectCheckedId];
      inputCost.min = RESTRICTION[selectCheckedId].cost.min;
      inputCost.max = RESTRICTION[selectCheckedId].cost.max;
      inputInitial.value = inputInitial.dataset[selectCheckedId];
      inputTerm.value = inputTerm.dataset[selectCheckedId];
      initialBlock.style = RESTRICTION[selectCheckedId].initialStyle;

      rangeValue.textContent = rangeValue.dataset[selectCheckedId];

      spanCheckboxs.forEach(fillCheckboxText);
      spanCost.textContent = spanCost.dataset[selectCheckedId];
      spanHintCost.textContent = spanHintCost.dataset[selectCheckedId];
      spanHintTermMin.textContent = spanHintTermMin.dataset[selectCheckedId];
      spanHintTermMax.textContent = spanHintTermMax.dataset[selectCheckedId];

      offerErrTitle.textContent = offerErrTitle.dataset[selectCheckedId];
      offerSpanSum.textContent = offerSpanSum.dataset[selectCheckedId];

      window.inputsData = upDateInpusts()
      window.range.resetRanges();
      showCheckbox();
    });
  };

  function calculateCost (result) {
    let percentCost = Math.floor(result / window.range.RangeSizes.max * 100);
    let id =  window.selectCheckedId;
    window.range.RangeSizes.min = window.range.calcMinWidthInitial();
    if (percentCost % RESTRICTION[id].percentStep === 0
     && percentCost >= RESTRICTION[id].minPercent) {

      rangeValue.textContent = percentCost + '%';
      let total = String(Math.floor((window.inputsData.cost * percentCost) / 100));
      inputInitial.value = convetBackRubl(total);

      window.inputsData.initial = +total;
      window.offer.reRenderOffer();
    };
  };

  function changeTerm (result) {
    let id =  window.selectCheckedId;
    let fraction = Math.round(window.range.RangeSizes.max / (RESTRICTION[id].term.max - RESTRICTION[id].term.min));

    let total = Math.round(result / fraction + RESTRICTION[id].term.min);
    inputTerm.value = convetBackYers(total);

    window.inputsData.term = +total;
    window.offer.reRenderOffer();
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

  function upDateInpusts () {
    let inputValue = {};
    inputFields.forEach(function (input) {
      let inputId = input.id;
      inputValue[inputId] = convertInputValue(input.value);
    });

    return inputValue;
  };

  // events

  function onFormChange () {
    showStepTwoBlock();
    setTimeout(window.offer.fillOffer, 1);
  };

  function onInputTextFocus (evt) {
    let input = evt.target;
    let value = convertInputValue(input.value);
    input.type = 'number';
    input.value = value;
  };

  function onInputCostFocusout () {
    let id = window.selectCheckedId;
    let defaultValue = RESTRICTION[id].cost.min;
    let flag = checkCostValue();

    flag ? getValueInput(inputCost, defaultValue, convetBackRubl) : getErrorMessage(inputCost);

    window.inputsData = upDateInpusts();
    upDateinputInitial(window.inputsData.cost);
  };

  function onInputInitialFocusout (evt) {
    let id = window.selectCheckedId;

    let defaultValue = window.inputsData.cost * RESTRICTION[id].minPercent;
    let flag = checkInitialValue();

    if (flag) {
      getValueInput(evt.target, defaultValue, convetBackRubl);
    } else {
      inputInitial.type = 'text';
      inputInitial.value = convetBackRubl(defaultValue);
    };

    window.inputsData = upDateInpusts();

    let percentRange = ((window.inputsData.initial / window.inputsData.cost) * 100).toFixed(0);
    window.range.upDataRange(initialBlock, percentRange);
  };

  function onInputTermFocusout (evt) {
    let id = window.selectCheckedId;
    let defaultValue = RESTRICTION[id].term.min;
    let value = +inputTerm.value;

    if (value < RESTRICTION[id].term.min && value !== '0') {
      inputTerm.type= 'text';
      inputTerm.value = convetBackYers(RESTRICTION[id].term.min);

      window.range.upDataRange(termBlock, 0);
      window.inputsData.term = RESTRICTION[id].term.min;
    } else if (value > RESTRICTION[id].term.max) {
      inputTerm.type= 'text';
      inputTerm.value = convetBackYers(RESTRICTION[id].term.max);
      window.range.upDataRange(termBlock, 100);
      window.inputsData.term = RESTRICTION[id].term.max;
    } else {
      let percentRange = ((value - RESTRICTION[id].term.min) / (RESTRICTION[id].term.max - RESTRICTION[id].term.min)) * 100;

      getValueInput(inputTerm, defaultValue, convetBackYers);
      window.range.upDataRange(termBlock, percentRange);
      window.inputsData.term = value;
    };
  };

  function onButtonCounterClick (evt) {
    evt.preventDefault();
    window.inputsData = upDateInpusts();

    let button = evt.target;
    let costValue = window.inputsData.cost;

    if (button.id === 'button-minus') {
      costValue = String(reducesNumber(costValue));
    } else {
      costValue = String(increasNumber(costValue));
    };

    inputCost.value = convetBackRubl(costValue);
    window.inputsData.cost = costValue;
    upDateinputInitial(window.inputsData.cost);
    window.inputsData = upDateInpusts();

    window.offer.reRenderOffer();
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

  buttonPlus.addEventListener('click', onButtonCounterClick);
  buttonMinus.addEventListener('click', onButtonCounterClick);

  calculatorForm.addEventListener('change', onFormChange);

  window.calculator = {
    RESTRICTION: RESTRICTION,
    inputInitial: inputInitial,
    inputCost: inputCost,
    inputTerm: inputTerm,
    stepTwoBlock: stepTwoBlock,
    popupOffer: popupOffer,
    convertInputValue: convertInputValue,
    convetBackRubl: convetBackRubl,
    convetBackYers:convetBackYers,
    upDateInpusts: upDateInpusts,
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
  const offerMonthlyPayment = offerBlock.querySelector('#monthly-payment');
  const offerRequiredIncome = offerBlock.querySelector('#required-income');
  const firstCheckbox = window.range.calculatorForm.querySelector('input[type=checkbox]');
  const offerButton = offerBlock.querySelector('.offer__button');
  const formPopup = window.range.calculatorBlock.querySelector('.popup--form-request');

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
    let total = window.inputsData.cost;

    if (id === 'consumer') {
      return total;
    }

    if (id === 'mortgage' && firstCheckbox.checked) {
      total -= RESTRICTION.mortgage.checkbox[0];
    }

    return total - window.inputsData.initial;
  };

  function checkSum (sum) {
    if (selectCheckedId === 'select') { return };

    let id = window.selectCheckedId;
    let minSum = RESTRICTION[id].minSum;
    let result = sum < minSum ? true : false;

    return result;
  };

  function getInterestRateMorgage () {
    let percent = Math.floor(window.inputsData.initial / window.inputsData.cost * 100);
    percent /= 100;

    if (percent < RESTRICTION.mortgage.interestRate.initlFeePerc) {
      return RESTRICTION.mortgage.interestRate.max;
    };

    return RESTRICTION.mortgage.interestRate.min;
  };

  function getInterestRateAuto () {
    let checkboxs = window.range.calculatorForm.querySelectorAll('input[type=checkbox]:checked');
    let percent;

    if (window.inputsData.cost < RESTRICTION.auto.interestRate.minCost) {
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
    let costValue = window.inputsData.cost;

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

  function calcMonthlyPayment () {
    let sumMonth = window.inputsData.term * 12;
    let monthlyInterestRate = getInterestRate() / 12;

    return Math.floor((calculateSum() * monthlyInterestRate) / (1 - (1 / (1 + monthlyInterestRate) ** sumMonth)));
  };

  function calcRequiredIncome (monthlyPayment) {
    let id = window.selectCheckedId;
    if (id === 'select') { return };
    return Math.floor(monthlyPayment / RESTRICTION[id].requiredIncome);
  };

  function fillOffer () {
    let sum = calculateSum();
    let monthlyPayment = calcMonthlyPayment();
    let requiredIncome = calcRequiredIncome(monthlyPayment);

    showOfferError(checkSum(sum));

    offerSum.textContent = window.calculator.convetBackRubl(sum);
    offerInterestRate.textContent = convertPercent(getInterestRate());
    offerMonthlyPayment.textContent = window.calculator.convetBackRubl(monthlyPayment);
    offerRequiredIncome.textContent = window.calculator.convetBackRubl(requiredIncome);
  };

  function reRenderOffer () {
    window.inputsData = window.calculator.upDateInpusts();
    console.log(window.inputsData);
    fillOffer();
    window.util.togglePopup(formPopup, false);
  };

  offerButton.addEventListener('click', function(evt) {
    evt.preventDefault();
    window.formRequest.fullForm();
    window.util.togglePopup(formPopup, true);
  });

  window.offer = {
    formPopup: formPopup,
    fillOffer: fillOffer,
    reRenderOffer: reRenderOffer,
  }
}());

// FORM REQUEST
(function (){
  const formPopup = window.offer.formPopup;
  const loanPurpose = formPopup.querySelector('#loan-purpose');
  const spanCost = formPopup.querySelector('#span-cost');
  const inputUserName = formPopup.querySelector('#user-name');
  const inputUserPhone = formPopup.querySelector('#telephone-number');
  const inputUserEmail = formPopup.querySelector('#user-email');
  const inputCost = formPopup.querySelector('#request-cost');
  const inputCounter = formPopup.querySelector('#request-number');
  const inputInitial = formPopup.querySelector('#initial-fee');
  const inputTerm = formPopup.querySelector('#loan-term');
  const buttonSubmit = formPopup.querySelector('.form-request__button');
  const popupSuccessfully = window.range.calculatorBlock.querySelector('.popup--successfully');
  const popupButtonClose = popupSuccessfully.querySelector('.popup__button-close');
  const form = window.range.calculatorBlock.querySelector('#form-calculator');

  // from 11, to 0011
  function converRequestNumber (num) {
    num += '';
    while (num.length < 4) {
      num = '0' + num;
    }
    return num;
  };

  function resetForm () {
    window.util.togglePopup(popupSuccessfully, false);
    window.util.togglePopup(window.calculator.popupOffer, false);
    window.calculator.stepTwoBlock.classList.remove('calculator__item--active');
    form.reset();
  };

  function onButtonCloseClick (evt) {
    evt.preventDefault();
    resetForm();
  };

  function onPopupButtonEscPress (evt) {
    if (window.util.isEscKey(evt)) {
      resetForm();
      window.removeEventListener('keydown', onPopupButtonEscPress);
    }
  };

  function increasesCounter (num) {
    num = +num;
    return num += 1;
  };

  let storage = {
    counter: '',
    userName: '',
    userEmail: '',
    userPhone: '',
    support: false,
  };

  try {
    storage.counter = localStorage.getItem('counter');
    storage.userName = localStorage.getItem('user-name');
    storage.userEmail = localStorage.getItem('user-email');
    storage.userEmail = localStorage.getItem('user-phone');
  } catch (err) {
    storage.support = false;
  };

  function fullForm () {
    let requestNum = increasesCounter(inputCounter.value);

    loanPurpose.value = loanPurpose.dataset[window.selectCheckedId];
    spanCost.textContent = spanCost.dataset[window.selectCheckedId];
    inputCounter.value = '№ ' + converRequestNumber(requestNum);
    inputCost.value = window.calculator.convetBackRubl(window.inputsData.cost);
    inputInitial.value = window.calculator.convetBackRubl(window.inputsData.initial);
    inputTerm.value = window.calculator.convetBackYers(window.inputsData.term);
  };

  function upDataStorage () {
    if (storage.support) {
      localStorage.setItem('counter', inputCounter.value);
      localStorage.setItem('user-name', inputUserName.value);
      localStorage.setItem('user-email', inputUserEmail.value);
      localStorage.setItem('user-phone', inputUserPhone.value);
    };
  };

  function onButtonSubmit (evt) {
    if (inputUserName.validity.valid
     && inputUserPhone.validity.valid
     && inputUserEmail.validity.valid ) {
      evt.preventDefault();
      upDataStorage();
      window.util.togglePopup(formPopup, false);
      window.util.togglePopup(popupSuccessfully, true);
    } else {
      formPopup.classList.remove('popup--form-error');
      formPopup.offsetWidth;
      formPopup.classList.add('popup--form-error');
    };
  };

  buttonSubmit.addEventListener('click', onButtonSubmit);
  popupButtonClose.addEventListener('click', onButtonCloseClick);
  window.addEventListener('keydown', onPopupButtonEscPress);

  window.formRequest = {
    fullForm: fullForm,
    resetForm: resetForm,
  };
}());

// MAP
(function () {
  const CITYS = [
    {
      latitube: 55.75,
      longitube: 37.6167,
      balloonContent: 'Москва',
      region: 'rus',
    },
    {
      latitube: 59.96,
      longitube: 30.16,
      balloonContent: 'Санкт-Петербург',
      region: 'rus',
    },
    {
      latitube: 51.53,
      longitube: 46.03,
      balloonContent: 'Саратов',
      region: 'rus',
    },
    {
      latitube: 67.62,
      longitube: 33.66,
      balloonContent: 'Кировск',
      region: 'rus',
    },
    {
      latitube: 57.15,
      longitube: 65.54,
      balloonContent: 'Тюмень',
      region: 'rus',
    },
    {
      latitube: 54.99,
      longitube: 73.37,
      balloonContent: 'Омск',
      region: 'rus',
    },

    {
      latitube: 40.38,
      longitube: 49.83,
      balloonContent: 'Баку',
      region: 'sng',
    },
    {
      latitube: 39.79,
      longitube: 71.72,
      balloonContent: 'Ташкент',
      region: 'sng',
    },
    {
      latitube: 53.90,
      longitube: 27.56,
      balloonContent: 'Минск',
      region: 'sng',
    },
    {
      latitube: 43.43,
      longitube: 77.01,
      balloonContent: 'Алма-Ата',
      region: 'sng',
    },

    {
      latitube: 48.86,
      longitube: 2.35,
      balloonContent: 'Париж',
      region: 'euro',
    },
    {
      latitube: 50.09,
      longitube: 14.42,
      balloonContent: 'Прага',
      region: 'euro',
    },
    {
      latitube: 51.51,
      longitube: -0.13,
      balloonContent: 'Лондон',
      region: 'euro',
    },
    {
      latitube: 41.89,
      longitube: 12.48,
      balloonContent: 'Рим',
      region: 'euro',
    },
  ];

  const formMap = document.querySelector('#form-map');
  let map;

  function getInputIdChecked () {
    let regions = [];
    const inputChecks = formMap.querySelectorAll('input[type=checkbox]:checked');
    inputChecks.forEach(function(input) {
      regions.push(input.id);
    });
    return regions;
  };

  function init () {
    const inputChecks = getInputIdChecked();

    map = new ymaps.Map('map', {
      center: [55.16, 41.37],
      zoom: 4,
    });

    let filtredCity = CITYS.filter(function (obj) {
      return inputChecks.indexOf(obj.region) !== -1;
    });

    filtredCity.forEach(function(obj) {
      var placemark = new ymaps.Placemark([obj.latitube, obj.longitube], {
        balloonContent: obj.balloonContent,
      },
      {
        iconLayout: 'default#image',
        iconImageHref: 'img/location.png',
        iconImageSize: [37, 42],
        iconImageOffset: [-18, -42],
      });
      map.geoObjects.add(placemark);
    });
  };

  formMap.addEventListener('change', function() {
    map.destroy();
    ymaps.ready(init);
  });

  ymaps.ready(init);
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
  let scrollMap = new SmoothScroll('a[href*="#map"]');
}());

//----------------------------------------------------------
// PHONE MASK
(function (){
  const inputTel = document.querySelector('#telephone-number');
  let im = new Inputmask('+7 (999) 999-9999');
  im.mask(inputTel);
}());
