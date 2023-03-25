Try it out here: https://mishanwong.github.io/tictactoe/

# Description
This is a program where user can play the game of tic-tac-toe against an AI.

I use the AI algorithm **Minimax** to play against a human player. For the AI to make a move, it will calculate all the posible moves available for the opponent and choose the best possible move to maximize the chance of winning. If that is not possible, it will choose the best possible move to not lose or to end up with a tie. 

Because the Minimax iterates through all possible moves, it is quite slow even on a 3x3 game board. To improve the efficiency, I use the search algorithm **alpha-beta pruning** that decrease the number of nodes that minimax needs to evaluate. It stops evaluating a move when if found that this move cannot be better than a previously evaluated move.

The entire program is written in vanilla HTML/CSS/Javascript.
