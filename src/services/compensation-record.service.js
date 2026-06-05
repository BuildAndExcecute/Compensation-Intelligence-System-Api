import { CompensationRecord } from "@/db-access/compensation_records.db.js"
import { CompanyService, normalizeCompanyName } from "./company.service.js"
import { RoleService } from "./role.service.js"
import { LocationService } from "./location.service.js"
import { ApiError } from "@/utils/ApiError"

export const CompensationService = {
  async create(data) {
    const {
      company,
      role,
      city,
      country,
      base_salary,
      bonus = 0,
      stock = 0
    } = data

    const companyRecord =
      await CompanyService.findOrCreate({
        name: company
      })

    const roleRecord =
      await RoleService.findOrCreate(role)

    const locationRecord =
      await LocationService.findOrCreate({
        city,
        country
      })

    const duplicate =
      await CompensationRecord.findDuplicate({
        company_id: companyRecord.id,
        role_id: roleRecord.id,
        location_id: locationRecord.id,
        base_salary,
        bonus,
        stock
      })

    if (duplicate.rows.length > 0) {
      throw new ApiError(409, "Duplicate compensation record already exists")
    }

    const compensation =
      await CompensationRecord.create({
        company_id: companyRecord.id,
        role_id: roleRecord.id,
        location_id: locationRecord.id,
        base_salary,
        bonus,
        stock
      })

    return compensation.rows[0]
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
  },

  calculateTotalCompensation({
    base_salary,
    bonus = 0,
    stock = 0
  }) {
    return Number(base_salary) + Number(bonus || 0) + Number(stock || 0)
  }
}
