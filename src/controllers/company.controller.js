import { asyncHandler } from "@/utils/asyncHandler"
import { ApiResponse } from "@/utils/ApiResponse"
import { ApiError } from "@/utils/ApiError"
import { CompanyService } from "@/services/company.service"

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
