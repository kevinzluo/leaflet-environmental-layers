L.LayerGroup.AQICNLayer = L.LayerGroup.extend(
    
    {
        options: {
            popupOnMouseover: true,
            clearOutsideBounds: false,
        },
        
        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);  
            this._layers = {}; 
        },
        
        onAdd: function (map) {
            map.on('moveend', this.requestRegionData, this);
            this._map = map;
            this.requestRegionData();
        },
        
        onRemove: function (map) {
            map.off('moveend', this.requestRegionData, this);
            this.clearLayers();
            this._layers = {};
        },
        
        requestRegionData: function () {
                var self = this ; 
                var tokenID = "566331c289f0aeacd78e0b18362b4bcfa5097572";

                
                (function() {
                    var script = document.createElement("SCRIPT");
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                    script.type = 'text/javascript';
                    
                    var zoom = self._map.getZoom(), northeast = self._map.getBounds().getNorthEast() , southwest = self._map.getBounds().getSouthWest() ;
                    
                    script.onload = function() {
                        var $ = window.jQuery;
                        var AQI_url = "https://api.waqi.info/map/bounds/?latlng=" + southwest.lat + "," + southwest.lng + "," + northeast.lat + "," + northeast.lng + "&token=" + tokenID;
                        console.log(AQI_url);
                        
                         $.getJSON(AQI_url , function(data){
                             // console.log(parseInt(origin.lat) +" and "+parseInt(origin.lng)) ;
                             console.log(data);
                             //self.parseData(data) ;    
                         });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();             
        },    
    }
);

L.layerGroup.aqicnLayer = function(options) {
    return new L.LayerGroup.AQICNLayer(options);
}