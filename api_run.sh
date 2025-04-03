#!/bin/bash
cd /opt/dev/dify/api/
source activate dify
nohup poetry run flask run --host 0.0.0.0 --port=5011 --debug >> /opt/dev/dify/api/logs/dify_api_run.log 2>&1 &
