jquery.csssr.validation
=======================

**jquery.csssr.validation** is an universal validation plugin, which requires zero JS code to validate the forms on your project. Simply connect it, add a couple of attributes to your forms and here you go, it does all you need.

1. [Getting Started](#getting-started)
2. [Validation Features](#validation-features)
  - [Checking for empty values](#checking-for-empty-values)
  - [Validation based on patterns](#validation-based-on-patterns)
    - [Email validation](#email-validation)
    - [Url validation](#url-validation)
    - [Defining custom patterns](#defining-custom-patterns)

### Getting Started

To initialize the plugin, simply add the `data-validate` attribute to your form. Keep in mind that you *should not* add the `novalidate` attribute. It will be added automatically once the plugin is initialized.

```html
<form action="..." method="post" data-validate>
  ...
</form>
```

Now, once the form is submitted, the validation plugin will be called.

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
<form action="..." method="post" data-validate>
  
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
  
  <input type="submit" value="send">
</form>
```

##### Url validation

The built-in validation pattern for urls is using the following regex:

```
/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
```

To make it work, simply set the type of your input to `url`.

```html
<form action="..." method="post" data-validate>
  
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
  
  <input type="submit" value="send">
</form>
```

****
