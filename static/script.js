document.addEventListener('DOMContentLoaded', () => {
    const X = "X"
    const O = "O"

    const squares = document.querySelectorAll('.grid div')
    const playerDisplay = document.querySelector('#player')
    const winnerDisplay = document.querySelector('#winner')

    let board = initialState()
    let user = null

    const reset = document.querySelector("#reset")

    reset.addEventListener('click', () => {
        user = null
        squares.forEach((square, index) => {
            square.classList.remove('playerX', 'playerO')

        })
        winnerDisplay.innerHTML = ""
        playerDisplay.innerHTML = ""
        board = initialState()

    })


    const playerX = document.querySelector("#playerX")
    const playerO = document.querySelector('#playerO')

    playerX.addEventListener('click', () => {
        user = X
        startGame()
    })
    playerO.addEventListener('click', () => {
        user = O
        startGame()
    })

    function startGame() {
        if (player(board) === user) {
            squares.forEach(square => {
                square.addEventListener('click', clickOutcome)
            })
            console.log('game started user')
        }

        else {
            const index = makeAIMove(board)
            squares.forEach((square, idx) => {
                if (idx !== index) {
                    square.addEventListener('click', clickOutcome)
                }
            })
            console.log('game started AI')
        }

    }

    function makeAIMove(board) {
        let index;
        if (user !== null) {
            let move = minimax(board)
            const [i, j] = move
            index = i * 3 + j
            let currentPlayer = player(board)
            board[i][j] = currentPlayer
            squares[index].classList.add(`player${currentPlayer}`)
            squares[index].removeEventListener('click', clickOutcome)

            if (winner(board)) {
                winnerDisplay.innerHTML = `Player ${winner(board)} won`
                user = null
            }
            if (boardFull(board) && utility(board) === 0) {
                winnerDisplay.innerHTML = "It's a tie"
                squares.forEach(square => {
                    square.removeEventListener('click', clickOutcome)
                })
                user = null
            }
        }
        return index

    }

    function clickOutcome(e) {
        if (user === null) {
            alert("Please select a player")
        }
        const squareArray = Array.from(squares)
        const index = squareArray.indexOf(e.target)
        const row = Math.floor(index / 3)
        const col = index % 3
        squares[index].removeEventListener('click', clickOutcome)

        squares[index].classList.add(`player${user}`)
        board[row][col] = user
        if (winner(board)) {
            winnerDisplay.innerHTML = `Player ${winner(board)} won`
            user = null
        }

        if (boardFull(board) && utility(board) === 0) {
            winnerDisplay.innerHTML = "It's a tie"
            squares.forEach(square => {
                square.removeEventListener('click', clickOutcome)
            })
            user = null
        }
        makeAIMove(board)

    }

    // Returns which player who has the next turn on a board
    function player(board) {
        let countX = 0
        let countO = 0

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] === X) {
                    countX += 1
                } else if (board[i][j] === O) {
                    countO += 1
                }
            }
        }

        if (countO < countX) {
            return O
        } else {
            return X
        }
    }

    // Returns 1 if X has won the game, -1 if O has won, 0 otherwise
    function utility(board) {
        sequences_to_check = []
        // Check horizontal rows
        board.forEach(row => {
            sequences_to_check.push(row)
        })

        // Check vertical columns
        for (let c = 0; c < board[0].length; c++) {
            col = []
            for (let r = 0; r < board.length; r++) {
                col.push(board[r][c])
            }
            sequences_to_check.push(col)
        }

        // Check diagonals
        diagonal1 = []
        diagonal2 = []

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (i === j) {
                    diagonal1.push(board[i][j])
                }
                if (i + j === board.length - 1) {
                    diagonal2.push(board[i][j])
                }
            }
        }

        sequences_to_check.push(diagonal1)
        sequences_to_check.push(diagonal2)

        let winner = 0
        sequences_to_check.forEach(seq => {
            const x_won = seq.every(elem => elem === X)
            const o_won = seq.every(elem => elem === O)

            if (x_won === true) {
                winner = 1
            } else if (o_won === true) {
                winner = -1
            }
        })
        return winner
    }

    // Returns the winner of the game, if there is one
    function winner(board) {
        if (utility(board) === 1) {
            return X
        } else if (utility(board) === -1) {
            return O
        } else if (utility(board) === 0) {
            return null
        }
    }

    function boardFull(board) {
        for (let r = 0; r < board.length; r++) {
            for (let c = 0; c < board[0].length; c++) {
                if (board[r][c] == null) {
                    return false
                }
            }
        }
        return true
    }

    // Return true if game is over, false otherwise
    function terminal(board) {
        return boardFull(board) || winner(board)
    }

    function initialState() {
        const board =
            [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ]
        return board
    }

    // Returns a set of all possible actions (i, j) available on the board.
    function actions(board) {
        const possibleActions = new Set()

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                if (board[i][j] === null) {
                    possibleActions.add([i, j])
                }
            }
        }
        return possibleActions
    }

    // Returns the board that results from making move (i, j) on the board.
    function result(board, action) {
        let validActions = actions(board)
        // if (!validActions.has(action)) {
        //     throw new Error("Invalid action")
        // }

        let boardCopy = JSON.parse(JSON.stringify(board))

        let [i, j] = action


        let currentPlayer = player(board)
        boardCopy[i][j] = currentPlayer

        return boardCopy

    }

    // Returns the optimal action for the current player on the board
    function minimax(board) {
        if (terminal(board)) {
            return null
        }
        let currentPlayer = player(board)
        let action

        if (currentPlayer === X) {

            const maxVal = maxValue(board)
            action = maxVal[1]
        }
        else {
            const minVal = minValue(board)
            action = minVal[1]
        }
        return action
    }

    function maxValue(board, alpha, beta) {
        if (terminal(board)) {
            return [utility(board), null]
        }
        let highestValue = -Infinity

        let optimalActions = []

        // actions(board).forEach(action => {
        for (const action of actions(board)) {
            let nextBoard = result(board, action)
            const minVal = minValue(nextBoard, alpha, beta)
            if (minVal[0] === highestValue) {
                optimalActions.push(action)
            }
            if (minVal[0] > highestValue) {
                highestValue = minVal[0]
                optimalActions = [action]
            }

            // Alpha-Beta Pruning
            alpha = Math.max(alpha, highestValue)
            if (beta <= alpha) {
                break
            }
        }

        return [highestValue, optimalActions[Math.floor(Math.random() * optimalActions.length)]]
    }

    function minValue(board, alpha, beta) {
        if (terminal(board)) {
            return [utility(board), null]
        }

        let lowestValue = Infinity

        let optimalActions = []

        // actions(board).forEach(action => {
        for (const action of actions(board)) {
            let nextBoard = result(board, action)
            const maxVal = maxValue(nextBoard, alpha, beta)
            if (maxVal[0] === lowestValue) {
                optimalActions.push(action)
            }
            if (maxVal[0] < lowestValue) {
                lowestValue = maxVal[0]
                optimalActions = [action]
            }

            // Alpha-Beta Pruning
            beta = Math.min(beta, lowestValue)
            if (beta <= alpha) {
                break
            }
        }
        return [lowestValue, optimalActions[Math.floor(Math.random() * optimalActions.length)]]
    }
})

