import javascriptGenerator from '../javascriptGenerator';
import registerBlock from '../register';

const categoryPrefix = 'sound_';
const categoryColor = '#CF63CF';

function register() {
    // start playing a sound (and also it needs to load lol!!)
    registerBlock(`${categoryPrefix}startsound`, {
        message0: 'start sound %1',
        args0: [
            {
                "type": "field_input",
                "name": "SOUND",
                "text": "https://t.ly/2gHlM",
                "spellcheck": false
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const SOUND = block.getFieldValue('SOUND')
        const code = `doSound(\`${SOUND}\`, Scratch.vm.runtime.targets.find(target => target.isStage), Scratch.vm.runtime);`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}playsound`, {
        message0: 'play sound %1 until done',
        args0: [
            {
                "type": "field_input",
                "name": "SOUND",
                "text": "https://t.ly/2gHlM",
                "spellcheck": false
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const SOUND = block.getFieldValue('SOUND')
        const code = `return doSound(\`${SOUND}\`, Scratch.vm.runtime.targets.find(target => target.isStage), Scratch.vm.runtime);`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}stopallsounds`, {
        message0: 'stop all sounds',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {
        const code = `async function _stopAllSoundsForTarget(target) {\n if (target.sprite.soundBank) {\ntarget.sprite.soundBank.stopAllSounds(target);\n}\n}\n if (Scratch.vm.runtime.targets === null) return;\nconst allTargets = Scratch.vm.runtime.targets;\nfor (let i = 0; i < allTargets.length; i++) {\n_stopAllSoundsForTarget(allTargets[i]);\n}`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}getvolume`, {
        message0: 'get volume',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Math.round(util.target.volume)`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}getvolumeof`, {
        message0: 'get volume of %1',
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
        return [`(${SPRITE || "undefined"} !== undefined ? ${SPRITE}.volume : 0)`, javascriptGenerator.ORDER_ATOMIC];
    })
    registerBlock(`${categoryPrefix}setprojectvolume`, {
        message0: 'set project volume to %1 ',
        args0: [
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `Scratch.vm.runtime.audioEngine.inputNode.gain.value = ${VALUE} / 100;`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}changeprojectvolume`, {
        message0: 'change project volume by %1',
        args0: [
            {
                "type": "input_value",
                "check": "Number",
                "name": "VALUE"
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        const code = `let volume = Scratch.vm.runtime.audioEngine.inputNode.gain.value;\nScratch.vm.runtime.audioEngine.inputNode.gain.value = ${VALUE} / 100 + volume;`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}getprojectvolume`, {
        message0: 'get project volume',
        args0: [],
        output: "Number",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        return [`Scratch.vm.runtime.audioEngine.inputNode.gain.value * 100`, javascriptGenerator.ORDER_ATOMIC];
    })

    registerBlock(`${categoryPrefix}setvolume`, {
        message0: 'set volume of %1 to %2',
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
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const SPRITE = javascriptGenerator.valueToCode(block, 'SPRITE', javascriptGenerator.ORDER_ATOMIC);
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE', javascriptGenerator.ORDER_ATOMIC);
        return [`if (${SPRITE} !== undefined) {\n${SPRITE}.volume = Math.min(Math.max(${VALUE}, 100), 0);\nScratch.vm.runtime.requestRedraw();\n}`, javascriptGenerator.ORDER_ATOMIC];
    })
}

export default register;
