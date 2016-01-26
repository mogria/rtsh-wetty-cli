define([], function() {
    function Util() {
    }
    
    Util.prototype.objcopy = function(from, to) {
        for(var prop in from) {
            if(from.hasOwnProperty(prop)) {
                to[prop] = from[prop];
            }
        }
    }

    return new Util();
});
