---
title: Client Delivery
description: Legal framework, account setup, and handoff process for client projects
created: 2026-02-17
---

Standards for delivering HAT-based projects to clients: infrastructure setup, intellectual property, and access handoff.

---

## Intellectual Property

**HAT template** belongs to the developer under the MIT license.  
Reusing HAT across multiple client projects is legal and intentional.

**Delivered site** — the client receives an exploitation license, not ownership of the underlying template.

Include this clause in every contract:

> *The developer retains all intellectual property rights over the HAT template and its components (Code de la Propriété Intellectuelle, art. L111-1). The client receives a non-exclusive, unlimited, worldwide exploitation license for the delivered site. This license does not include the right to resell or commercially exploit the underlying template.*

French law default (without contract): the developer keeps all rights. The client only has a usage right limited to the original order. Always formalize this in writing.

---

## Infrastructure Setup

Create one technical email address per client project: `technique@client-domain.fr`

Use this address to create and own all service accounts:

| Service | Purpose |
| --- | --- |
| GitHub | Source code repository |
| Netlify | Build and hosting |
| DecapBridge | CMS authentication |
| Google Analytics | Traffic tracking |
| Axeptio | Cookie consent |

This keeps infrastructure ownership clearly tied to the client's domain, not the developer's personal accounts.

---

## CMS Access

Client CMS access is handled separately from infrastructure accounts.

1. Create all service accounts with `technique@client-domain.fr`
2. Deploy the site
3. Invite the client's **personal email** in DecapBridge
4. Client receives an email invite, creates their password, accesses the CMS
5. Client never needs a GitHub or Netlify account

The client edits content through the CMS only. They have no direct access to the repository or hosting configuration.

---

## Developer Maintenance Access

Keep read/write access to GitHub and Netlify after delivery for maintenance.

Include this clause in the contract:

> *The developer retains technical access to the GitHub repository and Netlify project for maintenance purposes. The client may revoke this access at any time by written notice. Any technical modification made by the client or a third party outside a contracted service releases the developer from all responsibility for site functionality.*

---

## Handoff Checklist

At delivery, provide the client with a credentials document containing:

- [ ] Technical email address + temporary password (ask client to change immediately)
- [ ] GitHub repository URL
- [ ] Netlify project URL + dashboard link
- [ ] DecapBridge login URL
- [ ] Analytics access
- [ ] Axeptio access
- [ ] DNS configuration (registrar login if managed)
- [ ] Instructions: change all passwords on first login

Deliver this document securely (not by plain email — use a password manager share or encrypted PDF).

---

## Contract Checklist

Minimum clauses to include in every client contract:

- [ ] HAT template IP belongs to developer, exploitation license granted to client
- [ ] Site ownership transfers to client upon full payment
- [ ] Developer maintenance access clause (revocable by client)
- [ ] Liability release for third-party modifications
- [ ] Password change responsibility on client side

---

May your bugs be forever exiled to the shadow realm ✦  
HAT · 2026
