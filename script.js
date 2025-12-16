const form = document.getElementById("musicForm");
const playlistDiv = document.getElementById("playlist");
const modal = document.getElementById("modal");
const openBtn = document.getElementById("openFormBtn");
const closeBtn = document.querySelector(".close");
const musicaInput = document.getElementById("musica");

const suggestionsDiv = document.getElementById("suggestions");

let playlist = JSON.parse(localStorage.getItem("playlist")) || [];


function renderPlaylist() {
  playlistDiv.innerHTML = "";
  playlist.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("song");
    div.innerHTML = `<img src="./assets/cd_bts.png" alt="nota musical" class="song-icon"> ${item.musica}` + (item.nome ? ` — ${item.nome}` : "");
    playlistDiv.appendChild(div);
  });
}

openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

async function fetchSuggestions(query) {
  if (!query) return [];

  try {
    const res = await fetch(`http://127.0.0.1:5000/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.tracks || [];
  } catch (err) {
    console.error("Erro ao buscar sugestões:", err);
    return [];
  }
}

musicaInput.addEventListener("input", async () => {
  const query = musicaInput.value.trim();
  suggestionsDiv.innerHTML = "";

  if (!query) {
    suggestionsDiv.style.display = "none";
    return;
  }

  const tracks = await fetchSuggestions(query);

  tracks.forEach(track => {
    const div = document.createElement("div");
    div.classList.add("suggestion-item");
    div.textContent = track.name + (track.artists ? ` — ${track.artists[0].name}` : "");

    div.addEventListener("click", () => {
      musicaInput.value = track.name;
      suggestionsDiv.style.display = "none";
    });

    suggestionsDiv.appendChild(div);
  });

  suggestionsDiv.style.display = tracks.length ? "block" : "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const musica = musicaInput.value.trim();
  const nome = document.getElementById("nome").value.trim();

  if (musica) {
    playlist.push({ musica, nome });
    localStorage.setItem("playlist", JSON.stringify(playlist));
    renderPlaylist();
    form.reset();
    suggestionsDiv.style.display = "none";
    modal.style.display = "none";
  }
});

const modalShown = sessionStorage.getItem("modalShown");
if (!modalShown) {
  modal.style.display = "flex";
  sessionStorage.setItem("modalShown", "true");
}


const fadeElements = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

fadeElements.forEach(el => observer.observe(el));

renderPlaylist();
