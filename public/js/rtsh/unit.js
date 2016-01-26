define(['jquery', 'gameobject', 'util'], function($, GameObject, Util) {
    function Unit(data, map) {
        GameObject.call(this, data, map);
        this.$img = $("<img />");
        this.$context.append(this.$img);
    }

    Unit.prototype = Object.create(GameObject.prototype);
    Unit.prototype.constructor = Unit;

    Unit.prototype.createContext = function(map) {
        var $tile = map.getTile(this.position[0], this.position[1])
        var $context = $("<div />");
        $tile.append($context);
        return $context;
    }

    Unit.prototype.updateDisplay = function() {
        this.updateImage();
    }

    Unit.prototype.updateImage = function() {
        this.$img.attr('src', 'img/units/' + this.unit_type + '.png');
        this.$context.attr('class', 'unit');
        this.$context.attr('id', 'unit' + this.unit_id);
    }

    return Unit;
});
