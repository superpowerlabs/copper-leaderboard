#!/bin/env bash

git pull && pnpm i && pnpm build-mob-land &&
    pm2 delete leaderboard && ./start.sh
