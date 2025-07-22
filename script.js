const map = L.map('map').setView([48.8566, 2.3522], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let allMarkers = [];
let allEditors = [];

function updateSidebar(editeur) {
  document.getElementById('details').innerHTML = `
    <h3>${editeur.nom}</h3>
    <p><strong>Adresse :</strong> ${editeur.adresse}</p>
    <p><strong>Chiffre d'affaires :</strong> ${editeur.ca}</p>
    <p><strong>Consoles :</strong> ${editeur.consoles.join(', ')}</p>
    <p><strong>Jeux notables :</strong> ${editeur.jeux.join(', ')}</p>
  `;
}

fetch('data/editeurs.json')
  .then(res => res.json())
  .then(data => {
    allEditors = data;
    displayMarkers(data);
  });

function displayMarkers(editors) {
  allMarkers.forEach(marker => map.removeLayer(marker));
  allMarkers = [];

  editors.forEach(editeur => {
    const marker = L.marker([editeur.lat, editeur.lng]).addTo(map);
    marker.on('click', () => updateSidebar(editeur));
    allMarkers.push(marker);
  });
}

document.getElementById('search').addEventListener('input', e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allEditors.filter(editeur =>
    editeur.nom.toLowerCase().includes(keyword) ||
    editeur.jeux.some(jeu => jeu.toLowerCase().includes(keyword)) ||
    editeur.consoles.some(console => console.toLowerCase().includes(keyword))
  );
  displayMarkers(filtered);
  if (filtered.length === 1) updateSidebar(filtered[0]);
});