#!/bin/env bash

git pull && pnpm i && pnpm build-mob-land && pm2 delete leaderboard && pm2 restart index --name leaderboard && pm2 save
