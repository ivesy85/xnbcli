# xnbcli
This repository is a fork of [LeonBlade/xnbcli](https://github.com/LeonBlade/xnbcli), with additional refactored logic to support LZX compression from [draivin/XNBNode](https://github.com/draivin/XNBNode), along with my own custom code to improve handling of repacked XNB files.

## Why I Built This
I wanted to modify XNB files for use on the **Nintendo Switch** via **LayeredFS**. This tool has worked really well for me, and I now have custom **Stardew Valley** mods running on the Switch! 🎮

## About
`xnbcli` is a **CLI tool for packing and unpacking XNB files**, purpose-built for **Stardew Valley**.
- Supports **unpacking** and **repacking LZX-compressed** XNB files.
- Works with **modding Stardew Valley**.
- Requires `xcompress32.dll` (not included, but can be found with a quick search).

## Installation & Requirements
### 1️⃣ Install Dependencies
You need a **32**-bit version of **Node.js (v16)** for compatibility. The easiest way is using nvm in PowerShell:
```sh
nvm install 16.20.0 32
nvm use 16.20.0 32
```
Ensure you have the following installed:
- **Node.js** (32-bit, version 16)
- **npm**
- **Python**
- `windows-build-tools`
    ```sh
    npm install -g --production windows-build-tools
    ```
- Run `npm install` to install all required packages.
## 2️⃣ Required DLL File
`xnbcli` requires `xcompress32.dll` in the working directory. This file is **proprietary** and **not included** in the repository, but a quick search should help you find it.

## Usage
### 📂 Unpacking XNB Files
1. Place your .xnb files into the packed folder.
2. Run:
    ```sh
    npm run unpack
    ```
3. Extracted files will be in the unpacked folder.
### 📦 Packing XNB Files
1. Modify the extracted files inside the unpacked folder.
2. Run:
    ```sh
    npm run pack
    ```
3. Your repacked .xnb files will be available in the packed folder.

## License
This project is licensed under the **GNU LGPL v3.0**.