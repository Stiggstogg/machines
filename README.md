# Phaser 4, Vite and TypeScript Template

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is the template I use to start new Phaser 4 projects. It is based on the [official Phaser template](https://github.com/phaserjs/template-vite-ts) and the template created with the [create-phaser-game app](https://phaser.io/tutorials/create-game-app) was used as a starting point.

## How to use this template

1. Create a new repository from this template, or copy the template files into a new project folder.
2. Rename the project in `package.json` so it matches your game or project name.
3. Open the project folder in your terminal.
4. Install the dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in the terminal to test the project in your browser.
7. Replace the template code in `src` with your own game code and add your assets to `public`.
8. Create a production build when you are ready:

   ```bash
   npm run build
   ```

9. Use the files in `dist` for deployment or hosting.
10. If you want to automatically upload to itch.io with `itch-release.ps1`, make sure the prerequisites in the section below are fulfilled.

## Available Commands

| Command               | Description                                            |
|-----------------------|--------------------------------------------------------|
| `npm run dev`         | Launch a development web server                        |
| `npm run build`       | Create a production build in the `dist` folder         |
| `npm run major`       | Increase the major version number of the project       |
| `npm run minor`       | Increase the minor version number of the project       |
| `npm run patch`       | Increase the patch version number of the project       |
| `.\itch-release.ps1` | Upload your build to itch.io (see prerequisites below) |

## itch.io Release Script

If you are working on a Windows machine and want to automatically upload your build to itch.io, you can optionally use the `itch-release.ps1` script. Before using the script, make sure the prerequisites in the section below are fulfilled.

### Prerequisites for `itch-release.ps1`

- 7-Zip must be installed. It is used to create the ZIP file for the itch.io upload.
- The 7-Zip installation directory must be added to your user `PATH` environment variable.
- Butler must be installed. It is used to upload the build to itch.io.
- The Butler installation directory must be added to your user `PATH` environment variable.
- You must already be logged in to Butler.
- The last part of the 'project URL' of the project on itch.io must match the name in `package.json`.
- The `itch-release.env` file must contain your itch.io username in the `ITCHIO_USER` variable. You can rename the `itch-release.env.example` file and add your user in this example file. Please ensure that you include `*.env` in your `.gitignore` file.
