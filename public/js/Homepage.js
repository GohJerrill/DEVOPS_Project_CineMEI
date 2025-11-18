//frontend for Jerrill's viewing feature

const dropdowns = document.querySelectorAll(".dropdown");

const chipGroup = document.querySelector('.Filter_Buttons');
const chips = chipGroup.querySelectorAll('button');

let activeChip = null;

chips.forEach(btn => {
    btn.addEventListener('click', () => {

        if (activeChip === btn) {
            btn.classList.remove('is-active');
            btn.setAttribute('aria-checked', 'false');
            activeChip = null;
            document.body.dataset.ageRating = '';
            return;
        }

        if (activeChip) {
            activeChip.classList.remove('is-active');
            activeChip.setAttribute('aria-checked', 'false');
        }

        // activate current
        btn.classList.add('is-active');
        btn.setAttribute('aria-checked', 'true');
        activeChip = btn;

        document.body.dataset.ageRating = btn.dataset.name;
        console.log('Selected age rating:', btn.dataset.name);
    });
});



dropdowns.forEach(dropdown => {
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
            select.classList.remove("select-clicked");
            caret.classList.remove("caret-rotate");
            menu.classList.remove("menu-open");


            options.forEach(o => o.classList.remove("active"));
            option.classList.add("active");
        });
    });


    window.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
            select.classList.remove("select-clicked");
            caret.classList.remove("caret-rotate");
            menu.classList.remove("menu-open");
        }
    });
});





// ===== Genre Multi-Select (Inline Chips) =====
(function () {
    const multi = document.querySelector('.genre-multiselect');
    if (!multi) return;

    const inputBox = multi.querySelector('.genre-input');
    const caret = inputBox.querySelector('.caret');
    const options = multi.querySelector('.genre-options');
    const listItems = Array.from(options.querySelectorAll('li'));
    const chipsContainer = inputBox.querySelector('.chips-container');
    const placeholder = inputBox.querySelector('.placeholder');
    const selectedGenres = new Set();


    inputBox.addEventListener('click', () => {
        inputBox.classList.toggle('open');
        options.classList.toggle('show');
    });

    // Handle option click
    listItems.forEach(li => {
        const checkbox = li.querySelector('input');
        li.addEventListener('click', () => {
            const genre = li.dataset.value;
            checkbox.checked = !checkbox.checked;

            if (checkbox.checked) selectedGenres.add(genre);
            else selectedGenres.delete(genre);

            renderChips();
        });
    });


    function renderChips() {
        chipsContainer.innerHTML = '';
        const all = Array.from(selectedGenres);
        placeholder.style.display = all.length ? 'none' : 'block';

        // Create each chip
        all.forEach(g => {
            const chip = document.createElement('div');
            chip.className = 'genre-chip';
            chip.innerHTML = `${g} <button type="button" aria-label="Remove ${g}">×</button>`;
            chip.querySelector('button').addEventListener('click', e => {
                e.stopPropagation();
                selectedGenres.delete(g);
                const li = listItems.find(l => l.dataset.value === g);
                if (li) li.querySelector('input').checked = false;
                renderChips();
            });
            chipsContainer.appendChild(chip);
        });


        requestAnimationFrame(checkOverflow);
    }

    function checkOverflow() {
        const chips = Array.from(chipsContainer.children);
        if (chips.length === 0) return;

        const availableWidth = inputBox.clientWidth - 80;
        let total = 0;
        let visibleCount = 0;

        chips.forEach(chip => {
            const chipWidth = chip.offsetWidth + 6;
            total += chipWidth;
            if (total < availableWidth) {
                chip.style.display = 'flex';
                visibleCount++;
            } else {
                chip.style.display = 'none';
            }
        });

        const hiddenCount = chips.length - visibleCount;

        const oldCounter = chipsContainer.querySelector('.genre-counter');
        if (oldCounter) oldCounter.remove();

        if (hiddenCount > 0) {
            const counter = document.createElement('div');
            counter.className = 'genre-chip genre-counter';
            counter.textContent = `+${hiddenCount}`;
            chipsContainer.appendChild(counter);
        }
    }

    window.addEventListener('click', e => {
        if (!multi.contains(e.target)) {
            inputBox.classList.remove('open');
            options.classList.remove('show');
        }
    });
})();

//frontend for Esmond's adding feature

