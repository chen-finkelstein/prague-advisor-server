angular.module('pragueApp')
    .controller('indexController',['$scope', '$rootScope', function ($scope, $rootScope) {

        $rootScope.currentUser = "guest";
    }]);
