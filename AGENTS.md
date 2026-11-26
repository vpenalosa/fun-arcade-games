# Fun Arcade Games

## Project overview

Fun Arcade Games is a web-based game hub where players can browse virtual arcade machines, choose a game, and play it in their computer's browser.

The current scope is single-player games for desktop browsers. Multiplayer is out of scope for now.

## Tech stack

- Use React, TypeScript, and Vite. Use npm for package management.
- Run `npm run dev` to start the local development server.

## Development workflow

- Always explain the steps. Before starting a task, outline what you plan to do. When you finish, summarize what you did and how you checked it.
- Before implementing each new feature, create and switch to a dedicated Git branch with a descriptive name, such as `feature/arcade-machine-selection`.
- When introducing a new pattern or dependency, briefly explain why it fits this project.

### Workflow for a new game

1. Start on the game's dedicated feature branch. If the user already created and switched to it, continue on that branch.
2. Add a short brief under **Game descriptions** below. Include the game's objective, controls, and what ends a round. Describe scoring or win conditions when relevant.
3. When the user asks to build the game, implement it from the brief and the prompt.
4. Run the checks below and summarize the results so the user can review and play the game. Address feedback on the same branch.
5. After the user approves the game, merge the reviewed commits into `main`.

## Game requirements

- Make each game accessible from the arcade hub. Show its controls before play starts and prioritize keyboard and mouse input.
- Give players a way to restart the game and return to the hub.
- When a player leaves a game, stop its audio, timers, and animation loops and remove its input listeners so they don't affect the hub or the next game.

## Checking changes

- After changing code, run `npm run lint` and `npm run build`.
- For gameplay changes, launch the game from the hub, try the controls, and check the round-ending condition. Restart, return to the hub, and launch the game again to verify it starts fresh.
- Report which checks you ran and anything that still needs manual testing.

## Game descriptions

Add each game under its own heading so its brief stays with the project after the branch is merged.

### Initial arcade hub

This is the main menu that opens when the game starts. The working title, “Personal Arcade,” appears at the top and can be renamed later. A search bar sits beneath the title and above the games. The hub displays every game in a grid of equal-sized, clickable cards that fill the available space. Each card includes a small image showing the game, its name, and a short description. Selecting a card opens that game's own play route. The After Hours theme uses solid slate-navy surfaces, soft white lettering, flat-color illustrations with saturated game-specific accents, and a quiet border highlight on focused or hovered cards.

### Stacker

Build a tower from the bottom to the top of a 12-row, 7-column grid. A three-square block starts at the left and moves slowly back and forth. Click the board or press Space to lock it in place. The first placement forms the base. Each subsequent row keeps only the squares directly above the previous row. Lost squares stay lost. The moving block speeds up as the tower rises, with a maximum width of two squares from row 5 and one square from row 9. A complete miss ends the round. Lock a square on row 12 to win. Height is the number of completed rows. Short 8-bit sounds mark placements, trims, checkpoints, wins, and losses.

### Pop the Lock

Click the play area or press Space to start a 25-piece lock. Tap again when the red marker overlaps the yellow dot. Each hit plays a coin chime and clears one piece. If pieces remain, the marker reverses and a new dot appears ahead. The marker speeds up after the 5th, 10th, 15th, and 20th hits. Tapping early or passing the dot ends the attempt. Every retry starts with 25 pieces at the slowest speed. Clear all 25 to open the lock.
