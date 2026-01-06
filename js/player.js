// Player Class - Handles player physics, rendering, and states
class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.velocityY = 0;
        this.velocityX = 0;
        
        // Physics values
        this.gravity = 0.958;
        this.jumpForce = -11.5;
        this.rotation = 0;
        this.rotationSpeed = 6; // Degrees per frame when jumping
        this.isGrounded = false;
        this.isDead = false;
        
        // Game modes
        this.mode = 'cube'; // cube, ship, ball, wave, ufo, robot, spider
        this.isFlipped = false; // For ball mode gravity flip
        
        // Trail particles
        this.trail = [];
        this.maxTrailLength = 20;
        
        // Colors - Default bright colors
        this.primaryColor = '#00ff00'; // Bright green
        this.secondaryColor = '#00cc00'; // Darker green
        this.trailColor = 'rgba(0, 255, 0, 0.5)';
        
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
            this.velocityY = this.jumpForce * 0.45; // Ship has lighter gravity
            audioManager.playJump();
        } else if (this.mode === 'ball') {
            this.isFlipped = !this.isFlipped;
            this.velocityY = this.isFlipped ? Math.abs(this.jumpForce) * 0.9 : this.jumpForce * 0.9;
            audioManager.playJump();
        } else if (this.mode === 'wave') {
            this.velocityY = this.jumpForce * 0.6; // Wave mode control
        } else if (this.mode === 'ufo') {
            if (!this.ufoJumpCooldown) {
                this.velocityY = this.jumpForce * 1.2;
                this.ufoJumpCooldown = 15; // Frames between jumps
                audioManager.playJump();
            }
        } else if (this.mode === 'robot') {
            if (this.isGrounded) {
                this.velocityY = this.jumpForce * 1.3; // Robot higher jump
                this.isGrounded = false;
                audioManager.playJump();
            }
        } else if (this.mode === 'spider') {
            // Spider teleports to ceiling/floor
            if (this.isGrounded) {
                this.velocityY = this.jumpForce * 1.5;
                audioManager.playJump();
            }
        }
    }

    update(groundY, obstacles, orbs, coins, camera) {
        if (this.isDead) {
            this.updateDeathParticles();
            return;
        }

        // Apply gravity based on mode
        if (this.mode === 'cube' || this.mode === 'robot') {
            this.velocityY += this.gravity;
        } else if (this.mode === 'ball') {
            if (this.isFlipped) {
                this.velocityY += this.gravity * 0.85;
            } else {
                this.velocityY += this.gravity * 0.85;
            }
        } else if (this.mode === 'ship') {
            this.velocityY += this.gravity * 0.45; // Ship has much lighter gravity
        } else if (this.mode === 'wave') {
            this.velocityY += this.gravity * 0.6;
        } else if (this.mode === 'ufo') {
            this.velocityY += this.gravity * 0.75;
            if (this.ufoJumpCooldown > 0) this.ufoJumpCooldown--;
        } else if (this.mode === 'spider') {
            this.velocityY += this.gravity * 1.1;
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

        // Rotation for cube mode - exactly 90 degrees per jump cycle
        if (this.mode === 'cube' && !this.isGrounded) {
            this.rotation += this.rotationSpeed;
        } else if (this.mode === 'robot' && !this.isGrounded) {
            this.rotation += this.rotationSpeed * 0.5;
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
        this.trail.forEach((particle, index) => {
            const alpha = particle.alpha * (index / this.trail.length);
            ctx.fillStyle = `rgba(0, 255, 0, ${alpha * 0.4})`;
            ctx.fillRect(particle.x, particle.y + this.size * 0.15, this.size * 0.8, this.size * 0.7);
        });

        // Save context for rotation
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        
        if (this.mode === 'cube') {
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Draw cube with outline and inner square
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.primaryColor;
            
            // Outer cube
            ctx.fillStyle = this.primaryColor;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            
            // Outline
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
            
            // Inner square (darker)
            ctx.fillStyle = this.secondaryColor;
            ctx.fillRect(-this.size / 2.5, -this.size / 2.5, this.size / 1.25, this.size / 1.25);
            
        } else if (this.mode === 'ship') {
            // Draw ship - triangle with fire trail
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ffff';
            ctx.fillStyle = '#00ffff';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(this.size / 2, 0);
            ctx.lineTo(-this.size / 2, this.size / 3);
            ctx.lineTo(-this.size / 3, 0);
            ctx.lineTo(-this.size / 2, -this.size / 3);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Fire trail
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.moveTo(-this.size / 2, -this.size / 4);
            ctx.lineTo(-this.size, 0);
            ctx.lineTo(-this.size / 2, this.size / 4);
            ctx.closePath();
            ctx.fill();
            
        } else if (this.mode === 'ball') {
            // Draw ball - circle with rotation indicator
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff00ff';
            
            // Outer circle
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // White outline
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Inner circle
            ctx.fillStyle = '#cc00cc';
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Rotation line
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.size / 2, 0);
            ctx.stroke();
            
        } else if (this.mode === 'wave') {
            // Draw wave - diamond shape with trail
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffff00';
            ctx.fillStyle = '#ffff00';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(-this.size / 2, 0);
            ctx.lineTo(0, -this.size / 3);
            ctx.lineTo(this.size / 2, 0);
            ctx.lineTo(0, this.size / 3);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
        } else if (this.mode === 'ufo') {
            // Draw UFO - dome shape
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0088ff';
            ctx.fillStyle = '#0088ff';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            // Top dome
            ctx.beginPath();
            ctx.arc(0, -this.size / 4, this.size / 2, 0, Math.PI, true);
            ctx.fill();
            ctx.stroke();
            
            // Bottom base
            ctx.fillStyle = '#0066cc';
            ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 3);
            ctx.strokeRect(-this.size / 2, -this.size / 4, this.size, this.size / 3);
            
        } else if (this.mode === 'robot') {
            // Draw robot - rectangular with legs
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff8800';
            ctx.fillStyle = '#ff8800';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            // Body
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.8);
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.8);
            
            // Eyes
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-this.size / 3, -this.size / 3, this.size / 6, this.size / 6);
            ctx.fillRect(this.size / 6, -this.size / 3, this.size / 6, this.size / 6);
            
        } else if (this.mode === 'spider') {
            // Draw spider - angular shape with legs
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#aa00ff';
            ctx.fillStyle = '#aa00ff';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            // Body
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, 0);
            ctx.lineTo(0, this.size / 2);
            ctx.lineTo(-this.size / 2, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
        
        ctx.restore();
    }

    renderDeathParticles(ctx) {
        // Death particle pattern - square particles exploding outward
        this.deathParticles.forEach(particle => {
            ctx.fillStyle = `rgba(0, 255, 0, ${particle.alpha})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ff00';
            
            // Draw small square particles
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.velocityX / 5); // Slight rotation based on velocity
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();
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
        this.ufoJumpCooldown = 0;
        
        // Update colors based on mode
        if (newMode === 'cube') {
            this.primaryColor = '#00ff00';
            this.secondaryColor = '#00cc00';
        } else if (newMode === 'ship') {
            this.primaryColor = '#00ffff';
            this.secondaryColor = '#00cccc';
        } else if (newMode === 'ball') {
            this.primaryColor = '#ff00ff';
            this.secondaryColor = '#cc00cc';
        } else if (newMode === 'wave') {
            this.primaryColor = '#ffff00';
            this.secondaryColor = '#cccc00';
        } else if (newMode === 'ufo') {
            this.primaryColor = '#0088ff';
            this.secondaryColor = '#0066cc';
        } else if (newMode === 'robot') {
            this.primaryColor = '#ff8800';
            this.secondaryColor = '#cc6600';
        } else if (newMode === 'spider') {
            this.primaryColor = '#aa00ff';
            this.secondaryColor = '#8800cc';
        }
    }
}
