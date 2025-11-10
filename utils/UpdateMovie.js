const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'Movie_Template.json');

function UpdateMovie(req, res) {
  const id = String(req.params.id);
  const updatedMovie = req.body;

  if (!updatedMovie.Title || !updatedMovie.Description) {
    return res.status(400).json({ message: 'Invalid update data — missing fields.' });
  }
  

  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading movie data.' });

    let movies = JSON.parse(data);
    const index = movies.findIndex(m => String(m.id) === id);

    if (index === -1) return res.status(404).json({ message: 'Movie not found.' });


    movies[index] = { ...movies[index], ...updatedMovie };

    fs.writeFile(DATA_PATH, JSON.stringify(movies, null, 2), err2 => {
      if (err2) return res.status(500).json({ message: 'Error saving updated movie.' });
      res.json({ message: 'Movie updated successfully!', movie: movies[index] });
    });
  });
}

module.exports = { UpdateMovie };
