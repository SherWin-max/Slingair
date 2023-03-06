const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const { flights, reservations } = require("./data.js");
flightsarray = Object.entries(flights);
const flightKeys = Object.keys(flights);
const seats = Object.values(flights);
const allFlights = [];
const allReservations = [];

flightKeys.forEach((flight, index) => {
    allFlights.push({
        _id: flight,
        flight: flight,
        seats: seats[index],
    });
});

reservations.forEach((item) => {
    allReservations.push({
        _id: item.id,
        flight: item.flight,
        seat: item.seat,
        givenName: item.givenName,
        surname: item.surname,
        email: item.email
    });
}); console.log(allFlights, allReservations)
const batchImport = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect()
    console.log("connect")
    try {
        const db = client.db("slingAir")
        const flights = await db.collection("flights").insertMany(allFlights)
        const reservation = await db.collection("reservations").insertMany(allReservations)
        console.log(flights, reservation)
    } catch (error) {

    }
    client.close();
    console.log("disconnect")
}

batchImport();