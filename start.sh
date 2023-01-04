#!/usr/bin/env bash

pm2 start index.js -i 1 --name leaderboard && pm2 save
