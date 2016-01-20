define(['jquery'], function($) {
    function Tile($tile) {
        this.$tile = $tile;
        this.type = 'none';
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
        this.$tile.find("img").remove();
        this.$tile.append("<img src='/img/units/" + data.type.toLowerCase() + ".png'>");
    }

    return Tile;
});
