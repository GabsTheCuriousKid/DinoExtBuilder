import javascriptGenerator from '../javascriptGenerator';

const start = ``

class Compiler {
    /**
     * Generates JavaScript code from the provided workspace & info.
     * @param {Blockly.Workspace} workspace 
     * @param {object} extensionMetadata 
     * @param {object} imageStates 
     * @returns {string} Generated code.
     */
    compile(workspace, extensionMetadata, imageStates) {
        const code = javascriptGenerator.workspaceToCode(workspace);

        const headerCode = [
            `/*`,
            `   This extension was made with DinoExtBuilder!`,
            `   https://dinoextbuilder.vercel.app/`,
            `*/`,
            `(async function (dinoBuilder) {`,
            `const variables = {};`,
            start
        ];
        const classRegistry = {
            top: [
                `class Extension {`
            ],
            extensionInfo: {},
            bottom: [
                `}`
            ]
        }
        const footerCode = [
            `dinoBuilder.extensions.register(new Extension());`,
            `})(dinoBuilder);`
        ];

        if (imageStates) {
            if (imageStates.icon.image) {
                // add icon uri
                const url = imageStates.icon.image;
                classRegistry.extensionInfo.blockIconURI = url;
            }
            if (imageStates.menuicon.image) {
                // add icon uri
                const url = imageStates.menuicon.image;
                classRegistry.extensionInfo.menuIconURI = url;
            }
        }
        if (extensionMetadata) {
            classRegistry.extensionInfo.id = extensionMetadata.id;
            classRegistry.extensionInfo.name = extensionMetadata.name;
            if (extensionMetadata.color1) {
                classRegistry.extensionInfo.colour = extensionMetadata.color1;
            }
        }

        return [].concat(headerCode, classRegistry.top, [
            `getInfo() {`,
            `return ${JSON.stringify(classRegistry.extensionInfo).substring(0, JSON.stringify(classRegistry.extensionInfo).length - 1) + ', "blocks": ' + code + ' }'}`,
            `}`,
        ], classRegistry.bottom, footerCode).join('\n');
    }
}

export default Compiler;