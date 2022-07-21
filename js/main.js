'use strict'

const MINE = "💣"
const FLAG = "🚩"
const HEART3 = "💚💚💚"
const HEART2 = "💛💛"
const HEART1 = "❤️"
const X = "❌"
const SMILE = "😃"
const OUCH = "😅"
const HURT = "🤕"
const DEAD = "☠️"
const WIN = "😎"
const CLOCK = "⏱️"

var gTimer = 0
var gStartTime
var gBoard = []
var gLives = 3
var gLevel = { size: 4, mines: 2 }
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function init() {
    var heart = document.querySelector('.hearts')
    var smiley = document.querySelector('.smiley')

    gGame.isOn = true
    heart.innerText = HEART3
    smiley.innerText = SMILE
    gBoard = buildBoard()
    gLives = 3

    resetTimer(true)

    setMinesNegsCount(gBoard)
    renderBoard(gBoard)

    // renderTimer()
}

function buildBoard() {
    const board = []

    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    var mines = getRandomMines(board)
    // console.log(a)

    for (var i = 0; i < mines.length; i++) {
        var mineI = mines[i][0]
        var mineJ = mines[i][1]
        board[mineI][mineJ].isMine = true
    }
    return board
}

function getCellNegs(cellI, cellJ, board) {
    var negMinesCount = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (j < 0 || j >= board[0].length) continue
            if (i === cellI && j === cellJ) continue
            if (board[i][j].isMine) negMinesCount++

            //put cell neg number inside cell's key
            gBoard[cellI][cellJ].minesAroundCount = negMinesCount
        }
    }
    return negMinesCount
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            getCellNegs(i, j, board)
        }
    }
    return board
}

function renderBoard(board) {
    var strHTML = '<table border="0" align="center"><tbody>'
    for (var i = 0; i < gLevel.size; i++) {

        strHTML += '<tr>\n'

        for (var j = 0; j < gLevel.size; j++) {
            var currCell = board[i][j]
            var className = 'cell cell-' + i + '-' + j
            var cellValue = ''

            if (currCell.isMarked) {
                cellValue = FLAG
            }

            if (currCell.isShown) {
                if (currCell.isMine) {
                    cellValue += MINE
                    className += ' mine'
                }
                if (currCell.minesAroundCount && !currCell.isMine) {
                    cellValue += currCell.minesAroundCount
                } else {
                    className += ' empty'
                }
            }
            strHTML += `<td class="${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="return handleFlags(this, ${i}, ${j})">\n`
            strHTML += cellValue
            strHTML += '\t</td>\n'

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elGameMat = document.querySelector(".table")
    elGameMat.innerHTML = strHTML
}

function cellClicked(elCell, i, j) {

    const cell = gBoard[i][j]
    if (!gGame.isOn) return

    if (gTimer === 0) {
        gStartTime = new Date().getTime()
        gTimer = setInterval(timer, 1)
    }

    if (cell.isMarked) return

    if (cell.isMine) {
        cell.isShown = true
        renderBoard(gBoard)
        checkGameOver(false, gBoard)
        return
    }
    cell.isShown = true
    // checkGameOver(true)
    renderBoard(gBoard)
}

function handleFlags(ev, i, j) {
    // gBoard[i][j].isMarked = true
    if (!gGame.isOn) return
    
    checkGameOver(true, gBoard)

    var cell = gBoard[i][j]

    if (gTimer === 0) {
        gStartTime = new Date().getTime()
        gTimer = setInterval(timer, 1)
    }

    if (cell.isShown) return

    if (cell.isMarked === true) {
        cell.isMarked = false
    } else if (cell.isMarked === false) {
        cell.isMarked = true
    }

    renderBoard(gBoard)
    return false
}

function checkGameOver(checkWin, gBoard) {
    var heart = document.querySelector(".hearts")
    var smiley = document.querySelector(".smiley")
    console.log('checkGameOver')

    if (!checkWin) {
        console.log('checkLoss');
        gLives--

        if (gLives === 2) {
            heart.innerText = HEART2
            smiley.innerText = OUCH
        } else if (gLives === 1) {
            heart.innerText = HEART1
            smiley.innerText = HURT
        } else if (gLives === 0) {
            heart.innerText = X
            smiley.innerText = DEAD
            endGameLoss()
        }
        return
    }

    if (checkWin) {
        console.log('checkWin')
        // var currCell = gBoard[i][j]

        // for (var i = 0; i < gBoard.length; i++) {
        //     for (var j = 0; j < gBoard[0].length; j++) {

        //         if (currCell.isMarked && !currCell.isMine) return
        //         if (currCell.isMine && !currCell.isShown && !currCell.isMarked) return
        //         if (!currCell.isMine && !isShown) return
        //     }
        // }
        // endGameWin()
    }
}

function endGameWin() {
    log.console('hi')
}

function endGameLoss() {
    gGame.isOn = false
    console.log('game over loss')
    resetTimer(false)
}

function expandShown(board, elCell, i, j) {

}

function getRandomMines(board) {
    var potentialMines = []
    var actualMines = []
    var minesNum = gLevel.mines

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            potentialMines.push([i, j])
        }
    }
    while (minesNum > 0) {
        var randomMine = potentialMines.splice(getRandomInt(0, potentialMines.length), 1)
        actualMines.push(randomMine[0])
        minesNum--
    }
    return actualMines
}

function timer() {
    var elTimer = document.querySelector(`.timer`)
    var millisSinceStart = new Date() - gStartTime
    var millis = millisSinceStart % 1000
    var seconds = Math.floor(millisSinceStart / 1000)

    if (millis < 100) millis = '0' + millis
    elTimer.innerText = `${seconds}:${millis}`
}

function resetTimer(updateHTML) {

    clearInterval(gTimer)
    gTimer = 0

    if (updateHTML) {
        var timer = document.querySelector(".timer")
        timer.innerText = CLOCK
    }
}
function resizeBoard(boardSize) {
    gLevel.size = boardSize 
    gLevel.mines = (((boardSize - 2) * 2) - 2)
    init()
}

trialAndError()
function trialAndError() {
    console.log('hi')
}
