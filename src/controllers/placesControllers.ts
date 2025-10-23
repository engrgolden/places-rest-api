// controllers/placesController.ts
import { Request, Response, NextFunction } from "express";
import {
  getPlacesByUserId,
  getPlaceById,
  updatePlaceById,
  deletePlaceById,
  createPlace,
} from "../services/placesServices"; // Import service methods
import { handleError } from "../models/CustomErrors";
import { AuthRequest } from "../types/AuthRequest";
import { CustomError } from "../models/CustomErrors";
import { uploadR2 } from "../util/uploadR2";
import { pullR2 } from "../util/pullR2";

export const GetPlacesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const places = await getPlacesByUserId(userId);
    await pullR2(places);
    res.json({ places });
  } catch (err) {
    next(
      handleError(
        err,
        "Fetching user's places failed, please try again later.",
        500
      )
    );
  }
};

export const GetPlaceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const placeId = req.params.placeId;
    const place = await getPlaceById(placeId);

    res.json({ place });
    console.log(place);
  } catch (err) {
    next(
      handleError(err, "Fetching place failed, please try again later.", 500)
    );
  }
};

export const UpdatePlaceById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, address } = req.body;
    const placeId = req.params.placeId;

    if (req.userData) {
      const userId = req.userData.userId;
      const place = await updatePlaceById({
        placeId,
        userId,
        title,
        description,
        address,
      });

      res.status(201).json({ place });
    } else {
      throw new CustomError("Authorization error", 401);
    }
  } catch (err) {
    next(
      handleError(err, "Could not update place, please try again later.", 500)
    );
  }
};

export const DeletePlaceById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const placeId = req.params.placeId;
    if (req.userData) {
      const userId = req.userData.userId;
      const result = await deletePlaceById({ placeId, userId });
      res.status(200).json({ result });
    } else {
      throw new CustomError("Authorization error", 401);
    }
  } catch (err) {
    next(
      handleError(err, "Could not delete place, please try again later.", 500)
    );
  }
};

export const CreatePlace = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, address } = req.body;
    let fileName = "";
    if (req.file) {
      fileName = (await uploadR2(req.file)) || "";
    }
    if (req.userData) {
      const creatorId = req.userData.userId;
      const createdPlace = await createPlace({
        title,
        description,
        address,
        creatorId,
        fileName,
      });
      res.status(201).json({ place: createdPlace });
    } else {
      throw new CustomError("Authorization error", 401);
    }
  } catch (err) {
    next(
      handleError(err, "Could not create place, please try again later.", 500)
    );
  }
};
