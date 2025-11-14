import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: "postgresql://flowserve_db_user:aSqkmC96WWjYPZ5vPzBJyFDP8gU6qERs@dpg-d41ktfa4d50c73es43e0-a.oregon-postgres.render.com/flowserve_db?sslmode=require",
  },
});
