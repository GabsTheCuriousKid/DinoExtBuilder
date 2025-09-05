import javascriptGenerator from '../../javascriptGenerator';
import registerBlock from '../../register';

const categoryPrefix = 'timers_';
const categoryColor = '#5CB1D6';

function register() {
    registerBlock(`${categoryPrefix}createtimer`, {
        message0: 'create timer with id %1',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.createTimer(${ID})`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}gettimer`, {
        message0: 'get timer with id %1',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.getTimer(${ID})`;
        return [`${code}`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}gettimerobject`, {
        message0: 'get timer object with id %1',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            }
        ],
        output: "JSONObject",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.getTimerObject(${ID})`;
        return [`${code}`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}gettimers`, {
        message0: 'get object of timers',
        args0: [],
        output: "JSONObject",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `Scratch.Timers.getTimers()`;
        return [`${code}`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}restarttimer`, {
        message0: 'restart timer with id %1',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.restartTimer(${ID})`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}stoptimer`, {
        message0: 'stop timer with id %1',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.stopTimer(${ID})`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}settimer`, {
        message0: 'set timer with id %1 to %2',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "TO",
                "check": "Number"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const TO = javascriptGenerator.valueToCode(block, 'TO', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.setTimerTo(${ID}, ${TO})`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}pausetimer`, {
        message0: 'pause timer with id %1',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.pauseTimer(${ID})`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}resumetimer`, {
        message0: 'resume timer with id %1',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.resumeTimer(${ID})`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}istimerpaused`, {
        message0: 'is timer with id %1 paused',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.getTimerObject(${ID}).paused`;
        return [`${code}`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}hastimerstarted`, {
        message0: 'has timer with id %1 started',
        args0: [
            {
                "type": "input_value",
                "name": "ID",
                "check": "String"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const ID = javascriptGenerator.valueToCode(block, 'ID', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.Timers.getTimerObject(${ID}).started`;
        return [`${code}`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;