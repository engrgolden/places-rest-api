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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlace = exports.deletePlaceById = exports.updatePlaceById = exports.getPlaceById = exports.getPlacesByUserId = void 0;
// services/placesService.ts
const location_1 = require("../util/location");
const place_1 = __importDefault(require("../models/place"));
const user_1 = __importDefault(require("../models/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const CustomErrors_1 = require("../models/CustomErrors");
const deleteR2_1 = require("../util/deleteR2");
const isValidObjectId = (id) => {
    return mongoose_1.default.Types.ObjectId.isValid(id);
};
const getPlacesByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const places = yield place_1.default.find({ creatorId: userId });
    if (!places.length) {
        throw new CustomErrors_1.CustomError("empty", 404);
    }
    else {
        return places.map((place) => place.toObject({ getters: true }));
    }
});
exports.getPlacesByUserId = getPlacesByUserId;
const getPlaceById = (placeId) => __awaiter(void 0, void 0, void 0, function* () {
    const place = yield place_1.default.findById(placeId).select("title description address");
    if (!place) {
        throw new CustomErrors_1.CustomError("Could not find a place for the provided id.", 404);
    }
    else {
        return place.toObject({ getters: true });
    }
});
exports.getPlaceById = getPlaceById;
const updatePlaceById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, placeId, title, description, address, }) {
    let place = yield place_1.default.findById(placeId);
    if (!place) {
        throw new CustomErrors_1.CustomError("Could not find a place for the provided id.", 404);
    }
    else if (place.creatorId.toString() !== userId) {
        throw new CustomErrors_1.CustomError("Authorization error.", 401);
    }
    else {
        let coordinates;
        coordinates = yield (0, location_1.getCoordinatesForAddress)(address);
        place.coordinates = coordinates;
        place.title = title;
        place.description = description;
        place.address = address;
        place = yield place.save();
        return place.toObject({ getters: true });
    }
});
exports.updatePlaceById = updatePlaceById;
const deletePlaceById = (_a) => __awaiter(void 0, [_a], void 0, function* ({ placeId, userId, }) {
    let place = yield place_1.default.findById(placeId).populate("creatorId");
    if (!place) {
        throw new CustomErrors_1.CustomError("Could not find a place for the provided id.", 404);
    }
    else if (place.creatorId.toObject({ getters: true }).id.toString() !== userId) {
        throw new CustomErrors_1.CustomError("Authorization error.", 401);
    }
    else {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield place.deleteOne({ session: sess });
        place.creatorId.places.pull(place);
        yield place.creatorId.save({ session: sess });
        yield sess.commitTransaction();
        sess.endSession();
        yield (0, deleteR2_1.deleteR2)(place.fileName);
        return { message: "Place deleted successfully." };
    }
});
exports.deletePlaceById = deletePlaceById;
const createPlace = (_a) => __awaiter(void 0, [_a], void 0, function* ({ creatorId, fileName, title, description, address, }) {
    if (!isValidObjectId(creatorId)) {
        throw new CustomErrors_1.CustomError("Invalid Id.", 500);
    }
    let coordinates;
    coordinates = yield (0, location_1.getCoordinatesForAddress)(address);
    const createdPlace = new place_1.default({
        title,
        description,
        address,
        coordinates,
        creatorId,
        fileName,
    });
    const user = yield user_1.default.findById(creatorId);
    if (!user) {
        throw new CustomErrors_1.CustomError("Could not find user for the provided id.", 500);
    }
    else {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        yield user.save({ session: sess });
        yield sess.commitTransaction();
        return createdPlace.toObject({ getters: true });
    }
});
exports.createPlace = createPlace;
