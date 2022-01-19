#!/bin/env bash

git pull && pnpm build && pm2 restart index
