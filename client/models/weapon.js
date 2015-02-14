'use strict';
/* global _, Weapon */
/* exported Weapon */

function Weapon(name, image) {
  this.name = name;
  this.image = image;
  this.damage = _.random(1, 20);
}
