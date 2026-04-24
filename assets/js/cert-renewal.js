document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('cert-tbody');
  if (!tbody) {
    return;
  }

  let certs = [];
  try {
    certs = JSON.parse(tbody.dataset.certs || '[]');
  } catch (error) {
    console.error('Failed to parse certificate data:', error);
    return;
  }

  const today = new Date();

  const certsWithDates = certs
    .map((cert) => {
      const expires = new Date(cert.expires);
      const daysLeft = Math.ceil((expires - today) / (1000 * 60 * 60 * 24));
      const renewalStart = new Date(expires);
      renewalStart.setDate(expires.getDate() - 180);
      const startingIn = Math.ceil((renewalStart - today) / (1000 * 60 * 60 * 24));
      return { ...cert, expires, daysLeft, renewalStart, startingIn };
    })
    .sort((a, b) => a.startingIn - b.startingIn);

  certsWithDates.forEach((cert) => {
    const statusClass = cert.daysLeft <= 30 ? 'table-danger' : (cert.daysLeft <= 90 ? 'table-warning' : '');
    const safeIconUrl = cert.iconUrl && /^https:\/\//.test(cert.iconUrl) ? cert.iconUrl : null;
    const iconHtml = safeIconUrl
      ? `<img src="${safeIconUrl}" alt="${cert.desc} certification icon" width="40" height="40" loading="lazy">`
      : '';

    const row = `
      <tr class="${statusClass}">
        <td>${iconHtml}</td>
        <td>${cert.code || ''}</td>
        <td>${cert.desc || ''}</td>
        <td>${cert.type || ''}</td>
        <td>${cert.expires.toLocaleDateString()}</td>
        <td>${cert.daysLeft}</td>
        <td>${cert.renewalStart.toLocaleDateString()}</td>
        <td>${cert.startingIn}</td>
      </tr>
    `;

    tbody.insertAdjacentHTML('beforeend', row);
  });
});
