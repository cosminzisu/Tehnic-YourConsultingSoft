module.exports = (sequelize, DataType) => {
  let model = sequelize.define('Person', {
    nume: {
      type: DataType.TEXT
    },
    prenume: {
      type: DataType.TEXT
    },
    cnp: {
      type: DataType.TEXT
    },
    varsta: {
      type: DataType.INTEGER
    },
    masini: {

      type: DataType.ARRAY(DataType.TEXT),
      defaultValue: []
    }
  }, {
    timestamps: true
  
  });

  
  return model;
};
