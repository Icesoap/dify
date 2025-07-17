#!/bin/bash
cd /opt/dev/dify-sandbox-0.2.11/
#source activate dify
nohup ./main >> /opt/dev/dify-sandbox-0.2.11/logs/dify_sandbox_run.log 2>&1 &
