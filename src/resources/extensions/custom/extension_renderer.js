import javascriptGenerator from '../../javascriptGenerator';
import registerBlock from '../../register';

let blocksVar = [];

function createExtensionInstance(extensionClass) {
    if (typeof extensionClass === "object" && extensionClass !== null) {
        return extensionClass;
    }
    if (typeof extensionClass === "function") {
        try {
            return new extensionClass();
        } catch (e) {
            console.error("Failed to instantiate extension class:", e);
            return null;
        }
    }
    if (typeof extensionClass !== "string") {
        throw new Error("Must be a string, class constructor, or instance");
    }
    try {
        if (extensionClass.trim().startsWith("(function")) {
            const wrapped = `
                let Extension;
                ${extensionClass.replace(/class\s+Extension\b/, 'Extension = class Extension')};
                return Extension;
            `;
            const ExtractedClass = new Function("dinoBuilder", wrapped)(window.dinoBuilder);
            return new ExtractedClass();
        } else if (extensionClass.includes("class") && extensionClass.includes("getInfo")) {
            const ExtensionClass = new Function(`${extensionClass}; return Extension;`)();
            return new ExtensionClass();
        } else {
            console.warn("Unrecognized extension format.");
            return null;
        }
    } catch (e) {
        console.error("Extension failed to load:", e);
        return null;
    }
}

function checkForErrors(extensionClass) {
    const extension = createExtensionInstance(extensionClass);

    const name = extension.getInfo()["name"];
    const blocks = extension.getInfo()["blocks"];
    const colour = extension.getInfo()["colour"];

    if (!name) {
        console.warn("This Extension doesn't have a name. While it's not required, it's still recommended to add them")
    }

    function isABoolean(value) {
        return (typeof value === "boolean")
    }
    function isValidXML(xml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");
        return !doc.querySelector("parsererror");
    }

    for (const block of blocks) {
        switch (block["type"]) {
            case 'xml':
                const xml = block["xml"]
                if (typeof xml !== 'string' || xml.trim() === '') {
                    console.error("XML block must have a non-empty 'xml' attribute.")
                } else if (!isValidXML(xml)) {
                    console.error("Parse Error: Invalid XML in 'xml' block.")
                }
                if (block["opcode"]) {
                    console.warn("Opcodes are not needed in xml, labels and gaps")
                }
                break;
            case 'gap':
                if (block["opcode"]) {
                    console.warn("Opcodes are not needed in xml, labels and gaps")
                }
                if (!("gap" in block)) {
                    console.warn("Gaps should have a 'gap' attribute")
                }
                break;
            case 'label':
                if (block["opcode"]) {
                    console.warn("Opcodes are not needed in xml, labels and gaps")
                }
                if (!("text" in block)) {
                    console.warn("Labels should have a 'text' attribute")
                }
                break;
            case 'boolean':
            case 'reporter':
            case 'block':
                if (!block["opcode"]) {
                    console.error("Opcodes are required in Blocks, Reporters and Booleans")
                }
                if (!block["returns"]) {
                    console.warn("Blocks, Reporters and Booleans should return something.")
                }
                if (block["type"] == 'block') {
                    if (block["isTerminal"]) {
                        if (!isABoolean(block["isTerminal"])) {
                            console.error("isTerminal attribute must be a Boolean")
                        }
                    }
                }
                break;
            case undefined:
            case null:
                console.error("Block Type is required.")
                break;
            default:
                console.error("Unknown Block Type")
                break;
        }
    }
}

function defineXmlOfExtension(extensionClass) {
    const extension = createExtensionInstance(extensionClass);

    const id = extension.getInfo()["id"];
    const name = extension.getInfo()["name"];
    const blocks = extension.getInfo()["blocks"];
    const colour = extension.getInfo()["colour"];
    const headerCode = `<xml>`;
    const footerCode = `</xml>`;
    const registryCode = {
        "categoryTop": `<category name="${name}" id="${id}" colour="${colour}" data-extension="true">`,
        "categoryBottom": `</category>`
    }
    let xmlblocks = ``
    for (const block of blocks) {
        const blockid = block["opcode"];
        const type = block["type"];
        if (blockid) {
            const editedid = id + '_' + blockid;
            xmlblocks += `<block type="${editedid}" data-extension="true" />`
        }
        if (type == 'xml') {
            const xml = block["xml"];
            xmlblocks += `${xml}`
        }
        if (type == 'gap') {
            const gap = block["gap"];
            xmlblocks += `<sep gap="${gap}" />`
        }
        if (type == 'label') {
            const text = block["text"];
            xmlblocks += `<label text="${text}" />`
        }
    }
    return (headerCode + registryCode["categoryTop"] + xmlblocks + registryCode["categoryBottom"] + footerCode)
}

function registerCustomExtension(extensionClass) {
    const extension = createExtensionInstance(extensionClass);

    const name = extension.getInfo()["name"];
    const id = extension.getInfo()["id"];
    const blocks = extension.getInfo()["blocks"];
    const colour = extension.getInfo()["colour"];
    for (const block of blocks) {
        const blockid = block["opcode"];
        const text = block["text"];
        const type = block["type"];
        const jsonData = {};
        function defineOutput(output) {
            switch (output) {
                default:
                case 'none':
                    return null;
                case 'text':
                case 'string':
                    return 'String'
                case 'number':
                    return 'Number'
                case 'boolean':
                    return 'Boolean'
            }
        }

        if (type == "label" || type == "gap" || type == "xml") {
            continue;
        }

        let argIndex = 1;
        jsonData["message0"] = text.replace(/\[([^\]]+)\]/g, () => `%${argIndex++}`);
        
        const args = [];
        const argMap = block["arguments"] || {};
        for (const [argName, argDef] of Object.entries(argMap)) {
            const argType = argDef["type"];
            const arg = {
                type: argType,
                name: argName
            };

            if (argType === "input_value" || argType === "input_statement") {
                if (argDef["check"]) {
                    arg.check = argDef["check"];
                }
            } else if (argType.startsWith("field_")) {
                if (argType === "field_input") {
                    arg.text = "";
                } else if (argType === "field_number") {
                    arg.value = 0;
                }
            }

            args.push(arg);
        }
        jsonData["args0"] = args;
        jsonData["inputsInline"] = true;
        switch (type) {
            case 'block':
                const isCap = block["isTerminal"];
                jsonData["previousStatement"] = null;
                if (!isCap) {
                    jsonData["nextStatement"] = null;
                }
                break;
            case 'reporter':
                const output = block["output"];
                jsonData["output"] = defineOutput(output);
                break;
            case 'boolean':
                jsonData["output"] = "Boolean";
                break;
        }
        jsonData["colour"] = colour;
        
        if (type !== 'label' || type !== 'gap') {
            const blockReturns = block["returns"];

            registerBlock(id + '_' + blockid, jsonData, (block) => {
                const code = blockReturns(block, javascriptGenerator)
                return code;
            })

            blocksVar.push({
                id: id + '_' + blockid,
                jsonData: jsonData,
                returns: blockReturns.toString()
            })
        }
    }
    checkForErrors(extensionClass)
    for (const blockData of blocksVar) {
        if (blockData.returns == undefined) {
            console.log("its undefined")
        }
        if (blockData.returns == null) {
            console.log("its null")
        }
        if (!blockData.returns) {
            console.log("it doesn't exist")
        }
    }
    return { xml: defineXmlOfExtension(extensionClass), name: name, blocks: blocksVar }
}

export default registerCustomExtension