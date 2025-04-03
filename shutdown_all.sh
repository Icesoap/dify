#!/bin/bash
ps -ef|grep -v grep|grep 'node /opt/dev/dify/web/node_modules/.bin/../next/dist/bin/next dev -p 3010'|awk '{print $2}'|xargs kill -9 && ps -ef|grep -v grep|grep
'/root/miniconda3/envs/dify/bin/flask run --host 0.0.0.0 --port=5011 --debug'|awk '{print $2}'|xargs kill -9 && ps -ef|grep -v grep|grep 'celery -A app.celery worker -P gevent
-c 1 -Q dataset,generation,mail,ops_trace --loglevel INFO'|awk '{print $2}'|xargs kill -9