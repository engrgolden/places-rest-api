import { Router } from "express";
import {
  GetPlacesByUserId,
  GetPlaceById,
  UpdatePlaceById,
  DeletePlaceById,
  CreatePlace,
} from "../controllers/placesControllers";
import {
  validateCreatePlace,
  validateUpdatePlace,
} from "../middlewares/placesInputValidationMiddleware";
import { multerUpload } from "../middlewares/multerMiddleware";
import { EndIfNotAuth } from "../middlewares/authenticationMiddleware";

const router = Router();

// Get places by user ID
router.get("/:userId/places", GetPlacesByUserId);

// Get a place by its ID
router.get("/:placeId", GetPlaceById);

router.use(EndIfNotAuth);

// Update a place by its ID
router.patch("/:placeId", validateUpdatePlace, UpdatePlaceById);

// Delete a place by its ID
router.delete("/:placeId", DeletePlaceById);

// Create a new place
router.post("/", multerUpload, validateCreatePlace, CreatePlace);

export default router;
