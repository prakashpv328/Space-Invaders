# 🚀 Space Invaders

A modern ,browser-based recreation of the classic space Invaders arcade game built with HTML5 canvas and javaScript. Features retro-style graphics,sound effects ,power-ups and smooth 60 FPS gameplay, and a complete 10-level campaign with progressive difficulty.

## 🎮 Features
 
### Core Gameplay
- **Classic Space Invaders Mechanics**: Defend against waves of alien invaders descending from the top of the screen
- **10-Level Campaign**: Progressive gameplay with increasing difficulty across 10 unique levels
- **Smooth 60 FPS Animation**: Optimized game loop with frame-rate independent movement
- **Progressive Difficulty**: Enemy formations become larger, faster, and more aggressive as you advance
- **Score System**: Earn points by destroying invaders (100 points each, 50 points for bomb kills)
- **High Score Persistence**: Automatic saving and display of your best score

### Game Header (In-Game UI)
- **Real-Time Level Display**: Shows your current level (LV 1-10)
- **Dynamic Score Counter**: Tracks your score in real-time
- **Active Power-Up Timers**: Visual indicators for active power-ups with countdown timers:
  - 🛡️ **Shield**: Protection timer with cyan gradient
  - ⚡ **Machine Gun**: Rapid-fire timer with yellow gradient
  - ⚔️ **Split Fire**: Multi-projectile timer with pink gradient
- **In-Game Controls**: Quick-access buttons for:
  - 🔊 **Sound Toggle**: Mute/unmute audio
  - ⏸️ **Pause/Resume**: Pause the game and resume at any time

### Power-Up System
- **Shield Power-Up**: Grants temporary invincibility (10-second duration)
- **Machine Gun Power-Up**: Enables rapid-fire shooting with increased projectile speed
- **Split Fire Power-Up**: Shoot multiple projectiles simultaneously for maximum damage
- **Visual Feedback**: Power-up timers display in the game header with color-coded indicators
- **Strategic Gameplay**: Power-ups spawn randomly, encouraging tactical decision-making

### Game Elements
- **Player Spaceship**: Choose from 4 different spaceship designs
- **Enemy Invaders**: Grid-based alien formations that move in formation and shoot at the player
- **Projectiles**: Advanced bullet system with variable firing rates
- **Bombs**: Explosive power-ups that can destroy multiple enemies
- **Power-Ups**: Machine gun power-up for rapid-fire shooting (5-second duration)
- **Particle Effects**: Dynamic particle systems for explosions, hits, and visual feedback
- **Star Field Background**: Animated starfield creating visual depth

### Controls & Input
- **Move Left**: `A` or `←` (Left Arrow)
- **Move Right**: `D` or `→` (Right Arrow)  
- **Fire**: `SPACE` or `W` or `↑`
- **Pause/Resume**: `P` key
- **Toggle Sound**: `S` key
- **Settings**: Click the gear icon on the main menu

### Settings & Customization
- **4 Spaceship Options**: Select your preferred ship design before gameplay
- **Sound Toggle**: Enable/disable all audio with persistent memory
- **Game Pause**: Pause during gameplay to take a break with the `P` key
- **Settings Menu**: Accessible from the main menu for ship selection and audio preferences
- **LocalStorage Persistence**: Game settings and high scores saved between sessions

### Victory & Progression
- **Level Completion**: Beat all enemies in a level to advance to the next
- **10-Level Progression**: Complete all 10 levels to achieve ultimate victory
- **Victory Screen**: Celebration screen upon completing the entire game
- **Game Over Screen**: Option to restart or return to main menu
- **Score Tracking**: Track your performance across multiple playthroughs

### Audio
- Background music
- Shooting sound effects
- Explosion effects
- Game over music
- Power-up collection sounds
- UI interaction sounds
- Individual sound control via settings menu

## 🛠️ Technologies Used
 
- **HTML5 Canvas**: For rendering all game graphics
- **Vanilla JavaScript**: Game logic and object-oriented architecture
- **GSAP (GreenSock)**: Animation library for smooth transitions
- **Howler.js**: Cross-platform audio library for sound management
- **CSS3**: Styling and UI elements
- **LocalStorage API**: Settings persistence


## 🎯 How to Play
 
1. **Open the Game**: Launch `index.html` in your web browser
2. **Select Your Ship**: Click on the settings gear icon to choose your spaceship design
3. **Start Playing**: Click the "Start" button to begin level 1
4. **Navigate the Waves**: Use `A`/`D` or arrow keys to move left and right
5. **Destroy Enemies**: Press `SPACE` or `W` to fire projectiles
6. **Collect Power-Ups**: Walk over or destroy power-up items to gain temporary advantages:
   - Shield protects you from one hit
   - Machine Gun increases firing rate significantly
   - Split Fire shoots multiple projectiles
7. **Monitor Your Status**: Watch the in-game header for your score, level, and active power-up timers
8. **Advance Levels**: Destroy all enemies in a wave to progress to the next level
9. **Complete the Game**: Beat all 10 levels to achieve victory
10. **Take a Break**: Use `P` to pause the game at any time

### Level Progression

| Level | Difficulty | Enemy Formation | Speed | Enemy Count |
|-------|-----------|-----------------|-------|------------|
| 1-2 | Easy | 3-5 rows × 4-6 columns | Slow | 12-30 |
| 3-4 | Medium | 3-5 rows × 4-7 columns | Moderate | 12-35 |
| 5-7 | Hard | 4-6 rows × 5-8 columns | Fast | 20-48 |
| 8-10 | Extreme | 5-7 rows × 6-8 columns | Very Fast | 30-56 |

### Game Mechanics

- **Fire Rate**: Increases dramatically with the Machine Gun power-up
- **Enemy AI**: Invaders move in synchronized formations and shoot randomly
- **Power-Up Duration**: Each power-up lasts for a limited time (displayed in header timers)
- **Progressive Waves**: New enemy formations spawn automatically as you clear previous ones
- **Collision Detection**: Game ends if your ship collides with invaders or is hit by enemy projectiles
- **Invincibility Shield**: Shield power-up grants temporary protection from one hit
- **Score Multiplier**: Each level completion awards bonus points

## 🏆 Scoring System

- **Enemy Destruction**: 100 points per invader eliminated
- **Level Bonus**: Bonus points awarded for completing each level (increases with difficulty)
- **High Score**: Your best score is automatically saved and displayed
- **Perfect Levels**: Additional bonus for clearing levels without taking damage