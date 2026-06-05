import db from "@/lib/db.js"

export const Role = {
  findAll: () => {
    return db.query(
      "SELECT * FROM roles ORDER BY title ASC"
    )
  },

  findById: (id) => {
    return db.query(
      "SELECT * FROM roles WHERE id = $1",
      [id]
    )
  },

  findByTitle: (title) => {
    return db.query(
      "SELECT * FROM roles WHERE LOWER(title) = LOWER($1)",
      [title]
    )
  },

  create: ({ title }) => {
    return db.query(
      `INSERT INTO roles (title)
       VALUES ($1)
       RETURNING *`,
      [title]
    )
  }
}
