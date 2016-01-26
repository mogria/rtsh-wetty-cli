requirejs.config({
    baseUrl: '/js',
    shim: {
        'hterm': {
            exports: 'hterm'
        }
    },
    paths: {
        jquery: 'vendor/jquery/dist/jquery',
        hterm: 'wetty/hterm_all',
        socketio: 'wetty/socket.io/socket.io',
        wetty: 'wetty/wetty',
        tile: 'rtsh/tile',
        gameobject: 'rtsh/gameobject',
        gameobjectfactory: 'rtsh/gameobjectfactory',
        map: 'rtsh/map',
        unit: 'rtsh/unit', 
        update: 'rtsh/update',
        util: 'rtsh/util'
    }
});

requirejs(['update'], function(update) {
    // update runs automatically
});
