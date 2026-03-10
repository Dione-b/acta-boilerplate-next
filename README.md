# GIVE-Interactuar Platform

> Stellar-first verifiable credentials platform for entrepreneurs.

A fullstack platform built on **Next.js 16 (App Router)**, **Supabase**, and **Soroban** to issue, manage, and verify institutional credentials backed by the Stellar blockchain through the `vc-vault` smart contract.

---

## Overview

GIVE-Interactuar enables organizations to:

1. **Ingest** entrepreneur data from Google Forms via automated sync jobs.
2. **Normalize & consolidate** raw submissions into domain entities with historical snapshots.
3. **Issue verifiable credentials** on-chain using the Soroban `vc-vault` contract.
4. **Link endorsement credentials** to primary credentials for multi-party verification.
5. **Track vault operations** including sponsored vaults, VC pushes between vaults, and revocations.
6. **Provide a public verification portal** for third-party credential checks.

---

## Tech Stack

| Layer                  | Technology                              |
| ---------------------- | --------------------------------------- |
| **Framework**          | Next.js 16 (App Router)                 |
| **Language**           | TypeScript (strict mode)                |
| **Styling**            | TailwindCSS v4                          |
| **Database & Auth**    | Supabase (PostgreSQL + Auth + Storage)  |
| **Validation**         | Zod                                     |
| **Forms**              | React Hook Form + `@hookform/resolvers` |
| **Data Fetching**      | TanStack Query                          |
| **Blockchain**         | Stellar SDK + Soroban                   |
| **Wallet Integration** | Stellar Wallets Kit                     |
| **Credential SDK**     | `@acta-team/acta-sdk`                   |

---

## Architecture

The project follows a **feature-based architecture** with strict separation of concerns:

```
src/
├── features/                  # Domain modules
│   ├── entrepreneurs/         # Entrepreneur profiles & snapshots
│   ├── forms-sync/            # Google Forms ingestion pipeline
│   ├── credentials/           # Credential issuance & management
│   ├── stellar/               # Stellar/Soroban integration layer
│   ├── wallets/               # Stellar wallet management
│   ├── vaults/                # vc-vault contract interaction
│   ├── organizations/         # Multi-org support
│   ├── verification/          # Public verification portal
│   └── dashboard/             # Dashboard overview
├── components/                # Shared UI components
│   ├── ui/                    # Buttons, badges, etc.
│   └── layout/                # Dashboard layout, sidebar
└── lib/                       # Infrastructure & shared services
    ├── supabase/              # Browser, server & middleware clients
    ├── constants/             # Routes, Stellar network config
    ├── helpers/               # Date formatting, utilities
    ├── services/              # External API clients (Google Forms)
    └── orchestrator/          # Cross-feature coordination
```

### Layer Responsibilities

| Layer                   | Responsibility               | Rules                                                     |
| ----------------------- | ---------------------------- | --------------------------------------------------------- |
| **Repositories**        | Supabase queries             | Only layer that touches the DB client                     |
| **Services**            | Business logic orchestration | No UI side effects                                        |
| **Hooks**               | TanStack Query wrappers      | Single source of server state on the client               |
| **Components (pages/)** | Page composition             | No direct logic — compose feature components              |
| **Components (ui/)**    | Reusable UI elements         | Stateless, presentational                                 |
| **Orchestrator**        | Cross-domain coordination    | Only place that mixes Supabase + Stellar in issuance flow |

---

## Routes

| Route                           | Description                                          |
| ------------------------------- | ---------------------------------------------------- |
| `/dashboard`                    | Overview with stats                                  |
| `/dashboard/entrepreneurs`      | Entrepreneur list                                    |
| `/dashboard/entrepreneurs/[id]` | Entrepreneur detail + wallet info                    |
| `/dashboard/credentials`        | Credential list                                      |
| `/dashboard/credentials/new`    | Issue new credential (autofill from latest snapshot) |
| `/dashboard/credentials/[id]`   | Credential detail + on-chain status                  |
| `/dashboard/wallets`            | Stellar wallet management                            |
| `/dashboard/vaults`             | Vault management (create, sponsor, revoke)           |
| `/verify/[credentialId]`        | Public credential verification                       |
| `/api/cron/forms-sync`          | Cron endpoint for Google Forms sync                  |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (package manager)
- **Docker** (for Supabase local dev)
- **Supabase CLI** (`npm i -g supabase`)

### Installation

```bash
# Clone the repository
git clone git@github.com:Dione-b/acta-boilerplate-next.git
cd acta-boilerplate-next

# Install dependencies
pnpm install

# Copy environment variables
cp .env.local.example .env.local
# Edit .env.local with your values
```

### Local Development

```bash
# Start Supabase local (Docker)
supabase start

# Reset database (applies all migrations + seed data)
supabase db reset

# Start Next.js dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Supabase Workflow

```bash
# Apply pending migrations without data loss
supabase migration up

# Create a new migration after schema changes
supabase migration new <descriptive_name>

# Regenerate TypeScript types from local schema
supabase gen types typescript --local > src/lib/supabase/database.types.ts

# Open Supabase Studio
# http://localhost:54323

# Stop Supabase
supabase stop
```

---

## Environment Variables

Create a `.env.local` file based on `.env.local.example`:

| Variable                        | Scope       | Description                           |
| ------------------------------- | ----------- | ------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Client      | Supabase project URL                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client      | Supabase anonymous key                |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server only | Supabase service role key             |
| `SUPABASE_DB_PASSWORD`          | Server only | Direct DB connection password         |
| `GOOGLE_FORMS_API_KEY`          | Server only | Google Forms API key                  |
| `GOOGLE_FORMS_FORM_ID`          | Server only | Target form ID                        |
| `STELLAR_NETWORK`               | Shared      | `testnet` \| `mainnet` \| `futurenet` |
| `VC_VAULT_CONTRACT_ID`          | Shared      | Deployed vc-vault contract address    |
| `ISSUER_STELLAR_SECRET`         | Server only | Issuer secret key for signing txns    |
| `CRON_SECRET`                   | Server only | Auth token for cron endpoint          |

> ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` or `ISSUER_STELLAR_SECRET` to the browser.

---

## Data Flow

```
Google Forms
    ↓ (cron job sync)
Raw Submissions (evidence)
    ↓ (normalization)
Entrepreneur Profile Snapshots
    ↓ (consolidation)
Entrepreneur Consolidated Profile
    ↓ (dashboard autofill)
Issuance Draft
    ↓ (credential issuance)
Soroban vc-vault issue()
    ↓ (on-chain reference persistence)
Credential Record + OnChainReference
    ↓ (endorsement linkage)
CredentialRelationship
    ↓
Public Verification Portal
```

---

## On-Chain Integration (vc-vault)

The platform integrates with the Soroban `vc-vault` contract for credential lifecycle management:

| Operation         | Contract Method                                   | Description                  |
| ----------------- | ------------------------------------------------- | ---------------------------- |
| Create vault      | `create_vault(owner, did_uri)`                    | Self-sovereign vault         |
| Sponsored vault   | `create_sponsored_vault(sponsor, owner, did_uri)` | Organization-sponsored vault |
| Issue credential  | `issue(owner, vc_id, vc_data, ...)`               | Mint a verifiable credential |
| Revoke credential | `revoke(owner, vc_id, date)`                      | Revoke a specific VC         |
| Revoke vault      | `revoke_vault(owner)`                             | Disable all vault writes     |
| Transfer VC       | `push(from, to, vc_id, issuer)`                   | Move VC between vaults       |
| Verify            | `verify_vc(owner, vc_id)`                         | Check VC status              |
| Read              | `get_vc(owner, vc_id)`                            | Retrieve VC data             |

Each on-chain operation persists references in the database: `onchain_vc_id`, `onchain_owner_address`, `onchain_issuance_contract`, `onchain_contract_id`, `onchain_tx_hash`, `onchain_ledger_sequence`, `onchain_network`.

---

## Project Conventions

- **Imports**: Always use the `@/` path alias.
- **Supabase access**: Only through `repositories` — never from components or hooks directly.
- **On-chain logic**: Isolated in `features/stellar/` — never mixed with React components.
- **Validation**: Zod schemas for all external inputs.
- **Data fetching**: TanStack Query for client-side cache — server actions for mutations.
- **Components**: Small, focused. Page components only compose — no inline logic.
- **TODOs**: Actionable, not generic. Each TODO describes exactly what to implement.

---

## Contributing

1. Always create migrations for schema changes — never edit applied migrations.
2. Regenerate `database.types.ts` after any schema change.
3. Keep the `seed.sql` with safe development data only (no PII).
4. Run `pnpm lint` and `npx tsc --noEmit` before pushing.

---

## License

Private — All rights reserved.
