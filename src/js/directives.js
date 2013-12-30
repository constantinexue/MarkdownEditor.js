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