import { asyncHandler } from "@/utils/asyncHandler"
import { ApiResponse } from "@/utils/ApiResponse"
import { ApiError } from "@/utils/ApiError"
import { CompensationService } from "@/services/compensation-record.service"

const requiredString = (value, fieldName) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, `${fieldName} is required`)
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

export const createCompensation =
  asyncHandler(async (request) => {
    const body = await request.json()

    const payload = {
      company: requiredString(body.company, "Company"),
      role: requiredString(body.role, "Role"),
      city: requiredString(body.city, "City"),
      country: requiredString(body.country, "Country"),
      base_salary: requiredPositiveAmount(body.base_salary, "Base salary"),
      bonus: optionalAmount(body.bonus, "Bonus"),
      stock: optionalAmount(body.stock, "Stock")
    }

    const compensation =
      await CompensationService.create(payload)

    return ApiResponse.success(
      compensation,
      "Compensation record created successfully",
      201
    )
  })

export const getCompensations =
  asyncHandler(async (request) => {
    const { searchParams } = new URL(request.url)

    const filters = {
      company: searchParams.get("company"),
      role: searchParams.get("role"),
      city: searchParams.get("city"),
      country: searchParams.get("country"),
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

    const compensations =
      await CompensationService.findMany(filters)

    return ApiResponse.success(
      compensations,
      "Compensation records fetched successfully"
    )
  })
