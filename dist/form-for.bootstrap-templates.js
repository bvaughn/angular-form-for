angular.module("formFor.bootstrapTemplates", []).run(["$templateCache", function($templateCache) {$templateCache.put("form-for/templates/checkbox-field.html","<div  class=\"field checkbox-field\"\n      ng-class=\"{disabled: disable || model.disabled, \'has-error\': model.error}\">\n\n  <field-error  error=\"model.error\"\n                left-aligned=\"true\"\n                uid=\"{{model.uid}}-error\">\n  </field-error>\n\n  <input  aria-manager\n          id=\"{{model.uid}}\"\n          name=\"{{attribute}}\"\n          type=\"checkbox\"\n          tabindex=\"{{tabIndex}}\"\n          ng-model=\"model.bindable\"\n          ng-disabled=\"disable || model.disabled\"\n          ng-change=\"changed()\">\n\n  <field-label  ng-if=\"label\"\n                input-uid=\"{{model.uid}}\"\n                uid=\"{{model.uid}}-label\"\n                label=\"{{label}}\"\n                label-class=\"{{labelClass}}\"\n                help=\"{{help}}\">\n  </field-label>\n</div>\n");
$templateCache.put("form-for/templates/collection-label.html","<div class=\"collection-label\" ng-class=\"{\'text-danger\': model.error}\">\n  <field-label  ng-if=\"label\"\n                label=\"{{label}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <small ng-if=\"model.error\" class=\"text-danger\" ng-bind=\"model.error\"></small>\n</div>\n");
$templateCache.put("form-for/templates/field-error.html","<p  ng-if=\"error\"\n    id=\"{{uid}}\"\n    class=\"text-danger\"\n    ng-bind=\"error\">\n</p>\n");
$templateCache.put("form-for/templates/field-label.html","<label  id=\"{{uid}}\"\n        for=\"{{inputUid}}\"\n        ng-class=\"[labelClass]\">\n\n  <span ng-bind-html=\"bindableLabel\"></span>\n\n  <span ng-if=\"help\">\n    <span ng-if=\"helpIcon\" class=\"{{helpIcon}}\"\n          popover=\"{{help}}\"\n          popover-trigger=\"mouseenter\"\n          popover-placement=\"right\"></span>\n\n    <span ng-if=\"!helpIcon\" class=\"fa fa-question-circle\"\n          popover=\"{{help}}\"\n          popover-trigger=\"mouseenter\"\n          popover-placement=\"right\"></span>\n  </span>\n\n  <span class=\"label label-default\" ng-if=\"requiredLabel\" ng-bind=\"requiredLabel\"></span>\n</label>\n");
$templateCache.put("form-for/templates/radio-field.html","<span class=\"field radio-field\"\n      ng-class=\"{disabled: disable || model.disabled, \'has-error\': model.error}\">\n\n  <field-label  ng-if=\"label\"\n                uid=\"{{uid}}-label\"\n                label=\"{{label}}\"\n                label-class=\"{{labelClass}}\"\n                help=\"{{help}}\">\n  </field-label>\n\n  <field-error  ng-if=\"!hideErrorMessage\"\n                error=\"model.error\"\n                left-aligned=\"true\"\n                uid=\"{{uid}}-error\">\n  </field-error>\n\n  <div ng-repeat=\"option in options track by $index\">\n    <label>\n      <input  aria-manager\n              id=\"{{uid}}-{{$index}}\"\n              type=\"radio\"\n              name=\"{{attribute}}\"\n              tabindex=\"{{tabIndex}}\"\n              ng-model=\"model.bindable\"\n              ng-value=\"option[valueAttribute]\"\n              ng-disabled=\"disable || model.disabled\">\n\n      {{option[labelAttribute]}}\n    </label>\n  </div>\n</span>\n");
$templateCache.put("form-for/templates/select-field.html","<div  class=\"form-group\"\n      ng-class=\"{ \'disabled\': disable || model.disabled,\n                  \'has-error\': model.error }\">\n\n  <field-label  ng-if=\"label\"\n                input-uid=\"{{model.uid}}\"\n                iud=\"{{model.uid}}-label\"\n                label=\"{{label}}\"\n                label-class=\"{{labelClass}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <field-error  error=\"model.error\"\n                uid=\"{{model.uid}}-error\">\n  </field-error>\n\n  <!-- Binding to the \'multiple\' attribute is not supported, even with ng-attr-multiple.\n       This means that single and multiple select menus need to be defined separately.\n       For ease of customization, they\'re also separated into their own partials. -->\n\n  <span ng-if=\"multiple\"\n        ng-include\n        src=\"\'form-for/templates/select-field/_multi-select.html\'\"></span>\n\n  <span ng-if=\"!multiple\"\n        ng-include\n        src=\"\'form-for/templates/select-field/_select.html\'\"></span>\n</div>\n");
$templateCache.put("form-for/templates/submit-button.html","<button ng-class=\"buttonClass || \'btn btn-default\'\"\n        ng-disabled=\"disable || model.disabled\"\n        aria-label=\"bindableLabel\"\n        tabindex=\"{{tabIndex}}\">\n\n  <i ng-if=\"icon\" ng-class=\"icon\"></i>\n\n  <span ng-bind-html=\"bindableLabel\"></span>\n</button>\n");
$templateCache.put("form-for/templates/text-field.html","<div  class=\"form-group\"\n      ng-class=\"{disabled: disable || model.disabled, \'has-error\': model.error}\">\n\n  <field-label  ng-if=\"label\"\n                input-uid=\"{{model.uid}}\"\n                iud=\"{{model.uid}}-label\"\n                label=\"{{label}}\"\n                label-class=\"{{labelClass}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <field-error  error=\"model.error\"\n                uid=\"{{model.uid}}-error\">\n  </field-error>\n\n  <div ng-class=\"{\'input-group\': iconBefore || iconAfter}\">\n    <span ng-if=\"iconBefore\" class=\"input-group-addon\"\n          ng-click=\"onIconBeforeClick()\">\n      <i class=\"text-field-icon\" ng-class=\"iconBefore\"></i>\n    </span>\n\n    <span ng-if=\"!multiline\" ng-include src=\"\'form-for/templates/text-field/_input.html\'\"></span>\n\n    <span ng-if=\"multiline\" ng-include src=\"\'form-for/templates/text-field/_textarea.html\'\"></span>\n\n    <span ng-if=\"iconAfter\" class=\"input-group-addon\"\n          ng-click=\"onIconAfterClick()\">\n      <i class=\"text-field-icon\" ng-class=\"iconAfter\"></i>\n    </span>\n  </div>\n</div>\n");
$templateCache.put("form-for/templates/type-ahead-field.html","<div  class=\"form-group\"\n      ng-class=\"{ \'disabled\': disable || model.disabled,\n                  \'has-error\': model.error }\">\n\n  <field-label  ng-if=\"label\"\n                input-uid=\"{{model.uid + \'-filter\'}}\"\n                iud=\"{{model.uid}}-label\"\n                label=\"{{label}}\"\n                label-class=\"{{labelClass}}\"\n                help=\"{{help}}\"\n                required=\"{{model.required}}\">\n  </field-label>\n\n  <field-error  error=\"model.error\"\n                uid=\"{{model.uid}}-error\">\n  </field-error>\n\n  <!-- Filtered dropdowns use a type-ahead style component -->\n  <div class=\"input-group\">\n    <input  aria-manager\n            id=\"{{model.uid}}-filter\"\n            name=\"{{attribute}}\"\n            class=\"form-control filter-text-input\"\n            type=\"text\"\n            tabindex=\"{{tabIndex}}\"\n            placeholder=\"{{placeholder}}\"\n            form-for-debounce=\"{{debounce}}\"\n            ng-disabled=\"disable || model.disabled\"\n            ng-model=\"scopeBuster.filter\"\n            ng-click=\"filterTextClick($event)\"\n            ng-focus=\"open()\"\n            ng-keydown=\"keyDown($event)\">\n\n    <ul ng-if=\"options.length\" class=\"dropdown-menu\" ng-class=\"{show: isOpen}\">\n      <li ng-repeat=\"option in filteredOptions\"\n          ng-class=\"{active: option === selectedOption || $index === mouseOverIndex}\">\n\n        <a  ng-bind=\"option[labelAttribute]\"\n            ng-click=\"selectOption(option)\"\n            ng-mouseenter=\"mouseOver($index)\">\n        </a>\n      </li>\n    </ul>\n\n    <span class=\"input-group-addon\" ng-click=\"setFilterFocus()\">\n      <i class=\"caret\"></i>\n    </span>\n  </div>\n</div>\n");
$templateCache.put("form-for/templates/select-field/_multi-select.html","<select aria-manager multiple\n        id=\"{{model.uid}}\"\n        name=\"{{attribute}}\"\n        class=\"form-control\"\n        tabindex=\"{{tabIndex}}\"\n        ng-disabled=\"disable || model.disabled\"\n        ng-model=\"model.bindable\"\n        ng-options=\"option[valueAttribute] as option[labelAttribute] for option in bindableOptions\">\n</select>");
$templateCache.put("form-for/templates/select-field/_select.html","<select aria-manager\n        id=\"{{model.uid}}\"\n        name=\"{{attribute}}\"\n        class=\"form-control\"\n        tabindex=\"{{tabIndex}}\"\n        ng-disabled=\"disable || model.disabled\"\n        ng-model=\"model.bindable\"\n        ng-options=\"option[valueAttribute] as option[labelAttribute] for option in bindableOptions\">\n</select>");
$templateCache.put("form-for/templates/text-field/_input.html","<input  aria-manager\n\n        id=\"{{model.uid}}\"\n        name=\"{{attribute}}\"\n        class=\"form-control\"\n        ng-disabled=\"disable || model.disabled\"\n\n        type=\"{{type}}\"\n        tabindex=\"{{tabIndex}}\"\n        placeholder=\"{{placeholder}}\"\n        ng-model=\"model.bindable\"\n        form-for-debounce=\"{{debounce}}\"\n        ng-click=\"onFocus()\"\n        ng-blur=\"onBlur()\" />\n");
$templateCache.put("form-for/templates/text-field/_textarea.html","<textarea aria-manager\n          id=\"{{model.uid}}\"\n          name=\"{{attribute}}\"\n          class=\"form-control\"\n          ng-disabled=\"disable || model.disabled\"\n          tabindex=\"{{tabIndex}}\"\n          ng-attr-placeholder=\"{{placeholder}}\"\n          rows=\"{{rows}}\"\n          ng-model=\"model.bindable\"\n          form-for-debounce=\"{{debounce}}\"\n          ng-click=\"onFocus()\"\n          ng-blur=\"onBlur()\">\n</textarea>\n");}]);