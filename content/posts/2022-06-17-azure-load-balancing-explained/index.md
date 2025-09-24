+++
title = 'Azure Load Balancing: Choose the Right Option'
slug = 'azure-load-balancing-explained'
date = '2022-06-17 06:00:00Z'
lastmod = '2025-09-24 06:00:00Z'
draft = false
tags = [
  "Azure",
  "Azure Load Balancer",
  "Azure Traffic Manager",
  "Azure Application Gateway",
  "Azure Front Door",
  "Cross-region Load Balancer",
  "Gateway Load Balancer",
  "Load Balancing",
  "Networking",
  "Cloud Infrastructure",
  "Global Traffic Routing",
  "Layer 4 vs Layer 7",
  "High Availability",
  "Scalability",
  "Performance Optimisation",
  "DNS Routing",
  "Web Application Security"
]
categories = [
  'Professional Experience',
  'Technical Skills',
  # 'Certifications And Training',
  # 'Projects & Contributions',
  # 'Speaking & Training',
  'Publications And Writing',
  # 'Education',
  # 'Community Engagement'
]
series = [
  'Azure in Practice',
  # 'Azure DevOps in Practice',
  # 'Infrastructure as Code Essentials',
  # 'IaC Essentials',
  'Optimizing Cloud Deployments',
  # 'Building & Deploying .NET Apps',
  # 'GitHub & DevOps',
  'Performance And Scaling in the Cloud',
  # 'Advent of Code Solutions',
  # 'Hugo Website Development',
  # 'PowerShell for DevOps',
  # 'Workshops & Training'
]

layout = 'single'
audio = false
[params]
    cover = true
    author = 'sujith'

description = "Explore Azure load balancing options and optimize traffic distribution for scalable, high-performance, and highly available cloud applications."

+++

## **What is Load Balancing?**  

Load balancing is the **even distribution of network traffic** across a group of backend computing resources or servers. The primary goals of load balancing are:  

✅ **Optimizing resource utilization**  
✅ **Maximizing throughput & performance**  
✅ **Minimizing response time**  
✅ **Ensuring high availability**  
✅ **Preventing overload on a single resource**  

In **Azure**, there are multiple load-balancing options, each designed for different **traffic types and use cases**.  

---

## **TL;DR (2025 Update)**  

| Goal | Pick | Why | Layer / Scope |
|------|------|-----|---------------|
| Global HTTP(S) acceleration + WAF | Front Door Std/Premium | Anycast edge, caching, rapid failover | L7 / Global |
| Global single anycast IP for TCP/UDP | Cross-region Load Balancer | L4 pass-through, fast failover (no DNS TTL) | L4 / Global |
| Hybrid or external endpoint steering | Traffic Manager | DNS-based latency / geo / weighted policies | DNS / Global |
| In-region advanced HTTP routing + per-app WAF | Application Gateway v2 | Path/host routing, rewrites, mTLS | L7 / Regional |
| Regional TCP/UDP balancing + outbound SNAT | Standard Load Balancer | High-perf, zone redundant | L4 / Regional |
| Insert firewall / IDS transparently | Gateway Load Balancer | Inline NVA chaining without UDR complexity | L3/L4 / Regional |
| Legacy Basic LB still present | Migrate to Standard | Basic retires 30 Sept 2025[^basic-retire] | — |

Plan outbound explicitly before default outbound access retirement (30 Sept 2025)[^default-outbound]. Combine services (e.g. Front Door + App Gateway) for layered designs.  

---

## **🔍 Azure Load Balancing Options (2025 Update)**  

The Azure portfolio has evolved since this article was first published. Notable changes:  

* Basic Load Balancer retires **30 Sept 2025** (no new Basic deployments after **31 Mar 2025**).  
* Standard Load Balancer now supports a **cross-region (global) tier**.  
* **Gateway Load Balancer** enables transparent NVA insertion.  
* Azure Front Door has **Standard** and **Premium** tiers (Classic is legacy).  

| **Service** | **Scope** | **Recommended For** | **Classification** |  
|-------------|-----------|---------------------|-------------------|  
| **Standard Load Balancer** | Regional & Global (cross-region) | Non-HTTP(S) TCP/UDP, high-performance L4, outbound SNAT | Layer 4 (data plane) |  
| **Traffic Manager** | Global (DNS) | Latency / geo / weighted / priority routing; hybrid endpoints | DNS-based traffic steering (not an inline proxy) |  
| **Application Gateway (v2)** | Regional | Advanced HTTP(S) app delivery, WAF, mTLS, rewrites | Layer 7 proxy |  
| **Azure Front Door (Std/Premium)** | Global | Global web apps & APIs, acceleration, WAF, rules engine | Layer 7 anycast edge |  
| **Gateway Load Balancer** | Regional (inline) | Transparent insertion of NVAs (firewall, IDS/IPS, DPI) | Layer 3/4 service chaining |  
| **(Legacy) Basic Load Balancer** | Regional | Legacy workloads only (migrate) | Retiring 30 Sept 2025 |  

{{< image src="img/load-balancing-decision-tree.png" alt="Load Balancing Decision Tree" caption="Load Balancing Decision Tree" >}}

Now, let’s explore each of these services in detail.  

---

## **🌍 Azure Load Balancer (Standard)**  

{{< image src="img/azure-load-balancer.png" alt="Azure Load Balancer" caption="Azure Load Balancer" >}}

**Standard Azure Load Balancer** is a **Layer 4 (TCP/UDP)** load-balancing service designed for **high-performance and ultra-low-latency traffic**. It distributes inbound and outbound flows and is zone redundant. A **cross-region (global) Load Balancer** SKU[^cross-region] lets you expose a **single anycast IP** fronting multiple regional Standard Load Balancers for active-active or fast failover scenarios.  

> **Retirement Notice:** **Basic Load Balancer** retires on **30 Sept 2025**[^basic-retire]. Migrate to **Standard** for: security by default (closed unless NSG permits), higher scale, zone redundancy, SLA (99.99%), HA ports, and global tier integration.  

### **Types of Azure Load Balancers**  

| **Type** | **Purpose** |  
|----------|------------|  
| **Public Load Balancer** | Distributes **internet-facing** traffic across VMs in a VNet. |  
| **Internal Load Balancer** | Distributes **private network traffic** within Azure. |  

{{< image src="img/alb-public-internal.png" alt="ALB Public vs Internal" caption="ALB Public vs Internal" >}}

### **Availability Zone Configurations**  

| **Mode** | **Behavior** |  
|---------|------------|  
| **Zone Redundant** | Uses a single IP, surviving zone failures. |  
| **Zonal** | Restricts traffic to a specific zone. |  

{{< image src="img/alb-zone-redundant.png" alt="ALB Zone Redundant" caption="ALB Zone Redundant" >}}  

### **Standard vs. (Retiring) Basic Load Balancer**  

| **Feature** | **Standard** | **Basic (Legacy)** |  
|-------------|--------------|--------------------|  
| Backend pool size | Up to 1000 instances | 300 instances |  
| Health probes | TCP, HTTP, HTTPS | TCP, HTTP |  
| Security posture | Closed by default (NSG allow required) | Open to internet by default |  
| HA Ports (all ports) | ✅ Supported | ❌ Not supported |  
| Zonal / Zone redundant | ✅ Yes | ❌ No |  
| Cross-region (global tier) | ✅ Yes | ❌ No |  
| SLA | 99.99% (≥2 healthy instances) | None |  
| Retirement status | Active | Retires 30 Sept 2025 |  

> **Action:** Audit for any Basic SKUs (including Basic Public IP) and plan upgrade before the retirement cutoff[^basic-retire].  

### **Cross-region (Global) Load Balancer**  

Provides a globally anycast IPv4 frontend distributing traffic to a backend pool of **regional public Standard Load Balancers**. Use it when you need:  

* Fast failover without DNS TTL delays (contrast with Traffic Manager).  
* A single global IP for multi-region L4 workloads (TCP/UDP).  
* Simpler active-active pattern for stateful protocols (hash-based distribution per flow).  

Not a replacement for Front Door (no HTTP features) nor Traffic Manager (which can include non-Azure endpoints & complex routing policies).  

### **Outbound Connectivity (Retirement Note)**  

Default outbound access for VMs retires **30 Sept 2025**[^default-outbound]. Plan explicit outbound via:  

1. **NAT Gateway**  
2. **Standard Load Balancer outbound rules (frontend IPs)**  
3. **Instance-level public IP** (least preferred for fleets)  

> Prefer NAT Gateway for high SNAT scale; LB outbound fits when you already require inbound load balancing.  


---

## **🌐 Azure Traffic Manager (DNS-based Routing)**  

{{< image src="img/azure-traffic-manager.png" alt="Azure Traffic Manager" caption="Azure Traffic Manager" >}}  

**Traffic Manager** is a **DNS-based global traffic steering service**[^options]. It **does not proxy or terminate connections**; it returns the best endpoint (based on the chosen routing method) to the client resolver. Because of DNS caching, failover is influenced by TTL and client resolver behaviour.  

### **How It Works**  

1️⃣ A client requests a domain (e.g., `app.contoso.com`).  
2️⃣ The DNS system redirects to `contoso.trafficmanager.net`.  
3️⃣ Traffic Manager selects a backend using **health checks & routing rules**.  
4️⃣ The client receives the IP of the closest, available backend and connects directly.  

{{< image src="img/tm-setup.png" alt="Azure Traffic Manager Setup" caption="Azure Traffic Manager Setup" >}}  

### **Routing Methods**  

| **Routing Method** | **Use Case** |  
|------------------|-------------|  
| **Priority** | Primary backend with failover options. |  
| **Weighted** | Distribute traffic based on weights. |  
| **Performance** | Route traffic to the closest backend. |  
| **Geographic** | Route traffic based on user location. |  
| **MultiValue** | Return multiple healthy endpoints. |  
| **Subnet** | Route based on user IP ranges. |  

{{< image src="img/tm-weighted.png" alt="Traffic Manager Routing" caption="Traffic Manager Routing" >}}  

**Traffic Manager is ideal for:**  
✔️ **Latency-based routing** where DNS steering is sufficient  
✔️ **Hybrid / external endpoints** (on-prem, other clouds)  
✔️ **Controlled weighted canary rollouts**  
✔️ **Geographic compliance routing** (data sovereignty)  

---

## **🔹 Azure Application Gateway (v2)**  

{{< image src="img/azure-application-gateway.png" alt="Azure Application Gateway" caption="Azure Application Gateway" >}}  

**Application Gateway** is a **Layer 7 load balancer** designed specifically for **HTTP(S) traffic**[^appgw]. It provides advanced **web traffic routing**, **SSL offloading**, and **Web Application Firewall (WAF) integration**.  

### **Key Features (v2 SKU)**  

✅ **Path- & host-based routing**  
✅ **Session affinity (cookie-based)**  
✅ **TLS termination & end-to-end TLS**  
✅ **Mutual TLS (client cert auth)**  
✅ **Web Application Firewall (WAF)** (Prevention / Detection modes)  
✅ **HTTP/2, WebSockets**  
✅ **Header & URL rewrite rules**  
✅ **Autoscaling & zone redundancy**  
✅ **Custom error pages & diagnostics (Access logs, Performance logs)**  

{{< image src="img/apg-general.png" alt="Application Gateway Flow" caption="Application Gateway Flow" >}}  

**Best for:**  
✔️ **Web applications** that require advanced traffic routing.  
✔️ **Security-conscious deployments** using **WAF protection**.  

---

## **🌎 Azure Front Door (Standard/Premium)**  

{{< image src="img/azure-front-door.png" alt="Azure Front Door" caption="Azure Front Door" >}}  

**Azure Front Door** is a **global anycast Layer 7 application delivery network**[^front-door] offering dynamic site acceleration, intelligent routing, and integrated security.  

### **Key Capabilities**  

✅ **Global HTTP(S) load balancing & fast failover**  
✅ **Dynamic & static content acceleration (edge POP caching)**  
✅ **Rules Engine (headers, redirects, rewrites)**  
✅ **Custom domains & managed certificates**  
✅ **Integrated WAF (Core Rule Set), DDoS edge protection**  
✅ **Private origin support (Premium) via Private Link**  
✅ **Advanced security features (Premium)**: Bot protection, more granular WAF features  
✅ **Near real-time health probes & rapid failover (vs DNS TTL delays)**  

💡 **Front Door vs. Traffic Manager:**  

* **Front Door**: Inline HTTP(S) proxy, real-time health & latency-based routing, edge caching, WAF.  
* **Traffic Manager**: DNS answer steering only; no caching, TLS, or header logic; supports non-HTTP endpoints & external origins.  

**Best for:**  
✔️ **Global applications** that need low latency.  
✔️ **Web APIs** requiring intelligent traffic routing.  

---

## **🌍 Global vs. Regional & Layer Considerations**  

| **Service** | **Scope** | **Primary Layer / Mode** | **Typical Use Case** |  
|-------------|-----------|--------------------------|----------------------|  
| Cross-region (Global) Load Balancer | Global | L4 TCP/UDP pass-through | Single global IP for multi-region backend L4 workloads |  
| Standard Load Balancer (Regional) | Regional | L4 TCP/UDP | Intra-region distribution & outbound SNAT |  
| Azure Front Door (Std/Premium) | Global | L7 HTTP(S) proxy | Global web/API acceleration & security |  
| Traffic Manager | Global (DNS) | DNS steering | Latency / geo / weighted routing incl. external endpoints |  
| Application Gateway (v2) | Regional | L7 HTTP(S) proxy | Regional web app delivery & WAF with VNet integration |  
| Gateway Load Balancer | Regional (inline) | Service chaining (L3/L4) | Transparent NVA insertion (firewall, IDS/IPS) |  

### **Selection Cheat Sheet**  

| **Scenario** | **Recommended** | **Notes** |  
|--------------|-----------------|----------|  
| Global low-latency web/API + caching + WAF | Front Door Premium | Add App Gateway if per-app internal segmentation needed |  
| Multi-region L4 (non-HTTP) with single IP | Cross-region Load Balancer | Backend pool = regional Standard LBs |  
| DNS-based hybrid (on-prem & Azure) | Traffic Manager | Combine with Front Door or regional LBs |  
| In-region advanced routing & WAF | Application Gateway | Can sit behind Front Door |  
| Insert firewall / NVA transparently | Gateway Load Balancer (+ Standard LB) | Chaining simplifies flow symmetry |  
| Legacy Basic LB deployment | Migrate to Standard LB | Plan before retirement date |  

### **Common Combinations**  

* **Front Door + Application Gateway**: Global entry + regional path-based routing & WAF policies separation.  
* **Front Door + Standard Load Balancer**: Global HTTP(S) to edge; regional L4 services or container ingress.  
* **Cross-region Load Balancer + Traffic Manager**: Rare—Traffic Manager as external fallback or hybrid integration.  
* **Gateway Load Balancer + Standard Public LB + Front Door**: Full chain: edge (FD) → security NVA (GLB) → application tier.  
* **Traffic Manager + Front Door**: Layered control for regulatory geo mapping with Front Door acceleration.  

---

## **📌 Final Thoughts**  

Azure offers **multiple load balancing solutions**, each designed for specific **traffic types, regions, and use cases**. Whether you're **building a global web application** or **optimizing regional traffic**, choosing the **right service** is key to maximizing **performance, availability, and security**.  

💡 **Summary (2025):**  
✔️ **Use Front Door (Std/Premium)** for **global HTTP(S) acceleration & security**.  
✔️ **Use Cross-region Load Balancer** for **global L4 with a single anycast IP**.  
✔️ **Use Traffic Manager** for **DNS-based steering & hybrid endpoints**.  
✔️ **Use Application Gateway (v2)** for **regional L7 with WAF & rewrites**.  
✔️ **Use Standard Load Balancer** for **regional L4 + outbound SNAT**.  
✔️ **Use Gateway Load Balancer** to **insert NVAs transparently**.  
✔️ **Migrate any Basic SKUs** before **30 Sept 2025**.  

---

[^basic-retire]: Azure Basic Load Balancer retirement announcement: [Official notice](https://azure.microsoft.com/updates/azure-basic-load-balancer-will-be-retired-on-30-september-2025-upgrade-to-standard-load-balancer)  
[^cross-region]: Cross-region (Global) Load Balancer overview: [Docs](https://learn.microsoft.com/azure/load-balancer/cross-region-overview)  
[^default-outbound]: Default outbound access retirement: [Announcement](https://azure.microsoft.com/updates/default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access)  
[^front-door]: Azure Front Door overview: [Docs](https://learn.microsoft.com/azure/frontdoor/front-door-overview)  
[^appgw]: Azure Application Gateway overview: [Docs](https://learn.microsoft.com/azure/application-gateway/overview)  
[^options]: Load balancing options & architecture guidance: [Docs](https://learn.microsoft.com/azure/architecture/guide/technology-choices/load-balancing-overview)  
