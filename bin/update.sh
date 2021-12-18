#!/usr/bin/env bash

git pull && pnpm i && pnpm run build && pm2 restart all
