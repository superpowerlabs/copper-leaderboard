#!/usr/bin/env bash

(cd monitor && pm2 start synner.js && pm2 save)
