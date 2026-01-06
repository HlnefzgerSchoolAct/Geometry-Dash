// Audio Manager - Uses Web Audio API for sound generation
class AudioManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.masterGain = null;
        
        // Initialize audio context on first user interaction
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = 0.3;
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported', e);
            this.enabled = false;
        }
    }

    playJump() {
        if (!this.enabled || !this.initialized) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // More punchy jump sound
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(550, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(350, this.audioContext.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.08);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.08);
    }

    playDeath() {
        if (!this.enabled || !this.initialized) return;
        
        // Create more dramatic death sound
        const oscillator1 = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // Two oscillators for richer sound
        oscillator1.type = 'sawtooth';
        oscillator2.type = 'square';
        
        oscillator1.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator1.frequency.exponentialRampToValueAtTime(40, this.audioContext.currentTime + 0.4);
        
        oscillator2.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0.6, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        oscillator1.start(this.audioContext.currentTime);
        oscillator2.start(this.audioContext.currentTime);
        oscillator1.stop(this.audioContext.currentTime + 0.4);
        oscillator2.stop(this.audioContext.currentTime + 0.4);
    }

    playCoin() {
        if (!this.enabled || !this.initialized) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // Brighter coin sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator.frequency.setValueAtTime(1600, this.audioContext.currentTime + 0.05);
        oscillator.frequency.setValueAtTime(2000, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.35, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    playOrb() {
        if (!this.enabled || !this.initialized) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        // More energetic orb sound
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.12);
        
        gainNode.gain.setValueAtTime(0.45, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.12);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.12);
    }

    // Simple background music using oscillators
    startBackgroundMusic() {
        if (!this.enabled || !this.initialized) return;
        
        // Create a simple looping melody
        this.playBackgroundNote(0);
    }

    playBackgroundNote(noteIndex) {
        if (!this.enabled || !this.initialized) return;
        
        const notes = [440, 494, 523, 587, 659, 698, 784, 880]; // A4 to A5
        const pattern = [0, 2, 4, 5, 4, 2, 0, 2, 4, 7, 4, 2];
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain);
        
        oscillator.type = 'triangle';
        oscillator.frequency.value = notes[pattern[noteIndex % pattern.length]];
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
        
        // Schedule next note
        if (this.enabled && this.initialized) {
            setTimeout(() => this.playBackgroundNote(noteIndex + 1), 300);
        }
    }

    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Global audio manager instance
const audioManager = new AudioManager();
