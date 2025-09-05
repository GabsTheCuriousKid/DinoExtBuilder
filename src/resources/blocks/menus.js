import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
import { compileVars } from '../compiler/compileVarSection';
import Blockly from 'blockly/core';

const categoryPrefix = 'menus_';
const categoryColor = '#CB48E8';

function register() {
    // make item
    registerBlock(`${categoryPrefix}itemtextvalue`, {
        message0: 'item: text %1 value %2',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "spellcheck": false
            },
            {
                "type": "field_input",
                "name": "VALUE",
                "spellcheck": false
            },
        ],
        output: "JSONArray",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = block.getFieldValue('TEXT');
        const VALUE = block.getFieldValue('VALUE');
        return [`{ text: "${TEXT}", value: "${VALUE}" }`, javascriptGenerator.ORDER_ATOMIC];
    })

    // make item
    registerBlock(`${categoryPrefix}itemtextnvalue`, {
        message0: 'item: text & value %1',
        args0: [
            {
                "type": "field_input",
                "name": "VALUE",
                "spellcheck": false
            },
        ],
        output: "JSONArray",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = block.getFieldValue('TEXT');
        const VALUE = block.getFieldValue('VALUE');
        return [`"${VALUE}"`, javascriptGenerator.ORDER_ATOMIC];
    })

    // make item
    registerBlock(`${categoryPrefix}joinarrays`, {
        message0: 'join %1 %2',
        args0: [
            {
                "type": "input_value",
                "name": "ITEM-1",
                "check": "JSONArray"
            },
            {
                "type": "input_value",
                "name": "ITEM0",
                "check": "JSONArray"
            }
        ],
        output: "JSONArray",
        inputsInline: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}joinarrays_mutator`
    }, (block) => {
        const X = javascriptGenerator.valueToCode(block, 'ITEM-1', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'ITEM0', javascriptGenerator.ORDER_ATOMIC);
    
        let code = `${String(X) || ''}, ${String(Y) || ''}`
        
        for (let i = 1; block.getInput(`ITEM${i}`); i++) {
            const ITEM = javascriptGenerator.valueToCode(block, `ITEM${i}`, javascriptGenerator.ORDER_ATOMIC) || "undefined";

            code += `, ${String(ITEM) || ''}`;
        }
    
        return [code, javascriptGenerator.ORDER_ATOMIC];
    })
    registerBlock(`${categoryPrefix}joinarrays_mutator_join`, {
        message0: 'join',
        args0: [],
        nextStatement: null,
        inputsInline: true,
        enableContextMenu: false,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}joinarrays_mutator_item`, {
        message0: 'item',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})

    // create ze menu
    registerBlock(`${categoryPrefix}create`, {
        message0: 'create menu %1 id: %2 %3 values: %4 allow inputs: %5',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_value",
                "name": "VALUES",
                "check": "JSONArray"
            },
            {
                "type": "field_dropdown",
                "name": "REPORTERS",
                "options": [
                    ["true", "true"],
                    ["false", "false"]
                ]
            }
        ],
        inputsInline: false,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const VALUES = javascriptGenerator.valueToCode(block, 'VALUES', javascriptGenerator.ORDER_ATOMIC)
        const REPORTERS = block.getFieldValue('REPORTERS')
        
        const code = `menus["${ID}"] = {
            acceptReporters: ${REPORTERS},
            items: [${VALUES}]
        }`
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}created`, {
        message0: 'create dynamic menu %1 id: %2 %3 function: %4 allow inputs: %5',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_value",
                "name": "VALUES",
                "check": "Function"
            },
            {
                "type": "field_dropdown",
                "name": "REPORTERS",
                "options": [
                    ["true", "true"],
                    ["false", "false"]
                ]
            }
        ],
        inputsInline: false,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const VALUES = javascriptGenerator.valueToCode(block, 'VALUES', javascriptGenerator.ORDER_ATOMIC)
        const REPORTERS = block.getFieldValue('REPORTERS')
        const def = compileVars.new()
        
        const code = `menus["${ID}"] = {
            acceptReporters: ${REPORTERS},
            items: "${def}"
        }
        
        Extension.prototype["${def}"] = ${VALUES}`
        return `${code}\n`;
    })

    const menus_joinarrays_mutator = {
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
            const containerBlock = workspace.newBlock(`${categoryPrefix}joinarrays_mutator_join`);
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;
    
            for (let i = 1; i <= this.itemCount_; i++) {
                const itemBlock = workspace.newBlock(`${categoryPrefix}joinarrays_mutator_item`);
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
                    case `${categoryPrefix}joinarrays_mutator_item`:
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
                    case `${categoryPrefix}joinarrays_mutator_item`:
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
                this.appendValueInput(`ITEM${i}`).setCheck("JSONArray");
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
    
    Blockly.Extensions.unregister(`${categoryPrefix}joinarrays_mutator`)
    Blockly.Extensions.registerMutator(
        `${categoryPrefix}joinarrays_mutator`,
        menus_joinarrays_mutator,
        null,
        [`${categoryPrefix}joinarrays_mutator_item`],
    );
}

export default register