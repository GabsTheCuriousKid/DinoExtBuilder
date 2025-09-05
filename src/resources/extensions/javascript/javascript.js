import javascriptGenerator from '../../javascriptGenerator';
import registerBlock from '../../register';

const categoryPrefix = 'javascript_';
const categoryColor = '#0FBD8C';

function register() {
    registerBlock(`${categoryPrefix}eval`, {
        message0: 'eval %1',
        args0: [
            {
                "type": "input_value",
                "name": "EVAL",
                "check": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EVAL = javascriptGenerator.valueToCode(block, 'EVAL', javascriptGenerator.ORDER_ATOMIC);
        const code = `eval(${EVAL})`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}evalreporter`, {
        message0: 'eval %1',
        args0: [
            {
                "type": "input_value",
                "name": "EVAL",
                "check": "String"
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EVAL = javascriptGenerator.valueToCode(block, 'EVAL', javascriptGenerator.ORDER_ATOMIC);
        return [`eval(${EVAL})`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}fetch`, {
        message0: 'fetch %1',
        args0: [
            {
                "type": "input_value",
                "name": "TEXT",
                "check": "String"
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC);
        return [`fetch(${TEXT})`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;