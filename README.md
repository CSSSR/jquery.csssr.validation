jquery.csssr.validation
=======================

**jquery.csssr.validation** is an universal validation plugin, which requires zero JS code to validate the forms on your project. Simply connect it, add a couple of attributes to your forms and here you go, it does all you need.

1. [Getting Started](#getting-started)
2. [Validation Features](#validation-features)
  - [Checking for empty values](#checking-for-empty-values)

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


****
