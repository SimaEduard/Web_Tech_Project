
	var weatherUndergroundApp = angular.module('weatherUndergroundApp', ['ngRoute']);

	weatherUndergroundApp.config(function($routeProvider) {
		$routeProvider

			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'controller'
			})

	});

weatherUndergroundApp.controller('controller', ['$scope','$http', function($scope,$http) {
		$scope.message = 'Enter your location code';
		$scope.toggle = function() {
			console.log($scope.message);
			console.log("get to : "+ 'https://priect-technologii-web-simaeduard96.c9users.io:8081/weathers/' +$scope.message);
		$http.get('https://priect-technologii-web-simaeduard96.c9users.io:8081/weathersAPI/' +$scope.message)
        .success(function(data) {
        	console.log(data);
            var myElement=angular.element(document.querySelector('#weatherID'));
            var show= "Orasul cu acel cod este : " + data.current_observation.display_location.city + " sunt " + data.current_observation.feelslike_c+" grade Celsius, umiditate "+
            data.current_observation.relative_humidity+ " " +", latitudine : " +data.current_observation.display_location.latitude + " , longitudine "+ + data.current_observation.display_location.longitude;
            
            myElement.text(show);
            console.log('Error ...'+data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    	console.log("mainSearch");
    	console.log($scope.message)
  };
	}]);

