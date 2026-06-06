import {
  createCompany,
  getCompanies
} from "@/controllers/company.controller"

export const dynamic = "force-dynamic"

export const POST = createCompany
export const GET = getCompanies
