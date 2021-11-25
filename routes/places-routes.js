const express = require('express');

const router = express.Router();

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

router.get('/:pid', (req, res, next) => {
  const { pid } = req.params; // { pid: 'p1' }
  const place = DUMMY_PLACES.find((p) => {
    return p.id === pid;
  });
  res.json({ place }); // => { place } = { place: place }
});

module.exports = router;
