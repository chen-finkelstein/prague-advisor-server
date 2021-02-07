angular.module('pragueApp')
    .controller('loginController', ['$location', '$scope', '$http', '$window', '$rootScope', function ($location, $scope, $http, $window, $rootScope) {
        $scope.username = "";
        $scope.password = "";
        $scope.error = false;

        $scope.login = function () {
            $http({
                url: $rootScope.host + "user/login",
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    Username: $scope.username,
                    Password: $scope.password
                }
            }).then(function (response) {
                $scope.error = false;
                $window.localStorage.setItem('token', response.data.token);
                $rootScope.currentUser = $scope.username;
                $scope.getAllFavs();
                $location.path('/home');
            }, function (response) {
                $scope.error = true;
            });
        }

        $scope.getAllFavs = function () {
            $window.localStorage.setItem('favs', []);
            $http({
                url: "https://prague-advisor-server.herokuapp.com/poi/by_date",
                method: "GET",
                headers: {
                    'x-auth-token': $window.localStorage.getItem('token')
                },
                params: { Username: $scope.username }
            })
                .then(function (response) {
                    list = [];
                    if (response.data != "No saved points") {
                        saved = response.data.result;
                        for (i = 0; i < saved.length; i++) {
                            list[i] = saved[i].PointID;
                        }
                        $window.localStorage.setItem('favs', list);
                        $rootScope.favsNum = list.length;
                    }
                }, function (response) {
                });
        }
    }]);