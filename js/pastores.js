var datosTrack ={};
$(function() {
    // Setup leaflet map
 

    var basemapLayer = new L.TileLayer('http://{s}.tiles.mapbox.com/v3/github.map-xgq2svrz/{z}/{x}/{y}.png');
	
	var OpenTopoMap = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		maxZoom: 17,
		attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	});
	
	var pnoa = L.tileLayer.wms("http://www.ign.es/wms-inspire/pnoa-ma", {
	   layers: "OI.OrthoimageCoverage",//layer name (see get capabilities)
	   format: 'image/jpeg',
	   transparent: false,
	   version: '1.3.0',//wms version (see get capabilities)
	   attribution: "PNOA WMS. Cedido por © Instituto Geográfico Nacional de España"
	});
	
	var Spain_MapasrasterIGN = L.tileLayer.wms('http://www.ign.es/wms-inspire/mapa-raster', {
		layers: 'mtn_rasterizado',
		format: 'image/png',
		transparent: false,
		continuousWorld : true,
		attribution: '© <a href="http://www.ign.es/ign/main/index.do" target="_blank">Instituto Geográfico Nacional de España</a>'
	});
	
	var runnerIcon = L.icon({
                    iconUrl: './imgs/running.png',
                    iconSize: [30, 30], // size of the icon
                    shadowSize: [1, 1], // size of the shadow
                    iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
                    shadowAnchor: [1, 1], // the same for the shadow
                    popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
                });	
	
	var map = new L.Map('map', {
		center: [40.38, -5.35],
		zoom: 14,
		layers: [OpenTopoMap, pnoa, Spain_MapasrasterIGN]
	});
	
	var baseMaps = {
		"Open topo map": OpenTopoMap,
		"Foto aérea": pnoa,
		"Mapa 25000": Spain_MapasrasterIGN

	};
	L.control.layers(baseMaps).addTo(map);
// =====================================================
	var gpx = "track.gpx"; // URL to your GPX file or the GPX itself

	new L.GPX(gpx, {
			async: true,
			marker_options: {
			startIconUrl: 'imgs/pin-icon-start.png',
			endIconUrl: 'imgs/pin-icon-end.png',
			shadowUrl: 'imgs/pin-shadow.png'
			}
		}).on('loaded', function(e) {
	  map.fitBounds(e.target.getBounds());
	  $("#max").text("Altura máxima: " + Math.round(e.target.get_elevation_max()));
	  $("#min").text("Altura mínima: " + Math.round(e.target.get_elevation_min()));
	  $("#gain").text("Desnivel acumulado: " + Math.round(e.target.get_elevation_gain()));
	  datosTrack.max = Math.round(e.target.get_elevation_min());
	  datosTrack.min = Math.round(e.target.get_elevation_max());
	  datosTrack.gain = Math.round(e.target.get_elevation_gain());
	  datosTrack.loss = Math.round(e.target.get_elevation_loss());
	}).addTo(map);

	
    // =====================================================
    // =============== Playback ============================
    // =====================================================
    
    // Playback options
    var playbackOptions = {
		layer: {
            pointToLayer : function(featureData, latlng){
                var result = {};
                
                if (featureData && featureData.properties && featureData.properties.path_options){
                    result = featureData.properties.path_options;
                }
                
                if (!result.radius){
                    result.radius = 3;
					result.opacity = 0.05;
					result.color = "orange";
					result.fillOpacity = 0.05;
                }
                
                return new L.CircleMarker(latlng, result);
            }
        },
		tickLen : 60000,
		speed: 5,
		tracksLayer: false,
        playControl: true,
        dateControl: true,
        sliderControl: true,
        orientIcons:true,
        marker: function (featureData) {
                    return {
                        icon: runnerIcon,
                        getPopup: function (feature) {
                            return feature.properties.name;
                        }
                        }
                        }  
    };
    
    var playback = new L.Playback(map, track, null, playbackOptions);
	
});
