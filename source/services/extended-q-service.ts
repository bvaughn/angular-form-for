/**
 * Describes an extended $q service with additional mixed-in methods.
 */
interface ExtendedQService extends ng.IQService {

  /**
   * Similar to $q.reject, this is a convenience method to create and resolve a Promise.
   *
   * @param data Value to resolve the promise with
   * @returns A resolved promise
   */
  resolve(data?:any):ng.IPromise<any>;

  /**
   * Similar to $q.all but waits for all promises to resolve/reject before resolving/rejecting.
   *
   * @param promises Array of Promises
   * @returns A promise to be resolved or rejected once all of the observed promises complete
   */
  waitForAll(promises:ng.IPromise<any>[]):ng.IPromise<any>;
};

/**
 * Factory function that extends the $q delegate.
 */
function extendedQService($q:ng.IQService):Object {
  return {
    resolve: function(data:any):ng.IPromise<any> {
      var deferred:ng.IDeferred<any> = this.$q_.defer();
      deferred.resolve(data);

      return deferred.promise;
    },

    waitForAll: function(promises:ng.IPromise<any>[]):ng.IPromise<any> {
      var deferred:ng.IDeferred<any> = this.$q_.defer();
      var results:Object = {};
      var counter:number = 0;
      var errored:boolean = false;

      function udpateResult(key, data) {
        if (!results.hasOwnProperty(key)) {
          results[key] = data;

          counter--;
        }

        checkForDone();
      }

      function checkForDone() {
        if (counter === 0) {
          if (errored) {
            deferred.reject(results);
          } else {
            deferred.resolve(results);
          }
        }
      }

      angular.forEach(promises, (promise, key) => {
        counter++;

        promise.then(
          function(data) {
            udpateResult(key, data);
          },
          function(data) {
            errored = true;

            udpateResult(key, data);
          });
      });

      checkForDone(); // Handle empty Array

      return deferred.promise;
    }
  };
}

angular.module('formFor').config(
  function($provide) {
    $provide.decorator('$q', ($q) => extendedQService($q));
  });
