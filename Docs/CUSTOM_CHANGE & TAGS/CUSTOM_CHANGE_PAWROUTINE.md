# CUSTOM_CHANGE_PAWROUTINE

## Purpose
This file documents non-standard PawRoutine theme code changes that future you, or another developer, must understand before maintaining, troubleshooting, refactoring, or updating the theme.

## What to include
Log changes that:
- required editing or creating theme code files, and
- affect theme behavior, layout, interaction, or maintainability, and
- are not obvious from Shopify Admin alone, or could be affected by theme/app/code updates.

## What not to include
Do not log:
- normal Theme Editor settings changes
- routine copy/image/content changes
- basic Shopify Admin settings
- small visual adjustments that do not affect the underlying custom feature

## How to find custom code markers

Custom code inside theme files is marked using the following searchable tags:

- `CUSTOM START [ID]` - beginning of a modified native-code block
- `CUSTOM END [ID]`- end of a modified native-code block
- `CUSTOM FILE [ID]`- brand-new custom file created for a feature
- `CUSTOM [ID]` — short one-line custom note

To locate custom work quickly, search the theme codebase for:

- `CUSTOM`
- `CUSTOM START`
- `CUSTOM FILE`
- the specific change ID, for example `PR-001`

Each marker ID should match an entry in this file.

## Core rule for future changes
Once a code change has been logged, keep the original entry. If the change is later removed or adjusted, append a status update instead of deleting the entry.

---

## CHANGE LOG

---
---

### PawRoutine homepage product showcase (PR-004)

Status: Applied
Last updated: 25-06-2026

Trigger:

* Replaced the earlier generic homepage featured-product experiment with a visually locked custom homepage product showcase inspired by the desired Pupwell-style editorial product composition.

Context:

* This feature is a homepage section, not an individual product-page template.
* It is designed to sit below the PawRoutine split hero and showcase one selected Shopify product with a controlled gallery, editorial product story, and real purchase controls.
* The visual reference was the central desktop/mobile product-detail composition observed on Pupwell: vertical desktop thumbnails, a large portrait media stage, a generous right-side product-information column, and a mobile swipe gallery.
* This is a layout and interaction reference only. No Pupwell code, branding, assets, copy, or product data were reused.

Scope:

* `sections/pwr-showcase.liquid`
* `assets/pwr-showcase.css`
* `assets/pwr-showcase.js`

Change summary:

* Added a new custom homepage-only Shopify section named `Pwr product showcase`.

* Added a dedicated scoped stylesheet and JavaScript asset.

* Added a fixed desktop composition with:

  * a narrow vertical thumbnail rail on the left;
  * a large portrait-oriented active media area;
  * a right-side editorial product-information and purchase column;
  * desktop-only sticky media behaviour.

* Added a mobile composition with:

  * horizontal swipeable media slides;
  * intentionally visible neighbouring slides to indicate swipe behaviour;
  * dot pagination;
  * normal document scrolling rather than sticky media;
  * full-width mobile purchase controls.

* Added an in-gallery visible magnifier button.

* Added a custom accessible image dialog with close, previous, and next controls.

* Added Theme Editor controls for:

  * featured product;
  * colour scheme;
  * accent colour;
  * category/routine label and optional link;
  * short product promise;
  * show/hide selected product description;
  * benefits or included-items rich text;
  * shipping note;
  * Add to Cart label.

* Added live variant behaviour for:

  * selected variant ID;
  * price;
  * compare-at price;
  * saving amount;
  * availability;
  * Add to Cart state;
  * accelerated checkout visibility;
  * quantity rules;
  * selected variant featured media.

* Added real Shopify Add to Cart and accelerated checkout support using the selected product and Shopify product form.

Reasoning:

* The previous homepage featured-product attempt depended too heavily on Savor’s generic configurable featured-product structure, making it difficult to reproduce the intended fixed editorial composition.
* This replacement uses a deliberately constrained custom structure for the visual layout while preserving Shopify-native product-form and payment behaviour.
* The feature is isolated in three PawRoutine-specific files, avoiding changes to product-page templates, native gallery files, header files, cart files, global CSS, and shared theme JavaScript.

Important implementation details:

* `pwr-showcase.liquid` loads its assets through:

  ```liquid
  {{ 'pwr-showcase.css' | asset_url | stylesheet_tag }}
  <script src="{{ 'pwr-showcase.js' | asset_url }}" defer="defer"></script>
  ```

* Both assets must remain inside the `assets` directory and retain the same filenames unless the Liquid references are updated.

* The section is addable only on the homepage because its schema uses:

  ```json
  "enabled_on": {
    "templates": ["index"]
  }
  ```

* Homepage placement is managed through Shopify Theme Editor. Do not manually edit `templates/index.json` to add, remove, or reorder the section.

* The section requires a product to be selected in Theme Editor. If none is selected, it displays an editor-facing placeholder message.

* The section uses Shopify product media from the selected product. The first media item is prioritised for loading; later media items use lazy loading.

* The custom gallery supports selecting media through desktop thumbnails, mobile dots, swipe/scroll behaviour, and the magnifier dialog.

* The custom image dialog supports:

  * close button;
  * previous and next image buttons;
  * Escape-key close through the native HTML dialog element;
  * focus return to the trigger that opened it;
  * keyboard left/right navigation.

* The section uses Shopify’s native product form and dynamic payment button through:

  * `{% form 'product', product %}`
  * `product-form-component`
  * `add-to-cart-component`
  * `{{ form | payment_button }}`

* Do not replace the custom Add to Cart markup with a plain HTML form/button without retesting cart behaviour, availability states, and accelerated checkout.

* The section’s JavaScript contains the custom gallery, lightbox, variant-state, price, savings, availability, quantity, and selected-media logic. Keep all `data-pwr-*` attributes aligned with the script if markup changes are made.

* All styling is scoped beneath `.pwr-showcase` to prevent effects on other theme sections.

Dependencies / assumptions:

* The section depends on the current Horizon/Savor theme components and conventions, including:

  * `product-form-component`;
  * `add-to-cart-component`;
  * the native `button` and `button-secondary` styles;
  * theme colour-scheme variables;
  * `--color-background`;
  * `--color-foreground`;
  * `settings.add_to_cart_animation`;
  * native Shopify dynamic checkout support.

* The selected product should have several well-prepared portrait-oriented product images for the intended visual result.

* The best media format for this section is consistent 4:5 editorial campaign imagery.

* Variant-specific featured media is optional but recommended where variants have visibly different packaging, flavour, size, or colour.

* Products with no media show a generic placeholder.

* Non-image product media currently display their preview image in the custom gallery. Product videos and 3D models are not rendered as playable or interactive media within this section.

Risks / update sensitivity:

* If the theme changes or removes `product-form-component`, `add-to-cart-component`, their `ref` attributes, or their event handling, Add to Cart behaviour must be rechecked.

* If the theme changes the native `.button`, `.button-secondary`, colour-scheme variables, or form error styles, the purchase controls may need visual adjustment.

* If the structure or names of `data-pwr-*` attributes change, the custom JavaScript may stop syncing the gallery, variants, prices, quantity rules, or lightbox correctly.

* The mobile “peeking slides” layout depends on the dedicated scoped CSS and should be checked after changes to gallery dimensions or responsive breakpoints.

* Long product titles, very long descriptions, many variant options, or a large number of media files should be tested individually.

* Recheck the section after theme updates, major cart/product-form updates, Shopify dynamic-checkout changes, or JavaScript refactors.

* The custom lightbox does not include pinch-to-zoom or drag-to-zoom. Do not assume it has the same advanced image controls as the native Savor product-page lightbox.

Rollback / removal:

* Remove the `Pwr product showcase` instance through Shopify Theme Editor first.

* Confirm it is no longer present on the homepage.

* Remove these files only after confirming they are not referenced anywhere else:

  * `sections/pwr-showcase.liquid`
  * `assets/pwr-showcase.css`
  * `assets/pwr-showcase.js`

* Do not remove or modify native product-form, cart, product-page, header, or global theme files as part of removing this feature.

* If the previous `Pwr featured product` experiment still exists in the theme codebase but is no longer used, remove its old custom files only in a separate cleanup change after searching for references.

Verification checklist:

* Confirm `Pwr product showcase` appears in Homepage → Add section.
* Confirm it can be positioned below `Pwr split hero`.
* Confirm selecting a product loads its title, media, price, description, variants, and purchase controls.
* Confirm desktop displays the vertical thumbnail rail, portrait media stage, and right-side information column.
* Confirm desktop media remains sticky while the product-information column scrolls.
* Confirm thumbnails select the correct active media item.
* Confirm mobile shows a horizontally swipeable gallery, peeking neighbouring slides, and working dots.
* Confirm the magnifier button opens the image dialog.
* Confirm close, previous, next, Escape, and keyboard arrow controls work in the image dialog.
* Confirm changing variants updates the selected option label, variant ID, price, compare-at price, saving amount, Add to Cart availability, payment button visibility, and featured media where assigned.
* Confirm quantity controls respect the selected variant’s minimum, maximum, and increment rules.
* Confirm Add to Cart works and the cart updates normally.
* Confirm accelerated checkout appears only when the selected variant is available.
* Confirm no horizontal page scrolling appears on desktop or mobile.
* Confirm the native Header, PawRoutine marquee, split hero, collection sections, product pages, cart, and global theme styling remain unchanged.
* Confirm `shopify theme check` passes before future pushes.

Notes:

* Do not document ordinary Theme Editor content edits, selected products, individual images, product descriptions, product prices, routine copy, or colour-scheme choices as separate code changes.
* Treat the three showcase files as one feature.
* Add a status update rather than replacing this entry if the section is materially redesigned, removed, or adapted after a future theme update.

### PawRoutine split promo hero (PR-003)

Status: Applied
Last updated: 24-06-2026

Trigger:

* Planned homepage section rebuild inspired by the visual structure of Pupwell’s promotional hero layout.

Context:

* A new custom homepage promotional hero was created for PawRoutine.
* It is designed as a reusable split-layout campaign section rather than a replacement for the native theme Hero.
* The section currently sits below the existing native homepage Hero and above the Featured collection.
* The visual reference was Pupwell’s promotional split hero: editorial text on one side and a large arched image frame on the other.
* This is a layout reference only. No Pupwell code, assets, branding, or copy were reused.

Scope:

* `sections/pwr-hero.liquid`
* `assets/pwr-hero.css`

Change summary:

* Added a custom homepage-only Shopify section named `Pwr split hero`.
* Added a dedicated CSS asset for the section.
* Added a responsive split desktop layout with:

  * campaign text and optional CTA on one side;
  * a configurable media area on the other side;
  * selectable desktop media position;
  * a tall editorial arch image frame with a flat bottom edge;
  * desktop content aligned lower in its column.
* Added a mobile layout where text and CTA appear before the image.
* Added optional separate desktop and mobile image pickers.
* Added configurable heading, supporting text, button label, button link, colour scheme, desktop spacing, and mobile spacing.
* Added handling for missing images and incomplete CTA settings.
* The section uses no JavaScript, slider, animation, product binding, or hard-coded image URL.

Reasoning:

* The feature was built as an isolated custom section to reproduce the desired split promotional layout without editing the native Hero, shared layout files, global CSS, header, or marquee.
* Keeping the Liquid and CSS in dedicated PawRoutine files makes the feature easier to maintain, test, remove, or reuse for future campaigns.
* The section is intentionally placed below the existing native Hero during the current practice phase, so both layouts can remain available for comparison.

Important implementation details:

* `pwr-hero.liquid` loads its stylesheet through:

  ```liquid
  {{ 'pwr-hero.css' | asset_url | stylesheet_tag }}
  ```

* Because the stylesheet uses `asset_url`, `pwr-hero.css` must remain inside the `assets` directory.

* The custom section is addable through Shopify Theme Editor because it includes a section preset.

* The section is restricted to the homepage template through its schema configuration.

* Homepage ordering is managed through Shopify Theme Editor. Do not manually edit `templates/index.json` to add, remove, or reorder this section.

Image-frame behavior:

* The image frame uses `overflow: hidden`, top-only border radii, and `object-fit: cover`.
* The desktop image frame is intentionally taller than the original version to better match the desired editorial/Pupwell-style proportion.
* The desktop media frame currently uses a portrait-oriented aspect ratio and separate top-corner radius values.
* Adjusting the aspect ratio changes the section height because the media frame determines the height of the desktop grid row.
* Adjusting only the top border-radius values changes the apparent roundness of the arch without reducing the frame height.
* Use Shopify image focal points and appropriately composed source imagery to control important product or dog positioning within the crop.

Dependencies / assumptions:

* The section depends on Horizon theme CSS variables and utility conventions, including:

  * `--page-width`
  * `--wide-page-width`
  * `--page-margin`
  * theme colour-scheme variables
  * theme heading typography variables
  * the native `button` class styling
* The section assumes the current theme continues to provide these variables and button styles.
* The section depends on a selected desktop image for the full split-media design.
* If no mobile image is selected, the desktop image is reused on mobile.
* The button is intentionally hidden unless both the button label and button link are provided.

Risks / update sensitivity:

* If the theme changes or removes its page-width, colour, typography, or button CSS variables, the section should be visually rechecked.
* If the native theme significantly changes the meaning or styling of the `button` class, the CTA may need adjustment.
* If future changes rename either custom file, update the stylesheet reference inside `pwr-hero.liquid`.
* Wide source images can crop heavily in the tall desktop arch. Recheck the crop after changing campaign imagery.
* Keep all selectors inside `pwr-hero.css` scoped to `.pawroutine-split-promo-hero` to prevent visual effects on other homepage sections.

Rollback / removal:

* Remove the `Pwr split hero` instance through Shopify Theme Editor first.
* Confirm the section is no longer used in the homepage template.
* Remove `sections/pwr-hero.liquid` and `assets/pwr-hero.css` only after confirming there are no remaining references.
* Do not remove or modify the native Hero, header, marquee, or global CSS as part of removing this feature.

Verification checklist:

* Confirm the section appears in Homepage → Add section.
* Confirm it can be positioned below the native Hero and above Featured collection.
* Confirm desktop text/media layout works with media on both right and left.
* Confirm the image appears inside the top-rounded arch frame.
* Confirm the desktop frame remains tall and the top curve remains visually balanced.
* Confirm mobile displays text and CTA before the image.
* Confirm desktop-image fallback works when no mobile image is chosen.
* Confirm the CTA disappears when either its label or link is missing.
* Confirm no horizontal scrolling occurs on desktop or mobile.
* Confirm the native Hero, Header, PawRoutine marquee, Featured collection, and other homepage sections remain unchanged.
* Confirm `shopify theme check` passes before pushing future updates.

Notes:

* Do not log routine campaign copy, chosen images, Theme Editor placement changes, or ordinary colour-scheme selections as separate code changes.
* Add a status update only when this custom feature is materially changed, removed, replaced, or affected by a theme update.

### PawRoutine announcement marquee (PR-002)
Status: Applied
Last updated: 19-06-2026

Trigger:
- Planned customization

Context:
- A custom announcement marquee was created to display short promotional or brand messages in a moving announcement bar.
- This is separate from the simple announcement option inside the custom header.

Scope:
- `sections/pawroutine-announcement-marquee.liquid`
- `assets/pawroutine-announcement-marquee.css`

Change summary:
- Added a custom Liquid announcement marquee section with editable message blocks.
- Added configurable settings for enabling/disabling the marquee, accessibility label, scroll speed, spacing, typography, colors, and vertical padding.
- Added CSS-only horizontal scrolling animation for repeated announcement messages.
- Added accessibility handling so visual duplicate messages are hidden from assistive technology where needed.
- Added reduced-motion behavior so continuous scrolling is disabled for users who prefer reduced motion.

Reasoning:
- This approach keeps the promotional announcement behavior separate from the main custom header code.
- A dedicated marquee section is easier to adjust, remove, or reuse without touching the main header files.

Dependencies / assumptions:
- The marquee depends on at least one non-empty announcement block to display.
- The scrolling effect depends on the CSS animation and repeated message groups.
- The section assumes short announcement messages; very long text may need extra testing on small screens.
- Optional message links depend on correct Shopify URLs being selected or entered.

Risks / update sensitivity:
- If the marquee markup or CSS class names are changed, the scrolling animation may break.
- If linked messages are added, keyboard focus and accessibility behavior should be rechecked.
- If the store uses another announcement bar app or native announcement feature at the same time, duplicate announcement areas may appear.
- Recheck the marquee after theme updates, accessibility changes, or major header-area layout changes.

Rollback / removal:
- Remove the marquee section from the active theme layout/settings.
- Delete `sections/pawroutine-announcement-marquee.liquid` and `assets/pawroutine-announcement-marquee.css` only after confirming they are no longer referenced.
- Use the simpler announcement option in the custom header or the theme's native announcement feature if a marquee is no longer needed.

Verification checklist:
- Confirm the marquee appears only when enabled and when at least one message is filled in.
- Confirm announcement messages display correctly on desktop and mobile.
- Confirm the scrolling animation runs smoothly.
- Confirm hover/focus pauses the marquee where expected.
- Confirm reduced-motion mode disables continuous scrolling.
- Confirm optional links are clickable and keyboard-accessible.

Notes:
- Keep this entry separate from the custom header entry because the marquee can be adjusted or removed without changing the core header structure.


### PawRoutine custom header (PR-001)
Status: Applied
Last updated: 19-06-2026

Trigger:
- Planned customization

Context:
- A custom PawRoutine header was created to give the store a more brand-specific layout and interaction pattern than the default theme header.
- The change centralizes PawRoutine-specific header markup, styling, and mobile menu behavior into dedicated custom files.

Scope:
- `sections/pawroutine-custom-header.liquid`
- `assets/pawroutine-custom-header.css`
- `assets/pawroutine-custom-header.js`
- `snippets/pawroutine-header-actions.liquid`

Change summary:
- Added a custom Liquid header section for PawRoutine branding, navigation, announcement option, header actions, and mobile drawer markup.
- Added isolated CSS for the custom header layout, logo/text fallback, navigation, action icons, sticky option, mobile menu, overlay, and responsive behavior.
- Added JavaScript for the mobile drawer interaction, including open/close behavior, overlay close, Escape key close, and cleanup during Shopify section reloads.
- Added a small custom snippet to keep search, account, and cart actions close to the theme's native behavior while allowing the custom header to place and style them.

Reasoning:
- This approach keeps PawRoutine-specific header work separated from broad theme files, making the customization easier to find, understand, and adjust.
- It avoids spreading header logic across unrelated theme files and makes it clearer which files are part of the custom header feature.

Dependencies / assumptions:
- The header depends on the selected Shopify navigation menu being available and correctly populated.
- The account/cart/search action area depends on the theme's existing `search` and `header-actions` snippets continuing to work as expected.
- The mobile toggle depends on the theme icon assets `icon-menu.svg` and `icon-close.svg`.
- The JavaScript depends on custom data attributes and class names used in the PawRoutine header markup.
- The drawer behavior assumes the custom header script loads successfully on pages where the header is present.

Risks / update sensitivity:
- If the theme changes the native `search` or `header-actions` snippets, the PawRoutine header actions may need to be rechecked.
- If class names, data attributes, or markup structure are changed, the mobile drawer script may stop working correctly.
- If native theme header behavior is restored or another header app/customization is added, there may be duplicate header actions, navigation, or conflicting mobile menu behavior.
- Recheck this feature after theme updates, header refactors, or changes to search/account/cart behavior.

Rollback / removal:
- Remove the custom header section from the active theme layout/settings.
- Remove the custom section, asset, and snippet files only after confirming they are no longer referenced anywhere.
- Restore or re-enable the native theme header if the store still needs a standard header after removal.

Verification checklist:
- Confirm the PawRoutine logo or text fallback displays correctly on desktop and mobile.
- Confirm desktop navigation links display and route correctly.
- Confirm search, account, and cart icons appear and work as expected.
- Confirm the mobile menu opens, closes, and does not remain stuck open.
- Confirm overlay click and Escape key close the mobile menu.
- Confirm cart bubble/count still displays correctly after adding an item to cart.

Notes:
- Treat these files as one feature. Do not document the CSS, JS, Liquid section, and action snippet as separate changes unless they later become independent features.

#### Status update — Native theme header restored (2)

Status: Applied
Date: 22-06-2026

Related change:

* PawRoutine custom header

Files changed:

* `sections/header.liquid`
* `sections/header-group.json` — updated by Shopify Theme Editor after the header was changed

Change:

* Restored the theme’s native `header.liquid` as the active Header-group section.
* Updated the native header section schema so it can be added from the Shopify Theme Editor within the Header group:

  * added `enabled_on` for the `header` section group;
  * added a `Header` preset.
* Used the Shopify Theme Editor to remove `PawRoutine custom header` and add the native `Header` section instead.
* The PawRoutine announcement marquee remains a separate section beneath the active native header.

Reason:

* The custom PawRoutine header was no longer required for the current practice theme direction.
* Returning to the native theme header restores the theme’s standard header behavior, controls, and compatibility with future theme updates.
* Making the native header available through the Theme Editor avoids relying on manual edits to the auto-generated `header-group.json` configuration file.

Important implementation note:

* `sections/header-group.json` is generated and maintained by Shopify when Header-group sections are added, removed, reordered, or configured in the Theme Editor.
* Do not treat `header-group.json` as the primary source for this change. The durable code change is in `sections/header.liquid`, where the native header was made eligible for the Header group.
* After future Header changes in Shopify Admin, pull/sync the latest `header-group.json` before pushing local theme changes, otherwise an older local copy could overwrite the Theme Editor configuration.

Custom-header file status:

* The following PawRoutine custom-header files are retained for now but are inactive because the custom section is no longer present in the active Header group:

  * `sections/pawroutine-custom-header.liquid`
  * `assets/pawroutine-custom-header.css`
  * `assets/pawroutine-custom-header.js`
  * `snippets/pawroutine-header-actions.liquid`
* Delete these only in a separate cleanup commit after confirming they are not referenced elsewhere and you do not want to preserve the experiment for comparison.

Verification:

* Confirm the native Header appears in the Theme Editor under the Header group.
* Confirm logo, desktop navigation, search, account, cart, mobile drawer, and sticky-header behavior work correctly.
* Confirm the PawRoutine marquee still appears below the header and scrolls away independently.
* Confirm no duplicate header, duplicate navigation, or duplicate header-action elements render.




#### Status update — PawRoutine custom header sticky behavior (1)
Status: Applied locally -- verification pending
Date: 20-06-2026

Related change:
- PawRoutine custom header

Files changed:
- `sections/pawroutine-custom-header.liquid`
- `assets/pawroutine-custom-header.css`

Change:
- Reworked the custom header's sticky behavior to follow Horizon's native sticky-header pattern.
- The outer custom-header section is used as the sticky container.
- The inner `<header-component>` conditionally receives `sticky="always"` when the existing `sticky_header` setting is enabled.
- Removed the previous custom sticky approach that applied `position: sticky` directly to the inner header component.
- Kept the announcement marquee as a separate, non-sticky section; it scrolls away while the main header remains pinned.

Reason:
- The previous implementation attempted to make the inner component sticky. Its surrounding section still scrolled with the page, so the header did not remain pinned reliably.
- Aligning the markup and CSS with Horizon's sticky-header structure is more maintainable and less likely to conflict with theme behavior during future updates.

Verification required:
- Run `shopify theme dev` and test the local preview.
- With the Sticky header setting enabled, scroll past the hero and confirm that the logo, navigation, and header actions remain pinned at the top.
- Confirm the announcement marquee scrolls away normally.
- Recheck desktop and mobile navigation, including opening and closing the mobile drawer.
- After successful local testing and deployment, update this status to `Applied` and note the deployment date.

Notes:
- Do not remove the existing `sticky_header` checkbox setting from the section schema; it remains the merchant-facing control for this behavior.
- Treat this as an update to the existing custom-header feature, not as a separate feature.
---
---

## STATUS HISTORY

Add future status updates below. Do not delete the original entries above.

---


