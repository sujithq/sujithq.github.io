(()=>{document.addEventListener("DOMContentLoaded",()=>{let s=document.getElementById("cert-tbody");if(!s)return;let o=[];try{o=JSON.parse(s.dataset.certs||"[]")}catch(t){console.error("Failed to parse certificate data:",t);return}let r=new Date;o.map(t=>{let e=new Date(t.expires),n=Math.ceil((e-r)/(1e3*60*60*24)),a=new Date(e);a.setDate(e.getDate()-180);let d=Math.ceil((a-r)/(1e3*60*60*24));return{...t,expires:e,daysLeft:n,renewalStart:a,startingIn:d}}).sort((t,e)=>t.startingIn-e.startingIn).forEach(t=>{let e=t.daysLeft<=30?"table-danger":t.daysLeft<=90?"table-warning":"",n=t.iconUrl&&/^https:\/\//.test(t.iconUrl)?t.iconUrl:null,a=n?`<img src="${n}" alt="${t.desc} certification icon" width="40" height="40" loading="lazy">`:"",d=`
      <tr class="${e}">
        <td>${a}</td>
        <td>${t.code||""}</td>
        <td>${t.desc||""}</td>
        <td>${t.type||""}</td>
        <td>${t.expires.toLocaleDateString()}</td>
        <td>${t.daysLeft}</td>
        <td>${t.renewalStart.toLocaleDateString()}</td>
        <td>${t.startingIn}</td>
      </tr>
    `;s.insertAdjacentHTML("beforeend",d)})});})();
