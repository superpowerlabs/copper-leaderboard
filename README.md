# SynCity NFT Project

## Installation

First, on Mac and Linux, install NVM (https://github.com/nvm-sh/nvm)

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

```

on Windows, install nvm-windows (https://github.com/coreybutler/nvm-windows).

The use nvm to install Node 16.

Then install pnpm globally:

```
npm i -g pnpm

```

then install the dependencies, build the project and run it~~~~

```
pnpm i
pnpm run build
pnpm run start
```

and connect to [http://localhost:6660](http://localhost:6660).

## The Discord bot

Install pm2 with

```
pnpm i -g pm2
```

and launch

```
./start-bot.sh
```

It expects that in `bot/.env` there is a valid Discord token.

## Copyright

(c) 2021-present ['ndujaLags'](https://ndujalabs.com) (<info@ndujalabs.com>)

## Licence

MIT
