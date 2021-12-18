#!/usr/bin/env bash

pm2 delete all && pm2 start index.js -i max && pm2 save
