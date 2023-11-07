const express = require('express');

const router = express.Router();

const Patient = require('../Models/patient.model');

router.get('/', async (req, res, next) => {
  try {
    const results = await Patient.find({}, { __v: 0 });
    res.send(results);
  } catch (error) {
    console.log(error.message);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const patient = new Patient(req.body);
    const result = await patient.save();
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const patient = await Patient.findById(id);
    res.send(patient);
  } catch (error) {
    console.log(error.message);
  }
});

router.patch('/:id', (req, res, next) => {
  res.send('patch Created');
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Patient.findByIdAndDelete(id);
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
