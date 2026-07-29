#!/bin/bash
cd /home/admin/tianshi-calendar
git pull
sudo kill -9  2>/dev/null
sudo /usr/bin/node server.js
