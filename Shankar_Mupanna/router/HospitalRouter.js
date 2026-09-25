const express = require('express');
const Hospital = require('../models/Hospital');
const router = express.Router();

router.get('/', async (request, response) => {
    try {
        const hospitals = await Hospital.find({});
        response.status(200).json(hospitals);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.get('/available', async (request, response) => {
    try {
        const hospitals = await Hospital.find({ availableBeds: { $gt: 0 } });
        response.status(200).json(hospitals);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.post('/', async (request, response) => {
    try {
        const { name, city, totalBeds, availableBeds } = request.body;

        if (!name) {
            return response.status(400).json({ message: 'Name is required' });
        } else if (!city) {
            return response.status(400).json({ message: 'City is required' });
        } else if (totalBeds === undefined) {
            return response.status(400).json({ message: 'Total beds is required' });
        } else if (availableBeds === undefined) {
            return response.status(400).json({ message: 'Available beds is required' });
        }

        const newHospital = { name, city, totalBeds, availableBeds };
        const hospital = await Hospital.create(newHospital);
        await hospital.save();

        return response.status(201).json(hospital);
    } catch (error) {
        return response.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (request, response) => {
    try {
        const hospital = await Hospital.findById(request.params.id);
        response.status(200).json(hospital);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (request, response) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(request.params.id, request.body, { new: true });
        response.status(200).json({ message: 'Hospital Updated Successfully', hospital });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (request, response) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(request.params.id);
        response.status(200).json({ message: 'Hospital Deleted Successfully', hospital });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
});

module.exports = router;