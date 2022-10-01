const ai = await tf.loadLayersModel('model.json');

// Uncomment this to show the Model Summary in the side of the window
// tfvis.show.modelSummary({name: "Model Summary"}, ai)

const game = {
    xTurn: true,
    xState: [],
    oState: [],
    winningStates: [
        // Rows
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],

        // Columns
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],

        // Diagonal
        ['0', '4', '8'],
        ['2', '4', '6']
    ]

}

function game2state() {
    let xstate = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
    ];
    let ostate = [
        [false, false, false],
        [false, false, false],
        [false, false, false]
    ];

    for (const value of game.xState) {
        const int_val = parseInt(value)
        const id_1 = int_val % 3
        const id_2 = (int_val - id_1) / 3

        xstate[id_1][id_2] = true

    }
    for (const value of game.oState) {
        const int_val = parseInt(value)
        const id_1 = int_val % 3
        const id_2 = (int_val - id_1) / 3

        ostate[id_1][id_2] = true
    }

    let square_played = xstate.map((row, i) => row.map((element, j) => element || ostate[i][j]));

    let tf_xstate = tf.tensor2d(xstate).reshape([9, 1]).squeeze()
    let tf_ostate = tf.tensor2d(ostate).reshape([9, 1]).squeeze()
    let tf_current_player = tf.tensor1d([game.xTurn])
    // let tf_state = tf.stack([tf_xstate, tf_ostate], 1).expandDims(0)
    let tf_state = tf.concat([tf_ostate, tf_xstate, tf_current_player]).expandDims(0)
    if (game.xTurn) {
        let tf_state = tf.concat([tf_xstate, tf_ostate, tf_current_player]).expandDims(0)
        console.log("yes")
    }

    console.log("Game state")
    console.log(tf_state.arraySync())

    let result = ai.predict(tf_state).reshape([3, 3])

    console.log("AI predict")
    console.log(result.arraySync())

    // Need to remove unplayable squares
    const nope = tf.tensor2d([[-99, -99, -99], [-99, -99, -99], [-99, -99, -99]])
    result = nope.where(square_played, result).reshape([9])

    console.log("REMOVE PLAYED")
    console.log(result.arraySync())

    // Convert to the correct square number
    // The squares are counted in the model as
    // 0 3 6
    // 1 4 7
    // 2 5 8
    // BUT in this application as
    // 0 1 2
    // 3 4 5
    // 6 7 8
    let best_move = tf.argMax(result, 0).arraySync()
    console.log(`best move is ${best_move}`)

    let best_x = best_move % 3
    let best_y = (best_move - best_x) / 3
    console.log(`best x is ${best_x}`)
    console.log(`best_y is ${best_y}`)
    let converted_best_move = best_x * 3 + best_y
    console.log(`best move converted is ${converted_best_move}`)
    return converted_best_move
}
document.addEventListener('click', on_click)

document.querySelector('.restart').addEventListener('click', new_game)

/**
 * Code that is run when there is a click somewhere on the page
 * @param event
 */
function on_click(event) {
    const target = event.target
    const isCell = target.classList.contains('square')
    let is_result = check_result()
    console.log(`Is there a result: ${is_result}`)
    console.log(`Not ${!is_result}`)

    if (isCell && !is_result) {
        // We have clicked on a square, so now try to make a move there
        console.log(`Human playing in square ${target.dataset.value}`)
        play_move(target)

        // Check if there has been a result
        let is_result = check_result()
        console.log(`The player has played and is there a result?: ${is_result}`)

        // If the game isn't over then it's the AI's turn
        if (!is_result) {
            let ai_turn = game2state()

            console.log(`AI playing in square ${ai_turn}`)

            // Get the div with the right value
            let ai_target = document.querySelector(`[data-value="${ai_turn}"]`)
            play_move(ai_target)
        }

        is_result = check_result()
    }
}

/**
 * Check the game for a result
 */
function check_result() {

    let is_result = false
    // Check for win
    game.winningStates.forEach(winningState => {
        const xWins = winningState.every(state => game.xState.includes(state))
        const oWins = winningState.every(state => game.oState.includes(state))

        if (xWins || oWins) {
            document.querySelector('.game-over').classList.add('visible')
            document.querySelector('.game-over-text').textContent = xWins
                ? 'you win'
                : 'i win'
            console.log(`There was a win, returning true`)
            is_result = true
        }
    })

    if (is_result) return is_result

    // Check for draw
    if (game.xState.length + game.oState.length === 9) {
        document.querySelector('.game-over').classList.add('visible')
        document.querySelector('.game-over-text').textContent = 'draw'
        console.log(`There was a draw, returning true`)
        is_result = true
    }

    if (is_result) return is_result

    console.log("There was no result")
    return is_result;
}

/**
 * Make a move in a cell
 * @param target
 */
function play_move(target) {
    const cellValue = target.dataset.value

    if (game.xState.includes(cellValue) || game.oState.includes(cellValue)) {
        // The square has already been played in so do nothing
        return
    }

    let image_src
    // Update the game and set the image to show in the square
    if (game.xTurn) {
        game.xState.push(cellValue)
        image_src = "static/cross.png"
    } else {
        game.oState.push(cellValue)
        image_src = "static/circle.png"
    }
    game.xTurn = !game.xTurn

    // Add html to the square div to show the cross/circle image
    target.innerHTML = "<img src='" + image_src + "'/>"
}

/**
 * Start a new game
 */
function new_game() {

    // Remove the game over text
    document.querySelector('.game-over').classList.remove('visible')
    // Remove the crosses and circles
    document.querySelectorAll('.square').forEach(cell => {
        cell.innerHTML = null
    })

    // Reset the game to the starting state
    game.xTurn = true
    game.xState = []
    game.oState = []

    console.log(`Reset the board to new game`)
}


