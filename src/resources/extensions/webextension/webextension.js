import javascriptGenerator from '../../javascriptGenerator';
import registerBlock from '../../register';

const categoryPrefix = 'webextension_';
const categoryColor = '#8361FF';

function register() {
    registerBlock(`${categoryPrefix}current`, {
        message0: 'current %1',
        args0: [
            {
                type: "field_dropdown",
                name: "TYPE",
                options: [
                    [ "URL", "href" ],
                    [ "Domain", "hostname" ],
                    [ "Path", "pathname" ],
                    [ "Protocol", "protocol" ],
                ]
            },
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TYPE = block.getFieldValue('TYPE');
        const code = `window.location.${TYPE}`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}openorredirect`, {
        message0: '%1 %2',
        args0: [
            {
                type: "field_dropdown",
                name: "TYPE",
                options: [
                    [ "Open URL in new Tab", "open" ],
                    [ "Redirect to URL", "redirect" ],
                ]
            },
            {
                "type": "input_value",
                "name": "Url",
                "check": "String"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TYPE = block.getFieldValue('TYPE');
        const URL = javascriptGenerator.valueToCode(block, 'Url', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.${TYPE}(${URL})`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}fullscreenOn`, {
        message0: 'enable fullscreen',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `document.documentElement.requestFullscreen()`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}fullscreenOff`, {
        message0: 'disable fullscreen',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `document.exitFullscreen()`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}Isfullscreen`, {
        message0: 'is fullscreen?',
        args0: [],
        output: "Boolean",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const code = `document.fullscreenElement !== null ? true : false`;
        return `${code}\n`;
    })
}

export default register;