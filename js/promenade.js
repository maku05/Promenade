angular.module('promenadeApp', ['ngDragDrop', 'ui.bootstrap', 'uiGmapgoogle-maps'])
.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
})
.controller('ArticlesCtrl', function($scope, $http, uiGmapGoogleMapApi){
    // get json with data of baths
    $http.get('json/bath.json').then(function(articlesResponse){
        $scope.articles = articlesResponse.data;
    });
    // Tab-Navigation
    $scope.hide = function(){
        if($scope.tab == 1){
            $scope.tab = 2;
        }
        else{
            $scope.tab = 1;
        }
    }
    //TabControl
    $scope.tab = 1;

    $scope.setTab = function(tabValue){
        $scope.tab = tabValue;
    }
    $scope.isSet = function(tabValue){
        return $scope.tab === tabValue;
    }
    //GoogleMap
    uiGmapGoogleMapApi.then(function(maps) {
       var lat = 0;
        var lng = 0;
        $scope.showPosition = function (position) {
            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;
            $scope.accuracy = position.coords.accuracy;
            $scope.$apply();
            lat = $scope.lat;
            lng = $scope.lng;
        }
        $scope.showError = function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    $scope.error = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.error = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    $scope.error = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    $scope.error = "An unknown error occurred."
                    break;
            }
            $scope.$apply();
        }
        $scope.getLocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
            }
            else {
                $scope.error = "Geolocation is not supported by this browser.";
            }
        }
        $scope.getLocation();
         $scope.map = {
            center: {latitude: lat, longitude: lng},
            zoom: 12,
            disableDefaultUI: true
        };
        $scope.infoOptions = {visible: false};
        $scope.onClick = function(){
            $scope.map.refresh();
            $scope.infoOptions.visible = !$scope.infoOptions.visible;
        };
        $scope.closeClick = function(){
            $scope.infoOptions.visible = false;
        };
        $scope.icon = new google.maps.MarkerImage('img/marker.png', new google.maps.Size(60,60), new google.maps.Point(0,0), new google.maps.Point(30,60));
    });
});
