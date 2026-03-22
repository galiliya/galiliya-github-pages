# Blog Redesign Design

**Project:** `galiliya-github-pages`
**Date:** 2026-03-22

## Goal

Turn the current minimal GitHub Pages / Jekyll site into a credible engineer-facing personal site for interviews: a mixed personal brand + blog homepage with a restrained tone, stronger visual design, and clear signals around AI agents, RAG, full-stack delivery, and frontend quality.

## Positioning

The site should present the owner as an engineer with real implementation ability, not as a student blog and not as an over-polished “guru” landing page.

Core impression to create within the first 10-20 seconds:

1. This person has shipped real work, not just tutorial exercises.
2. This person understands AI-native product directions such as agents and RAG.
3. This person has enough frontend taste and full-stack awareness to build usable products.

Tone constraints:

- Do not oversell.
- Do not claim seniority or unrealistic scale.
- Let projects, structure, and article framing do most of the persuasion.

## Audience

Primary audience:

- Interviewers
- Hiring managers
- Technical reviewers

Secondary audience:

- Other engineers
- Recruiters

The site should optimize for skim-read clarity first, then reward deeper reading.

## Site Strategy

Use a **hybrid homepage**:

- Top of page: personal brand and engineering direction
- Middle: selected projects that establish credibility
- Lower section: article topics that show technical judgment and depth

This keeps the site useful both as a portfolio-like interview page and as a technical blog.

## Visual Direction

### Style

Use a **light, high-end technical aesthetic**:

- light base background
- subtle gradients and grid / line motifs
- strong typography hierarchy
- clean spacing and deliberate section rhythm
- restrained accent color, likely blue-green / teal / cool slate

### What to avoid

- dark cyberpunk neon look
- excessive glassmorphism
- loud self-promotion
- generic template-blog appearance
- default markdown-page look

### Desired impression

The site should feel like a modern AI/product engineer’s homepage: clean, sharp, current, and intentionally designed.

## Information Architecture

### Primary navigation

Keep nav small and clear:

- Home
- Projects
- Writing
- About

### Homepage sections

#### 1. Hero

Purpose:

- establish role and direction immediately
- give a professional first impression
- offer fast navigation to projects and writing

Content shape:

- name / identity
- concise engineer headline
- short paragraph focused on AI-native apps, agent workflows, RAG, and full-stack delivery
- 3-4 restrained capability tags
- CTA links to projects and writing

Example positioning language:

- AI-native full-stack engineer
- Building practical agent workflows, retrieval-augmented systems, and product-facing web experiences

This should be adapted to sound credible, not inflated.

#### 2. Selected Projects

Purpose:

- prove ability through work instead of adjectives

Project cards should emphasize:

- the kind of product/system built
- the engineering focus
- the stack and delivery shape
- a short “why this matters” angle

Content source:

- based on resume projects
- lightly enhanced for clarity and interview relevance
- no fabricated scale claims

Recommended card framing:

- title
- one-sentence product summary
- 2-3 engineering focus bullets
- stack tags

Example focus areas to highlight across cards:

- AI workflow orchestration
- RAG / retrieval and answer flow
- frontend interaction design for AI products
- API integration and full-stack delivery
- admin/dashboard or content/data workflow support

#### 3. Writing / Technical Essays

Purpose:

- show judgment, taste, and depth
- make interviewers curious enough to click

Article titles should not read like beginner tutorials. They should feel like engineering essays or technical notes with a point of view.

Planned direction:

- agents and workflow reliability
- RAG quality and retrieval tradeoffs
- frontend patterns for AI products
- productization and engineering tradeoffs
- full-stack implementation lessons

Example title style:

- RAG’s Real Difficulty Is Reliability, Not API Access
- From Prompt to Workflow: Why Agent Systems Need Engineering Boundaries
- AI Product Frontends Are Not Just Chat Boxes
- Shipping AI Features Means Designing Around Uncertainty

#### 4. Capability Surface

Purpose:

- summarize strengths without turning into a resume dump

Organize by capability clusters, not giant tool lists:

- AI Agents
- RAG / Retrieval
- Full-Stack Delivery
- Frontend Engineering

Each cluster should be explained in one short sentence, focused on what can be built rather than buzzwords alone.

#### 5. About / Contact

Purpose:

- close the page with a grounded self-description
- provide contact and GitHub links

About copy should position the owner as:

- an engineer with close to one year of practical development experience
- interested in AI application implementation
- able to connect frontend, backend integration, and product-facing delivery

## Content Rules

### Projects

- Use resume projects as the base.
- Add engineering framing, not fantasy scale.
- Make each project feel plausible and implementation-oriented.

### Writing

- Use technically credible placeholder article titles and summaries.
- Favor depth, tradeoffs, and engineering perspective.
- Avoid generic “10 tips” blog content.

### Tone

- concise
- confident but restrained
- technical
- readable by non-specialist interviewers

## Technical Approach

Current repo is a minimal Jekyll / GitHub Pages site.

Recommended implementation approach:

- keep GitHub Pages compatibility
- use standard Jekyll structure
- replace the current invalid / placeholder config and markdown-first homepage setup with a custom layout approach
- add dedicated layout and stylesheet files
- add supporting content pages for Projects, Writing, and About

Likely file areas:

- `_config.yml`
- `_layouts/`
- `assets/css/`
- `index.md` or `index.html`
- `about.md`
- `projects.md`
- `writing.md`

## UX Requirements

- fully responsive on mobile and desktop
- strong first-screen hierarchy
- fast visual scan for recruiters/interviewers
- no dead links
- readable text widths
- distinct sections with clear scroll rhythm

## Risk Management

Main risks:

- sounding overhyped
- making project content feel obviously invented
- over-designing the page and reducing trust

Mitigation:

- keep claims modest
- use concrete engineering language
- prioritize clarity over visual gimmicks

## Success Criteria

The redesign is successful if:

1. The page looks intentionally designed and modern.
2. A reviewer can quickly understand the owner’s technical direction.
3. Projects and articles make the owner feel like a credible early-career engineer.
4. AI agent / RAG / full-stack ability is visible without sounding forced.
5. The site remains simple to maintain on GitHub Pages.
