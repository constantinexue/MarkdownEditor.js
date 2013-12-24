window.mvc = angular.module('test', [])
    .directive('ngButtons', function($rootScope) {
        return {
            restrict: 'A',
            scope: false,
            // link: function(scope, elm, attrs, testController) {
            //     scope.current = scope.button1 = {
            //         selected: true
            //     };
            //     scope.button2 = {
            //         selected: false
            //     };
            //     scope.button3 = {
            //         selected: false
            //     };
            //     scope.select = function(button) {
            //         $scope.current.selected = false;
            //         $scope.current = button;
            //         $scope.current.selected = true;
            //     };
            // }
            controller: function($scope) {
                $scope.current = $scope.button1 = {
                    selected: true
                };
                $scope.button2 = {
                    selected: false
                };
                $scope.button3 = {
                    selected: false
                };
                $scope.select = function(button) {
                    $scope.current.selected = false;
                    $scope.current = button;
                    $scope.current.selected = true;
                };
            }
        };
    })
    .controller('testController', function($scope) {
        $scope.number = 123;
    });