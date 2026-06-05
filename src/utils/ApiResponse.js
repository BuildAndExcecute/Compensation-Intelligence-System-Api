class ApiResponse {
  static success(data = null, message = "Success", statusCode = 200) {
    return Response.json(
      {
        success: true,
        message,
        data
      },
      {
        status: statusCode
      }
    )
  }

  static error(message = "Something went wrong", statusCode = 500) {
    return Response.json(
      {
        success: false,
        message,
        data: null
      },
      {
        status: statusCode
      }
    )
  }
}

export { ApiResponse }