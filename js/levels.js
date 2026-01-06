// Level definitions
const LEVELS = [
    // Level 1 - Beginner
    {
        name: "Stereo Madness",
        length: 5000,
        groundY: 500,
        backgroundColor: '#0a0a0a',
        obstacles: [
            // Starting spikes
            { x: 500, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 550, y: 460, width: 40, height: 40, type: 'spike' },
            
            // First platform section
            { x: 700, y: 400, width: 100, height: 20, type: 'block' },
            { x: 850, y: 460, width: 40, height: 40, type: 'spike' },
            
            // Jump sequence
            { x: 1000, y: 350, width: 80, height: 20, type: 'block' },
            { x: 1150, y: 300, width: 80, height: 20, type: 'block' },
            { x: 1300, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 1350, y: 460, width: 40, height: 40, type: 'spike' },
            
            // Sawblade section
            { x: 1500, y: 430, width: 60, height: 60, type: 'sawblade' },
            { x: 1650, y: 380, width: 60, height: 60, type: 'sawblade' },
            
            // Platform stairs
            { x: 1800, y: 450, width: 100, height: 50, type: 'block' },
            { x: 1950, y: 400, width: 100, height: 100, type: 'block' },
            { x: 2100, y: 350, width: 100, height: 150, type: 'block' },
            
            // Spike gauntlet
            { x: 2300, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 2380, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 2460, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 2540, y: 460, width: 40, height: 40, type: 'spike' },
            
            // Platform with spikes underneath
            { x: 2700, y: 350, width: 150, height: 20, type: 'block' },
            { x: 2700, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 2750, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 2800, y: 460, width: 40, height: 40, type: 'spike' },
            
            // Challenging section
            { x: 2950, y: 300, width: 60, height: 20, type: 'block' },
            { x: 3050, y: 430, width: 60, height: 60, type: 'sawblade' },
            { x: 3200, y: 250, width: 60, height: 20, type: 'block' },
            
            // Triple jump
            { x: 3400, y: 400, width: 80, height: 20, type: 'block' },
            { x: 3550, y: 350, width: 80, height: 20, type: 'block' },
            { x: 3700, y: 300, width: 80, height: 20, type: 'block' },
            
            // Final spikes
            { x: 3900, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 3950, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 4000, y: 460, width: 40, height: 40, type: 'spike' },
            
            // Sawblade finale
            { x: 4150, y: 430, width: 60, height: 60, type: 'sawblade' },
            { x: 4250, y: 380, width: 60, height: 60, type: 'sawblade' },
            
            // Victory platform
            { x: 4500, y: 400, width: 200, height: 100, type: 'block' },
        ],
        orbs: [
            { x: 900, y: 450, size: 30, type: 'yellow' },
            { x: 1250, y: 280, size: 30, type: 'blue' },
            { x: 2000, y: 350, size: 30, type: 'yellow' },
            { x: 2650, y: 400, size: 30, type: 'blue' },
            { x: 3100, y: 250, size: 30, type: 'pink' },
            { x: 3850, y: 400, size: 30, type: 'yellow' },
        ],
        coins: [
            { x: 800, y: 380, size: 20 },
            { x: 1200, y: 270, size: 20 },
            { x: 2050, y: 320, size: 20 },
            { x: 2750, y: 320, size: 20 },
            { x: 3650, y: 270, size: 20 },
            { x: 4600, y: 350, size: 20 },
        ],
        portals: [
            // No mode changes in level 1
        ]
    },
    
    // Level 2 - Intermediate with mode changes
    {
        name: "Back On Track",
        length: 6000,
        groundY: 500,
        backgroundColor: '#0a0a0a',
        obstacles: [
            // Warm up
            { x: 400, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 600, y: 400, width: 100, height: 20, type: 'block' },
            { x: 750, y: 460, width: 40, height: 40, type: 'spike' },
            
            // Before ship portal
            { x: 900, y: 350, width: 80, height: 20, type: 'block' },
            { x: 1050, y: 460, width: 40, height: 40, type: 'spike' },
            
            // Ship mode section (1200-2200)
            { x: 1300, y: 0, width: 800, height: 30, type: 'block' }, // Ceiling
            { x: 1400, y: 250, width: 100, height: 20, type: 'block' },
            { x: 1600, y: 200, width: 100, height: 20, type: 'block' },
            { x: 1800, y: 300, width: 100, height: 20, type: 'block' },
            { x: 2000, y: 150, width: 100, height: 20, type: 'block' },
            
            // Back to cube
            { x: 2350, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 2400, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 2550, y: 400, width: 100, height: 20, type: 'block' },
            
            // Ball mode section (2800-3600)
            { x: 2900, y: 300, width: 150, height: 20, type: 'block' },
            { x: 3100, y: 400, width: 150, height: 20, type: 'block' },
            { x: 3300, y: 300, width: 150, height: 20, type: 'block' },
            { x: 3500, y: 400, width: 150, height: 20, type: 'block' },
            
            // Back to cube - difficult section
            { x: 3800, y: 430, width: 60, height: 60, type: 'sawblade' },
            { x: 3950, y: 380, width: 60, height: 60, type: 'sawblade' },
            { x: 4100, y: 430, width: 60, height: 60, type: 'sawblade' },
            
            { x: 4300, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 4350, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 4400, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 4450, y: 460, width: 40, height: 40, type: 'spike' },
            
            // Wave mode section (4700-5400)
            { x: 4800, y: 200, width: 200, height: 20, type: 'block' },
            { x: 5000, y: 350, width: 200, height: 20, type: 'block' },
            { x: 5200, y: 250, width: 200, height: 20, type: 'block' },
            
            // Final cube section
            { x: 5500, y: 460, width: 40, height: 40, type: 'spike' },
            { x: 5650, y: 400, width: 150, height: 100, type: 'block' },
        ],
        orbs: [
            { x: 500, y: 450, size: 30, type: 'yellow' },
            { x: 1000, y: 330, size: 30, type: 'blue' },
            { x: 2300, y: 450, size: 30, type: 'yellow' },
            { x: 3000, y: 270, size: 30, type: 'yellow' },
            { x: 3700, y: 450, size: 30, type: 'pink' },
            { x: 4250, y: 400, size: 30, type: 'yellow' },
            { x: 5450, y: 400, size: 30, type: 'blue' },
        ],
        coins: [
            { x: 650, y: 370, size: 20 },
            { x: 1500, y: 220, size: 20 },
            { x: 2600, y: 370, size: 20 },
            { x: 3200, y: 370, size: 20 },
            { x: 4500, y: 420, size: 20 },
            { x: 5100, y: 320, size: 20 },
            { x: 5700, y: 350, size: 20 },
        ],
        portals: [
            { x: 1200, y: 350, width: 40, height: 150, mode: 'ship' },
            { x: 2250, y: 350, width: 40, height: 150, mode: 'cube' },
            { x: 2800, y: 350, width: 40, height: 150, mode: 'ball' },
            { x: 3700, y: 350, width: 40, height: 150, mode: 'cube' },
            { x: 4700, y: 350, width: 40, height: 150, mode: 'wave' },
            { x: 5450, y: 350, width: 40, height: 150, mode: 'cube' },
        ]
    }
];

// Helper function to create level objects
function createLevelObjects(levelData) {
    return {
        obstacles: levelData.obstacles.map(o => new Obstacle(o.x, o.y, o.width, o.height, o.type)),
        orbs: levelData.orbs.map(o => new Orb(o.x, o.y, o.size, o.type)),
        coins: levelData.coins.map(c => new Coin(c.x, c.y, c.size)),
        portals: levelData.portals.map(p => new Portal(p.x, p.y, p.width, p.height, p.mode)),
        name: levelData.name,
        length: levelData.length,
        groundY: levelData.groundY,
        backgroundColor: levelData.backgroundColor
    };
}
