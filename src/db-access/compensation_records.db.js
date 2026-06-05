import db from "@/lib/db.js"

const totalCompensationSql =
  "cr.base_salary + COALESCE(cr.bonus, 0) + COALESCE(cr.stock, 0)"

export const CompensationRecord = {
  create: ({
    company_id,
    role_id,
    location_id,
    base_salary,
    bonus = 0,
    stock = 0
  }) => {
    return db.query(
      `INSERT INTO compensation_records
       (company_id, role_id, location_id, base_salary, bonus, stock)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [company_id, role_id, location_id, base_salary, bonus, stock]
    )
  },

  findDuplicate: ({
    company_id,
    role_id,
    location_id,
    base_salary,
    bonus = 0,
    stock = 0
  }) => {
    return db.query(
      `SELECT id FROM compensation_records
       WHERE company_id = $1
         AND role_id = $2
         AND location_id = $3
         AND base_salary = $4
         AND COALESCE(bonus, 0) = $5
         AND COALESCE(stock, 0) = $6
       LIMIT 1`,
      [company_id, role_id, location_id, base_salary, bonus, stock]
    )
  },

  findMany: ({
    company,
    role,
    city,
    country,
    min_total,
    max_total
  } = {}) => {
    const conditions = []
    const values = []

    const addCondition = (sql, value) => {
      values.push(value)
      conditions.push(sql.replace("?", `$${values.length}`))
    }

    if (company) {
      addCondition("LOWER(c.name) = LOWER(?)", company.trim())
    }

    if (role) {
      addCondition("LOWER(r.title) = LOWER(?)", role.trim())
    }

    if (city) {
      addCondition("LOWER(l.city) = LOWER(?)", city.trim())
    }

    if (country) {
      addCondition("LOWER(l.country) = LOWER(?)", country.trim())
    }

    if (min_total !== null && min_total !== undefined && min_total !== "") {
      addCondition(`${totalCompensationSql} >= ?`, min_total)
    }

    if (max_total !== null && max_total !== undefined && max_total !== "") {
      addCondition(`${totalCompensationSql} <= ?`, max_total)
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

    return db.query(
      `SELECT
         cr.id,
         c.id AS company_id,
         c.name AS company,
         r.id AS role_id,
         r.title AS role,
         l.id AS location_id,
         l.city,
         l.country,
         cr.base_salary,
         COALESCE(cr.bonus, 0) AS bonus,
         COALESCE(cr.stock, 0) AS stock,
         ${totalCompensationSql} AS total_compensation,
         cr.created_at
       FROM compensation_records cr
       JOIN companies c ON cr.company_id = c.id
       JOIN roles r ON cr.role_id = r.id
       JOIN locations l ON cr.location_id = l.id
       ${whereClause}
       ORDER BY cr.created_at DESC`,
      values
    )
  },

  findByCompany: (company_id) => {
    return db.query(
      `SELECT * FROM compensation_records
       WHERE company_id = $1
       ORDER BY created_at DESC`,
      [company_id]
    )
  },

  findByRole: (role_id) => {
    return db.query(
      `SELECT * FROM compensation_records
       WHERE role_id = $1
       ORDER BY created_at DESC`,
      [role_id]
    )
  },

  findByLocation: (location_id) => {
    return db.query(
      `SELECT * FROM compensation_records
       WHERE location_id = $1
       ORDER BY created_at DESC`,
      [location_id]
    )
  }
}
