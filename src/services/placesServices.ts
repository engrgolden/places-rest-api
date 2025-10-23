// services/placesService.ts
import { getCoordinatesForAddress } from "../util/location";
import Place from "../models/place";
import User from "../models/user";
import mongoose from "mongoose";
import { CustomError } from "../models/CustomErrors";
import { deleteR2 } from "../util/deleteR2";

const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const getPlacesByUserId = async (userId: string) => {
  const places = await Place.find({ creatorId: userId });
  if (!places.length) {
    throw new CustomError("empty", 404);
  } else {
    return places.map((place) => place.toObject({ getters: true }));
  }
};

export const getPlaceById = async (placeId: string) => {
  const place = await Place.findById(placeId).select(
    "title description address"
  );

  if (!place) {
    throw new CustomError("Could not find a place for the provided id.", 404);
  } else {
    return place.toObject({ getters: true });
  }
};

interface updatePlaceByIdInput {
  userId: string;
  placeId: string;
  title: string;
  description: string;
  address: string;
}

export const updatePlaceById = async ({
  userId,
  placeId,
  title,
  description,
  address,
}: updatePlaceByIdInput) => {
  let place = await Place.findById(placeId);
  if (!place) {
    throw new CustomError("Could not find a place for the provided id.", 404);
  } else if (place.creatorId.toString() !== userId) {
    throw new CustomError("Authorization error.", 401);
  } else {
    let coordinates;
    coordinates = await getCoordinatesForAddress(address);
    place.coordinates = coordinates;
    place.title = title;
    place.description = description;
    place.address = address;
    place = await place.save();
    return place.toObject({ getters: true });
  }
};

interface deletePlaceByIdInputs {
  placeId: string;
  userId: string;
}

export const deletePlaceById = async ({
  placeId,
  userId,
}: deletePlaceByIdInputs) => {
  let place = await Place.findById(placeId).populate("creatorId");
  if (!place) {
    throw new CustomError("Could not find a place for the provided id.", 404);
  } else if (
    place.creatorId.toObject({ getters: true }).id.toString() !== userId
  ) {
    throw new CustomError("Authorization error.", 401);
  } else {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creatorId.places.pull(place);
    await place.creatorId.save({ session: sess });
    await sess.commitTransaction();
    sess.endSession();

    await deleteR2(place.fileName);
    return { message: "Place deleted successfully." };
  }
};

interface createPlaceInput {
  fileName: string;
  creatorId: string;
  title: string;
  description: string;
  address: string;
}

export const createPlace = async ({
  creatorId,
  fileName,
  title,
  description,
  address,
}: createPlaceInput) => {
  if (!isValidObjectId(creatorId)) {
    throw new CustomError("Invalid Id.", 500);
  }

  let coordinates;
  coordinates = await getCoordinatesForAddress(address);
  const createdPlace = new Place({
    title,
    description,
    address,
    coordinates,
    creatorId,
    fileName,
  });

  const user = await User.findById(creatorId);

  if (!user) {
    throw new CustomError("Could not find user for the provided id.", 500);
  } else {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });

    await sess.commitTransaction();

    return createdPlace.toObject({ getters: true });
  }
};
