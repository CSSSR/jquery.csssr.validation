jquery.csssr.validation
=======================

**jquery.csssr.validation** is an universal validation plugin, which requires zero JS code to validate the forms on your project. Simply connect it, add a couple of attributes to your forms and here you go, it does all you need.

```
bower i jquery.csssr.validation
```

```
npm i jquery.csssr.validation
```

--------------

1. [Quickstart](#quickstart)
2. [Validation Features](#validation-features)
  - [Checking for empty values](#checking-for-empty-values)
  - [Validation based on patterns](#validation-based-on-patterns)
    - [Email validation](#email-validation)
    - [Url validation](#url-validation)
    - [Defining custom patterns](#defining-custom-patterns)
      - [Patterns for individual fields](#patterns-for-individual-fields)
      - [Reusable global patterns](#reusable-global-patterns)
      - [Inverting patterns](#inverting-input-patterns)
      - [Using functions instead of patterns](#using-functions-instead-of-patterns)
  - [Input length validation](#input-length-validation)
  - [Validating min and max values of numeric fields](#validating-min-and-max-values-of-numeric-fields)
  - [Linking fields to check for equal values](#linking-fields-to-check-for-equal-values)
  - [Allowing empty values](#allowing-empty-values)
  - [Integrating with masking plugins](#integrating-with-masking-plugins)
  - [Filtering input](#filtering-input)
    - [Cyrillic-only fields](#cyrillic-only-fields)
    - [Numeric-only fields](#numeric-only-fields)
    - [Letters-only fields](#letters-only-fields)
    - [Latin-only fields](#latin-only-fields)
    - [Defining custom input patterns](#defining-custom-input-patterns)
      - [Input patterns for individual fields](#input-patterns-for-individual-fields)
      - [Reusable global input patterns](#reusable-global-patterns)
      - [Inverting input patterns](#inverting-input-patterns)
      - [Using filter functions instead of input patterns](#using-filter-functions-instead-of-input-patterns)
3. [Visualizing validation results](#visualizing-validation-results)
  - [Adding CSS classes](#adding-css-classes)
    - [Defining targets the CSS classes will be added to](#defining-targets-the-css-classes-will-be-added-to)
    - [Using a different CSS class for textarea or select](#using-different-class-for-textarea-or-select)
    - [Adding CSS classes on invalid or empty values](#adding-css-classes-on-invalid-or-empty-values)
    - [Adding CSS classes on valid values](#adding-css-classes-on-valid-values)
    - [Defining when the classes will be removed](#defining-when-the-classes-will-be-removed)
  - [Displaying text messages](#displaying-text-messages)
    - [Defining targets the messages will be displayed in](#defining-targets-the-messages-will-be-displayed-in)
    - [Displaying messages for empty values](#displaying-messages-for-empty-values)
    - [Displaying messages for invalid values](#displaying-messages-for-invalid-values)
4. [Understanding validation events](#understanding-validation-events)
5. [Silent validation](#silent-validation)
6. [Custom validation containers and validation with multiple steps](#custom-validation-containers-and-validation-with-multiple-steps)
7. [Global plugin configuration](#global-and-local-configuration)
8. [Overriding of global options](#overriding-of-global-options)
  - [Overriding in forms or validation containers](#overriding-in-forms-or-validation-containers)
  - [Overriding in individual fields](#overriding-in-individual-fields)
9. [Options reference](#options-reference)

### Quickstart

Let's begin with a simple registration form with four fields: **username**, **email**, **password** and **password confirmation**.

1. To initialize the plugin, add the `data-validate` attribute to your form. 
2. Add the `required` attribute to the fields you want to be checked for empty values.
3. Set the type of the email field to `email`. 
4. Using the `data-invalid-class` attribute, define the CSS class which will be added to the field when its value is empty.
5. Link the password & password confirmation fields with the `data-equal-to` attribute:

```html
<form 
    id="frmRegister" 
    action="#" 
    method="post" 
    data-validate
    data-invalid-class="invalid">
    
    <input type="text" name="username" placeholder="Username" required />
    <input type="email" name="username" placeholder="Email" required />
    <input id="txtPassword" type="password" name="password" placeholder="Password" required />
    <input type="password" name="password2" placeholder="Confirm password" required data-equal-to="#txtPassword" />
    
    <input type="submit" value="register" />
</form>
```

Now, once the form is submitted, the validation plugin will be called and your form is being validated before it is submitted. Keep in mind, that you don't need to add the `novalidate` attribute to turn off browser validation - it will be added automatically once the plugin is initialized.

[See it live on JSFiddle](http://jsfiddle.net/coder13/gnfrmj3z/)


### Validation Features

#### Checking for empty values

Add the `required` attribute to a field to make the plugin check if a value is filled in.  

```html
<input type="text" name="username" required>
```

If you don't like to use the `required` attribute, you can add the `js-required` class to your field also.

```html
<input type="text" name="username" class="js-required">
```

Don't like the class either, or integrating with existing code? You can override the selector for looking for required fields by adding the `data-required-selector` attribute to your form, putting any jQuery selector there.

```html
<form action="..." method="post" data-validate data-required-selector=".input-text_required">
  <input type="text" name="username" class="input-text input-text_required">
  <input type="submit" value="send">
</form>
```

#### Validation based on patterns

Out of the box, the plugin allows you to validate a field value based on a pattern. There are two pre-configured patterns: *email* and *url*. You can also define any number of custom patterns.

##### Email validation

The built-in validation pattern for emails is using the following regex:

```
/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zа-яёії\-0-9]+\.)+[a-zа-яёії]{2,}))$/i
```

To make it work, simply set the type of your input to `email`.

```html
<!-- 
  A required email field, first will be checked for 
  an empty value, then validated based on pattern 
--> 
<input type="email" name="email" required>
  
<!--
  An optional email field, empty values are allowed,
  pattern validation triggered when a value is entered.
-->
<input type="email" name="optional_email">
```

##### Url validation

The built-in validation pattern for urls is using the following regex:

```
/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
```

To make it work, simply set the type of your input to `url`.

```html
<!-- 
  A required url field, first will be checked for 
  an empty value, then validated based on pattern 
--> 
<input type="url" name="link" required>
  
<!--
  An optional url field, empty values are allowed,
  pattern validation triggered when a value is entered.
-->
<input type="url" name="optional_link">
```

#### Input length validation

Sometimes you need to validate the length of the string the user has filled in a field. Use the `minlength` and `maxlength` attributes to achieve the correct behavior. Should you set the `maxlength` attribute, the library will also take care of that the user cannot input more characters than required:

```html
<!-- 
  A required field, you have to enter at east 3 characters
  and cannot enter more than 10 characters
--> 
<input type="text" name="username" minlength="3" maxlength="10" required>
```

[See it live on JSFiddle](http://jsfiddle.net/coder13/kpo1bgo6/)

#### Validating min and max values of numeric fields

Should you have a numeric field, mostly two things are required - limiting the characters to numeric only, as well as setting the minimum and maximum allowed values. Set the `inputmode` attribute of your field to `numeric` and use the `min` and `max` attributes to limit the number range. Should the user input a value below or above the given limits, the plugin will automatically correct the entered value.

```html
<!-- 
  A required numeric field, accepts numbers from 18 to 100
--> 
<input type="text" name="age" inputmode="numeric" min="18" max="100" required>
```

[See it live on JSFiddle](http://jsfiddle.net/coder13/7L11ys29/)

#### Linking fields to check for equal values

A common practice in registration forms is to ask the user to input his password twice and validate if the values in both password fields match. The plugin can help you to easily link two fields with each other using the `data-equal-to` attribute, which accepts a selector as its value:

```html
<!-- 
  Two password fields linked to each other and 
  validated to have matching values
--> 
<input id="txtPassword" type="password" name="password" placeholder="Password" required />
<input type="password" name="password2" placeholder="Confirm password" required data-equal-to="#txtPassword" />
```

[See it live on JSFiddle](http://jsfiddle.net/coder13/4zywdgj2/)

#### Allowing empty values

You have a field you need be validated when the user has entered a value and still allow empty values? Use the `data-allow-empty` attribute.

```html
<!-- 
  A required email field, which is only checked 
  when the user enters a value
--> 
<input type="email" name="email" placeholder="Email" required data-allow-empty>
```

[See it live on JSFiddle](http://jsfiddle.net/coder13/c8b2bbyc/)


****
