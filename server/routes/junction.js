module.exports = app => {
  'use strict';
  const express = require('express');
  const junctionCtrl = require('../controllers/junctionCtrl')(app.locals.db);
  const router = express.Router();

  router.post('/associate', (req, res) => {
    console.log('API /junction/associate a fost atins.');
    junctionCtrl.associatePersonCar(req, res);
  });

  router.get('/cars/:personId', junctionCtrl.findCarsByPerson);
  router.get('/persons/:carId', junctionCtrl.findPersonsByCar);

  router.delete('/:personId/:carId', (req, res) => {
    console.log('API /junction/:personId/:carId a fost atins.');
    junctionCtrl.removeAssociation(req, res);
  });

  return router;
};
