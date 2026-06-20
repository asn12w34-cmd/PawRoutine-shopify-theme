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

### PawRoutine custom header
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

---

### PawRoutine announcement marquee
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

---

## STATUS HISTORY

Add future status updates below. Do not delete the original entries above.

---

### Status update
Status: N/A
Date: N/A

Reason:
- No later status updates yet.

Notes:
- Add updates here if one of the logged changes is adjusted, removed, or replaced.
