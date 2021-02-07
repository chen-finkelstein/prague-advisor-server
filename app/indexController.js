angular.module('pragueApp')
    .controller('indexController',['$scope', '$rootScope', function ($scope, $rootScope) {

        $rootScope.currentUser = "guest";
        // $rootScope.host = "https://prague-advisor-server.herokuapp.com/";
        $rootScope.host = "http://localhost:3000/"
    }]);
