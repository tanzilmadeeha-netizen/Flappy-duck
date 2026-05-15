# Flappy Duck

A playful Flappy Bird-style game that includes both a browser-based HTML/JavaScript version and a Python/Pygame version.

![Flappy Duck preview](assets/preview.gif)



---

## 🎮 Project Credits

- Created by Madeeha Tanzeel — [GitHub: tanzilmadeeha-netizen](https://github.com/tanzilmadeeha-netizen)
- Contributor: Tusar Khan — [GitHub: MrTusarRX](https://github.com/MrTusarRX)
- This project was converted from Python into an HTML/JavaScript web game.

---

## 📁 Repository Structure

- `index.html` — Web version entry page
- `game.js` — Browser game logic and controls
- `style.css` — Responsive styling for the web version
- `duckiee.py` — Python/Pygame game runner
- `bird.py` — Pygame bird behavior and animation
- `pipe.py` — Pygame pipe generation and movement
- `assets/` — Images, audio, and fonts used by both versions

---

## ✨ Features

- Works on desktop and mobile browsers
- Tap to start and tap to flap for mobile play
- Keyboard controls for desktop play
- Score tracking and game over screen
- Native desktop version with Python/Pygame

---

## 🌐 Web Version

### Run in browser

1. Open `index.html` in your browser.
2. Ensure the `assets/` folder is next to `index.html`.

### Controls

- `ENTER` or tap to start
- `SPACE` or tap to flap
- Click **Play Again** after game over

---

## 🐍 Python/Pygame Version

### Requirements

- Python 3
- `pygame`

### Install Pygame

```bash
pip install pygame
```

### Run

```bash
python duckiee.py
```

### Controls

- `ENTER` to start
- `SPACE` to flap
- Click the **Restart** text after game over

---

## 💡 Notes

- The web version uses browser audio and image files from `assets/`.
- The Python version uses the same art assets and renders with Pygame.

---

## 📄 License

This project is available under the terms of the `LICENSE` file.
