# Publishing guide

How to add and change content on p99soft.com. No code needed. Everything happens in the CMS at `/admin`.

What you can do depends on your role. See [roles-and-access.md](roles-and-access.md).

## How the site is built

Every page on the site comes from one place in the CMS.

| In the CMS | What it controls | Page on the site |
|---|---|---|
| **Home page** | Every section of the home page | `/` |
| **Service** (7 entries) | One page per service. Also feeds the menu, footer and the home page services section. | `/services/<slug>` |
| **Industry** (5 entries) | One page per industry. Also feeds the menu and the home page industry tiles. | `/industries/<slug>` |
| **Insight** | Articles | `/insights/<slug>` |
| **Page** | Any other page: About, landing pages, events, legal pages | `/<slug>` |
| **Services page, Industries page, Insights page** | Title, intro and SEO of the list pages | `/services`, `/industries`, `/insights` |
| **Contact page** | Title, intro and topic list on the contact form | `/contact` |
| **Global** | Company name, contact email, offices, main button, social links | Header and footer everywhere |
| **Lead** | Messages from the contact form (read only) | Not public |

The menu, footer and sitemap update by themselves. Add a service and it appears in the menu, footer, home page and sitemap with no extra work.

## Draft and publish

Every change is saved as a **draft** first. Visitors see nothing until someone clicks **Publish**.

- **Save** keeps your work as a draft.
- **Publish** puts it live. The site updates in about 5 seconds.
- **Unpublish** takes a page off the site without deleting it.

Edits to a page that is already live are also drafts until you publish again. The live version stays as it was until then.

## Publish an insight

1. Open **Content Manager**, then **Insight**, then **Create new entry**.
2. Fill in:
   - **Title**: the headline. Write the point, not a teaser. Under 90 characters reads best.
   - **Slug**: generated from the title. Shorten it to 3 to 6 words, for example `why-ai-pilots-stall`. Do not change it after publishing, because the old link will break.
   - **Excerpt**: one or two sentences. It appears on the insights list and in search results.
   - **Body**: the article, in Markdown. Use `##` for section headings. Bold with `**text**`. Lists with `-` or `1.`.
   - **Author**, **Read minutes** (about 200 words per minute) and **Published date**.
   - **Tags**: a list, for example `["Generative AI", "AI testing"]`.
   - **SEO**: see the checklist below.
3. Click **Save**. Writers stop here and tell an editor.
4. An editor reviews and clicks **Publish**.

The newest three insights appear on the home page automatically.

## Create a new page with the page builder

Use this for the About page, campaign landing pages, event pages and legal pages.

1. Open **Content Manager**, then **Page**, then **Create new entry**.
2. Enter a **Title** and check the **Slug**. The page will live at `p99soft.com/<slug>`.
3. Under **Blocks**, click **Add a component to blocks** and choose a block. Add as many as you need. Drag to reorder.
4. Fill in **SEO**, then **Save** and **Publish**.

Start the page with a **Hero** block. If you do not, the page uses its title as the main heading.

### The blocks

| Block | Use it for | Tips |
|---|---|---|
| **Hero** | The top of the page: main heading, one line under it, up to two buttons | One per page, always first. The heading carries the point of the page. |
| **Rich text** | Paragraphs, lists, sub-headings | Markdown. Keep paragraphs to 3 or 4 sentences. |
| **Feature grid** | 2 to 6 items with a short title and description each: values, benefits, offices | Items show in two columns. Even numbers look best. |
| **Stats** | 2 or 3 numbers with a label | Only numbers we can prove. Value short (`40+`), label plain. |
| **Quote** | One client or leader quote | Real quotes only, with the person's approval. |
| **FAQ** | Questions and answers | Each item: the question in the title field, the answer in the body. Google can show these in search results. |
| **Image** | A full-width image with caption | Alt text is required. Upload at least 1600 px wide. |
| **Call to action** | A dark band with a heading and one button, usually at the end | Button text says what happens: "Talk to us", "Download the report". |

### Slugs you cannot use

These belong to built-in parts of the site. A page with one of these slugs will not show: `services`, `industries`, `insights`, `contact`, `api`, `og`.

## Edit services, industries and the home page

- **Services and industries**: open the entry, change the text and publish. Keep each list short. Three outcomes and four capabilities read better than ten.
- **Order of services**: services are ordered by their **Code** field (L0 to L6). Visitors never see the code. To move a service, swap codes with another one.
- **Order of industries**: set by the **Order** field, lowest first. The first industry gets the large tile on the home page.
- **Home page "Not sure where to start?" section**: each item links to a service through **Service slug**. The slug must match a service exactly, for example `customer-relationship-management`. If it does not match, the item is hidden instead of showing a broken link.

## SEO checklist

Every entry has an **SEO** section. Fill it in before publishing.

| Field | Rule |
|---|---|
| **Meta title** | 50 to 70 characters. Main topic first, then `\| P99soft`. Every page needs a different title. |
| **Meta description** | 120 to 160 characters. Say what the reader gets from the page. Every page needs a different description. |
| **Share image** | Optional. If empty, the site creates a branded 1200 x 630 image from the title. Upload your own at 1200 x 630 if you have one. |
| **Share image alt** | Describe the image in a few words. |
| **No index** | Turn on only for pages that should stay out of Google, such as a thank-you page or a test page. |
| **Canonical override** | Leave empty. Only use it when the same content lives at two URLs. Start with `/`, for example `/insights/original-article`. |

The site handles the rest for you: canonical links, social tags, structured data (JSON-LD), sitemap and breadcrumbs.

## Writing rules

- **Write for the client.** Say what they get. Do not mention internal strategy, target segments, market plans or service codes.
- **Facts only.** No numbers, client names, logos or quotes unless they are true and approved for public use.
- **Plain words.** Short sentences. No buzzwords.
- **Headings say the point.** "Releases break less often", not "Quality matters".
- **Link text says where it goes.** "Salesforce and CRM in detail", not "click here".

## Images and files

- Upload through **Media Library**. Name files clearly, for example `retail-journey-map.png`.
- Every image needs alt text that describes it for someone who cannot see it.
- Use PNG or JPG under 1 MB. The site resizes images for each screen.
- Do not upload photos of people without their consent, or client logos without approval.

## Leads from the contact form

Every message from `/contact` is saved under **Content Manager**, then **Lead**. You can see the name, email, company, topic and message. Only Super Admins, Marketing Managers and Analysts can open leads.

## When something looks wrong

| Problem | What to do |
|---|---|
| I published, but the site still shows the old version | Wait 10 seconds and refresh. If it is still old, check that you clicked **Publish**, not only **Save**. Then ask an engineer to check the webhook. |
| My new page shows "page not found" | Check that it is published and that the slug is not on the reserved list. |
| A service or industry disappeared from the menu | Someone unpublished or deleted it. Check under **Content Manager**. |
| I cannot see the Publish button | Your role cannot publish. Ask an editor. |
| I cannot save: "metaTitle must be at most 70 characters" | Shorten the meta title. The limit keeps titles from being cut off in Google. |
| A home page item does not show | Check the **Service slug** spelling against the service's slug. |
