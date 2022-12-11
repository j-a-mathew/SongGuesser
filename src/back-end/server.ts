const express = require("express");
const cors = require("cors");
const db = require("./models/leaderboard_model.ts");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// moved here from leaderboard_models
(async () => {
    await db.sequelize.sync({alter: true});
    // const entry1 = Leaderboard.build({ firstName: 'Justin', lastName: 'Mathew'})
    // console.log(entry1.firstName);
    // await entry1.save();
    // const entry2 = await Leaderboard.create({ firstName: 'John', lastName: 'Doe'});
    // const entry2 = await db.Leaderboard.create({ firstName: 'Jane', lastName: 'Smith', favSong: "Watermelon Sugar", score: 3 });
    // const entries = await db.Leaderboard.findAll();
    // console.log(entries.every(entry => entry.firstName === 'Justin'));
    // console.log("All Entries:", JSON.stringify(entries, null, 2));
    // const johndoe = await db.Leaderboard.findByPk(3);
    // console.log(JSON.stringify(johndoe, null, 2));
})();

// simple route
app.get("/", (res: any) => {
    res.json({ message: "Welcome to the application." });
});

require("./routes/leaderboard_routes.ts")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

export {};