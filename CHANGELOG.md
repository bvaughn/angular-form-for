# Changelog

## 4.1.5
Fixed a small oversight in `text-field` that made the `controller` scope property required (when it should be optional).

## 4.1.4
The `checkbox-field` behaves more inline with native AngularJS checkbox regarding true/false values based on selection.
The `text-field` now allows users to bind to the inner `NgModelController` for increased functionality.
The `radio-field` now allows its options to contain HTML for their display.
Minimum and maximum validation rules now display a meaningful validation-failure message by default.
For more information refer to pull-requests #157, #158, #159, and #160.
Thanks to @indrimuska for contributing this release!

## 4.1.3
New `defaultSelectEmptyOptionValue` property added to `FormForConfiguration` allowing for greater control over "empty" select menus.
Checkbox directive exposes all HTML attributes via scope for custom renderer use.
Field name passed in as 4th parameter to custom validation functions in case it is convenient.
Thanks to @palodelincak for contributing this release!

## 4.1.2
PR from @nickguletskii moving `<submit-button>`'s `button-class` attribute to the scope for better dynamic support.

## 4.1.1
Better support falsy initial values for optional select fields.
Unchecked checkbox fields set their corresponding form data field to undefined instead of false.

## 4.1.0
Added `labelClass` to each form elements as well as a global default `FormForConfiguration.setLabelClass`.
Also changed the behavior for pattern validations so that falsy values aren't validated.

## 4.0.6
Default help icon can be overidden with `FormForConfiguration.setHelpIcon`.

## 4.0.5
TypeAheadField now properly accounts for the fact that jqLite doesn't implement the `focus` method like jQuery does. Native HTMLElement method is used instead.

## 4.0.4
Adds supports to formFor default template for before/after icon click handlers.

## 4.0.3
Fixed on-focus/on-blur handling for textField in Angular 1.4.x

## 4.0.2
Resolved a minor CSS issue with Angular Material select fields and their floating labels.

## 4.0.1
Added auto-trim option (off by default) to FormForConfiguration.
Refactored handling of non-selected, falsy values in select field directive to work around Angular 1.2.x-1.3.x bug.

## 4.0.0
Refactored SelectFieldDirective to break out filterable behavior into a new directive, TypeAheadFieldDirective.

A secondary change is included in this release to address some Angular Material issues. Namely, the formForIncludeReplace has been removed. This means that there is now an ext
ra div in between `<text-field>` and the inner `<input>/<textarea>` as well as `<select-field>` and its inner `<select>`. Some small CSS adjustements will be required for users who ar
e customizing formFor CSS.

## 3.0.7
Select menus without an initially-selected values more gracefully handle falsy values of null, undefined, and empty-string in order to prevent an additional, empty <option> from being generated

## 3.0.6
formForBuilder respects the view-schema "placeholder" attribute (if present) for text and select fields.

## 3.0.5
formForIncludeReplace directive now re-compiles included content before replacing. This fixes an issue with jqLite that caused partials (e.g. select-field/_select.html) to become disconnected from their parent directives. This should also remove the jQuery dependency on the Angular Material templates.

## 3.0.4
Patched a bad version of the jQuery definitions file in order to resolve a jqLite-incompatible `element.on()` listener format.

## 3.0.3
formForBuilder now correctly checks for input[type=button], button, and submitButton directive.

## 3.0.2
Fixed a minor, bizarre issue with the `fieldLabel` directive's controller.

## 3.0.1
Greatly restructured TypeScript files so that ngAnnotate would properly annotate Directive :link and :controller functions.

## 3.0.0
Added support for [Angular Material](https://material.angularjs.org/#/) via a new template module: `formFor.materialTemplates`.

Updated `<radio-field>` components to work with an `options` collection (similar to `<select-field>` inputs).
Rather than declaring individual radio fields, you only need to declare one with a set of options.
This was done to support the nested structure required by Angular Material, but also simplifies other use-cases as well.

Also fixed an edge-case default with `NestedObjectHelper` that prevented it from correctly iterating over values in an array under certain conditions.

## 2.0.1
Added new formForBuilder directive in order to support auto-generated form markup.

## 2.0.0
Form For has been rewritten in TypeScript and a handful of issues have been resolved:

* 93: Required validation of objects with initial values
* 92: select-field : empty placeholder
* 85: validating number precision

This is a major release due to a slight change in markup structure for select-fields that may break existing custom styles. An additional `<span>` element has been added around the `<select>` inputs.

## 1.7.2
Fixed edge-case validation issue for required fields. Also fixed broken logic in unit tests.

## 1.7.1
Issue #91: Enable validateFields() method to show errors up failed validation.

## 1.7.0
Form-for release 1.7.0!
Fixed edge-case bug where validation changed string values (thanks @nikita-yaroshevich!)

New major version number is due to the change in behavior for 'positive' validation type (see #84).

## 1.6.1
Issue #65 Support configurable num-rows for multiline text fields.
Issue #72 Relax email-type validation to enable things like sub-domain addresses.
IE fix for binding to `placeholder` attribute

## 1.6.0
Issue #66 Fields marked with minlength validation are no longer required unless explicitly marked as such

## 1.5.4
Required fields fail validation if only whitespace is contained

## 1.5.3
Resolved several issues:
* Select fields no longer create duplicate id attribute-values.
* 63: Automatic validations can be disabled entirely using formFor validateOn=manual
* 62: Validation error messages can be set manual, per-field, using formFor controller setFieldError method
* 61: textField attributes are attached to $scope for easier customization of input and textarea partials.
* 59: Validation can be delayed until submit using formFor validateOn=submit

## 1.5.2
Issue 57 Allow input fields to be assigned specific UIDs (with fallback to auto-generated IDs if none specified).
Blur handler added to textField

## 1.5.1
Fixed small CSS bug for checkbox and radio buttons in disabled state (default formFor templates only)

## 1.5.0
Refactored form field markup and stylesheets for simplicity.

## 1.4.3
textField directive now allows for overriding of individual `<input>` and `<textarea>` elements separately from the surrounding template.
Validation 'types' no longer require values.

## 1.4.2
Removed jQuery dependency.
Field labels now support dynamic values.

## 1.4.1
Minor style tweaks, mostly around the <select-field> element.

## 1.4.0
Updated form markup for greate WCAG compliance. Followed very helpful guidance set forth in deque.com blog post ~ http://www.deque.com/blog/accessible-client-side-form-validation-html5/. Select fields are the most impacted, as they now use native <select> menus instead of styled drop-downs. All input elements should now be attributed with aria-labelledby, aria-describedby, and aria-invalid attributes.

## 1.3.3
formFor correct initializes fields in a disabled state if the form has been disabled to start. (issue #44)

## 1.3.2
Fixed small styling issue with filtered <select-field> directives in the default template module

## 1.3.1
Fixed small issue in default template where keydown ENTER events were being picked up by <select> field toggle button as click events. Added type='button' attribute.

## 1.3.0
Separated template HTML into separate modules for bootstrap and default. Also added improved support for tabbing and keyboard navigation (particularly regarding select menus). Removed the type-ahead field.

## 1.2.16
Select field directions may now be configured to drop in a specific direction: up, down, or auto. If auto, fields will drop based on their position within the viewport and a maxheight (currently hard-coded to 200).

## 1.2.15
Better handling of invalid, valid, and pristine icon states for fields that have been reset via formForController.resetField or formForController.resetFields/resetErrors.

## 1.2.14
Allow users to manually validate and reset validation errors on a per-field basis

## 1.2.13
Select-field's loading indicator can now be overriden with a template independently of select field's own template. New template is named select-field-loading-indicator.

## 1.2.12
Add option to prevent default selection of first option in options Array for selectFields.
Also fixed disabled style for disabled selectFields.

## 1.2.11
formForDebounce directive now supports IE8 by falling back to 'keydown' and 'paste' events if no 'input' event is available.

## 1.2.10
Added support for dynamic icons: pristine, valid, invalid.

## 1.2.8
Properly cleaning up after collection fields are unregistered to prevent false-positives on subsequent form validations.

This is a re-release of 1.2.7 in order to address the accidental debugger statement included in that release. NPM no longer allows force publishing on top of a bad release, so that release will be taken down.

## 1.2.5
Issue #28 Optional validation failure handler.
Issue #29 Add standard field-error component for easier template overrides.

## 1.2.4
Fixed a small bug in <select-field> that caused a default value not to be selected for non-allow-true fields with async loaded options.

## 1.2.3
Issue #27 individual fields 'disable' attribute 2-way bindable to support updates.
Also improved select-field UI when in its disabled state.

## 1.2.2
Radio fields with integer or false (boolean) values correctly evaled against strings containing same values.

## 1.2.1
Fixed slight error that prevented 'required' labels from being shown for forms configured via a 'service'

## 1.2.0
formFor now supports collections (and validations on collections as well as individual items within the collection).

## 1.1.11
Add annotations to support formFor compression. Also add minified version of formFor as part of dist.

## 1.1.10
Added support for auto-generating labels based on attribute names (issue #12). This feature can be turned off and on via FormForConfiguration.enableAutoLabels / FormForConfiguration.disableAutoLabels

## 1.1.9
* typeAhead fields now correctly reset model.bindable to null if options are deselected.
* Resolves #15 FormForConfiguration can now be used to globally enable 'required' field labels for fields that are required. Required label is only shown for select, type-ahead, and text inputs. (Checkboxes and radio fields look too busy with this label.)
* Resolves #10 textField icons can now broadcast click events via iconAfterClicked and iconBeforeClicked. Focus also buckets through an event.

## 1.1.8
Default values set and displayed correctly for selectField and typeAheadField components. (Resolves Issue #9.)

## 1.1.7
Removed Lodash requirement (see issue #8).

## 1.1.6
Select-field keyboard navigation.

* Tweaked styles slightly
* Added keyboard navigation to select field (up/down arrow to toggle selection, enter to confirm, esc to cancel)
* Type ahead pulls default debounce from FormForConfiguration service

## 1.1.5
Hardened up handling of typeahead fields with field names other than default

## 1.1.4
* Fixed filter text input at the top of the drop-down with scrollable contents underneath (better user experience)
* Added support for custom validation functions to throw errors (with error messages) or default objects with overrides of the default custom validation error message.
* Added type-ahead field, based on Angular's Bootstrap directive.

## 1.1.3
selectField directive now supports filtering (including potentially async)
Custom elements declare CSS display types.
Switched to angular.bind(this, func) away from Function.prototype.bind to help ease IE8 support.
Custom validations support truthy/falsy values now as per request from user.

## 1.1.2
Add new validation 'type' which supports integers, numbers, positive/negative values, and emails.
Fixed vertical alignment of help icon for formFor (non Bootstrap) styles.
Resolved issue:

* 3: In a select field, clicking on the label or help icon opens the select dropdown
* 4: Add autofocus attribute to focus on text input directive
* 5: Better handle invalid custo validation functions

## 1.1.1
Improved border colors for default, selected, and errored states.
Fixed Bootstrap input-group bug as reported in issue #2

## 1.1.0
Release 1.1.0 addresses the following features:

* Build on Bootstrap styles by default for easier integration (see issue #1). Now you can use either Bootstrap or custom formFor styles.
* Update <select-field> to more gracefully handle async-loaded options via $watch instead of warning.
* Allow <select-field> option keys to be overridden (instead of requiring value and label).
* Get rid of replace:true since it’s deprecated.
* FormForConfiguration service allows custom overrides for default error messages

## 1.0.4
Guard against edge-case for form-data that is not pre-initialized. This way we don't show validation errors when a user blurs an input (aka when ngModel lazily initializes the attribute.

## 1.0.3
Added some more default styling after trying out in a sandboxed (Plnkr) environment

## 1.0.2
Changed span to div ing input-field templates for easier styling

## 1.0.1
Replaced form.submit() with form.on('submit') to be more jQlite-friendly

## 1.0.0
First release of Angular formFor directive.
