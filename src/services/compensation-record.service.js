import { CompensationRecord } from "@/db-access/compensation_records.db.js"
import { CompanyService, normalizeCompanyName } from "./company.service.js"
import { RoleService } from "./role.service.js"
import { LocationService } from "./location.service.js"
import { ApiError } from "@/utils/ApiError"

export const CompensationService = {
  async create(data) {
    const {
      company_id,
      company,
      role_id,
      role,
      location_id,
      city,
      country,
      base_salary,
      bonus = 0,
      stock = 0
    } = data

    const resolvedCompanyId =
      company_id ?? (await CompanyService.findOrCreate({ name: company })).id
    const resolvedRoleId =
      role_id ?? (await RoleService.findOrCreate(role)).id
    const resolvedLocationId =
      location_id ?? (await LocationService.findOrCreate({ city, country })).id

    const duplicate =
      await CompensationRecord.findDuplicate({
        company_id: resolvedCompanyId,
        role_id: resolvedRoleId,
        location_id: resolvedLocationId,
        base_salary,
        bonus,
        stock
      })

    if (duplicate.rows.length > 0) {
      throw new ApiError(409, "Duplicate compensation record already exists")
    }

    try {
      const compensation = await CompensationRecord.create({
        company_id: resolvedCompanyId,
        role_id: resolvedRoleId,
        location_id: resolvedLocationId,
        base_salary,
        bonus,
        stock
      })

      return compensation.rows[0]
    } catch (error) {
      if (error.code === "23503") {
        throw new ApiError(
          400,
          "Company ID, role ID, or location ID does not exist"
        )
      }

      throw error
    }
  },

  async findMany(filters) {
    const normalizedFilters = {
      ...filters,
      company: filters.company
        ? normalizeCompanyName(filters.company)
        : filters.company,
      role: filters.role?.trim(),
      city: filters.city?.trim(),
      country: filters.country?.trim()
    }

    const result = await CompensationRecord.findMany(normalizedFilters)
    return result.rows
  }
}
