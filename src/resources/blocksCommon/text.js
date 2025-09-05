import Blockly from 'blockly/core';

const textFieldColor = '#fff'

function register() {
    Blockly.Blocks['text'] = {
        /**
         * Block for text value.
         * @this Blockly.Block
         */
        init: function() {
            this.jsonInit({
                "message0": "%1",
                "args0": [
                    {
                        "type": "field_input",
                        "name": "TEXT"
                    }
                ],
                "output": "String",
                "colour": textFieldColor
            });
        }
    };
}

export default register;
