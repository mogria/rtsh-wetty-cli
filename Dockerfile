FROM node:latest
MAINTAINER Mogria <m0gr14@gmail.com>

ADD package.json /app/package.json
ADD bin/wetty.js /app/bin/wetty.js
ADD README.md /app/README.md
ADD .bowerrc /app/.bowerrc
ADD bower.json /app/bower.json
ADD start-script.sh /usr/bin/start-script.sh
WORKDIR /app
# clone over git:// doesn't always work, rather use https://
RUN git config --global url."https://github.com".insteadOf "git://github.com" && \
    npm install --production && \
    npm install -g bower && \
    mkdir -p /app/public/vendor && \
    bower install --allow-root
RUN apt-get update
RUN apt-get install -y vim
RUN mkdir /rts && \
    echo 'export PATH="$PATH:/app/rts"' > /etc/profile.d/rts-path.sh && \
    groupadd --gid 1312 rtshplayers && \
    useradd --uid 1337 rtshsrv && \
    chmod 700 /usr/bin/start-script.sh

ADD . /app

# for every command the client has add a symlink to rts here:
RUN ln -s /app/rts/rts /app/rts/move

EXPOSE 3000

VOLUME ["/world", "/home", "/app/public"]

ENTRYPOINT ["start-script.sh"]
