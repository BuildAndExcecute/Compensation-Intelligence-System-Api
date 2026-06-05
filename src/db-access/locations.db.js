import db from "@/lib/db.js"

export const Location = {
  findAll: () => {
    return db.query(
      "SELECT * FROM locations ORDER BY country ASC, city ASC"
    )
  },

  findById: (id) => {
    return db.query(
      "SELECT * FROM locations WHERE id = $1",
      [id]
    )
  },

  findByCity: (city) => {
    return db.query(
      "SELECT * FROM locations WHERE LOWER(city) = LOWER($1)",
      [city]
    )
  },

  findByCityAndCountry: (city, country) => {
    return db.query(
      `SELECT * FROM locations
       WHERE LOWER(city) = LOWER($1)
         AND LOWER(country) = LOWER($2)`,
      [city, country]
    )
  },

  create: ({ city, country }) => {
    return db.query(
      `INSERT INTO locations (city, country)
       VALUES ($1, $2)
       RETURNING *`,
      [city, country]
    )
  }
}
