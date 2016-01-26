define(['jquery', 'gameobject'], function($, GameObject) {
    function Map(data) {
        GameObject.call(this, data, this);
        this.tiles = []
        for(var y = 0; y < this.size[1]; y++) {
            $y = $("<div>").addClass('y_' + y).addClass('tilerow');
            this.$context.append($y);
            this.tiles[y] = [];
            for(var x = 0; x < this.size[0]; x++) {
                var $tile = $("<div>").addClass('x_' + x);
                $y.append($tile);
                this.tiles[y][x] = $tile;
            }
        }
    }

    Map.prototype = Object.create(GameObject.prototype);
    Map.prototype.constructor = Map;

    Map.prototype.createContext = function() {
        return this.get();
    }

    Map.prototype.get = function() {
        return $("#map");
    }

    Map.prototype.getTile = function(x, y) {
        return this.tiles[y][x];
    }

    Map.prototype.updateDisplay = function() {
    }
    return Map;
});
