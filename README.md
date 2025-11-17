# 🚀 LinkSphere — Web Social Media

LinkSphere is a modern social media platform built with **Angular 20**, supporting **SSR (Server-Side Rendering)** for optimal performance and SEO.  
It includes authentication, content management, multilingual support, Tailwind+DaisyUI, and a scalable folder structure.

---

## 📌 Table of Contents
- [✨ Features](#-features)
- [📥 Installation](#-installation)
- [🚧 Development Commands](#-development-commands)
- [🌍 Translation Setup (ngx-translate)](#-translation-setup-ngx-translate)
- [📁 Folder Structure Overview](#-folder-structure-overview)
- [👤 Author](#-author)
- [📄 License](#-license)


## ✨ Features
- ⚡ Angular 20 with SSR
- 🔐 Authentication system
- 📝 Content management (posts, comments, likes…)
- 🌐 Multi-language support via `@ngx-translate`
- 🎨 TailwindCSS + DaisyUI
- 📦 Clean, modular folder structure

---

## 📥 Installation

```bash
git clone https://github.com/MohamedEnara2003/LinkSphere.git
cd link-sphere
npm install
```

### 🎨 Styling packages
```bash
npm install tailwindcss @tailwindcss/postcss postcss --force
npm install -D daisyui@latest
```

### 🌍 Translation packages
```bash
npm install @ngx-translate/core
npm install @ngx-translate/http-loader
```

---

## 🚧 Development Commands

```bash
npm start         # start dev server
npm run build     # build project
npm run serve:ssr:linkSphere   # SSR run
```

---

## 🌍 Translation Setup (ngx-translate)

Translation files go in:

```
public/i18n/en.json
public/i18n/ar.json
```

Use `TranslateHttpLoader` in core translation module.

---

## 📁 Folder Structure Overview

```
src/
 ├── app/
 │   ├── core/
 │   │   ├── guards/
 │   │   ├── models/
 │   │   ├── interceptors/
 │   │   ├── services/
 │   │   └── validations/
 │   ├── features/
 │   │   ├── auth/
 │   │   ├── error/
 │   │   └── public/
 │   ├── shared/
 │   │   ├── components/
 │   │   ├── modules/
 │   │   └── pipes/
 │   └── app.component.ts
 ├── styles.css
```

---

## 👤 Author
**Mohamed Enara**  
Front-End Developer — Angular Specialist

---

## 📄 License
MIT License — free for personal & commercial use.

