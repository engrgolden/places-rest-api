import axios from "axios";
import dotenv from "dotenv";
import { CustomError } from "../models/CustomErrors";
import { ICoordinates } from "../types/coordinates";

dotenv.config();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export const getCoordinatesForAddress = async (
  address: string
): Promise<ICoordinates> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_API_KEY}`;

    const res = await axios.get(url);
    const data = res.data;

    if (!data || data.status === "ZERO_RESULTS") {
      throw new CustomError(
        "Could not find location for the specified address",
        422
      );
    }
    const coordinates: ICoordinates = data.results[0].geometry.location;
    return coordinates;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new CustomError(
        "Failed to communicate with the Google Maps API.",
        500
      );
    } else {
      throw new CustomError("Failed to get coordinates for the address.", 500);
    }
    throw error;
  }
};
