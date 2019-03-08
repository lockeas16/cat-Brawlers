![Ironhack Logo](https://i.imgur.com/1QgrNNw.png)

# Module 1 | The Game **"Cat Brawlers"**
## Introduction
This is my first project in Ironhack, it's inspired by multidirectional shooters like Smash TV, which I remember fondly during my childhood. It's also spiced a bit with cats, because... I love cats!!! :smiley_cat: :laughing: :paw_prints:

## Documentation
Most variables that affect the game in some way or another are declared in a const object in the classes js. A little snippet of it:

```javascript
const globalConst = {
  // sprite sizes
  idleSpriteWidth: 126,
  idleSpriteHeight: 87,
  leftSpriteWidth: 252,
  leftSpriteHeight: 69,
  rightSpriteWidth: 252,
  rightSpriteHeight: 69,
  .
  .
  .
  // speed and movement properties
  movement: 3,
  enemySpeed: 1,
  pickleSpeed: 1.5,
  bulletSpeed: 4,
  bulletDamage: 1,
  // enemies properties
  demonPoints: 1,
  bossPoints: 100,
  picklePoints: 2,
  waveTime: 10, //seconds
  enemyHealth: 1,
  bossHealth: 15,
  // cat properties
  catHealth: 3,
  .
  .
  .
```

## Setup
If you'd like to view my project locally:
1. Clone my repository ```git clone https://github.com/lockeas16/cat-Brawlers.git```
2. Open game with ```xdg-open index.html``` if you are a linux user or ```open index.html``` for Mac users

## Approach
The game was developed taking into account the **MVP principle**: *Minimun viable product*. First, I made the initial setup (creation of files like html, js, css and folders for assets) and started to code to obtain something viable, even if it looked ugly or too simplistic. Iteration after iteration, more functionality was coded to obtain a more fleshed out game. 

As I'm more skilled with abstract thinking and coding than with user interface I began with gameplay mechanics and game logic leaving at the end all styling and visual aspects. I opted first to have a working game and then work hard to make it look attractive.

## Unsolved problems & gaps
I had plans to add a lot of gameplay mechanics, like powerups, different kinds of enemies, more than one level but I ran out of time. I don't think the game has major issues or problems, it's just missing some little details to enhance gameplay mechanics or make it more visually attractive.