#!/bin/bash
cd /opt/dev/dify/web
#source activate dify
nohup pnpm start >> /opt/dev/dify/web/logs/dify_web_run.log 2>&1 &
