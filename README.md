# Accessible, Consistent Color Palettes for UI Design

Harmonizer is a Figma plugin (web version coming soon) that generates color systems with perceptually balanced lightness, contrast, and chroma. Built on OKLCH (for uniformity) and APCA (for modern contrast standards), it ensures your palettes work seamlessly for UI—no manual tweaking required.

Try the [Harmony Palette](https://www.figma.com/community/file/1287828769207775946) we generated with Harmonizer.

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

- [OKLCH](https://oklch.com/#0.6486,0.2959,24.56,100), currently the most perceptually accurate color model, provides consistent perceptual chroma and lightness, making your colors feel “right” across all levels and hues.
- [APCA](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell) is a modern contrast formula optimized for self-illuminated displays, better reflecting how users perceive contrast on screens.
- [APCACH](https://github.com/antiflasher/apcach), our own custom calculator that blends these two technologies to generate balanced and accessible colors.

# Technical details

This project is a monorepo managed with PNPM, consisting of a core package and two targets: a web application and a Figma plugin.

### Monorepo Structure

- **packages/core:** Contains the main application code shared between different targets.
- **packages/web:** The web application target.
- **packages/figma-plugin:** The Figma plugin target.

### Available PNPM Commands

The following PNPM commands are available for working with the repository:

- `pnpm install`: Installs all dependencies.
- `pnpm web <sub-command>`: It is the alias for running commands for the web target from the root. Available sub-commands: `dev`, `build` and `preview`.
- `pnpm figma <sub-command>`: It is the alias for running commands for the figma plugin target from the root. Available sub-commands: `dev`, `build`.
- `pnpm lint`: Runs the linter.
- `pnpm format`: Runs formatters
- `pnpm typecheck`: Runs typechecking

### Store

The application's state management is built on the [Spred](https://github.com/art-bazhin/spred) reactive library and its React bingings. All the domain logic are written using signals or derivations and can be found in `packages/core/src/stores` directory.

### Color Calculation in Web Workers

To ensure a smooth user experience, the color palette calculation logic is performed in a web worker. This prevents the main thread from being blocked, especially during complex calculations, resulting in a more responsive UI.

### Main Container and CSS Variables

The main container element of the application defines a set of CSS variables that control the overall look and feel. Dynamic styles are calculated based on the application's state and applied to these CSS variables, allowing using it everywhere in the app from CSS.
