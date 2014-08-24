angular.module('formForDocumentation').service('Github', function($http, $q) {
  this.load = function() {
    var deferred = $q.defer();
    deferred.promise.$object = {};

    $http.get('https://api.github.com/repos/bvaughn/angular-form-for').
      success(
        function(response) {
          deferred.promise.$object.forks = response.forks_count;
          deferred.promise.$object.forks_url = response.html_url + '/network';
          deferred.promise.$object.stargazers = response.stargazers_count;
          deferred.promise.$object.stargazers_url = response.html_url + '/stargazers';
          deferred.promise.$object.url = response.html_url;
          deferred.promise.$object.watchers = response.subscribers_count;
          deferred.promise.$object.watchers_url = response.html_url + '/watchers';

          deferred.resolve(deferred.promise.$object);
        }).
      error(deferred.reject);

    return deferred.promise;
  };
});
