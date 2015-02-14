'use strict';
/* global Weapon, Fighter, _ */

$(document).ready(init);

function init() {
  playTheme();
  createWeapons();
  paintWeapons();
  createFighters();
  paintFighters();
  chooseFighter();
  $('#weapons').on('click', '.weapon:not(".picked")', clickWeapon);
  $('#fight').click(clickFight);
}

var weapons = [];
var fighters = [];
var equipped = [];
var deathFighters = [];

function clickFight() {
  if (equipped.length >= 2) {
    var p1 = _.sample(equipped);
    var p2;
    while (true) {
      p2 = _.sample(equipped);
      if (p2.name !== p1.name) {
        break;
      }
    }
    removeSelectedColor();
    colorPlayers(p1, p2);
    p1.hit(p2);
    reduceHealth(p2);
  }
}

function reduceHealth(player) {
  var $player = $('.fighter:contains("' + player.name + '")');
  var $health = $player.find('.health');
  player.health <= 0 ? $health.text('h: 0') : $health.text('h: ' + player.health);
  if (player.health <= 0) {
    $player.addClass('picked');
    deathFighters.push(_.remove(equipped, function(f) { return f.name === player.name; })[0]);
    if (equipped.length >= 2) {
      $('#fx').attr('src', '/audio/dead.mp3');
      $('#fx')[0].play();
    } else {
      $('#music').attr('src', '/audio/winner.mp3');
      $('#music')[0].play();
    }
  }
}

function removeSelectedColor() {
  equipped.forEach(function(e) {
    var $e = $('.fighter:contains("' + e.name + '")');
    $e.removeClass('player-one');
    $e.removeClass('player-two');
  });
}

function colorPlayers(p1, p2) {
  var $p1 = $('.fighter:contains("' + p1.name + '")');
  var $p2 = $('.fighter:contains("' + p2.name + '")');
  $p1.addClass('player-one');
  $p2.addClass('player-two');
}

function clickWeapon() {
  var weaponName = $(this).find('.name').text();
  var weapon = _.find(weapons, function(weapon) { return weapon.name === weaponName; });
  var $fighter = $('.choose');
  var fighterName = $fighter.find('.name').text();
  var fighter = _.find(fighters, function(f) { return f.name === fighterName; });
  fighter.weapon = weapon;
  addWeaponToFighter($fighter, weapon);
  equipped.push(_.remove(fighters, function(f) { return f.name === fighterName; })[0]);
  $(this).addClass('picked');
  $fighter.removeClass('choose');

  if (fighters.length) {
    chooseFighter();
  }
}

function chooseFighter() {
  var fighter = _.sample(fighters);
  var $fighter = $('.fighter:contains("' + fighter.name + '")');
  $fighter.addClass('choose');
}

function playTheme() {
  $('#music').attr('src', '/audio/theme.mp3');
  $('#music')[0].play();
}

function createWeapons() {
  var w1 = new Weapon('Power Pole', 'http://www.officialpsds.com/images/thumbs/Gokus-Power-Pole-psd61169.png');
  var w2 = new Weapon('Kamehameha', 'http://vignette1.wikia.nocookie.net/dragonball/images/5/55/13._Goku_finish_Super_Sigma_off_with_a_Kamehameha.png/revision/latest?cb=20120827120355');
  var w3 = new Weapon('Henki Dama', 'http://vignette1.wikia.nocookie.net/dragonball/images/2/2c/GenkiDama.jpg/revision/latest?cb=20120603124127');
  var w4 = new Weapon('Massenko', 'http://img2.wikia.nocookie.net/__cb20100313175252/dragonball/images/8/8c/Super_Masenko.jpg');

  weapons.push(w1, w2, w3, w4);
}

function createFighters() {
  var f1 = new Fighter('Goku', 'http://piq.codeus.net/static/media/userpics/piq_64835_400x400.png');
  var f2 = new Fighter('Vegeta', 'http://piq.codeus.net/static/media/userpics/piq_125210_400x400.png');
  var f3 = new Fighter('Majin Buu', 'http://static.giantbomb.com/uploads/original/15/155548/2279905-super_buu__cell_absorbed_.png');
  var f4 = new Fighter('Perfect Cell', 'http://vignette2.wikia.nocookie.net/dragonball/images/6/64/Perfect_cell_by_noname37-d33a2d5.png/revision/latest?cb=20120124062858');
  fighters.push(f1, f2, f3, f4);

}

function paintWeapons() {
  weapons.forEach(function(weapon) {
    var $outer = $('<div>');
    $outer.addClass('weapon');

    var $img = $('<div>');
    $img.css('background-image', 'url("' + weapon.image + '")');

    var $info = $('<div>');
    var $name = $('<div>');
    $name.addClass('name');
    $name.text(weapon.name);

    var $damage = $('<div>');
    $damage.text('d: ' + weapon.damage);

    $outer.append($img, $info);
    $info.append($name, $damage);
    $('#weapons').append($outer);
  });
}

function paintFighters() {
  fighters.forEach(function(fighter) {
    var $outer = $('<div>');
    $outer.addClass('fighter');

    var $img = $('<div>');
    $img.css('background-image', 'url("' + fighter.image + '")');

    var $info = $('<div>');
    var $name = $('<div>');
    $name.addClass('name');
    $name.text(fighter.name);

    var $armor = $('<div>');
    $armor.text('a: ' + fighter.armor);

    var $health = $('<div>');
    $health.addClass('health');
    $health.text('h: ' + fighter.health);

    var $strength = $('<div>');
    $strength.text('s: ' + fighter.strength);

    $outer.append($img, $info);
    $info.append($name, $armor, $health, $strength);
    $('#fighters').append($outer);
  });
}

function addWeaponToFighter($fighter, weapon) {
  $fighter.children().eq(1).append('<div>w: ' + weapon.name + '</div>');
}
