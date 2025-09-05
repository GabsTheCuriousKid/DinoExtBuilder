import { compileVars } from '../compiler/compileVarSection';
import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
import Blockly from 'blockly/core';

import { FieldErrorReporter } from '../core/field_error_reporter';

const categoryPrefix = 'control_';
const categoryColor = '#FFAB19';

function register() {
    // wait in milliseconds
    registerBlock(`${categoryPrefix}wait`, {
        message0: 'wait %1 (ms)',
        args0: [
            {
                "type": "input_value",
                "name": "MS",
                "check": "Number"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const MS = javascriptGenerator.valueToCode(block, 'MS', javascriptGenerator.ORDER_ATOMIC);
        const code = `await new Promise(resolve => setTimeout(resolve, ${MS}))`;
        return `${code}\n`;
    })

    // wait until
    registerBlock(`${categoryPrefix}waituntil`, {
        message0: 'wait until %1',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const code = `await new Promise(resolve => { let x = setInterval(() => { if (${CONDITION}) { clearInterval(x); resolve() } }, 50) })`;
        return `${code}\n`;
    })

    // repeat x amount of times
    registerBlock(`${categoryPrefix}repeat`, {
        message0: 'repeat %1 %2 %3 %4',
        implicitAlign0: "RIGHT",
        args0: [
            {
                "type": "input_value",
                "name": "TIMES",
                "check": "Number"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            },
            {
                "type": "field_image",
                "src": "/images/blockIcons/repeat.svg",
                "width": 24,
                "height": 24,
                "alt": "*"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TIMES = javascriptGenerator.valueToCode(block, 'TIMES', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const variable = compileVars.new()
        const code = `for (var ${variable} = 0; ${variable} < ${TIMES}; ${variable}++) { ${BLOCKS} }`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}forever`, {
        message0: 'forever %1 %2 %3',
        implicitAlign0: "RIGHT",
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            },
            {
                "type": "field_image",
                "src": "/images/blockIcons/repeat.svg",
                "width": 24,
                "height": 24,
                "alt": "*"
            }
        ],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `(async () => {\nwhile (true) {${BLOCKS}\nawait new Promise(r => setTimeout(r, 50));}\n})()`;
        return `${code}\n`;
    })

    // if <> then {}
    registerBlock(`${categoryPrefix}if`, {
        message0: 'if %1 then %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "BOOL0",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS0"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}if_mutator`
    }, (block) => {
        const BOOL0 = javascriptGenerator.valueToCode(block, 'BOOL0', javascriptGenerator.ORDER_ATOMIC) || "false";
        const BLOCKS0 = javascriptGenerator.statementToCode(block, 'BLOCKS0');

        let code = `if (${BOOL0}) { ${BLOCKS0} }`;

        for (let i = 1; block.getInput(`BOOL${i}`); i++) {
            const BOOLx = javascriptGenerator.valueToCode(block, `BOOL${i}`, javascriptGenerator.ORDER_ATOMIC) || "false";
            const BLOCKSx = javascriptGenerator.statementToCode(block, `BLOCKS${i}`);

            code += ` else if (${BOOLx}) { ${BLOCKSx} }`;
        }

        if (block.getInput('ELSE')) {
            const ELSE = javascriptGenerator.statementToCode(block, 'ELSE');
            code += ` else { ${ELSE} }`;
        }

        code += ";"
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}if_mutator_if`, {
        message0: 'if',
        args0: [],
        nextStatement: null,
        inputsInline: true,
        enableContextMenu: false,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}if_mutator_elseif`, {
        message0: 'else if',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}if_mutator_else`, {
        message0: 'else',
        args0: [],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})

    // if <> then () else ()
    registerBlock(`${categoryPrefix}ifthenreturn`, {
        message0: 'if %1 then %2 else %3',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_value",
                "name": "X",
            },
            {
                "type": "input_value",
                "name": "Y",
            },
        ],
        output: null,
        inputsInline: false,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const X = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_ATOMIC);
        const Y = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_ATOMIC);
        return [`(${CONDITION || false} ? ${X} : ${Y})`, javascriptGenerator.ORDER_ATOMIC];
    })

    // switch statement
    registerBlock(`${categoryPrefix}switch`, {
        message0: 'switch %1 %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS",
                "check": "Case"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `switch (${VALUE || "''"}) { ${BLOCKS} };`;
        return `${code}\n`;
    })

    // case
    registerBlock(`${categoryPrefix}case`, {
        message0: 'case %1 %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: "Case",
        nextStatement: "Case",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `case (${VALUE || "''"}): ${BLOCKS}`;
        return `${code}\n`;
    })

    // default
    registerBlock(`${categoryPrefix}default`, {
        message0: 'default %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: "Case",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `default: ${BLOCKS}`;
        return `${code}\n`;
    })

    // while statement
    registerBlock(`${categoryPrefix}while`, {
        message0: 'while %1 %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "CONDITION",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS",
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const CONDITION = javascriptGenerator.valueToCode(block, 'CONDITION', javascriptGenerator.ORDER_ATOMIC);
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `while (${CONDITION}) { ${BLOCKS} };`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}try_catch`, {
        message0: 'try %1 %2 catch %3 %4',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS2"
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const BLOCKS2 = javascriptGenerator.statementToCode(block, 'BLOCKS2');
        const code = `try { ${BLOCKS} }\ncatch (err) { ${BLOCKS2} }`;
        return `${code}\n`;
    })

    // break
    registerBlock(`${categoryPrefix}break`, {
        message0: 'break',
        args0: [],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `break;`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}throwerror`, {
        message0: 'throw %1 %2',
        args0: [
            {
                "type": "field_dropdown",
                "name": "error",
                "options": [
                    [ "error", "Error" ],
                    [ "type error", "TypeError" ],
                    [ "reference error", "ReferenceError" ],
                ]
            },
            {
                "type": "input_value",
                "name": "VALUE",
                "check": "String"
            },
        ],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const ERROR = block.getFieldValue('error');
        const code = `throw new ${ERROR}(${VALUE});`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}error`, {
        message0: 'error',
        args0: [],
        output: "String",
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`err`, javascriptGenerator.ORDER_ATOMIC];
    })

    // This needs init so i don't use registerBlock
    Blockly.Blocks[`${categoryPrefix}try_catch2`] = {
        init: function () {
            this.errorVarName_ = compileVars.new();

            this.appendDummyInput()
                .appendField('try');
            
            this.appendStatementInput("TRY_BLOCKS");

            this.appendDummyInput()
                .appendField('catch')

            this.appendValueInput('ERROR_ARG')
                .setCheck('errorOnly');

            this.appendStatementInput("CATCH_BLOCKS");

            this.setPreviousStatement(true);
            this.setNextStatement(true);
            this.setInputsInline(true);
            this.setColour(categoryColor);

            this.getVars = () => [this.errorVarName_];

            this.ensureErrorReporter = () => {
                const errorInput = this.getInput('ERROR_ARG');
                if (!errorInput.connection.targetBlock()) {
                    const reporter = this.workspace.newBlock(`${categoryPrefix}error_reporter`);
                    reporter.initSvg();
                    reporter.render();

                    errorInput.connection.connect(reporter.outputConnection);
                }
            }

            setTimeout(() => {
                this.ensureErrorReporter();
            }, 1);

            this._workspaceChangeEvent = async (event) => {
                if (event.type === Blockly.Events.BLOCK_MOVE || event.type === Blockly.Events.BLOCK_DELETE) {
                    while (this.workspace && this.rendered && !this.isDisposed_ && (!this.getInput('ERROR_ARG') || !this.getInput('ERROR_ARG').connection)) {
                        await new Promise(resolve => setTimeout(resolve, 10))
                    }
                    const errorInput = this.getInput('ERROR_ARG');
                    if (!errorInput.connection.targetBlock()) {
                        this.ensureErrorReporter();
                    }
                }
                if (event.type === Blockly.Events.BLOCK_MOVE && event.newParentId === this.id && event.inputName === 'ERROR_ARG') {
                    while (this.workspace && this.rendered && !this.isDisposed_ && (!this.getInput('ERROR_ARG') || !this.getInput('ERROR_ARG').connection)) {
                        await new Promise(resolve => setTimeout(resolve, 10))
                    }
                    const connectedBlock = this.getInput('ERROR_ARG').connection.targetBlock();
                    if (connectedBlock && connectedBlock.type !== `${categoryPrefix}error_reporter`) {
                        connectedBlock.unplug();
                    }
                }
            }

            this.workspace.addChangeListener(this._workspaceChangeEvent);
        },
        dispose: function (healStack) {
            if (this._workspaceChangeEvent) {
                this.workspace.removeChangeListener(this._workspaceChangeEvent);
                this._workspaceChangeEvent = null;
            }
            const errorInput = this.getInput('ERROR_ARG');
            if (errorInput && errorInput.connection.targetBlock()) {
                errorInput.connection.targetBlock().dispose(healStack);
                Blockly.BlockSvg.prototype.dispose.call(this, errorInput);
                if (errorInput.connection?.shadowDom) {
                    const shadowBlock = errorInput.connection.targetBlock();
                    if (shadowBlock) {
                        shadowBlock.dispose(healStack);
                    }
                }
            }
            try {
                Blockly.BlockSvg.prototype.dispose.call(this, errorInput);
                this.removeInput('ERROR_ARG', true);
                this.workspace.resize();
                this.workspace.render();
            } catch {
                // do nothing
            }
            Blockly.BlockSvg.prototype.dispose.call(this, healStack);
            this.workspace.resize();
            this.workspace.render();
        }
    }
    javascriptGenerator.forBlock[`${categoryPrefix}try_catch2`] = function (block) {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'TRY_BLOCKS');
        const BLOCKS2 = javascriptGenerator.statementToCode(block, 'CATCH_BLOCKS');
        const errorVar = block.getVars()[0];

        const code = `try {\n${BLOCKS}} catch (${errorVar}) {\n${BLOCKS2}}\n`;
        return code;
    }

    registerBlock(`${categoryPrefix}error_reporter`, {
        message0: 'error',
        args0: [],
        output: ["String", "errorOnly"],
        colour: categoryColor,
    }, (block) => {
        let parent = block.getSurroundParent();
        while (parent && parent.type !== `${categoryPrefix}try_catch2`) {
            parent = parent.getSurroundParent();
        }

        const errorVar = (parent && parent.getVars()[0]) || "err";

        return [errorVar, javascriptGenerator.ORDER_ATOMIC];
    });

    const control_if_mutator = {
        elseifCount_: 0,
        elseCount_: 0,

        mutationToDom: function () {
            if (!this.elseifCount_ && !this.elseCount_) {
                return null;
            }

            const container = Blockly.utils.xml.createElement('mutation');
            if (this.elseifCount_) {
              container.setAttribute('elseif', String(this.elseifCount_));
            }
            if (this.elseCount_) {
              container.setAttribute('else', '1');
            }
            return container;
        },

        domToMutation: function (xmlElement) {
            this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'));
            this.elseCount_ = parseInt(xmlElement.getAttribute('else'));
            this.rebuildShape_()
        },

        decompose: function (workspace) {
            const containerBlock = workspace.newBlock(`${categoryPrefix}if_mutator_if`);
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;

            for (let i = 1; i <= this.elseifCount_; i++) {
                const elseifBlock = workspace.newBlock(`${categoryPrefix}if_mutator_elseif`);
                elseifBlock.initSvg()
                connection.connect(elseifBlock.previousConnection);
                connection = elseifBlock.nextConnection;
            }

            if (this.elseCount_) {
                const elseBlock = workspace.newBlock(`${categoryPrefix}if_mutator_else`);
                elseBlock.initSvg()
                connection.connect(elseBlock.previousConnection);
            }

            return containerBlock
        },

        compose: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();

            this.elseifCount_ = 0;
            this.elseCount_ = 0;

            const valueConnections = [null]
            const statementConnections = [null]
            let elseStatementConnection = null

            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock()
                    continue;
                }

                switch (clauseBlock.type) {
                    case `${categoryPrefix}if_mutator_elseif`:
                        this.elseifCount_++;
                        valueConnections.push(clauseBlock.valueConnection_);
                        statementConnections.push(clauseBlock.statementConnection_);
                        break;
                    case `${categoryPrefix}if_mutator_else`:
                        this.elseCount_++;
                        elseStatementConnection = clauseBlock.statementConnection_;
                        break;
                }

                clauseBlock = clauseBlock.getNextBlock();
            }

            this.updateShape_()

            this.reconnectChildBlocks_(valueConnections, statementConnections, elseStatementConnection)
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
                    case `${categoryPrefix}if_mutator_elseif`:
                        const inputBool = this.getInput(`BOOL${i}`);
                        const inputStatement = this.getInput(`BLOCKS${i}`);
                        clauseBlock.valueConnection_ = inputBool && inputBool.connection.targetConnection;
                        clauseBlock.statementConnection_ = inputStatement && inputStatement.connection.targetConnection;
                        i++;
                        break;
                    case `${categoryPrefix}if_mutator_else`:
                        const elseStatement = this.getInput('ELSE');
                        clauseBlock.statementConnection_ = elseStatement && elseStatement.connection.targetConnection;
                        break;
                }

                clauseBlock = clauseBlock.getNextBlock();
            }
        },

        rebuildShape_: function () {
            const valueConnections = [null]
            const statementConnections = [null]
            let elseStatementConnection = null

            if (this.getInput('ELSE')) {
                elseStatementConnection = this.getInput('ELSE').connection.targetConnection;
            }

            for (let i = 1; this.getInput(`BOOL${i}`); i++) {
                valueConnections.push(this.getInput(`BOOL${i}`).connection.targetConnection);
                statementConnections.push(this.getInput(`BLOCKS${i}`).connection.targetConnection);
            }

            this.updateShape_()
            this.reconnectChildBlocks_(
                valueConnections,
                statementConnections,
                elseStatementConnection,
            );
        },

        updateShape_: function () {
            //remove all
            if (this.getInput('ELSE')) {
                this.removeInput('ELSE')
                this.removeInput('DUMMYELSE')
            }
            for (let i = 1; this.getInput(`BOOL${i}`); i++) {
                this.removeInput(`BOOL${i}`)
                this.removeInput(`BLOCKS${i}`)
                this.removeInput(`DUMMY${i}`)
            }

            //rebuild
            for (let i = 1; i <= this.elseifCount_; i++) {
                this.appendValueInput(`BOOL${i}`)
                    .setCheck('Boolean')
                    .appendField("else if")
                this.appendDummyInput(`DUMMY${i}`)
                    .appendField("then")
                this.appendStatementInput(`BLOCKS${i}`)
            }
            if (this.elseCount_) {
                this.appendDummyInput('DUMMYELSE')
                    .appendField("else")
                this.appendStatementInput('ELSE')
            }
        },
        reconnectChildBlocks_: function (
            valueConnections,
            statementConnections,
            elseStatementConnection,
        ) {
            for (let i = 1; i <= this.elseifCount_; i++) {
                Blockly.Mutator.reconnect(valueConnections[i], this, `BOOL${i}`)
                Blockly.Mutator.reconnect(statementConnections[i], this, `BLOCKS${i}`)
            }
            if (elseStatementConnection) {
                Blockly.Mutator.reconnect(elseStatementConnection, this, `ELSE`)
            }
        }
    }

    Blockly.Extensions.unregister(`${categoryPrefix}if_mutator`)
    Blockly.Extensions.registerMutator(
        `${categoryPrefix}if_mutator`,
        control_if_mutator,
        null,
        [`${categoryPrefix}if_mutator_elseif`, `${categoryPrefix}if_mutator_else`],
    );
}

export default register;
