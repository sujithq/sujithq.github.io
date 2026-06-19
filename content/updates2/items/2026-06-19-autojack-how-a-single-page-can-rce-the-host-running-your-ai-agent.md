---
title: "security: AutoJack: How a single page can RCE the host running your AI agent"
date: 2026-06-19T00:17:54.000Z
slug: autojack-how-a-single-page-can-rce-the-host-running-your-ai-agent
update_categories: ["security"]
update_tags: ["security", "vulnerability", "RCE", "AI agents", "localhost", "AutoGen Studio", "MCP", "Microsoft"]
update_bullets: ["A malicious page can turn an AI browsing agent into an RCE path on the host machine.", "The chain abuses trust in localhost, lack of authentication, and unsafe parameter handling.", "AutoGen Studio’s MCP WebSocket is identified as the execution path.", "The post warns that agents browsing untrusted content while accessing local services weaken the security assumption that localhost is trusted."]
timeframes: ["2026-06"]
link: "https://www.microsoft.com/en-us/security/blog/2026/06/18/autojack-single-page-rce-host-running-ai-agent/"
source: "Microsoft Security Blog"
timeframeKey: "2026-06"
id: "0AA346942EF6DF32937F320176DD6802515266238F32FC89FF4F895D3A37CBD8"
contentHash: "15CEFE31339DEA70D9B05809FA4DF9BC8B458FC1115DF7797480C34713EFDCBD"
draft: false
type: "updates2"
llmSummary: "Microsoft describes AutoJack, an exploit chain where a single malicious webpage can cause remote code execution on the host running an AI browsing agent. The attack abuses localhost trust, missing authentication, and unsafe parameter handling in AutoGen Studio’s MCP WebSocket."
---

Microsoft describes AutoJack, an exploit chain where a single malicious webpage can cause remote code execution on the host running an AI browsing agent. The attack abuses localhost trust, missing authentication, and unsafe parameter handling in AutoGen Studio’s MCP WebSocket.

- **Source:** [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/06/18/autojack-single-page-rce-host-running-ai-agent/)
