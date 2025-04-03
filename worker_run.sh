#!/bin/bash
cd /opt/dev/dify/api/
source activate dify
nohup  poetry run celery -A app.celery worker -P gevent -c 1 -Q dataset,generation,mail,ops_trace --loglevel INFO >> /opt/dev/dify/api/logs/dify_worker_run.log 2>&1 &
