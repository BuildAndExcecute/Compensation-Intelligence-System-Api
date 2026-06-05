import { Location } from "@/db-access/locations.db.js"

export const LocationService = {
  async findAll() {
    const locations = await Location.findAll()
    return locations.rows
  },

  async findOrCreate({ city, country }) {
    const normalizedCity = city.trim()
    const normalizedCountry = country.trim()

    const existingLocation =
      await Location.findByCityAndCountry(normalizedCity, normalizedCountry)

    if (existingLocation.rows.length > 0) {
      return existingLocation.rows[0]
    }

    const newLocation = await Location.create({
      city: normalizedCity,
      country: normalizedCountry
    })

    return newLocation.rows[0]
  }
}
