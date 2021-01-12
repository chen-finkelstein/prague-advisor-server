angular.module('pragueApp')
.controller('registerController', ['$location','$scope','$http','$window', function ($location,$scope, $http, $window) {
    $scope.error = false;
    $scope.errorMessage = "";
    $scope.categoriesError = false;

    $scope.categories = [
        {id:"Museums", checked: false},
        {id:"Nature", checked: false},
        {id:"Food", checked: false},
        {id:"NightLife", checked: false}];

    $scope.register = function () {
        if ($scope.regForm.$valid && $scope.categoriesValid()) {
            $http({
                url: "https://prague-advisor-server.herokuapp.com/user/register",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    Firstname: $scope.firstname,
                    Lastname: $scope.lastname,
                    Username: $scope.username,
                    Password: $scope.password,
                    Email: $scope.email,
                    Country: $scope.country,
                    City: $scope.city,
                    Museums: $scope.categories[0].checked,
                    Nature: $scope.categories[1].checked,
                    Food: $scope.categories[2].checked,
                    NightLife: $scope.categories[3].checked
                }
            }).then(function (response) {
                $scope.error = false;
                $location.path('/home');
            }, function (response) {
                $scope.error = true;
                $scope.errorMessage = response.data;
            });
        }
    }

    $scope.categoriesValid = function(){
        var count = 0;
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].checked) {
                $scope.categories[i].checked = 0;
                count++;
            } else {
                $scope.categories[i].checked = 1;
            }
        }
        if (count < 2) {
            $scope.categoriesError = true;
            return false;
        } else {
            $scope.categoriesError = false;
            return true;
        }
    }
    }]);