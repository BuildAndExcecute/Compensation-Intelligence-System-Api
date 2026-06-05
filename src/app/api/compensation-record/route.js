import {
  createCompensation,
  getCompensations
} from "@/controllers/compensation-record.controller"

export const dynamic = "force-dynamic"

export const POST = createCompensation

export const GET = getCompensations
