define(['jquery', 'wetty', 'map', 'tile'], function($, socket, Map, Tile) {
    var map;

    var files = {};

    function handleFile(filedata) {
        var file = filedata.file;
        var data = JSON.parse(filedata.data);

        files[file] = data;

        var x = data.position[0];
        var y = data.position[1];

        if(data["class"] == 'tile') {
            map.updateTile(x, y, data);
        } else if(data["class"] == 'unit') {
            map.updateUnit(x, y, data);
        }
    }

    socket.on('init-start', function(data) {
        map = new Map(data);
    });

    socket.on('init-tile', function(filedata) {
        handleFile(filedata);
    });

    socket.on('init-end', function() {
        var $map = $("#map").empty();

        for(var y = 0; y < map.size_x ; y++) {
            $y = $("<div>").addClass('y_' + y).addClass('tilerow');
            $map.append($y);
            for(var x = 0; x < map.size_y; x++) {
                $y.append(map.map[y][x].$tile);
            }
        }
    });

    socket.on('mapupdate-created', function(data) {
        handleFile(data);
    });

    socket.on('mapupdate-changed', function(data) {
        handleFile(data);
    });

    socket.on('mapupdate-removed', function(data) {
        console.log(data);
    });
});
