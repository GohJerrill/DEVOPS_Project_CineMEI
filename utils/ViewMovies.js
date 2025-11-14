const fs = require('fs').promises;
const path = require('path')

const Movie_File = path.join('utils', 'MovieDatabase.json');

async function ViewMovies(req, res) {

    // The Utils/backend code of fetching the movie DB, allows the CineMEI to get the data from the DB.

    try {
        const data = await fs.readFile(Movie_File, 'utf-8');
        const MovieBaby = JSON.parse(data);
        return res.status(200).json(MovieBaby);
    } catch (error) {
        if (error.code === "ENOENT") {
            return res.status(200).json([]);
        }
        return res.status(500).json({message: error.message});
    }
}

module.exports = { ViewMovies };