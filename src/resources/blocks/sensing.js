import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
import Blockly from 'blockly/core'

const categoryPrefix = 'sensing_';
const categoryColor = '#5CB1D6';

function register() {
    // when key pressed
    registerBlock(`${categoryPrefix}keypress`, {
        message0: 'when key %1 is pressed %2 %3',
        args0: [
            {
                "type": "field_input",
                "name": "KEY",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
        extensions: [
          'single_character_validation',
        ],
    }, (block) => {
        const KEY = block.getFieldValue('KEY')
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `document.addEventListener("keypress", event => {
            if (event.key == '${KEY}') { ${BLOCKS} }
        });`;
        return `${code}\n`;
    })

    // alert
    registerBlock(`${categoryPrefix}alert`, {
        message0: 'alert %1',
        args0: [
            {
                "type": "input_value",
                "name": "ALERT"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ALERT = javascriptGenerator.valueToCode(block, 'ALERT', javascriptGenerator.ORDER_ATOMIC);
        const code = `alert(${ALERT || '""'})`;
        return `${code}\n`;
    })
    
    // confirm
    registerBlock(`${categoryPrefix}confirm`, {
        message0: 'confirm %1',
        args0: [
            {
                "type": "input_value",
                "name": "ALERT"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ALERT = javascriptGenerator.valueToCode(block, 'ALERT', javascriptGenerator.ORDER_ATOMIC);
        return [`confirm(${ALERT || '""'})`, javascriptGenerator.ORDER_ATOMIC];
    })
    
    // prompt
    registerBlock(`${categoryPrefix}prompt`, {
        message0: 'prompt %1',
        args0: [
            {
                "type": "input_value",
                "name": "ALERT"
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ALERT = javascriptGenerator.valueToCode(block, 'ALERT', javascriptGenerator.ORDER_ATOMIC);
        return [`prompt(${ALERT || '""'})`, javascriptGenerator.ORDER_ATOMIC];
    })
    
    // time
    registerBlock(`${categoryPrefix}time`, {
        message0: 'time (ms) since 1970',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Date.now()`, javascriptGenerator.ORDER_ATOMIC];
    })
    
    // year
    registerBlock(`${categoryPrefix}currenttime`, {
        message0: 'current %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "DATE",
                "options": [
                    ["year", "FullYear()"],
                    ["month", "Month() + 1"],
                    ["date", "Date()"],
                    // ["day of week", "Day()"],
                    ["hour", "Hours()"],
                    ["minute", "Minutes()"],
                    ["second", "Seconds()"],
                    // ["js timestamp", "Now()"],
                ]
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const DATE = block.getFieldValue('DATE');
        return [`(new Date().get${DATE})`, javascriptGenerator.ORDER_ATOMIC];
    })
    
    // leap year or not
    registerBlock(`${categoryPrefix}leapyear`, {
        message0: 'is leap year?',
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`((new Date(new Date(Date.now()).getYear(), 1, 29)).getDate() === 29)`, javascriptGenerator.ORDER_ATOMIC];
    })

    // is user focused or not
    registerBlock(`${categoryPrefix}isfocused`, {
        message0: 'is user focused?',
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`document.hasFocus()`, javascriptGenerator.ORDER_ATOMIC];
    })

    // get mouse x/y
    registerBlock(`${categoryPrefix}getmouseposition`, {
        message0: 'get mouse %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "POSITION",
                "options": [
                    ["x", "X"],
                    ["y", "Y"],
                ]
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const POSITION = block.getFieldValue('POSITION');
        return [`Scratch.vm.runtime.ioDevices.mouse.getScratch${POSITION}()`, javascriptGenerator.ORDER_ATOMIC];
    })

    // get cilent mouse x/y
    registerBlock(`${categoryPrefix}getcilentmouseposition`, {
        message0: 'get cilent mouse %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "POSITION",
                "options": [
                    ["x", "X"],
                    ["y", "Y"],
                ]
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const POSITION = block.getFieldValue('POSITION');
        return [`Scratch.vm.runtime.ioDevices.mouse.getClient${POSITION}()`, javascriptGenerator.ORDER_ATOMIC];
    })

    // is mouse down
    registerBlock(`${categoryPrefix}ismousedown`, {
        message0: 'is mouse down?',
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Scratch.vm.runtime.ioDevices.mouse.getIsDown()`, javascriptGenerator.ORDER_ATOMIC];
    })

    // get timer
    registerBlock(`${categoryPrefix}gettimer`, {
        message0: 'get project timer',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Scratch.vm.runtime.ioDevices.clock.projectTimer()`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}resettimer`, {
        message0: 'reset project timer',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.clock.resetProjectTimer();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}pausetimer`, {
        message0: 'pause project timer',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.clock.pause();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}resumetimer`, {
        message0: 'resume project timer',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.vm.runtime.ioDevices.clock.resume();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}optiontimer`, {
        message0: '%1 project timer',
        args0: [
            {
                "type": "field_dropdown",
                "name": "OPTION",
                "options": [
                    ["pause", "pause"],
                    ["resume", "resume"],
                ]
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const OPTION = block.getFieldValue('OPTION');
        const code = `Scratch.vm.runtime.ioDevices.clock.${OPTION}();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}getusername`, {
        message0: 'get username',
        args0: [],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Scratch.vm.runtime.ioDevices.userData.getUsername()`, javascriptGenerator.ORDER_ATOMIC];
    })
}

Blockly.Extensions.register('single_character_validation', function() {
    this.getField('KEY').setValidator(function(newValue) {
        return newValue.substring(Math.max(newValue.length - 1, 0),newValue.length);
    });
});

export default register;
