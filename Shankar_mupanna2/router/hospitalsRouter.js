const express = require("express");
const Hospitals = require("../models/hospitals");

const router = express.Router();


const requestLogger = (request, response, next) => {
    console.log("Request URL:", request.url);
    console.log("Request Method:", request.method);
    console.log("Date:", new Date().toLocaleString());

    next();
};

router.use(requestLogger);


router.get("/", async (request, response) => {
    try {
        const hospitals = await Hospitals.find();

        response.status(200).json(hospitals);

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});


router.post("/register", async (request, response) => {
    try {

        const {
            name,
            city,
            totalBeds,
            availableBeds
        } = request.body;

        if (!name || !city || !totalBeds || !availableBeds) {
            return response.status(400).json({
                message: "All fields are required"
            });
        }

        const existingHospital = await Hospitals.findOne({ name });

        if (existingHospital) {
            return response.status(400).json({
                message: "Hospital already exists"
            });
        }

        const newHospital = {
            name,
            city,
            totalBeds,
            availableBeds
        };

        const hospital = new Hospitals(newHospital);

        await hospital.save();

        response.status(201).json({
            message: "Hospital created successfully",
            hospital
        });

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});
router.get("/:id", async (request, response) => {
    try {
        const hospital = await Hospitals.findById(request.params.id);

        if (!hospital) {
            return response.status(404).json({
                message: "Hospital not found"
            });
        }

        response.status(200).json(hospital);

    } catch (error) {
        response.status(500).json({
            message: error.message
        });
    }
});

router.put("/:id", async (request, response) => {
    try {

        const { name, city, totalBeds, availableBeds } = request.body;

        const hospital = await Hospitals.findById(request.params.id);

        if (!hospital) {
            return response.status(404).json({
                message: "Hospital not found"
            });
        }

        hospital.name = name;
        hospital.city = city;
        hospital.totalBeds = totalBeds;
        hospital.availableBeds = availableBeds;

        await hospital.save();

        response.status(200).json({
            message: "Hospital updated successfully",
            hospital
        });

    } catch (error) {

        if (error.name === "CastError") {
            return response.status(400).json({
                message: "Invalid hospital ID"
            });
        }

        response.status(500).json({
            message: error.message
        });
    }
});

router.delete("/:id", async (request, response) => {
    try {

        const hospital = await Hospitals.findById(request.params.id);

        if (!hospital) {
            return response.status(404).json({
                message: "Hospital not found"
            });
        }

        await Hospitals.findByIdAndDelete(request.params.id);

        response.status(200).json({
            message: "Hospital deleted successfully"
        });

    } catch (error) {

        if (error.name === "CastError") {
            return response.status(400).json({
                message: "Invalid hospital ID"
            });
        }

        response.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;