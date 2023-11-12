module.exports = (sequelize, DataType) => {
  let model = sequelize.define('Car', {
    marca: {
      type: DataType.TEXT
    },
    model: {
      type: DataType.TEXT
    },
    an: {
      type: DataType.TEXT
    },
    cc: {
      type: DataType.INTEGER
    },
    taxa: {
      type: DataType.TEXT
    }
  }, {
    timestamps: true
  });

  // model.belongsToMany(sequelize.models.Person, { through: 'Junction', foreignKey: 'id_car', onDelete: 'CASCADE' });

  return model;
};
