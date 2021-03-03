angular.module('pragueApp')
    .controller('indexController',['$location','$scope', '$rootScope', function ($location, $scope, $rootScope) {

        $rootScope.currentUser = "guest";
        let domain = $location.protocol() + "://" + $location.host() + ":" + $location.port() + "/";
        if (domain == "https://prague-advisor-server.herokuapp.com/") {
            $rootScope.host = domain;
        } else {
            $rootScope.host = "http://10.0.0.21:3000/"
        }
    }]);
