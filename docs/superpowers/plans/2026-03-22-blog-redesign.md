# Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the minimal GitHub Pages site into a polished interview-facing engineer homepage with a light technical aesthetic, project-led credibility, and article-led depth.

**Architecture:** Keep the site on plain Jekyll/GitHub Pages, replace the invalid config and markdown-only homepage with a small custom layout system, and store the homepage content as structured HTML/Markdown sections. Create lightweight secondary pages for Projects, Writing, and About so the navigation is real and maintainable.

**Tech Stack:** Jekyll, GitHub Pages, HTML, CSS, Markdown, Liquid

---

## File Structure

**Create:**
- `_layouts/default.html` — global page shell, navigation, footer, shared metadata
- `_layouts/home.html` — homepage layout for the branded landing page
- `assets/css/site.css` — full visual system, responsive layout, typography, sections, cards
- `about.md` — grounded engineer bio and contact page
- `projects.md` — expanded project page based on resume project framing
- `writing.md` — expanded article index page with technical essays/topics

**Modify:**
- `_config.yml` — replace invalid pseudo-markdown content with real Jekyll config
- `index.md` or `index.html` — replace current placeholder homepage with structured content using the new home layout
- `.gitignore` — add `.superpowers/` only if needed later for visual companion artifacts

**Optional cleanup, only if safe:**
- Leave `.github/steps` and tutorial workflow files untouched unless they directly interfere with deploy behavior

### Task 1: Repair Site Configuration

**Files:**
- Modify: `_config.yml`

- [ ] **Step 1: Read the current config and confirm invalid formatting remains**

Run: `sed -n '1,220p' /home/gali/project/galiliya-github-pages/_config.yml`
Expected: markdown prose and fenced code block instead of valid YAML

- [ ] **Step 2: Replace `_config.yml` with valid GitHub Pages-safe Jekyll config**

Include:
- title, description, url, baseurl
- markdown engine
- lang/timezone
- permalink strategy
- header/nav page list matching actual pages
- defaults for page layout where useful

- [ ] **Step 3: Re-read `_config.yml` to verify it is valid YAML text only**

Run: `sed -n '1,220p' /home/gali/project/galiliya-github-pages/_config.yml`
Expected: only YAML, no markdown headings or fences

- [ ] **Step 4: Commit config repair**

```bash
git add _config.yml
git commit -m "fix: replace invalid jekyll config"
```

### Task 2: Build the Shared Layout and Visual System

**Files:**
- Create: `_layouts/default.html`
- Create: `assets/css/site.css`

- [ ] **Step 1: Create the default layout shell**

Include:
- semantic HTML structure
- page title/meta description support
- site header with nav links
- footer with concise identity/contact links
- stylesheet inclusion

- [ ] **Step 2: Create the main stylesheet**

Include:
- CSS custom properties for light technical theme
- typography scale
- page container/grid rules
- card, button, label, and section styles
- hero, capability cluster, article list, and project card styles
- responsive mobile rules

- [ ] **Step 3: Verify layout and stylesheet files exist and are readable**

Run: `find /home/gali/project/galiliya-github-pages/_layouts /home/gali/project/galiliya-github-pages/assets/css -maxdepth 2 -type f | sort`
Expected: `default.html` and `site.css` are present

- [ ] **Step 4: Commit the base UI system**

```bash
git add _layouts/default.html assets/css/site.css
git commit -m "feat: add shared site layout and visual system"
```

### Task 3: Implement the Homepage Experience

**Files:**
- Create: `_layouts/home.html`
- Modify: `index.md` or replace with `index.html`

- [ ] **Step 1: Create a dedicated home layout**

Include homepage-specific structure for:
- hero
- selected projects
- writing section
- capability surface
- about/contact summary

- [ ] **Step 2: Replace the placeholder homepage content**

Write content that matches the approved spec:
- restrained engineer positioning
- AI agent / RAG / full-stack emphasis without hype
- project-first then article-depth narrative
- strong CTA to projects and writing

- [ ] **Step 3: Validate that homepage links only target real pages/anchors**

Run: `sed -n '1,260p' /home/gali/project/galiliya-github-pages/index.md`
Expected: no dead placeholder links to missing categories/posts

- [ ] **Step 4: Commit homepage implementation**

```bash
git add _layouts/home.html index.md
git commit -m "feat: redesign homepage for engineer portfolio blog"
```

### Task 4: Add Real Secondary Pages

**Files:**
- Create: `projects.md`
- Create: `writing.md`
- Create: `about.md`

- [ ] **Step 1: Create the projects page**

Include:
- 2-4 resume-based project entries
- engineering problem framing
- role/responsibility language
- stacks and outcomes framed credibly

- [ ] **Step 2: Create the writing page**

Include:
- article/essay list with short summaries
- technically thoughtful titles around agents, RAG, AI UX, and delivery tradeoffs

- [ ] **Step 3: Create the about page**

Include:
- concise engineer bio
- practical experience framing
- contact details and GitHub link

- [ ] **Step 4: Verify pages are in place**

Run: `find /home/gali/project/galiliya-github-pages -maxdepth 1 \( -name 'about.md' -o -name 'projects.md' -o -name 'writing.md' \) | sort`
Expected: all three pages listed

- [ ] **Step 5: Commit supporting pages**

```bash
git add about.md projects.md writing.md
git commit -m "feat: add projects writing and about pages"
```

### Task 5: Integration Pass and Verification

**Files:**
- Modify as needed: `_config.yml`, `_layouts/*.html`, `assets/css/site.css`, `index.md`, `about.md`, `projects.md`, `writing.md`

- [ ] **Step 1: Run a repository status check**

Run: `git -C /home/gali/project/galiliya-github-pages status --short`
Expected: only intended site files changed

- [ ] **Step 2: If Jekyll is available, run a local build**

Run: `cd /home/gali/project/galiliya-github-pages && bundle exec jekyll build`
Expected: successful static build

If Bundler/Jekyll are unavailable, record that verification gap explicitly.

- [ ] **Step 3: Perform a final content/link sanity review**

Check:
- nav links work
- homepage sections read naturally
- project and article language is restrained but strong
- no placeholder student-blog copy remains

- [ ] **Step 4: Commit final polish**

```bash
git add _config.yml _layouts assets/css index.md about.md projects.md writing.md
git commit -m "feat: complete blog redesign for interview-facing engineer profile"
```
