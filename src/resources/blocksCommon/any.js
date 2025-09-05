import Blockly from 'blockly/core';

const textFieldColor = '#fff'

function register() {
    Blockly.Blocks['any'] = {
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
                        "name": "ANY"
                    }
                ],
                "output": null,
                "colour": textFieldColor
            });
        }
    };
}

export default register;
