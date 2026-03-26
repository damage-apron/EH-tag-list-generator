This file is localized using AI translation and may contain inaccuracies.
If there is any difference, the Japanese source file takes precedence.

---

# EH-tag-list-generator

## Language and Localization

- Localized documents are managed under `locales`.
- AI is used for translation.
- Localized versions are for reference. If there is any inconsistency, the Japanese source version takes precedence.

### README by Language

- Japanese (source): [README.md](README.md)
- English (localized): [locales/en/README.md](locales/en/README.md)

## Overview

This is a TypeScript-based generator tool that fetches and processes EH tag information, then outputs it in easy-to-distribute JSON / JSONC formats.

Through a step-by-step pipeline from `tag1` to `tag4`, this tool builds category-based tag data and finally generates integrated output data.

When you run it, you can obtain integrated JSON / JSONC data that can be used for tag translation workflows.

## Installation

Prerequisites:

- Node.js 20 or later is recommended.
- npm

Preparation:

- Download this repository (or `git clone` it) and place it on your local machine.
- Run the following commands in the project root folder where `LICENSE` and other files exist (you can use either the VS Code terminal or a direct PowerShell / Command Prompt terminal).

Setup:

```bash
npm install
```

## Usage

Run the generation process:

```bash
npm run main
```

`npm run main` performs the following:

1. Build TypeScript (`tsc -b`)
2. Run the generator script (`node dist/main.js`)

At the end of `node dist/main.js`, all `.jsonc` files under `data/jsonc` are scanned and automatically converted to `.json` files under `data/json`.

## Program Structure

### `src/main.ts`

- Entry point that manages the whole execution flow
- Executes `Tag1` to `Tag4` in order
- Generates final integrated data at `data/jsonc/data1.jsonc`
- Bulk-converts `.jsonc` files in `data/jsonc` into `.json`

### `src/tag1.ts`

- Collects tag IDs and titles from the ehwiki category API
- Follows pagination (`cmcontinue`) to fetch all entries
- Generates initial category data (`*_1.json`)

### `src/tag2.ts`

- Uses the ID list from `tag1` to fetch page content through the API
- Fetches page IDs in batches of 50
- Organizes successful data and failed IDs into `*_2.json`

### `src/tag3.ts`

- Extracts and normalizes Japanese names from wiki page content (HTML entity decoding, full-width parenthesis normalization, etc.)
- `tag3`: extraction for general categories
- `tag3Creator`: classification and separation for creator categories (artist / circle)
- Outputs extraction results as `*_3.json`

### `src/tag4.ts`

- Matches original titles with translated values and creates a `title -> Japanese name` dictionary
- Collects failed IDs and outputs sorted final category data (`*_4.json`)

## Output

Main outputs are created under `data`:

- `data/*_1.json` to `data/*_4.json`: intermediate artifacts for each processing stage
- `data/jsonc/data1.jsonc`: final integrated data (JSONC)
- `data/json/*.json`: JSON files automatically converted from all `.jsonc` files under `data/jsonc`

## Development

To run build only:

```bash
tsc -b
```

## License

This project is licensed under MIT. See [LICENSE](LICENSE) for details.

## Notes

- If output files already exist, some files with the same names are skipped.
- Output content may change if the source data specification changes.
