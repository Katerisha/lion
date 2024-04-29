document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js_validate button[type="submit"]').forEach(function (btnEl) {
        btnEl.addEventListener('click', function (e) {
            const thisForm = btnEl.closest('.js_validate');
            const valid = validate(thisForm, e);
            if (valid === false) e.preventDefault();
        });
    })

    const itemRating =  document.querySelectorAll('.js_rating .rating__star');

    function itemStars() {
        function fillStar(star, rating) {
            const arr = [];
            const thisRating = rating.querySelectorAll('.rating__star');
            const starIndex = +star.getAttribute('data-index');

            for (let i = -1; i < starIndex; i++) {
                arr.push(thisRating[i + 1]);
            }

            thisRating.forEach(function (star) {
                star.classList.remove('active');
                star.removeAttribute('data-active');
            });
            arr.forEach(function (star) {
                star.classList.toggle('active');
            });

            star.setAttribute('data-active', starIndex + 1);
        };
        function fillStar2(star, rating) {
            const arr = [];
            const thisRating = rating.querySelectorAll('.rating__star');
            const starIndex = +star.getAttribute('data-index');

            for (let i = 0; i < starIndex; i++) {
                arr.push(thisRating[i]);
            }
            thisRating.forEach(function (star) {
                star.classList.remove('hover');
            });
            arr.forEach(function (star) {
                star.classList.toggle('hover');
            });
        };
        if (itemRating.length) {
            itemRating.forEach(function(star) {
                star.addEventListener('click', function () {
                    fillStar(star, star.closest('.js_rating'));
                });
            })
            itemRating.forEach(function(star) {
                star.addEventListener('mouseenter', function (e) {
                    fillStar2(star, star.closest('.js_rating'));
                });
            });
            itemRating.forEach(function(star) {
                star.addEventListener('mouseleave', function () {
                    star.classList.remove('hover');
                })
            });
            document.querySelector('.js_rating').addEventListener('mouseleave', function() {
                this.querySelectorAll('.rating__star').forEach(function (star) {
                    star.classList.remove('hover');
                });
            });
        }
    }

    let slider = new Swiper(".mySwiper", {
        slidesPerView: "auto",
        speed: 1500,
        spaceBetween: 20,
        slidesPerView: 6,
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 12,
            },
            601: {
                slidesPerView: 2,
                spaceBetween: 12,
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 12,
            },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 2,
            },
        },
        autoplay: {
          delay: 25000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
      });

    $(document).on('change click', '.text__input', function () {
        if ($(this).val().length) {
            $(this).siblings('.control__label').addClass('filled');
        } else {
            $(this).siblings('.control__label').removeClass('filled');
        }
    });

    $(".js_ajax").on("submit", function() {
        let _form = $(this);
        let _url = window.location.href;

        $.ajax({
            url: _url,
            dataType: "json",
            type: "POST",
            data: _form.serialize(),
            beforeSend: function() { // Не даем несколько раз нажать кнопку
                _form.find("input[type=submit]").attr('disabled','disabled');
                _form.find("button[type=submit]").attr('disabled','disabled');
            },
            success: function(res){
                if (res.status) {
                    $.fancybox.close();
                    _form.trigger('reset'); // Очищаем форму
                }
                _form.find("input[type=submit]").removeAttr('disabled');
                _form.find("button[type=submit]").removeAttr('disabled');

                showModal(res.message);
            }
        });

        return false;
    });

    if(itemRating.length) itemStars();

    function validate(form, event) {
        const errorClass = 'error';
        const successClass = 'pass';
        let result = 0;
        let e = 0;
        let reg = undefined;
        let email = false;
        let phone = false;
        let number = false;
        let undef = false;
        let arr = [];

        function toggleClassToError(el) {
            el.closest('.input__box').classList.add(errorClass);
            el.closest('.input__box').classList.remove(successClass);
        }
        function toggleClassToSuccess(el) {
            el.closest('.input__box').classList.add(successClass);
            el.closest('.input__box').classList.remove(errorClass);
        }

        function mark(object, expression, minSign, maxSign) {
            if (expression) {
                toggleClassToError(object);

                if (phone) {
                    if (object.value != 16) {
                        object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-empty'));
                    } else {
                        object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-wrong'));
                    }
                }
                if (email) {
                    if (object.value.length > 0) {
                        if (object.value.length < 6) {
                            object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-min'));
                        }
                        else if  (object.value.length > 37) {
                            object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-max'));
                        } else {
                            object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-wrong'));
                        }
                    } else {
                        object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-empty'));
                    }
                }

                if (number) {
                    if (object.value.length < minSign || object.value.length > maxSign) {
                        object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-empty'));
                    } else {
                        object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-wrong'));
                    }
                }

                if (undef) {
                    if (object.value.length > 0) {
                        if (object.value.length > minSign && object.value.length < maxSign) {
                            object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-wrong'))
                        } else {
                            object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-empty'))
                        }
                    } else {
                        object.closest('.input__box').setAttribute('data-error', object.getAttribute('data-error-empty'))
                    }
                }

                e++;
            } else {
                if (object.closest('select')) {
                    if(object.closest('select').classList.contains('select')) {
                        if(object.closest('select').selectedIndex != 0) {
                            toggleClassToSuccess(object);
                            e = 0;
                        } else {
                            event.preventDefault();
                            toggleClassToError(object);
                            e = 0;
                        }
                    }
                } else {
                    toggleClassToSuccess(object);
                    e = 0;
                }
            }
            arr.push(expression);
        }

        if (form.classList.contains('js_validate')) {
            const field = form.querySelectorAll('[required]'),
              radio = form.querySelectorAll('.js_valid-radio'),
              checkbox = form.querySelectorAll('.js_valid-checkbox'),
              select = form.querySelectorAll('.js_valid-select');
            field.forEach(function (input) {
                const dataValidate = input.getAttribute('data-validate');
                caseDataValidate(dataValidate, input);
            });
            radio.forEach(function (radioEl) {
                validateFormElements(radioEl.querySelectorAll('input[type="radio"]'), 0);
            });
            checkbox.forEach(function (checkboxEl) {
                validateFormElements(checkboxEl.querySelectorAll('input[type="checkbox"]'), 0);
            });
            select.forEach(function (selectEl) {
                validateFormElements(selectEl.querySelectorAll('select option'), 1);
            });
        }

        function caseDataValidate(dataValidate, fieldIn) {
            const minSign = fieldIn.getAttribute('data-minsign');
            const maxSign = fieldIn.getAttribute('data-maxsign');
            switch (dataValidate) {
                case 'text':
                    reg = new RegExp('^[\'А-Яа-яёЁЇїІіЄєҐґa-zA-Z -]{' + minSign + ',' + maxSign + '}$');
                    undef = true;
                    mark(fieldIn, !reg.test(fieldIn.value.trim()), minSign, maxSign);
                    undef = false;
                    break;
                case 'house':
                    reg = new RegExp('^[\'А-Яа-яёЁЇїІіЄєҐґa-zA-Z 0-9 -]{' + minSign + ',' + maxSign + '}$');
                    undef = true;
                    mark(fieldIn, !reg.test(fieldIn.value.trim()), minSign, maxSign);
                    undef = false;
                    break;
                case 'email':
                    reg = /^([A-Za-z0-9_\-\.]{2,17})+\@([A-Za-z0-9_\-\.]{2,10})+\.([A-Za-z]{2,10})$/;
                    email = true;
                    if (fieldIn.value.trim().length > 37) {
                        mark(fieldIn, true);
                    } else {
                        mark(fieldIn, !reg.test(fieldIn.value.trim()));
                    }
                    email = false;
                    break;
                case 'phone':
                    phone = true;
                    reg = /[0-9 -()+]{16}$/;
                    mark(fieldIn, !reg.test(fieldIn.value.trim()));
                    phone = false;
                    break;
                case 'number':
                    reg = new RegExp('^[0-9]{'+minSign+','+maxSign+'}$');
                    number = true;
                    mark(fieldIn, !reg.test(fieldIn.value.trim()));
                    number = false;
                    break;
                case 'select2':
                    if (fieldIn.value != null || fieldIn.value != undefined || fieldIn.value != '') {
                        mark(fieldIn, false);
                        break;
                    }
                default:
                    reg = new RegExp(fieldIn.getAttribute('data-validate'), 'g');
                    mark(fieldIn, !reg.test(fieldIn.value.trim()));
                    break;
            }
        }
        function validateFormElements(element, count) {
            for (let i = count; i < element.length; i++) {
                const parentElement = element[i].closest('.input__box');
                if (parentElement.classList.contains('js_valid-radio') || parentElement.classList.contains('js_valid-checkbox')) {
                    if (element[i].checked === true) {
                        result = 1;
                        break;
                    } else {
                        result = 0;
                    }
                } else {
                    if (element[i].selected === true) {
                        result = 1;
                        break;
                    } else {
                        result = 0;
                    }
                }
            }

            if (result === 0) {
                element.forEach(function (item) {
                    toggleClassToError(item);
                });
                e = 1;
            } else {
                element.forEach(function (item) {
                    toggleClassToSuccess(item);
                });
            }
        }

        form.querySelectorAll('.js_rating').forEach(function (rating) {
            let i = 0;
            rating.querySelectorAll('.rating__star').forEach(function (star) {
                if(star.classList.contains('active')) i++;
            });
            if (i > 0) {
                rating.classList.add(successClass);
                rating.classList.remove(errorClass);
            } else {
                rating.classList.add(errorClass);
                rating.classList.remove(successClass);
                e = 1;
            }
        });

        if (arr.indexOf(true) == -1 && e === 0) {
            return true;
        } else {
            // form.querySelector(`.input__box.${errorClass} input`).focus();
            return false;
        }
    }

    document.querySelectorAll('.input__box-file__files').forEach(function (input) {
        input.addEventListener('change', function() {
            const fileName = this.files[0].name;
            this.closest('.input__box-file__inner').querySelector('.input__box-file__text').innerHTML = fileName;
            console.log('--------this--------',input)
            this.value !== '' ? this.closest('.input__box-file').classList.add('filled') : input.closest('.input__box-file').classList.remove('filled');
        });
    })

    document.querySelectorAll('.js_delete-file').forEach(function (btn) {
        btn.addEventListener('click', function() {
            const errorClass = 'error';
            const input = btn.closest('.input__box-file__inner').querySelector('.input__box-file__files');
            const label = btn.closest('.input__box-file__inner').querySelector('.input__box-file__label');
            input.value = '';
            input.closest('.input__box').classList.remove(errorClass);
            input.closest('.input__box').classList.remove('filled');
            if(input.hasAttribute('data-error-existence')) label.innerHTML = input.getAttribute('data-error-existence');
        });
    });

    if (document.querySelector('.js_checkbox-agree')) {
        document.querySelector('.js_checkbox-agree').addEventListener('change', function () {
            this.checked ? this.closest('.js_validate').querySelector('.btn').classList.remove('disabled') : this.closest('.js_validate').querySelector('.btn').classList.add('disabled');
        });
    }
    if (document.querySelectorAll('.js_number')) {
        document.querySelectorAll('.js_number').forEach(function (el) {
            el.addEventListener('input', function () {
                if (this.value.length > this.getAttribute('data-maxsign')) this.value = this.value.slice(0, this.getAttribute('data-maxsign'));
            });
        })
    }
    
});



$(document).ready(function () {
    $('[type="tel"]').inputmask({
        mask: '+38 (999) 999 99 99'
      });
});