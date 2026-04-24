document.addEventListener('DOMContentLoaded', function () {
  var radar = document.getElementById('radar');
  if (!radar) {
    return;
  }

  var radarDataUrl = radar.getAttribute('data-radar-url');
  var radarDate = radar.getAttribute('data-radar-date');

  if (!radarDataUrl || typeof radar_visualization !== 'function') {
    return;
  }

  fetch(radarDataUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      radar_visualization({
        repo_url: 'https://github.com/sujithq/tech-radar',
        date: radarDate || '',
        height: 800,
        quadrants: [
          { name: 'Techniques' },
          { name: 'Tools' },
          { name: 'Platforms' },
          { name: 'Languages & Frameworks' },
        ],
        rings: [
          { name: 'Authority field', color: '#7b2952' },
          { name: 'Good knowledge', color: '#140126' },
          { name: 'Some knowledge', color: '#0240a7' },
          { name: 'No knowledge', color: '#bcc3cc' },
          { name: 'No Interest', color: '#985a3e' },
        ],
        entries: data.entries,
      });
    })
    .catch(function (error) {
      console.error('Error loading radar.json:', error);
    });
});
