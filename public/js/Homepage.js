
const Container = document.getElementById("Movies_Container");
const SearchInput = document.getElementById("search-input");
const chipGroup = document.querySelector(".Filter_Buttons");
let selectedGenres = new Set();


let AllMovies = [];
let CurrentSortMode = "All";
let activeChip = null;


// Show default "no results" message if got error or like dosent match filters baby.
function showDefaultMessage(message) {
    Container.innerHTML = `
    <div class="default_Text">
      <img class="Error_Image" src="./images/Error.png" alt="">
      <p>${message}</p>
    </div>`;
}

// Render all movies on screen
function RenderMovie(Movies) {

    if (!Movies.length) {
        showDefaultMessage("No movies match your search.");
        return;
    }

    Container.innerHTML = "";
    for (let i = 0; i < Movies.length; i++) {
        const M = Movies[i];
        Container.innerHTML += `

        <div class="box">
            <img class="edit-icon" src="./images/edit_icon.png" alt="Edit">
            <div class="box-img">
            <img src="./images/${M.Image}" alt="">
            </div>
            <div class="overlay">
            <h3 class="overlay-title">${M.Title}</h3>
            <p class="overlay-desc">${M.Description}</p>
            <p><span class="Duration">Duration: </span>${M.Duration}</p>
            <p><span class="Genre">Genre: </span>${M.Genre}</p>
            </div>
            <div class="Stars_Rating">
            <div class="Stars">
                <p>${M.Movie_Rating}</p>
                <img src="./images/star.png" alt="">
            </div>
            <p class="Rating">${M.Age_Rating}</p>
            </div>
            <h3 class="Title">${M.Title}</h3>
            <span class="year">${M.Year}</span>
        </div>
        `;

    }
}


function applyAllFilters() {

    let list = [...AllMovies];

    // --- Search Filter OHHH YEAHHHHHHHHHHH ---
    const search = SearchInput.value.toLowerCase().trim();
    if (search) {
        list = list.filter(m => m.Title.toLowerCase().includes(search));
    }

    // --- Age Rating Filter SIUUUU ---
    const selectedRating = document.body.dataset.ageRating;
    if (selectedRating) {
        list = list.filter(m => m.Age_Rating.toLowerCase() === selectedRating.toLowerCase());
    }

    // --- Genre Filter BABY ---
    if (selectedGenres.size > 0) {
        list = list.filter(m => {
            const movieGenres = Array.isArray(m.Genre)
                ? m.Genre.map(g => g.toLowerCase())
                : m.Genre.toLowerCase();
            return Array.from(selectedGenres).some(sel =>
                movieGenres.includes(sel.toLowerCase())
            );
        });
    }


    // --- Sort Filter time ---
    if (CurrentSortMode === "Best Rated") {
        list.sort((a, b) => b.Movie_Rating - a.Movie_Rating);
    }

    // --- Display HEHEHEEH ---
    if (list.length === 0) {
        const msg =
            selectedRating || selectedGenres.size > 0
                ? "No movies found for the selected filters."
                : "No movies match your search.";
        showDefaultMessage(msg);
    } else {
        RenderMovie(list);
    }


}


async function DisplayMovies() {

    try {
        const response = await fetch("/View_Movies");

        if (response.ok) {
            const MoviesData = await response.json();

            if (!Array.isArray(MoviesData) || MoviesData.length === 0) {
                showDefaultMessage("No movies found in the database.");
                return;
            }

            AllMovies = MoviesData
            RenderMovie(AllMovies)

        } else {
            showDefaultMessage("Failed to load movies. Please try again later.");
            return;
        }
    } catch (error) {
        console.log("Error loading movies: ", error);
        showDefaultMessage("An unexpected error occurred while loading movies.");
    }

}

document.querySelectorAll(".dropdown").forEach(dropdown => {
    const select = dropdown.querySelector(".select");
    const caret = dropdown.querySelector(".caret");
    const menu = dropdown.querySelector(".menu");
    const options = dropdown.querySelectorAll(".menu li");
    const selected = dropdown.querySelector(".selected");

    select.addEventListener("click", () => {
        select.classList.toggle("select-clicked");
        caret.classList.toggle("caret-rotate");
        menu.classList.toggle("menu-open");
    });

    options.forEach(option => {
        option.addEventListener("click", () => {
            selected.innerText = option.innerText;
            options.forEach(o => o.classList.remove("active"));
            option.classList.add("active");
            CurrentSortMode = option.innerText.trim();
            applyAllFilters(); // unified filter
            select.classList.remove("select-clicked");
            caret.classList.remove("caret-rotate");
            menu.classList.remove("menu-open");
        });
    });

    window.addEventListener("click", e => {
        if (!dropdown.contains(e.target)) {
            select.classList.remove("select-clicked");
            caret.classList.remove("caret-rotate");
            menu.classList.remove("menu-open");
        }
    });
});


if (chipGroup) {
    const chips = chipGroup.querySelectorAll("button");
    chips.forEach(btn => {
        btn.addEventListener("click", () => {
            if (activeChip === btn) {
                btn.classList.remove("is-active");
                btn.setAttribute("aria-checked", "false");
                activeChip = null;
                document.body.dataset.ageRating = "";
            } else {
                if (activeChip) {
                    activeChip.classList.remove("is-active");
                    activeChip.setAttribute("aria-checked", "false");
                }
                btn.classList.add("is-active");
                btn.setAttribute("aria-checked", "true");
                activeChip = btn;
                document.body.dataset.ageRating = btn.dataset.name;
            }
            applyAllFilters();
        });
    });
}

SearchInput.addEventListener("input", applyAllFilters);


function GenreFilter() {
    const multi = document.querySelector(".genre-multiselect");
    if (!multi) return;

    const inputBox = multi.querySelector(".genre-input");
    const options = multi.querySelector(".genre-options");
    const listItems = Array.from(options.querySelectorAll("li"));
    const chipsContainer = inputBox.querySelector(".chips-container");
    const placeholder = inputBox.querySelector(".placeholder");

    inputBox.addEventListener("click", () => {
        inputBox.classList.toggle("open");
        options.classList.toggle("show");
    });


    listItems.forEach(li => {
        const checkbox = li.querySelector("input");
        li.addEventListener("click", () => {
            const genre = li.dataset.value;
            checkbox.checked = !checkbox.checked;

            if (checkbox.checked) selectedGenres.add(genre);
            else selectedGenres.delete(genre);

            renderChips();
            applyAllFilters();
        });
    });


    function renderChips() {
        chipsContainer.innerHTML = "";
        const all = Array.from(selectedGenres);
        placeholder.style.display = all.length ? "none" : "block";

        all.forEach(g => {
            const chip = document.createElement("div");
            chip.className = "genre-chip";
            chip.innerHTML = `${g} <button type="button" aria-label="Remove ${g}">×</button>`;
            chip.querySelector("button").addEventListener("click", e => {
                e.stopPropagation();
                selectedGenres.delete(g); 
                const li = listItems.find(l => l.dataset.value === g);
                if (li) li.querySelector("input").checked = false;
                renderChips();
                applyAllFilters();
            });
            chipsContainer.appendChild(chip);
        });

        requestAnimationFrame(checkOverflow); 
    }


    function checkOverflow() {
        const chips = Array.from(chipsContainer.children);
        if (chips.length === 0) return;

        const availableWidth = inputBox.clientWidth - 100; 
        let total = 0;
        let visibleCount = 0;

        chips.forEach(chip => {
            const chipWidth = chip.offsetWidth + 6; 
            total += chipWidth;
            if (total < availableWidth) {
                chip.style.display = "flex";
                visibleCount++;
            } else {
                chip.style.display = "none";
            }
        });

   
        const oldCounter = chipsContainer.querySelector(".genre-counter");
        if (oldCounter) oldCounter.remove();


        const hiddenCount = chips.length - visibleCount;
        if (hiddenCount > 0) {
            const counter = document.createElement("div");
            counter.className = "genre-chip genre-counter";
            counter.textContent = `+${hiddenCount}`;
            chipsContainer.appendChild(counter);
        }
    }

    window.addEventListener("click", e => {
        if (!multi.contains(e.target)) {
            inputBox.classList.remove("open");
            options.classList.remove("show");
        }
    });
}


window.onload = () => {
    DisplayMovies();
    GenreFilter();
};
