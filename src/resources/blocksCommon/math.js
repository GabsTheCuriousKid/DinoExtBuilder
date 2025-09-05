import Blockly from 'blockly/core';
import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const textFieldColor = '#fff'

function register() {
    Blockly.Blocks['math_number'] = {
        /**
         * Block for generic numeric value.
         * @this Blockly.Block
         */
        init: function() {
            this.jsonInit({
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_number",
                        "name": "NUM",
                    }
                ],
                "output": "Number",
                "colour": textFieldColor
            });
        }
    };

    /**
     * Block for integer value (no decimal, + or -).
    */
    registerBlock('math_integer', {
        message0: "%1",
        args0: [
            {
                "type": "field_number",
                "name": "NUM",
                "precision": "1"
            }
        ],
        output: "Number",
        colour: textFieldColor
    }, (block) => {
        return [block.getFieldValue("NUM"), javascriptGenerator.ORDER_ATOMIC];
    })

    /**
     * Block for whole number value, no negatives or decimals.
     */
    registerBlock('math_whole_number', {
        message0: "%1",
        args0: [
            {
                "type": "field_number",
                "name": "NUM",
                "min": "0",
                "precision": "1"
            }
        ],
        output: "Number",
        colour: textFieldColor
    }, (block) => {
        return [block.getFieldValue("NUM"), javascriptGenerator.ORDER_ATOMIC];
    })

    /**
     * Block for positive number value, with decimal.
    */
    registerBlock('math_positive_number', {
        message0: "%1",
        args0: [
            {
                "type": "field_number",
                "name": "NUM",
                "min": "0"
            }
        ],
        output: "Number",
        colour: textFieldColor
    }, (block) => {
        return [block.getFieldValue("NUM"), javascriptGenerator.ORDER_ATOMIC];
    })

    /**
     * Block for angle picker.
    */
    registerBlock('math_angle', {
        message0: "%1",
        args0: [
            {
                "type": "field_angle",
                "name": "NUM",
            }
        ],
        output: "Number",
        colour: textFieldColor
    }, (block) => {
        return [block.getFieldValue("NUM"), javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;
