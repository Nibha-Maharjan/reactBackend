const express = require('express');

const router = express.Router();

const Patient = require('../Models/patient.model');

router.get('/critical-patients', async (req, res, next) => {
  try {
    const criticalPatients = await Patient.aggregate([
      {
        $project: {
          name: 1,
          age: 1,
          address: 1,
          phone: 1,
          email: 1,
          description: 1,
          date: 1,
          records: {
            $slice: ['$records', -1], // will show only the newest entry in record array
          },
        },
      },
      {
        $match: {
          $or: [
            {
              'records.vitalSigns.bloodPressure': {
                $lt: '50/100',
                $gt: '100/150',
              },
            },
            {
              'records.vitalSigns.respiratoryRate': {
                $lt: 12,
                $gt: 25,
              },
            },
            {
              'records.vitalSigns.bloodOxygenLevel': {
                $lt: 90,
              },
            },
            {
              'records.vitalSigns.heartBeatRate': {
                $lt: 60,
                $gt: 100,
              },
            },
          ],
        },
      },
    ]);

    res.send(criticalPatients);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

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
    const { name, age, address, phone, email, description, date, records } =
      req.body;
    const patient = new Patient({
      name,
      age,
      address,
      phone,
      email,
      description,
      date,
      records,
    });
    const result = await patient.save();
    res.send(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Error creating patient');
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

router.get('/name/:name', async (req, res, next) => {
  const name = req.params.name;
  try {
    const patients = await Patient.find({ name: new RegExp(name, 'i') });
    if (!patients || patients.length === 0) {
      return res.status(404).send('No patients found with the specified name');
    }
    res.send(patients);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPatient) {
      return res.status(404).send('Patient not found');
    }
    res.send(updatedPatient);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
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

router.get('/:id/records', async (req, res, next) => {
  const id = req.params.id;
  try {
    const patient = await Patient.findById(id, { records: 1 });
    if (!patient) {
      return res.status(404).send('Patient not found');
    }
    res.send(patient.records);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/:id/records', async (req, res, next) => {
  const id = req.params.id;
  const newRecord = req.body;
  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).send('Patient not found');
    }
    patient.records.push(newRecord);
    await patient.save();
    res.send(patient.records);
  } catch (error) {
    console.log(error.message);
    res.status(400).send('Bad Request');
  }
});

router.patch('/:id/records/:recordId', async (req, res, next) => {
  const { id, recordId } = req.params;
  const updatedRecord = req.body;

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).send('Patient not found');
    }

    const recordIndex = patient.records.findIndex(
      (record) => record._id == recordId
    );
    if (recordIndex === -1) {
      return res.status(404).send('Record not found');
    }

    patient.records[recordIndex] = {
      ...patient.records[recordIndex],
      ...updatedRecord,
    };

    await patient.save();
    res.send(patient.records[recordIndex]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
