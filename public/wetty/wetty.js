var term;
var socket = io(location.origin, {path: '/wetty/socket.io'})
var buf = '';

function Wetty(argv) {
    this.argv_ = argv;
    this.io = null;
    this.pid_ = -1;
}

Wetty.prototype.run = function() {
    this.io = this.argv_.io.push();

    this.io.onVTKeystroke = this.sendString_.bind(this);
    this.io.sendString = this.sendString_.bind(this);
    this.io.onTerminalResize = this.onTerminalResize.bind(this);
}

Wetty.prototype.sendString_ = function(str) {
    socket.emit('input', str);
};

Wetty.prototype.onTerminalResize = function(col, row) {
    socket.emit('resize', { col: col, row: row });
};

socket.on('connect', function() {
    lib.init(function() {
        hterm.defaultStorage = new lib.Storage.Local();
        term = new hterm.Terminal();
        window.term = term;
        term.decorate(document.getElementById('terminal'));

        term.setCursorPosition(0, 0);
        term.setCursorVisible(true);
        term.prefs_.set('ctrl-c-copy', true);
        term.prefs_.set('ctrl-v-paste', true);
        term.prefs_.set('use-default-window-copy', true);

        term.runCommandClass(Wetty, document.location.hash.substr(1));
        socket.emit('resize', {
            col: term.screenSize.width,
            row: term.screenSize.height
        });

        if (buf && buf != '')
        {
            term.io.writeUTF16(buf);
            buf = '';
        }
    });
});

socket.on('output', function(data) {
    if (!term) {
        buf += data;
        return;
    }
    term.io.writeUTF16(data);
});


socket.on('disconnect', function() {
    console.log("Socket.io connection closed");
});

function Tile($tile) {
    this.$tile = $tile;
    this.type = 'none';
}

Tile.prototype.update = function(data) {
    this.$tile.removeClass('terrain-' + this.terrain);
    this.$tile.find("img").remove();
    for(var prop in data) {
        if(data.hasOwnProperty(prop)) {
            this[prop] = data[prop];
        }
    }
    this.$tile.addClass('terrain-' + this.terrain);
    this.$tile.append("<img src='/unit-swordFighter.png'>");
}

function Map(filedata) {
    data = JSON.parse(filedata);
    this.map = [];
    this.name = data.name;
    this.size_x = data.size[0];
    this.size_y = data.size[1];
    for(var y = 0; y < this.size_y; y++) {
        this.map[y] = [];
        for(var x = 0; x < this.size_x; x++) {
            var $tile = $("<div>").addClass('x_' + x).addClass('tile');
            this.map[y][x] = new Tile($tile);
        }
    }
}

Map.prototype.updateTile = function(x, y, data) {
    this.map[y][x].update(data);
}

var map;

socket.on('init-start', function(data) {
    map = new Map(data);
});

socket.on('init-tile', function(filedata) {
    var file = filedata.file;
    var data = JSON.parse(filedata.data);

    var positionRegex = /^\/world\/(\d+)\/(\d+)\/tile.json$/;
    var matches = file.match(positionRegex);
    if(matches !== null) {
        var x = +matches[1];
        var y = +matches[2];
        map.updateTile(x, y, data);
    }
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

socket.on('mapupdate-created', function() {
});

socket.on('mapupdate-changed', function() {
});

socket.on('mapupdate-removed', function() {
});
