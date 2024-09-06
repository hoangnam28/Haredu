#!/bin/sh
inotifywait -m /etc/nginx/conf.d -e modify | while read; do
    nginx -s reload
done &

exec "$@"
