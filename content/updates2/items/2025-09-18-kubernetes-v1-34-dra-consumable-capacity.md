---
title: "k8s: Kubernetes v1.34: DRA Consumable Capacity"
date: 2025-09-18T18:30:00.000Z
slug: kubernetes-v1-34-dra-consumable-capacity
update_categories: ["k8s"]
update_tags: ["Kubernetes", "DRA", "DRAConsumableCapacity", "device-sharing", "ResourceClaim", "ResourceSlice", "scheduler", "feature-gate", "DistinctAttribute", "ShareID", "KEP-5075", "alpha"]
update_bullets: ["What it does: allows drivers to publish consumable capacity on devices so portions of a device (memory, bandwidth, etc.) can be allocated to multiple consumers without exceeding device total capacity.", "Scope: alpha feature DRAConsumableCapacity in v1.34; must enable the feature gate in kube-apiserver, kube-controller-manager, kube-scheduler and kubelet.", "Driver changes: set allowMultipleAllocations = true on Device/ResourceSlice to permit multiple allocations; define DeviceCapacity.requestPolicy to restrict min/step/valid ranges per allocation.", "Allocation metadata: each shared allocation receives a ShareID in claim.Status.Allocation.Devices.Results[i].ShareID so drivers can track and enforce limits per consumer.", "Scheduler: extended to account for consumable device capacity so sum of all allocations never exceeds device capacity, similar to node allocatable resources.", "DistinctAttribute constraint: new constraint complementary to MatchAttribute that prevents the same underlying device being allocated multiple times within a single ResourceClaim.", "Consumer usage: request consumable capacity in a ResourceClaim by specifying capacity.requests (e.g., memory: 10Gi); use selectors to require devices that support multiple allocations.", "Device status: when DRAResourceClaimDeviceStatus is enabled, drivers can populate status.devices (e.g., assigned IPs for virtual networks) to help operations and troubleshooting.", "Examples and integrations: see ResourceSlice and ResourceClaim examples in the post; CNI DRA Driver is recommended for network integrations (macvlan, ipvlan, smart NICs).", "Next steps: enable the feature gate to experiment, file issues referencing KEP-5075 for feedback, and try consumable capacity with virtualized/partitionable devices and bandwidth- or memory-aware workloads."]
timeframes: ["2025-09"]
link: "https://kubernetes.io/blog/2025/09/18/kubernetes-v1-34-dra-consumable-capacity/"
source: "Kubernetes Official Blog"
timeframeKey: "2025-09"
id: "89EBC1B51D2FB6A9EDFCC818EC0D002BBC6759FDDED78EDDF474E3B0568DBEB5"
contentHash: "FAA3EAC9D2E6DCA87E281BF2720520D8BE7B06AC6FF580C3797FB20BADDF6393"
draft: false
type: "updates2"
llmSummary: "Kubernetes v1.34 introduces the alpha feature DRAConsumableCapacity for Dynamic Resource Allocation (DRA). It enables finer-grained, consumable device capacity so multiple ResourceClaims or DeviceRequests (even across namespaces) can share portions of a device. The scheduler enforces total consumable capacity, drivers can opt into multiple allocations and define request policies, and a ShareID in allocation status distinguishes individual shared slices. The feature requires enabling a feature gate on control plane and kubelet components and complements other DRA improvements like partitionable devices and device status."
---

Kubernetes v1.34 introduces the alpha feature DRAConsumableCapacity for Dynamic Resource Allocation (DRA). It enables finer-grained, consumable device capacity so multiple ResourceClaims or DeviceRequests (even across namespaces) can share portions of a device. The scheduler enforces total consumable capacity, drivers can opt into multiple allocations and define request policies, and a ShareID in allocation status distinguishes individual shared slices. The feature requires enabling a feature gate on control plane and kubelet components and complements other DRA improvements like partitionable devices and device status.

- **Source:** [Kubernetes Official Blog](https://kubernetes.io/blog/2025/09/18/kubernetes-v1-34-dra-consumable-capacity/)
