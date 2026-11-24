# Mohamed Badran - Multi-Disciplinary Engineer Portfolio

Personal portfolio website highlighting expertise across Industrial Engineering & 3D Design, IT Infrastructure, Project & Event Leadership, Software/AI/Data Science, Robotics & Embedded Systems, Robotics Competitions & Judging, STEAM Education, and Creative Design.

**Live Demo:** [mbadran0109.vercel.app](https://mbadran0109.vercel.app)

## Architecture

A fast, zero-build-step static site hosted on **Vercel**:

- `index.html` — Main landing page (hero, resumes, education timeline, services grid, contact form).
- `styles.index.css` — Unified stylesheet with CSS variables, responsive layouts, and reusable components.
- `scripts.shared.js` — Single-source-of-truth config and behavior:
  - Hydrates shared `<header data-component="nav">`, `<nav data-component="service-switcher">`, `<section data-component="contact">`, and `<footer data-component="footer">` across all pages.
  - Handles accessible mobile menu, homepage scrollspy, scroll-reveal animations, collapsible cards, media gallery lightbox, and EmailJS v4 contact submissions (with honeypot & `mailto:` fallback).
- `services/<slug>/index.html` — Dedicated service pages with per-service `images/` folders.
- `images/` — Optimized branding & portrait assets.
- `robots.txt` & `sitemap.xml` — Search engine indexing metadata.

## Adding New Content

### Project Showcase Card
```html
<section id="projects">
  <h2 class="section-title">Projects</h2>
  <div class="projects-grid">
    <article class="card project-card">
      <div class="project-media">
        <img src="images/project-thumb.jpg" alt="Project screenshot" loading="lazy">
        <span class="project-badge">Featured</span>
      </div>
      <div class="project-content">
        <h3>Project Title</h3>
        <div class="project-meta">2026 &middot; Role</div>
        <p>Short summary of the problem solved and measurable outcome.</p>
        <div class="tag-container">
          <span class="skill-tag">Python</span>
          <span class="skill-tag">SolidWorks</span>
        </div>
        <div class="project-links">
          <a href="#" class="btn btn-sm" target="_blank" rel="noopener noreferrer">Live Demo</a>
          <a href="#" class="btn btn-outline btn-sm" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </article>
  </div>
</section>
```

### Certification Card
```html
<section id="certifications">
  <h2 class="section-title">Certifications &amp; Courses</h2>
  <div class="certs-grid">
    <article class="card cert-card">
      <h3>Certification Name</h3>
      <p class="cert-issuer">Issuing Organization</p>
      <p class="cert-date">Issued May 2026</p>
      <a href="#" class="cert-link" target="_blank" rel="noopener noreferrer">View Credential &rarr;</a>
    </article>
  </div>
</section>
```

### Media Gallery (Auto-Wired Lightbox)
```html
<section id="gallery">
  <h2 class="section-title">Gallery</h2>
  <div class="gallery-grid">
    <figure class="gallery-item">
      <img src="images/photo-1.jpg" alt="Workshop photo" loading="lazy">
      <figcaption class="gallery-caption">Caption shown below thumbnail and in lightbox.</figcaption>
    </figure>
  </div>
</section>
```

---

*Designed and developed by Mohamed Badran © 2026.*
