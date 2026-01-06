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
        this.gravityFlipped = false; // For gravity portals
        this.isMini = false; // For size portals
        
        // Trail particles
        this.trail = [];
        this.maxTrailLength = 20;
        
        // Colors - Default bright colors
        this.primaryColor = '#00ff00'; // Bright green
        this.secondaryColor = '#00cc00'; // Darker green
        this.trailColor = 'rgba(0, 255, 0, 0.5)';
        
        // Death particles
        this.deathParticles = [];
        
        // Landing/jumping particles
        this.landingParticles = [];
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

        // Apply gravity based on mode and gravity flip
        let gravityMultiplier = this.gravityFlipped ? -1 : 1;
        
        if (this.mode === 'cube' || this.mode === 'robot') {
            this.velocityY += this.gravity * gravityMultiplier;
        } else if (this.mode === 'ball') {
            this.velocityY += this.gravity * 0.85 * gravityMultiplier;
        } else if (this.mode === 'ship') {
            this.velocityY += this.gravity * 0.45 * gravityMultiplier; // Ship has much lighter gravity
        } else if (this.mode === 'wave') {
            this.velocityY += this.gravity * 0.6 * gravityMultiplier;
        } else if (this.mode === 'ufo') {
            this.velocityY += this.gravity * 0.75 * gravityMultiplier;
            if (this.ufoJumpCooldown > 0) this.ufoJumpCooldown--;
        } else if (this.mode === 'spider') {
            this.velocityY += this.gravity * 1.1 * gravityMultiplier;
        }

        // Update position
        this.y += this.velocityY;

        // Ground collision (handle both normal and flipped gravity)
        if (!this.gravityFlipped) {
            if (this.y + this.size >= groundY) {
                this.y = groundY - this.size;
                this.velocityY = 0;
                
                // Create landing particles when landing (transitioning from air to ground)
                if (!this.isGrounded && this.mode === 'cube') {
                    this.createLandingParticles();
                }
                
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
            }
        } else {
            // Flipped gravity - ceiling becomes ground
            if (this.y <= 0) {
                this.y = 0;
                this.velocityY = 0;
                this.isGrounded = true;
                
                if (this.mode === 'cube') {
                    this.rotation = Math.round(this.rotation / 90) * 90;
                }
            } else {
                this.isGrounded = false;
            }
            
            // Floor becomes ceiling
            if (this.y + this.size >= groundY) {
                this.y = groundY - this.size;
                this.velocityY = 0;
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

        // Update landing particles
        this.updateLandingParticles();

        // Check collisions with obstacles
        this.checkObstacleCollisions(obstacles, camera);
        
        // Check orb collisions
        this.checkOrbCollisions(orbs, camera);
        
        // Check coin collisions
        this.checkCoinCollisions(coins, camera);
    }

    createLandingParticles() {
        // Create small particles when landing
        for (let i = 0; i < 5; i++) {
            this.landingParticles.push({
                x: this.x + Math.random() * this.size,
                y: this.y + this.size,
                velocityX: (Math.random() - 0.5) * 3,
                velocityY: -Math.random() * 3,
                size: Math.random() * 3 + 1,
                alpha: 1,
                color: this.primaryColor
            });
        }
    }

    updateLandingParticles() {
        this.landingParticles.forEach(particle => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += 0.3; // Gravity
            particle.alpha *= 0.94;
        });
        
        this.landingParticles = this.landingParticles.filter(p => p.alpha > 0.01);
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
        
        // Create iconic GD circular explosion pattern with particles in a ring
        const particleCount = 40;
        const rings = 3; // Multiple rings for better effect
        
        for (let ring = 0; ring < rings; ring++) {
            const ringParticles = particleCount / rings;
            for (let i = 0; i < ringParticles; i++) {
                const angle = (i / ringParticles) * Math.PI * 2;
                const speed = 6 + ring * 2 + Math.random() * 3;
                const delay = ring * 0.02; // Slight delay between rings
                
                this.deathParticles.push({
                    x: this.x + this.size / 2,
                    y: this.y + this.size / 2,
                    velocityX: Math.cos(angle) * speed,
                    velocityY: Math.sin(angle) * speed,
                    size: (4 - ring) + Math.random() * 4,
                    alpha: 1 - (ring * 0.2),
                    rotation: angle,
                    rotationSpeed: (Math.random() - 0.5) * 0.4,
                    color: ring === 0 ? '#ffffff' : ring === 1 ? this.primaryColor : this.secondaryColor,
                    age: 0,
                    delay: delay
                });
            }
        }
        
        // Add center flash particles
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            this.deathParticles.push({
                x: this.x + this.size / 2,
                y: this.y + this.size / 2,
                velocityX: Math.cos(angle) * 12,
                velocityY: Math.sin(angle) * 12,
                size: 8,
                alpha: 1,
                rotation: angle,
                rotationSpeed: 0.5,
                color: '#ffffff',
                age: 0,
                delay: 0
            });
        }
    }

    updateDeathParticles() {
        this.deathParticles.forEach(particle => {
            particle.age += 0.016; // Approximately 60fps
            
            // Only update if delay has passed
            if (particle.age >= particle.delay) {
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;
                particle.velocityY += 0.3; // Gravity
                particle.velocityX *= 0.99; // Air resistance
                particle.rotation += particle.rotationSpeed;
                particle.alpha *= 0.96; // Slower fade for better visibility
            }
        });
        
        this.deathParticles = this.deathParticles.filter(p => p.alpha > 0.01);
    }

    render(ctx) {
        if (this.isDead) {
            this.renderDeathParticles(ctx);
            return;
        }

        // Render landing particles
        this.renderLandingParticles(ctx);

        // Render trail with gradient fade
        this.trail.forEach((particle, index) => {
            const alpha = particle.alpha * (index / this.trail.length);
            const gradient = ctx.createLinearGradient(
                particle.x, particle.y,
                particle.x + this.size * 0.8, particle.y + this.size * 0.7
            );
            gradient.addColorStop(0, `rgba(0, 255, 0, ${alpha * 0.6})`);
            gradient.addColorStop(0.5, `rgba(125, 255, 125, ${alpha * 0.4})`);
            gradient.addColorStop(1, `rgba(0, 255, 0, 0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(particle.x, particle.y + this.size * 0.15, this.size * 0.8, this.size * 0.7);
        });

        // Save context for rotation
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        
        if (this.mode === 'cube') {
            ctx.rotate(this.rotation * Math.PI / 180);
            
            // Multi-layer glow effect - more intense
            ctx.shadowBlur = 30;
            ctx.shadowColor = this.primaryColor;
            
            // Outer glow layer (larger)
            ctx.fillStyle = this.primaryColor;
            ctx.globalAlpha = 0.4;
            ctx.fillRect(-this.size / 1.6, -this.size / 1.6, this.size * 1.25, this.size * 1.25);
            ctx.globalAlpha = 1;
            
            // 3D depth effect - bottom shadow
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(-this.size / 2 + 4, -this.size / 2 + 4, this.size, this.size);
            
            // Main cube with gradient for depth
            const cubeGradient = ctx.createLinearGradient(
                -this.size / 2, -this.size / 2,
                this.size / 2, this.size / 2
            );
            cubeGradient.addColorStop(0, this.primaryColor);
            cubeGradient.addColorStop(1, this.secondaryColor);
            
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.primaryColor;
            ctx.fillStyle = cubeGradient;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            
            // Strong white outline (GD characteristic)
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#ffffff';
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
            
            // Inner square with slight offset (iconic GD 3D look)
            ctx.shadowBlur = 0;
            ctx.fillStyle = this.secondaryColor;
            const innerSize = this.size / 1.8;
            const offset = 2;
            ctx.fillRect(-innerSize / 2 + offset, -innerSize / 2 + offset, innerSize, innerSize);
            
            // Inner square outline with darker color
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(-innerSize / 2 + offset, -innerSize / 2 + offset, innerSize, innerSize);
            
            // Top highlight for 3D effect
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, 4);
            
        } else if (this.mode === 'ship') {
            // More angular ship design
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00ffff';
            ctx.fillStyle = '#00ffff';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            
            // Angular ship body
            ctx.beginPath();
            ctx.moveTo(this.size / 2, 0);
            ctx.lineTo(-this.size / 3, this.size / 2.5);
            ctx.lineTo(-this.size / 2, this.size / 3);
            ctx.lineTo(-this.size / 2.5, 0);
            ctx.lineTo(-this.size / 2, -this.size / 3);
            ctx.lineTo(-this.size / 3, -this.size / 2.5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Flame trail particles
            for (let i = 0; i < 3; i++) {
                const flameX = -this.size / 2 - i * 8;
                const flameSize = this.size / 3 - i * 3;
                const flameAlpha = 0.8 - i * 0.2;
                
                ctx.fillStyle = i === 0 ? `rgba(255, 200, 0, ${flameAlpha})` : 
                                i === 1 ? `rgba(255, 100, 0, ${flameAlpha})` :
                                         `rgba(255, 50, 0, ${flameAlpha})`;
                ctx.beginPath();
                ctx.moveTo(flameX, -flameSize / 2);
                ctx.lineTo(flameX - flameSize, 0);
                ctx.lineTo(flameX, flameSize / 2);
                ctx.closePath();
                ctx.fill();
            }
            
        } else if (this.mode === 'ball') {
            // Ball with dual-color scheme
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff00ff';
            
            // Outer circle
            ctx.fillStyle = this.primaryColor;
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // White outline
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Inner circle (dual color)
            ctx.fillStyle = this.secondaryColor;
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Characteristic line through center (rotation indicator)
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-this.size / 2, 0);
            ctx.lineTo(this.size / 2, 0);
            ctx.stroke();
            
            // Small circle at center
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (this.mode === 'wave') {
            // Sharper diamond shape
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffff00';
            ctx.fillStyle = '#ffff00';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            
            ctx.beginPath();
            ctx.moveTo(-this.size / 1.8, 0);
            ctx.lineTo(0, -this.size / 2.2);
            ctx.lineTo(this.size / 1.8, 0);
            ctx.lineTo(0, this.size / 2.2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Inner diamond
            ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
            ctx.beginPath();
            ctx.moveTo(-this.size / 3, 0);
            ctx.lineTo(0, -this.size / 4);
            ctx.lineTo(this.size / 3, 0);
            ctx.lineTo(0, this.size / 4);
            ctx.closePath();
            ctx.fill();
            
        } else if (this.mode === 'ufo') {
            // UFO with better details
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#0088ff';
            ctx.fillStyle = '#0088ff';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            
            // Top dome
            ctx.beginPath();
            ctx.arc(0, -this.size / 4, this.size / 2, 0, Math.PI, true);
            ctx.fill();
            ctx.stroke();
            
            // Bottom base
            ctx.fillStyle = '#0066cc';
            ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 3);
            ctx.strokeRect(-this.size / 2, -this.size / 4, this.size, this.size / 3);
            
            // Lights
            for (let i = -1; i <= 1; i++) {
                ctx.fillStyle = '#00ffff';
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(i * this.size / 4, -this.size / 6, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            
        } else if (this.mode === 'robot') {
            // Robot with better details
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff8800';
            ctx.fillStyle = '#ff8800';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            
            // Body
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.8);
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.8);
            
            // Eyes with glow
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#00ffff';
            ctx.fillStyle = '#00ffff';
            ctx.fillRect(-this.size / 3, -this.size / 3, this.size / 6, this.size / 6);
            ctx.fillRect(this.size / 6, -this.size / 3, this.size / 6, this.size / 6);
            
            // Antenna
            ctx.strokeStyle = '#ff8800';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(0, -this.size / 1.5);
            ctx.stroke();
            
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(0, -this.size / 1.5, 3, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (this.mode === 'spider') {
            // Spider with better details
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#aa00ff';
            ctx.fillStyle = '#aa00ff';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            
            // Body
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, 0);
            ctx.lineTo(0, this.size / 2);
            ctx.lineTo(-this.size / 2, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Inner detail
            ctx.fillStyle = '#cc00ff';
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 4);
            ctx.lineTo(this.size / 4, 0);
            ctx.lineTo(0, this.size / 4);
            ctx.lineTo(-this.size / 4, 0);
            ctx.closePath();
            ctx.fill();
            
            // Spider legs (simple)
            ctx.strokeStyle = '#aa00ff';
            ctx.lineWidth = 2;
            for (let i = -1; i <= 1; i += 2) {
                ctx.beginPath();
                ctx.moveTo(i * this.size / 3, -this.size / 4);
                ctx.lineTo(i * this.size / 1.5, -this.size / 2);
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(i * this.size / 3, this.size / 4);
                ctx.lineTo(i * this.size / 1.5, this.size / 2);
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    renderDeathParticles(ctx) {
        // Death particle pattern - iconic GD circular explosion with rings
        this.deathParticles.forEach(particle => {
            // Only render if delay has passed
            if (particle.age < particle.delay) return;
            
            // Create intense glow effect
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 1.5
            );
            
            const color = particle.color;
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${particle.alpha})`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${particle.alpha * 0.6})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.shadowBlur = 20;
            ctx.shadowColor = color;
            
            // Draw rotating square particles with glow
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            
            // Add white outline for extra pop
            ctx.strokeStyle = `rgba(255, 255, 255, ${particle.alpha * 0.8})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            
            ctx.restore();
        });
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    renderLandingParticles(ctx) {
        // Landing particles - small particles when landing
        this.landingParticles.forEach(particle => {
            ctx.fillStyle = `rgba(0, 255, 0, ${particle.alpha})`;
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#00ff00';
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;
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
        this.landingParticles = [];
        this.mode = 'cube';
        this.isFlipped = false;
        this.gravityFlipped = false;
        this.isMini = false;
        this.size = 30; // Reset to normal size
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
