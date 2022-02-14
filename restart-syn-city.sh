#!/bin/env bash

git pull && pnpm i && pnpm build-syn-city && pm2 delete leaderboard && pm2 restart index --name leaderboard && pm2 save
