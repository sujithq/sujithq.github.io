(function () {
  var currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
  var savedTheme = null;

  try {
    savedTheme = localStorage.getItem('theme');
  } catch (error) {
    savedTheme = null;
  }

  document.documentElement.setAttribute('data-bs-theme', savedTheme || currentTheme);
})();
