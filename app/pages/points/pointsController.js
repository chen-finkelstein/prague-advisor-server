angular.module('pragueApp')
    .controller('pointsController', ['$timeout','$location', '$scope', '$http', '$window', '$rootScope', 'poiFactory', function ($timeout, $location, $scope, $http, $window, $rootScope, poiFactory) {

        $scope.getPoints = function () { 
            $http({
                url: $rootScope.host + "poi/",
                method: "GET"
            }).then(function (response) {
                $scope.points = response.data.result;
                s_categories = new Set();
                for (i = 0; i < $scope.points.length; i++) {
                    s_categories.add($scope.points[i].Category);
                }
                $scope.categories = Array.from(s_categories);
                console.log($scope.points);
            }, function (response) {
                console.log(response.data);
            });
        }
        
        $scope.getPoints();


    }]);