function ipToInt(ip) {
  return ip.split('.').reduce(function (intValue, octet) {
    return (intValue << 8) + parseInt(octet, 10);
  }, 0) >>> 0;
}

function intToIp(intValue) {
  return [
    intValue >>> 24,
    (intValue >>> 16) & 255,
    (intValue >>> 8) & 255,
    intValue & 255,
  ].join('.');
}

function calculateCidr() {
  var networkInput = document.getElementById('networkInput');
  var cidrInput = document.getElementById('cidrInput');
  var output = document.getElementById('output');
  var alertBox = document.getElementById('alertBox');

  if (!networkInput || !cidrInput || !output || !alertBox) {
    return;
  }

  var ip = networkInput.value.trim();
  var prefixStr = cidrInput.value.trim();

  output.innerHTML = '';
  alertBox.classList.add('d-none');

  var prefix = parseInt(prefixStr, 10);
  var validIp = ip.match(/^(\d{1,3}\.){3}\d{1,3}$/);
  if (!validIp || Number.isNaN(prefix) || prefix < 0 || prefix > 32) {
    alertBox.textContent = 'Please enter a valid IPv4 address and CIDR prefix (0-32).';
    alertBox.classList.remove('d-none');
    return;
  }

  var ipInt = ipToInt(ip);
  var mask = ~(2 ** (32 - prefix) - 1) >>> 0;
  var network = ipInt & mask;
  var broadcast = (network | ~mask) >>> 0;

  var totalHosts = broadcast - network + 1;
  var usableStandard = prefix >= 31 ? 0 : Math.max(0, totalHosts - 2);

  var usableAzure = prefix > 28 ? 0 : Math.max(0, totalHosts - 5);
  var firstUsableAzure = usableAzure > 0 ? intToIp(network + 4) : 'N/A';
  var lastUsableAzure = usableAzure > 0 ? intToIp(broadcast - 1) : 'N/A';

  var html = '\n    <h5 class="mt-5 fw-bold">GLOBAL NETWORK INFORMATIONS</h5>\n    <p class="text-muted">This is applies for general network not in Azure.</p>\n    <table class="table table-striped">\n      <tbody>\n        <tr><th>CIDR Notation</th><td>' + ip + '/' + prefix + '</td></tr>\n        <tr><th>Network IP (and first IP)</th><td>' + intToIp(network) + '</td></tr>\n        <tr><th>Broadcast IP (and last IP)</th><td>' + intToIp(broadcast) + '</td></tr>\n        <tr><th>Total number of IPs</th><td>' + totalHosts + '</td></tr>\n        <tr><th>Total number of usable IPs</th><td>' + usableStandard + '</td></tr>\n      </tbody>\n    </table>\n\n    <h5 class="mt-4 fw-bold">AZURE NETWORK INFORMATIONS</h5>\n    <p class="text-muted">\n      This is applies <strong>only</strong> for Azure.<br />\n      Sources for reserved IPs: <a href="https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#are-there-any-restricted-addresses-in-an-ip-subnet" target="_blank" rel="noopener">Azure Virtual Network FAQ</a>\n    </p>\n    <table class="table table-striped">\n      <tbody>\n        <tr><th>First Azure usable IP</th><td>' + firstUsableAzure + '</td></tr>\n        <tr><th>Last Azure usable IP</th><td>' + lastUsableAzure + '</td></tr>\n        <tr><th>Number of usable IPs on Azure</th><td>' + usableAzure + '</td></tr>\n        <tr>\n          <th>Reserved IPs</th>\n          <td>\n            Default gateway : ' + intToIp(network + 1) + '<br />\n            Mapped Azure DNS IP : ' + intToIp(network + 2) + '<br />\n            Mapped Azure DNS IP : ' + intToIp(network + 3) + '\n          </td>\n        </tr>\n      </tbody>\n    </table>\n  ';

  output.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function () {
  var calculateButton = document.getElementById('cidr-calc-btn');
  var networkInput = document.getElementById('networkInput');
  var cidrInput = document.getElementById('cidrInput');

  if (calculateButton) {
    calculateButton.addEventListener('click', calculateCidr);
  }

  function handleEnterKey(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      calculateCidr();
    }
  }

  if (networkInput) {
    networkInput.addEventListener('keydown', handleEnterKey);
  }

  if (cidrInput) {
    cidrInput.addEventListener('keydown', handleEnterKey);
  }
});
