const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Patient API', () => {
  let createdPatientId;

  // Test case for creating a new patient
  it('should create a new patient', (done) => {
    try {
      chai
        .request(app)
        .post('/patient')
        .send({
          name: 'aaaAhbin Maharjann',
          age: 22,
          address: '54 Keafield Dr',
          phone: '123123123',
          email: 'nibha@live.com',
          description: 'FAT',
          date: '2023-11-09',
          records: [
            {
              dateTime: '2023-11-09T10:00:00Z',
              vitalSigns: {
                bloodPressure: '120/80',
                respiratoryRate: 20,
                bloodOxygenLevel: 100,
                heartBeatRate: 76,
              },
            },
          ],
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id');
          createdPatientId = res.body._id;
          done();
        });
    } catch (error) {
      done();
    }
  });

  // Test case for getting all patients
  it('should get all patients', (done) => {
    try {
      chai
        .request(app)
        .get('/patient')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    } catch (error) {
      done();
    }
  });

  // Test case for getting a single patient by ID
  it('should get a single patient by ID', (done) => {
    try {
      chai
        .request(app)
        .get(`/patient/${createdPatientId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body._id).to.equal(createdPatientId);
          done();
        });
    } catch (error) {
      done();
    }
  });

  // Test case for updating a patient by ID
  it('should update a patient by ID', (done) => {
    try {
      chai
        .request(app)
        .put(`/patient/${createdPatientId}`)
        .send({
          name: 'Updated Name',
          age: 46,
          address: '456 New St',
          phone: '555-5678',
          email: 'updated.email@example.com',
          description: 'Updated description',
          date: '2023-11-11',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    } catch (error) {
      done();
    }
  });

  // Test case for deleting a patient by ID
  it('should delete a patient by ID', (done) => {
    try {
      chai
        .request(app)
        .delete(`/patient/${createdPatientId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    } catch (error) {
      done();
    }
  });

  it("should add a new record to a patient's records", (done) => {
    try {
      chai
        .request(app)
        .post(`/patient/${createdPatientId}/records`)
        .send({
          dateTime: '2023-11-21T14:15:00Z',
          vitalSigns: {
            bloodPressure: '140/90',
            respiratoryRate: 20,
            bloodOxygenLevel: 95,
            heartBeatRate: 82,
          },
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    } catch (error) {
      done();
    }
  });

  it('should retrieve records of a patient', (done) => {
    try {
      chai
        .request(app)
        .get(`/patient/${createdPatientId}/records`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    } catch (error) {
      done();
    }
  });
});
