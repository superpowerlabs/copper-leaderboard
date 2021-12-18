#!/usr/bin/env bash

(cd bot && pm2 start synner.js && pm2 save)
