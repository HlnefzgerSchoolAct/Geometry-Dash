// Main Game Logic
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Game state
        this.state = 'menu'; // menu, playing, paused, dead
        this.currentLevelIndex = 0;
        this.currentLevel = null;
        this.practiceMode = false;
        this.checkpoints = [];
        this.lastCheckpointIndex = 0;
        
        // Player
        this.player = null;
        
        // Camera
        this.camera = { x: 0, y: 0 };
        this.scrollSpeed = 5.77; // Shape Dash 1x speed (approximately 311 pixels/second at 60fps)
        this.cameraShake = { x: 0, y: 0, intensity: 0 };
        
        // Game stats
        this.attemptCount = 0;
        this.coinsCollected = 0;
        
        // Input handling
        this.keys = {};
        this.mouseDown = false;
        this.touchActive = false;
        
        this.setupEventListeners();
        
        // Animation
        this.animationId = null;
        this.lastTime = 0;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (this.state === 'playing') {
                if (e.code === 'Space' || e.code === 'ArrowUp') {
                    e.preventDefault();
                    this.player.jump();
                    
                    // Click orbs if near
                    if (this.currentLevel) {
                        this.currentLevel.orbs.forEach(orb => {
                            if (orb.isNear) orb.onClick();
                        });
                    }
                }
                
                if (e.code === 'Escape') {
                    this.togglePause();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouseDown = true;
            
            if (this.state === 'playing') {
                this.player.jump();
                
                // Click orbs
                if (this.currentLevel) {
                    this.currentLevel.orbs.forEach(orb => {
                        if (orb.isNear) orb.onClick();
                    });
                }
            }
            
            // Initialize audio on first click
            audioManager.init();
        });

        this.canvas.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });

        // Touch
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.touchActive = true;
            
            if (this.state === 'playing') {
                this.player.jump();
                
                // Click orbs
                if (this.currentLevel) {
                    this.currentLevel.orbs.forEach(orb => {
                        if (orb.isNear) orb.onClick();
                    });
                }
            }
            
            // Initialize audio on first touch
            audioManager.init();
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touchActive = false;
        });
    }

    startLevel(levelIndex) {
        this.currentLevelIndex = levelIndex;
        this.currentLevel = createLevelObjects(LEVELS[levelIndex]);
        
        // Initialize player
        const groundY = this.currentLevel.groundY;
        this.player = new Player(100, groundY - 40, 30);
        
        // Reset camera
        this.camera.x = 0;
        
        // Reset stats
        this.attemptCount++;
        this.coinsCollected = 0;
        this.lastCheckpointIndex = 0;
        
        // Update UI
        document.getElementById('attemptCount').textContent = this.attemptCount;
        document.getElementById('progressPercent').textContent = '0';
        document.getElementById('progressFill').style.width = '0%';
        
        // Hide menus
        document.getElementById('mainMenu').classList.remove('active');
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('gameContainer').classList.remove('hidden');
        document.getElementById('deathScreen').classList.add('hidden');
        document.getElementById('completeScreen').classList.add('hidden');
        
        this.state = 'playing';
        
        // Start game loop if not running
        if (!this.animationId) {
            this.lastTime = performance.now();
            this.gameLoop();
        }
        
        // Start background music
        if (audioManager.initialized && !this.musicStarted) {
            audioManager.startBackgroundMusic();
            this.musicStarted = true;
        }
    }

    restartLevel() {
        if (!this.currentLevel) return;
        
        const groundY = this.currentLevel.groundY;
        
        if (this.practiceMode && this.checkpoints.length > 0) {
            // Restart from last checkpoint
            const checkpoint = this.checkpoints[this.lastCheckpointIndex];
            this.player.reset(checkpoint.x, checkpoint.y);
            this.camera.x = checkpoint.cameraX;
        } else {
            // Full restart
            this.player.reset(100, groundY - 40);
            this.camera.x = 0;
            this.attemptCount++;
        }
        
        // Reset level objects
        this.currentLevel.orbs.forEach(orb => {
            orb.used = false;
            orb.clicked = false;
        });
        this.currentLevel.coins.forEach(coin => coin.collected = false);
        this.currentLevel.portals.forEach(portal => portal.used = false);
        
        // Update UI
        document.getElementById('attemptCount').textContent = this.attemptCount;
        document.getElementById('deathScreen').classList.add('hidden');
        
        this.state = 'playing';
    }

    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            document.getElementById('pauseMenu').classList.remove('hidden');
            document.getElementById('pauseMenu').classList.add('active');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            document.getElementById('pauseMenu').classList.add('hidden');
            document.getElementById('pauseMenu').classList.remove('active');
        }
    }

    exitToMenu() {
        this.state = 'menu';
        document.getElementById('gameContainer').classList.add('hidden');
        document.getElementById('mainMenu').classList.remove('hidden');
        document.getElementById('mainMenu').classList.add('active');
        document.getElementById('pauseMenu').classList.add('hidden');
        document.getElementById('deathScreen').classList.add('hidden');
        document.getElementById('completeScreen').classList.add('hidden');
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    update(deltaTime) {
        if (this.state !== 'playing') return;
        if (!this.currentLevel || !this.player) return;

        // Update camera (scroll right)
        this.camera.x += this.scrollSpeed;

        // Update camera shake
        if (this.cameraShake.intensity > 0) {
            this.cameraShake.x = (Math.random() - 0.5) * this.cameraShake.intensity;
            this.cameraShake.y = (Math.random() - 0.5) * this.cameraShake.intensity;
            this.cameraShake.intensity *= 0.9; // Decay
            if (this.cameraShake.intensity < 0.1) {
                this.cameraShake.intensity = 0;
                this.cameraShake.x = 0;
                this.cameraShake.y = 0;
            }
        }

        // Update player
        this.player.update(
            this.currentLevel.groundY,
            this.currentLevel.obstacles,
            this.currentLevel.orbs,
            this.currentLevel.coins,
            this.camera
        );

        // Check portals
        this.currentLevel.portals.forEach(portal => {
            portal.checkCollision(this.player, this.camera);
        });

        // Handle continuous jump for ship/wave mode
        if ((this.player.mode === 'ship' || this.player.mode === 'wave') && 
            (this.mouseDown || this.touchActive || this.keys['Space'] || this.keys['ArrowUp'])) {
            this.player.jump();
        }

        // Update progress
        const progress = Math.min(100, (this.camera.x / this.currentLevel.length) * 100);
        document.getElementById('progressPercent').textContent = Math.floor(progress);
        document.getElementById('progressFill').style.width = progress + '%';

        // Practice mode checkpoints
        if (this.practiceMode && Math.floor(this.camera.x / 500) > this.lastCheckpointIndex) {
            this.lastCheckpointIndex = Math.floor(this.camera.x / 500);
            this.checkpoints.push({
                x: this.player.x,
                y: this.player.y,
                cameraX: this.camera.x
            });
        }

        // Check if player died
        if (this.player.isDead && this.player.deathParticles.length === 0) {
            this.handleDeath();
        }

        // Check level completion
        if (this.camera.x >= this.currentLevel.length) {
            this.handleLevelComplete();
        }

        // Count collected coins
        this.coinsCollected = this.currentLevel.coins.filter(c => c.collected).length;
    }

    handleDeath() {
        this.state = 'dead';
        this.cameraShake.intensity = 15; // Trigger screen shake
        const progress = Math.floor((this.camera.x / this.currentLevel.length) * 100);
        document.getElementById('deathProgress').textContent = progress;
        document.getElementById('deathScreen').classList.remove('hidden');
    }

    handleLevelComplete() {
        this.state = 'complete';
        
        // Update complete screen stats
        document.getElementById('completeAttempts').textContent = this.attemptCount;
        document.getElementById('completeCoins').textContent = this.coinsCollected;
        document.getElementById('totalCoins').textContent = this.currentLevel.coins.length;
        
        // Show complete screen
        document.getElementById('completeScreen').classList.remove('hidden');
        
        // Play completion sound (reuse coin sound for now)
        audioManager.playCoin();
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = this.currentLevel ? this.currentLevel.backgroundColor : '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.currentLevel || !this.player) return;

        // Apply camera shake
        this.ctx.save();
        this.ctx.translate(this.cameraShake.x, this.cameraShake.y);

        // Draw grid background
        this.drawGrid();

        // Draw ground
        this.drawGround();

        // Render obstacles
        this.currentLevel.obstacles.forEach(obstacle => {
            obstacle.render(this.ctx, this.camera);
        });

        // Render portals
        this.currentLevel.portals.forEach(portal => {
            portal.render(this.ctx, this.camera);
        });

        // Render orbs
        this.currentLevel.orbs.forEach(orb => {
            orb.render(this.ctx, this.camera);
        });

        // Render coins
        this.currentLevel.coins.forEach(coin => {
            coin.render(this.ctx, this.camera);
        });

        // Render player
        this.player.render(this.ctx);

        // Draw checkpoints in practice mode
        if (this.practiceMode) {
            this.checkpoints.forEach((checkpoint, index) => {
                const screenX = checkpoint.cameraX - this.camera.x + checkpoint.x;
                this.ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                this.ctx.fillRect(screenX, 0, 5, this.canvas.height);
                
                this.ctx.fillStyle = '#ffff00';
                this.ctx.font = '14px Arial';
                this.ctx.fillText(`CP${index + 1}`, screenX + 10, 30);
            });
        }

        // Restore context after camera shake
        this.ctx.restore();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        const gridSize = 50;
        const offsetX = this.camera.x % gridSize;

        // Vertical lines
        for (let x = -offsetX; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawGround() {
        const groundY = this.currentLevel.groundY;
        
        // Ground line - white line
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 4;
        this.ctx.shadowBlur = 0;
        this.ctx.beginPath();
        this.ctx.moveTo(0, groundY);
        this.ctx.lineTo(this.canvas.width, groundY);
        this.ctx.stroke();
        
        // Ground fill - darker with subtle pattern
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, groundY, this.canvas.width, this.canvas.height - groundY);
        
        // Ground grid pattern
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        const gridSize = 30;
        const offsetX = this.camera.x % gridSize;
        
        for (let x = -offsetX; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, groundY);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
    }

    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Global game instance
let game;

// Menu functions (called from HTML)
function selectLevel(levelIndex) {
    if (!game) {
        game = new Game();
    }
    game.startLevel(levelIndex);
}

function togglePracticeMode() {
    if (!game) {
        game = new Game();
    }
    game.practiceMode = !game.practiceMode;
    document.getElementById('practiceStatus').textContent = game.practiceMode ? 'ON' : 'OFF';
}

function togglePause() {
    if (game) {
        game.togglePause();
    }
}

function restartLevel() {
    if (game) {
        game.restartLevel();
    }
}

function exitToMenu() {
    if (game) {
        game.exitToMenu();
    }
}

// Initialize game on page load
window.addEventListener('load', () => {
    game = new Game();
});
