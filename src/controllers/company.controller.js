import { asyncHandler } from "@/utils/asyncHandler"
import { ApiResponse } from "@/utils/ApiResponse"
import { ApiError } from "@/utils/ApiError"
import { CompanyService } from "@/services/company.service"

const optionalString = (value, fieldName) => {
  if (value === null || value === undefined || value === "") {
    return undefined
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, `${fieldName} must be a non-empty string`)
  }

  return value.trim()
}

export const createCompany = asyncHandler(
  async (request) => {
    const { name, industry, website } =
      await request.json()

    if (!name) {
      throw new ApiError(
        400,
        "Company name is required"
      )
    }

    const company =
      await CompanyService.findOrCreate({
        name,
        industry,
        website
      })

    return ApiResponse.success(
      company,
      "Company created successfully",
      201
    )
  }
)

export const getCompanies = asyncHandler(
  async (request) => {
    const { searchParams } = new URL(request.url)
    const name = optionalString(searchParams.get("name"), "Company name")

    const companies = await CompanyService.findMany({ name })

    return ApiResponse.success(
      companies,
      name
        ? "Company fetched successfully"
        : "Companies fetched successfully"
    )
  }
)

export const getCompanyDetails = asyncHandler(
  async (request, context) => {
    const params = await context.params
    const id = Number(params?.id)

    if (isNaN(id)) {
      return Response.json(
        { error: "Invalid company id" },
        { status: 400 }
      );
    }

    const company = await CompanyService.getCompanyOverview(id);

    return Response.json(company);
  }
);
