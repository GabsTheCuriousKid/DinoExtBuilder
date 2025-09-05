import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';
// import { compileVars } from '../compiler/compileVarSection';

const categoryPrefix = 'looks_';
const categoryColor = '#9966FF';

function register() {
    // say
    registerBlock(`${categoryPrefix}say`, {
        message0: 'make %1 say %2',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
            {
                "type": "input_value",
                "check": "String",
                "name": "TEXT"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC) || "undefined";
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC);
        const code = `if (${SPRITE} !== undefined) Scratch.vm.runtime.emit('SAY', ${SPRITE}, 'say', ${TEXT});`;
        return `${code}\n`;
    })

    // think
    registerBlock(`${categoryPrefix}think`, {
        message0: 'make %1 think %2',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
            {
                "type": "input_value",
                "check": "String",
                "name": "TEXT"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC) || "undefined";
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT', javascriptGenerator.ORDER_ATOMIC);
        const code = `if (${SPRITE} !== undefined) Scratch.vm.runtime.emit('SAY', ${SPRITE}, 'think', ${TEXT});`;
        return `${code}\n`;
    })

    // set effect
    registerBlock(`${categoryPrefix}seteffect`, {
        message0: 'set %2 of %1 to %3',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
            {
                "type": "field_dropdown",
                "name": "EFFECTS",
                "options": [
                    [ "color", "COLOR" ],
                    [ "fisheye", "FISHEYE" ],
                    [ "whirl", "WHIRL" ],
                    [ "pixelate", "PIXELATE" ],
                    [ "mosaic", "MOSAIC" ],
                    [ "brightness", "BRIGHTNESS" ],
                    [ "ghost", "GHOST" ],
                ]
            },
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC) || "undefined";
        const EFFECTS = block.getFieldValue('EFFECTS');
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `if (${SPRITE} !== undefined) ${SPRITE}.setEffect(Scratch.Cast.toString('${EFFECTS}').toLowerCase(), Scratch.Cast.toNumber(${VALUE}));`;
        return `${code}\n`;
    })

    // change effect by
    registerBlock(`${categoryPrefix}changeeffectby`, {
        message0: 'change %2 of %1 by %3',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
            {
                "type": "field_dropdown",
                "name": "EFFECTS",
                "options": [
                    [ "color", "COLOR" ],
                    [ "fisheye", "FISHEYE" ],
                    [ "whirl", "WHIRL" ],
                    [ "pixelate", "PIXELATE" ],
                    [ "mosaic", "MOSAIC" ],
                    [ "brightness", "BRIGHTNESS" ],
                    [ "ghost", "GHOST" ],
                ]
            },
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC) || "undefined";
        const EFFECTS = block.getFieldValue('EFFECTS')
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `if (${SPRITE} !== undefined) {\nconst effect = Scratch.Cast.toString(${EFFECTS}).toLowerCase();\nconst change = Scratch.Cast.toNumber(${VALUE});\nif (!${SPRITE}.effects.hasOwnProperty(effect)) return;\nlet newValue = change + ${SPRITE}.effects[effect];\n${SPRITE}.setEffect(effect, newValue);\n}`;
        return `${code}\n`;
    })

    // clear effects
    registerBlock(`${categoryPrefix}cleareffects`, {
        message0: 'clear effects of %1',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC) || "undefined";
        const code = `if (${SPRITE} !== undefined) ${SPRITE}.clearEffects();`;
        return `${code}\n`;
    })

    // get effect
    registerBlock(`${categoryPrefix}geteffect`, {
        message0: 'get %1 of %2',
        args0: [
            {
                "type": "field_dropdown",
                "name": "EFFECTS",
                "options": [
                    [ "color", "color" ],
                    [ "fisheye", "fisheye" ],
                    [ "whirl", "whirl" ],
                    [ "pixelate", "pixelate" ],
                    [ "mosaic", "mosaic" ],
                    [ "brightness", "brightness" ],
                    [ "ghost", "ghost" ],
                ]
            },
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC) || "undefined";
        return [`(${SPRITE} !== undefined) ? ${SPRITE}.effects['${EFFECTS}'] : 0`, javascriptGenerator.ORDER_ATOMIC]
    })

    // set effect 2
    registerBlock(`${categoryPrefix}setpenguinmodeffect`, {
        message0: 'set %1 to %2',
        args0: [
            {
                "type": "field_dropdown",
                "name": "EFFECTS",
                "options": [
                    [ "saturation", "SATURATION" ],
                    [ "red", "RED" ],
                    [ "green", "GREEN" ],
                    [ "blue", "BLUE" ],
                    [ "opaque", "OPAQUE" ],
                ]
            },
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `const effect = Scratch.Cast.toString('${EFFECTS}').toLowerCase();\nlet value = Scratch.Cast.toNumber(${VALUE});\nutil.target.setEffect(effect, value);`;
        return `${code}\n`;
    })

    // get effect 2
    registerBlock(`${categoryPrefix}getpenguinmodeffect`, {
        message0: 'get %1',
        args0: [
            {
                "type": "field_dropdown",
                "name": "EFFECTS",
                "options": [
                    [ "saturation", "SATURATION" ],
                    [ "red", "RED" ],
                    [ "green", "GREEN" ],
                    [ "blue", "BLUE" ],
                    [ "opaque", "OPAQUE" ],
                ]
            },
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const EFFECTS = block.getFieldValue('EFFECTS')
        return [`(const effects = util.target.effects;\nconst name = Scratch.Cast.toString('${EFFECTS}');\nif (Object.prototype.hasOwnProperty.call(effects, name)) {\neffects[name]\n})`, javascriptGenerator.ORDER_ATOMIC]
    })

    registerBlock(`${categoryPrefix}gettintcolor`, {
        message0: 'get tint color',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`(const effects = util.target.effects;\nif (typeof effects.tintColor !== 'number') '#ffffff';\n Scratch.Color.decimalToHex(effects.tintColor - 1))`, javascriptGenerator.ORDER_ATOMIC];
    })

    // set layer
    registerBlock(`${categoryPrefix}setlayer`, {
        message0: 'bring %1 to layer %2',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC) || "undefined";
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `if (${SPRITE} !== undefined) {\nconst target = ${SPRITE};\nconst layerOrder = target.getLayerOrder();\nconst newLayer = ${VALUE} - layerOrder;\ntarget.renderer.setDrawableOrder(target.drawableID, newLayer, "sprite", true);\n}`;
        return `${code}\n`;
    })

    // set layer
    registerBlock(`${categoryPrefix}golayer`, {
        message0: 'bring %1 %2 %3 layers',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
            {
                "type": "field_dropdown",
                "name": "MENU",
                "options": [
                    [ "forward", "" ],
                    [ "backward", "* -1" ],
                ]
            },
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        nextStatement: null,
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC) || "undefined";
        const MENU = block.getFieldValue('MENU')
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `if (${SPRITE} !== undefined) {\nconst target = ${SPRITE};\nconst layerOrder = target.getLayerOrder();\nconst newLayer = ((${VALUE} ${MENU}) + layerOrder) - layerOrder;\ntarget.renderer.setDrawableOrder(target.drawableID, newLayer, "sprite", true);\n}`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}getlayer`, {
        message0: 'get layer',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`util.target.getLayerOrder()`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}getlayerof`, {
        message0: 'get layer of %1',
        args0: [
            {
                "type": "input_value",
                "name": "SPRITE",
                "check": "Sprite"
            },
        ],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC);
        return [`(${SPRITE || "undefined"} !== undefined ? ${SPRITE}.getLayerOrder() : 0)`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register