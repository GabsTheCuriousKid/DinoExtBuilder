import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
import Blockly from 'blockly/core';

const categoryPrefix = 'operators_';
const categoryColor = '#59C059';

function register() {
    // x = y
    registerBlock(`${categoryPrefix}equals`, {
        message0: '%1 = %2',
        args0: [
            {
                "type": "input_value",
                "name": "X"
            },
            {
                "type": "input_value",
                "name": "Y"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} == ${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x === y
    registerBlock(`${categoryPrefix}strictequals`, {
        message0: '%1 === %2',
        args0: [
            {
                "type": "input_value",
                "name": "X"
            },
            {
                "type": "input_value",
                "name": "Y"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} === ${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x = y
    registerBlock(`${categoryPrefix}notequals`, {
        message0: '%1 ≠ %2',
        args0: [
            {
                "type": "input_value",
                "name": "X"
            },
            {
                "type": "input_value",
                "name": "Y"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} !== ${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}notstrictequals`, {
        message0: '%1 ≠≠≠ %2',
        args0: [
            {
                "type": "input_value",
                "name": "X"
            },
            {
                "type": "input_value",
                "name": "Y"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`!(${X || 0} === ${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x > y
    registerBlock(`${categoryPrefix}more`, {
        message0: '%1 > %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} > ${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x < y
    registerBlock(`${categoryPrefix}less`, {
        message0: '%1 < %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} < ${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x and y
    registerBlock(`${categoryPrefix}and`, {
        message0: '%1 and %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Boolean"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Boolean"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || false} && ${Y || false})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x or y
    registerBlock(`${categoryPrefix}or`, {
        message0: '%1 or %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Boolean"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Boolean"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || false} || ${Y || false})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x xor y
    registerBlock(`${categoryPrefix}xor`, {
        message0: '%1 xor %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Boolean"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Boolean"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`Boolean(${X || false} ^ ${Y || false})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // not x
    registerBlock(`${categoryPrefix}not`, {
        message0: 'not %1',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Boolean"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);

        return [`!${X || false}`, javascriptGenerator.ORDER_ATOMIC];
    })

    // join x y
    registerBlock(`${categoryPrefix}join`, {
        message0: 'join %1 %2',
        args0: [
            {
                "type": "input_value",
                "name": "ITEM-1",
                "checks": "String"
            },
            {
                "type": "input_value",
                "name": "ITEM0",
                "checks": "String"
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}join_mutator`
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'ITEM-1', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'ITEM0', javascriptGenerator.ORDER_ATOMIC);

        let code = `${String(X) || ''} + ${String(Y) || ''}`
        
        for (let i = 1; block.getInput(`ITEM${i}`); i++) {
            const ITEM = javascriptGenerator.valueToCode(block, `ITEM${i}`, javascriptGenerator.ORDER_ATOMIC) || "undefined";

            code += ` + ${String(ITEM) || ''}`;
        }

        return [code, javascriptGenerator.ORDER_ATOMIC];
    })
    registerBlock(`${categoryPrefix}join_mutator_join`, {
        message0: 'join',
        args0: [],
        nextStatement: null,
        inputsInline: true,
        enableContextMenu: false,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}join_mutator_item`, {
        message0: 'item',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})

    // split
    registerBlock(`${categoryPrefix}split`, {
        message0: 'split %1 with %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "checks": "String"
            },
            {
                "type": "input_value",
                "name": "Y",
                "checks": "String"
            }
        ],
        output: "JSONArray",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X} || "").split(${Y} || "")`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x + y
    registerBlock(`${categoryPrefix}add`, {
        message0: '%1 + %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} + ${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x - y
    registerBlock(`${categoryPrefix}minus`, {
        message0: '%1 - %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} - ${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x * y
    registerBlock(`${categoryPrefix}multiply`, {
        message0: '%1 * %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} * ${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x / y
    registerBlock(`${categoryPrefix}divide`, {
        message0: '%1 ÷ %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} / ${Y || 1})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x module y
    registerBlock(`${categoryPrefix}mod`, {
        message0: '%1 modulo %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} % ${Y || 1})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // x ^ y
    registerBlock(`${categoryPrefix}power`, {
        message0: '%1 ^ %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} ** ${Y || 1})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // logx y
    registerBlock(`${categoryPrefix}log`, {
        message0: '%1 log %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(Math.log(${Y || 1}) / Math.log(${X || 10}))`, javascriptGenerator.ORDER_ATOMIC];
    })

    // rootx y
    registerBlock(`${categoryPrefix}root`, {
        message0: '%1 root %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${X || 0} ** (1 / ${Y || 1}))`, javascriptGenerator.ORDER_ATOMIC];
    })

    // stuff idk
    registerBlock(`${categoryPrefix}adv`, {
        message0: '%1 %2',
        args0: [
            {
                "type": "field_dropdown",
                "name": "X",
                "options": [
                    [ "sin", "sin" ],
                    [ "cos", "cos" ],
                    [ "tan", "tan" ],
                    [ "asin", "asin" ],
                    [ "acos", "acos" ],
                    [ "atan", "atan" ],
                    [ "ceiling", "ceil" ],
                    [ "round", "round" ],
                    [ "floor", "floor" ],
                    [ "absolute", "abs" ],
                    [ "sign", "sign" ],
                ]
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = block.getFieldValue('X')
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`Math.${X}(${Y || 0})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // get a letter of a string
    registerBlock(`${categoryPrefix}letter`, {
        message0: 'letter %1 of %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "String"
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`(${Y}.split("")[${X}-1])`, javascriptGenerator.ORDER_ATOMIC];
    })

    // random int
    registerBlock(`${categoryPrefix}randomint`, {
        message0: 'random int from %1 to %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`Math.floor(Math.random()*(${Y} - ${X} + 1) + ${X})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // random
    registerBlock(`${categoryPrefix}random`, {
        message0: 'random from %1 to %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            }
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);

        return [`((Math.random()+${X})*${Y-X})`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}clamp`, {
        message0: 'clamp %1 min: %2 max: %3',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "X",
                "check": "Number"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "Number"
            },
        ],
        output: "Number",
        inputsInline: false,
        colour: categoryColor
    }, (block) => {
        const Value = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);
        return [`Math.min(Math.max(${Value}, ${Y}), ${X})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // length of
    registerBlock(`${categoryPrefix}length_of`, {
        message0: 'length of %1',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "String"
            },
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        return [`String(${X}).length`, javascriptGenerator.ORDER_ATOMIC];
    })

    // includes
    registerBlock(`${categoryPrefix}includes`, {
        message0: '%1 includes %2',
        args0: [
            {
                "type": "input_value",
                "name": "X",
                "check": "String"
            },
            {
                "type": "input_value",
                "name": "Y",
                "check": "String"
            }
        ],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);
        return [`(${X}.includes(${Y}))`, javascriptGenerator.ORDER_ATOMIC];
    })

    const operators_join_mutator = {
        itemCount_: 0,

        mutationToDom: function () {
            if (!this.itemCount_ && !this.itemCount_) {
                return null;
            }

            const container = Blockly.utils.xml.createElement('mutation');
            if (this.itemCount_) {
              container.setAttribute('item', String(this.itemCount_));
            }
            return container;
        },

        domToMutation: function (xmlElement) {
            this.itemCount_ = parseInt(xmlElement.getAttribute('item'));
            this.rebuildShape_()
        },

        decompose: function (workspace) {
            const containerBlock = workspace.newBlock(`${categoryPrefix}join_mutator_join`);
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;

            for (let i = 1; i <= this.itemCount_; i++) {
                const itemBlock = workspace.newBlock(`${categoryPrefix}join_mutator_item`);
                itemBlock.initSvg()
                connection.connect(itemBlock.previousConnection);
                connection = itemBlock.nextConnection;
            }

            return containerBlock
        },

        compose: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();

            this.itemCount_ = 0;

            const valueConnections = [null]

            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock()
                    continue;
                }

                switch (clauseBlock.type) {
                    case `${categoryPrefix}join_mutator_item`:
                        this.itemCount_++;
                        valueConnections.push(clauseBlock.valueConnection_);
                        break;
                }

                clauseBlock = clauseBlock.getNextBlock();
            }

            this.updateShape_()

            this.reconnectChildBlocks_(valueConnections)
        },

        saveConnections: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();
            let i = 1;
            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock()
                    continue;
                }

                switch (clauseBlock.type) {
                    case `${categoryPrefix}join_mutator_item`:
                        const inputBool = this.getInput(`ITEM${i}`);
                        clauseBlock.valueConnection_ = inputBool && inputBool.connection.targetConnection;
                        i++;
                        break;
                }

                clauseBlock = clauseBlock.getNextBlock();
            }
        },

        rebuildShape_: function () {
            const valueConnections = [null]

            for (let i = 1; this.getInput(`ITEM${i}`); i++) {
                valueConnections.push(this.getInput(`ITEM${i}`).connection.targetConnection);
            }

            this.updateShape_()
            this.reconnectChildBlocks_(
                valueConnections,
            );
        },

        updateShape_: function () {
            //remove all
            for (let i = 1; this.getInput(`ITEM${i}`); i++) {
                this.removeInput(`ITEM${i}`)
            }

            //rebuild
            for (let i = 1; i <= this.itemCount_; i++) {
                this.appendValueInput(`ITEM${i}`)
            }
        },
        reconnectChildBlocks_: function (
            valueConnections,
        ) {
            for (let i = 1; i <= this.itemCount_; i++) {
                Blockly.Mutator.reconnect(valueConnections[i], this, `ITEM${i}`)
            }
        }
    }

    Blockly.Extensions.unregister(`${categoryPrefix}join_mutator`)
    Blockly.Extensions.registerMutator(
        `${categoryPrefix}join_mutator`,
        operators_join_mutator,
        null,
        [`${categoryPrefix}join_mutator_item`],
    );
}

export default register;
