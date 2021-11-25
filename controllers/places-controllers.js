const uuid = require('uuid').v4;
const HttpError = require('../models/http-error');

const DUMMY_PLACES = [
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

exports.getPlaceById = (req, res, next) => {
  const { pid } = req.params; // { pid: 'p1' }
  const place = DUMMY_PLACES.find((p) => {
    return p.id === pid;
  });
  if (!place) {
    throw new HttpError('Could not find a place for the provided id.', 404);
  }
  res.json({ place }); // => { place } = { place: place }
};

exports.getPlaceByUserId = (req, res, next) => {
  const { uid } = req.params;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === uid;
  });
  if (!place) {
    return next(
      new HttpError('Could not find a place for the provided user id.', 404)
    );
  }
  res.json({ place });
};

exports.createdPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const { pid } = req.params;

  const updatedPlace = DUMMY_PLACES.find((p) => p.id === pid);
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === pid);
  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;

  res.status(200).json({ place: updatedPlace });
};

exports.deletePlace = (req, res, next) => {};
