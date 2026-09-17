# Worrel S. Lee Jr. Portfolio

A responsive, content-managed professional portfolio built for GitHub Pages. The site presents applied coursework as professional case studies, keeps professional DFPS research in a clearly separate section, and uses Pages CMS for browser-based editing and uploads.

## Browser-based editing

After the repository is published, connect it to [Pages CMS](https://app.pagescms.org/). The included `.pages.yml` file creates structured editing screens for projects, research, publications, resume details, profile text, contact details, images, and downloadable documents.

See [EDITOR-GUIDE.md](EDITOR-GUIDE.md) for the complete connection and editing workflow.

## Pages

- `index.html`: Home and selected work
- `about.html`: Professional profile and working approach
- `projects.html`: Applied projects and coursework case studies
- `research.html`: Professional research and publication placeholder
- `resume.html`: Web resume with verified-content placeholders
- `contact.html`: Role interests and contact placeholders
- `404.html`: GitHub Pages error page
- `content/`: Editable site content used by the public pages
- `uploads/`: CMS-managed screenshots, images, documents, and source files
- `.pages.yml`: Pages CMS editor configuration

## Before publishing

Use Pages CMS to replace intentionally bracketed placeholders only with verified, public information.

Priority updates:

1. Add a professional email, LinkedIn URL, and GitHub URL.
2. Replace the headshot placeholder with an optimized image and meaningful alt text.
3. Add verified education and professional experience details.
4. Confirm the DFPS publication status, approved abstract, authorship, citation, and public-release language.
5. Add approved Project Helios and analytics case study visuals, methods, findings, and repository links.
6. Review every source file for confidential, proprietary, personal, or restricted information before publishing it.

## Publish with GitHub Pages

1. Create a GitHub repository. For a personal root site, name it `yourusername.github.io`. A normal repository name also works as a project site.
2. Upload the contents of this folder to the repository root.
3. Commit the files to the `main` branch.
4. In the repository, open **Settings**, then **Pages**.
5. Under **Build and deployment**, choose **GitHub Actions** as the source.
6. The included workflow will publish the site after each push to `main`.

The site uses relative links, so it works at both `yourusername.github.io` and `yourusername.github.io/repository-name/`.

## Local preview

The deployed site requires no package installation or build process. For a local preview, use a simple local web server or a tool such as the VS Code Live Server extension so the browser can load the editable JSON content. Opening `index.html` directly still shows the built-in fallback content, but it may not reflect recent content-file edits.

## Technical editing

- Global styles: `assets/styles.css`
- Navigation, project filters, reveal motion, and footer year: `assets/site.js`
- CMS content rendering: `assets/content.js`
- Favicon: `assets/favicon.svg`

Keep navigation and footer links consistent when adding pages. Optimize images before committing them so the site stays fast and the repository remains compact.

## Privacy and accessibility

- Do not publish confidential DFPS data or findings without written approval.
- Keep the exact research language aligned with the approved publication.
- Add descriptive alternative text for every meaningful screenshot or chart.
- Check color contrast and keyboard navigation after any design change.
- Avoid placing private phone numbers, home addresses, or restricted files in a public repository.
