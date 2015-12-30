#!/bin/bash

for player in "$@"; do
    /home/create-player.sh -n "$player"
done

exec node app.js -p 3000
