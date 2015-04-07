describe('PromiseUtils', function() {
  'use strict';

  beforeEach(module('formFor'));

  var $q;
  var $rootScope;
  var promiseUtils;

  beforeEach(inject(function ($injector) {
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    promiseUtils = new formFor.PromiseUtils($q);
  }));

  afterEach(inject(function() {
    $rootScope.$apply(); // Necessary for promise assertions below
  }));

  describe('resolve', function() {
    it('should function like reject', function() {
      expect(promiseUtils.resolve(true)).toBeResolvedWith(true);
    });
  });

  describe('waitForAll', function() {
    var deferred1, deferred2, deferred3;
    var waitForAll, resolution, rejection;

    beforeEach(function() {
      deferred1 = $q.defer();
      deferred2 = $q.defer();
      deferred3 = $q.defer();

      resolution = rejection = null;

      waitForAll = promiseUtils.waitForAll([deferred1.promise, deferred2.promise, deferred3.promise]);
      waitForAll.then(
        function(data) {
          resolution = data;
        },
        function(data) {
          rejection = data;
        });
    });

    it('should resolve immediately if sent an empty collecton of promises', function() {
      waitForAll = promiseUtils.waitForAll([]);

      expect(waitForAll).toBeResolved();
    });

    it('should wait until all inner promises have been resolved or rejected before completing', function() {
      $rootScope.$apply(); // Force any pending resolutions

      expect(rejection).toBeFalsy();
      expect(resolution).toBeFalsy();

      deferred1.resolve();

      $rootScope.$apply(); // Force any pending resolutions

      expect(rejection).toBeFalsy();
      expect(resolution).toBeFalsy();

      deferred2.resolve();

      $rootScope.$apply(); // Force any pending resolutions

      expect(rejection).toBeFalsy();
      expect(resolution).toBeFalsy();

      expect(waitForAll).toBeResolved();

      deferred3.resolve();

      $rootScope.$apply(); // Force any pending resolutions

      expect(resolution).toBeTruthy();
    });

    it('should resolve if inner promises resolve', function() {
      deferred1.resolve();
      deferred2.resolve();
      deferred3.resolve();

      expect(waitForAll).toBeResolved();
    });

    it('should reject if any inner promises reject', function() {
      deferred1.resolve();
      deferred2.reject();
      deferred3.resolve();

      expect(waitForAll).toBeRejected();
    });

    it('should return an array of data containing the datum from each resolved/rejected promise', function() {
      deferred1.resolve('resolution 1');
      deferred2.reject('rejection 2');
      deferred3.resolve('resolution 3');

      $rootScope.$apply(); // Force any pending resolutions

      expect(rejection[0]).toEqual('resolution 1');
      expect(rejection[1]).toEqual('rejection 2');
      expect(rejection[2]).toEqual('resolution 3');
    });
  });

});
