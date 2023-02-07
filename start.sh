#!/usr/bin/env bash

pnpm i
pnpm build
pm2 delete leaderboard
pm2 start index.js -i 1 --name leaderboard && pm2 save
