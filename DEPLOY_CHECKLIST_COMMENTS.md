# Deploy Checklist: KOKODA — Comment Feature (Azure App Service)

**Date:** 2026-06-20 | **Deployer:** steven | **Target:** Azure App Service (PHP 8 / Nginx + Reverb)

> Goal: guarantee that posting a comment works, comment history loads, and (ideally)
> comments appear in real-time after deploying to Azure.

---

## How comments work (two independent paths)

1. **Data path (must-have):** Browser → `POST /posts/{id}/comments` → MySQL, and
   `GET /api/posts/{id}/comments` → history. This now works **regardless of Reverb**
   because the broadcast call in `CommentController` is wrapped in `try/catch`. A comment
   is saved and returned `201` even if the websocket server is unreachable.

2. **Realtime path (nice-to-have):** PHP publishes the new comment to the local Reverb
   server, which pushes it over websockets to other open browsers. This path needs the
   **server-side Reverb settings** to be correct (see below). If it fails, other users
   still see the comment on their next open/refresh.

---

## Pre-Deploy

- [ ] `CommentController@store` and `@destroy` wrap `broadcast(...)` in `try/catch` (already applied)
- [ ] Frontend assets rebuilt with production VITE vars: `npm run build`
      (VITE_REVERB_* are baked at build time — a stale build points the client at the wrong host)
- [ ] All PRs merged into the deploy branch; no known critical bugs
- [ ] `comments` and `jobs` migrations present (confirmed: `2025_01_01_000006_create_comments_table.php`, `0001_01_01_000002_create_jobs_table.php`)
- [ ] Rollback plan: redeploy previous build artifact; comments table is additive (no destructive migration)

### Azure Application Settings to verify (Portal → Configuration → Application settings)

These **override** the repo `.env` after `startup.sh` runs `config:cache`.

| Setting | Value | Why |
|---|---|---|
| `BROADCAST_CONNECTION` | `reverb` | Enable broadcasting |
| `QUEUE_CONNECTION` | `database` | Broadcasts go to the queue worker (started by `startup.sh`) so a failed publish never blocks the HTTP request. (`sync` also works now thanks to the try/catch, but blocks the request on failure.) |
| `REVERB_HOST` | `127.0.0.1` | **Server-side publish target.** Must point at the local Reverb, NOT `localhost:8080` from the dev `.env`. |
| `REVERB_PORT` | `6001` | Matches `reverb:start --port=6001` in `startup.sh` |
| `REVERB_SCHEME` | `http` | **Critical:** Reverb on 6001 speaks plain HTTP. `https` here makes PHP attempt TLS against a non-TLS port and the publish fails. |
| `REVERB_APP_ID` / `REVERB_APP_KEY` / `REVERB_APP_SECRET` | (your values) | Must be identical on server and the values baked into the frontend build |
| `VITE_REVERB_APP_KEY` | = `REVERB_APP_KEY` | Frontend auth key (build-time) |
| `VITE_REVERB_HOST` | `<app>.azurewebsites.net` | Frontend websocket host (build-time) |
| `VITE_REVERB_PORT` | `443` | wss via Nginx (build-time) |
| `VITE_REVERB_SCHEME` | `https` | Frontend uses wss on HTTPS (build-time) |

> Note: `REVERB_SCHEME` (server publish) and `VITE_REVERB_SCHEME` (browser) are **separate**.
> The browser always uses `wss`/443 on an HTTPS page; the server publishes over plain
> `http` to `127.0.0.1:6001`. They do not conflict.

- [ ] Azure → Configuration → General settings: **Web sockets = On**, **Always On = On**
- [ ] Startup Command = `/home/site/wwwroot/startup.sh`

---

## Deploy

- [ ] Push build artifact / trigger the GitHub Actions deploy
- [ ] After container start, confirm `startup.sh` ran: Reverb + queue worker alive
      (Portal → SSH/Log stream: `ps aux | grep -E 'reverb|queue'`)
- [ ] `php artisan migrate --force` ran (comments/jobs tables exist in Azure MySQL)

### Smoke tests (the actual proof comments work)

- [ ] **Post a comment** on any post while logged in → returns `201`, comment appears immediately
- [ ] **Refresh the page** → the comment is still there (persisted in MySQL)
- [ ] **History:** open the same post as a *different* user → previous comments are visible
- [ ] **Realtime:** open one post in two browsers → comment sent in A appears in B without refresh
- [ ] **Delete:** author (or post owner) deletes a comment → disappears, and stays gone after refresh
- [ ] Browser console: websocket connects to `wss://<app>.azurewebsites.net/app/<key>` (no repeated connection errors)

---

## Post-Deploy

- [ ] `storage/logs/laravel.log`: only `Comment broadcast failed (non-fatal)` warnings at most — no 500s on `/posts/*/comments`
- [ ] Confirm error rate / latency on `/posts/*/comments` is nominal for 15 min
- [ ] Update changelog: "Comment posting hardened against Reverb outage; works on Azure"
- [ ] Close the related ticket

---

## Rollback Triggers

- `POST /posts/{id}/comments` returns 5xx (comments cannot be sent)
- `GET /api/posts/{id}/comments` returns 5xx (history cannot load)
- Comment data not persisting after refresh (DB/migration problem)

If only the **realtime** path is broken (comments post + reload fine, but don't appear live),
this is **not** a rollback trigger — fix the Reverb Application Settings above and restart the
app; the data path keeps working in the meantime.
