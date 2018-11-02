L.LayerGroup.IndigenousLandsLanguagesLayer = L.LayerGroup.extend(

    {
        options: {
            url: 'https://native-land.ca/api/index.php?maps=languages&position=45,-72',
            popupOnMouseover: false,
            clearOutsideBounds: false,
            target: '_self',
            minZoom: 0,
            maxZoom: 18
        },

        initialize: function (options) {
            options = options || {};
            L.Util.setOptions(this, options);
            this._layers = {};

        },

        onAdd: function (map) {
            map.on('moveend', this.requestData, this);
            this._map = map;
            this.requestData();

        },

        onRemove: function (map) {
            map.off('moveend', this.requestData, this);
            this.clearLayers();
            this._layers = {};
        },

        requestData: function () {
                var self = this ;
                (function() {
                    var script = document.createElement("SCRIPT");
                    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
                    script.type = 'text/javascript';
                    var zoom = self._map.getZoom(), origin = self._map.getCenter() ;
                    script.onload = function() {
                        var $ = window.jQuery;
                        var ILL_url = "https://native-land.ca/api/index.php?maps=languages&position=" + parseInt(origin.lat) + "," + parseInt(origin.lng);
                        $.getJSON(ILL_url , function(data){
                         // console.log(parseInt(origin.lat) +" and "+parseInt(origin.lng)) ;
                         self.parseData(data) ;
                        });
                    };
                    document.getElementsByTagName("head")[0].appendChild(script);
                })();


        },

        getPoly: function (data) {
              var coords = data.geometry.coordinates;
              var nme = data.properties.Name;
              var frNme = data.properties.FrenchName;
              var desc = data.properties.description;
              var frDesc = data.properties.FrenchDescription;
              var clr = data.properties.color;
              var ill_marker ;
              if (!isNaN((coords)) ){
                ill_marker = L.polygon(coords, {color: clr}).bindPopup("<strong>Name : </strong>" + nme + "(" + frNme + ")<br><strong>Description : </strong>" + desc) ;
              }
            return ill_marker ;
        },

        addPoly: function (data) {
            var poly = this.getPoly(data),
             key = data.id ;

            if (!this._layers[key]) {
                this._layers[key] = poly;
                this.addLayer(poly);
            }
        },

        parseData: function (data) {

        if (!!data){
           for (i = 0 ; i < data.length ; i++) {
            this.addPoly(data[i]) ;
           }

             if (this.options.clearOutsideBounds) {
                this.clearOutsideBounds();
            }
          }
        },

        clearOutsideBounds: function () {
            var bounds = this._map.getBounds(),
                latLng,
                key;

            /*for (key in this._layers) {
                if (this._layers.hasOwnProperty(key)) {
                    latLng = this._layers[key].getLatLng();

                    if (!bounds.contains(latLng)) {
                        this.removeLayer(this._layers[key]);
                        delete this._layers[key];
                    }
                }
            }*/
        }
    }
);

L.layerGroup.indigenousLandsLanguagesLayer = function (options) {
    return new L.LayerGroup.IndigenousLandsLanguagesLayer(options);
};
