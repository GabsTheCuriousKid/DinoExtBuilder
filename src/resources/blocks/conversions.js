import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'conversions_';
const categoryColor = '#8BC059';

function register() {
    // tonumber
    registerBlock(`${categoryPrefix}tonumber`, {
        message0: "%1 to number",
        args0: [
            {
                "type": "input_value",
                "name": "VAL"
            },
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VAL = javascriptGenerator.valueToCode(block, 'VAL', javascriptGenerator.ORDER_ATOMIC);

        return [`Number(${VAL})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // tostring
    registerBlock(`${categoryPrefix}tostring`, {
        message0: "%1 to string",
        args0: [
            {
                "type": "input_value",
                "name": "VAL"
            },
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VAL = javascriptGenerator.valueToCode(block, 'VAL', javascriptGenerator.ORDER_ATOMIC);

        return [`String(${VAL})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // tostring
    registerBlock(`${categoryPrefix}toboolean`, {
        message0: "%1 to boolean",
        args0: [
            {
                "type": "input_value",
                "name": "VAL"
            },
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VAL = javascriptGenerator.valueToCode(block, 'VAL', javascriptGenerator.ORDER_ATOMIC);

        return [`Boolean(${VAL})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // convert time lengths
    registerBlock(`${categoryPrefix}time`, {
        message0: "%1 %2 to %3",
        args0: [
            {
                "type": "input_value",
                "name": "VAL",
                "check": "Number"
            },
            {
                "type": "field_dropdown",
                "name": "MENU1",
                "options": [
                    [ "milliseconds", "1" ],
                    [ "seconds", "1000" ],
                    [ "minutes", "60000" ],
                    [ "hours", "3600000" ],
                    [ "days", "86400000" ],
                ]
            },
            {
                "type": "field_dropdown",
                "name": "MENU2",
                "options": [
                    [ "milliseconds", "1" ],
                    [ "seconds", "1000" ],
                    [ "minutes", "60000" ],
                    [ "hours", "3600000" ],
                    [ "days", "86400000" ],
                ]
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VAL = javascriptGenerator.valueToCode(block, 'VAL', javascriptGenerator.ORDER_ATOMIC);
        const MENU1 = block.getFieldValue('MENU1');
        const MENU2 = block.getFieldValue('MENU2');

        return [`(${VAL} * ${MENU1} / ${MENU2})`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}case`, {
        message0: "%1 to %2",
        args0: [
            {
                "type": "input_value",
                "name": "VAL",
                "check": "String"
            },
            {
                "type": "field_dropdown",
                "name": "MENU",
                "options": [
                    [ "lowercase", "Lower" ],
                    [ "uppercase", "Upper" ]
                ]
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VAL = javascriptGenerator.valueToCode(block, 'VAL', javascriptGenerator.ORDER_ATOMIC);
        const MENU = block.getFieldValue('MENU');
        return [`String(${VAL}).to${MENU}Case()`, javascriptGenerator.ORDER_ATOMIC];
    })
    registerBlock(`${categoryPrefix}base`, {
        message0: "convert %1 to base %2",
        args0: [
            {
                "type": "input_value",
                "name": "VAL",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "BASE",
                "check": "Number"
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VAL = javascriptGenerator.valueToCode(block, 'VAL', javascriptGenerator.ORDER_ATOMIC);
        const BASE = javascriptGenerator.valueToCode(block, 'BASE', javascriptGenerator.ORDER_ATOMIC);
        return [`(${VAL}.toString(${BASE}))`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;
