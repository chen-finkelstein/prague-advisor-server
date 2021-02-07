angular.module('pragueApp')
.controller('pointsController', ['$location','$scope','$http','$window', '$rootScope', 'poiFactory', function ($location,$scope, $http, $window, $rootScope, poiFactory) {

    $scope.getAllPoints = function () {
        var k = 0;
        for (var i = 0; i < self.category.length; i++) {
            $http({
                url: self.serverUrl + "https://prague-advisor-server.herokuapp.com/poi/pointByCategory",
                method: "GET",
                params: { Category: self.category[i] }
            })
                .then(function (response) {
                    if (response.data != "No points in this category") {
                        result = response.data.result;
                        for (i = 0; i < result.length; i++) {
                            self.points[k] = {
                                id: k,
                                point: result[i],
                                checked: false
                            };
                            k++;
                        }
                        self.pressCheck();
                    }

                }, function (response) {
                });
        }
    }
}]);