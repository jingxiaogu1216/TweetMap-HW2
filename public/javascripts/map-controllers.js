var PageCtrl = function ($rootScope, $scope, $http) {
    $scope.keyword="please choose a keyword!!"
    url='/heatmap'
    var map, heatmap;

    $.post(url, function(data, status) {
        var heatMapData = [];
        var data = JSON.parse(data);
        for (var i = 0; i < data.length; i++) {
            heatMapData.push(new google.maps.LatLng(data[i][0], data[i][1]));
            i++;
        }
        map = new google.maps.Map(document.getElementById('heatmap'), {
            zoom: 12,
            center: new google.maps.LatLng(40.760145, -73.964963),
            mapTypeId: google.maps.MapTypeId.MAP
        });

        heatmap = new google.maps.visualization.HeatmapLayer({
            data: heatMapData,
            map: map
        });
    });

    $rootScope.setkeyword=function(keywords){
        $scope.keyword=keywords
        url='/heatmap?sentiment='+$scope.keyword
        var map, heatmap;

        $.post(url, function(data, status) {

            var heatMapData = [];
            var data = JSON.parse(data);
            for (var i = 0; i < data.length; i++) {
                heatMapData.push({location:new google.maps.LatLng(data[i][0], data[i][1]),weight:1000});
                i++;
            }
            map = new google.maps.Map(document.getElementById('heatmap'), {
                zoom: 12,
                center: new google.maps.LatLng(40.760145, -73.964963),
                mapTypeId: google.maps.MapTypeId.MAP
            });

            var g = [
                'rgba(0, 255, 255, 0)',
                    'rgba(0, 255, 255, 1)',
                    'rgba(0, 191, 255, 1)',
                    'rgba(0, 127, 255, 1)',
                    'rgba(0, 63, 255, 1)',
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 0, 223, 1)',
                    'rgba(0, 0, 191, 1)',
                    'rgba(0, 0, 159, 1)',
                    'rgba(0, 0, 127, 1)',
                    'rgba(63, 0, 91, 1)',
                    'rgba(127, 0, 63, 1)',
                    'rgba(191, 0, 31, 1)',
                    'rgba(255, 0, 0, 1)'

              ]
            heatmap = new google.maps.visualization.HeatmapLayer({
                data: heatMapData,
                map: map,
                radius: 20,
                opacity: 1,
                gradient: g
            });
        });
        tweetmap.map.statMap.countMapData (
            $http,
            $scope.keyword,
            function (count) {
                $scope.count =" "+"twitter:  "+ count;
            }
        )

    }


}

var TrendCtrl = function ($rootScope, $scope, $http) {
    $scope.location='newyork'

    tweetmap.map.statMap.getWoeid(
        $http,
        $scope.location,
        function (trendList) {
            $scope.trendList = trendList ;
        }
    )

    $("#input").keydown(function(event){
        if(event.which == "13")
            tweetmap.map.statMap.getWoeid(
                $http,
                $scope.location,
                function (trendList) {
                    $scope.trendList = trendList ;
                }
            )
    });
}




