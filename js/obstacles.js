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
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#666666';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            // Main spike triangle
            ctx.beginPath();
            ctx.moveTo(screenX + this.width / 2, this.y);
            ctx.lineTo(screenX + this.width, this.y + this.height);
            ctx.lineTo(screenX, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Inner darker triangle for depth
            ctx.fillStyle = '#444444';
            ctx.beginPath();
            ctx.moveTo(screenX + this.width / 2, this.y + this.height * 0.3);
            ctx.lineTo(screenX + this.width * 0.7, this.y + this.height);
            ctx.lineTo(screenX + this.width * 0.3, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
        } else if (this.type === 'block') {
            // Draw solid block with 3D effect
            ctx.shadowBlur = 0;
            
            // Main block face
            ctx.fillStyle = '#666666';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.fillRect(screenX, this.y, this.width, this.height);
            ctx.strokeRect(screenX, this.y, this.width, this.height);
            
            // 3D bottom edge
            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.moveTo(screenX, this.y + this.height);
            ctx.lineTo(screenX + this.width, this.y + this.height);
            ctx.lineTo(screenX + this.width, this.y + this.height + 5);
            ctx.lineTo(screenX, this.y + this.height + 5);
            ctx.closePath();
            ctx.fill();
            
            // 3D right edge
            ctx.fillStyle = '#444444';
            ctx.beginPath();
            ctx.moveTo(screenX + this.width, this.y);
            ctx.lineTo(screenX + this.width + 5, this.y);
            ctx.lineTo(screenX + this.width + 5, this.y + this.height + 5);
            ctx.lineTo(screenX + this.width, this.y + this.height);
            ctx.closePath();
            ctx.fill();
            
        } else if (this.type === 'sawblade') {
            // Draw rotating sawblade
            const centerX = screenX + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = this.width / 2;
            
            ctx.translate(centerX, centerY);
            ctx.rotate(Date.now() / 100); // Rotation speed
            
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#666666';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            
            // Draw spikes around circle
            const spikes = 12;
            ctx.beginPath();
            for (let i = 0; i < spikes; i++) {
                const angle = (i / spikes) * Math.PI * 2;
                const nextAngle = ((i + 1) / spikes) * Math.PI * 2;
                const midAngle = (angle + nextAngle) / 2;
                
                const x1 = Math.cos(angle) * radius * 0.7;
                const y1 = Math.sin(angle) * radius * 0.7;
                const x2 = Math.cos(midAngle) * radius;
                const y2 = Math.sin(midAngle) * radius;
                
                if (i === 0) ctx.moveTo(x1, y1);
                else ctx.lineTo(x1, y1);
                ctx.lineTo(x2, y2);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Center circle
            ctx.fillStyle = '#333333';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
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
        // Portal colors
        if (this.mode === 'cube') color = '#00ff00'; // Bright green
        else if (this.mode === 'ship') color = '#ff6600'; // Orange
        else if (this.mode === 'ball') color = '#ff00ff'; // Magenta
        else if (this.mode === 'wave') color = '#0099ff'; // Blue
        else if (this.mode === 'ufo') color = '#00ffff'; // Cyan
        else if (this.mode === 'robot') color = '#ffff00'; // Yellow
        else if (this.mode === 'spider') color = '#aa00ff'; // Purple
        
        // Portal frame
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.strokeRect(screenX, this.y, this.width, this.height);
        
        // Inner colored frame
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX + 3, this.y + 3, this.width - 6, this.height - 6);
        
        // Portal fill (transparent colored)
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(screenX, this.y, this.width, this.height);
        
        // Icon in center based on mode
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#ffffff';
        const centerX = screenX + this.width / 2;
        const centerY = this.y + this.height / 2;
        const iconSize = this.width * 0.3;
        
        if (this.mode === 'cube') {
            // Draw small cube icon
            ctx.fillRect(centerX - iconSize / 2, centerY - iconSize / 2, iconSize, iconSize);
        } else if (this.mode === 'ship') {
            // Draw small triangle
            ctx.beginPath();
            ctx.moveTo(centerX + iconSize / 2, centerY);
            ctx.lineTo(centerX - iconSize / 2, centerY - iconSize / 2);
            ctx.lineTo(centerX - iconSize / 2, centerY + iconSize / 2);
            ctx.closePath();
            ctx.fill();
        } else if (this.mode === 'ball') {
            // Draw small circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, iconSize / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.mode === 'wave') {
            // Draw wave symbol
            ctx.beginPath();
            ctx.moveTo(centerX - iconSize / 2, centerY);
            ctx.lineTo(centerX, centerY - iconSize / 2);
            ctx.lineTo(centerX + iconSize / 2, centerY);
            ctx.lineTo(centerX, centerY + iconSize / 2);
            ctx.closePath();
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
