module formFor {

  /**
   * Supplies $q service with additional methods.
   *
   * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
   */
  export class PromiseUtils implements ng.IQService {

    private $q_:ng.IQService;

    /**
     * Constructor.
     *
     * @param $q Injector-supplied $q service
     */
    constructor($q:ng.IQService) {
      this.$q_ = $q;
    }

    /**
     * @inheritDoc
     */
    all(promises:ng.IPromise<any>[]):ng.IPromise<any[]> {
      return this.$q_.all(promises);
    }

    /**
     * @inheritDoc
     */
    defer<T>():ng.IDeferred<T> {
      return this.$q_.defer();
    }

    /**
     * Similar to $q.reject, this is a convenience method to create and resolve a Promise.
     *
     * @param data Value to resolve the promise with
     * @returns A resolved promise
     */
    resolve(data?:any):ng.IPromise<any> {
      var deferred:ng.IDeferred<any> = this.$q_.defer();
      deferred.resolve(data);

      return deferred.promise;
    }

    /**
     * @inheritDoc
     */
    reject(reason?:any):ng.IPromise<void> {
      return this.$q_.reject(reason);
    }

    /**
     * Similar to $q.all but waits for all promises to resolve/reject before resolving/rejecting.
     *
     * @param promises Array of Promises
     * @returns A promise to be resolved or rejected once all of the observed promises complete
     */
    waitForAll(promises:ng.IPromise<any>[]):ng.IPromise<any> {
      var deferred:ng.IDeferred<any> = this.$q_.defer();
      var results:Object = {};
      var counter:number = 0;
      var errored:boolean = false;

      function updateResult(key:string, data:any):void {
        if (!results.hasOwnProperty(key)) {
          results[key] = data;

          counter--;
        }

        checkForDone();
      }

      function checkForDone():void {
        if (counter === 0) {
          if (errored) {
            deferred.reject(results);
          } else {
            deferred.resolve(results);
          }
        }
      }

      angular.forEach(promises, (promise:ng.IPromise<any>, key:string) => {
        counter++;

        promise.then(
          (data:any) => {
            updateResult(key, data);
          },
          (data:any) => {
            errored = true;

            updateResult(key, data);
          });
      });

      checkForDone(); // Handle empty Array

      return deferred.promise;
    }

    /**
     * @inheritDoc
     */
    when<T>(value:T):ng.IPromise<T> {
      return this.$q_.when(value);
    }
  }
}