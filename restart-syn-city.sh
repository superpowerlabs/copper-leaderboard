#!/bin/env bash

git pull && pnpm i && pnpm build-syn-city &&
    pm2 delete leaderboard && ./start.sh

