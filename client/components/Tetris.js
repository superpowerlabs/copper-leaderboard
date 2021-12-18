// eslint-disable-next-line no-undef
const {Container, Row, Col} = ReactBootstrap
// eslint-disable-next-line no-undef
const {Redirect} = ReactRouterDOM

import {COL_SIZE, ROW_SIZE} from './tetris/shape'
import * as s from './tetris/shape'
import Square from './tetris/square'
import Mutex from 'await-mutex'
import Base from './Base'

const style = {
  width: '250px',
  height: '250px',
  margin: '0 auto',
  display: 'grid',
  borderWidth: '10px',
  gridTemplate: `repeat(${COL_SIZE}, 1fr) / repeat(${ROW_SIZE}, 1fr)`
}

const LEFT = 37 /* left arrow */
const ROTATE_UP = 90 /* z */
const RIGHT = 39 /* right arrow */
const DOWN = 40 /* down arrow */
const ROTATE_DOWN = 88 /* x */


const increaseSpeed = ({speed}) => speed - 10 * (speed > 10)

class Tetris extends Base {

  constructor(props) {
    super(props)
    const initialState = s.InitialState()
    initialState.score = 30
    initialState.speed = 200
    initialState.game = 1
    this.state = initialState
    this.mutex = new Mutex()

    this.bindMany([
      'resetGame',
      'shiftRight',
      'rotateClockwise',
      'getNextBlock',
      'shiftDown',
      'updateBoard',
      'keyInput',
      'resetError'
    ])
  }

  getInitialState() {

  }

  async resetError() {
    this.setTimeout(() => {
      this.setState({
        error: null
      })
    }, 3000)
  }

  resetGame() {
    const {accessToken, discordUser} = this.Store
    this.request('playing-now', 'post', {
      accessToken,
      userId: discordUser.id
    }).then(res => {
      if (!res.success) {
        this.setState({
          redirectTo: '/'
        })
      }
    })
    const initialState = s.InitialState()
    initialState.score = 300
    this.setState(initialState)
  }

  checkDigits() {
    if (!this.Store.digits) {
      this.setStore({
        poder: true
      }, true)
      return this.setState({
        redirectTo: '/'
      })
    }
    this.resetGame()
  }

  componentDidMount() {
    this.checkDigits()
    this.periodicInterval = setInterval(async () => {
      this.mutex.lock()
      if (!this.state.isPause) {
        this.updateBoard({shapePos: s.DEFAULT_VALUE})
        this.shiftDown()
        this.updateBoard(this.state)
        let newScore = this.state.score - 1
        if (newScore === 0) {
          const {accessToken, discordUser, digits} = this.Store
          const res = await this.request('give-me-my-token', 'post', {
            accessToken,
            userId: discordUser.id,
            digits
          })
          if (res.success) {
            this.setState({
              redirectTo: '/claim/' + res.redeemCode
            })
          } else {
            this.setState({
              error: res.error
            })
          }
        }
        this.setState({
          score: newScore
        })
      }
    }, this.state.speed)
    document.onkeydown = this.keyInput
  }


  componentWillUnmount() {
    clearInterval(this.periodicInterval)
  }

  // shift
  shiftRight(isRight) {
    let curShape = s.getShape(this.state)
    let {deltaX, func, isEdge} = isRight ?
      {
        deltaX: 1,
        func: edgeVal => Math.max.apply(null, edgeVal),
        isEdge: this.state.xPos + curShape[0].length === ROW_SIZE,
      } : {
        deltaX: -1,
        func: edgeVal => Math.min.apply(null, edgeVal),
        isEdge: this.state.xPos === 0,
      }
    // Making sure we are not going off the edge
    if (isEdge) {
      return
    }

    //Making sure we are not overlaping other shape
    let isConflict = false

    curShape.forEach(oldArray => {
      // Removing elemnts that are not part of block
      let newArray = oldArray.filter(val => val !== s.DEFAULT_VALUE)
      // checking the edge most value after we shift
      let edgeValue = func(newArray) + deltaX
      // checking that there is no conflict
      if (this.state.board[edgeValue] !== s.DEFAULT_VALUE) {
        isConflict = true
      }
    })

    // Shifting if there is not conflict
    if (!isConflict) {
      this.setState({xPos: this.state.xPos + deltaX})
    }
  }

  // rotate
  rotateClockwise (isClockwise) {
    let newState = _.clone(this.state)
    newState.rotatePos = s.rotateShape(isClockwise, this.state)
    let newShape = s.getShape(newState)

    let isConflict = false
    newShape.forEach(newArray => {
      // changing pos for element whieh are present in pos i.e it is not equal to default
      let conflictedArray = newArray.filter(elem =>
        // removing values that are not there in shape
        (elem !== s.DEFAULT_VALUE) &&
        // remove values that don't conflict with other shape
        (this.state.board[elem] !== s.DEFAULT_VALUE))
      // console.log(newArray, conflictedArray, isConflict, (newState.xPos + newShape.length > ROW_SIZE))

      // checking for conflict and making sure it is not going off edge
      if ((conflictedArray.length !== 0) || (newState.xPos + newShape.length >= ROW_SIZE)) {
        isConflict = true
      }
    })
    if (!isConflict) {
      this.setState({rotatePos: newState.rotatePos})
    }
  }

  getNextBlock () {
    let curShape = s.getShape(this.state)
    this.updateBoard(this.state)

    for (let i = 0; i < curShape.length; i++) {
      // getting the row that the shape is touching
      let row = [...Array(ROW_SIZE)].map((_, pos) => pos + ROW_SIZE * (this.state.yPos + i))

      // getting the value of all the bottom elements
      let isFilled = row.map(pos => this.state.board[pos])
        // checking the squares which are not filled
        .filter(val => val !== s.DEFAULT_VALUE)
        .length === ROW_SIZE
      if (isFilled) {
        let board = [...this.state.board]
        // clearing the row
        row.forEach(pos => board[pos] = s.DEFAULT_VALUE)
        // dropiing the above row by one column
        for (let j = row[0]; j > 0; j--) {
          if (board[j] !== s.DEFAULT_VALUE) {
            board[j + ROW_SIZE] = board[j]
            board[j] = s.DEFAULT_VALUE
          }
        }
        this.setState({board: board})
      }
    }

    this.setState({
      shapePos: s.getRandomShape(),
      speed: increaseSpeed(this.state),
      yPos: -3,
      xPos: ROW_SIZE / 2,
      rotatePos: 0,
    })
  }

  shiftDown() {
    let curShape = s.getShape(this.state)
    // Checking if bottom of the board is touched
    if (this.state.yPos + curShape.length >= COL_SIZE) {
      this.getNextBlock()
      return
    }

    // checking that there is no conflict
    curShape[0].forEach((_, pos) => {

      let newArray = curShape.map(row => (row[pos] === s.DEFAULT_VALUE) ? -1 : row[pos] + ROW_SIZE)
      let bottomValue = Math.max.apply(Math, newArray)
      if (
        // handling the shape before it touches the board
        (this.state.board[bottomValue] !== undefined) &&
        // checking if there is no collision
        this.state.board[bottomValue] !== s.DEFAULT_VALUE
      ) {

        if (this.state.yPos <= 0 && this.state.yPos !== -3) {
          this.getNextBlock()
          this.setState({
            game: this.state.game + 1
          })
          this.resetGame()
        } else {
          this.getNextBlock()
        }
        return
      }
    })


    this.setState({yPos: this.state.yPos + 1})
  }

  updateBoard ({shapePos})  {
    let board = [...this.state.board]
    let curShape = s.getShape(this.state)
    curShape.forEach(row =>
      row.forEach(pos => {
        if (pos !== s.DEFAULT_VALUE) {
          board[pos] = shapePos
        }
      }))
    this.setState({board: board})
  }

  keyInput ({keyCode}) {
    this.mutex.lock()
    if (this.state.isPause) {
      // if (keyCode === STOP) {
        // this.pauseGame()
      // }
      return
    }

    // clearing the board
    this.updateBoard({shapePos: s.DEFAULT_VALUE})

    switch (keyCode) {
      case LEFT:
      case RIGHT:
        this.shiftRight(keyCode === RIGHT)
        break
      case ROTATE_UP:
      case ROTATE_DOWN:
        this.rotateClockwise(keyCode === ROTATE_UP)
        break
      case DOWN:
        // this.detectCollision()
        this.shiftDown()
        break
    }
    this.updateBoard(this.state)
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect to={this.state.redirectTo}/>
    }
    if (this.state.error) {
      this.resetError()
    }

    const board = this.state.board.map((val, pos) => <Square key={pos} name={pos} color={val}/>)
    return (
      <Container className={'topContainer'}>
        <div className={'centered'}><h2>Game #{this.state.game}</h2></div>
      <div className={'clearBoth'}>
        <Row>
          <Col>
            <div><h5>INSTRUCTIONS</h5></div>
            <div>Use arrows to move left and right</div>
            <div>Z and X to rotate</div>
            {this.state.error? <div className={'error mt20'}>{this.state.error}</div> : null}
          </Col>
          <Col>

            <div style={style}> {board} </div>
          </Col>
          <Col>
            <div className={'alignRight'}>COUNTDOWN</div>
            <h1 className={'alignRight'}>{
              this.state.score >= 0
                ? this.state.score
                : <span className={'crimson'}>{-this.state.score}</span>

            }</h1>

          </Col>
        </Row>

      </div>

      </Container>
    )
  }
}

export default Tetris
