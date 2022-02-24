import { randomInRange, alphabetArray, wordsArray as words } from './utils'
import './style.css'

const guessWrapper = document.getElementsByClassName('guessWrapper')[0]
const restartButton = document.getElementById('restartButton')
const buttonContainer = document.getElementById('buttonContainer')
const messageBox = document.getElementById('message')

const getRandomWord = () => {
  return words[randomInRange(0, words.length - 1)]
}

let primeWord = getRandomWord()

const guess = [
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
]

guess.forEach(g => {
  const eachGuess = document.createElement('div')
  eachGuess.classList.add('guess')
  g.forEach(letter => {
    const letterBlock = document.createElement('div')
    letterBlock.classList.add('letterBlock')

    eachGuess.appendChild(letterBlock)
  })
  guessWrapper.appendChild(eachGuess)
})

const totalLetters = guess.length * guess[0].length
let nextInput = 0

const statusClassNames = {
  correct: 'correctPosition',
  present: 'wrongPosition',
  absent: 'notPresent',
}

const setColorsToBlocksAndCheckIfWin = (letterBlocks, primeWordArray) => {
  let isWon = true
  letterBlocks.forEach((block, idx) => {
    const enteredLetter = block.textContent
    let status

    if (primeWordArray.includes(enteredLetter)) {
      if (enteredLetter === primeWordArray[idx]) {
        status = statusClassNames.correct
      } else {
        status = statusClassNames.present
        isWon = false
      }
    } else {
      status = statusClassNames.absent
      isWon = false
    }

    block.classList.add(status)
    block.setAttribute('style', 'color: white; border: none')
  })

  return isWon
}

let isWon

const restartGame = () => {
  const allLetterBlocks = [...document.getElementsByClassName('letterBlock')]
  allLetterBlocks.map(block => {
    block.textContent = ''
    Array.from(block.classList).forEach(
      className =>
        Object.values(statusClassNames).includes(className) &&
        block.classList.remove(className)
    )
    block.style.color = 'black'
    block.style.border = '2px solid #d3d6da'
  })
  primeWord = getRandomWord()
  nextInput = 0
  buttonContainer.style.display = 'none'
  isWon = false
}

const grabWordsFromKeyboard = () => {
  document.addEventListener('keypress', e => {
    if (isWon) return
    if (!alphabetArray.includes(e.key)) {
      alert('Please enter valid alphabets')
      return
    }

    if (nextInput < totalLetters) {
      const row = Math.floor(nextInput / guess[0].length)
      const col = Math.floor(nextInput % guess[0].length)
      const eachGuess = [...document.getElementsByClassName('guess')]
      const letterBlocks = [...eachGuess[row].childNodes]
      letterBlocks[col].textContent = e.key.toUpperCase()
      letterBlocks[col].setAttribute('style', 'border: 2px solid black')
      if (col == guess[0].length - 1) {
        isWon = setColorsToBlocksAndCheckIfWin(
          letterBlocks,
          primeWord.toUpperCase().split('')
        )
        if (isWon) {
          messageBox.textContent = 'Bravo! You have won the game!'
          buttonContainer.style.display = 'block'
        } else {
          messageBox.textContent = 'Oo-oh, try again.'
        }
      }
      nextInput++
    }

    if (nextInput >= totalLetters) {
      buttonContainer.style.display = 'block'
    }
  })
}

restartButton.addEventListener('click', () => {
  restartGame()
})

grabWordsFromKeyboard()
