angular.module('app', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap.modal']);

angular.module('app').config(function($routeProvider, $locationProvider){
    //$locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {templateUrl: '/partials/main/main', controller: 'mainCtrl'})
        .when('/img', {templateUrl: '/partials/img/imgList', controller: 'imgListCtrl'})
        .when('/img/:id', {templateUrl: '/partials/img/img', controller: 'imgCtrl'});
});