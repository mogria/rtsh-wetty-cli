#!/bin/bash

for player in "$@"; do
    /home/create-player.sh -n "$player"
done

service ssh start
# make sure it's own ssh key is known so the user doesn't need to verify it
ssh-keyscan -H localhost >> /etc/ssh/ssh_known_hosts

exec gosu rtshwetty:rtshplayers node app.js -p 3000 "$@"
