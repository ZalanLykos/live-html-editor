# Live HTML Editor
<img width="934" height="496" alt="htmeditor" src="https://github.com/user-attachments/assets/c28957cc-62ac-4763-a585-73400a56d85e" />

A **simple, live HTML editor** with real-time preview and inspect elements feature.

---

## 💡 What it does
- You write or paste HTML code in the editor → the preview updates instantly inside an iframe.  
- Switch between **light and dark themes**.  
- Toggle a **file menu** (placeholder for future file actions).  
- Click **Inspect Elements** to hover over elements inside the preview → highlights the element visually and scrolls/highlights its code line in the editor.  
- Click an element in inspect mode to lock the highlight and exit inspect mode.

---

## 🛠 How I built it
- Pure **vanilla HTML, CSS, and JavaScript** — no external libraries or frameworks.  
- Uses an iframe for live preview, updated on each code change.  
- Inspect mode implemented by injecting a highlight overlay inside the iframe and syncing hovered elements to editor line highlights by searching the HTML source.

---

## 🚀 Why I made it
- Needed a lightweight, web-based playground to quickly test and debug HTML snippets.  
- Wanted a way to visually inspect elements inside the preview and find corresponding code lines easily.  
- Hosted on **GitHub Pages** for easy access anywhere.

---

## 📦 Usage
Try it live here: <a href="https://zalanlykos.github.io/live-html-editor" target="_blank">https://zalanlykos.github.io/live-html-editor</a>  
Open the editor, type or paste your HTML code, then toggle Inspect Elements to explore the preview and locate code lines.


---

### Made with ❤️ by Zalan Lykos
