document.addEventListener('DOMContentLoaded', () => {
    const X = "X"
    const O = "O"

    const squares = document.querySelectorAll('.grid div')
    const playerDisplay = document.querySelector('#player')
    const winnerDisplay = document.querySelector('#winner')



    let board = initialState()

    const reset = document.querySelector("#reset")

    reset.addEventListener('click', () => {
        squares.forEach(square => {
            square.classList.remove('playerX', 'playerO')

        })
        winnerDisplay.innerHTML = ""
        board = initialState()

    })
    let currentPlayer = null
    console.log(currentPlayer)

    const playerX = document.querySelector("#playerX")
    const playerO = document.querySelector('#playerO')

    playerX.addEventListener('click', () => {
        playerDisplay.innerHTML = "Player X's turn"
        currentPlayer = X
        startGame()
    })
    playerO.addEventListener('click', () => {
        playerDisplay.innerHTML = "Player O's turn"
        currentPlayer = O
        startGame()
    })

    function startGame() {
        squares.forEach(square => {
            square.addEventListener('click', clickOutcome)
        })
    }

    function clickOutcome(e) {
        const squareArray = Array.from(squares)
        const index = squareArray.indexOf(e.target)
        const row = Math.floor(index / 3)
        const col = index % 3

        playerDisplay.innerHTML = `Player ${currentPlayer}'s turn`


        if (currentPlayer === X) {
            squares[index].classList.add('playerX')
            playerDisplay.innerHTML = `Player O's turn`
            board[row][col] = X
            let whowon = utility(board)
            if (whowon) {
                winnerDisplay.innerHTML = "Player X won!"
                squares.forEach(square => {
                    square.removeEventListener('click', clickOutcome)
                })
            }
            currentPlayer = O
        } else {
            squares[index].classList.add('playerO')
            playerDisplay.innerHTML = `Player X's turn`
            board[row][col] = O
            let whowon = utility(board)
            if (whowon) {
                winnerDisplay.innerHTML = "Player O won!"
                squares.forEach(square => {
                    square.removeEventListener('click', clickOutcome)
                })
            }
            currentPlayer = 'X'
        }
        if (terminal(board)) {
            playerDisplay.innerHTML = ""
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
})