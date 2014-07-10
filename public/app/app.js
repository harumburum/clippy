angular.module('app', ['ngResource', 'ngRoute']);

angular.module('app').config(function($routeProvider, $locationProvider){
    //$locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {templateUrl: '/partials/main/main', controller: 'mainCtrl'})
        .when('/signup', {templateUrl: '/partials/account/signup', controller: 'signupCtrl'})
        .when('/myimages', {templateUrl: '/partials/myImages/myImages', controller: 'myImagesCtrl'});
});