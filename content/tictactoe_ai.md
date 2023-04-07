---
title: "Building a tictactoe AI using reinforcement learning"
date: 2023-04-07T16:33:09+10:00
draft: false
---

## Play the AI

You can use the board below to play a game of Tic Tac Toe against an AI that I have trained using reinforcement learning. To make a move, simply click on one of the squares. The AI will then make its move, and the game will continue until one player wins or the game ends in a tie.


<head>
    <link rel="stylesheet" href='/tictactoe/static/css/main.css' />
    <!-- Import TensorFlow.js -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js"></script>
    <!-- Import tfjs-vis -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-vis@1.0.2/dist/tfjs-vis.umd.min.js"></script>
</head>
<body>
    <script type="module" src='/tictactoe/game.js' defer></script>
    <div class="game_container">
        <div class="board">
            <div class="square" data-value="0"></div>
            <div class="square" data-value="1"></div>
            <div class="square" data-value="2"></div>
            <div class="square" data-value="3"></div>
            <div class="square" data-value="4"></div>
            <div class="square" data-value="5"></div>
            <div class="square" data-value="6"></div>
            <div class="square" data-value="7"></div>
            <div class="square" data-value="8"></div>
        </div>
    </div>
    <div class="game-over">
        <div class="game-over-text"></div>
        <button class="restart">Play again</button>
    </div>
</body>
