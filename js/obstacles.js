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
            // Draw triangle spike
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff0044';
            ctx.fillStyle = '#ff0044';
            ctx.strokeStyle = '#ff0044';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(screenX + this.width / 2, this.y);
            ctx.lineTo(screenX + this.width, this.y + this.height);
            ctx.lineTo(screenX, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
        } else if (this.type === 'block') {
            // Draw solid block
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#666';
            ctx.fillStyle = '#444';
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 3;
            ctx.fillRect(screenX, this.y, this.width, this.height);
            ctx.strokeRect(screenX, this.y, this.width, this.height);
            
            // Grid pattern
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 1;
            for (let i = 0; i < this.width; i += 20) {
                ctx.beginPath();
                ctx.moveTo(screenX + i, this.y);
                ctx.lineTo(screenX + i, this.y + this.height);
                ctx.stroke();
            }
            
        } else if (this.type === 'sawblade') {
            // Draw rotating sawblade
            const centerX = screenX + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = this.width / 2;
            
            ctx.translate(centerX, centerY);
            ctx.rotate(Date.now() / 200);
            
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff0044';
            ctx.fillStyle = '#ff0044';
            ctx.strokeStyle = '#880022';
            ctx.lineWidth = 3;
            
            // Draw spikes around circle
            const spikes = 8;
            ctx.beginPath();
            for (let i = 0; i < spikes; i++) {
                const angle = (i / spikes) * Math.PI * 2;
                const x1 = Math.cos(angle) * radius;
                const y1 = Math.sin(angle) * radius;
                const x2 = Math.cos(angle + Math.PI / spikes) * radius * 1.5;
                const y2 = Math.sin(angle + Math.PI / spikes) * radius * 1.5;
                const x3 = Math.cos(angle + Math.PI * 2 / spikes) * radius;
                const y3 = Math.sin(angle + Math.PI * 2 / spikes) * radius;
                
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Center circle
            ctx.fillStyle = '#440011';
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
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
        const pulse = Math.sin(this.pulsePhase + Date.now() / 300) * 0.2 + 1;
        const radius = this.size / 2 * pulse;
        
        ctx.save();
        
        let color;
        if (this.type === 'yellow') color = '#ffff00';
        else if (this.type === 'blue') color = '#00ccff';
        else if (this.type === 'pink') color = '#ff00ff';
        
        // Outer glow
        ctx.shadowBlur = 30;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(screenX + this.size / 2, this.y + this.size / 2, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Main orb
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(screenX + this.size / 2, this.y + this.size / 2, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner circle
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(screenX + this.size / 2, this.y + this.size / 2, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Ring if near and requires click
        if (this.isNear && this.requiresClick) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.globalAlpha = Math.sin(Date.now() / 100) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(screenX + this.size / 2, this.y + this.size / 2, radius * 1.3, 0, Math.PI * 2);
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

// Portal for mode changes
class Portal {
    constructor(x, y, width, height, mode) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.mode = mode; // cube, ship, ball, wave
        this.used = false;
    }

    render(ctx, camera) {
        const screenX = this.x - camera.x;
        
        ctx.save();
        
        let color;
        if (this.mode === 'cube') color = '#00ff88';
        else if (this.mode === 'ship') color = '#00ccff';
        else if (this.mode === 'ball') color = '#ff00ff';
        else if (this.mode === 'wave') color = '#ffff00';
        
        // Portal frame
        ctx.shadowBlur = 25;
        ctx.shadowColor = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
        
        // Portal fill (transparent)
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        
        // Swirling effect
        ctx.globalAlpha = 0.5;
        for (let i = 0; i < 3; i++) {
            const offset = (Date.now() / 1000 + i * Math.PI * 2 / 3) % (Math.PI * 2);
            const x = screenX + this.width / 2 + Math.cos(offset) * this.width * 0.3;
            const y = this.y + this.height / 2 + Math.sin(offset) * this.height * 0.3;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }

    checkCollision(player, camera) {
        const screenX = this.x - camera.x;
        
        if (!this.used &&
            player.x < screenX + this.width &&
            player.x + player.size > screenX &&
            player.y < this.y + this.height &&
            player.y + player.size > this.y) {
            
            player.changeMode(this.mode);
            this.used = true;
        }
    }
}
