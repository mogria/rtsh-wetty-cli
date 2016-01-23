define(['jquery', 'unit'], function($, Unit) {
    function Tile($tile) {
        this.$tile = $tile;
        this.type = 'none';
        this.units = [];

        this.$tile.on("click", {tile: this}, this.updateTileContext);
    }

    Tile.prototype.updateTileContext = function(e) {
        $tile = e.data.tile;
        var $tileContext = $("#tileContext").empty();
        $tileContext.append($tile.terrain);
    }

    Tile.prototype.update = function(data) {
        this.$tile.removeClass('terrain-' + this.terrain);
        for(var prop in data) {
            if(data.hasOwnProperty(prop)) {
                this[prop] = data[prop];
            }
        }
        this.$tile.addClass('terrain-' + this.terrain);

    }

    Tile.prototype.updateUnit = function(data) {
        var unit = new Unit(data);
        this.units.push(unit);

        this.$tile.find("img").remove();
        this.$tile.append("<img src='/img/units/" + unit.unit_type.toLowerCase() + ".png'>");
    }

    return Tile;
});
