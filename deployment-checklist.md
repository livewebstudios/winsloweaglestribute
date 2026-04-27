# WINSLOW EAGLES TRIBUTE — DECAP CMS DEPLOYMENT CHECKLIST
## Live Web Studios | winsloweaglestribute.com

---

## PRE-PUSH PREP (do this before touching Git)

- [ ] **1. Populate real seed content**
  - Replace the placeholder show in `_tour/2026-05-15-starland-ballroom.md` with real upcoming dates (or delete it and add real ones)
  - Update `_media/01-hotel-california.md` — replace `REPLACE_WITH_REAL_ID` with actual YouTube video IDs
  - Update `_testimonials/maria-gonzalez.md` with a real testimonial
  - Update `_content/settings.json` with Steve's real booking email, phone, and social URLs
  - Rebuild `_tour/index.json`, `_media/index.json`, `_testimonials/index.json` to match (GitHub Action will maintain these after first push — you just need them correct for day one)

- [ ] **2. Update existing HTML pages**
  - Open `identity-snippet.html` and follow the instructions inside
  - Add Netlify Identity widget script to `<head>` of all 5 root pages
  - Add redirect handler script before `</body>` of all 5 root pages
  - Add renderer `<script>` tags to each page (see identity-snippet.html for the full map)
  - Replace hardcoded tour cards, video embeds, testimonial blocks, band bios, and photo strip items with the appropriate container `<div id="...">` elements
  - Add `data-setting` attributes to footer/booking contact elements (see settings-renderer.js header comments)

- [ ] **3. Confirm `images/uploads/` folder exists** in the repo root (Decap writes uploaded images here)
  - Create it with a `.gitkeep` file if it doesn't exist: `touch images/uploads/.gitkeep`

---

## GITHUB PUSH

- [ ] **4. Commit and push everything to main**
  ```bash
  git add .
  git commit -m "Add Decap CMS layer — admin, renderers, seed content"
  git push
  ```

- [ ] **5. Confirm GitHub Action ran successfully**
  - Go to github.com/livewebstudios/winsloweaglestribute → Actions tab
  - Verify "Build CMS Indexes" workflow shows a green checkmark
  - If it failed: check that `scripts/build-indexes.js` and `.github/workflows/build-indexes.yml` are committed

---

## NETLIFY SETUP

- [ ] **6. Enable Netlify Identity**
  - Netlify dashboard → Site: winsloweaglestribute → Identity tab
  - Click **Enable Identity**
  - Under Registration: set to **Invite only** (CRITICAL — do not leave open)

- [ ] **7. Enable Git Gateway**
  - Still on the Identity tab → scroll to **Services → Git Gateway**
  - Click **Enable Git Gateway**
  - ⚠️ **PRIVATE REPO WARNING:** Git Gateway will return a 404 if the GitHub repo is private.
    Go to github.com/livewebstudios/winsloweaglestribute → Settings → Danger Zone → **Change visibility to Public**.
    The repo contains no secrets — it's static HTML + markdown. Public is fine.
    If you must keep it private, you'll need a personal access token workflow instead of Git Gateway.

- [ ] **8. Trigger a Netlify deploy** (if not auto-triggered by the push)
  - Deploys tab → Trigger deploy → Deploy site

---

## INVITE STEVE

- [ ] **9. Send Steve his invite**
  - Netlify → Identity tab → **Invite users**
  - Enter Steve's email address
  - He'll receive a link — it expires in 24 hours
  - ⚠️ **CRITICAL:** The invite link redirects to your site's root to complete signup.
    The Netlify Identity widget script MUST already be live on `index.html` before Steve clicks the link.
    If it's not there, the invite flow will fail silently.

- [ ] **10. Tell Steve what to expect**
  - He'll get an email with a "Complete your signup" link
  - Clicking it lands him on winsloweaglestribute.com — a popup appears to set his password
  - After that, his login URL is: **https://winsloweaglestribute.com/admin/**
  - Bookmark that URL for him

---

## KILL THE OLD FTP WORKFLOW

- [ ] **11. Deprecate shows.js**
  - Remove `<script src="js/shows.js"></script>` from all HTML pages
  - Delete `js/shows.js` from the repo (or keep it commented out for reference)
  - The `_tour/` collection + `tour-renderer.js` is now the single source of truth for tour dates

- [ ] **12. Revoke Steve's FileZilla access**
  - Log into WHM / cPanel for the KH VPS
  - Remove or disable Steve's FTP account credentials
  - Confirm he can no longer connect via FileZilla (test login)

---

## SANITY TEST (before handing off to Steve)

- [ ] **13. First-edit test**
  - Log into https://winsloweaglestribute.com/admin/ with your own Netlify Identity account
  - Add a test tour date — give it a future date, save
  - Verify the GitHub Action fires (Actions tab in GitHub — should show "Build CMS Indexes" running)
  - After Action completes, verify the new show appears on the tour page
  - Delete the test entry, verify it's gone

- [ ] **14. Check all renderer containers**
  - tour.html — shows render, sorted by date, future only
  - index.html — max 3 featured shows show in Upcoming section
  - media.html — videos render in order field sequence
  - booking.html — testimonials render
  - index.html — featured testimonial renders
  - about.html — band members render in alternating layout
  - Footer on all pages — booking email, phone, socials populated from settings.json
  - Photo strip on index.html — gallery items render and lightbox opens on click

- [ ] **15. IntersectionObserver check**
  - Scroll down on each page — all dynamically inserted cards should fade in
  - If any stay invisible (opacity: 0), check that `animations.js` exposes `window.LWS.observe(el)`
  - Emergency fallback: each renderer adds `.is-visible` directly if LWS.observe is not found

---

## HAND-OFF NOTES FOR STEVE

Give Steve these instructions (copy/paste into an email):

---
**Your CMS login:** https://winsloweaglestribute.com/admin/

**What you can do:**
- ✅ Add, edit, or delete Tour Dates
- ✅ Add Videos (paste a YouTube ID)
- ✅ Edit Testimonials
- ✅ Upload and caption Gallery Photos
- ✅ Edit Band Member Bios (rarely needed)
- ✅ Update Booking Email, Phone, Social Links

**What you cannot do (by design):**
- ❌ Move page sections around
- ❌ Edit the hero text, page intro copy, or layout
- ❌ Anything not listed above — those are Jon's territory

**How changes work:**
When you save something in the admin, it goes to GitHub. Within about 60 seconds, the site rebuilds automatically. You don't have to do anything else. Just save and refresh the live site after a minute.

**Forgot your password?** Use the "Forgot Password" link on the admin login screen.
---

---

## TIMING EXPECTATIONS

| Action | Delay to live |
|---|---|
| Tour date add/edit/delete | ~60 sec (GitHub Action + Netlify deploy) |
| Video add | ~60 sec |
| Testimonial change | ~60 sec |
| Gallery photo upload | ~60 sec |
| Band bio edit | ~60 sec |
| Settings change | ~60 sec |

*Note: Gallery, Band, and Settings are file collections — no GitHub Action needed. They deploy directly on Decap save.*

---

*Live Web Studios — Est. 2004 | livewebstudios.com*
