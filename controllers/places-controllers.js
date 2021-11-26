const uuid = require('uuid').v4;
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    imageUrl: 'https://static.toiimg.com/photo/71579199.cms',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    creator: 'u1',
  },
];

exports.getPlaceById = async (req, res, next) => {
  const { pid } = req.params; // { pid: 'p1' }
  let place;
  try {
    place = await Place.findById(pid);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not find a place.',
      500
    );
  }
  if (!place) {
    const error = new HttpError(
      'Could not find a place for the provided id.',
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) }); // => { place } = { place: place }
};

exports.getPlacesByUserId = async (req, res, next) => {
  const { uid } = req.params;
  let places;
  try {
    places = await Place.find({ creator: uid });
  } catch (err) {
    const error = new HttpError(
      'Fethcing places failed, please try again later.',
      500
    );
    return next(error);
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://static.toiimg.com/photo/71579199.cms',
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(
      'Creating place failed, please try again.',
      500
    );
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
  const { title, description } = req.body;
  const { pid } = req.params;

  const updatedPlace = DUMMY_PLACES.find((p) => p.id === pid);
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === pid);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

exports.deletePlace = (req, res, next) => {
  const { pid } = req.params;
  if (!DUMMY_PLACES.find((p) => p.id === pid)) {
    throw new HttpError('Could not find a place for that id.', 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== pid);
  res.status(200).json({ message: 'Place Deleted.' });
};
