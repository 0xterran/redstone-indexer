# Development Notes


## Get Started (without Docker)

Start indexer
```sh
# Set the environment variables.
$ export RPC_HTTP_URL=https://rpc.holesky.redstone.xyz
# Run the indexer. Install it first if necessary.
$ export DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database_name
$ npx -y -p @latticexyz/store-indexer@next postgres-decoded-indexer
```

Verify the installation from within pSQL
```sh
$ psql -h localhost -U your_username -d your_database_name -W
```


## Setup Postgres

Poke around the db shell:
```sh
$ psql -h localhost -U your_username -d your_database_name -W
```

You need to create root user for indexer to control:
```sql
# CREATE ROLE root SUPERUSER LOGIN;
# ALTER USER root WITH PASSWORD 'your_password';
```

Then set the schema path:
```sql
# set search_path to "0x6e9474e9c83676b9a71133ff96db43e7aa0a4342";
```


## Index World History

Sync to latest block:
```sh
docker run \
   --platform linux/amd64 \
   -e 'DEBUG=mud:*' \
   -e RPC_HTTP_URL=https://rpc.holesky.redstone.xyz \
   -e RPC_WS_URL=wss://rpc.holesky.redstone.xyz/ws \
   -e DATABASE_URL=postgres://root:your_password@host.docker.internal/your_database_name \
   -e START_BLOCK=795629 \
   -p 3001:3001  \
   ghcr.io/latticexyz/store-indexer:latest  \
   pnpm start:postgres-decoded
```


## Hard Reset Docker
Hard reset includes removing the volumes.

```sh
$ docker compose down -v
$ docker build --no-cache -t my-container-name .
$ docker compose up

# or
$ docker compose down -v && docker build --no-cache -t my-container-name . && docker compose up
```
