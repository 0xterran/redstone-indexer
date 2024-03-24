# Redstone Indexer Demo

How to run:
```sh
# Terminal 1
$ docker compose up
# Terminal 2
$ yarn dev
```

## Setup Indexer

Initial setup instructions.

Start the postgres database:
```sh
$ docker compose up
```

Start indexer
```sh
# Set the environment variables.
$ export RPC_HTTP_URL=https://rpc.holesky.redstone.xyz
# Run the indexer. Install it first if necessary.
$ export DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database_name
$ npx -y -p @latticexyz/store-indexer@next postgres-decoded-indexer
```

Now enter Postgres and poke around the db shell:
```sh
$ psql -h localhost -U your_username -d your_database_name -W
```

You need to create root user for indexer to control:
```sql
# CREATE ROLE root SUPERUSER LOGIN;
# ALTER USER root WITH PASSWORD 'your_password';
```


Now check for the schema you want:

```sql
# \dn
-- this should return a list like this:
-- 0x7203e7adfdf38519e1ff4f8da7dcdc969371f377 | root
-- 0x827e84366330764d6f784472b2caf3f7611184e9 | root
-- 0xc9c356067bdaa07ec18f64ae29eda8ca48f9e3c1 | root
-- mud                                        | root
-- public                                     | pg_database_owner
```
We can pick the first one to use as the schema path.
```sql
# set search_path to "0x7203e7adfdf38519e1ff4f8da7dcdc969371f377";
```


Finally you can run the indexer and sync data to postgres
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

Back inside postgres, check if you can see the database tables. There should be 100+

```sh
$ psql -h localhost -U your_username -d your_database_name -W
```
```sql
# set search_path to "0x6e9474e9c83676b9a71133ff96db43e7aa0a4342";
# \dt
```