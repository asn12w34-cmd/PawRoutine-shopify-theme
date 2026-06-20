# CUSTOM_CHANGES.md

## Purpose
This file documents any non-standard changes made in the theme codebase that a future developer (or future you) must be aware of to maintain, troubleshoot, or safely update the theme.

## What to include (log it here)
Log an entry when a change/theme update:
- required editing theme code files (not just Theme Editor settings), AND
- alters default theme behavior, OR
- could be overwritten or impacted by future theme updates, app changes, or refactors, OR
- is not obvious to someone reviewing the store from the admin UI.

## What NOT to include (keep it out)
Do not log:
- Theme Editor configuration changes (colors, typography, section ordering, content)
- routine content edits (copy/images)
- basic admin settings changes
- changes that are fully reversible from the Theme Editor without touching code

## Structure
Each entry should be small, dated, and self-contained:
- what changed
- why it changed
- where it changed (files/locations)
- what can break it (dependencies/risks)
- how to verify it still works (quick checks)

## How to find custom code markers

Custom code inside theme files is marked using the following searchable tags:

- `CUSTOM START [ID]` — beginning of a modified native-code block
- `CUSTOM END [ID]` — end of a modified native-code block
- `CUSTOM FILE [ID]` — brand-new custom file created for a feature
- `CUSTOM [ID]` — short one-line custom note

To locate custom work quickly, search the theme codebase for:

- `CUSTOM`
- `CUSTOM START`
- `CUSTOM FILE`
- the specific change ID, for example `PR-001`

Each marker ID should match an entry in this file.

## Core rule for future change
Once a code change has been logged, the entry should stays forever.
If the change is later undone, you **append a status update** to the original entry.


 ### REUSABLE ENTRY TEMPLATE (use for both code tweak, and theme update)
 

---
### Change Title (short, descriptive)
Status: Applied | Removed | Adjusted
Last updated: DD-MM-YYYY

Trigger:
- (Choose one) Planned customization / Theme update / App change / Bug fix / Other

Context:
- What prompted the change? (1–2 sentences)

Scope:
- Where the change lives (files, sections, snippets, or other identifiable locations)

Change summary:
- What was changed (plain language)
- What default behavior was altered (if applicable)

Reasoning:
- Why this approach was chosen (brief)

Dependencies / assumptions:
- What this relies on (theme structure, selectors, settings, app outputs, data fields, etc.)
- Anything that would cause it to fail if changed later

Risks / update sensitivity:
- What could overwrite or break this in the future (updates, app edits, refactors)
- Notes for safe upgrades (e.g., “recheck after theme update”)

Rollback / removal:
- How to disable/remove the change safely (high level)

Verification checklist:
- 2–6 quick checks someone can run to confirm the change still works
- Include device/page coverage if relevant

Notes:
- Optional: links to tickets, screenshots, commit hashes, or supporting docs

 
---
### STATUS HISTORY
---

### Status update (example, to be removed)
Status: Removed
Removed on: January 10th 2025
Reason:
- Logic no longer needed after switching to native theme setting.

Notes:
- No remaining dependencies.
- Safe to ignore during future updates.

---
### Status update (example, to be removed)
Status: Adjusted
Date: 2025-03-05

Reason:
- Updated to align with new theme markup.

Notes:
- Original logic partially reused.
- Verification checklist updated accordingly.