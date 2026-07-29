#!/bin/bash
cd /home/admin/tianshi-calendar || exit
git fetch origin -q
LOCAL=
REMOTE=
if [ "" != "" ]; then
  git reset --hard origin/main -q
  sudo kill -9  2>/dev/null
  nohup sudo /usr/bin/node server.js > /dev/null 2>&1 &
fi
