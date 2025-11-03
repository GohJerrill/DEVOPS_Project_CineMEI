const { Movie_Structure } = require('../models/MovieStructure');
const fs = require('fs').promises;
const path = require('path');
const RESOURCES_FILE = path.join('utils', 'MovieDatabase.json');
const TEMPLATE_FILE = path.join('utils', 'Movie_Template.json');
async function addMovie(req, res) {
    try {
        const { Title, Age_Rating, Movie_Rating, Genre, Duration, Year, Description, Image } = req.body;
        const newMovie = new Movie_Structure(Title, Age_Rating, Movie_Rating, Genre, Duration, Year, Description, Image);
        let movies = [];
        try {
            // Try reading the existing MovieDatabase.json
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');
            movies = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // If MovieDatabase.json doesn't exist, create it from the template
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                movies = JSON.parse(templateData);
                await fs.writeFile(RESOURCES_FILE, JSON.stringify(movies, null, 2), 'utf8');
            } else {
                throw err;
            }
        }
        // Add new resource and save to file
        movies.push(newMovie);
        await fs.writeFile(RESOURCES_FILE, JSON.stringify(movies, null, 2), 'utf8');
        return res.status(201).json(movies);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
module.exports = { addMovie };