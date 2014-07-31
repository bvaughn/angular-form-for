# Angular formFor

> Set of Angular directives and services to simplify creating and validating HTML forms.

## Usage

You can install this plugin with either [Bower](http://bower.io/) or [NPM](https://www.npmjs.org/).

### Bower
```shell
bower install angular-form-for --save-dev
```

### NPM
```shell
npm install angular-form-for --save-dev
```

Then just include the *formFor* module in your Angular application like so:

```js
angular.module('myAngularApp', ['formFor']);
```

## About this plugin

The *formFor* directive simplifies the process of creating and managing HTML forms as well as (potentially asynchronous) form validation. What does this mean? We'll go over an example below.

You can also head over to the [API Reference](#TODO) section of the wiki for more detailed information.

### Creating a form

Using *formFor*, you could create a simple sign-up form as follows:

```html
<form form-for="user" validate-as="UserSignUp">
  <text-field title="Username" field="username"></text-field>
  <text-field title="Password" field="password" type="password"></text-field>
  <text-field title="Email" field="email"></text-field>
  <button>Sign Up!</button>
</form>
```

The above form will read/write data to a `$scope.user` object and will validate itself against a set of rules defined in a `UserSignUp` service. If validation errors occur they will automatically be displayed inline.

### Validating form data

In the above example we told *formFor* to look for validation rules in a `UserSignUp` service.
That service might look something like this:

```js
angular.module('myAngularApp').service('User', function(ValidatableModel) {
    var User = Object.create(ValidatableModel);

    User.ruleSetMap = {
      email: {
        required: true,
        pattern: /^\w+@\w+\.\w+$/ // Simple email format
      },
      username: {
        required: true,
      },
      password: {
        required: true,
        minlength: 10,
        pattern: /[0-9]/ // Requires at least one number
      }
    };

    return User;
  });
```

### Submitting data

All that's left is to tell *formFor* how to submit our sign-up data once it's considered valid.
We can do that either by defining a `submit` method on the `UserSignUp` service *or* by assigning a custom `submit-with` handler to our form. Let's do the first one. For our example we'll use the [Restangular](https://github.com/mgonto/restangular) library:

```js
angular.module('myAngularApp').service('User', function(Restangular, ValidatableModel) {
    var User = Object.create(ValidatableModel);

    User.ruleSetMap; // Hidden for brevity

    User.submit = function(data) {
      return RecurlyRestangular.one('user/sign-up').put(data);
    };

    return User;
  });

```

### What's next!

We've just created a simple but powerful sign-up form using very minimal HTML markup.
We've only begun to scratch the service of what *formFor* can do though.
To learn more check out the [Usage Examples](#TODO) or [API Reference](#TODO) pages on the wiki.

# License

Copyright (c) 2014 Brian Vaughn. Licensed under the MIT license.
