#!/bin/bash
ps -ef|grep -v grep|grep 'celery -A app.celery worker -P gevent -c 1 -Q dataset,generation,mail,ops_trace --loglevel INFO'|awk '{print $2}'|xargs kill -9