FROM node:0.10.38
MAINTAINER Mogria <m0gr14@gmail.com>

ADD . /app
WORKDIR /app
RUN npm install
RUN apt-get update
RUN apt-get install -y vim
RUN mkdir /rts && \
    echo 'export PATH="$PATH:/rts"' > /etc/profile.d/rts-path.sh && \
    groupadd --gid 1312 rtshplayers && \
    useradd --uid 1337 rtshsrv

ADD rts /rts/rts
ADD public /app/public
ADD start-script.sh /usr/bin/start-script.sh

RUN chmod 700 /usr/bin/start-script.sh

# for every command the client has add a symlink to rts here:
RUN ln -s /rts/rts /rts/move

EXPOSE 3000

VOLUME ["/world", "/home", "/rts"]

ENTRYPOINT ["start-script.sh"]
