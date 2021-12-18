#!/usr/bin/env bash

docker run -d \
    --name ape-postgres \
    --restart unless-stopped \
    -p 5432:5432 \
    -v `pwd`/data:/var/lib/postgresql/data/pgdata \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -e POSTGRES_PASSWORD=iKANTknowIT \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_DB=ape \
    postgres:13


