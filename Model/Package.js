module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define("Package", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        hours: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        price_per_hour: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lessons: {
            type: DataTypes.STRING,
            allowNull: true
        },
        test: {
            type: DataTypes.STRING,
            allowNull: true
        },
        features: {
            type: DataTypes.JSON, // store array as JSON
            allowNull: true
        },
        course: {
            type: DataTypes.STRING,
            allowNull: true
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
        tableName: 'Packages',
        timestamps: false,
    });
    
    return Package;
};