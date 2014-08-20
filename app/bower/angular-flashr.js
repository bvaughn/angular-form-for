'use strict';
angular.module('flashr', [])
    .factory('flashr', ['$rootScope',
        function ($rootScope) {
            var _lastToast = null;
            var _toasts = [];
            var _toastType = {
                error: 'error',
                info: 'info',
                success: 'success',
                warning: 'warning'
            };

            // when the route changes, flash the "later" messages
            $rootScope.$on('$routeChangeSuccess', function () {
                for (var i = 0; i < _toasts.length; i++) {
                    var toast = _toasts[i];
                    toast(toast.type, toast.msg);
                    _toasts = _.difference(toast, _toasts);
                }
            });

            return {
                now: {
                    success: nowSuccess,
                    info: nowInfo,
                    warning: nowWarning,
                    error: nowError
                },
                later: {
                    success: laterSuccess,
                    info: laterInfo,
                    warning: laterWarning,
                    error: laterError
                },
                clear: function() {
                    if (_lastToast != null) {
                        toastr.clear(_lastToast);
                        _lastToast = null;
                    }
                }
            };

            function nowSuccess(message) {
                toast(_toastType.success, message);
            }

            function nowInfo(message) {
                toast(_toastType.info, message);
            }

            function nowWarning(message) {
                toast(_toastType.warning, message);
            }

            function nowError(message) {
                toast(_toastType.error, message);
            }

            function laterSuccess(message) {
                _toasts.push({ type: _toastType.success, msg: message });
            }

            function laterInfo(message) {
                _toasts.push({ type: _toastType.info, msg: message });
            }

            function laterWarning(message) {
                _toasts.push({ type: _toastType.warning, msg: message });
            }

            function laterError(message) {
                _toasts.push({ type: _toastType.error, msg: message });
            }

            function toast(type, message) {
                if (_lastToast != null) {
                    toastr.clear(_lastToast);
                    _lastToast = null;
                }
                _lastToast = toastr[type](message);
            }
        }]);