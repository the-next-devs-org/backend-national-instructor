const dbConfig = require('../dbconfig/database.js');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD || '', {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    //  logging:false,
    // operatorsAliases: false,
    timezone: '+05:00', //Set timeZone for PKT
});
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require('./user.js')(sequelize, DataTypes);
db.Package = require('./Package.js')(sequelize, DataTypes);
db.BookCourse = require('./BookCourse.js')(sequelize, DataTypes);
db.BecomeADrivingInstructor = require('./become_a_driving_instructor.js')(sequelize, DataTypes);


// relationship code

// User ↔ Package
db.user.belongsTo(db.Package, { foreignKey: 'package_id', as: 'package' });
db.Package.hasMany(db.user, { foreignKey: 'package_id', as: 'users' });

// BookCourse ↔ Instructor (User)
db.BookCourse.belongsTo(db.user, { foreignKey: 'instructor_id', as: 'instructor' });
db.user.hasMany(db.BookCourse, { foreignKey: 'instructor_id', as: 'bookings' });

// BookCourse ↔ Package
db.BookCourse.belongsTo(db.Package, { foreignKey: 'package_id', as: 'package' });
db.Package.hasMany(db.BookCourse, { foreignKey: 'package_id', as: 'bookings' });

db.BecomeADrivingInstructor.belongsTo(db.user, { foreignKey: 'instructor_id', as: 'instructor' });
db.user.hasMany(db.BecomeADrivingInstructor, { foreignKey: 'instructor_id', as: 'become_a_driving_instructor' });

// end relationship code


// db.chatSystem = chatSystem;
db.sequelize.sync({ force: false })
    .then(() => {
        console.log("Sequelize synchronized with database.");
    })
    .catch(err => {
        console.error("Error syncing Sequelize with database:", err);
    });

// db.sequelize.sync({ alter: true })
// .then(() => {
//     console.log("Sequelize synchronized with AWS database.");
// })
// .catch(err => {
//     console.error("Error syncing Sequelize with AWS database:", err);
// });


module.exports = db;