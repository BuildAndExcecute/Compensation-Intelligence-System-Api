export const asyncHandler = (handler) => {
  return async (request, context) => {
    try {
      return await handler(request, context)
    } catch (error) {
      return Response.json(
        {
          success: false,
          message: error.message || "Internal Server Error"
        },
        {
          status: error.statusCode || 500
        }
      )
    }
  }
}