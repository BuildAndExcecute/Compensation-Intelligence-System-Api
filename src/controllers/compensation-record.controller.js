import { asyncHandler } from "@/utils/asyncHandler"
import { ApiResponse } from "@/utils/ApiResponse"
import { ApiError } from "@/utils/ApiError"
import { CompensationService } from "@/services/compensation-record.service"

const optionalString = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return undefined
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, `${fieldName} must be a non-empty string`)
  }

  return value.trim()
}

const optionalAmount = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return 0
  }

  const amount = Number(value)

  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < 0) {
    throw new ApiError(400, `${fieldName} must be a non-negative integer`)
  }

  return amount
}

const optionalPositiveId = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return undefined
  }

  const id = Number(value)

  if (!Number.isFinite(id) || !Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, `${fieldName} must be a positive integer`)
  }

  return id
}

const requireNameOrId = ({ id, name, fieldName }) => {
  if (id === undefined && name === undefined) {
    throw new ApiError(400, `${fieldName} name or ID is required`)
  }
}

const requireLocation = ({ location_id, city, country }) => {
  if (location_id === undefined && (city === undefined || country === undefined)) {
    throw new ApiError(400, "Location ID or city and country are required")
  }
}

const requiredPositiveAmount = (value, fieldName) => {
  const amount = Number(value)

  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount <= 0) {
    throw new ApiError(400, `${fieldName} must be a positive integer`)
  }

  return amount
}

const optionalFilterAmount = (value, fieldName) => {
  if (value === null || value === "") {
    return undefined
  }

  const amount = Number(value)

  if (!Number.isFinite(amount) || amount < 0) {
    throw new ApiError(400, `${fieldName} must be a non-negative number`)
  }

  return amount
}

const optionalFilterString = (value, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return undefined
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, `${fieldName} must be a non-empty string`)
  }

  return value.trim()
}

const requiredParam = async (context, paramName, fieldName) => {
  const params = await context.params
  const value = params?.[paramName]

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, `${fieldName} is required`)
  }

  return value.trim()
}

const getCompensationFilters = (searchParams) => {
  const filters = {
    company: optionalFilterString(searchParams.get("company"), "Company"),
    role: optionalFilterString(searchParams.get("role"), "Role"),
    city: optionalFilterString(searchParams.get("city"), "City"),
    country: optionalFilterString(searchParams.get("country"), "Country"),
    min_total: optionalFilterAmount(searchParams.get("min_total"), "Minimum total compensation"),
    max_total: optionalFilterAmount(searchParams.get("max_total"), "Maximum total compensation")
  }

  if (
    filters.min_total !== undefined &&
    filters.max_total !== undefined &&
    filters.min_total > filters.max_total
  ) {
    throw new ApiError(
      400,
      "Minimum total compensation cannot be greater than maximum total compensation"
    )
  }

  return filters
}

export const createCompensation =
  asyncHandler(async (request) => {
    const body = await request.json()

    const payload = {
      company_id: optionalPositiveId(body.company_id, "Company ID"),
      company: optionalString(body.company, "Company"),
      role_id: optionalPositiveId(body.role_id, "Role ID"),
      role: optionalString(body.role, "Role"),
      location_id: optionalPositiveId(body.location_id, "Location ID"),
      city: optionalString(body.city, "City"),
      country: optionalString(body.country, "Country"),
      base_salary: requiredPositiveAmount(body.base_salary, "Base salary"),
      bonus: optionalAmount(body.bonus, "Bonus"),
      stock: optionalAmount(body.stock, "Stock")
    }

    requireNameOrId({
      id: payload.company_id,
      name: payload.company,
      fieldName: "Company"
    })
    requireNameOrId({
      id: payload.role_id,
      name: payload.role,
      fieldName: "Role"
    })
    requireLocation(payload)

    const { record: compensation, created } =
      await CompensationService.create(payload)

    return ApiResponse.success(
      compensation,
      created
        ? "Compensation record created successfully"
        : "Compensation record updated successfully",
      created ? 201 : 200
    )
  })

export const getCompensations =
  asyncHandler(async (request) => {
    const { searchParams } = new URL(request.url)
    const filters = getCompensationFilters(searchParams)

    const compensations =
      await CompensationService.findMany(filters)

    return ApiResponse.success(
      compensations,
      "Compensation records fetched successfully"
    )
  })

export const getCompensationsByCompany =
  asyncHandler(async (request, context) => {
    const company = await requiredParam(context, "company", "Company")

    const compensations =
      await CompensationService.findMany({ company })

    return ApiResponse.success(
      compensations,
      "Company compensation records fetched successfully"
    )
  })

export const getCompensationsByRole =
  asyncHandler(async (request, context) => {
    const role = await requiredParam(context, "role", "Role")

    const compensations =
      await CompensationService.findMany({ role })

    return ApiResponse.success(
      compensations,
      "Role compensation records fetched successfully"
    )
  })
