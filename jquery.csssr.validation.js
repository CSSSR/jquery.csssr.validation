; (function ($) {
	/*
		Universal validation plugin
		(c) 2014 Pavel Azanov, developed for CSSSR

		----

		Using parts of jQuery.bind-first (https://github.com/private-face/jquery.bind-first)
		(c) 2013 Vladimir Zhuravlev, MIT License
	*/

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

			'remove-invalid-class-on',
			'validate-fields-on'

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

			removeInvalidClassOn: 'focus',
			validateFieldsOn: false,

			masks: {
				numbered: {
					has: function ($field) {
						return $field.hasClass('numbered');
					},
					valid: function ($field) {
						return !$field.hasClass('numbered_error');
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
				email:
					/^[a-zа-яё0-9][a-zа-яё0-9\.-]*[a-zа-яё0-9]?@[a-zа-яё0-9][a-zа-яё\.-]*[a-zа-яё0-9]\.[a-zа-яё][a-zа-яё\.]*[a-z]$/i,
				url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
			},
			inputPatterns: {
				cyrillic: /[а-яё\s]/i,
				latin: /[a-z\s]/i,
				numeric: /[0-9]/,
				letters: /[a-zа-яё\s]/i,
				email: /[a-zа-яё0-9\.\-_@]/i,
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

				if (!valid) {
					e.stopImmediatePropagation();
				} else {
					base.element.trigger('valid');
				}

				return valid;

			},
			_onValidateField: function () {

				var $this = $(this),
					base = $this.closest('form, [data-validation-container]').data(pluginName);

				methods.validate.apply(base, [$this]);

			},
			_onRemoveInvalidClass: function () {

				var $this = $(this),
					base = $this.closest('form, [data-validation-container]').data(pluginName);

				// TODO: handle tag name based selection
				methods.toggleClass($this, false, base.options.invalidClass, base.options.invalidClassTarget);

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
			_onKeyDown: function (e) {

				var $this = $(this),
					base = $this.closest('form, [data-validation-container]').data(pluginName),
					numeric = $this.filter(base.options.numericSelector).length;

				// Allow: backspace, delete, tab, escape and enter
				if (!numeric || $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
					// Allow: Ctrl+A
					(e.keyCode === 65 && e.ctrlKey === true) ||
					// Allow: home, end, left, right
					(e.keyCode >= 35 && e.keyCode <= 39)) {
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
					if (patterns[invert ? t.slice(1) : t] !== void 0) {
						result.push(invert ? function (value) {
							return invert === (value.match(new RegExp(patterns[t.slice(1)])) === null);
						} : new RegExp(patterns[t]));
					}

				});

				return result;

			},
			toggleClass: function ($field, state, cssClass, target) {

				if (cssClass) {
					if (target) {
						var tmp = target.split('/');
						$field[tmp[0]](tmp[1]).toggleClass(cssClass, state);
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
			validate: function ($fields) {

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
						fieldOptions = methods.getDataOptions($field),
						mask = methods.getMask($field, options.masks),
						pattern = mask ?
							false :
							methods.getPattern.apply(base, [$field, 'type', options.patternAttribute, options.patterns]),
						allowEmpty =
							$field.filter(options.allowEmptySelector).length ||
							!$field.filter(options.requiredSelector).length,
						maxlength = $field.attr(options.maxlengthAttribute) || Number.POSITIVE_INFINITY,
						minlength = $field.attr(options.minlengthAttribute) || 0,
						valLength = $field.val().length,
						isNumeric = $field.filter(options.numericSelector).length,
						min = $field.attr(options.minAttribute),
						max = $field.attr(options.maxAttribute),
						equalTo = $field.data('equal-to'),
						fieldValid = (
							(allowEmpty && !$field.val()) ||
							(mask && mask.valid($field)) ||
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

					methods.toggleClass(
						$field,
						!fieldValid,

						fieldOptions.invalidClass ||
							options['invalid' + methods.capitalize($field[0].tagName.toLowerCase()) + 'Class'] ||
							options.invalidClass,

						fieldOptions.invalidClassTarget ||
							options['invalid' + methods.capitalize($field[0].tagName.toLowerCase()) + 'ClassTarget'] ||
							options.invalidClassTarget
					);

					methods.toggleClass(
						$field,
						fieldValid,

						fieldOptions.validClass ||
							options['valid' + methods.capitalize($field[0].tagName.toLowerCase()) + 'Class'] ||
							options.invalidClass,

						fieldOptions.validClassTarget ||
							options['valid' + methods.capitalize($field[0].tagName.toLowerCase()) + 'ClassTarget'] ||
							options.validClassTarget
					);

					valid = valid && fieldValid;

				});

				return valid;

			}
		};

	function CsssrValidation(element, options) {

		this.element = element;
		this.options = $.extend(true, {}, $[pluginName].defaults, methods.getDataOptions(element), options);
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

	$('body').onFirst('submit', 'form[data-validate]:not([novalidate])', function (e) {

		e.preventDefault();
		e.stopImmediatePropagation();

		$(this)
			.csssrValidation()
			.submit();

	});

	$('body').onFirst('validate.csssr', '[data-validation-container]:not([novalidate])', function (e) {

		e.preventDefault();
		e.stopImmediatePropagation();

		$(this)
			.csssrValidation()
			.trigger('validate.csssr');

	});

	$('body').on('click', '[data-validation-trigger]', function () {

		$(this)
			.closest('[data-validation-container]')
			.trigger('validate.csssr');

	});

	$('form[data-validate]:not([novalidate]), [data-validation-container]:not([novalidate])').csssrValidation();

})(jQuery);
