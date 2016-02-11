# This repository is no longer actively maintained.

Issue reports and pull requests will probably not be attended.

I am no longer working with Angular on a regular basis. My day job has switched to React and it's too much effort to context switch between the frameworks. Given the upcoming Angular 2.0 release it seems like a reasonable time to end support for this library.

Thanks to all of you for using, supporting, and contributing to this project.

# angular-form-for [![Build Status](https://travis-ci.org/bvaughn/angular-form-for.svg)](https://travis-ci.org/bvaughn/angular-form-for) [![Join the chat at https://gitter.im/bvaughn/angular-form-for](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bvaughn/angular-form-for?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

*formFor* is a quick and easy way to declare complex HTML forms with client and server-side validations.
You can generate a complete form with as little markup as this:

```html
<form form-for="user" service="SignUpService"></form>
```

But that's not all! *formFor* is incredibly flexible, offering a wide range of configuration options.
Check out the official website to learn more:
[http://bvaughn.github.io/angular-form-for/](http://bvaughn.github.io/angular-form-for/)

## Compatibility and Dependencies

*formFor* is compatible with Angular Angular 1.2 and newer. It does not require any third party libraries such as jQuery, lodash, or underscore.

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

## Contributions

Interested in contributing? Check out the [contribution guidelines](CONTRIBUTING.md)!

## License

Copyright (c) 2014 Brian Vaughn. Licensed under the MIT license.
