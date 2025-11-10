const form = document.getElementById('updateForm');
const msg = document.getElementById('statusMsg');
const cancelBtn = document.getElementById('cancelBtn');

const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');


function showMessage(type, text) {
  msg.className = `status ${type}`;
  msg.textContent = text;


  setTimeout(() => {
    msg.className = 'status';
    msg.textContent = '';
  }, 3000);
}


fetch(`/movies/${movieId}`)
  .then(res => res.json())
  .then(movie => {
    document.getElementById('movieId').value = movie.id;
    document.getElementById('title').value = movie.title;
    document.getElementById('ageRating').value = movie.ageRating;
    document.getElementById('movieRating').value = movie.movieRating;
    document.getElementById('genre').value = movie.genre;
    document.getElementById('duration').value = movie.duration;
    document.getElementById('year').value = movie.year;
    document.getElementById('description').value = movie.description;
    document.getElementById('poster').value = movie.Image;
  })
  .catch(() => showMessage('error', 'Error loading movie data.'));


form.addEventListener('submit', e => {
  e.preventDefault();

  const updatedData = {
    Title: title.value.trim(),
    Age_Rating: ageRating.value,
    Movie_Rating: Number(movieRating.value),
    Genre: genre.value.trim(),
    Duration: Number(duration.value),
    Year: Number(year.value),
    Description: description.value.trim(),
    Image: poster.value.trim()
  };


  if (!updatedData.title || !updatedData.genre || !updatedData.description) {
    showMessage('warning', 'Please fill in all required fields.');
    return;
  }

  if (updatedData.movieRating < 1 || updatedData.movieRating > 10) {
    showMessage('warning', 'Movie rating must be between 1 and 10.');
    return;
  }

  if (updatedData.duration <= 0) {
    showMessage('warning', 'Duration must be a positive number.');
    return;
  }


  fetch(`/movies/${movieId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
    .then(async res => {
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showMessage('success', data.message || 'Movie updated successfully!');
      } else {
        showMessage('error', data.message || 'Update failed.');
      }
    })
    .catch(() => showMessage('error', 'Network or server error.'));
});


cancelBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});
