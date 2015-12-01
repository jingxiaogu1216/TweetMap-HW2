/**
 * Created by huisu on 11/28/15.
 */
google.maps.event.addDomListener(window, 'load', function(){
    var map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(40.760145, -73.964963),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var socket = io.connect('http://52.91.244.233:9000');

    socket.on("tweet", function(data) {
        console.log(data);
        if (data) {
            var location = new google.maps.LatLng(data.lat, data.lng);

            var infowindow = new google.maps.InfoWindow();
            infowindow.setContent('<a style="color: #55ACEE">'+data.sentiment+ ': '+'</a>'+ '<p style="color: #0f0f0f" >' + data.text+'</p>');

            var imgurl='../images/n.ico'
            if(data.sentiment=='positive'){
                imgurl='../images/p.ico'
            }else if(data.sentiment=='negative'){
                imgurl='../images/ne.ico'
            }
            var image = {
                url: imgurl,
                size: new google.maps.Size(60, 60),
            };
            var marker = new google.maps.Marker({
                position: location,
                icon:image,
                title: "Client Geolocation",
                animation: google.maps.Animation.DROP,
                draggable: true
            });

            marker.setMap(map);

            google.maps.event.addListener(marker, 'mouseover', function() {
                infowindow.open(map, marker);
            });
            google.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close(map, marker);
            });
        }
    });
    socket.on('disconnect',function(){
        console.log('disconneted');
    });
});
