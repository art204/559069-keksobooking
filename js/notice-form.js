'use strict';

window.configureNoticeForm = function () {
  var mapSection = document.querySelector('.map');
  var mainPin = mapSection.querySelector('.map__pin--main');
  var form = document.querySelector('.notice__form');

  var deactivateNoticeForm = function () {
    mapSection.classList.add('map--faded');
    form.classList.add('notice__form--disabled');
    form.querySelector('#title').value = '';
    form.querySelector('#price').value = '';
    form.querySelector('#description').value = '';
    var checkboxes = form.querySelectorAll('input[type = "checkbox"]');

    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }

    var noticeFormFieldsets = document.querySelectorAll('.notice__form fieldset');

    for (i = 0; i < noticeFormFieldsets.length; i++) {
      noticeFormFieldsets[i].disabled = true;
    }

    mainPin.style.left = 600 + 'px';
    mainPin.style.top = 375 + 'px';

    document.querySelector('#address').value = (mainPin.offsetLeft + mainPin.offsetWidth / 2)
        + ', ' + (mainPin.offsetTop + mainPin.offsetHeight / 2);

    var pins = mapSection.querySelectorAll('.map__pin');
    var pinsList = mapSection.querySelector('.map__pins');

    for (i = 1; i < pins.length; i++) {
      pinsList.removeChild(pins[i]);
    }
  };

  deactivateNoticeForm();

  var noticeForm = document.querySelector('.notice__form');
  var typeSelect = noticeForm.querySelector('#type');
  var priceInput = noticeForm.querySelector('#price');

  var setPriceMinVal = function () {
    if (typeSelect.value === 'bungalo') {
      return '0';
    } else if (typeSelect.value === 'flat') {
      return '1000';
    } else if (typeSelect.value === 'house') {
      return '5000';
    } else {
      return '10000';
    }
  };

  priceInput.min = setPriceMinVal();

  typeSelect.addEventListener('click', function () {
    priceInput.min = setPriceMinVal();
  });

  var roomNumberSelect = noticeForm.querySelector('#room_number');
  var capacitySelect = noticeForm.querySelector('#capacity');

  var sayWrongCapacity = function () {
    if (capacitySelect.value > roomNumberSelect.value &&
      capacitySelect.value !== '0' &&
      roomNumberSelect.value !== '100' ||
      capacitySelect.value === '0' &&
      roomNumberSelect.value !== '100' ||
      capacitySelect.value !== '0' &&
      roomNumberSelect.value === '100'
    ) {
      capacitySelect.setCustomValidity('Минимальное количество мест 1.'
        + ' Максимальное количество мест равно количеству комнат.'
        + ' Для 100 комнат возможен один вариант - \"не для гостей\" ');
    } else {
      capacitySelect.setCustomValidity('');
    }
  };

  sayWrongCapacity();

  capacitySelect.addEventListener('click', function () {
    sayWrongCapacity();
  });
  roomNumberSelect.addEventListener('click', function () {
    sayWrongCapacity();
  });

  var timeIn = noticeForm.querySelector('#timein');
  var timeOut = noticeForm.querySelector('#timeout');

  var onTimeInClick = function () {
    timeOut.value = timeIn.value;
  };

  var onTimeOutClick = function () {
    timeIn.value = timeOut.value;
  };

  timeIn.addEventListener('click', onTimeInClick);
  timeOut.addEventListener('click', onTimeOutClick);

  var resetBtn = noticeForm.querySelector('.form__reset');

  resetBtn.addEventListener('click', function () {
    deactivateNoticeForm();
    window.closeMapCard();
  });

  // отправка формы
  var successUploadHandler = function () {
    deactivateNoticeForm();
  };

  var errorUploadHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.top = '50%';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '40px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
    var removeNode = function () {
      document.body.removeChild(node);
    };
    setTimeout(removeNode, 10000);
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), successUploadHandler, errorUploadHandler);
  });
};
