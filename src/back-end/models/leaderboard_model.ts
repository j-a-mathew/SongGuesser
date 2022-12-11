const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize('postgres://szvjeinm:LBZU2yGB6zWfYUAI8V33xXiE-Jpu_Q9M@rajje.db.elephantsql.com/szvjeinm')

const tryConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

tryConnect();

const Leaderboard = sequelize.define('Leaderboard', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
     },
    favSong: {
        type: DataTypes.STRING,
    },
    score: {
        type: DataTypes.INTEGER,
    }
}, {
    freezeTableName: true
});

export const database = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Leaderboard: Leaderboard
};

// module.exports = database;

// export {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.leaderboards = require("./")