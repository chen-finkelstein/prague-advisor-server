let app = angular.module('pragueApp', ["ngRoute"]);

// config routes
app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider)  {

    $locationProvider.hashPrefix('');

    $routeProvider
        // homepage
        .when('/', {
            templateUrl: 'pages/home/home.html',
            controller : 'homeController as homeCtrl'
        })
        .when('/login', {
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl'
        })
        .when('/register', {
            templateUrl: 'pages/register/register.html',
            controller : 'registerController as rgstrCtrl'
        })
        .when('/poi', {
            templateUrl: 'pages/points/points.html',
            controller : 'pointsController as poiCtrl'
        })
        // other
        .otherwise({ redirectTo: '/' });
}]);