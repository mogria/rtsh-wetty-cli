var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var server = require('socket.io');
var pty = require('pty.js');
var fs = require('fs');
var fswalk = require('fs-walk');
var chokidar = require('chokidar');
var swig = require('swig');

var opts = require('optimist')
    .options({
        sslkey: {
            demand: false,
            description: 'path to SSL key'
        },
        sslcert: {
            demand: false,
            description: 'path to SSL certificate'
        },
        sshhost: {
            demand: false,
            description: 'ssh server host'
        },
        sshport: {
            demand: false,
            description: 'ssh server port'
        },
        sshauth: {
            demand: false,
            description: 'defaults to "password", you can use "publickey,password" instead'
        },
        port: {
            demand: true,
            alias: 'p',
            description: 'wetty listen port'
        },
    }).boolean('allow_discovery').argv;

// positional arguments
var players = opts._;

var runhttps = false;
var sshport = 22;
var sshhost = 'localhost';
var sshauth = 'password';

if (opts.sshport) {
    sshport = opts.sshport;
}

if (opts.sshhost) {
    sshhost = opts.sshhost;
}

if (opts.sshauth) {
	sshauth = opts.sshauth
}

if (opts.sslkey && opts.sslcert) {
    runhttps = true;
    opts['ssl'] = {};
    opts.ssl['key'] = fs.readFileSync(path.resolve(opts.sslkey));
    opts.ssl['cert'] = fs.readFileSync(path.resolve(opts.sslcert));
}

process.on('uncaughtException', function(e) {
    console.error('Error: ' + e);
});

var httpserv;

var app = express();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'public'));
// use the caching of express
app.set('view cache', false);
swig.setDefaults({ cache: false });
app.get('/rtsh/:user', function(req, res) {
    res.sendfile(__dirname + '/public/rtsh.html');
});

app.get('/', function(req, res) {
   fs.readFile('/world/world.json', 'utf8', function(err, data) {
       if(err) data = "no gameworld found"
       res.render('index', {'players': players, 'world': JSON.parse(data)});
   });
});

app.use('/', express.static(path.join(__dirname, 'public')));


if (runhttps) {
    httpserv = https.createServer(opts.ssl, app).listen(opts.port, function() {
        console.log('https on port ' + opts.port);
    });
} else {
    httpserv = http.createServer(app).listen(opts.port, function() {
        console.log('http on port ' + opts.port);
    });
}

var io = server(httpserv,{path: '/js/wetty/socket.io'});
var acceptConnections = function() {
    io.on('connection', function(socket){
        var sshuser = '';
        var request = socket.request;
        console.log((new Date()) + ' Connection accepted.');
        if (match = request.headers.referer.match('/rtsh/.+$')) {
            sshuser = match[0].replace('/rtsh/', '') + '@';
        }

        if(sshuser === '') {
            socket.close();
            return;
        }

        var term = pty.spawn('ssh', [sshuser + sshhost, '-p', sshport, '-o', 'PreferredAuthentications=' + sshauth], {
            name: 'xterm-256color',
            cols: 80,
            rows: 30
        });

        console.log((new Date()) + " PID=" + term.pid + " STARTED on behalf of user=" + sshuser)
        term.on('data', function(data) {
            socket.emit('output', data);
        });
        term.on('exit', function(code) {
            console.log((new Date()) + " PID=" + term.pid + " ENDED")
        });
        socket.on('resize', function(data) {
            term.resize(data.col, data.row);
        });
        socket.on('input', function(data) {
            term.write(data);
        });
        socket.on('disconnect', function() {
            term.end();
        });

        initWorld(socket)
    });
};


function initWorld(socket) {
    fs.readFile('/world/world.json', 'utf8', function(err, data) {
        if(err) {
            console.log("Error: couldn't read /world/world.json");
        }
        socket.emit('init-start', data);

        fswalk.files('/world', function(basedir, filename, stat, next) {
            var file = basedir + '/' + filename;
            console.log("found " + file);
            if(filename !== 'world.json') {
                sendfile(socket, 'init-tile', file);
            }
            next();

        }, function(err) {
            if(err) console.log(err)
            else socket.emit('init-end');
        });
    });
}

function sendfile(socket, eventname, file) {
    fs.readFile(file, 'utf8', function(err, data) {
        if(!err) {
            // console.log({ "file": file, "data": data })
            socket.emit(eventname, { "file": file, "data": data });
        } else {
            console.log("Error:");
            console.log(err);
        }
    });
}

var watcher = chokidar.watch('/world', { recursive: true });
watcher.on('add', path => sendfile(io.sockets, 'mapupdate-created', path))
watcher.on('change', path => sendfile(io.sockets, 'mapupdate-changed', path))
watcher.on('unlink', () => initWorld(io.sockets))
watcher.on('ready', () => acceptConnections());

var finish = function() {
    console.log("Caught interrupt signal");
    watcher.close();
    process.exit();
};

process.on('SIGTERM', finish);
process.on('SIGINT', finish);
