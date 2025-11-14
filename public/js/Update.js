const form = document.getElementById('updateForm');
const msg = document.getElementById('statusMsg');
const cancelBtn = document.getElementById('cancelBtn');

const changePosterBtn = document.getElementById("changePosterBtn");
const posterFile = document.getElementById("posterFile");
const posterPreview = document.getElementById("posterPreview");
const previewPoster = document.getElementById("previewPoster"); 

changePosterBtn.addEventListener("click", () => {
  posterFile.click();
});

posterFile.addEventListener("change", () => {
  const file = posterFile.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    posterPreview.src = reader.result;
    previewPoster.src = reader.result;
  };
  reader.readAsDataURL(file);
});

function showMessage(type, text) {
  msg.className = `status ${type}`;
  msg.textContent = text;

  setTimeout(() => {
    msg.className = 'status';
    msg.textContent = '';
  }, 3000);
}

title.addEventListener("input", () => {
  previewTitle.textContent = title.value.trim() || "Movie Title";
});

ageRating.addEventListener("change", () => {
  previewAge.textContent = ageRating.value;
});

movieRating.addEventListener("input", () => {
  const r = movieRating.value;
  previewRating.textContent = r ? `${r}/10` : "0/10";
});

genre.addEventListener("change", () => {
  previewGenre.textContent = genre.value;
});

duration.addEventListener("input", () => {
  const d = duration.value;
  previewDuration.textContent = d ? `${d} mins` : "0 mins";
});

year.addEventListener("input", () => {
  previewYear.textContent = year.value || "----";
});

description.addEventListener("input", () => {
  previewDesc.textContent = description.value.trim() || "Movie description will appear here.";
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const movieId = document.getElementById('movieId').value.trim();
  const titleValue = title.value.trim();
  const genreValue = genre.value.trim();
  const descValue = description.value.trim();
  const ageValue = ageRating.value;
  const ratingValue = Number(movieRating.value);
  const durationValue = Number(duration.value);
  const yearValue = Number(year.value);

  if (!movieId) {
    showMessage('warning', 'Movie ID is required.');
    return;
  }

  if (!titleValue) {
    showMessage('warning', 'Movie title is required.');
    return;
  }

  if (!ageValue) {
    showMessage('warning', 'Age rating is required.');
    return;
  }

  if (!ratingValue) {
    showMessage('warning', 'Movie rating is required.');
    return;
  }

  if (ratingValue < 1 || ratingValue > 10) {
    showMessage('warning', 'Movie rating must be between 1 and 10.');
    return;
  }

  if (!genreValue) {
    showMessage('warning', 'Genre is required.');
    return;
  }

  if (!durationValue) {
    showMessage('warning', 'Duration is required.');
    return;
  }

  if (durationValue <= 0) {
    showMessage('warning', 'Duration must be a positive number.');
    return;
  }

  if (!yearValue) {
    showMessage('warning', 'Year of release is required.');
    return;
  }

  if (yearValue < 1900) {
    showMessage('warning', 'Year must be at least 1900.');
    return;
  }

  if (!descValue) {
    showMessage('warning', 'Description is required.');
    return;
  }

  const updatedData = {
    Title: titleValue,
    Age_Rating: ageValue,
    Movie_Rating: ratingValue,
    Genre: genreValue,
    Duration: durationValue,
    Year: yearValue,
    Description: descValue,
    Image: posterPreview.src
  };

  fetch(`/movies/${movieId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData)
  })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showMessage('success', data.message || 'Movie updated successfully!');
      } else {
        showMessage('error', data.message || 'Update failed.');
      }
    })
    .catch(() => {
      showMessage('error', 'Network or server error.');
    });
});

cancelBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});
