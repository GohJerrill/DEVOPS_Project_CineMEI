const fs = require('fs').promises;
const path = require('path');

const DATA_PATH = path.join(__dirname, 'MovieDatabase.json');

async function UpdateMovie(req, res) {
  const id = String(req.params.id); 
  const updatedMovie = req.body;

  // if (!updatedMovie.Title || !updatedMovie.Description) {
  //   return res.status(400).json({ message: 'Invalid update data — missing fields.' });
  // }

  try {
    // Read the existing movie list from database (JSON file)
    const data = await fs.readFile(DATA_PATH, 'utf8');
    const movies = JSON.parse(data);

    // Find the movie that matches the requessted ID
    const index = movies.findIndex(m => String(m.id) === id);
    if (index === -1) return res.status(404).json({ message: 'Movie not found.' });

    movies[index] = { ...movies[index], ...updatedMovie };

    await fs.writeFile(DATA_PATH, JSON.stringify(movies, null, 2));

    res.json({ message: 'Movie updated successfully!', movie: movies[index] });

  } catch (err) {
    res.status(500).json({ message: 'Error reading or saving movie data.' });
  }
}

module.exports = { UpdateMovie };
