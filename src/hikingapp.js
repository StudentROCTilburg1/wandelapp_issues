import $ from 'jquery';
import Ractive from 'ractive';
import Map from './map';
import {getroutesjson, posttextfile} from './routes';

// Init (Ractive) app
const hikingapp = function(remoteserver) {
    'use strict';

    //Init
    var map = null;
    var ractive_ui = new Ractive({
        el: '#container',
        template: '#template',
        debug: true
    });

    //Wait until Ractive is ready
    ractive_ui.on('complete', function() {
        map = new Map();
        const geo_options = {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 10000
        };

        getroutesjson(remoteserver + '/routes').then(
            function(routesjson) { // Succesfully retreived routes!
                ractive_ui.set("hikes", routesjson);
                //Watch location device
            },
            function(reason) {
                console.log(reason); // Error retreiving routes!
            }
        ).catch(function(e) {
            console.log(e);
        });

        navigator.geolocation.watchPosition(map.geo_success.bind(map), null, geo_options); //When debugging: test in FF because Chrome wont update position
    });

    //Show choosen route in map when clicked
    ractive_ui.on('collapse', function(event, filename, routeobj) {

        //Toggle description
        $(".item").toggle(false);
        $("#route" + filename).toggle(true);

        //Show chosen route
        map.showroute(routeobj.data.json);
    });

    // Handle upload gpx file to server
    ractive_ui.on('uploadgpx', function(event) {
        const file = event.original.target.files[0];
        if (file) {
            //Post route (gpx text file) async
            posttextfile(remoteserver + '/upload', file)
                .then(
                    function(){
                        //Retreive the latest routes async
                        getroutesjson(remoteserver + '/routes')
                            .then(
                                function(routesjson) {
                                    //Show success
                                    $("#info").html("Route is toegevoegd");
                                    ractive_ui.set("hikes", routesjson);
                                    //Show chosen route
                                    console.log(routesjson[0].data.json);
                                    const poilayer = map.showroute(routesjson[0].data.json);
                                },
                                function(reason) {
                                    //error
                                    $("#info").html(reason);
                                }
                            )
                            .catch(
                                function(reason) {
                                    //error
                                    $("#info").html(reason);
                                }
                            )
                        ;
                    }
                )
                .catch(
                    function(e) {
                        $("#info").html(e);
                    }
                )
            ;
        }
    });
};

//Expose ractive functions
exports.hikingapp = hikingapp;
