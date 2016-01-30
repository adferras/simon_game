$(document).ready(function() {

  var game_on = false;
  var running = false;
  var strict = false;
  var correct_so_far = true;
  var count = 0;
  var interval = '';
  var sequence = [];
  var copy = [];
  var win_length = 20;
  var current_quadrant = '';
  var audio = [];
  audio[0] = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
  audio[1] = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
  audio[2] = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
  audio[3] = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
  audio[4] = new Audio('http://soundbible.com/grab.php?id=1540&type=mp3');
  var board = [
    '#top-left',
    '#top-right',
    '#bottom-right',
    '#bottom-left'
  ];

  $('.switch').click(function() {
    if (!game_on) {
      game_on = true;
      $('.switch-button').toggleClass('switch-on');
      $('.count-display').text('- -');
    } else {
      game_on = false;
      running = false;
      strict = false;
      $('.switch-button').toggleClass('switch-on');
      $('.strict-button').removeClass('button-on');
      $('.count-display').text('');
      reset_game();
    }
  });

  $('.start-button').click(function() {
    if (game_on && !running) {
      running = true;
      sequence = [];
      copy = [];
      $('.start-button').toggleClass('button-on');
      count = 0;
      next_round();
    }
  });

  $('.strict-button').click(function() {
    if (game_on && !running) {
      strict = !strict;
      $('.strict-button').toggleClass('button-on');
    }
  });

  function next_round() {
    count++;
    sequence.push(Math.floor(Math.random() * 4));
    copy = sequence.slice(0);
    $('.count-display').text(count);
    display();
  }

  function display() {
    disable_board();
    var i = 0;
    interval = setInterval(function() {
      highlight(sequence[i]);
      i++;
      if (i >= sequence.length) {
        clearInterval(interval);
        enable_board();
        users_turn();
      }
    }, display_timer());
  }

  function users_turn() {
    $('.quadrant').click(function(){
      current_quadrant = board.indexOf('#' + $(this).attr('id'));
      var correctResponse = copy.shift();
      var actualResponse = board.indexOf('#' + $(this).attr('id'));
      correct_so_far = (correctResponse === actualResponse);
      check_game();
    });

    $('.quadrant').mousedown(function(){
      $(this).addClass('highlight');
    });

    $('.quadrant').mouseup(function(){
      $(this).removeClass('highlight');
    });
  }

  function highlight(quadrant) {
    audio[quadrant].play();
    $(board[quadrant]).addClass('highlight');
    window.setTimeout(function() {
      $(board[quadrant]).removeClass('highlight');
    }, (display_timer()/2));
  }

  function display_timer(){
    if (count <= 5) {
      return 2000;
    } else if (count <= 9) {
      return 1500;
    } else if (count <= 13) {
      return 1000;
    } else {
      return 500;
    }
  }

  function check_game(){
    if (copy.length === 0  && sequence.length === win_length && correct_so_far) {
      audio[current_quadrant].play();
      disable_board();
      end_game('won');
    } else if (copy.length === 0 && correct_so_far) {
      audio[current_quadrant].play();
      disable_board();
      next_round();
    } else if (!correct_so_far) {
      audio[4].play();
      disable_board();
      lose_move();
    } else {
      audio[current_quadrant].play();
    }
  }

  function lose_move() {
    if(strict) {
      end_game('lost');
    } else {
      $('.count-display').text('! !');
      setTimeout(function(){ replay_last(); }, 1000);
    }
  }

  function replay_last() {
    $('.count-display').text(count);
    copy = sequence.slice(0);
    display();
  }

  function end_game(result) {
    alert('You have ' + result + ' the game!');
    $('.start-button').removeClass('button-on');
    running = false;
    reset_game();
  }

  function reset_game() {
    disable_board();
    clearInterval(interval);
    $('.count-display').text('- -');
    $('.start-button').removeClass('button-on');
  }

  function enable_board(){
    for( i = 0; i < board.length; i++) {
      $(board[i]).addClass('quadrant-on');
      $(board[i]).removeClass('quadrant-off');
    }
  }

  function disable_board(){
    for( i = 0; i < board.length; i++) {
      $(board[i]).removeClass('quadrant-on');
      $(board[i]).addClass('quadrant-off');
    }
    $('.quadrant').off('click');
    $('.quadrant').off('mousedown');
    $('.quadrant').off('mouseup');
  }
});
