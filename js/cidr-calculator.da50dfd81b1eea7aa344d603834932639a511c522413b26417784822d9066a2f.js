(()=>{function A(t){return t.split(".").reduce(function(r,e){return(r<<8)+parseInt(e,10)},0)>>>0}function s(t){return[t>>>24,t>>>16&255,t>>>8&255,t&255].join(".")}function I(){var t=document.getElementById("networkInput"),r=document.getElementById("cidrInput"),e=document.getElementById("output"),n=document.getElementById("alertBox");if(!(!t||!r||!e||!n)){var o=t.value.trim(),p=r.value.trim();e.innerHTML="",n.classList.add("d-none");var a=parseInt(p,10),v=o.match(/^(\d{1,3}\.){3}\d{1,3}$/);if(!v||Number.isNaN(a)||a<0||a>32){n.textContent="Please enter a valid IPv4 address and CIDR prefix (0-32).",n.classList.remove("d-none");return}var b=A(o),c=~(2**(32-a)-1)>>>0,d=b&c,u=(d|~c)>>>0,l=u-d+1,m=a>=31?0:Math.max(0,l-2),i=a>28?0:Math.max(0,l-5),h=i>0?s(d+4):"N/A",f=i>0?s(u-1):"N/A",y=`
    <h5 class="mt-5 fw-bold">GLOBAL NETWORK INFORMATIONS</h5>
    <p class="text-muted">This is applies for general network not in Azure.</p>
    <table class="table table-striped">
      <tbody>
        <tr><th>CIDR Notation</th><td>`+o+"/"+a+`</td></tr>
        <tr><th>Network IP (and first IP)</th><td>`+s(d)+`</td></tr>
        <tr><th>Broadcast IP (and last IP)</th><td>`+s(u)+`</td></tr>
        <tr><th>Total number of IPs</th><td>`+l+`</td></tr>
        <tr><th>Total number of usable IPs</th><td>`+m+`</td></tr>
      </tbody>
    </table>

    <h5 class="mt-4 fw-bold">AZURE NETWORK INFORMATIONS</h5>
    <p class="text-muted">
      This is applies <strong>only</strong> for Azure.<br />
      Sources for reserved IPs: <a href="https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#are-there-any-restricted-addresses-in-an-ip-subnet" target="_blank" rel="noopener">Azure Virtual Network FAQ</a>
    </p>
    <table class="table table-striped">
      <tbody>
        <tr><th>First Azure usable IP</th><td>`+h+`</td></tr>
        <tr><th>Last Azure usable IP</th><td>`+f+`</td></tr>
        <tr><th>Number of usable IPs on Azure</th><td>`+i+`</td></tr>
        <tr>
          <th>Reserved IPs</th>
          <td>
            Default gateway : `+s(d+1)+`<br />
            Mapped Azure DNS IP : `+s(d+2)+`<br />
            Mapped Azure DNS IP : `+s(d+3)+`
          </td>
        </tr>
      </tbody>
    </table>
  `;e.innerHTML=y}}document.addEventListener("DOMContentLoaded",function(){var t=document.getElementById("cidr-calc-btn"),r=document.getElementById("networkInput"),e=document.getElementById("cidrInput");t&&t.addEventListener("click",I);function n(o){o.key==="Enter"&&(o.preventDefault(),I())}r&&r.addEventListener("keydown",n),e&&e.addEventListener("keydown",n)});})();
