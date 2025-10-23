import mongoose, { Schema, InferSchemaType, model, Document } from "mongoose";

// Define user schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);
        },
        message: "Invalid email format",
      },
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    fileName: {
      type: String,
      required: [true, "Image URL is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    places: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Place",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add post-save middleware to handle duplicate key errors
userSchema.post("save", function (error: any, doc: any, next: any) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("A user with this email already exists."));
  } else {
    next(error);
  }
});

// Infer TypeScript type from schema
export type IUser = InferSchemaType<typeof userSchema> & Document;

// Create and export User model
const User = model<IUser>("User", userSchema);

export default User;
