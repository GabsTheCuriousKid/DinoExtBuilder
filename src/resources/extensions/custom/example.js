class Extension { // Do NOT rename the class, otherwise it won't work
    getInfo() {
        return {
            "name": "Example", // The Name of the Extension
            "id": "ExampleID", // The Id of the Extension
            "colour": "#0FBD8C", // The Colour/Color of the blocks
            "blocks": [
                {
                    "opcode": "block", // The Id of the block
                    "text": "example block", // The Text of the block
                    "type": "block", // This determines the type of the block (e.x.: "Block" is the regular command block)
                    "returns": (block, javascriptGenerator) => { // This determines what the code returns
                        return `console.log("Hello World!")`;
                    }
                },
                {
                    "opcode": "reporter",
                    "text": "example reporter",
                    "type": "reporter", // "Reporter" is the rounded block you can put in inputs
                    "output": "number", // This determines which inputs you can put the reporter in (e.x.: "number" lets you put the reporter in number inputs, but "none" or null lets you put the reporter block in every input)
                    "returns": (block, javascriptGenerator) => {
                        return [`1234`, javascriptGenerator.ORDER_ATOMIC]; // Reporter and boolean blocks use a different method of returning the code
                    }
                },
                {
                    "opcode": "boolean", // "Boolean" is the condition block you can put in boolean inputs
                    "text": "example boolean",
                    "type": "boolean",
                    "returns": (block, javascriptGenerator) => {
                        return [`Boolean(Math.round(Math.random()))`, javascriptGenerator.ORDER_ATOMIC];
                    }
                },
                {
                    "type": "gap", // "Gap" is a gap
                    "gap": "48" // this determines how big the gap is
                },
                {
                    "opcode": "block2",
                    "text": "example inputs [arg1] [arg2]",
                    "type": "block",
                    "arguments": { // This defines the arguments
                        "arg1": {
                            "type": "input_value", // This determines the type of the input (input_value is the empty slot)
                            "check": "String" // This checks which type of reporter blocks are allowed to be put in the input. (e.x.: String allows string reporter blocks)
                        },
                        "arg2": {
                            "type": "field_input" // Field inputs don't have a check attribute.
                        },
                    },
                    "returns": (block, javascriptGenerator) => {
                        const arg1 = javascriptGenerator.valueToCode(block, "arg1", javascriptGenerator.ORDER_ATOMIC);
                        const arg2 = block.getFieldValue("arg2");
                        return `console.log(${arg1}, "${arg2}")`;
                    }
                },
                {
                    "type": "label", // "label" is a label
                    "text": "This is a label" // you can use this to determine what the label says
                },
                {
                    "opcode": "cap",
                    "text": "example cap",
                    "type": "block",
                    "isTerminal": true, // This determines whether the block is a cap block or not (true is yes, false is no)
                    "returns": (block, javascriptGenerator) => {
                        return `console.log("The End")`;
                    }
                }
            ]
        }
    }
}