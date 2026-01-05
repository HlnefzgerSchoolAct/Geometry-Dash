# Geometry Dash Clone

A complete frontend-only clone of the popular rhythm-based platformer game Geometry Dash, built with vanilla HTML, CSS, and JavaScript.

## Features

### Core Gameplay
- ✅ Cube player control with click/spacebar jump mechanics
- ✅ Automatic level scrolling from left to right
- ✅ Realistic gravity physics
- ✅ Collision detection with obstacles, ground, and ceiling
- ✅ Death and instant restart functionality

### Game Elements
- **Obstacles**:
  - 🔺 Spikes (triangular hazards)
  - ⬛ Blocks/platforms
  - 🔄 Rotating sawblades
- **Portals** for game mode changes:
  - 🟩 Cube mode (default jumping)
  - 🔷 Ship mode (hold to fly up)
  - 🟪 Ball mode (gravity flip on click)
  - 🟨 Wave mode (diagonal movement)
- **Jump Pads/Orbs**:
  - 🟡 Yellow orbs (high jump, requires click)
  - 🔵 Blue orbs (medium jump)
  - 🟣 Pink orbs (very high jump, requires click)
- **Coins**: Collectible rotating coins throughout levels

### Visual Design
- 🎨 Geometry Dash aesthetic with neon colors
- 🌑 Dark gradient background
- ✨ Particle effects (player trail and death particles)
- 🔄 Smooth cube rotation during jumps
- 💫 Glowing/pulsing effects on orbs and obstacles
- 📊 Grid-based level design

### Audio
- 🔊 Procedurally generated sound effects using Web Audio API:
  - Jump sounds
  - Death sound effect
  - Coin collection sound
  - Orb activation sound
  - Simple background music melody

### UI/UX
- 🎮 Main menu with level selection
- ⏸️ Pause functionality (ESC key)
- 📊 Progress bar showing level completion
- 🔢 Attempt counter
- 📈 Percentage display
- 💀 Death screen with statistics
- 🏋️ Practice mode with checkpoints

### Levels
- 📍 Level 1: "Stereo Madness" - Beginner friendly level
- 📍 Level 2: "Back On Track" - Intermediate level with mode changes

### Controls
- **Keyboard**: 
  - `Space` or `↑ Arrow` - Jump/Fly
  - `ESC` - Pause game
- **Mouse**: Click anywhere to jump/fly
- **Touch**: Tap anywhere to jump/fly (mobile support)

## Technical Details

### File Structure
```
.
├── index.html          # Main HTML file with game UI
├── css/
│   └── style.css       # All game styles and animations
├── js/
│   ├── game.js         # Main game loop and logic
│   ├── player.js       # Player class with physics
│   ├── obstacles.js    # Obstacle, orb, coin, and portal classes
│   ├── levels.js       # Level data and definitions
│   └── audio.js        # Audio manager with Web Audio API
└── README.md           # This file
```

### Requirements Met
- ✅ Pure frontend (HTML/CSS/JS only)
- ✅ No external dependencies or frameworks
- ✅ No backend required
- ✅ Runs entirely in the browser
- ✅ Responsive design
- ✅ Optimized for 60fps gameplay
- ✅ Keyboard and mouse/touch support
- ✅ Multiple game modes (cube, ship, ball, wave)
- ✅ Practice mode with checkpoints
- ✅ 2 complete playable levels

## How to Run

Simply open `index.html` in a modern web browser. No build process or server required!

### Recommended Browsers
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## How to Play

1. Select a level from the main menu
2. Click, press Space, or tap to make your character jump
3. Avoid spikes and sawblades
4. Land on platforms
5. Click near orbs to activate them for extra jumps
6. Collect coins for bonus points
7. Pass through portals to change game modes
8. Reach the end of the level to win!

### Game Modes
- **Cube Mode** (🟩): Click to jump. Jumps only when on ground/platform.
- **Ship Mode** (🔷): Hold to fly upward, release to fall. Continuous control.
- **Ball Mode** (🟪): Click to flip gravity direction. Changes fall/rise direction.
- **Wave Mode** (🟨): Hold to go up diagonally, release to go down diagonally.

### Practice Mode
Enable practice mode from the main menu to add checkpoints every 500 units. When you die in practice mode, you'll respawn at the last checkpoint instead of the beginning.

## Development Notes

### Performance Optimizations
- Efficient canvas rendering
- Object pooling for particles
- Optimized collision detection
- RAF-based game loop for smooth 60fps

### Browser Compatibility
The game uses modern JavaScript features including:
- ES6 Classes
- Arrow functions
- Web Audio API
- Canvas API
- RequestAnimationFrame

### Future Enhancements
Possible additions:
- More levels with increasing difficulty
- Level editor
- Custom music upload
- High score persistence (localStorage)
- More game modes (UFO, robot, spider)
- Speed portals
- Gravity portals
- More visual effects

## Credits

Created as a learning project and tribute to the original Geometry Dash by Robert Topala (RobTop Games).

## License

This is a fan-made educational project. All original Geometry Dash concepts and designs are property of RobTop Games.
