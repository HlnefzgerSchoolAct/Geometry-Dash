# Shape Dash

A rhythm-based platformer game built with vanilla HTML, CSS, and JavaScript. Shape Dash features precise physics, multiple game modes, and challenging levels - all created with original assets and branding.

## Overview

Shape Dash is an original game that captures the essence of rhythm-based platforming with smooth controls, precise physics, and engaging gameplay. Navigate through challenging levels using various game modes while avoiding obstacles and collecting coins.

## Features

### Core Gameplay Mechanics
- **Precise Physics**: Finely-tuned gravity (0.958) and jump mechanics (-11.5) for responsive control
- **Smooth Scrolling**: Consistent 5.77 px/frame movement (311 px/s at 60fps)
- **Collision Detection**: Pixel-precise obstacle and platform detection
- **Death and Restart**: Instant restart functionality with particle explosion effects
- **Rotation System**: 6°/frame rotation (90° per complete jump cycle)

### Game Modes (7 Total)
1. **Cube Mode** 🟩 - Classic jump mechanics
   - Single-tap to jump when grounded
   - Standard gravity and jump force
   - Rotates 90° during jumps

2. **Ship Mode** 🟧 - Hold to fly
   - Hold to ascend, release to descend
   - 45% reduced gravity for lighter control
   - Triangle ship with fire trail

3. **Ball Mode** 🟪 - Gravity flip
   - Tap to reverse gravity direction
   - 85% gravity for bouncy feel
   - Circular shape with rotation indicator

4. **Wave Mode** 🟡 - Diagonal movement
   - Hold to go up diagonally, release for down
   - 60% gravity for precise control
   - Diamond shape with trail

5. **UFO Mode** 🔷 - Tap boost
   - Tap for short upward boosts
   - 75% gravity with cooldown system
   - Dome-shaped UFO design

6. **Robot Mode** 🟧 - Variable jump
   - Higher jumps than cube mode
   - 130% jump force
   - Rectangular robot with eyes

7. **Spider Mode** 🟣 - Teleport jump
   - Tap to teleport between surfaces
   - 150% jump force
   - Angular spider design

### Game Elements

**Obstacles**:
- 🔺 **Spikes** - Triangular hazards with gray color and white outlines
- ⬛ **Blocks/Platforms** - Solid surfaces with 3D depth effect
- 🔄 **Sawblades** - Rotating circular obstacles with sharp teeth

**Interactive Elements**:
- 🟡 **Yellow Orbs** - High jump (18 units), click to activate
- 🔵 **Blue Orbs** - Medium jump (12 units), auto-activate
- 🟣 **Pink Orbs** - Very high jump (22 units), click to activate
- 🪙 **Coins** - Rotating collectibles with sparkle effects

**Portals**:
- Mode change portals (cube, ship, ball, wave, UFO, robot, spider)
- Each portal has unique color coding
- Visual frame with icon indicator

### Visual Design

- **Neon Aesthetic**: Glowing geometric shapes with bright colors
- **Dark Background**: Gradient from #0a0a0a to #1a1a2e
- **Grid Pattern**: Subtle background grid for depth
- **Particle Effects**: 
  - Trail behind player (fading particles)
  - Death explosion (20 particles with physics)
- **3D Effects**: Depth on blocks and platforms
- **Smooth Animations**: All rotations and movements at 60fps
- **Color Palette**:
  - Cube: Bright Green (#00ff00)
  - Ship: Cyan (#00ffff)
  - Ball: Magenta (#ff00ff)
  - Wave: Yellow (#ffff00)
  - UFO: Blue (#0088ff)
  - Robot: Orange (#ff8800)
  - Spider: Purple (#aa00ff)
  - Obstacles: Gray (#666666) with white outlines

### Audio System

All audio generated procedurally using Web Audio API:
- **Jump Sound**: Square wave with frequency sweep
- **Death Sound**: Sawtooth wave with descending pitch
- **Coin Sound**: Sine wave with rising pitch
- **Orb Sound**: Triangle wave for activation
- **Background Music**: Simple procedural melody loop

### UI/UX Features

- **Main Menu**: 
  - Large title with glowing effect
  - Level selection buttons
  - Practice mode toggle
  
- **Game UI**:
  - Attempt counter (top left)
  - Progress percentage (top center)
  - Progress bar (top of screen with gradient)
  - Pause button (top right)

- **Pause Menu**:
  - Resume, Restart, Main Menu options
  - Semi-transparent overlay

- **Death Screen**:
  - Progress percentage display
  - Try Again and Main Menu buttons
  - Red-themed design

- **Practice Mode**:
  - Checkpoints every 500 units
  - Respawn at last checkpoint on death
  - Visual checkpoint indicators

### Levels

**Level 1: Neon Runner** (Beginner)
- Length: 5000 units (~60 seconds)
- Pure cube mode
- Introduction to basic mechanics
- Spikes, platforms, sawblades, orbs, and coins
- 6 collectible coins

**Level 2: Shape Shifter** (Intermediate)
- Length: 6000 units (~75 seconds)
- Multiple mode changes (cube → ship → ball → wave → cube)
- More complex obstacle patterns
- 7 collectible coins
- Tests all learned mechanics

**Level 3: Quantum Leap** (Advanced)
- Length: 7000 units (~90 seconds)
- All 7 game modes featured
- Speed variations
- Moving obstacles
- Complex jump sequences
- 8 collectible coins

### Controls

- **Keyboard**: 
  - `Space` or `↑ Arrow` - Jump/Fly/Activate
  - `ESC` - Pause game
  
- **Mouse**: 
  - Click anywhere - Jump/Fly/Activate
  
- **Touch** (Mobile): 
  - Tap anywhere - Jump/Fly/Activate

### Performance

- **Target**: 60 FPS
- **Rendering**: HTML5 Canvas with RequestAnimationFrame
- **Optimization**: 
  - Efficient collision detection
  - Object pooling for particles
  - Optimized rendering pipeline
  - Minimal state updates

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

### Technology Stack
- **HTML5**: Structure and Canvas element
- **CSS3**: Styling, animations, and responsive design
- **JavaScript (ES6+)**: Game logic and physics
- **Web Audio API**: Procedural sound generation
- **Canvas API**: 2D rendering
- **RequestAnimationFrame**: Smooth 60fps game loop

### Browser Compatibility
Tested and working in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requires modern JavaScript features:
- ES6 Classes
- Arrow functions
- Canvas API
- Web Audio API
- RequestAnimationFrame

## How to Run

Simply open `index.html` in a modern web browser. No build process, server, or dependencies required!

### Development
1. Clone the repository
2. Open `index.html` in a browser
3. Edit files and refresh to see changes

## How to Play

1. **Select a level** from the main menu
2. **Jump/Fly** by clicking, pressing Space, or tapping
3. **Avoid obstacles** (spikes and sawblades)
4. **Land on platforms** to continue
5. **Click near orbs** to activate them for extra jumps
6. **Collect coins** for bonus points
7. **Pass through portals** to change game modes
8. **Reach the end** to complete the level!

### Tips
- In **Ship mode**, hold to go up, release to go down
- In **Ball mode**, tap to flip gravity
- In **Wave mode**, hold for up diagonal, release for down diagonal
- In **Practice mode**, you'll respawn at checkpoints instead of the start
- Watch the progress bar to see how far you've come!

## Physics Reference

All physics values carefully tuned for responsive gameplay:

| Parameter | Value | Description |
|-----------|-------|-------------|
| Gravity | 0.958 | Base gravity constant |
| Jump Force (Cube) | -11.5 | Cube jump velocity |
| Scroll Speed (1x) | 5.77 px/frame | 311 pixels/second at 60fps |
| Rotation Speed | 6°/frame | 90° per jump cycle |
| Ship Gravity | 45% | Lighter for flying |
| Ball Gravity | 85% | Bouncy feel |
| Wave Gravity | 60% | Diagonal movement |
| UFO Gravity | 75% | Precise control |
| Robot Jump | 130% | Higher jumps |
| Spider Jump | 150% | Teleport-style |

## Credits

Created as an original rhythm-based platformer game showcasing HTML5 Canvas capabilities and precise game physics.

### Technologies Used
- Pure HTML5/CSS3/JavaScript
- Web Audio API for procedural audio
- Canvas API for 2D rendering
- No external libraries or frameworks

## License

This is an original educational project demonstrating game development with web technologies.

---

**Made with ❤️ using vanilla JavaScript**
