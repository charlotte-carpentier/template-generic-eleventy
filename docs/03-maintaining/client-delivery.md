---
title: Client Delivery
description: Legal framework, account setup, and handoff process for client projects
created: 2026-02-17
---

Standards for delivering HAT-based projects to clients: infrastructure setup, intellectual property, and access handoff.

---

## Intellectual Property

**HAT template** belongs to the developer (Charlie Carpentier) under the MIT license.  
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
| GitHub | Source code repository + CMS authentication (OAuth) — connect as repo collaborator |
| Netlify | Build and hosting |
| Google Analytics | Traffic tracking |
| Axeptio | Cookie consent |

This keeps infrastructure ownership clearly tied to the client's domain, not the developer's personal accounts.

---

## CMS Access

The CMS interface is Decap CMS, accessible at `/admin` on the deployed site. It uses the GitHub account created in Infrastructure Setup for authentication — no separate CMS account needed.

1. Deploy the site with Decap CMS configured on the `github` backend
2. At delivery, hand over the GitHub credentials with the other accounts
3. Client opens `/admin`, clicks "Sign in with GitHub", logs in with those credentials

The client edits content through `/admin` only. They have no direct access to the repository or hosting configuration.

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
