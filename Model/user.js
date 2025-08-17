module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { 
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM('admin','learner','instructor','student'),
      defaultValue: 'learner',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    i_want_to_be: {
      type: DataTypes.STRING,
    },
    // experience: {
    //   type: DataTypes.ENUM('complete_beginner', 'some_experience', 'test_ready'),
    // },
    experience: {
      type: DataTypes.STRING,
    },
    postcode: {
      type: DataTypes.STRING,
    },
    prefered_transmission: {
      type: DataTypes.ENUM('manual', 'automatic'),
    },
    prefered_days: {
      type: DataTypes.TEXT('long'),
    },
    prefered_time: {
      type: DataTypes.TEXT('long'),
    },
    note: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
    },
    package_id: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now'),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now'),
    },
  }, {
    tableName: 'users',
    timestamps: false,
  });

  return User;
};
