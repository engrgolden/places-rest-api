"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlace = exports.DeletePlaceById = exports.UpdatePlaceById = exports.GetPlaceById = exports.GetPlacesByUserId = void 0;
const placesServices_1 = require("../services/placesServices"); // Import service methods
const CustomErrors_1 = require("../models/CustomErrors");
const CustomErrors_2 = require("../models/CustomErrors");
const uploadR2_1 = require("../util/uploadR2");
const pullR2_1 = require("../util/pullR2");
const GetPlacesByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const places = yield (0, placesServices_1.getPlacesByUserId)(userId);
        yield (0, pullR2_1.pullR2)(places);
        res.json({ places });
    }
    catch (err) {
        next((0, CustomErrors_1.handleError)(err, "Fetching user's places failed, please try again later.", 500));
    }
});
exports.GetPlacesByUserId = GetPlacesByUserId;
const GetPlaceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const placeId = req.params.placeId;
        const place = yield (0, placesServices_1.getPlaceById)(placeId);
        res.json({ place });
        console.log(place);
    }
    catch (err) {
        next((0, CustomErrors_1.handleError)(err, "Fetching place failed, please try again later.", 500));
    }
});
exports.GetPlaceById = GetPlaceById;
const UpdatePlaceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, address } = req.body;
        const placeId = req.params.placeId;
        if (req.userData) {
            const userId = req.userData.userId;
            const place = yield (0, placesServices_1.updatePlaceById)({
                placeId,
                userId,
                title,
                description,
                address,
            });
            res.status(201).json({ place });
        }
        else {
            throw new CustomErrors_2.CustomError("Authorization error", 401);
        }
    }
    catch (err) {
        next((0, CustomErrors_1.handleError)(err, "Could not update place, please try again later.", 500));
    }
});
exports.UpdatePlaceById = UpdatePlaceById;
const DeletePlaceById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const placeId = req.params.placeId;
        if (req.userData) {
            const userId = req.userData.userId;
            const result = yield (0, placesServices_1.deletePlaceById)({ placeId, userId });
            res.status(200).json({ result });
        }
        else {
            throw new CustomErrors_2.CustomError("Authorization error", 401);
        }
    }
    catch (err) {
        next((0, CustomErrors_1.handleError)(err, "Could not delete place, please try again later.", 500));
    }
});
exports.DeletePlaceById = DeletePlaceById;
const CreatePlace = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, address } = req.body;
        let fileName = "";
        if (req.file) {
            fileName = (yield (0, uploadR2_1.uploadR2)(req.file)) || "";
        }
        if (req.userData) {
            const creatorId = req.userData.userId;
            const createdPlace = yield (0, placesServices_1.createPlace)({
                title,
                description,
                address,
                creatorId,
                fileName,
            });
            res.status(201).json({ place: createdPlace });
        }
        else {
            throw new CustomErrors_2.CustomError("Authorization error", 401);
        }
    }
    catch (err) {
        next((0, CustomErrors_1.handleError)(err, "Could not create place, please try again later.", 500));
    }
});
exports.CreatePlace = CreatePlace;
