# TubeJoint Pro: Rectangular/Square Tube Joint Visualization

## 🎯 Goal

This interactive desktop application enables users to create, visualize, and manipulate joints between rectangular and square tubes in a 3D environment. It demonstrates geometry handling, interactive 3D visualization, state synchronization, and desktop application packaging using Electron.

---

## 🔩 Features

### 🧰 Geometry & Input Controls

* **Tube Types:** Toggle between Square and Rectangular profiles.
* **Parametric Design:** Adjust Width, Height, Thickness, and Length dynamically.
* **Dimension Sync:** When Square mode is active, Width & Height automatically stay equal.
* **Multiple Tubes:** Add multiple independent tubes into the workspace.

### 🎮 Interaction Controls

* **Interactive Workspace:** Full 3D canvas with Zoom, Pan, and Orbit capabilities.
* **Direct Manipulation:** Select tubes and use the Gizmo tool to Move and Rotate them.
* **Angle Snap:** Rotation snaps to precise angles (15°, 30°, 45°, 60°, 90°, etc.).
* **Selection:** Click objects in the scene or from the Sidebar list to select them.
* **Delete & Deselect:** Remove selected tubes or clear active selection.

### 💡 Visualization & Workflow

* **View Modes:** Switch between Solid or Wireframe rendering.
* **History Stack:** Robust Undo/Redo support for adding, moving, rotating, and deleting.
* **Scrollable Sidebar:** Handles long UI panels gracefully.
* **3D Instructions Overlay:** Lightweight visual guide inside the canvas.

---

## 💻 Project Structure

The codebase is organized to cleanly separate UI logic, 3D logic, and Electron desktop packaging.

```
root/
├── public/                     # Static assets
│
├── src/
│   ├── components/             # React Components
│   │   ├── Sidebar.jsx         # Parameters, Buttons, Tube List, UI Controls
│   │   └── ThreeScene.jsx      # Three.js Scene, Tubes, TransformControls
│   │
│   ├── App.jsx                 # Global State Manager (source of truth)
│   ├── index.css               # Global Styling, Layout, Sidebar Scroll
│   └── main.jsx                # React entry point
│
├── electron/                   # Electron main process (window, config)
│
├── dist/                       # Production build output (React → Vite)
│   ├── index.html
│   └── assets/...
│
├── release/                    # Packaged executables (Electron Builder)
│
├── package.json                # Dependencies, scripts, Electron build config
└── README.md                   # Project Documentation
```

---

## 🚀 Setup & Installation

### **Prerequisites**

* Node.js (v16 or newer)
* npm or yarn
* Git (optional but recommended)

### **1. Install Dependencies**

```
git clone https://github.com/gyssa-prince/Tube-EasyFabTech-Challenge.git
cd Tube-EasyFabTech-Challenge
npm install
```

---

## 🏃‍♂️ How to Run

### **Option A — Desktop Mode (Electron + React)**

Runs the full desktop application with Electron.

```
npm start
```

### **Option B — Browser Mode (React Only)**

Quick testing in the browser.

```
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🏗️ Building & Packaging

### **1. Build Web (React Only)**

```
npm run build
```

Creates a production build in:

```
dist/
```

### **2. Package Executable (Electron)**

```
npm run build:electron
```

Electron Builder generates installers / executables in:

```
release/
```

---

## 📝 Changelog (v1.0)

* Added Three.js scene with lighting and camera controls
* Added TransformControls for moving & rotating tubes
* Implemented parametric tube creation
* Added Undo/Redo history system
* Synced sidebar + scene selection
* Fixed sidebar overflow by making it fully scrollable
* Improved UI density & theme consistency

---

## 📬 Submission Details

* **GitHub Repository:** https://github.com/gyssa-prince/Tube-EasyFabTech-Challenge.git
* **Download Executable:** https://drive.google.com/drive/folders/1Tk5bOmfWliy6VI0-60iP9KHUHkE0u_P5?usp=drive_link
* **Developer:** GYSSAGARA Prince
