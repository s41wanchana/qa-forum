// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
import dotenv from "dotenv";

const { Pool } = pg.default;
dotenv.config();

const connectionPool = new Pool({
  connectionString: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

export default connectionPool;
