import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";
import { ICoordinates } from "../types/coordinates";

// Place document interface extending from Mongoose's Document
interface IPlace extends Document {
  title: string;
  description: string;
  fileName: string;
  address: string;
  coordinates: ICoordinates;
  creatorId: IUser; // Populate this field with the full User object
}

// Define the schema for Place
const placeSchema = new Schema<IPlace>({
  title: {
    type: String,
    required: true,
    trim: true, // Automatically trims spaces from the title
  },
  description: {
    type: String,
    required: true,
    minlength: 5, // Enforces minimum length for description
  },
  fileName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true, // Automatically trims spaces from the address
  },
  coordinates: {
    lat: {
      type: Number,
      required: true,
      min: -90, // Latitude should be between -90 and 90
      max: 90,
    },
    lng: {
      type: Number,
      required: true,
      min: -180, // Longitude should be between -180 and 180
      max: 180,
    },
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
});

// Export the model
export default mongoose.model<IPlace>("Place", placeSchema);
