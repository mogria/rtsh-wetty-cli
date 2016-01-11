#!/bin/bash

for player in "$@"; do
    /home/create-player.sh -n "$player"
done

service ssh start
# make sure it's own ssh key is known so the user doesn't need to verify it
ssh-keyscan -H localhost >> /etc/ssh/ssh_known_hosts

cat > /app/public/index.html <<INDEXHTML
<!doctype html>
<html>
    <head><title>rtsh - game overview</title></head>
    <body>
        <h1>rtsh - Game Overview</h1>
        <h2>Players</h2>
        <ul>
$(for player in "$@"; do
    echo "<li>$player - <a href="/rtsh/$player">Enter</a></li>";
done)
        </ul>
        <h2>world.json</h2>
        <pre>
$(cat /world/world.json)
        </pre>
    </body>
</html>
INDEXHTML

exec gosu rtshwetty:rtshplayers node app.js -p 3000
