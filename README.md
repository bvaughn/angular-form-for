# Angular formFor

![Angular formFor logo](http://bvaughn.github.io/angular-form-for/app/images/form-for-logo-small.png)

*formFor* is a quick and easy way to declare complex HTML forms with client and server-side validations.
Using *formFor* a sign-up form may look like this:

```html
<form form-for="user" service="UserSignUp">
  <text-field attribute="email"></text-field>
  <text-field attribute="password" type="password"></text-field>
  <checkbox-field attribute="iAgreeToTheTerms"></checkbox-field>
  <submit-button label="Sign Up"></submit-button>
</form>
```

But that's not all! *formFor* is incredibly flexible, offering a wide range of configuration options.
Check out the website to learn more!

[http://bvaughn.github.io/angular-form-for/](http://bvaughn.github.io/angular-form-for/)

## Installation

You can install this plugin with either [Bower](http://bower.io/) or [NPM](https://www.npmjs.org/):

```shell
bower install angular-form-for --save-dev
npm install angular-form-for --save-dev
```

This will download an `angular-form-for` folder into your bower/node components directory. Inside of that folder there will be a `dist` folder with the *formFor* JavaScript and CSS files. By default *formFor* is compatible with [Bootstrap](getbootstrap.com) 3.2.x styles. A separate, *formFor* only CSS stylehseet is included for those not using Bootstrap.

Lastly just include the *formFor* module in your Angular application like so:

```js
angular.module('myAngularApp', ['formFor']);
```

## License

Copyright (c) 2014 Brian Vaughn. Licensed under the MIT license.
