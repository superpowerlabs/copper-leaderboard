#!/usr/bin/env bash

pm2 start index.js -i max --name leaderboard && pm2 save
