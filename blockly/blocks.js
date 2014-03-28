/**
 * Blockly Apps: Maze Blocks
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blocks for Blockly's Maze application.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';


var BlocklyApps = {
  getMsg: function( id ) { return ""; }
}; 


// Extensions to Blockly's language and JavaScript generator.

Blockly.Blocks['maze_moveForward'] = {
  // Block for moving forward.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Move');
    this.setColour(290);
    this.appendDummyInput()
        .appendField( 'moveForward' );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Moves the rover on the screen representing the player forward one square on the maze board'));
  }
};

Blockly.JavaScript['maze_moveForward'] = function(block) {
  var id = Blockly.Blocks.vwfNodes[ "player" ];
  return "vwf.callMethod('"+id+"','executeBlocklyCmd',['moveForward']);\n";
};

Blockly.Blocks['maze_turn'] = {
  // Block for turning left or right.
  init: function() {
    var DIRECTIONS =
        [[ 'turnLeft', 'turnLeft' ],
         [ 'turnRight', 'turnRight' ] ];
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Turn');
    this.setColour(290);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Turns the rover on the screen representing the player 90 degrees counter-clockwise (left) or clockwise (right)'));
  }
};

Blockly.JavaScript['maze_turn'] = function(block) {
  // Generate JavaScript for turning left or right.
  var dir = block.getFieldValue('DIR');
  var id = Blockly.Blocks.vwfNodes[ "player" ];
  return "vwf.callMethod('"+id+"','executeBlocklyCmd',['"+dir+"']);\n";
};

Blockly.Blocks['maze_if'] = {
  // Block for 'if' conditional if there is a path.
  init: function() {
    var DIRECTIONS =
        [[ 'pathAhead', 'isPathForward' ],
         [ 'pathLeft', 'isPathLeft' ],
         [ 'pathRight', 'isPathRight' ] ];
    this.setColour(210);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.appendStatementInput('DO')
        .appendField( 'doCode' );
    this.setTooltip( "'path' refers to a path through a maze." );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


Blockly.JavaScript['maze_if'] = function(block) {
  // Generate JavaScript for 'if' conditional if there is a path.
  var argument = 'Maze.' + block.getFieldValue('DIR') +
      '(\'block_id_' + block.id + '\')';
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  var code = 'if (' + argument + ') {\n' + branch + '}\n';
  return code;
};

Blockly.Blocks['maze_ifElse'] = {
  // Block for 'if/else' conditional if there is a path.
  init: function() {
    var DIRECTIONS =
        [[BlocklyApps.getMsg('Maze_pathAhead'), 'isPathForward'],
         [BlocklyApps.getMsg('Maze_pathLeft'), 'isPathLeft'],
         [BlocklyApps.getMsg('Maze_pathRight'), 'isPathRight']];
    this.setColour(210);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(DIRECTIONS), 'DIR');
    this.appendStatementInput('DO')
        .appendField(BlocklyApps.getMsg('Maze_doCode'));
    this.appendStatementInput('ELSE')
        .appendField(BlocklyApps.getMsg('Maze_elseCode'));
    this.setTooltip(BlocklyApps.getMsg('Maze_ifelseTooltip'));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.JavaScript['maze_ifElse'] = function(block) {
  // Generate JavaScript for 'if/else' conditional if there is a path.
  var argument = 'Maze.' + block.getFieldValue('DIR') +
      '(\'block_id_' + block.id + '\')';
  var branch0 = Blockly.JavaScript.statementToCode(block, 'DO');
  var branch1 = Blockly.JavaScript.statementToCode(block, 'ELSE');
  var code = 'if (' + argument + ') {\n' + branch0 +
             '} else {\n' + branch1 + '}\n';
  return code;
};

Blockly.Blocks['maze_forever'] = {
  // Do forever loop.
  init: function() {
    this.setHelpUrl('http://code.google.com/p/blockly/wiki/Repeat');
    this.setColour(120);
    this.appendDummyInput()
        .appendField(BlocklyApps.getMsg('Maze_repeatUntil'))
        .appendField(new Blockly.FieldImage('marker.png', 12, 16));
    this.appendStatementInput('DO')
        .appendField(BlocklyApps.getMsg('Maze_doCode'));
    this.setPreviousStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Maze_whileTooltip'));
  }
};

Blockly.JavaScript['maze_forever'] = function(block) {
  // Generate JavaScript for do forever loop.
  var branch = Blockly.JavaScript.statementToCode(block, 'DO');
  if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
    branch = Blockly.JavaScript.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'block_id_' + block.id + '\'') + branch;
  }
  return 'while (true) {\n' + branch + '}\n';
};
