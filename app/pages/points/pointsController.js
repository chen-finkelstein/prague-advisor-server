angular.module('pragueApp')
    .controller('pointsController', ['$location', '$scope', '$http', '$window', '$rootScope', 'poiFactory', function ($location, $scope, $http, $window, $rootScope, poiFactory) {


        $scope.points = {};


        $scope.getPoints = function () {
            $http({
                url: $rootScope.host + "poi/",
                method: "GET"
            }).then(function (response) {
                result = response.data.result;
                for (i = 0; i < result.length; i++) {
                    if ($scope.points[result[i].Category] == undefined) {
                        $scope.points[result[i].Category] = [];
                    }
                    $scope.points[result[i].Category].push(result[i]);
                }
            }, function (response) {
                console.log(response.data);
            });
        }

        $scope.getPoints();


    }]);