define(['jquery', 'tile'], function($, Tile) {
    function Map(filedata) {
        data = JSON.parse(filedata);
        this.map = [];
        this.name = data.name;
        this.size_x = data.size[0];
        this.size_y = data.size[1];
        for(var y = 0; y < this.size_y; y++) {
            this.map[y] = [];
            for(var x = 0; x < this.size_x; x++) {
                var $tile = $("<div>").addClass('x_' + x).addClass('tile');
                this.map[y][x] = new Tile($tile);
            }
        }
    }

    Map.prototype.updateTile = function(x, y, data) {
        this.getTile(x, y).update(data);
    }

    Map.prototype.getTile = function(x, y) {
        return this.map[y][x];
    }

    Map.prototype.updateUnit = function(x, y, data) {
        this.getTile(x, y).updateUnit(data);
    }
    return Map;
});
