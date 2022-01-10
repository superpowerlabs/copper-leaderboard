#!/usr/bin/env bash

(cd monitor && pm2 start monitor.js && pm2 save)
