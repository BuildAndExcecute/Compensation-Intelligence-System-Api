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

const pool = new Pool({
  connectionString: normalizeConnectionString(process.env.DATABASE_URL),
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
