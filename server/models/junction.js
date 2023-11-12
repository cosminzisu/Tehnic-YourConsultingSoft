module.exports = (sequelize, DataType) => {
  let model = sequelize.define('Junction', {
    id_person: {
      type: DataType.INTEGER,
      primaryKey: true
    },
    id_car: {
      type: DataType.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
  model.belongsTo(sequelize.models.Person, {foreignKey: 'id_person', onDelete: 'CASCADE'});
  model.belongsTo(sequelize.models.Car, {foreignKey: 'id_car', onDelete: 'CASCADE'});

  return model;
};

  
