define(['jquery'], function($) {
    function Unit(data) {
        for(var prop in data) {
            if(data.hasOwnProperty(prop)) {
                this[prop] = data[prop];
            }
        }
    }

    return Unit;
});
