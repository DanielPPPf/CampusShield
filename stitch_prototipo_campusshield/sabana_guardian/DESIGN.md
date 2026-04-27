# Design System Specification: The Guardian Sentinel

## 1. Overview & Creative North Star
**The Creative North Star: "The Institutional Guardian"**
This design system moves beyond the utility of a standard security app to create a high-end, editorial experience that feels both authoritative and protective. We are blending the prestige of Universidad de La Sabana with a "High-Tech Sentinel" aesthetic. 

The system breaks the "template" look by favoring **Tonal Layering** over rigid outlines. By utilizing intentional asymmetry in layout and overlapping glass surfaces, we create a sense of depth and modern sophistication. This is not just a tool; it is a premium digital concierge for campus safety.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep institutional blues, punctuated by high-clarity semantic accents.

### Color Tokens
*   **Primary (The Authority):** `primary` (#000a34) & `primary_container` (#001c65). Used for core branding and high-importance status.
*   **Secondary (The Action):** `secondary` (#3759b6). Used for active interactions.
*   **Surface Hierarchy:** 
    *   `surface` (#faf9ff) - The base canvas.
    *   `surface_container_low` (#f2f3fd) - For secondary content areas.
    *   `surface_container_highest` (#e1e2ec) - For elevated, interactive elements.
*   **Semantic Risk:** 
    *   `error` (#ba1a1a) - High Risk/Panic.
    *   `tertiary` (#636100) - Warning/Amber levels.
    *   `on_secondary_fixed_variant` (#18409d) - Safe/Green equivalent (System Trust).

### The "No-Line" Rule
Prohibit the use of 1px solid borders for sectioning. Structural boundaries must be defined solely through background color shifts. For example, a `surface_container_low` card should sit on a `surface` background. If the eye can perceive the shift in tone, a line is redundant and adds "visual noise" that cheapens the brand.

### The Glass & Gradient Rule
To achieve a "High-Tech" feel, use **Glassmorphism** for floating elements (like the Bottom Navigation or Emergency FAB). 
*   **Implementation:** Use a semi-transparent `surface` color (80% opacity) with a `20px` backdrop-blur.
*   **Signature Textures:** Main CTAs should utilize a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle to provide a "soul" and depth that flat hex codes lack.

---

## 3. Typography
We use a dual-font strategy to balance "Institutional Heritage" with "Modern Security."

| Level | Token | Font Family | Size | Weight | Character |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Manrope | 3.5rem | 800 | Bold, Editorial, Authoritative |
| **Headline** | `headline-md` | Manrope | 1.75rem | 600 | Clear, Urgent, Structured |
| **Title** | `title-lg` | Inter | 1.375rem | 500 | Professional, Accessible |
| **Body** | `body-md` | Inter | 0.875rem | 400 | Highly readable, functional |
| **Label** | `label-sm` | Inter | 0.6875rem | 600 | All-caps for status badges |

**Editorial Intent:** Use `display-lg` for welcome screens or safety scores with generous leading. The contrast between the geometric Manrope and the functional Inter creates a "Premium Tech" atmosphere.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** and physical stacking principles.

*   **The Layering Principle:** Stacking follows a logic of light. The "closest" objects to the user are the lightest. 
    *   *Example:* A `surface_container_lowest` (#ffffff) card placed on top of a `surface_container_low` (#f2f3fd) base.
*   **Ambient Shadows:** For floating elements (Emergency buttons), use a shadow tinted with the `primary` color: `box-shadow: 0 12px 32px rgba(0, 10, 52, 0.08);`. Never use pure black shadows.
*   **The Ghost Border:** If a boundary is required for accessibility, use the `outline_variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Cards & Lists
*   **Rules:** Forbid divider lines. Use `1.5rem` (24px) vertical spacing or subtle `surface_variant` shifts to separate content.
*   **Shape:** Use `xl` (0.75rem) corner radius for cards to soften the institutional feel.

### Buttons
*   **Primary:** High-contrast `primary` background with `on_primary` text. Use a 0.5px "Ghost Border" of `white` at 20% inside the button for a "polished glass" edge.
*   **Emergency FAB:** Circular, `error` color, with a subtle pulse animation using a `20%` opacity `error_container` ring.

### Risk Status Badges
*   **Visual Style:** Small, pill-shaped (`full` roundedness). Use `surface_container_highest` as the base with a high-contrast dot of the semantic color (Red, Amber, Green). This is more sophisticated than a solid colored block.

### Signature Component: The "Shield Gauge"
A custom radial progress component for the home screen showing the "Campus Safety Level." It uses a thick `surface_container` track and a `primary` to `secondary` gradient stroke, utilizing `display-md` typography in the center.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a functional tool. If an element feels cramped, increase the surface-tonal shift rather than adding a line.
*   **DO** use "Metropolis" or "Manrope" for numbers and data visualizations to maintain the high-tech look.
*   **DO** ensure the La Sabana logo is placed with a "safe zone" of at least 32px from any other UI element.

### Don't
*   **DON'T** use standard 1px #CCCCCC borders. They create a "bootstrap" feel that undermines the premium institutional brand.
*   **DON'T** use pure black (#000000) for text. Always use `on_surface` (#191b23) for a softer, editorial contrast.
*   **DON'T** use "Drop Shadows" on flat cards. Rely on color shifts between surface tiers. Save shadows only for elements that "float" above the glass (e.g., Modals, FABs).