import {
  createRole,
  getRoles
} from "@/controllers/role.controller"

export const dynamic = "force-dynamic"

export const POST = createRole

export const GET = getRoles
