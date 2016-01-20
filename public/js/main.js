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
        map: 'rtsh/map',
        update: 'rtsh/update'
    }
});

requirejs(['update'], function(update) {
    // update runs automatically
});
