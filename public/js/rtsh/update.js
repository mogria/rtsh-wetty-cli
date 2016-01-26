define(['jquery', 'wetty', 'map', 'gameobjectfactory', 'util'], function($, socket, Map, gameObjectFactory, Util) {
    var map;

    var files = {};

    function handleFile(filedata, map) {
        var file = filedata.file;
        var data = JSON.parse(filedata.data);

        if(typeof files[file] === 'undefined') {
            var gameobject = gameObjectFactory(map, data);
            // make sure the factory could produce an object
            if(typeof gameobject !== 'undefined') {
                gameobject.updateDisplay();
                var save = {}
                // don't pollute data, because it gets displayed
                // as json later again
                Util.objcopy(data, save);
                save.gameobject = gameobject;
                files[file] = save;
            }
        } else {
            files[file].gameobject.update(data);
        }
    }

    function handleRemoval(filedata) {
        var file = filedata.file;
        files[file].gameobject.remove()
        delete files[file];

    }

    socket.on('init-start', function(data) {
        map = new Map(JSON.parse(data));
    });

    socket.on('init-tile', function(filedata) {
        handleFile(filedata, map);
    });

    socket.on('init-end', function() {
    });

    socket.on('mapupdate-created', function(data) {
        handleFile(data, map);
    });

    socket.on('mapupdate-changed', function(data) {
        handleFile(data, map);
    });

    socket.on('mapupdate-removed', function(data) {
        handleRemoval(data);
    });
});
