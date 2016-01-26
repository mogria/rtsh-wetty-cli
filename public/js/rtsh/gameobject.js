define(['jquery', 'util'], function($, Util) {
    function GameObject(data, map) {
        this.data = data;
        Util.objcopy(data, this);
        this.map = map;
        this.$context = this.createContext(map);
        var that = this;
        this.$context.on("click", {}, function(ev) {
            that.showInfoPane(ev);
            return false;
        });
    }

    GameObject.createContext = function(map) {
        return null;
    }

    GameObject.prototype.update = function(data) {
        this.data = data;
        Util.objcopy(data, this);
        this.updateDisplay();
    }

    GameObject.prototype.updateDisplay = function() {
    }

    GameObject.prototype.showInfoPane = function(ev) {
        this.setInfoPane($("#infoPane").empty(), ev);
    }

    GameObject.prototype.setInfoPane = function($infoPane, ev) {
        $infoPane.append($("<h3>").text(this["class"]));
        var jsondata = JSON.stringify(this.data, null, 4);
        $infoPane.append($("<pre>").text(jsondata));
    }

    GameObject.prototype.remove = function() {
        this.$context.remove();
    }
    return GameObject;
})
