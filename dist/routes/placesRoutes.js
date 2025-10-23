"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const placesControllers_1 = require("../controllers/placesControllers");
const placesInputValidationMiddleware_1 = require("../middlewares/placesInputValidationMiddleware");
const multerMiddleware_1 = require("../middlewares/multerMiddleware");
const authenticationMiddleware_1 = require("../middlewares/authenticationMiddleware");
const router = (0, express_1.Router)();
// Get places by user ID
router.get("/:userId/places", placesControllers_1.GetPlacesByUserId);
// Get a place by its ID
router.get("/:placeId", placesControllers_1.GetPlaceById);
router.use(authenticationMiddleware_1.EndIfNotAuth);
// Update a place by its ID
router.patch("/:placeId", placesInputValidationMiddleware_1.validateUpdatePlace, placesControllers_1.UpdatePlaceById);
// Delete a place by its ID
router.delete("/:placeId", placesControllers_1.DeletePlaceById);
// Create a new place
router.post("/", multerMiddleware_1.multerUpload, placesInputValidationMiddleware_1.validateCreatePlace, placesControllers_1.CreatePlace);
exports.default = router;
