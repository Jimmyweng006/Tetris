document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]
    // 00 [01] [02] 03
    // 10 [11]  12  13
    // 20 [21]  22  23
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
    let currentPosition = 4
    let currentRotation = 0


    let random = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]


    // draw the Tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    // undraw the Tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // control key
    function control(e) {
        if (scoreDisplay.innerHTML === 'End') return
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        } else if (e.keyCode === 17) {
            directDown()
        }
    }
    document.addEventListener('keydown', control)

    function directDown() {
        undraw()
        finalPosition = currentPosition
        while (!current.some(index => squares[finalPosition + index + 10].classList.contains('taken'))) {
            finalPosition += 10
        }
        currentPosition = finalPosition
        draw()
        freeze()
    }

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    // avoid going outside // get into each
    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            // part of current tetromino get to the border
            // fill out all of current tetromino to taken class
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // a new Tetromino
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            // display next shap int mini-grid
            displayShape()
            // check one row complete and then add score
            addScore()
            // check is Game Over ?
            gameOver()
        }
    }

    // move left
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isAtLeftEdge) currentPosition -= 1

        // move left by one and check if stuck with other tetrominoes
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    // move right
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === 9)

        if (!isAtRightEdge) currentPosition += 1

        // move right by one and check if stuck with other tetrominoes
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    ///FIX ROTATION OF TETROMINOS AT THE EDGE
    function isAtRight() {
        return current.some(index => (currentPosition + index + 1) % width === 0)
    }

    function isAtLeft() {
        return current.some(index => (currentPosition + index) % width === 0)
    }

    function checkRotatedPosition() {
        if ((currentPosition + 1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
            if (isAtRight()) {            //use actual position to check if it's flipped over to right side
                currentPosition += 1    //if so, add one to wrap it back around
                checkRotatedPosition() //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (currentPosition % width > 5) {
            if (isAtLeft()) {
                currentPosition -= 1
                checkRotatedPosition()
            }
        }
    }

    // rotate
    function rotate() {
        undraw()
        currentRotation = (currentRotation + 1) % 4
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }


    // show up next tetromino
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0


    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    // display the next shape
    function displayShape() {
        // remove last tetromino
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    // button function
    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()
        }
    })


    // one row complete && add score
    function addScore() {
        for (let i = 0; i < 200; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'End'
            clearInterval(timerId)
        }
    }
})

// shadow after one line complete
// next tetromino will change when start again
// control key to fall direct position --- done
// rotate problem --- ?done
// end game problem --- done