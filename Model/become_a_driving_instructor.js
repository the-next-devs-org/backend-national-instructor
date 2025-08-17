module.exports = (sequelize, DataTypes) => {
  const BecomeADrivingInstructor = sequelize.define('BecomeADrivingInstructor', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
    },
    home_address: {
      type: DataTypes.STRING,
    },
    driving_license: {
      type: DataTypes.STRING, // file path
    },
    dvsa_adi_certificate: {
      type: DataTypes.STRING, // file path
    },
    training_qualification: {
      type: DataTypes.ENUM('dvsa training', 'first aid certification')
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved'),
        defaultValue: 'pending',
    },
    instructor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE, 
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'become_a_driving_instructor',
    timestamps: false
  });

  return BecomeADrivingInstructor;
};
