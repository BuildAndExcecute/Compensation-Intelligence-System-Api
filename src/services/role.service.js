import { Role } from "@/db-access/roles.db.js"

export const RoleService = {
  async findAll() {
    const roles = await Role.findAll()
    return roles.rows
  },

  async findOrCreate(title) {
    const normalizedTitle = title.trim()

    const existingRole = await Role.findByTitle(normalizedTitle)

    if (existingRole.rows.length > 0) {
      return existingRole.rows[0]
    }

    const newRole = await Role.create({
      title: normalizedTitle
    })

    return newRole.rows[0]
  }
}
