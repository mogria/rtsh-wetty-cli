define(['jquery'], function($) {
    function Unit(data) {
        this.$unit = data;

        for(var prop in data) {
            if(data.hasOwnProperty(prop)) {
                this[prop] = data[prop];
            }
        }
    }

    Unit.prototype.getHtmlDisplay = function() {
        var obj = JSON.stringify(this.$unit, null, 4);
        result = "<div><pre>" + obj + "</pre></div>";

        return result;
    }

    return Unit;
});
