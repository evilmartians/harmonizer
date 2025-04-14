# Accessible, Consistent Color Palettes for UI Design

Harmonizer is a Figma plugin (web version coming soon) that generates color systems with perceptually balanced lightness, contrast, and chroma. Built on OKLCH (for uniformity) and APCA (for modern contrast standards), it ensures your palettes work seamlessly for UI—no manual tweaking required.

Try the Harmony Palette we generated with Harmonizer: https://www.figma.com/community/file/1287828769207775946

## Why Harmonizer?

There are many great color palettes out there—from design systems to brand colors provided by agencies. But these palettes often aren’t made with UI design in mind:
- Inconsistent levels: Same "level" colors vary in lightness/chroma.
- Contrast guesswork: Text colors often need manual adjustments based on the background of UI elements.
- Themes don’t mirror: Light/dark modes require custom mappings.

Harmonizer solves this by generating color with perceptually consistent lightness and contrast. It makes the levels reliable—you can change colors of the same level and be sure the text contrast remains exactly the same.

## How It Works
- Set color space (inherits from your Figma document: P3 or sRGB).
- Define levels (e.g., 100–900) as lightness steps.
- Adjust contrast per level (calculated against your background).
- Add hues and name them (e.g., "Brand Blue," "Error Red").
- Set background context (default: white/black; customizable).
- Create Palette > ganarates the color preview and variables in Figma file.

## Key Features
- Adjustable color profile: P3 or SRGB
- Perceptualy consistent chroma with OKLCH
- Consistent contrast calculation using APCA (default) or WCAG
- Configurable contrast direction (foreground vs. background)
- Customizable background colors for contrast calculations
- Automatic recognition of previously generated palettes (if the palette preview in Figma keeps it's name “Harmonized Palette”)
- Auto-update of existing palette preview and variables
- Shareable configs: Save/load configuration files for easy sharing
- Developer exports: Tailwind, CSS variables, JSON.

## Why OKLCH and APCA?
- OKLCH, currently the most perceptually accurate color model, provides consistent perceptual chroma and lightness, making your colors feel “right” across all levels and hues.
- APCA is a modern contrast formula optimized for self-illuminated displays, better reflecting how users perceive contrast on screens.
- Harmonizer uses APCACH, our own custom calculator that blends these two technologies to generate balanced and accessible colors.
