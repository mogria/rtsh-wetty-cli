define(['jquery', 'wetty', 'map', 'tile'], function($, socket, Map, Tile) {
    var map;

    function handleFile(filedata) {
        var file = filedata.file;
        var data = JSON.parse(filedata.data);

        var tilePositionRegex = /^\/world\/(\d+)\/(\d+)\/tile.json$/;
        var tileMatches = file.match(tilePositionRegex);
        if(tileMatches !== null) {
            var x = +tileMatches[1];
            var y = +tileMatches[2];
            map.updateTile(x, y, data);
        }


        var unitPositionRegex = /^\/world\/(\d+)\/(\d+)\/units\/unit-([a-zA-Z]+).json$/;
        var unitMatches = file.match(unitPositionRegex);
        if(unitMatches !== null) {
            var x = +unitMatches[1];
            var y = +unitMatches[2];
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
