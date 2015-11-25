module formFor {
  var $compile_:ng.ICompileService;
  var nestedObjectHelper_:NestedObjectHelper;

  /**
   * Automatically creates and compiles form input elements based on a {@link ViewSchema}.
   */
  export class FormForBuilderDirective implements ng.IDirective {

    require:string = '^formFor';
    restrict:string = 'A';

    /* @ngInject */
    constructor($compile:ng.ICompileService, $parse:ng.IParseService) {
      $compile_ = $compile;
      nestedObjectHelper_ = new NestedObjectHelper($parse);
    }

    /* @ngInject */
    link($scope:any,
         $element:ng.IAugmentedJQuery,
         $attributes:any,
         formForController:FormForController):void {

      // View schema may be explicitly passed in as a separate model,
      // Or it may be combined with the validation rules used by formFor.
      var viewSchema:ViewSchema;

      if ($attributes.formForBuilder) {
        viewSchema = $scope.$eval($attributes.formForBuilder);
      } else if ($attributes.validationRules) {
        viewSchema = $scope.$eval($attributes.validationRules);
      } else if ($attributes.$service) {
        viewSchema = $scope.$eval($attributes.$service.validationRules);
      }

      // View schema may contain nested properties.
      // We will differentiate between form-fields and other properties using the 'inputType' field.
      var viewSchemaKeys:Array<string> = nestedObjectHelper_.flattenObjectKeys(viewSchema);

      var htmlString = "";

      for (var i = 0, length = viewSchemaKeys.length; i < length; i++) {
        var fieldName:string = viewSchemaKeys[i];
        var viewField:ViewField = nestedObjectHelper_.readAttribute(viewSchema, fieldName);
        var html:string;

        if (viewField && viewField.hasOwnProperty('inputType')) {
          var help:string = viewField.help || '';
          var label:string = viewField.label || '';
          var placeholderAttribute:string = '';
          var template:string = viewField.template || '';
          var uid:string = viewField.uid || '';
          var values:string;

          var labelAttribute:string = label ? `label="${label}"` : '';

          if (viewField.hasOwnProperty('placeholder')) {
            placeholderAttribute = `placeholder="${viewField.placeholder}"`;
          }

          switch (viewField.inputType) {
            case BuilderFieldType.CHECKBOX:
              htmlString += `<checkbox-field attribute="${fieldName}"
                                             help="${help}"
                                             ${labelAttribute}
                                             template="${template}"
                                             uid="${uid}">
                             </checkbox-field>`;
              break;
            case BuilderFieldType.RADIO:
              values = JSON.stringify(viewField.values).replace(/"/g, '&quot;');

              htmlString += `<radio-field attribute="${fieldName}"
                                          ${labelAttribute}
                                          options="${values}"
                                          template="${template}"
                                          uid="${uid}">
                             </radio-field>`;
              break;
            case BuilderFieldType.SELECT:
              values = JSON.stringify(viewField.values).replace(/"/g, '&quot;');

              htmlString += `<select-field attribute="${fieldName}"
                                           ${viewField.allowBlank ? 'allow-blank' : ''}
                                           ${viewField.enableFiltering ? 'enable-filtering' : ''}
                                           help="${help}"
                                           ${labelAttribute}
                                           multiple="${!!viewField.multipleSelection}"
                                           options="${values}"
                                           ${placeholderAttribute}
                                           template="${template}"
                                           uid="${uid}"
                                           value-attribute="${viewField.valueAttribute || ''}">
                             </select-field>`;
              break;
            case BuilderFieldType.NUMBER:
            case BuilderFieldType.PASSWORD:
            case BuilderFieldType.TEXT:
            default: // Defaeult to text field to support HTML 5 field types
              var placeholderAttribute:string;

              if (viewField.hasOwnProperty('placeholder')) {
                placeholderAttribute = `placeholder="${viewField.placeholder}"`;
              }

              htmlString += `<text-field attribute="${fieldName}"
                                         ${labelAttribute}
                                         help="${help}"
                                         ng-attr-multiline="${!!viewField.multiline}"
                                         ${placeholderAttribute}
                                         rows="${viewField.rows || ''}"
                                         type="${viewField.inputType}"
                                         template="${template}"
                                         uid="${uid}">
                             </text-field>`;
              break;
          }
        }
      }

      // Append a submit button if one isn't already present inside of $element.
      if ($element.find('input[type=button], button, submit-button').length === 0) {
        htmlString += `<submit-button label="Submit"></submit-button>`;
      }

      var linkingFunction:any = $compile_(htmlString);
      var compiled = linkingFunction($scope, undefined, {transcludeControllers: formForController});

      // Prepend in case the user has specified their own custom submit button(s).
      $element.prepend(compiled);
    }
  };

  angular.module('formFor').directive('formForBuilder',
    ($compile, $parse) => {
      return new FormForBuilderDirective($compile, $parse);
    });
}
