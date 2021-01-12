angular.module('pragueApp')
.controller('pointsController', ['$location','$scope','$http','$window', '$rootScope', 'poiFactory', function ($location,$scope, $http, $window, $rootScope, poiFactory) {
    $scope.point = {
        imagePath: "https://www.prague-guide.co.uk/wp-content/uploads/2015/11/sasazu.jpg",
        name: "SaSaZu"
    } 
    poiFactory("museums", $scope.point);
    poiFactory("museums", $scope.point);
}]);