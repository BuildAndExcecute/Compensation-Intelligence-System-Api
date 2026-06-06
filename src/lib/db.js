import pkg from "pg";

const { Pool } = pkg;

const normalizeConnectionString = (value) => {
  if (!value) {
    return value;
  }

  let connectionString = value.trim();

  if (
    (connectionString.startsWith("\"") && connectionString.endsWith("\"")) ||
    (connectionString.startsWith("'") && connectionString.endsWith("'"))
  ) {
    connectionString = connectionString.slice(1, -1);
  }

  const url = new URL(connectionString);
  url.searchParams.delete("sslmode");

  connectionString = url.toString();

  return connectionString;
};

let pool;

const getPool = () => {
  const connectionString = normalizeConnectionString(process.env.DATABASE_URL);

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  return pool;
};

const db = {
  query: (...args) => getPool().query(...args),
  connect: (...args) => getPool().connect(...args),
};

export default db;
