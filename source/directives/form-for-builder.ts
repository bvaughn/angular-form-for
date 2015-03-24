module formFor {

  /**
   *
   */
  export function FormForBuilderDirective($compile:ng.ICompileService, $parse:ng.IParseService):ng.IDirective {
    var nestedObjectHelper:NestedObjectHelper = new NestedObjectHelper($parse);

    return {
      require: 'formFor',
      restrict: 'A',

      link: function($scope:any,
                     $element:ng.IAugmentedJQuery,
                     $attributes:any,
                     formForController:FormForController):void {

        // View schema may be a separate model or it may be combined with the validation rules used by formFor.
        var viewSchema:ViewSchema;

        if ($attributes.formForBuilder) {
          viewSchema = $scope.$eval($attributes.formForBuilder);
        } else if ($attributes.validationRules) {
          viewSchema = $scope.$eval($attributes.validationRules);
        } else if ($attributes.$service) {
          viewSchema = $scope.$eval($attributes.$service.validationRules);
        }

        var viewSchemaKeys:Array<string> = nestedObjectHelper.flattenObjectKeys(viewSchema);
        var htmlString = "";

        for (var i = 0, length = viewSchemaKeys.length; i < length; i++) {
          var fieldName:string = viewSchemaKeys[i];
          var viewField:ViewField = nestedObjectHelper.readAttribute(viewSchema, fieldName);
          var html:string;

          if (viewField && viewField.hasOwnProperty('inputType')) {
            var help:string = viewField.help || '';
            var label:string = viewField.label || '';

            switch (viewField.inputType) {
              case BuilderFieldType.CHECKBOX:
                htmlString += `<checkbox-field attribute="${fieldName}"
                                               help="${help}"
                                               label="${label}">
                               </checkbox-field>`;
                break;
              case BuilderFieldType.RADIO:
                var value; // TODO Add enumeration field and loop to create values.
                htmlString += `<radio-field attribute="${fieldName}"
                                            help="${help}"
                                            label="${label}"
                                            value="${value}">
                               </radio-field>`;
                break;
              case BuilderFieldType.PASSWORD:
              case BuilderFieldType.TEXT:
                htmlString += `<text-field attribute="${fieldName}"
                                           label="${label}"
                                           help="${help}"
                                           type="${viewField.inputType}">
                               </text-field>`;
                break;
            }
          }
        }

        // Append a <submit> button if one isn't already present inside of $element
        if ($element.find('input[type=button], button').length === 0) {
          htmlString += `<submit-button label="Submit"></submit-button>`;
        }

        var linkingFunction:any = $compile(htmlString);
        var compiled = linkingFunction($scope, undefined, {transcludeControllers: formForController});

        $element.prepend(compiled);
      }
    };
  };

  angular.module('formFor').directive('formForBuilder',
    ($compile, $parse) => FormForBuilderDirective($compile, $parse));
}