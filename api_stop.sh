#!/bin/bash
ps -ef|grep -v grep|grep '/root/miniconda3/envs/dify/bin/flask run --host 0.0.0.0 --port=5011 --debug'|awk '{print $2}'|xargs kill -9