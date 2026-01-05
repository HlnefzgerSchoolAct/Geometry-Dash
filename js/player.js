// Player Class - Handles player physics, rendering, and states
class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocityY = 0;
        this.velocityX = 0;
        this.gravity = 0.8;
        this.jumpForce = -15;
        this.rotation = 0;
        this.isGrounded = false;
        this.isDead = false;
        
        // Game modes
        this.mode = 'cube'; // cube, ship, ball, wave
        this.isFlipped = false; // For ball mode gravity flip
        
        // Trail particles
        this.trail = [];
        this.maxTrailLength = 20;
        
        // Colors
        this.color = '#00ff88';
        this.trailColor = 'rgba(0, 255, 136, 0.5)';
        
        // Death particles
        this.deathParticles = [];
    }

    jump() {
        if (this.isDead) return;
        
        if (this.mode === 'cube') {
            if (this.isGrounded) {
                this.velocityY = this.jumpForce;
                this.isGrounded = false;
                audioManager.playJump();
            }
        } else if (this.mode === 'ship') {
            this.velocityY = this.jumpForce * 0.6;
            audioManager.playJump();
        } else if (this.mode === 'ball') {
            this.isFlipped = !this.isFlipped;
            this.velocityY = this.isFlipped ? Math.abs(this.jumpForce) : this.jumpForce;
            audioManager.playJump();
        } else if (this.mode === 'wave') {
            this.velocityY = this.jumpForce * 0.5;
        }
    }

    update(groundY, obstacles, orbs, coins, camera) {
        if (this.isDead) {
            this.updateDeathParticles();
            return;
        }

        // Apply gravity based on mode
        if (this.mode === 'cube' || this.mode === 'ball') {
            if (this.isFlipped) {
                this.velocityY += this.gravity;
            } else {
                this.velocityY += this.gravity;
            }
        } else if (this.mode === 'ship' || this.mode === 'wave') {
            this.velocityY += this.gravity * 0.5;
        }

        // Update position
        this.y += this.velocityY;

        // Ground collision
        if (this.y + this.size >= groundY) {
            this.y = groundY - this.size;
            this.velocityY = 0;
            this.isGrounded = true;
            
            if (this.mode === 'cube') {
                this.rotation = Math.round(this.rotation / 90) * 90;
            }
        } else {
            this.isGrounded = false;
        }

        // Ceiling collision
        if (this.y <= 0) {
            this.y = 0;
            this.velocityY = 0;
            
            if (this.mode === 'cube' && this.isFlipped) {
                this.isGrounded = true;
            }
        }

        // Rotation for cube mode
        if (this.mode === 'cube' && !this.isGrounded) {
            this.rotation += 5;
        }

        // Update trail
        this.trail.push({
            x: this.x - camera.x,
            y: this.y,
            alpha: 1
        });
        
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Fade trail
        this.trail.forEach(particle => {
            particle.alpha *= 0.95;
        });

        // Check collisions with obstacles
        this.checkObstacleCollisions(obstacles, camera);
        
        // Check orb collisions
        this.checkOrbCollisions(orbs, camera);
        
        // Check coin collisions
        this.checkCoinCollisions(coins, camera);
    }

    checkObstacleCollisions(obstacles, camera) {
        for (let obstacle of obstacles) {
            const obstacleScreenX = obstacle.x - camera.x;
            
            if (this.collidesWith(obstacleScreenX, obstacle.y, obstacle.width, obstacle.height)) {
                if (obstacle.type === 'spike' || obstacle.type === 'sawblade') {
                    this.die();
                    return;
                } else if (obstacle.type === 'block') {
                    // Platform collision - land on top
                    if (this.velocityY > 0 && this.y + this.size - this.velocityY <= obstacle.y) {
                        this.y = obstacle.y - this.size;
                        this.velocityY = 0;
                        this.isGrounded = true;
                    }
                }
            }
        }
    }

    checkOrbCollisions(orbs, camera) {
        for (let orb of orbs) {
            if (orb.used) continue;
            
            const orbScreenX = orb.x - camera.x;
            
            if (this.collidesWith(orbScreenX, orb.y, orb.size, orb.size)) {
                if (orb.requiresClick && !orb.clicked) {
                    // Orb is ready to be clicked
                    orb.isNear = true;
                } else if (!orb.requiresClick || orb.clicked) {
                    orb.activate(this);
                    orb.used = true;
                    audioManager.playOrb();
                }
            } else {
                orb.isNear = false;
            }
        }
    }

    checkCoinCollisions(coins, camera) {
        for (let coin of coins) {
            if (coin.collected) continue;
            
            const coinScreenX = coin.x - camera.x;
            
            if (this.collidesWith(coinScreenX, coin.y, coin.size, coin.size)) {
                coin.collected = true;
                audioManager.playCoin();
            }
        }
    }

    collidesWith(x, y, width, height) {
        // Simple AABB collision
        return this.x < x + width &&
               this.x + this.size > x &&
               this.y < y + height &&
               this.y + this.size > y;
    }

    die() {
        if (this.isDead) return;
        
        this.isDead = true;
        audioManager.playDeath();
        
        // Create death particles
        for (let i = 0; i < 20; i++) {
            this.deathParticles.push({
                x: this.x + this.size / 2,
                y: this.y + this.size / 2,
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: (Math.random() - 0.5) * 10,
                size: Math.random() * 5 + 2,
                alpha: 1,
                color: this.color
            });
        }
    }

    updateDeathParticles() {
        this.deathParticles.forEach(particle => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += 0.3; // Gravity
            particle.alpha *= 0.96;
        });
        
        this.deathParticles = this.deathParticles.filter(p => p.alpha > 0.01);
    }

    render(ctx) {
        if (this.isDead) {
            this.renderDeathParticles(ctx);
            return;
        }

        // Render trail
        this.trail.forEach(particle => {
            ctx.fillStyle = `rgba(0, 255, 136, ${particle.alpha * 0.5})`;
            ctx.fillRect(particle.x, particle.y, this.size * 0.7, this.size * 0.7);
        });

        // Save context for rotation
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        
        if (this.mode === 'cube') {
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Draw cube with glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            
            // Inner square
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(-this.size / 3, -this.size / 3, this.size * 2 / 3, this.size * 2 / 3);
            
        } else if (this.mode === 'ship') {
            // Draw ship triangle
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ccff';
            ctx.fillStyle = '#00ccff';
            ctx.beginPath();
            ctx.moveTo(this.size / 2, 0);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.lineTo(-this.size / 2, -this.size / 2);
            ctx.closePath();
            ctx.fill();
            
        } else if (this.mode === 'ball') {
            // Draw ball circle
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff00ff';
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (this.mode === 'wave') {
            // Draw wave shape
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffff00';
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.moveTo(-this.size / 2, 0);
            ctx.lineTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, 0);
            ctx.lineTo(0, this.size / 2);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }

    renderDeathParticles(ctx) {
        this.deathParticles.forEach(particle => {
            ctx.fillStyle = `rgba(0, 255, 136, ${particle.alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = particle.color;
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        });
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityY = 0;
        this.velocityX = 0;
        this.rotation = 0;
        this.isGrounded = false;
        this.isDead = false;
        this.trail = [];
        this.deathParticles = [];
        this.mode = 'cube';
        this.isFlipped = false;
    }

    changeMode(newMode) {
        this.mode = newMode;
        
        // Update color based on mode
        if (newMode === 'cube') this.color = '#00ff88';
        else if (newMode === 'ship') this.color = '#00ccff';
        else if (newMode === 'ball') this.color = '#ff00ff';
        else if (newMode === 'wave') this.color = '#ffff00';
    }
}
