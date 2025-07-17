#!/bin/bash
ps -ef|grep -v grep|grep './main'|awk '{print $2}'|xargs kill -9