var GameObj = {
    player: null,
    enemy: null,
    defEnemies: [],
    roundInProgress: false
};

var character1 = {
    name: 'Obi',
    health: 140,
    defeat: 10,
    power: 10,
    img: 'assets/images/obi-wan-icon.png'
};
var character2 = {
    name: 'Luke',
    health: 100,
    defeat: 5,
    power: 5,
    img: 'assets/images/skywalker-icon.png'
};
var character3 = {
    name: 'Darth',
    health: 150,
    defeat: 20,
    power: 20,
    img: 'assets/images/vader-icon.png'
};
var character4 = {
    name: 'Maul',
    health: 180,
    defeat: 25,
    power: 25,
    img: 'assets/images/maul-icon.png'
};


var allCharacters = [character1, character2, character3, character4];

function selectCharacter(index, card) {
    card.removeClass('avail-char').hide();

    if (GameObj.player === null) {

        GameObj.player = Object.assign({}, allCharacters[index]);
        displayMessage('You have selected ' + GameObj.player.name + '. Please select your Enemy...', 'alert-warning');
        $('#yourChar').html('<div class="card border-success">\n' +
            '  <img class="card-img-top" src="' + GameObj.player.img + '" alt="' + GameObj.player.name + '">\n' +
            '  <div class="card-body">\n' +
            '    <h5 class="card-title">' + GameObj.player.name + '</h5>\n' +
            '    <p class="card-text">Health: <span id="yourHealth">' + GameObj.player.health + '</span></p>\n' +
            '  </div>\n' +
            '</div>');
        markAllEnemies();
    } else {
        if (GameObj.roundInProgress === false) {
            GameObj.enemy = Object.assign({}, allCharacters[index]);
            GameObj.defEnemies.push(index);
            displayMessage('You have selected ' + GameObj.player.name + '. Your enemy is ' + GameObj.enemy.name + '. Now Fight!', 'alert-danger');
            $('#defChar').html('<div class="card border-danger">\n' +
                '  <img class="card-img-top" src="' + GameObj.enemy.img + '" alt="' + GameObj.enemy.name + '">\n' +
                '  <div class="card-body">\n' +
                '    <h5 class="card-title">' + GameObj.enemy.name + '</h5>\n' +
                '    <p class="card-text">Health: <span id="eHealth">' + GameObj.enemy.health + '</span></p>\n' +
                '  </div>\n' +
                '</div>');
            GameObj.roundInProgress = true;
            tempDisableOtherEnemies();
            $('#attackButton').show();
        } else {
            alert('Please complete this round first!');
            return false;
        }
    }
    return true;
}

function tempDisableOtherEnemies() {
    $('.avail-char').css('opacity', '0.6');
    $('.char-select').attr('disabled', 'disabled');
}

function tempEnableOtherEnemies() {
    $('.avail-char').css('opacity', '1');
    $('.char-select').removeAttr('disabled');
}

function markAllEnemies() {
    $('.avail-char').removeClass('border-success').addClass('border-danger');
}

function attack() {
    GameObj.enemy.health = GameObj.enemy.health - GameObj.player.power;
    GameObj.player.health = GameObj.player.health - GameObj.enemy.power;

    $('#eHealth').text(GameObj.enemy.health);
    $('#yourHealth').text(GameObj.player.health);


    displayMessage('You attacked with ' + GameObj.player.power + ' power. Your enemy\'s health is ' + GameObj.enemy.health + '. Your enemy attacked you with ' + GameObj.enemy.power + ' power. Your health is ' + GameObj.player.health + '.', 'alert-danger');

    GameObj.player.power = GameObj.player.power + GameObj.player.defeat;


    if (GameObj.enemy.health <= 0) {
        if (GameObj.defEnemies.length >= (allCharacters.length - 1)) {
            gameWon();
            return;
        }
        nextRound();
    }

    if (GameObj.player.health <= 0) {
        gameOver();
    }
}

function gameOver() {
    displayMessage(GameObj.enemy.name + ' has killed you. Game Over.', 'alert-danger');
    $('#restartButton').show();
    $('#attackButton').hide();
    $('#yourChar').html('');
    $('#defChar').html('');
}

function nextRound() {
    GameObj.roundInProgress = false;
    $('#defChar').html('');
    $('#attackButton').hide();
    tempEnableOtherEnemies();
    displayMessage('You have killed ' + GameObj.enemy.name + '. Please select the next Enemy.', 'alert-warning');
}

function gameWon() {
    displayMessage('You have killed all enemies. You won!!!', 'alert-success');
    $('#restartButton').show();
    $('#attackButton').hide();
    $('#yourChar').html('');
    $('#defChar').html('');
}

function displayMessage(message, messageClass) {
    $('#message').text(message).attr('class', 'alert').addClass(messageClass);
}

function printAvailCharacters() {
    $('#availChar').html('');
    $.each(allCharacters, function (index, value) {
        $('#availChar').append('<div class="col"><div class="card characters avail-char">\n' +
            '  <img class="card-img-top" src="' + value.img + '" alt="' + value.name + '">\n' +
            '  <div class="card-body">\n' +
            '    <h5 class="card-title">' + value.name + '</h5>\n' +
            '    <p class="card-text">Health: ' + value.health + '</p>\n' +
            '    <button class="btn btn-primary char-select" data-char="' + index + '">Select</button>\n' +
            '  </div>\n' +
            '</div></div>');
    });
    $('.char-select').click(clickCharacter);
}

function startGame() {
    $('#attackButton').hide();
    $('#restartButton').hide();
    printAvailCharacters();
}

function resetGame() {
    GameObj = {
        player: null,
        enemy: null,
        defEnemies: [],
        roundInProgress: false
    };
    $('#yourChar').html('');
    $('#defChar').html('');
    displayMessage('Please select your character.', 'alert-success');
    startGame();
}

function clickCharacter() {
    console.log(this);
    console.log($(this));
    var card = $(this).parent().parent();
    selectCharacter(parseInt($(this).attr('data-char')), card);
}

$(function () {
    startGame();
});