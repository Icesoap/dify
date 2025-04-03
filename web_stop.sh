#!/bin/bash
ps -ef|grep -v grep|grep 'node /opt/dev/dify/web/node_modules/.bin/../next/dist/bin/next dev -p 3010'|awk '{print $2}'|xargs kill -9