import { asyncHandler } from "@/utils/asyncHandler"
import { ApiResponse } from "@/utils/ApiResponse"
import { ApiError } from "@/utils/ApiError"
import { LocationService } from "@/services/location.service"

export const createLocation = asyncHandler(
  async (request) => {
    const { city, country } =
      await request.json()

    if (!city || !country) {
      throw new ApiError(
        400,
        "City and country are required"
      )
    }

    const location =
      await LocationService.findOrCreate({
        city,
        country
      })

    return ApiResponse.success(
      location,
      "Location created successfully",
      201
    )
  }
)

export const getLocations = asyncHandler(
  async () => {
    const locations = await LocationService.findAll()

    return ApiResponse.success(
      locations,
      "Locations fetched successfully"
    )
  }
)
