# Portfolio color system

## Scope
- Replace the existing light theme with the requested navy, accent blue, off-white, gray, white, and text colors.
- Keep navy for primary buttons and strong calls to action, with the darker navy on hover.
- Use accent blue for links, highlights, active navigation, and focus states.
- Align cards, alternate sections, borders, muted text, shadows, and the footer with the same system.
- Remove remaining page-level color exceptions so the public portfolio and admin screens remain visually consistent.
- Preserve all current content and layouts.

## Technical details
- Define the supplied palette as semantic global color tokens and expose dedicated primary-hover and highlight tokens.
- Update shared navigation, buttons, and highlighted text to use the correct role rather than raw colors.
- Keep contrast accessible and preserve reduced-motion behavior.
- Verify representative pages on desktop and mobile, and confirm the build is clean.
