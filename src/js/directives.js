window.mvc.directive('selectpicker', function() {
    return {
        restrict: 'CA',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;
            scope.$watch(attrs.ngModel, function(newValue, oldValue) {
                var value = element.val();
                // Don't use !==, because the number type value would be converted to integer by "integer directive".
                if (value != ngModel.$viewValue) {
                    element.selectpicker('val', ngModel.$viewValue);
                } else {
                    // Rerendering for keep UI sync with select dom element.
                    element.selectpicker('render');
                }
            });
        }
    };
}).directive('integer', function() {
    // http://stackoverflow.com/questions/15072152/angularjs-input-model-changes-from-integer-to-string-when-changed
    return {
        require: 'ngModel',
        link: function(scope, ele, attr, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                return parseInt(viewValue);
            });
        }
    };
}).directive('ngPaneTabs', function() {
    return {
        restrict: 'A',
        scope: false,
        controller: function($scope) {
            $scope.currentPane = $scope.viewPane = {
                selected: true
            };
            $scope.codePane = {
                selected: false
            };
            $scope.helpPane = {
                selected: false
            };
            $scope.selectPane = function(pane) {
                $scope.currentPane.selected = false;
                $scope.currentPane = pane;
                $scope.currentPane.selected = true;
            };
            //$('#area-left').css('width', '50%');
        }
    };
}).directive('ngPanePages', function($rootScope) {
    return {
        restrict: 'A',
        require: '^ngPaneTabs'
    }
});
app.directive('ace', function($rootScope, $timeout) {
    var resizeEditor = function(editor, elem) {
        var lineHeight = editor.renderer.lineHeight;
        var rows = editor.getSession().getLength();

        $(elem).height(rows * lineHeight);
        editor.resize();
    };
    return {
        restrict: 'A',
        require: '?ngModel',
        scope: true,
        link: function(scope, elem, attrs, ngModel) {
            var node = elem[0];

            var editor = ace.edit(node);
            editor.setShowPrintMargin(false);
            editor.setHighlightGutterLine(false);
            editor.renderer.setShowGutter(false);
            editor.getSession().setMode("ace/mode/markdown");
            editor.getSession().setUseWrapMode(true);
            // set editor options
            editor.setShowPrintMargin(false);

            // data binding to ngModel
            ngModel.$render = function() {
                console.log('render');
                console.log(ngModel.$viewValue);
                var text = ngModel.$viewValue.text;
                editor.setValue(text);
                resizeEditor(editor, elem);
            };

            editor.on('change', function() {
                $timeout(function() {
                    scope.$apply(function() {
                        console.log('change');
                        console.log(ngModel.$viewValue);
                        var text = editor.getValue();
                        var value = ngModel.$viewValue;
                        value.text = text;
                        ngModel.$setViewValue(value);
                    });
                });

                resizeEditor(editor, elem);
            });
        }
    };
});