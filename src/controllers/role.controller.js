import { asyncHandler } from "@/utils/asyncHandler"
import { ApiResponse } from "@/utils/ApiResponse"
import { ApiError } from "@/utils/ApiError"
import { RoleService } from "@/services/role.service"

export const createRole = asyncHandler(
  async (request) => {
    const { title } =
      await request.json()

    if (!title) {
      throw new ApiError(
        400,
        "Role title is required"
      )
    }

    const role =
      await RoleService.findOrCreate(title)

    return ApiResponse.success(
      role,
      "Role created successfully",
      201
    )
  }
)

export const getRoles = asyncHandler(
  async () => {
    const roles = await RoleService.findAll()

    return ApiResponse.success(
      roles,
      "Roles fetched successfully"
    )
  }
)
