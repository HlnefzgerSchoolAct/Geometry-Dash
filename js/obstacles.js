// Obstacle types and definitions
class Obstacle {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // spike, block, sawblade
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        
        ctx.save();
        
        if (this.type === 'spike') {
            // Sharper spike with gradient from dark to light
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(100, 100, 100, 0.5)';
            
            // Gradient for depth
            const gradient = ctx.createLinearGradient(
                screenX + this.width / 2, this.y,
                screenX + this.width / 2, this.y + this.height
            );
            gradient.addColorStop(0, '#999999');
            gradient.addColorStop(0.5, '#666666');
            gradient.addColorStop(1, '#444444');
            
            ctx.fillStyle = gradient;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            
            // Main spike triangle
            ctx.beginPath();
            ctx.moveTo(screenX + this.width / 2, this.y);
            ctx.lineTo(screenX + this.width, this.y + this.height);
            ctx.lineTo(screenX, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Inner darker triangle for depth
            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.moveTo(screenX + this.width / 2, this.y + this.height * 0.3);
            ctx.lineTo(screenX + this.width * 0.7, this.y + this.height);
            ctx.lineTo(screenX + this.width * 0.3, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
            // Highlight edge
            ctx.strokeStyle = '#aaaaaa';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(screenX + this.width / 2, this.y);
            ctx.lineTo(screenX, this.y + this.height);
            ctx.stroke();
            
        } else if (this.type === 'block') {
            // Block with grid texture and stronger 3D effect
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            
            // Main block face with gradient
            const blockGradient = ctx.createLinearGradient(
                screenX, this.y,
                screenX + this.width, this.y + this.height
            );
            blockGradient.addColorStop(0, '#777777');
            blockGradient.addColorStop(1, '#555555');
            
            ctx.fillStyle = blockGradient;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.fillRect(screenX, this.y, this.width, this.height);
            ctx.strokeRect(screenX, this.y, this.width, this.height);
            
            // Inner grid pattern (characteristic GD block texture)
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            const gridSize = 10;
            
            // Vertical lines
            for (let x = screenX + gridSize; x < screenX + this.width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, this.y);
                ctx.lineTo(x, this.y + this.height);
                ctx.stroke();
            }
            
            // Horizontal lines
            for (let y = this.y + gridSize; y < this.y + this.height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(screenX, y);
                ctx.lineTo(screenX + this.width, y);
                ctx.stroke();
            }
            
            // Highlight top edge
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(screenX, this.y);
            ctx.lineTo(screenX + this.width, this.y);
            ctx.stroke();
            
            // 3D bottom shadow (stronger)
            ctx.fillStyle = '#222222';
            ctx.beginPath();
            ctx.moveTo(screenX, this.y + this.height);
            ctx.lineTo(screenX + this.width, this.y + this.height);
            ctx.lineTo(screenX + this.width + 8, this.y + this.height + 8);
            ctx.lineTo(screenX + 8, this.y + this.height + 8);
            ctx.closePath();
            ctx.fill();
            
            // 3D right shadow (stronger)
            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.moveTo(screenX + this.width, this.y);
            ctx.lineTo(screenX + this.width + 8, this.y + 8);
            ctx.lineTo(screenX + this.width + 8, this.y + this.height + 8);
            ctx.lineTo(screenX + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
        } else if (this.type === 'sawblade') {
            // Smoother rotating sawblade
            const centerX = screenX + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = this.width / 2;
            
            ctx.translate(centerX, centerY);
            ctx.rotate(Date.now() / 80); // Smoother rotation
            
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(100, 100, 100, 0.7)';
            
            // Gradient for blade
            const bladeGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
            bladeGradient.addColorStop(0, '#888888');
            bladeGradient.addColorStop(0.6, '#666666');
            bladeGradient.addColorStop(1, '#444444');
            
            ctx.fillStyle = bladeGradient;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            
            // Draw better spike pattern
            const spikes = 16;
            ctx.beginPath();
            for (let i = 0; i < spikes; i++) {
                const angle = (i / spikes) * Math.PI * 2;
                const nextAngle = ((i + 1) / spikes) * Math.PI * 2;
                const midAngle = (angle + nextAngle) / 2;
                
                const x1 = Math.cos(angle) * radius * 0.65;
                const y1 = Math.sin(angle) * radius * 0.65;
                const x2 = Math.cos(midAngle) * radius * 1.1;
                const y2 = Math.sin(midAngle) * radius * 1.1;
                
                if (i === 0) ctx.moveTo(x1, y1);
                else ctx.lineTo(x1, y1);
                ctx.lineTo(x2, y2);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Center circle with gradient
            const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.35);
            centerGradient.addColorStop(0, '#555555');
            centerGradient.addColorStop(1, '#222222');
            
            ctx.fillStyle = centerGradient;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Center dot
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Orb/Jump Pad
class Orb {
    constructor(x, y, size, type) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.type = type; // yellow, blue, pink
        this.used = false;
        this.requiresClick = type === 'yellow' || type === 'pink';
        this.clicked = false;
        this.isNear = false;
        this.pulsePhase = Math.random() * Math.PI * 2;
    }

    activate(player) {
        if (this.type === 'yellow') {
            player.velocityY = -18;
        } else if (this.type === 'blue') {
            player.velocityY = -12;
        } else if (this.type === 'pink') {
            player.velocityY = -22;
        }
    }

    render(ctx, camera) {
        if (this.used) return;
        
        const screenX = this.x - camera.x;
        const pulse = Math.sin(this.pulsePhase + Date.now() / 300) * 0.15 + 1;
        const radius = this.size / 2 * pulse;
        
        ctx.save();
        
        let color;
        if (this.type === 'yellow') color = '#ffff00';
        else if (this.type === 'blue') color = '#00ccff';
        else if (this.type === 'pink') color = '#ff00ff';
        
        const centerX = screenX + this.size / 2;
        const centerY = this.y + this.size / 2;
        
        // Pulsing ring animation
        const ringPulse = (Date.now() % 2000) / 2000;
        const ringRadius = radius * (1 + ringPulse * 0.8);
        const ringAlpha = (1 - ringPulse) * 0.6;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.globalAlpha = ringAlpha;
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Secondary pulsing ring
        const ring2Pulse = ((Date.now() + 1000) % 2000) / 2000;
        const ring2Radius = radius * (1 + ring2Pulse * 0.8);
        const ring2Alpha = (1 - ring2Pulse) * 0.4;
        
        ctx.globalAlpha = ring2Alpha;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ring2Radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Outer glow
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = color;
        ctx.shadowBlur = 40;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 1.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Main orb with gradient
        const orbGradient = ctx.createRadialGradient(
            centerX - radius * 0.3, centerY - radius * 0.3, 0,
            centerX, centerY, radius
        );
        orbGradient.addColorStop(0, '#ffffff');
        orbGradient.addColorStop(0.3, color);
        orbGradient.addColorStop(1, this.type === 'yellow' ? '#cc9900' : 
                                     this.type === 'blue' ? '#0099cc' : '#cc00cc');
        
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = orbGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // White outline
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner white highlight
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Ring if near and requires click
        if (this.isNear && this.requiresClick) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 4;
            ctx.globalAlpha = Math.sin(Date.now() / 100) * 0.4 + 0.6;
            ctx.shadowBlur = 20;
            ctx.shadowColor = color;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 1.4, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    onClick() {
        if (this.isNear && this.requiresClick && !this.used) {
            this.clicked = true;
        }
    }
}

// Coin
class Coin {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.collected = false;
        this.rotation = 0;
    }

    render(ctx, camera) {
        if (this.collected) return;
        
        const screenX = this.x - camera.x;
        this.rotation += 0.05;
        
        ctx.save();
        ctx.translate(screenX + this.size / 2, this.y + this.size / 2);
        ctx.rotate(this.rotation);
        
        // Outer glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffff00';
        
        // Coin circle
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner detail
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkle
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-2, -this.size / 3, 4, this.size / 6);
        ctx.fillRect(-this.size / 6, -2, this.size / 3, 4);
        
        ctx.restore();
    }
}

// JumpPad - Ground-based jump pads
class JumpPad {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type; // yellow, pink, red
        this.activated = false;
        this.animationTime = 0;
    }

    activate(player) {
        if (this.type === 'yellow') {
            player.velocityY = -16; // Medium jump
        } else if (this.type === 'pink') {
            player.velocityY = -20; // High jump
        } else if (this.type === 'red') {
            player.velocityY = -24; // Very high jump
        }
        this.activated = true;
        this.animationTime = 10; // Frames for animation
    }

    update() {
        if (this.animationTime > 0) {
            this.animationTime--;
        }
        if (this.animationTime === 0) {
            this.activated = false;
        }
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        
        ctx.save();
        
        let color;
        if (this.type === 'yellow') color = '#ffff00';
        else if (this.type === 'pink') color = '#ff00ff';
        else if (this.type === 'red') color = '#ff0000';
        
        // Compression animation when activated
        const compression = this.activated ? (1 - this.animationTime / 10) * 0.3 : 0;
        const compressedHeight = this.height * (1 - compression);
        const offsetY = this.height - compressedHeight;
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        
        // Base platform
        ctx.fillStyle = '#444444';
        ctx.fillRect(screenX, this.y + offsetY, this.width, compressedHeight);
        
        // Colored top with gradient
        const gradient = ctx.createLinearGradient(
            screenX, this.y + offsetY,
            screenX, this.y + offsetY + compressedHeight
        );
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, this.type === 'yellow' ? '#cc9900' : 
                                  this.type === 'pink' ? '#cc00cc' : '#cc0000');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(screenX, this.y + offsetY, this.width, compressedHeight / 2);
        
        // White outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.strokeRect(screenX, this.y + offsetY, this.width, compressedHeight);
        
        // Arrow indicator pointing up
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        ctx.fillStyle = '#ffffff';
        const centerX = screenX + this.width / 2;
        const centerY = this.y + offsetY + compressedHeight / 2;
        const arrowSize = this.width * 0.4;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - arrowSize / 2);
        ctx.lineTo(centerX - arrowSize / 2, centerY + arrowSize / 4);
        ctx.lineTo(centerX + arrowSize / 2, centerY + arrowSize / 4);
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }

    checkCollision(player, camera) {
        const screenX = this.x - camera.x;
        
        // Check if player lands on top of pad (normal gravity) or bottom (flipped gravity)
        if (!this.activated) {
            if (!player.gravityFlipped) {
                // Normal gravity - check landing on top
                if (player.velocityY > 0 &&
                    player.x < screenX + this.width &&
                    player.x + player.size > screenX &&
                    player.y + player.size >= this.y &&
                    player.y + player.size <= this.y + this.height) {
                    
                    this.activate(player);
                    audioManager.playOrb();
                    return true;
                }
            } else {
                // Flipped gravity - check hitting bottom
                if (player.velocityY < 0 &&
                    player.x < screenX + this.width &&
                    player.x + player.size > screenX &&
                    player.y <= this.y + this.height &&
                    player.y >= this.y) {
                    
                    // Apply jump in the flipped direction (positive = downward in flipped gravity)
                    if (this.type === 'yellow') {
                        player.velocityY = 16; // Medium jump (positive for flipped gravity)
                    } else if (this.type === 'pink') {
                        player.velocityY = 20; // High jump
                    } else if (this.type === 'red') {
                        player.velocityY = 24; // Very high jump
                    }
                    this.activated = true;
                    this.animationTime = 10;
                    audioManager.playOrb();
                    return true;
                }
            }
        }
        return false;
    }
}

// DecorationObject - Non-interactive visual elements
class DecorationObject {
    constructor(x, y, size, type, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.type = type; // spike, block, glow_orb, pulse_ring
        this.color = color || '#00ff00';
        this.animationPhase = Math.random() * Math.PI * 2;
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        
        ctx.save();
        ctx.globalAlpha = 0.3; // Semi-transparent for background
        
        if (this.type === 'spike') {
            // Background spike decoration
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            
            ctx.beginPath();
            ctx.moveTo(screenX + this.size / 2, this.y);
            ctx.lineTo(screenX + this.size, this.y + this.size);
            ctx.lineTo(screenX, this.y + this.size);
            ctx.closePath();
            ctx.fill();
            
        } else if (this.type === 'block') {
            // Background block decoration
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.fillRect(screenX, this.y, this.size, this.size);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            ctx.strokeRect(screenX, this.y, this.size, this.size);
            
        } else if (this.type === 'glow_orb') {
            // Pulsing glow orb
            const pulse = Math.sin(this.animationPhase + Date.now() / 400) * 0.3 + 0.7;
            ctx.globalAlpha = 0.2 * pulse;
            
            const gradient = ctx.createRadialGradient(
                screenX + this.size / 2, this.y + this.size / 2, 0,
                screenX + this.size / 2, this.y + this.size / 2, this.size / 2
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(screenX + this.size / 2, this.y + this.size / 2, this.size / 2 * pulse, 0, Math.PI * 2);
            ctx.fill();
            
        } else if (this.type === 'pulse_ring') {
            // Expanding ring effect
            const ringPhase = (Date.now() / 1000 + this.animationPhase) % 2;
            const ringAlpha = (1 - ringPhase / 2) * 0.4;
            const ringRadius = this.size / 2 + (ringPhase * this.size);
            
            ctx.globalAlpha = ringAlpha;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            
            ctx.beginPath();
            ctx.arc(screenX + this.size / 2, this.y + this.size / 2, ringRadius, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
    }
}

// Portal for mode changes, speed changes, gravity changes, and size changes
class Portal {
    constructor(x, y, width, height, mode, portalType = 'mode') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mode = mode; // cube, ship, ball, wave, speed_slow, speed_normal, speed_fast, speed_faster, speed_fastest, gravity_normal, gravity_flip, size_normal, size_mini
        this.portalType = portalType; // 'mode', 'speed', 'gravity', 'size'
        this.used = false;
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        
        ctx.save();
        
        let color;
        // Portal colors based on type
        if (this.portalType === 'speed') {
            if (this.mode === 'speed_slow') color = '#ffaa00'; // Orange for slow
            else if (this.mode === 'speed_normal') color = '#00ff00'; // Green for normal
            else if (this.mode === 'speed_fast') color = '#00ffff'; // Cyan for fast
            else if (this.mode === 'speed_faster') color = '#ff00ff'; // Magenta for faster
            else if (this.mode === 'speed_fastest') color = '#ff0000'; // Red for fastest
        } else if (this.portalType === 'gravity') {
            if (this.mode === 'gravity_normal') color = '#0088ff'; // Blue for normal gravity
            else if (this.mode === 'gravity_flip') color = '#ffff00'; // Yellow for flipped gravity
        } else if (this.portalType === 'size') {
            if (this.mode === 'size_normal') color = '#00ff00'; // Green for normal size
            else if (this.mode === 'size_mini') color = '#ff8800'; // Orange for mini size
        } else {
            // Mode change portals
            if (this.mode === 'cube') color = '#7dff7d'; // Bright green
            else if (this.mode === 'ship') color = '#ff8844'; // Orange
            else if (this.mode === 'ball') color = '#ff44ff'; // Magenta
            else if (this.mode === 'wave') color = '#44bbff'; // Blue
            else if (this.mode === 'ufo') color = '#00ffff'; // Cyan
            else if (this.mode === 'robot') color = '#ffff44'; // Yellow
            else if (this.mode === 'spider') color = '#cc44ff'; // Purple
        }
        
        // Portal outer glow
        ctx.shadowBlur = 30;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(screenX - 5, this.y - 5, this.width + 10, this.height + 10);
        
        // Portal frame (white outer)
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffffff';
        ctx.strokeRect(screenX, this.y, this.width, this.height);
        
        // Inner colored frame
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.strokeRect(screenX + 4, this.y + 4, this.width - 8, this.height - 8);
        
        // Animated vertical energy lines inside portal
        ctx.shadowBlur = 0;
        const lineCount = 8;
        const lineSpeed = 3;
        const offset = (Date.now() / 100) % (this.width / lineCount);
        
        for (let i = 0; i < lineCount + 1; i++) {
            const lineX = screenX + (i * this.width / lineCount) + offset - this.width / lineCount;
            const alpha = Math.sin((i / lineCount) * Math.PI * 2 + Date.now() / 500) * 0.3 + 0.5;
            
            const lineGradient = ctx.createLinearGradient(lineX, this.y, lineX, this.y + this.height);
            lineGradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            lineGradient.addColorStop(0.3, `rgba(255, 255, 255, ${alpha * 0.6})`);
            lineGradient.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.6})`);
            lineGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            ctx.fillStyle = lineGradient;
            ctx.fillRect(lineX, this.y, 3, this.height);
        }
        
        // Portal fill (transparent colored with pulse)
        const fillPulse = Math.sin(Date.now() / 400) * 0.05 + 0.15;
        ctx.fillStyle = color;
        ctx.globalAlpha = fillPulse;
        ctx.fillRect(screenX + 4, this.y + 4, this.width - 8, this.height - 8);
        
        // Icon in center based on type and mode
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;
        const centerX = screenX + this.width / 2;
        const centerY = this.y + this.height / 2;
        const iconSize = this.width * 0.35;
        
        if (this.portalType === 'speed') {
            // Draw speed indicator (arrows)
            const arrowCount = this.mode === 'speed_slow' ? 1 : 
                             this.mode === 'speed_normal' ? 2 : 
                             this.mode === 'speed_fast' ? 3 :
                             this.mode === 'speed_faster' ? 4 : 5;
            for (let i = 0; i < arrowCount; i++) {
                const arrowX = centerX - iconSize + (i * iconSize / 2);
                ctx.beginPath();
                ctx.moveTo(arrowX, centerY);
                ctx.lineTo(arrowX + iconSize / 3, centerY - iconSize / 3);
                ctx.lineTo(arrowX + iconSize / 3, centerY + iconSize / 3);
                ctx.closePath();
                ctx.fill();
            }
        } else if (this.portalType === 'gravity') {
            // Draw gravity arrow
            if (this.mode === 'gravity_normal') {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY + iconSize / 2);
                ctx.lineTo(centerX - iconSize / 3, centerY - iconSize / 3);
                ctx.lineTo(centerX + iconSize / 3, centerY - iconSize / 3);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY - iconSize / 2);
                ctx.lineTo(centerX - iconSize / 3, centerY + iconSize / 3);
                ctx.lineTo(centerX + iconSize / 3, centerY + iconSize / 3);
                ctx.closePath();
                ctx.fill();
            }
        } else if (this.portalType === 'size') {
            // Draw size indicator
            const size = this.mode === 'size_mini' ? iconSize / 2 : iconSize;
            ctx.fillRect(centerX - size / 2, centerY - size / 2, size, size);
        } else {
            // Mode change portal icons (existing code)
            if (this.mode === 'cube') {
                ctx.fillRect(centerX - iconSize / 2, centerY - iconSize / 2, iconSize, iconSize);
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.strokeRect(centerX - iconSize / 2, centerY - iconSize / 2, iconSize, iconSize);
            } else if (this.mode === 'ship') {
                ctx.beginPath();
                ctx.moveTo(centerX + iconSize / 2, centerY);
                ctx.lineTo(centerX - iconSize / 2, centerY - iconSize / 2);
                ctx.lineTo(centerX - iconSize / 2, centerY + iconSize / 2);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (this.mode === 'ball') {
                ctx.beginPath();
                ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.stroke();
            } else if (this.mode === 'wave') {
                ctx.beginPath();
                ctx.moveTo(centerX - iconSize / 2, centerY);
                ctx.lineTo(centerX, centerY - iconSize / 2);
                ctx.lineTo(centerX + iconSize / 2, centerY);
                ctx.lineTo(centerX, centerY + iconSize / 2);
                ctx.closePath();
                ctx.fill();
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        ctx.restore();
    }

    checkCollision(player, camera, game) {
        const screenX = this.x - camera.x;
        
        if (!this.used &&
            player.x < screenX + this.width &&
            player.x + player.size > screenX &&
            player.y < this.y + this.height &&
            player.y + player.size > this.y) {
            
            if (this.portalType === 'mode') {
                player.changeMode(this.mode);
            } else if (this.portalType === 'speed') {
                const speedMap = {
                    'speed_slow': 0.5,
                    'speed_normal': 1.0,
                    'speed_fast': 2.0,
                    'speed_faster': 3.0,
                    'speed_fastest': 4.0
                };
                if (game) game.speedMultiplier = speedMap[this.mode] || 1.0;
            } else if (this.portalType === 'gravity') {
                player.gravityFlipped = this.mode === 'gravity_flip';
            } else if (this.portalType === 'size') {
                player.isMini = this.mode === 'size_mini';
                player.size = this.mode === 'size_mini' ? 20 : 30;
            }
            
            this.used = true;
        }
    }
}
