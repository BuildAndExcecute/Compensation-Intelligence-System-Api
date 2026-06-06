-- companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  industry TEXT,
  website TEXT UNIQUE
);

-- roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE locations(
    id SERIAL PRIMARY KEY,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    UNIQUE(city, country)
);

-- salaries table
CREATE TABLE compensation_records(
  id SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  role_id INT REFERENCES roles(id),
  location_id INT REFERENCES locations(id),
  base_salary INT NOT NULL CHECK(base_salary > 0),
  bonus INT DEFAULT 0 CHECK(bonus>=0),
  stock INT DEFAULT 0 CHECK(stock>=0),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(company_id, role_id, location_id)
);
