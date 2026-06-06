import db from "@/lib/db.js";

export const Company = {
  findAll: () => {
    return db.query(
      `SELECT *
       FROM companies
       ORDER BY name ASC`
    );
  },

  findById: (id) => {
    return db.query(
      "SELECT * FROM companies WHERE id = $1",
      [id]
    );
  },

  findByName: (name) => {
    return db.query(
      "SELECT * FROM companies WHERE LOWER(name) = LOWER($1)",
      [name]
    );
  },

  create: ({ name, industry = null, website = null }) => {
    return db.query(
      `INSERT INTO companies (name, industry, website)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, industry, website]
    );
  },

  getSalaryStats: (id) => {
    return db.query(
      `
      SELECT
        MIN(base_salary + COALESCE(bonus, 0) + COALESCE(stock, 0)) AS min_salary,
        MAX(base_salary + COALESCE(bonus, 0) + COALESCE(stock, 0)) AS max_salary,
        AVG(base_salary + COALESCE(bonus, 0) + COALESCE(stock, 0)) AS avg_salary,
        COUNT(*) AS total_records
      FROM compensation_records
      WHERE company_id = $1
      `,
      [id]
    );
  },

  getHighestPayingRole: (id) => {
    return db.query(
      `
      SELECT
        r.id,
        r.title,
        MAX(cr.base_salary + COALESCE(cr.bonus, 0) + COALESCE(cr.stock, 0)) AS salary
      FROM compensation_records cr
      JOIN roles r ON cr.role_id = r.id
      WHERE cr.company_id = $1
      GROUP BY r.id, r.title
      ORDER BY salary DESC
      LIMIT 1
      `,
      [id]
    );
  },

  getLowestPayingRole: (id) => {
    return db.query(
      `
      SELECT
        r.id,
        r.title,
        MIN(cr.base_salary + COALESCE(cr.bonus, 0) + COALESCE(cr.stock, 0)) AS salary
      FROM compensation_records cr
      JOIN roles r ON cr.role_id = r.id
      WHERE cr.company_id = $1
      GROUP BY r.id, r.title
      ORDER BY salary ASC
      LIMIT 1
      `,
      [id]
    );
  }
};
