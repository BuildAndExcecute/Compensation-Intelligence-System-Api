import db from "@/lib/db.js"

export async function GET() {
  try {
    const result = await db.query("SELECT NOW()")
    return Response.json({
      success: true,
      time: result.rows[0],
    })
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}