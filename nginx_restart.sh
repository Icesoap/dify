#!/bin/bash
ps -ef|grep -v grep|grep 'nginx'|awk '{print $2}'|xargs kill -9
systemctl start nginx