
module.exports = db => {
  return {

    create: (req, res) => {
      const { personId, carId } = req.body;
    
      db.models.Junction.create({ id_person: personId, id_car: carId })
        .then(() => {
          res.send({ success: true });
        })
        .catch(() => res.status(401));
    },


    associatePersonCar: (req, res) => {
      const { personId, carId } = req.body;
      console.log('Cererea a ajuns în controlerul pentru api/junction');
      db.models.Junction.create({ id_person: personId, id_car: carId })
        .then(() => {
          res.send({ success: true });
        })
        .catch(() => res.status(401));
    },

    findCarsByPerson: (req, res) => {
      const personId = req.params.personId;

      db.query(`
        SELECT "Car".*
        FROM "Car"
        INNER JOIN "Junction" ON "Car".id = "Junction".id_car
        WHERE "Junction".id_person = ${personId}
      `, { type: db.QueryTypes.SELECT })
        .then(resp => {
          res.send(resp);
        })
        .catch(() => res.status(401));
    },

    findPersonsByCar: (req, res) => {
      const carId = req.params.carId;

      db.query(`
        SELECT "Person".*
        FROM "Person"
        INNER JOIN "Junction" ON "Person".id = "Junction".id_person
        WHERE "Junction".id_car = ${carId}
      `, { type: db.QueryTypes.SELECT })
        .then(resp => {
          res.send(resp);
        })
        .catch(() => res.status(401));
    },

   removeAssociation: (req, res) => {
      const { personId, carId } = req.params;

      db.models.Junction.destroy({ where: { id_person: personId, id_car: carId } })
        .then(() => {
          res.send({ success: true });
        })
        .catch(() => res.status(401));
    },
  };
};
