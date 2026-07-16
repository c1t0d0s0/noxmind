# NoxMind - Mind Mapping Tool

NoxMind is a simple and elegant single-page web application for mind mapping, styled with a sleek dark theme.  
It supports organizing thoughts and brainstorming ideas with intuitive and lightning-fast controls.

---

## 🚀 Key Features

1. **Intuitive Node Creation & Editing**
   * Expand your mind map rapidly using just your keyboard or mouse.
   * Supports manual line breaks (`Shift + Enter`) inside node texts.
   * Auto-expanding "horizontal rectangle" node width matches your text length naturally.

2. **Right-Click Context Menu**
   * Right-click any node to open a quick context menu for "Add Child", "Add Sibling", and "Delete Node".
   * Invalid actions (like Add Sibling or Delete Node on the Root node) are automatically hidden.

3. **Smooth Canvas Navigation**
   * Click and drag the background to pan the infinite canvas.
   * Scroll mouse wheel to zoom in/out relative to the cursor position.
   * Full **pinch-to-zoom** and **single-touch panning** support for mobile/tablet devices.

4. **Drag & Drop for Re-parenting (D&D)**
   * Move any node (except root) and its subtree to a new parent by simply dragging and dropping it.
   * Prevent circular reference crashes with built-in "ancestor detection" logic.

5. **Style Customization**
   * Adjust background color, text color, and branch color for each node.
   * Toggle **"Borderless (Text Only)"** style for cleaner layouts.
   * Once enabled, subsequent new child/sibling nodes automatically inherit the borderless style.

6. **Local Export / Import & Auto-Save**
   * Export the entire mind map as a custom `.json` file to your local machine, allowing you to reload and resume editing later.
   * All progress is auto-saved to browser `localStorage` to prevent data loss.

7. **Flexible Import & Export Support**
   * **Export**: Output your mind maps not only in custom `.json` but also in **FreeMind format (`.mm`)** and **XMind format (`.xmind`)** to seamlessly migrate your data to other mind mapping applications.
   * **Import**: Import saved `.json` files, or directly load FreeMind `.mm` XML and XMind `.xmind` files.

8. **High-Quality Image Export (PNG / SVG)**
   * Download the mind map in standard `SVG` vector format or `PNG` raster image.
   * Security constraints (Tainted Canvas error) are completely bypassed using a native SVG element conversion engine, rendering safe exports in any browser.

---

## ⌨️ Keyboard Shortcuts

Speed up your workflow using these built-in keyboard shortcuts:

| Key | Action |
| :--- | :--- |
| **`Tab`** | Add a **child node** to the selected node |
| **`Enter`** | Add a **sibling node** (or a child if root is selected) |
| **`Delete` / `Backspace`** | **Delete** the selected node and its subtree (Root cannot be deleted) |
| **`Space` / `F2`** | **Start editing** the text of the selected node |
| **`Enter`** (Editing) | Save and **commit editing** (also triggered on focus loss) |
| **`Shift + Enter`** (Editing) | Insert a **manual line break** |
| **`Esc`** | Cancel editing, or deselect all nodes |
| **`↑` `↓` `←` `→`** | Navigate selection between nodes |

---

## 🖥️ Building as a Desktop App (Tauri)

This application can be packaged as a standalone desktop app for Windows and macOS using [Tauri](https://tauri.app/).

### Building Assets (for Web / Tauri Pre-build)
Before running or building the Tauri application, or deploying the web version, you can build the assets to generate the production files in the `www` folder (this is automatically executed during Tauri dev/build steps).
This process automatically injects the version string from `tauri.conf.json` into `index.html`.

```bash
npm run build:assets
```
This processes and copies `index.html`, `script.js`, and `style.css` from the project root into the `www/` directory.

### Local Development & Build
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run in development mode:**
   ```bash
   npm run tauri dev
   ```
3. **Build the production release package:**
   ```bash
   npm run tauri build
   ```

## 📱 Building as a Mobile App (Tauri Mobile)

Using Tauri v2's mobile support, you can package this application for Android and iOS.

### 1. Common Setup (Add Rust Targets)
Add cross-compilation targets for your target platforms.

```bash
# Add targets for Android
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android

# Add targets for iOS (macOS host only)
rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
```

### 2. Android Build Instructions
#### Prerequisites:
* **Android Studio** installed on your system.
* **Android SDK** and **NDK** installed with `ANDROID_HOME` and `NDK_HOME` environment variables set correctly.
* **JDK 17** installed and added to your path.

#### Run & Build:
```bash
# Generate mobile source files (Run once)
npx tauri android init

# Run in development mode (launches in an emulator or connected device)
npx tauri android dev

# Build the release bundle (APK / AAB)
npx tauri android build
```
Once succeeded, your output package is generated under `src-tauri/gen/android/app/build/outputs/apk/release/` or similar directory.

### 3. iOS Build Instructions (macOS Host Only)
#### Prerequisites:
* **macOS** operating system.
* Latest **Xcode** version installed.
* Xcode Command Line Tools installed via `xcode-select --install`.

#### Run & Build:
```bash
# Generate mobile source files (Run once)
npx tauri ios init

# Run in development mode (launches in iOS Simulator or connected device)
npx tauri ios dev

# Build the release package
npx tauri ios build
```
Xcode will open automatically during the build process. Set your Code Signing and Provisioning Profiles to generate the final archive.

---

### 🍎 Bypassing macOS "Developer Cannot Be Verified" Gatekeeper Error
If you download and run an unsigned macOS app (`.dmg` / `.app`), Gatekeeper may block execution.

You can remove the Quarantine flag by executing this command in the Terminal:

```bash
# If placed inside the Applications folder:
xattr -cr /Applications/NoxMind.app
```
*(Replace `/Applications/NoxMind.app` with the actual path if installed elsewhere)*

---

## 📂 File Structure

This is a clean frontend application composed of the following key files:

* **[index.html](file:///home/jin/work/Google/gemini-cli/mindy/index.html)**: Main HTML structure.
* **[style.css](file:///home/jin/work/Google/gemini-cli/mindy/style.css)**: Neon-dark styled stylesheets.
* **[script.js](file:///home/jin/work/Google/gemini-cli/mindy/script.js)**: Core logic (layout engine, D&D, zoom/pan, export/import).
* **[README.md](file:///home/jin/work/Google/gemini-cli/mindy/README.md)**: This document (English).
* **[README.ja.md](file:///home/jin/work/Google/gemini-cli/mindy/README.ja.md)**: Japanese version of documentation.
