# Portfolio Editor Guide

This portfolio uses Pages CMS as its editing dashboard. Pages CMS changes the content files in GitHub, and the included GitHub Pages workflow publishes those changes automatically.

## Connect the editor after the repository is on GitHub

1. Visit [app.pagescms.org](https://app.pagescms.org/).
2. Choose **Sign in with GitHub**.
3. Install the Pages CMS GitHub App when prompted.
4. Give it access only to the portfolio repository.
5. Open the portfolio repository in Pages CMS.
6. Confirm that the editor shows these sections:
   - Profile and About
   - Projects and Case Studies
   - Professional Research
   - Resume
   - Contact and Role Interests

The `.pages.yml` file in the repository defines those editing screens. No additional CMS configuration should be necessary.

## Add a project

1. Open **Projects and Case Studies**.
2. Add an item to the list.
3. Enter a unique URL identifier using lowercase letters, numbers, and hyphens, such as `customer-segmentation`.
4. Choose the correct category and work classification.
5. Add the summary, tools, methods, and work demonstrated.
6. Upload screenshots under **Screenshots and visuals**.
7. Upload approved PDFs, spreadsheets, code archives, or other public files under **Downloadable documents**.
8. Turn on **Show on website**.
9. Turn on **Feature on homepage** only when the project should appear on the home page.
10. Save the entry.

## Add a publication

1. Open **Professional Research**.
2. Under **Publications and presentations**, add an item.
3. Enter the approved title, citation, and abstract.
4. Add a DOI or public HTTPS link when available.
5. Upload an approved public PDF if permitted.
6. Save the file.

## Update the resume

Use the **Resume** section to maintain the professional summary, skills, experience, education, location, and downloadable resume PDF. Bracketed placeholder text can be removed as verified information becomes available.

## Update contact information

Use **Contact and Role Interests** to add the professional email address, LinkedIn URL, GitHub URL, availability message, and roles of interest. Use full `https://` URLs for LinkedIn and GitHub.

## Publishing behavior

Each save creates a GitHub commit. The GitHub Pages workflow runs automatically after the commit reaches the `main` branch. A normal update may take a few minutes to appear on the public site.

## Privacy checklist

Before uploading a file, confirm that it:

- is approved for public release;
- contains no confidential DFPS data or findings;
- contains no private identifiers or protected information;
- contains no restricted employer, school, or client material;
- has meaningful labels and accessible descriptions where applicable; and
- is reasonably sized for a public website and Git repository.

Anything stored in this public repository should be treated as publicly accessible, even if it is not linked from a visible page.
