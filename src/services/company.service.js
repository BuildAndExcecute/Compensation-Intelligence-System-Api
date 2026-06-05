import { Company } from "@/db-access/companies.db.js";
import { ApiError } from "@/utils/ApiError";

export const normalizeCompanyName = (name) => {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,]/g, "")
    .replace(/\b(inc|llc|ltd|limited|corp|corporation|pvt|private)\b$/i, "")
    .trim();
};

export const CompanyService = {
  async findOrCreate({ name, industry, website }) {
    const normalizedName = normalizeCompanyName(name);

    const existingCompany = await Company.findByName(normalizedName);

    if (existingCompany.rows.length > 0) {
      return existingCompany.rows[0];
    }

    const newCompany = await Company.create({
      name: normalizedName,
      industry,
      website
    });

    return newCompany.rows[0];
  },

  async getCompanyOverview(companyId) {
    const companyResult = await Company.findById(companyId);

    if (companyResult.rows.length === 0) {
      throw new ApiError(404, "Company not found");
    }

    const [stats, highestRole, lowestRole] = await Promise.all([
      Company.getSalaryStats(companyId),
      Company.getHighestPayingRole(companyId),
      Company.getLowestPayingRole(companyId)
    ]);

    return {
      ...companyResult.rows[0],
      stats: stats.rows[0],
      highestPayingRole: highestRole.rows[0],
      lowestPayingRole: lowestRole.rows[0]
    };
  }
};
