# 🚀 Space Invaders

A modern ,browser-based recreation of the classic space Invaders arcade game built with HTML5 canvas and javaScript. Features retro-style graphics,sound effects ,power-ups and smooth 60 FPS gameplay.

## 🎮 Features
 
### Core Gameplay
- **Classic Space Invaders Mechanics**: Defend against waves of alien invaders descending from the top of the screen
- **Smooth 60 FPS Animation**: Optimized game loop with frame-rate independent movement
- **Progressive Difficulty**: Enemy waves spawn faster as you progress
- **Score System**: Earn points by destroying invaders (100 points each, 50 points for bomb kills)

### Game Elements
- **Player Spaceship**: Choose from 4 different spaceship designs
- **Enemy Invaders**: Grid-based alien formations that move and shoot
- **Projectiles**: Two types of bullets (red standard, yellow machine gun)
- **Bombs**: Explosive power-ups that can destroy multiple enemies
- **Power-Ups**: Machine gun power-up for rapid-fire shooting (5-second duration)
- **Particle Effects**: Dynamic particle systems for explosions and visual effects
- **Star Field Background**: Animated starfield for depth

### Controls
- **Move Left**: `A` or `←` (Left Arrow)
- **Move Right**: `D` or `→` (Right Arrow)  
- **Fire**: `SPACE`

### Settings & Customization
- **4 Spaceship Options**: Choose your preferred ship design
- **Sound Toggle**: Enable/disable game audio
- **LocalStorage Persistence**: Settings saved between sessions

### Audio
- Background music
- Shooting sound effects
- Explosion effects
- Game over music
- Power-up collection sounds
- UI interaction sounds

## 🛠️ Technologies Used
 
- **HTML5 Canvas**: For rendering all game graphics
- **Vanilla JavaScript**: Game logic and object-oriented architecture
- **GSAP (GreenSock)**: Animation library for smooth transitions
- **Howler.js**: Cross-platform audio library for sound management
- **CSS3**: Styling and UI elements
- **LocalStorage API**: Settings persistence


## 🎯 How to Play
 
1. **Start the Game**: Click the "Start" button on the main menu
2. **Move Your Ship**: Use `A`/`D` or arrow keys to dodge enemy fire
3. **Shoot Invaders**: Press `SPACE` to fire projectiles
4. **Collect Power-Ups**: Shoot the yellow power-up orbs to activate machine gun mode
5. **Destroy Bombs**: Shoot red bombs to trigger explosions that clear multiple enemies
6. **Survive**: Avoid enemy projectiles and collisions to keep playing
7. **Score High**: Each invader destroyed awards 100 points

### Game Mechanics

- **Fire Rate**: Standard red bullets have a slower fire rate; yellow machine gun fires rapidly
- **Enemy Patterns**: Invaders move in formation and randomly shoot at the player
- **Power-Up Duration**: Machine gun power-up lasts 5 seconds
- **Spawn Rate**: New enemy grids spawn at decreasing intervals as difficulty increases
- **Collision Detection**: Game ends if player collides with invaders or gets hit by projectiles