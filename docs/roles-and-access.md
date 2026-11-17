# Roles and access

Everyone who works on p99soft.com gets their own CMS account with one role. The role decides what they can see, change and publish. The CMS enforces this, so nobody can do more than their role allows by accident.

Give each person the smallest role that lets them do their job.

## The six roles

| Role | Who gets it | Can | Cannot |
|---|---|---|---|
| **Super Admin** | Two people at most: the website owner and one engineer | Everything, including users, roles, API tokens, webhooks and settings | Nothing is blocked. Use this account for admin work only, not daily editing. |
| **Marketing Manager** | Head of marketing | Create, edit, publish and delete all site content. Change site-wide settings and the home page. Read leads. | Manage users, roles or system settings |
| **Content Editor** | Content lead, senior editors | Write and publish insights and pages. Edit and publish services, industries, the home page and index pages. Upload media. | Delete services or industries. Change site-wide settings. See leads. |
| **Content Writer** | Writers, freelancers, subject experts | Draft new insights and pages. See and edit only their own drafts. Upload images. | Publish anything. See other people's drafts. See leads. |
| **SEO Specialist** | SEO lead or agency | Read all content. Edit only the SEO fields on every page. Upload share images. | Change page copy. Publish. See leads. |
| **Analyst** | Marketing analyst, leadership | Read all content and all leads | Change or publish anything |

Strapi also ships with roles called **Editor** and **Author**. We do not use them. Assign the roles above instead.

## Who can do what

C = create, R = read, U = update, D = delete, P = publish

| Content | Marketing Manager | Content Editor | Content Writer | SEO Specialist | Analyst |
|---|---|---|---|---|---|
| Global (site name, email, offices) | C R U D | R | none | R, SEO not applicable | R |
| Home page | C R U D P | R U P | none | R, U SEO fields | R |
| Services | C R U D P | R U P | none | R, U SEO fields | R |
| Industries | C R U D P | R U P | none | R, U SEO fields | R |
| Insights (articles) | C R U D P | C R U D P | C, R U own drafts | R, U SEO fields | R |
| Pages (page builder) | C R U D P | C R U D P | C, R U own drafts | R, U SEO fields | R |
| Contact and index pages | C R U D P | R U, and P for the contact page | none | R, U SEO fields | R |
| Leads (contact form) | R | none | none | none | R |
| Media library | Full | Full | Upload and read | Full | Read |

"SEO fields" means: meta title, meta description, share image, share image alt text, noindex and canonical override. If an SEO Specialist tries to change anything else, the CMS ignores the change.

## How work moves between roles

1. A **Content Writer** drafts an insight or page and tells an editor it is ready.
2. A **Content Editor** reviews it, fixes the copy and asks the SEO Specialist to check it.
3. The **SEO Specialist** sets the meta title, description and share image. Their changes are saved as a draft.
4. The **Content Editor** or **Marketing Manager** publishes. The site updates within seconds.

Small fixes such as typos do not need the full loop. An editor can fix and publish directly.

## Add a person

Only a Super Admin can do this.

1. In the CMS, open **Settings**, then **Administration panel**, then **Users**.
2. Click **Invite new user**. Enter their name and work email.
3. Pick one role from the table above. Do not pick Super Admin unless they are replacing an admin.
4. Copy the invite link and send it to them. The link expires, so they should use it the same day.
5. They open the link and set their own password.

## Remove a person

Do this on their last working day.

1. Open **Settings**, then **Administration panel**, then **Users**.
2. Open their account and switch **Active** off. Deactivate rather than delete, so their name stays on the content they wrote.
3. If they were a Super Admin, rotate the API token and webhook secret. The steps are in the root README.

## Rules

- **Leads hold personal data.** Names, emails and messages from the contact form are visible only to Super Admins, Marketing Managers and Analysts. Do not export leads to personal devices or share them outside the company.
- **One person, one account.** Never share logins. The CMS records who changed what, and shared accounts break that record.
- **Review access every quarter.** A Super Admin checks the user list and removes anyone who left or changed jobs.

## Changing what a role can do

The roles are defined in code, in `apps/cms/scripts/seed.js` under `rolePermissions`. The seed script applies them every time it runs.

- To change a role permanently, edit `seed.js`, commit the change and run `npm --prefix apps/cms run seed`.
- You can also change a role in **Settings**, **Administration panel**, **Roles**. Be aware that the next seed run overwrites changes made there.
- Running the seed also resets the starter content. On a live site, ask an engineer to run only the role step, or make the change in the CMS and copy it into `seed.js`.

## Traffic and analytics

The CMS holds content, not traffic data. Analysts read traffic in Google Analytics 4 and search performance in Google Search Console, once marketing sets them up for the new site. The new sitemap is at `https://p99soft.com/sitemap.xml`. Submit it in Search Console on launch day.
