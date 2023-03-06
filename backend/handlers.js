"use strict";

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");
const { MongoClient } = require("mongodb");
require("dotenv").config();          //lightweight npm package that automatically loads environment variables.
const { MONGO_URI } = process.env;  //  if the system has a PATH variable set, this will be made accessible to you through process.
const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const { flights, reservations } = require("./data");
//// returns an array of all flight numbers////

const getFlights = async (req, res) => {

    const client = new MongoClient(MONGO_URI, option)
    try {
        await client.connect();
        const db = client.db("slingAir")
        const flights = await db.collection("flights").find().toArray();
        const allNumbers = flights.map((flight) => {
            return flight.flight
        })

        res.status(200).json({
            status: 200,
            data: allNumbers,
            message: "Successful"
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: error.message
        })
    }
    // close the connection to the database server
    client.close()

}

//// returns all the seats on a specified flight////
const getFlight = async (req, res) => {
    const client = new MongoClient(MONGO_URI, option);                 // create a new client
    const { flight } = req.params;
    // connect to the client 
    try {
        await client.connect();
        const db = client.db("slingAir")                             // connect to the database (database is provide as an argument to the funcation)

        const oneFlight = await db.collection("flights").findOne({ flight })
        const seats = oneFlight.seats;
        res.status(200).json({
            status: 200,
            data: seats,
            message: "Successful"
        })
    } catch (error) {
        res.status(404).json({
            status: 404,
            message: "No Data"
        })
    }

    client.close()                                         // close the connection to the database server

}

//// returns all reservations////
const getReservations = async (req, res) => {
    const client = new MongoClient(MONGO_URI, option);
    // connect to the database (database is provide as an argument to the funcation)
    try {
        await client.connect();
        const db = client.db("slingAir")
        const reservations = await db.collection("reservations").find().toArray();



        res.status(200).json({ status: 204, data: reservations, message: "Successful requested reservations" })
    } catch (err) {
        res.status(400).json({ status: 404, message: "No reservation found" })


    }
    // close the connection to the database server
    client.close()

}
//// returns a single reservation////
const getSingleReservation = async (req, res) => {
    //Create a new Client 
    const client = new MongoClient(MONGO_URI, option);

    // connect to the database (database is provide as an argument to the funcation)
    try {
        await client.connect()
        const db = client.db("slingAir");
        const { id } = req.params;

        const singleReservation = await db.collection("reservations").findOne({ id });

        if (singleReservation !== null) {
            res.status(200).json({
                status: 200,
                data: singleReservation,
                message: "Reservation data",
            })
        } else {
            res.status(404).json({
                status: 404,
                data: singleReservation,
                message: "No Reservation Found",
            })
        }


    } catch (error) {
        res.status(404).json({
            status: 404,
            message: error.message
        })
    }
    // close the connection to the database server
    client.close()
}



// creates a new reservatifion
const addReservation = async (req, res) => {
    const { seat, firstName, lastName, email, flight } = req.body;
    const newReservation = {
        id: uuidv4(),
        ...req.body
    };
    const client = new MongoClient(MONGO_URI, option);
    try {
        await client.connect();
        const db = client.db("slingAir");
        const reservation = await db.collection('reservations').insertOne(newReservation);
        const query = { flight, "seats.id": seat };
        const newValues = { $set: { "seats.$.isAvailable": false } };
        const availability = await db.collection('flights').updateOne(query, newValues);

        res.status(200).json({
            status: 200,
            message: "Reservation successfully added",
            data: newReservation
        });

    } catch (err) {
        res.status(400).json({
            status: 400,
            message: "Reservation not added"
        });

        client.close()
    }

}

// updates a specified reservation
const updateReservation = async (req, res) => {
    const client = new MongoClient(MONGO_URI, option);
    const db = client.db("slingair");
    await client.connect();
    try {
        const { seat, givenName, surName, email, id } = req.body;
        const query = { id };

        const newValuesReservation = {
            $set: {
                email: email,
                seat: seat,
                givenName: givenName,
                surName: surName,
            },
        };

        const flightInfo = await db.collection("reservations").findOne({ id });
        console.log(flightInfo);
        if (flightInfo.seat !== seat) {
            const query = { flight: flightInfo.flight, "seats.id": flightInfo.seat };
            const newValues = { $set: { "seats.$.isAvailable": true } };
            const updatedSeat = await db.collection("flights").updateOne(query, newValues);


            const query2 = { flight: flightInfo.flight, "seats.id": seat };
            const newValues2 = { $set: { "seats.$.isAvailable": false } };
            const updatedSeat2 = await db.collection("flights").updateOne(query2, newValues2);

        }
        const updateReservation = await db.collection("reservations").updateOne(query, newValuesReservation);

        res.status(200).json({
            status: 204,
            data: req.body,
            message: "Reservation was updated",
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: "ERROR"
        });
    } finally {
        client.close();

    }
};



// deletes a specified reservation
const deleteReservation = async (req, res) => {
    const client = new MongoClient(MONGO_URI, option);
    const reservationId = req.params.reservation
    await client.connect();
    const db = client.db("slingAir");
    // const reservationSingle = await db.collection("reservation").findone({ id: reservationId })
    if (reservationId) {
        const reservation = await db.collection("reservations").findOne({ id: reservationId })
        await db.collection("reservations").deleteOne({ id: reservationId })
        const { flight, seat } = reservation
        console.log(flight)
        const updateFlights = await db.collection("flights").updateOne({ flight, seats: { $elemMatch: { id: seat } } }, { $set: { "seats.$.isAvailable": true } })
        res.status(200).json({
            status: 200,
            message: "reservation Deleted"
        })
    } else {
        res.status(404).json({
            status: 404,
            message: `Reservation not Found`,
            data: reservationId
        })
    }
    client.close();
};





module.exports = {
    getFlights,
    getFlight,
    getReservations,
    addReservation,
    getSingleReservation,
    deleteReservation,
    updateReservation,
}
