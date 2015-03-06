/// <reference path="../definitions/angular.d.ts" />
angular.module('formFor', []);
var FormFor = (function () {
    function FormFor() {
    }
    return FormFor;
})();
;
angular.module('formFor').directive('formFor', function () { return FormFor; });
/**
 * Identifies a validation failure type.
 */
var ValidationFailureType;
(function (ValidationFailureType) {
    ValidationFailureType[ValidationFailureType["COLLECTION_MAX_SIZE"] = "COLLECTION_MAX_SIZE"] = "COLLECTION_MAX_SIZE";
    ValidationFailureType[ValidationFailureType["COLLECTION_MIN_SIZE"] = "COLLECTION_MIN_SIZE"] = "COLLECTION_MIN_SIZE";
    ValidationFailureType[ValidationFailureType["CUSTOM"] = "CUSTOM"] = "CUSTOM";
    ValidationFailureType[ValidationFailureType["MAX_LENGTH"] = "MAX_LENGTH"] = "MAX_LENGTH";
    ValidationFailureType[ValidationFailureType["MIN_LENGTH"] = "MIN_LENGTH"] = "MIN_LENGTH";
    ValidationFailureType[ValidationFailureType["PATTERN"] = "PATTERN"] = "PATTERN";
    ValidationFailureType[ValidationFailureType["REQUIRED"] = "REQUIRED_FIELD"] = "REQUIRED";
    ValidationFailureType[ValidationFailureType["TYPE_EMAIL"] = "TYPE_EMAIL"] = "TYPE_EMAIL";
    ValidationFailureType[ValidationFailureType["TYPE_INTEGER"] = "TYPE_INTEGER"] = "TYPE_INTEGER";
    ValidationFailureType[ValidationFailureType["TYPE_NEGATIVE"] = "TYPE_NEGATIVE"] = "TYPE_NEGATIVE";
    ValidationFailureType[ValidationFailureType["TYPE_NON_NEGATIVE"] = "TYPE_NON_NEGATIVE"] = "TYPE_NON_NEGATIVE";
    ValidationFailureType[ValidationFailureType["TYPE_NUMERIC"] = "TYPE_NUMERIC"] = "TYPE_NUMERIC";
    ValidationFailureType[ValidationFailureType["TYPE_POSITIVE"] = "TYPE_POSITIVE"] = "TYPE_POSITIVE";
})(ValidationFailureType || (ValidationFailureType = {}));
;
/**
 * Constraints that can be applied to a form field.
 * These constraints can be combined (e.g. "positive integer").
 */
var ValidationFieldType;
(function (ValidationFieldType) {
    ValidationFieldType[ValidationFieldType["EMAIL"] = "email"] = "EMAIL";
    ValidationFieldType[ValidationFieldType["INTEGER"] = "integer"] = "INTEGER";
    ValidationFieldType[ValidationFieldType["NEGATIVE"] = "negative"] = "NEGATIVE";
    ValidationFieldType[ValidationFieldType["NON_NEGATIVE"] = "nonNegative"] = "NON_NEGATIVE";
    ValidationFieldType[ValidationFieldType["NUMBER"] = "number"] = "NUMBER";
    ValidationFieldType[ValidationFieldType["POSITIVE"] = "positive"] = "POSITIVE";
})(ValidationFieldType || (ValidationFieldType = {}));
;
;
/**
 * Wrapper object for a form-field attribute that exposes field-state to field directives.
 *
 * <p>Note that this interface exists for type-checking only; nothing actually implements this interface.
 */
var BindableFieldWrapper = (function () {
    function BindableFieldWrapper() {
    }
    return BindableFieldWrapper;
})();
;
;
;
;
;
/**
 * Various helper methods for functionality shared between formFor field directives.
 */
var FieldHelper = (function () {
    function FieldHelper(FormForConfiguration) {
        this.formForConfiguration_ = FormForConfiguration;
    }
    /**
     * Determines the field's label based on its current attributes and the FormForConfiguration configuration settings.
     * Also watches for changes in the (attributes) label and updates $scope accordingly.
     *
     * @param $scope Directive link $scope
     * @param $attributes Directive link $attributes
     * @param humanizeValueAttribute Fall back to a humanized version of the :value attribute if no label is provided;
     *                               This can be useful for radio options where the label should represent the value.
     *                               By default, a humanized version of the :attribute attribute will be used.
     */
    FieldHelper.prototype.manageLabel = function ($scope, $attributes, humanizeValueAttribute) {
        if ($attributes.hasOwnProperty('label')) {
            $attributes.$observe('label', function (label) {
                $scope['label'] = label;
            });
        }
        if (this.formForConfiguration_.autoGenerateLabels) {
            $scope['label'] = humanizeValueAttribute ? StringUtil.humanize($scope['value']) : StringUtil.humanize($scope['attribute']);
        }
    };
    /**
     * Helper method that registers a form field and stores the bindable object returned on the $scope.
     * This method also unregisters the field on $scope $destroy.
     *
     * @param $scope Input field $scope
     * @param $attributes Input field $attributes element
     * @param formForController Controller object for parent formFor
     */
    FieldHelper.prototype.manageFieldRegistration = function ($scope, $attributes, formForController) {
        $scope.$watch('attribute', function (newValue, oldValue) {
            if ($scope['model']) {
                formForController.unregisterFormField(oldValue);
            }
            $scope['model'] = formForController.registerFormField($scope['attribute']);
            if ($attributes['uid']) {
                $scope['model']['uid'] = $attributes['uid'];
            }
        });
        $scope.$on('$destroy', function () {
            formForController.unregisterFormField($scope['attribute']);
        });
    };
    return FieldHelper;
})();
;
angular.module('formFor').service('FieldHelper', function (FormForConfiguration) { return new FieldHelper(FormForConfiguration); });
/// <reference path="../../definitions/angular.d.ts" />
/**
 * This service can be used to configure default behavior for all instances of formFor within a project.
 * Note that it is a service accessible to during the run loop and not a provider accessible during config.
 */
var FormForConfiguration = (function () {
    function FormForConfiguration() {
        this.autoGenerateLabels_ = false;
        this.defaultDebounceDuration_ = 500;
        this.defaultSubmitComplete_ = function () {
        };
        this.defaultSubmitError_ = function () {
        };
        this.defaultValidationFailed_ = function () {
        };
        this.requiredLabel_ = null;
        this.validationFailedForCustomMessage_ = "Failed custom validation";
        this.validationFailedForEmailTypeMessage_ = "Invalid email format";
        this.validationFailedForIntegerTypeMessage_ = "Must be an integer";
        this.validationFailedForMaxCollectionSizeMessage_ = "Must be fewer than {{num}} items";
        this.validationFailedForMaxLengthMessage_ = "Must be fewer than {{num}} characters";
        this.validationFailedForMinCollectionSizeMessage_ = "Must at least {{num}} items";
        this.validationFailedForMinLengthMessage_ = "Must be at least {{num}} characters";
        this.validationFailedForNegativeTypeMessage_ = "Must be negative";
        this.validationFailedForNonNegativeTypeMessage_ = "Must be non-negative";
        this.validationFailedForNumericTypeMessage_ = "Must be numeric";
        this.validationFailedForPatternMessage_ = "Invalid format";
        this.validationFailedForPositiveTypeMessage_ = "Must be positive";
        this.validationFailedForRequiredMessage_ = "Required field";
    }
    Object.defineProperty(FormForConfiguration.prototype, "autoGenerateLabels", {
        // Getters and setters ///////////////////////////////////////////////////////////////////////////////////////////////
        // TODO Add better documentation
        get: function () {
            return this.autoGenerateLabels_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormForConfiguration.prototype, "defaultDebounceDuration", {
        get: function () {
            return this.defaultDebounceDuration_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormForConfiguration.prototype, "defaultSubmitComplete", {
        get: function () {
            return this.defaultSubmitComplete_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormForConfiguration.prototype, "defaultSubmitError", {
        get: function () {
            return this.defaultSubmitError_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormForConfiguration.prototype, "defaultValidationFailed", {
        get: function () {
            return this.defaultValidationFailed_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormForConfiguration.prototype, "requiredLabel", {
        get: function () {
            return this.requiredLabel_;
        },
        enumerable: true,
        configurable: true
    });
    // Public methods ////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Use this method to disable auto-generated labels for formFor input fields.
     */
    FormForConfiguration.prototype.disableAutoLabels = function () {
        this.autoGenerateLabels_ = false;
    };
    /**
     * Use this method to enable auto-generated labels for formFor input fields.
     * Labels will be generated based on attribute-name for fields without a label attribute present.
     * Radio fields are an exception to this rule.
     * Their names are generated from their values.
     */
    FormForConfiguration.prototype.enableAutoLabels = function () {
        this.autoGenerateLabels_ = true;
    };
    /**
     * Returns the appropriate error message for the validation failure type.
     */
    FormForConfiguration.prototype.getFailedValidationMessage = function (failureType) {
        switch (failureType) {
            case ValidationFailureType.CUSTOM:
                return this.validationFailedForCustomMessage_;
            case ValidationFailureType.COLLECTION_MAX_SIZE:
                return this.validationFailedForMaxCollectionSizeMessage_;
            case ValidationFailureType.COLLECTION_MIN_SIZE:
                return this.validationFailedForMinCollectionSizeMessage_;
            case ValidationFailureType.MAX_LENGTH:
                return this.validationFailedForMaxLengthMessage_;
            case ValidationFailureType.MIN_LENGTH:
                return this.validationFailedForMinLengthMessage_;
            case ValidationFailureType.PATTERN:
                return this.validationFailedForPatternMessage_;
            case ValidationFailureType.REQUIRED:
                return this.validationFailedForRequiredMessage_;
            case ValidationFailureType.TYPE_EMAIL:
                return this.validationFailedForEmailTypeMessage_;
            case ValidationFailureType.TYPE_INTEGER:
                return this.validationFailedForIntegerTypeMessage_;
            case ValidationFailureType.TYPE_NEGATIVE:
                return this.validationFailedForNegativeTypeMessage_;
            case ValidationFailureType.TYPE_NON_NEGATIVE:
                return this.validationFailedForNonNegativeTypeMessage_;
            case ValidationFailureType.TYPE_NUMERIC:
                return this.validationFailedForNumericTypeMessage_;
            case ValidationFailureType.TYPE_POSITIVE:
                return this.validationFailedForPositiveTypeMessage_;
        }
    };
    /**
     * Sets the default debounce interval (in ms) for all textField inputs.
     * This setting can be overridden on a per-input basis (see textField).
     * Defaults to 500ms.
     * To disable debounce (update only on blur) pass false.
     */
    FormForConfiguration.prototype.setDefaultDebounceDuration = function (value) {
        this.defaultDebounceDuration_ = value;
    };
    /**
     * Sets the default submit-complete behavior for all formFor directives.
     * This setting can be overridden on a per-form basis (see formFor).
     *
     * Default handler function accepting a data parameter representing the server-response returned by the submitted form.
     * This function should accept a single parameter, the response data from the form-submit method.
     */
    FormForConfiguration.prototype.setDefaultSubmitComplete = function (value) {
        this.defaultSubmitComplete_ = value;
    };
    /**
     * Sets the default submit-error behavior for all formFor directives.
     * This setting can be overridden on a per-form basis (see formFor).
     * @memberof FormForConfiguration
     * @param {Function} method Default handler function accepting an error parameter representing the data passed to the rejected submit promise.
     * This function should accept a single parameter, the error returned by the form-submit method.
     */
    FormForConfiguration.prototype.setDefaultSubmitError = function (value) {
        this.defaultSubmitError_ = value;
    };
    /**
     * Sets the default validation-failed behavior for all formFor directives.
     * This setting can be overridden on a per-form basis (see formFor).
     * @memberof FormForConfiguration
     * @param {Function} method Default function invoked when local form validation fails.
     */
    FormForConfiguration.prototype.setDefaultValidationFailed = function (value) {
        this.defaultValidationFailed_ = value;
    };
    /**
     * Sets a default label to be displayed beside each text and select input for required attributes only.
     */
    FormForConfiguration.prototype.setRequiredLabel = function (value) {
        this.requiredLabel_ = value;
    };
    /**
     * Override the default error message for failed custom validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForCustomMessage = function (value) {
        this.validationFailedForCustomMessage_ = value;
    };
    /**
     * Override the default error message for failed max collection size validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForMaxCollectionSizeMessage = function (value) {
        this.validationFailedForMaxCollectionSizeMessage_ = value;
    };
    /**
     * Override the default error message for failed maxlength validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForMaxLengthMessage = function (value) {
        this.validationFailedForMaxLengthMessage_ = value;
    };
    /**
     * Override the default error message for failed min collection size validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForMinCollectionSizeMessage = function (value) {
        this.validationFailedForMaxCollectionSizeMessage_ = value;
    };
    /**
     * Override the default error message for failed minlength validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForMinLengthMessage = function (value) {
        this.validationFailedForMinLengthMessage_ = value;
    };
    /**
     * Override the default error message for failed pattern validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForPatternMessage = function (value) {
        this.validationFailedForPatternMessage_ = value;
    };
    /**
     * Override the default error message for failed required validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForRequiredMessage = function (value) {
        this.validationFailedForRequiredMessage_ = value;
    };
    /**
     * Override the default error message for failed type = 'email' validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForEmailTypeMessage = function (value) {
        this.validationFailedForEmailTypeMessage_ = value;
    };
    /**
     * Override the default error message for failed type = 'integer' validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForIntegerTypeMessage = function (value) {
        this.validationFailedForIntegerTypeMessage_ = value;
    };
    /**
     * Override the default error message for failed type = 'negative' validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForNegativeTypeMessage = function (value) {
        this.validationFailedForNegativeTypeMessage_ = value;
    };
    /**
     * Override the default error message for failed type = 'nonNegative' validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForNonNegativeTypeMessage = function (value) {
        this.validationFailedForNonNegativeTypeMessage_ = value;
    };
    /**
     * Override the default error message for failed type = 'numeric' validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForNumericTypeMessage = function (value) {
        this.validationFailedForNumericTypeMessage_ = value;
    };
    /**
     * Override the default error message for failed type = 'positive' validations.
     * This setting applies to all instances of formFor unless otherwise overridden on a per-rule basis.
     */
    FormForConfiguration.prototype.setValidationFailedForPositiveTypeMessage = function (value) {
        this.validationFailedForPositiveTypeMessage_ = value;
    };
    return FormForConfiguration;
})();
;
angular.module('formFor').service('FormForConfiguration', function () { return new FormForConfiguration(); });
/// <reference path="../../definitions/angular.d.ts" />
/**
 * Helper utility to simplify working with nested objects.
 *
 * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
 */
var NestedObjectHelper = (function () {
    /**
     * Constructor.
     *
     * @param $q Injector-supplied $q service, decorated with a few additional formFor-added methods.
     */
    function NestedObjectHelper($parse) {
        this.$parse_ = $parse;
    }
    /**
     * Converts a field name (which may contain dots or array indices) into a string that can be used to key an object.
     * e.g. a field name like 'items[0].name' would be converted into 'items___0______name'
     *
     * @param fieldName Attribute (or dot-notation path) to read
     * @returns Modified field name safe to use as an object key
     */
    NestedObjectHelper.prototype.flattenAttribute = function (fieldName) {
        return fieldName.replace(/\[([^\]]+)\]\.{0,1}/g, '___$1___').replace(/\./g, '___');
    };
    /**
     * Crawls an object and returns a flattened set of all attributes using dot notation.
     * This converts an Object like: {foo: {bar: true}, baz: true} into an Array like ['foo', 'foo.bar', 'baz'].
     *
     * @param object Object to be flattened
     * @returns Array of flattened keys (perhaps containing dot notation)
     */
    NestedObjectHelper.prototype.flattenObjectKeys = function (object) {
        var keys = [];
        var queue = [{
            object: object,
            prefix: null
        }];
        while (true) {
            if (queue.length === 0) {
                break;
            }
            var data = queue.pop();
            var prefix = data.prefix ? data.prefix + '.' : '';
            if (typeof data.object === 'object') {
                for (var prop in data.object) {
                    var path = prefix + prop;
                    keys.push(path);
                    queue.push({
                        object: data.object[prop],
                        prefix: path
                    });
                }
            }
        }
        return keys;
    };
    /**
     * Returns the value defined by the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     *
     * @param object Object ot be read
     * @param fieldName Attribute (or dot-notation path) to read
     * @returns Value defined at the specified key
     */
    NestedObjectHelper.prototype.readAttribute = function (object, fieldName) {
        return this.$parse_(fieldName)(object);
    };
    /**
     * Writes the specified value to the specified attribute.
     * This function guards against dot notation for nested references (ex. 'foo.bar').
     *
     * @param object Object ot be updated
     * @param fieldName Attribute (or dot-notation path) to update
     * @param value Value to be written
     */
    NestedObjectHelper.prototype.writeAttribute = function (object, fieldName, value) {
        this.initializeArraysAndObjectsForParse_(object, fieldName);
        this.$parse_(fieldName).assign(object, value);
    };
    // Helper methods ////////////////////////////////////////////////////////////////////////////////////////////////////
    // For Angular 1.2.21 and below, $parse does not handle array brackets gracefully.
    // Essentially we need to create Arrays that don't exist yet or objects within array indices that don't yet exist.
    // @see https://github.com/angular/angular.js/issues/2845
    NestedObjectHelper.prototype.initializeArraysAndObjectsForParse_ = function (object, attribute) {
        var startOfArray = 0;
        while (true) {
            startOfArray = attribute.indexOf('[', startOfArray);
            if (startOfArray < 0) {
                break;
            }
            var arrayAttribute = attribute.substr(0, startOfArray);
            var possibleArray = this.readAttribute(object, arrayAttribute);
            // Create the Array if it doesn't yet exist
            if (!possibleArray) {
                possibleArray = [];
                this.writeAttribute(object, arrayAttribute, possibleArray);
            }
            // Create an empty Object in the Array if the user is about to write to one (and one does not yet exist)
            var match = attribute.substr(startOfArray).match(/([0-9]+)\]\./);
            if (match) {
                var targetIndex = parseInt(match[1]);
                if (!possibleArray[targetIndex]) {
                    possibleArray[targetIndex] = {};
                }
            }
            // Increment and keep scanning
            startOfArray++;
        }
    };
    return NestedObjectHelper;
})();
;
/**
 * Supplies $q service with additional methods.
 *
 * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
 */
var PromiseUtils = (function () {
    /**
     * Constructor.
     *
     * @param $q Injector-supplied $q service
     */
    function PromiseUtils($q) {
        this.$q_ = $q;
    }
    /**
     * Similar to $q.reject, this is a convenience method to create and resolve a Promise.
     *
     * @param data Value to resolve the promise with
     * @returns A resolved promise
     */
    PromiseUtils.prototype.resolve = function (data) {
        var deferred = this.$q_.defer();
        deferred.resolve(data);
        return deferred.promise;
    };
    /**
     * Similar to $q.all but waits for all promises to resolve/reject before resolving/rejecting.
     *
     * @param promises Array of Promises
     * @returns A promise to be resolved or rejected once all of the observed promises complete
     */
    PromiseUtils.prototype.waitForAll = function (promises) {
        var deferred = this.$q_.defer();
        var results = {};
        var counter = 0;
        var errored = false;
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
                }
                else {
                    deferred.resolve(results);
                }
            }
        }
        angular.forEach(promises, function (promise, key) {
            counter++;
            promise.then(function (data) {
                udpateResult(key, data);
            }, function (data) {
                errored = true;
                udpateResult(key, data);
            });
        });
        checkForDone(); // Handle empty Array
        return deferred.promise;
    };
    return PromiseUtils;
})();
;
/// <reference path="../../definitions/angular.d.ts" />
/// <reference path="form-for-configuration.ts" />
/// <reference path="../utils/nested-object-helper.ts" />
/// <reference path="../utils/promise-utils.ts" />
/**
 * Model validation service.
 */
var ModelValidator = (function () {
    /**
     * Constructor.
     *
     * @param $interpolate Injector-supplied $interpolate service
     * @param $parse Injecter-supplied $parse service
     * @param $q Injector-supplied $q service
     * @param formForConfiguration
     */
    function ModelValidator($interpolate, $parse, $q, formForConfiguration) {
        this.$interpolate_ = $interpolate;
        this.$q_ = $q;
        this.formForConfiguration_ = formForConfiguration;
        this.nestedObjectHelper_ = new NestedObjectHelper($parse);
        this.promiseUtils_ = new PromiseUtils($q);
    }
    /**
     * Determines if the specified collection is required (requires a minimum number of items).
     *
     * @param fieldName Name of field containing the collection.
     * @param validationRuleSet Map of field names to validation rules
     */
    ModelValidator.prototype.isCollectionRequired = function (fieldName, validationRuleSet) {
        var validationRules = this.getRulesFor_(fieldName, validationRuleSet);
        if (validationRules && validationRules.collection && validationRules.collection.min) {
            if (angular.isObject(validationRules.collection.min)) {
                return validationRules.collection.min.rule > 0;
            }
            else {
                return validationRules.collection.min > 0;
            }
        }
        return false;
    };
    /**
     * Determines if the specified field is flagged as required.
     *
     * @param fieldName Name of field in question.
     * @param validationRuleSet Map of field names to validation rules
     */
    ModelValidator.prototype.isFieldRequired = function (fieldName, validationRuleSet) {
        var validationRules = this.getRulesFor_(fieldName, validationRuleSet);
        if (validationRules && validationRules.required) {
            if (angular.isObject(validationRules.required)) {
                return validationRules.required.rule;
            }
            else {
                return !!validationRules.required;
            }
        }
        return false;
    };
    /**
     * Validates the model against all rules in the validationRules.
     * This method returns a promise to be resolved on successful validation,
     * or rejected with a map of field-name to error-message.
     *
     * @param formData Form-data object model is contained within
     * @param validationRuleSet Map of field names to validation rules
     * @return Promise to be resolved or rejected based on validation success or failure.
     */
    ModelValidator.prototype.validateAll = function (formData, validationRuleSet) {
        var fieldNames = this.nestedObjectHelper_.flattenObjectKeys(formData);
        return this.validateFields(formData, fieldNames, validationRuleSet);
    };
    /**
     * Validate the properties of a collection (but not the items within the collection).
     * This method returns a promise to be resolved on successful validation or rejected with an error message.
     *
     * @param formData Form-data object model is contained within
     * @param fieldName Name of collection to validate
     * @param validationRuleSet Map of field names to validation rules
     * @return Promise to be resolved or rejected based on validation success or failure.
     */
    ModelValidator.prototype.validateCollection = function (formData, fieldName, validationRuleSet) {
        var validationRules = this.getRulesFor_(fieldName, validationRuleSet);
        var collection = this.nestedObjectHelper_.readAttribute(formData, fieldName);
        if (validationRules && validationRules.collection) {
            collection = collection || [];
            return this.validateCollectionMinLength_(collection, validationRules.collection) || this.validateCollectionMaxLength_(collection, validationRules.collection) || this.promiseUtils_.resolve();
        }
        return this.promiseUtils_.resolve();
    };
    /**
     * Validates a value against the related rule-set (within validationRules).
     * This method returns a promise to be resolved on successful validation.
     * If validation fails the promise will be rejected with an error message.
     *
     * @param formData Form-data object model is contained within.
     * @param fieldName Name of field used to associate the rule-set map with a given value.
     * @param validationRuleSet Map of field names to validation rules
     * @return Promise to be resolved or rejected based on validation success or failure.
     */
    ModelValidator.prototype.validateField = function (formData, fieldName, validationRuleSet) {
        var validationRules = this.getRulesFor_(fieldName, validationRuleSet);
        var value = this.nestedObjectHelper_.readAttribute(formData, fieldName);
        if (validationRules) {
            if (value === undefined || value === null) {
                value = ""; // Escape falsy values liked null or undefined, but not ones like 0
            }
            return this.validateFieldRequired_(value, validationRules) || this.validateFieldMinLength_(value, validationRules) || this.validateFieldMaxLength_(value, validationRules) || this.validateFieldType_(value, validationRules) || this.validateFieldPattern_(value, validationRules) || this.validateFieldCustom_(value, formData, validationRules) || this.promiseUtils_.resolve();
        }
        return this.promiseUtils_.resolve();
    };
    /**
     * Validates the values in model with the rules defined in the current validationRules.
     * This method returns a promise to be resolved on successful validation,
     * or rejected with a map of field-name to error-message.
     *
     * @param formData Form-data object model is contained within
     * @param fieldNames White-list set of fields to validate for the given model.
     *                   Values outside of this list will be ignored.
     * @param validationRuleSet Map of field names to validation rules
     * @return Promise to be resolved or rejected based on validation success or failure.
     */
    ModelValidator.prototype.validateFields = function (formData, fieldNames, validationRuleSet) {
        var _this = this;
        var deferred = this.$q_.defer();
        var promises = [];
        var errorMap = {};
        angular.forEach(fieldNames, function (fieldName) {
            var validationRules = _this.getRulesFor_(fieldName, validationRuleSet);
            if (validationRules) {
                var promise;
                if (validationRules.collection) {
                    promise = _this.validateCollection(formData, fieldName, validationRuleSet);
                }
                else {
                    promise = _this.validateField(formData, fieldName, validationRuleSet);
                }
                promise.then(angular.noop, function (error) {
                    _this.nestedObjectHelper_.writeAttribute(errorMap, fieldName, error);
                });
                promises.push(promise);
            }
        }, this);
        // Wait until all validations have finished before proceeding; bundle up the error messages if any failed.
        this.promiseUtils_.waitForAll(promises).then(deferred.resolve, function () {
            deferred.reject(errorMap);
        });
        return deferred.promise;
    };
    // Helper methods ////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Strip array brackets from field names so that model values can be mapped to rules.
     * e.g. "foo[0].bar" should be validated against "foo.collection.fields.bar"
     *
     * @private
     */
    ModelValidator.prototype.getRulesFor_ = function (fieldName, validationRuleSet) {
        var expandedFieldName = fieldName.replace(/\[[^\]]+\]/g, '.collection.fields');
        return this.nestedObjectHelper_.readAttribute(validationRuleSet, expandedFieldName);
    };
    ModelValidator.prototype.getFieldTypeFailureMessage_ = function (validationRules, failureType) {
        return angular.isObject(validationRules.type) ? validationRules.type.message : this.formForConfiguration_.getFailedValidationMessage(failureType);
    };
    /**
     * Determining if numeric input has been provided.
     * This guards against the fact that `new Number('') == 0`.
     * @private
     */
    ModelValidator.prototype.isConsideredNumeric_ = function (stringValue, numericValue) {
        return stringValue && !isNaN(numericValue);
    };
    // Validation helper methods /////////////////////////////////////////////////////////////////////////////////////////
    ModelValidator.prototype.validateCollectionMinLength_ = function (collection, validationRuleCollection) {
        if (validationRuleCollection.min) {
            var min = angular.isObject(validationRuleCollection.min) ? validationRuleCollection.min.rule : validationRuleCollection.min;
            if (collection.length < min) {
                var failureMessage;
                if (angular.isObject(validationRuleCollection.min)) {
                    failureMessage = validationRuleCollection.min.message;
                }
                else {
                    failureMessage = this.$interpolate_(this.formForConfiguration_.getFailedValidationMessage(ValidationFailureType.COLLECTION_MIN_SIZE))({ num: min });
                }
                return this.$q_.reject(failureMessage);
            }
        }
        return null;
    };
    ModelValidator.prototype.validateCollectionMaxLength_ = function (collection, validationRuleCollection) {
        if (validationRuleCollection.max) {
            var max = angular.isObject(validationRuleCollection.max) ? validationRuleCollection.max.rule : validationRuleCollection.max;
            if (collection.length > max) {
                var failureMessage;
                if (angular.isObject(validationRuleCollection.max)) {
                    failureMessage = validationRuleCollection.max.message;
                }
                else {
                    failureMessage = this.$interpolate_(this.formForConfiguration_.getFailedValidationMessage(ValidationFailureType.COLLECTION_MAX_SIZE))({ num: max });
                }
                return this.$q_.reject(failureMessage);
            }
        }
        return null;
    };
    ModelValidator.prototype.validateFieldCustom_ = function (value, formData, validationRules) {
        var _this = this;
        if (validationRules.custom) {
            var defaultErrorMessage;
            var validationFunction;
            if (angular.isFunction(validationRules.custom)) {
                defaultErrorMessage = this.formForConfiguration_.getFailedValidationMessage(ValidationFailureType.CUSTOM);
                validationFunction = validationRules.custom;
            }
            else {
                defaultErrorMessage = validationRules.custom.message;
                validationFunction = validationRules.custom.rule;
            }
            try {
                var returnValue = validationFunction(value, formData);
            }
            catch (error) {
                return this.$q_.reject(error.message || defaultErrorMessage);
            }
            if (angular.isObject(returnValue) && angular.isFunction(returnValue.then)) {
                return returnValue.then(function (reason) {
                    return _this.promiseUtils_.resolve(reason);
                }, function (reason) {
                    return _this.$q_.reject(reason || defaultErrorMessage);
                });
            }
            else if (returnValue) {
                return this.promiseUtils_.resolve(returnValue);
            }
            else {
                return this.$q_.reject(defaultErrorMessage);
            }
        }
        return null;
    };
    ModelValidator.prototype.validateFieldMaxLength_ = function (value, validationRules) {
        if (validationRules.maxlength) {
            var maxlength = angular.isObject(validationRules.maxlength) ? validationRules.maxlength.rule : validationRules.maxlength;
            if (value.length > maxlength) {
                var failureMessage;
                if (angular.isObject(validationRules.maxlength)) {
                    failureMessage = validationRules.maxlength.message;
                }
                else {
                    failureMessage = this.$interpolate_(this.formForConfiguration_.getFailedValidationMessage(ValidationFailureType.MAX_LENGTH))({ num: maxlength });
                }
                return this.$q_.reject(failureMessage);
            }
        }
        return null;
    };
    ModelValidator.prototype.validateFieldMinLength_ = function (value, validationRules) {
        if (validationRules.minlength) {
            var minlength = angular.isObject(validationRules.minlength) ? validationRules.minlength.rule : validationRules.minlength;
            if (value && value.length < minlength) {
                var failureMessage;
                if (angular.isObject(validationRules.minlength)) {
                    failureMessage = validationRules.minlength.message;
                }
                else {
                    failureMessage = this.$interpolate_(this.formForConfiguration_.getFailedValidationMessage(ValidationFailureType.MIN_LENGTH))({ num: minlength });
                }
                return this.$q_.reject(failureMessage);
            }
        }
        return null;
    };
    ModelValidator.prototype.validateFieldRequired_ = function (value, validationRules) {
        if (validationRules.required) {
            var required = angular.isObject(validationRules.required) ? validationRules.required.rule : validationRules.required;
            var sanitizedValue = value;
            if (angular.isString(value)) {
                value = value.replace(/\s+$/, ''); // Disallow an all-whitespace string
            }
            if (required && !value) {
                var failureMessage;
                if (angular.isObject(validationRules.required)) {
                    failureMessage = validationRules.required.message;
                }
                else {
                    failureMessage = this.formForConfiguration_.getFailedValidationMessage(ValidationFailureType.REQUIRED);
                }
                return this.$q_.reject(failureMessage);
            }
        }
        return null;
    };
    ModelValidator.prototype.validateFieldPattern_ = function (value, validationRules) {
        if (validationRules.pattern) {
            var isRegExp = validationRules.pattern instanceof RegExp;
            var regExp = isRegExp ? validationRules.pattern : validationRules.pattern.rule;
            if (!regExp.exec(value)) {
                var failureMessage = isRegExp ? this.formForConfiguration_.getFailedValidationMessage(ValidationFailureType.PATTERN) : validationRules.pattern.message;
                return this.$q_.reject(failureMessage);
            }
        }
        return null;
    };
    ModelValidator.prototype.validateFieldType_ = function (value, validationRules) {
        if (validationRules.type) {
            // String containing 0+ ValidationRuleFieldType enums
            var typesString = angular.isObject(validationRules.type) ? validationRules.type.rule : validationRules.type;
            var stringValue = value.toString();
            var numericValue = Number(value);
            if (typesString) {
                var types = typesString.split(' ');
                for (var i = 0, length = types.length; i < length; i++) {
                    var type = types[i];
                    switch (type) {
                        case ValidationFieldType.INTEGER:
                            if (stringValue && (isNaN(numericValue) || numericValue % 1 !== 0)) {
                                return this.$q_.reject(this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_INTEGER));
                            }
                            break;
                        case ValidationFieldType.NUMBER:
                            if (stringValue && isNaN(numericValue)) {
                                return this.$q_.reject(this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_NUMERIC));
                            }
                            break;
                        case ValidationFieldType.NEGATIVE:
                            if (this.isConsideredNumeric_(stringValue, numericValue) && numericValue >= 0) {
                                return this.$q_.reject(this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_NEGATIVE));
                            }
                            break;
                        case ValidationFieldType.NON_NEGATIVE:
                            if (this.isConsideredNumeric_(stringValue, numericValue) && numericValue < 0) {
                                return this.$q_.reject(this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_NON_NEGATIVE));
                            }
                            break;
                        case ValidationFieldType.POSITIVE:
                            if (this.isConsideredNumeric_(stringValue, numericValue) && numericValue <= 0) {
                                return this.$q_.reject(this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_POSITIVE));
                            }
                            break;
                        case ValidationFieldType.EMAIL:
                            if (stringValue && !stringValue.match(/^.+@.+$/)) {
                                return this.$q_.reject(this.getFieldTypeFailureMessage_(validationRules, ValidationFailureType.TYPE_EMAIL));
                            }
                            break;
                    }
                }
            }
        }
        return null;
    };
    return ModelValidator;
})();
;
angular.module('formFor').service('ModelValidator', function ($interpolate, $parse, $q, FormForConfiguration) { return new ModelValidator($interpolate, $parse, $q, FormForConfiguration); });
/**
 * Controller exposed via the FormFor directive's scope.
 *
 * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
 */
var FormForController = (function () {
    /**
     * Constructor.
     *
     * @param $scope formFor directive $scope
     */
    function FormForController($parse, $q, $scope, modelValidator) {
        this.$parse_ = $parse;
        this.$q_ = $q;
        this.$scope_ = $scope;
        this.modelValidator_ = modelValidator;
        this.nestedObjectHelper_ = new NestedObjectHelper($parse);
        this.promiseUtils_ = new PromiseUtils($q);
    }
    /**
     * Collection headers should register themselves using this function in order to be notified of validation errors.
     *
     * @param fieldName Unique identifier of collection within model
     * @return A bind-friendly wrapper object describing the state of the collection
     */
    FormForController.prototype.registerCollectionLabel = function (fieldName) {
        var _this = this;
        var bindableFieldName = this.nestedObjectHelper_.flattenAttribute(fieldName);
        var bindableWrapper = {
            error: null,
            required: this.modelValidator_.isCollectionRequired(fieldName, this.$scope_.$validationRules)
        };
        this.$scope_.collectionLabels[bindableFieldName] = bindableWrapper;
        var watcherInitialized = false;
        this.$scope_.$watch('formFor.' + fieldName + '.length', function (newValue, oldValue) {
            // The initial $watch should not trigger a visible validation...
            if (!watcherInitialized) {
                watcherInitialized = true;
            }
            else if (!_this.$scope_.validateOn || _this.$scope_.validateOn === 'change') {
                _this.modelValidator_.validateCollection(_this.$scope_.formFor, fieldName, _this.$scope_.$validationRules).then(function () {
                    _this.$scope_.formForStateHelper.setFieldError(bindableFieldName, null);
                }, function (error) {
                    _this.$scope_.formForStateHelper.setFieldError(bindableFieldName, error);
                });
            }
        });
        return bindableWrapper;
    };
    /**
     * All form-input children of formFor must register using this function.
     *
     * @param fieldName Unique identifier of field within model; used to map errors back to input fields
     * @return Bindable field wrapper
     */
    FormForController.prototype.registerFormField = function (fieldName) {
        var _this = this;
        if (!fieldName) {
            throw Error('Invalid field name "' + fieldName + '" provided.');
        }
        var bindableFieldName = this.nestedObjectHelper_.flattenAttribute(fieldName);
        if (this.$scope_['fields'].hasOwnProperty(bindableFieldName)) {
            throw Error('Field "' + fieldName + '" has already been registered. Field names must be unique.');
        }
        var bindableFieldWrapper = {
            bindable: null,
            disabled: this.$scope_.disable,
            error: null,
            pristine: true,
            required: this.modelValidator_.isFieldRequired(fieldName, this.$scope_.$validationRules),
            uid: FormForGUID.create()
        };
        // Store information about this field that we'll need for validation and binding purposes.
        // @see Above documentation for $scope.fields
        var fieldDatum = {
            bindableWrapper: bindableFieldWrapper,
            fieldName: fieldName,
            formForStateHelper: this.$scope_.formForStateHelper,
            unwatchers: []
        };
        this.$scope_.fields[bindableFieldName] = fieldDatum;
        var getter = this.$parse_(fieldName);
        // Changes made by our field should be synced back to the form-data model.
        fieldDatum.unwatchers.push(this.$scope_.$watch('fields.' + bindableFieldName + '.bindableWrapper.bindable', function (newValue, oldValue) {
            if (newValue !== oldValue) {
                getter.assign(_this.$scope_.formFor, newValue);
            }
        }));
        var formDataWatcherInitialized;
        // Changes made to the form-data model should likewise be synced to the field's bindable model.
        // (This is necessary for data that is loaded asynchronously after a form has already been displayed.)
        fieldDatum.unwatchers.push(this.$scope_.$watch('formFor.' + fieldName, function (newValue, oldValue) {
            // An asynchronous formFor data source should reset any dirty flags.
            // A user tabbing in and out of a field also shouldn't be counted as dirty.
            // Easiest way to guard against this is to reset the initialization flag.
            if (newValue !== fieldDatum.bindableWrapper.bindable || oldValue === undefined && newValue === '' || newValue === undefined) {
                formDataWatcherInitialized = false;
            }
            fieldDatum.bindableWrapper.bindable = newValue;
            if (!_this.$scope_.validateOn || _this.$scope_.validateOn === 'change') {
                _this.validateField(fieldName);
            }
            // Changes in form-data should also trigger validations.
            // Validation failures will not be displayed unless the form-field has been marked dirty (changed by user).
            // We shouldn't mark our field as dirty when Angular auto-invokes the initial watcher though,
            // So we ignore the first invocation...
            if (!formDataWatcherInitialized) {
                formDataWatcherInitialized = true;
                _this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);
            }
            fieldDatum.bindableWrapper.pristine = !_this.$scope_.formForStateHelper.hasFieldBeenModified(bindableFieldName);
        }));
        return bindableFieldWrapper;
    };
    /**
     * All submitButton children must register with formFor using this function.
     * @memberof form-for
     * @param {$scope} submitButtonScope $scope of submit button directive
     * @return {Object} Object containing keys to be observed by the input button:
     * • disabled: Button should disable itself if this value becomes true; typically this means the form is being submitted.
     */
    FormForController.prototype.registerSubmitButton = function (submitButtonScope) {
        var bindableWrapper = {
            disabled: false
        };
        this.$scope_.buttons.push(bindableWrapper);
        return bindableWrapper;
    };
    /**
     * Resets errors displayed on the <form> without resetting the form data values.
     */
    FormForController.prototype.resetErrors = function () {
        for (var bindableFieldName in this.$scope_.fields) {
            // If the field is invalid, we don't want it to appear valid- just pristing.
            if (this.$scope_.formForStateHelper.getFieldError(bindableFieldName)) {
                this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);
                this.$scope_.fields[bindableFieldName].bindableWrapper.pristine = true;
            }
        }
        this.$scope_.formForStateHelper.setFormSubmitted(false);
        this.$scope_.formForStateHelper.resetFieldErrors();
    };
    /**
     * Reset validation errors for an individual field.
     *
     * @param fieldName Field name within formFor data object (ex. billing.address)
     */
    FormForController.prototype.resetField = function (fieldName) {
        var bindableFieldName = this.nestedObjectHelper_.flattenAttribute(fieldName);
        // If the field is invalid, we don't want it to appear valid- just pristing.
        if (this.$scope_.formForStateHelper.getFieldError(bindableFieldName)) {
            this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, false);
            this.$scope_.fields[bindableFieldName].bindableWrapper.pristine = true;
        }
        this.$scope_.formForStateHelper.setFieldError(bindableFieldName, null);
    };
    /**
     * Alias to resetErrors.
     * @memberof form-for
     */
    FormForController.prototype.resetFields = function () {
        this.resetErrors();
    };
    /**
     * Manually set a validation error message for a given field.
     * This method should only be used when formFor's :validateOn attribute has been set to "manual".
     *
     * @param fieldName Field name within formFor data object (ex. billing.address)
     * @param error Error message to display (or null to clear the visible error)
     */
    FormForController.prototype.setFieldError = function (fieldName, error) {
        var bindableFieldName = this.nestedObjectHelper_.flattenAttribute(fieldName);
        this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);
        this.$scope_.formForStateHelper.setFieldError(bindableFieldName, error);
    };
    /**
     * Form fields created within ngRepeat or ngIf directive should clean up themselves on removal.
     *
     * @param fieldName Unique identifier of field within model
     */
    FormForController.prototype.unregisterFormField = function (fieldName) {
        var bindableFieldName = this.nestedObjectHelper_.flattenAttribute(fieldName);
        angular.forEach(this.$scope_.fields[bindableFieldName].unwatchers, function (unwatch) {
            unwatch();
        });
        delete this.$scope_.fields[bindableFieldName];
    };
    /**
     * Force validation for an individual field.
     * If the field fails validation an error message will automatically be shown.
     *
     * @param fieldName Field name within formFor data object (ex. billing.address)
     */
    FormForController.prototype.validateField = function (fieldName) {
        var _this = this;
        var bindableFieldName = this.nestedObjectHelper_.flattenAttribute(fieldName);
        this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);
        // Run validations and store the result keyed by our bindableFieldName for easier subsequent lookup.
        if (this.$scope_.$validationRules) {
            this.modelValidator_.validateField(this.$scope_.formFor, fieldName, this.$scope_.$validationRules).then(function () {
                _this.$scope_.formForStateHelper.setFieldError(bindableFieldName, null);
            }, function (error) {
                _this.$scope_.formForStateHelper.setFieldError(bindableFieldName, error);
            });
        }
    };
    /**
     * Validate all registered form-fields.
     * This method returns a promise that is resolved or rejected with a field to error message map.
     *
     * @param showErrors Mark fields with errors as invalid (visually) after validation
     */
    FormForController.prototype.validateForm = function (showErrors) {
        var _this = this;
        // Reset errors before starting new validation.
        this.$scope_.updateCollectionErrors({});
        this.$scope_.updateFieldErrors({});
        var validateCollectionsPromise;
        var validateFieldsPromise;
        if (this.$scope_.$validationRules) {
            var validationKeys = [];
            angular.forEach(this.$scope_.fields, function (fieldDatum) {
                validationKeys.push(fieldDatum.fieldName);
            });
            validateFieldsPromise = this.modelValidator_.validateFields(this.$scope_.formFor, validationKeys, this.$scope_.$validationRules);
            validateFieldsPromise.then(angular.noop, this.$scope_.updateFieldErrors);
            validationKeys = []; // Reset for below re-use
            angular.forEach(this.$scope_.collectionLabels, function (bindableWrapper, bindableFieldName) {
                validationKeys.push(bindableFieldName);
            });
            validateCollectionsPromise = this.modelValidator_.validateFields(this.$scope_.formFor, validationKeys, this.$scope_.$validationRules);
            validateCollectionsPromise.then(angular.noop, this.$scope_.updateCollectionErrors);
        }
        else {
            validateCollectionsPromise = this.promiseUtils_.resolve();
            validateFieldsPromise = this.promiseUtils_.resolve();
        }
        var deferred = this.$q_.defer();
        this.promiseUtils_.waitForAll([validateCollectionsPromise, validateFieldsPromise]).then(deferred.resolve, function (errors) {
            // If all collections are valid (or no collections exist) this will be an empty array.
            if (angular.isArray(errors[0]) && errors[0].length === 0) {
                errors.splice(0, 1);
            }
            // Errors won't be shown for clean fields, so mark errored fields as dirty.
            if (showErrors) {
                angular.forEach(errors, function (errorObjectOrArray) {
                    var flattenedFields = _this.nestedObjectHelper_.flattenObjectKeys(errorObjectOrArray);
                    angular.forEach(flattenedFields, function (fieldName) {
                        var error = _this.nestedObjectHelper_.readAttribute(errorObjectOrArray, fieldName);
                        if (error) {
                            var bindableFieldName = _this.nestedObjectHelper_.flattenAttribute(fieldName);
                            _this.$scope_.formForStateHelper.setFieldHasBeenModified(bindableFieldName, true);
                        }
                    });
                });
            }
            deferred.reject(errors);
        });
        return deferred.promise;
    };
    return FormForController;
})();
;
/**
 * UID generator for formFor input fields.
 * @see http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
 *
 * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
 */
var FormForGUID = (function () {
    function FormForGUID() {
    }
    /**
     * Create a new GUID.
     */
    FormForGUID.create = function () {
        return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
    };
    return FormForGUID;
})();
;
/*
 * Organizes state management for form-submission and field validity.
 *
 * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
 */
var FormForStateHelper = (function () {
    // TODO Add some documentation
    function FormForStateHelper($parse, $scope) {
        this.$scope_ = $scope;
        this.nestedObjectHelper_ = new NestedObjectHelper($parse);
        this.$scope_.errorMap = this.$scope_.errorMap || {};
        this.$scope_.valid = true;
        this.fieldNameToModifiedStateMap_ = {};
        this.formSubmitted_ = false;
        this.fieldNameToErrorMap_ = {};
        this.watchableCounter_ = 0;
    }
    FormForStateHelper.prototype.getFieldError = function (fieldName) {
        return this.nestedObjectHelper_.readAttribute(this.$scope_.errorMap, fieldName);
    };
    FormForStateHelper.prototype.hasFieldBeenModified = function (fieldName) {
        return this.nestedObjectHelper_.readAttribute(this.fieldNameToModifiedStateMap_, fieldName);
    };
    FormForStateHelper.prototype.hasFormBeenSubmitted = function () {
        return this.formSubmitted_;
    };
    FormForStateHelper.prototype.isFieldValid = function (fieldName) {
        return !this.getFieldError(fieldName);
    };
    FormForStateHelper.prototype.isFormInvalid = function () {
        return !this.isFormValid();
    };
    FormForStateHelper.prototype.isFormValid = function () {
        for (var prop in this.fieldNameToErrorMap_) {
            return false;
        }
        return true;
    };
    FormForStateHelper.prototype.resetFieldErrors = function () {
        this.$scope_.errorMap = {};
    };
    FormForStateHelper.prototype.setFieldError = function (fieldName, error) {
        var safeFieldName = this.nestedObjectHelper_.flattenAttribute(fieldName);
        this.nestedObjectHelper_.writeAttribute(this.$scope_.errorMap, fieldName, error);
        if (error) {
            this.fieldNameToErrorMap_[safeFieldName] = error;
        }
        else {
            delete this.fieldNameToErrorMap_[safeFieldName];
        }
        this.$scope_.valid = this.isFormValid();
        this.watchableCounter_++;
    };
    FormForStateHelper.prototype.setFieldHasBeenModified = function (fieldName, hasBeenModified) {
        this.nestedObjectHelper_.writeAttribute(this.fieldNameToModifiedStateMap_, fieldName, hasBeenModified);
        this.watchableCounter_++;
    };
    FormForStateHelper.prototype.setFormSubmitted = function (submitted) {
        this.formSubmitted_ = submitted;
        this.watchableCounter_++;
    };
    return FormForStateHelper;
})();
;
/**
 * Utility for working with strings.
 *
 * <p>Intended for use only by formFor directive; this class is not exposed to the $injector.
 */
var StringUtil = (function () {
    function StringUtil() {
    }
    /**
     * Converts text in common variable formats to humanized form.
     *
     * @param text Name of variable to be humanized (ex. myVariable, my_variable)
     * @returns Humanized string (ex. 'My Variable')
     */
    StringUtil.humanize = function (text) {
        if (!text) {
            return '';
        }
        text = text.replace(/[A-Z]/g, function (match) {
            return ' ' + match;
        });
        text = text.replace(/_([a-z])/g, function (match, $1) {
            return ' ' + $1.toUpperCase();
        });
        text = text.replace(/\s+/g, ' ');
        text = text.trim();
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return text;
    };
    return StringUtil;
})();
;
;
;
;
;
;
;
/// <reference path="../../../definitions/angular.d.ts" />
;
