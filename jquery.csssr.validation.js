/*
	Universal validation plugin
	(c) 2014 - 2016 Pavel Azanov, developed for CSSSR

	Version: 0.0.14
	----

	Using parts of jQuery.bind-first (https://github.com/private-face/jquery.bind-first)
	(c) 2013 Vladimir Zhuravlev, MIT License
*/
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	function moveHandlerToTop($el, eventName, isDelegated) {

		var data = $el.data('events') || $._data($el[0]).events,
			events = data[eventName],
			handler = isDelegated ? events.splice(events.delegateCount - 1, 1)[0] : events.pop();

		events.splice(isDelegated ? 0 : (events.delegateCount || 0), 0, handler);

	}

	function moveEventHandlers($elems, eventsString, isDelegate) {
		var events = eventsString.split(/\s+/);
		$elems.each(function () {
			for (var i = 0; i < events.length; ++i) {
				var pureEventName = $.trim(events[i]).match(/[^\.]+/i)[0];
				moveHandlerToTop($(this), pureEventName, isDelegate);
			}
		});
	}

	$.fn.onFirst = function (types, selector) {
		var $el = $(this),
			isDelegated = typeof selector === 'string';

		$.fn.on.apply($el, arguments);

		// events map
		if (typeof types === 'object') {
			for (var type in types) {
				if (types.hasOwnProperty(type)) {
					moveEventHandlers($el, type, isDelegated);
				}
			}
		} else if (typeof types === 'string') {
			moveEventHandlers($el, types, isDelegated);
		}

		return $el;
	};

	var pluginName = 'csssrValidation',

		dataOptionsKeys = [

			'valid-class',
			'invalid-class',

			'valid-textarea-class',
			'invalid-textarea-class',

			'valid-select-class',
			'invalid-select-class',

			'valid-class-target',
			'invalid-class-target',

			'valid-textarea-class-target',
			'invalid-textarea-class-target',

			'valid-select-class-target',
			'invalid-select-class-target',

			'required-selector',
			'numeric-selector',
			'inputmode-selector',
			'allow-empty-selector',

			'pattern-attribute',
			'input-pattern-attribute',
			'inputmode-attribute',
			'minlength-attribute',
			'maxlength-attribute',
			'min-attribute',
			'max-attribute',
			'type-attribute',

			'remove-invalid-class-on',
			'validate-fields-on',
			'silent-validation-on',

			'msg-target',
			'empty-value-msg',
			'invalid-value-msg',
			'empty-msg-target',
			'invalid-msg-target',

			'max-validation-level',
			'inherit-validation-options'

		];

		$[pluginName] = $[pluginName] || {};

		$[pluginName].defaults = {

			requiredSelector: '[required], .js-required',
			requiredPreCheck: false,
			numericSelector: '[inputmode="numeric"]',
			inputmodeSelector: 'input[inputmode], input[data-input-pattern], textarea[data-input-pattern]',
			allowEmptySelector: '[data-allow-empty]',
			minMaxSelector: 'input[min], input[max]',

			patternAttribute: 'pattern',
			inputPatternAttribute: 'data-input-pattern',
			inputmodeAttribute: 'inputmode',
			minlengthAttribute: 'minlength',
			maxlengthAttribute: 'maxlength',
			minAttribute: 'min',
			maxAttribute: 'max',
			typeAttribute: 'type',

			msgTarget: false,
			emptyValueMsg: '',
			emptyMsgTarget: false,
			invalidValueMsg: '',
			invalidMsgTarget: false,

			removeInvalidClassOn: 'focus',
			validateFieldsOn: false,
			silentValidationOn: false,

			maxValidationLevel: Number.MAX_VALUE,

			inheritValidationOptions: false,

			masks: {
				numbered: {
					has: function ($field) {
						return $field.length && typeof $field[0].numbered !== 'undefined';
					},
					valid: function ($field, allowEmpty) {
						var vld = this.has($field) && (new Numbered($field)).validate();
						return vld > 0 || (allowEmpty && vld === 0);
					},
					init: function ($field) {
						(new Numbered($field));
					}
				},
				inputmask: {
					selector: '[data-inputmask]',
					has: function ($field) {
						return $field.inputmask('getemptymask').length;
					},
					valid: function ($field) {
						return $field.inputmask('isComplete');
					},
					init: function ($field) {
						$field.inputmask();
					}
				}
			},
			patterns: {
				email: /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
				url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
			},
			inputPatterns: {
				cyrillic: /[а-яёії\s]/i,
				latin: /[a-z\s]/i,
				numeric: /[0-9]/,
				letters: /[a-zа-яёії\s]/i,
				email: /[a-zа-яёії0-9\.\-_@]/i,
				phone: /[\+0-9]/
			}
		};

		var methods = {
			capitalize: function (str) {
				return str.charAt(0).toUpperCase() + str.slice(1);
			},
			_onSubmit: function (e) {

				var base = $.data(e.target, pluginName),
					valid = methods.validate.apply(base, []);

				if (!valid || e.type === 'validate') {
					e.stopImmediatePropagation();
				}

				if (valid) {
					base.element.trigger('valid');
				}

				return valid;

			},
			_onSilentValidate: function () {

				var $this = $(this),
					base = $this.closest('form, [data-validation-container]').data(pluginName);

				base.element.trigger(methods.validate.apply(base, [false, true]) ? 'valid' : 'invalid');

			},
			_onValidateField: function () {

				var $this = $(this),
					base = $this.closest('form, [data-validation-container]').data(pluginName);

				methods.validate.apply(base, [$this]);

			},
			_onRemoveInvalidClass: function () {

				var $this = $(this),
					base = $this.closest('form, [data-validation-container]').data(pluginName);

				methods.toggleClass($this, false,
					methods.getClass.apply(base, [$this, 'invalid']),
					methods.getClassTarget.apply(base, [$this, 'invalid']));

			},
			_onBlur: function () {

				var $this = $(this),
					base = $this.closest('form, [data-validation-container]').data(pluginName),
					isNumeric = $this.filter(base.options.numericSelector).length,
					isRequired = $this.filter(base.options.requiredSelector).length,
					min = $this.attr(base.options.minAttribute),
					max = $this.attr(base.options.maxAttribute);

				if (isNumeric && (isRequired || $this.val())) {
					if (min > Number($this.val())) {
						$this.val(min);
					} else if (max < Number($this.val())) {
						$this.val(max);
					}
				}

			},
			isSpecialKey: function (keyCode, ctrlKey) {

				// Allow: backspace, delete, tab, escape and enter
				if ($.inArray(keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
					// Allow: Ctrl+A
					(keyCode === 65 && ctrlKey === true) ||
					// Allow: home, end, left, right
					(keyCode >= 35 && keyCode <= 39)) {
					// let it happen, don't do anything
					return true;
				}
				return false;

			},
			_onKeyDown: function (e) {

				var $this = $(this),
					base = $this.closest('form, [data-validation-container]').data(pluginName),
					numeric = $this.filter(base.options.numericSelector).length;


				if (!numeric || methods.isSpecialKey(e.keyCode, e.ctrlKey)) {
					// let it happen, don't do anything
					return;
				}

				if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
					e.preventDefault();
				}

			},
			_onKeyPress: function (e) {

				var $this = $(this),
					base = $this.closest('form, [data-validation-container]').data(pluginName),
					mask = methods.getMask($this, base.options.masks),
					pattern = mask ?
						false :
						methods.getPattern.apply(base,
							[$this, base.options.inputmodeAttribute, base.options.inputPatternAttribute, base.options.inputPatterns]),
					maxlength = $this.attr(base.options.maxlengthAttribute) || Number.POSITIVE_INFINITY,
					c = e.key || String.fromCharCode(e.which || e.keyCode);

				if (methods.isSpecialKey(e.keyCode, e.ctrlKey)) {
					return;
				}

				return $this.val().length <= maxlength && (!pattern.length || methods.matchesPatterns(c, pattern));

			},
			getDataOptions: function ($element) {

				var result = {};
				$.each(dataOptionsKeys, function (i, key) {
					var val = $element.data(key);
					if (val !== void 0) {
						result[$.camelCase(key)] = val;
					}
				});
				return result;

			},
			getMask: function ($field, masks) {

				for (var maskName in masks) {
					if (
						masks.hasOwnProperty(maskName) &&
						$.fn[maskName] !== void 0 &&
						(mask = masks[maskName]).has($field)
					) {
						return mask;
					}
				}

				return false;

			},
			getPattern: function ($field, typeOrMode, patternAttr, patterns) {

				var type = $field.attr(typeOrMode),
					pattern = $field.attr(patternAttr),
					result = [],
					tmp = type ? type.split(',') : [];

				if (pattern) {
					result.push(new RegExp(pattern));
				}

				$.each(tmp, function (i, t) {

					var invert = t[0] === '!';
					t = invert ? t.slice(1) : t;

					if (patterns[t] !== void 0) {

						if ($.isFunction(patterns[t])) {
							result.push(invert ? function (value) {
								return !patterns[t](value);
							} : patterns[t]);
						} else {
							result.push(invert ? function (value) {
								return invert === (value.match(new RegExp(patterns[t])) === null);
							} : new RegExp(patterns[t]));
						}

					}

				});

				return result;

			},
			getTarget: function ($field, exSelector) {

				if (exSelector.indexOf('/') !== -1) {
					var tmp = exSelector.split('/');
					return $field[tmp[0]](tmp[1]);
				} else {
					return $(exSelector);
				}

			},
			toggleClass: function ($field, state, cssClass, target) {

				if (cssClass) {
					if (target) {
						methods.getTarget($field, target).toggleClass(cssClass, state);
					} else {
						$field.toggleClass(cssClass, state);
					}
				}

			},
			matchesPatterns: function (value, patterns) {
				var valid = true;
				$.each(patterns, function (i, p) {
					valid = valid && ($.isFunction (p) ? p(value) : (value.match(p) !== null));
				});
				return valid;
			},
			getClass: function ($field, prefix) {
				var fieldOptions = methods.getDataOptions($field),
					options = $.extend(true, {}, this.options, $[pluginName].globals || {});

				return fieldOptions[prefix + 'Class'] ||
						options[prefix + methods.capitalize($field[0].tagName.toLowerCase()) + 'Class'] ||
						options[prefix + 'Class'];
			},
			getClassTarget: function ($field, prefix) {
				var fieldOptions = methods.getDataOptions($field),
					options = $.extend(true, {}, this.options, $[pluginName].globals || {});

				return fieldOptions[prefix + 'ClassTarget'] ||
						options[prefix + methods.capitalize($field[0].tagName.toLowerCase()) + 'ClassTarget'] ||
						options[prefix + 'ClassTarget'];
			},
			validate: function ($fields, silent) {

				var base = this,
					options = $.extend(true, {}, base.options, $[pluginName].globals || {}),
					selector = $.grep([
						options.requiredSelector || '',
						options.numericSelector || '',
						options.minMaxSelector || '',
						options.inputmodeSelector || ''
					], function (el) {
						return el !== '';
					}).join(','),
					valid = true;

				$fields = $fields ? $fields.filter(selector) : base.element.find(selector);

				if (options.requiredPreCheck) {
					$fields = $fields.filter(options.requiredPreCheck);
				}

				$fields.each(function () {

					var $field = $(this),
						fieldOptions = methods.getDataOptions($field);

					if (
						typeof fieldOptions.maxValidationLevel !== 'undefined' &&
						Number(fieldOptions.maxValidationLevel) < Number.MAX_VALUE
					) {
						var validParentsCount =
							$field
								.parents('[data-validate], [data-validation-container]')
								.filter(function (i, el) {
									return fieldOptions.maxValidationLevel >= i && el === base.element[0];
								}).length;
						if (!validParentsCount) {
							return true;
						}
					}

					var	mask = methods.getMask($field, options.masks),
						pattern = mask ?
							false :
							methods.getPattern.apply(base, [$field, 'type', options.patternAttribute, options.patterns]),
						allowEmpty =
							$field.filter(options.allowEmptySelector).length ||
							!$field.filter(options.requiredSelector).length,
						maxlength = $field.attr(options.maxlengthAttribute) || Number.POSITIVE_INFINITY,
						minlength = $field.attr(options.minlengthAttribute) || 0,
						valLength = ($field.val() || '').length,
						isNumeric = $field.filter(options.numericSelector).length,
						min = $field.attr(options.minAttribute),
						max = $field.attr(options.maxAttribute),
						equalTo = $field.data('equal-to'),
						isCheckBox = ($field.attr(options.typeAttribute) || '').toLowerCase() === 'checkbox',
						isEmpty = !$field.val(),
						fieldValid = isCheckBox ? ($field.length && $field[0].checked) : (
							(allowEmpty && isEmpty) ||
							(mask && mask.valid($field, allowEmpty)) ||
							(pattern.length && methods.matchesPatterns($field.val(), pattern)) ||
							(!mask && !pattern.length && valLength > 0)
						) &&
						(valLength >= Number(minlength) && valLength <= Number(maxlength)) &&
						(!isNumeric ||
							(min === void 0 || Number(min) <= Number($field.val())) &&
							(max === void 0 || Number(max) >= Number($field.val()))
						);

					if (fieldValid && equalTo) {
						fieldValid = $(equalTo).val() === $field.val();
					}

					if (!silent) {
						methods.toggleClass(
							$field,
							!fieldValid,
							methods.getClass.apply(base, [$field, 'invalid']),
							methods.getClassTarget.apply(base, [$field, 'invalid'])
						);

						// TODO: normalize the shitty checking

						var emptyValueMsg = fieldOptions.emptyValueMsg || options.emptyValueMsg || false,
							emptyMsgTarget = fieldOptions.emptyMsgTarget || fieldOptions.msgTarget || options.emptyMsgTarget || options.msgTarget || false,
							invalidValueMsg = fieldOptions.invalidValueMsg || options.invalidValueMsg || false,
							invalidMsgTarget = fieldOptions.invalidMsgTarget || fieldOptions.msgTarget || options.invalidMsgTarget || options.msgTarget || false;

						if (emptyValueMsg && emptyMsgTarget) {
							methods.getTarget($field, emptyMsgTarget).text(isEmpty ? emptyValueMsg : '');
						}

						if (!isEmpty && invalidValueMsg && invalidMsgTarget) {
							methods.getTarget($field, invalidMsgTarget).text(!fieldValid ? invalidValueMsg : '');
						}

						methods.toggleClass(
							$field,
							fieldValid,
							methods.getClass.apply(base, [$field, 'valid']),
							methods.getClassTarget.apply(base, [$field, 'valid'])
						);
					}

					valid = valid && fieldValid;

				});

				return valid;

			}
		};

	function CsssrValidation(element, options) {

		this.element = element;

		var elementOptions = methods.getDataOptions(element),
			inheritedOptions = {};

		if (elementOptions.inheritValidationOptions) {
			var $closest = $(element).parents('[data-validate], [data-validation-container]');

			if ($closest.length) {
				inheritedOptions = methods.getDataOptions($closest.eq(0));
			}
		}

		this.options = $.extend(
			true,
			{},
			$[pluginName].defaults,
			$[pluginName].globals,
			inheritedOptions,
			elementOptions,
			options
		);
		this.init();

	}

	CsssrValidation.prototype = {

		init: function () {

			var _this = this;

			_this.element.on('keydown', _this.options.numericSelector, methods._onKeyDown);
			_this.element.on('keypress', _this.options.inputmodeSelector, methods._onKeyPress);
			_this.element.on('blur', _this.options.minMaxSelector, methods._onBlur);

			_this.element
				.attr('novalidate', true)
				.onFirst('submit validate.csssr', methods._onSubmit);

			if (_this.options.removeInvalidClassOn) {
				_this.element.on(_this.options.removeInvalidClassOn, 'input, textarea', methods._onRemoveInvalidClass);
			}

			if (_this.options.validateFieldsOn) {
				_this.element.on(_this.options.validateFieldsOn, 'input, textarea', methods._onValidateField);
			}

			if (_this.options.silentValidationOn) {
				_this.element.on(_this.options.silentValidationOn, 'input, textarea', methods._onSilentValidate);
			}

			$.each(_this.options.masks, function (key, mask) {

				if (mask.selector && $.fn[key] !== void 0) {
					mask.init(_this.element.find(mask.selector));
				}

			});

		},
		destroy: function () {
			this.element.off('submit.' + pluginName + ' validate.csssr', methods._onSubmit)
						.removeData(pluginName);
		}

	};

	$.fn[pluginName] = function (options) {

		var args = arguments;

		return this.each(function () {

			var cached = $.data(this, pluginName);
			if (cached) {
				if (options && options.substring) {
					cached[options].apply(cached, [].splice.call(args, 1));
				}
				return true;
			} else if (options && options.substring) {
				throw new Error(pluginName + ' not available for this DOM element!');
			}

			cached = $(this);

			cached.data(pluginName, new CsssrValidation(cached, options));

			return true;

		});
	};

	$(function () {

		$('body').onFirst('submit', 'form[data-validate]:not([novalidate])', function (e) {

			e.preventDefault();
			e.stopImmediatePropagation();

			$(this)
				.csssrValidation()
				.submit();

		});

		$('body').onFirst('validate.csssr', '[data-validation-container]:not([novalidate])', function (e) {

			var $self = $(this);
			if ($self.data(pluginName)) {
				return true;
			}

			e.preventDefault();
			e.stopImmediatePropagation();

			$self
				.csssrValidation()
				.trigger('validate.csssr');

		});

		$('body').on('click', '[data-validation-trigger]', function () {

			$(this)
				.closest('[data-validation-container]')
				.trigger('validate.csssr');

		});

		$('form[data-validate]:not([novalidate]), [data-validation-container]:not([novalidate])').csssrValidation();

	});

}));
