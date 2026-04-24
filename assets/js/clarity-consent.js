(function () {
  function normalizeValue(value) {
    return ('' + (value || '')).replace(/^[\"']+|[\"']+$/g, '');
  }

  function deleteCookie(name) {
    try {
      document.cookie = name + '=; Max-Age=0; path=/';
      document.cookie = name + '=; Max-Age=0; path=/; domain=' + location.hostname;
    } catch (error) {
      // Ignore cookie deletion errors.
    }
  }

  function bindConsentResetLinks() {
    var nodes = document.querySelectorAll('[data-consent-reset]');
    nodes.forEach(function (node) {
      if (!node || node.dataset.bound === '1') {
        return;
      }

      node.addEventListener('click', function (event) {
        event.preventDefault();

        var key = normalizeValue(node.getAttribute('data-storage-key') || 'clarityConsent');
        var keys = ['clarityConsent'];
        if (key && keys.indexOf(key) === -1) {
          keys.push(key);
        }

        keys.forEach(function (storageKey) {
          try {
            localStorage.removeItem(storageKey);
          } catch (error) {
            // Ignore localStorage errors.
          }
        });

        ['_clck', '_clsk'].forEach(deleteCookie);
        setTimeout(function () {
          location.reload();
        }, 10);
      });

      node.dataset.bound = '1';
    });
  }

  function init() {
    var banner = document.getElementById('cc-banner');
    if (!banner) {
      bindConsentResetLinks();
      return;
    }

    var clarityId = normalizeValue(banner.getAttribute('data-clarity-id'));
    var storageKey = normalizeValue(banner.getAttribute('data-storage-key') || 'clarityConsent');
    var showBanner = banner.getAttribute('data-show-banner') === 'true';
    var useGcm = banner.getAttribute('data-use-gcm') === 'true';

    function gtag() {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    }

    if (useGcm) {
      gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
      });
    }

    function loadClarity() {
      if (!clarityId) {
        return;
      }

      (function (c, l, a, r, i, t, y) {
        c[a] = c[a] || function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
        t = l.createElement(r);
        t.async = 1;
        t.src = 'https://www.clarity.ms/tag/' + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, 'clarity', 'script', clarityId);
    }

    function setConsent(accepted) {
      try {
        localStorage.setItem(storageKey, accepted ? 'yes' : 'no');
      } catch (error) {
        // Ignore localStorage errors.
      }

      if (useGcm) {
        gtag('consent', 'update', {
          analytics_storage: accepted ? 'granted' : 'denied',
          functionality_storage: accepted ? 'granted' : 'denied',
        });
      }

      if (accepted) {
        loadClarity();
        if (typeof clarity === 'function') {
          clarity('consent', 'yes');
        }
      } else if (typeof clarity === 'function') {
        clarity('consent', 'no');
      }
    }

    function showBannerIfNeeded() {
      if (!showBanner) {
        return;
      }

      var stored;
      try {
        stored = localStorage.getItem(storageKey);
      } catch (error) {
        stored = null;
      }

      if (stored === 'yes') {
        loadClarity();
        if (typeof clarity === 'function') {
          clarity('consent', 'yes');
        }
        return;
      }

      if (stored === 'no') {
        if (typeof clarity === 'function') {
          clarity('consent', 'no');
        }
        return;
      }

      banner.style.display = 'block';
    }

    var accept = document.getElementById('cc-accept');
    var decline = document.getElementById('cc-decline');

    if (accept) {
      accept.addEventListener('click', function () {
        setConsent(true);
        banner.style.display = 'none';
      });
    }

    if (decline) {
      decline.addEventListener('click', function () {
        setConsent(false);
        banner.style.display = 'none';
      });
    }

    showBannerIfNeeded();
    bindConsentResetLinks();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
