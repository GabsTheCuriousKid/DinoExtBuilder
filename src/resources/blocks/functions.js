import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'functions_';
const categoryColor = '#5531D6';

function register() {
    // function
    registerBlock(`${categoryPrefix}create`, {
        message0: 'function %1 %2 %3',
        args0: [
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
                "type": "input_statement",
                "name": "FUNC"
            }
        ],
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const FUNC = javascriptGenerator.statementToCode(block, 'FUNC');
        
        const code = `async function ${ID}() { ${FUNC} }`;
        return `${code}\n`;
    })

    // function
    registerBlock(`${categoryPrefix}createPara`, {
        message0: 'function %1 parameters %2 %3 %4',
        args0: [
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
            {
                "type": "field_input",
                "name": "PARAMETERS",
                "text": "1, 2",
                "spellcheck": false
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "FUNC"
            }
        ],
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const PARAMETERS = block.getFieldValue('PARAMETERS')
        const FUNC = javascriptGenerator.statementToCode(block, 'FUNC');
        
        const code = `async function ${ID}(${PARAMETERS}) { ${FUNC} }`;
        return `${code}\n`;
    })

    // inline function
    registerBlock(`${categoryPrefix}inline`, {
        message0: 'inline function %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "FUNC"
            }
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const FUNC = javascriptGenerator.statementToCode(block, 'FUNC');
        return [`await (async () => { ${FUNC} })()`, javascriptGenerator.ORDER_ATOMIC];
    })

    // return
    registerBlock(`${categoryPrefix}return`, {
        message0: 'return %1',
        args0: [
            {
                "type": "input_value",
                "name": "VALUE",
            }
        ],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `return ${VALUE || ''}`;
        return `${code}\n`;
    })

    // call
    registerBlock(`${categoryPrefix}call`, {
        message0: 'call %1',
        args0: [
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const code = `${ID}()`;
        return `${code}\n`;
    })

    // call
    registerBlock(`${categoryPrefix}callreporter`, {
        message0: 'call %1',
        args0: [
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        return [`${ID}()\n`, javascriptGenerator.ORDER_ATOMIC];
    })

    // call
    registerBlock(`${categoryPrefix}callPara`, {
        message0: 'call %1 with parameters %2',
        args0: [
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
            {
                "type": "input_value",
                "name": "PARAMETERS",
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const PARAMETERS = javascriptGenerator.valueToCode(block, 'PARAMETERS', javascriptGenerator.ORDER_ATOMIC);
        const code = `${ID}(${PARAMETERS ?? ''})`;
        return `${code}\n`;
    })

    // call
    registerBlock(`${categoryPrefix}callreporterPara`, {
        message0: 'call %1 with parameters %2',
        args0: [
            {
                "type": "field_input",
                "name": "ID",
                "text": "id",
                "spellcheck": false
            },
            {
                "type": "input_value",
                "name": "PARAMETERS",
            },
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const ID = block.getFieldValue('ID')
        const PARAMETERS = javascriptGenerator.valueToCode(block, 'PARAMETERS', javascriptGenerator.ORDER_ATOMIC);
        return [`${ID}(${PARAMETERS ?? ''})\n`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}getsprites`, {
        message0: 'get Sprites function',
        args0: [],
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const code = `function getSprites() {
            const spriteNames = [];
            const targets = Scratch.vm.runtime.targets;
            const myself = Scratch.vm.runtime.getEditingTarget().getName();
            for (let index = 1; index < targets.length; index++) {
              const target = targets[index];
              if (target.isOriginal) {
                const targetName = target.getName();
                if (targetName === myself) {
                  spriteNames.unshift({
                    text: "this sprite",
                    value: targetName,
                  });
                } else {
                  spriteNames.push({
                    text: targetName,
                    value: targetName,
                  });
                }
              }
            }
            if (spriteNames.length > 0) {
              return spriteNames;
            } else {
              return [{ text: "", value: 0 }];
            }
          }`;
        return `${code}\n`;
    })

    // define func
    registerBlock(`${categoryPrefix}define`, {
        message0: 'define %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        output: "Function",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        return [`(async (functionArg) => { ${BLOCKS} })`, javascriptGenerator.ORDER_NONE];
    })

    // execute
    registerBlock(`${categoryPrefix}execute_a`, {
        message0: 'execute %1 with %2',
        args0: [
            {
                "type": "input_value",
                "name": "FUNC",
                "check": "Function"
            },
            {
                "type": "input_value",
                "name": "ARG"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const FUNC = javascriptGenerator.valueToCode(block, 'FUNC', javascriptGenerator.ORDER_ATOMIC);
        const ARG = javascriptGenerator.valueToCode(block, 'ARG', javascriptGenerator.ORDER_ATOMIC);
        const code = `${FUNC || "()=>{}"}(${ARG});`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}execute_b`, {
        message0: 'execute %1 with %2',
        args0: [
            {
                "type": "input_value",
                "name": "FUNC",
                "check": "Function"
            },
            {
                "type": "input_value",
                "name": "ARG"
            }
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const FUNC = javascriptGenerator.valueToCode(block, 'FUNC', javascriptGenerator.ORDER_ATOMIC);
        const ARG = javascriptGenerator.valueToCode(block, 'ARG', javascriptGenerator.ORDER_ATOMIC);
        return [`(${FUNC || "()=>{}"}(${ARG}))`, javascriptGenerator.ORDER_NONE];
    })

    //arg
    registerBlock(`${categoryPrefix}arg`, {
        message0: 'function argument',
        args0: [],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`functionArg`, javascriptGenerator.ORDER_NONE];
    })
}
export default register;
