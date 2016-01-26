define(['jquery', 'gameobject', 'util'], function($, GameObject, Util) {
    function Tile(data, map) {
        GameObject.call(this, data, map);
    }

    Tile.prototype = Object.create(GameObject.prototype);
    Tile.prototype.constructor = Tile;

    Tile.prototype.createContext = function(map) {
        return this.map.getTile(this.position[0], this.position[1])
    }

    Tile.prototype.setInfoPane = function($infoPane, ev) {
        GameObject.prototype.setInfoPane.call(this, $infoPane, ev);
        $("<div>").text(this.terrain).insertAfter($infoPane.find("h3"));
    }

    Tile.prototype.updateDisplay = function() {
        this.$context.attr('class', 'tile terrain-' + this.terrain);
    }

    return Tile;
});
