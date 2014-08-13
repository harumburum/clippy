(function() {
    'use strict';

    var app = angular.module('app');

    app.directive('fileInput', ['$parse', function($parse){
        return {
            restrict: 'A',
            link: function(scope, element, attrs){
                element.bind('change', function(){
                    $parse(attrs.fileInput)
                        .assign(scope, element[0].files);
                    scope.$apply();
                });
            }
        }
    }]);

})();