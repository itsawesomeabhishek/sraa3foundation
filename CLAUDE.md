# SRAA3 Foundation - Project Guidelines

This file serves as the main configuration and context source for Claude Code and the ECC agent harness inside this repository.

## 🛠️ Build and Development Commands

*   **Run All (Frontend + Backend Concurrently)**: `npm run dev:all`
*   **Run Frontend Dev Server**: `npm run dev`
*   **Run Backend Server**: `npm run server`
*   **Build Frontend Production Assets**: `npm run build`
*   **Preview Production Build**: `npm run preview`
*   **Lint Code**: `npm run lint`

---

## 🏗️ Architecture & Directories

```
sraa3foundation/
├── backend/            # Node Express server
│   ├── data/           # Local JSON database storage
│   │   └── database.json
│   ├── server.js       # Main server entrypoint
│   └── db.js           # Database file readers/writers
├── public/             # Static frontend assets
│   ├── sraa3 foundation 1.glb # Interactive 3D logo
│   └── *.jpeg/*.png    # Renamed high-resolution visual images
├── src/                # React source code
│   ├── components/     # UI components (Header, Hero, About, Chatbot, etc.)
│   ├── App.jsx         # Main React controller
│   ├── index.css       # Global design variables and styling
│   └── main.jsx        # App mounting script
├── CLAUDE.md           # This file (AI coding assistant instructions)
└── package.json
```

---

## 🎨 Coding & Design Guidelines

### Frontend
1.  **Component Style**: Functional React components utilizing modern JSX. State management is handle locally via React Hooks (`useState`, `useEffect`, `useRef`).
2.  **Styling**: Vanilla CSS. Avoid utility classes. Use global design tokens declared inside `src/index.css` (e.g. `--green: #20bb5f;`, `--navy: #000000;`).
3.  **Animations**: Use custom cubic-bezier curves for transitions (`cubic-bezier(0.165, 0.84, 0.44, 1)`) and hardware-accelerated transforms (`translateY`, `scale`) for premium micro-animations.
4.  **Responsive Layouts**: Design mobile-first layouts using CSS grid/flexbox and CSS variables.

### Backend
1.  **Framework**: Express with JSON file-based database store.
2.  **API URL**: Configure frontend network fetches dynamically via `import.meta.env.VITE_API_URL` (falls back to local `http://localhost:5000`).
3.  **Static Files**: Uploaded files should be placed inside `backend/uploads/` and served publicly via `/uploads`.
