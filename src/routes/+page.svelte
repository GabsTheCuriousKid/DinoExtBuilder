<script>
    import { onMount, afterUpdate } from "svelte";
    import { browser } from '$app/environment';
    import { page } from '$app/stores';

    // Components
    import NavigationBar from "$lib/NavigationBar/NavigationBar.svelte";
    import NavigationDivider from "$lib/NavigationBar/Divider.svelte";
    import NavigationButton from "$lib/NavigationBar/Button.svelte";
    import DropdownButton from "$lib/NavigationBar/DropdownButton.svelte";
    import StyledButton from "$lib/StyledComponents/ToolboxButton.svelte";

    // Modals
    import ExtensionColorsModal from "$lib/MenuModals/ExtensionColors.svelte";
    import AddExtensionsModal from "$lib/MenuModals/AddExtension.svelte";
    import CreateBlockModal from "$lib/MenuModals/CreateBlock.svelte";
    import AddonsMenuModal from "$lib/MenuModals/AddonsMenu.svelte";

    // Modal Scripts
    import CreateBlockModalScript from "$lib/MenuModals/createblock.js";

    // Toolbox
    import Toolbox from "$lib/Toolbox/Toolbox.xml?raw";
    import liveTestsCategory from "$lib/Toolbox/livetests.xml?raw";

    import JSZip from "jszip";
    import beautify from "js-beautify";
    import Prism from "prismjs";
    import * as FileSaver from "file-saver";
    import fileDialog from "../resources/fileDialog";
    import EventManager from "../resources/events";

    import AddXMLtoXML from '../utils/AddXMLtoXML.js';
    import RemoveXMLfromXML from '../utils/RemoveXMLfromXML.js';
    import { get, set, remove } from '../utils/GlobalTempVariables.js';

    import Blockly from "blockly/core";
    import * as ContinuousToolboxPlugin from "@blockly/continuous-toolbox";
    import "@blockly/field-colour-hsv-sliders";

    const Theme = Blockly.Theme.defineTheme("BasicTheme", {
        base: Blockly.Themes.Classic,
        fontStyle: {
            family: '"Source Code Pro", monospace', //'"Helvetica Neue", Helvetica, Arial, sans-serif',
            weight: "500",
            size: 12,
        },
        startHats: true,
    });

    Blockly.VerticalFlyout.prototype.getFlyoutScale = function () {
        return config.zoom.startScale - 0.05;
    };

    import En from "blockly/msg/en";
    import "blockly/blocks";

    import BlocklyComponent from "svelte-blockly";

    import Compiler from "../resources/compiler";
    import preload from "../resources/preload";

    // Blocks
    import registerGeneric from "../resources/blocks/generic.js";
    registerGeneric();

    import registerCommon from "../resources/blocksCommon";
    registerCommon();

    import registerCore from "../resources/blocks/core.js";
    import registerEvents from "../resources/blocks/events.js";
    import registerControl from "../resources/blocks/control.js";
    import registerSensing from "../resources/blocks/sensing.js";
    import registerMotion from "../resources/blocks/motion.js";
    import registerLooks from "../resources/blocks/looks.js";
    import registerSound from "../resources/blocks/sound.js";
    import registerLiterals from "../resources/blocks/literals.js";
    import registerOperators from "../resources/blocks/operators.js";
    import registerConversions from "../resources/blocks/conversions.js";
    import registerVariables from "../resources/blocks/variables.js";
    import registerJSON from "../resources/blocks/json.js";
    import registerBlocks from "../resources/blocks/blocks.js";
    import registerMenus from "../resources/blocks/menus.js";
    import registerFunctions from "../resources/blocks/functions.js";
    import registerDebug from "../resources/blocks/debug.js";
    
    registerCore();
    registerControl();
    registerEvents();
    registerMotion();
    registerLooks();
    registerSound();
    registerSensing();
    registerLiterals();
    registerOperators();
    registerConversions();
    registerVariables();
    registerJSON();
    registerBlocks();
    registerMenus();
    registerFunctions();
    registerDebug();

    // Extension Blocks
    import registerWebExtension from "../resources/extensions/webextension/webextension.js";
    import registerJSExtension from "../resources/extensions/javascript/javascript.js";
    import registerTimersExtension from "../resources/extensions/dm_timers/timers.js";

    registerWebExtension();
    registerJSExtension();
    registerTimersExtension();

    import hiddenblocksExtension from "../resources/extensions/hiddenblocks/hiddenblocks.xml?raw";
    import webExtensionExtension from "../resources/extensions/webextension/webextension.xml?raw";
    import effectsExtension from "../resources/extensions/effects/effects.xml?raw";
    import javascriptExtension from "../resources/extensions/javascript/javascript.xml?raw";
    import timersExtension from "../resources/extensions/dm_timers/timers.xml?raw";

    import registerCustomExtension from "../resources/extensions/custom/extension_renderer.js";
    import registerBlock from '../resources/register';
    import javascriptGenerator from '../resources/javascriptGenerator';

    const en = {
        rtl: false,
        msg: {
            ...En,
        },
    };

    import customRenderer from "../resources/renderer"
    Blockly.blockRendering.unregister('custom_renderer') //weird bug
    Blockly.blockRendering.register('custom_renderer', customRenderer)

    let config = {
        toolbox: Toolbox,
        collapse: true,
        comments: true,
        scrollbars: true,
        disable: false,
        theme: Theme,
        renderer: "custom_renderer",
        grid: {
            spacing: 25,
            length: 3,
            colour: "#00000011",
            snap: false,
        },
        zoom: {
            controls: true,
            wheel: false,
            startScale: 0.8,
            maxScale: 4,
            minScale: 0.25,
            scaleSpeed: 1.1,
        },
        plugins: {
            toolbox: ContinuousToolboxPlugin.ContinuousToolbox,
            flyoutsVerticalToolbox: ContinuousToolboxPlugin.ContinuousFlyout,
            metricsManager: ContinuousToolboxPlugin.ContinuousMetrics,
        },
        move: {
            scrollbars: {
                horizontal: true,
                vertical: true,
            },
            drag: true,
            wheel: true,
        },
    };

    let workspace;
    let compiler;
    let projectName = "";
    let projectID = "";
    let lastGeneratedCode = "";

    const extensionImageStates = {
        icon: {
            failed: false,
            square: false,
            loading: false,
            image: "",
        },
        menuicon: {
            failed: false,
            square: false,
            loading: false,
            image: "",
        },
    };
    const extensionMetadata = {
        id: "extensionID",
        name: "Extension",
        docsURL: "",
        color1: "#0088ff",
        color2: "#0063ba",
        color3: "",
        tbShow: true
    };

    function updateGeneratedCode() {
        extensionMetadata.name = "Extension";
        extensionMetadata.id = "extensionID";
        if (projectName) {
            extensionMetadata.name = projectName;
        }
        if (projectID) {
            extensionMetadata.id = projectID;
        }
        const code = compiler.compile(
            workspace,
            extensionMetadata,
            extensionImageStates
        );
        lastGeneratedCode = code;
    }

    function generateDinoBuilderWindow(window) {
        window.dinoBuilder = window.dinoBuilder || {};

        // Extensions
        window.dinoBuilder.extensions = window.dinoBuilder.extensions || {};
        window.dinoBuilder.extensions.register = (extensionClass) => {
            const {xml, name, blocks} = registerCustomExtension(extensionClass)
            onAddExtension(xml, name, true, true, blocks)
        }

        // Blockly
        window.dinoBuilder.Blockly = window.Blockly || {};
        window.dinoBuilder.Blockly.getMainWorkspace = () => workspace;
        window.dinoBuilder.Blockly.getMainWorkspace().undo = () => workspace.undo();
        window.dinoBuilder.Blockly.getMainWorkspace().redo = () => workspace.redo();
        /*window.dinoBuilder.Blockly.getMainWorkspace().refreshToolbox = () => {
            const Blockly = window.dinoBuilder.Blockly;
            const workspace = Blockly.getMainWorkspace()
            const toolboxXml = workspace.options.languageTree.cloneNode(true);
            workspace.updateToolbox(toolboxXml);
        };*/

        // ArgumentTypes
        window.dinoBuilder.ArgumentType = window.dinoBuilder.ArgumentType || {};
        window.dinoBuilder.ArgumentType.EMPTY = "input_value";
        window.dinoBuilder.ArgumentType.STRING = "field_input";

        // BlockTypes
        window.dinoBuilder.BlockType = window.dinoBuilder.BlockType || {};
        window.dinoBuilder.BlockType.BLOCK = "block";
        window.dinoBuilder.BlockType.REPORTER = "reporter";
        window.dinoBuilder.BlockType.BOOLEAN = "boolean";
        window.dinoBuilder.BlockType.GAP = "gap";
        window.dinoBuilder.BlockType.LABEL = "label";
        window.dinoBuilder.BlockType.XML = "xml";

        // Gui
        window.dinoBuilder.Gui = window.Gui || {};
        window.dinoBuilder.Gui.isLiveTests = () => IsLiveTests;
        window.dinoBuilder.Gui.copy = (text) => navigator.clipboard.writeText(text);
        window.dinoBuilder.Gui.download = (text, fileName, fileExtension, fileType = "text/javascript;charset=UTF-8") => {
            const filteredFileName = fileName.replace(
                /[^a-z0-9\-]+/gim,
                "_"
            );
            const blob = new Blob([text], {
                type: fileType,
            });
            FileSaver.saveAs(blob, filteredFileName + fileExtension);
        };
        window.dinoBuilder.Gui.generatedCode = () => beautifyGeneratedCode(code);

        Object.defineProperty(window.dinoBuilder, "secret_", {
            value: function () {
                console.log("Credits: Penguinmod")
                window.dinoBuilder.extensions.register('class Extension {getInfo() {return {"name": "Ur mom","id": "urmom","colour": "#FF0000","blocks": [{"opcode": "block","text": "ur mom","type": "block","returns": (block, javascriptGenerator) => {return \`const urmom = "urmom"; console.log(urmom)\`;}},{"opcode": "reporter","text": "ur mom","type": "reporter","output": "string","returns": (block, javascriptGenerator) => {return [\`"urmom"\`, javascriptGenerator.ORDER_ATOMIC];}},{"opcode": "boolean","text": "ur mom","type": "boolean","returns": (block, javascriptGenerator) => {return [\`Boolean("urmom")\`, javascriptGenerator.ORDER_ATOMIC];}},]}}}');
            },
            enumerable: false
        });
    }

    let dropdownEl;
    let selectedExtension = null;

    import pkg from '@blockly/workspace-minimap';
    const { PositionedMinimap } = pkg;
    onMount(async () => {
        console.log("ignore the warnings above we dont care about those");

        window.onbeforeunload = () => "";
        compiler = new Compiler(workspace);
        // workspace was changed
        workspace.addChangeListener(updateGeneratedCode);

        EventManager.allowAttachment();
        EventManager.on(EventManager.EVENT_THEME_CHANGED, () => {
            workspace.refreshTheme();
        });

        const minimap = new PositionedMinimap(workspace);
        minimap.init();

        while (!document.querySelector('.blocklyToolboxDiv')) {
			await new Promise(resolve => setTimeout(resolve, 10))
		}
        const toolboxEl = document.querySelector('.blocklyToolboxDiv');
        
        toolboxEl.addEventListener('mousedown', (e) => {
            const category = e.target.closest('.blocklyTreeLabel');
            if (!category) return;
            const name = category.textContent.trim();
            if (isExtensionCategory(name)) {
                showExtensionDropdown(e, name);
            } else {
                hideExtensionDropdown();
            }
        }); 

        generateDinoBuilderWindow(window);

        document.addEventListener('mousedown', async (event) => {
            while (!document.getElementById('extensionDropdown')) {
				await new Promise(resolve => setTimeout(resolve, 10))
			}
            dropdownEl = document.getElementById("extensionDropdown");
            if (dropdownEl && !dropdownEl.contains(event.target)) {
                hideExtensionDropdown();
            }
        });
    });

    let IsLiveTests;

    $: IsLiveTests = $page.url.searchParams.has('livetests');

    const addedExtensions = [];

    function downloadProject() {
        // generate file name
        let filteredProjectName = (projectName || projectID).replace(/[^a-z0-9\-]+/gim, "_");
        let fileName = filteredProjectName + ".tb";
        if (!filteredProjectName) {
            fileName = "MyProject.tb";
        }

        // data
        let projectData = Blockly.serialization.workspaces.save(workspace)

        // modify data by me wow
        projectData = {
            blockly: projectData,
            metadata: extensionMetadata,
            images: extensionImageStates,
            extensions: addedExtensions
        }

        // zip
        const zip = new JSZip();
        zip.file(
            "README.txt",
            "This file is not meant to be opened!" +
                "\nBe careful as you can permanently break your project!"
        );

        // data
        const data = zip.folder("data");
        data.file("project.json", JSON.stringify(projectData));

        // download
        zip.generateAsync({ type: "blob" }).then((blob) => {
            FileSaver.saveAs(blob, fileName);
        });
    }
    function loadProject() {
        fileDialog({ accept: ".tb" }).then((files) => {
            if (!files) return;
            const file = files[0];

            const projectNameIdx = file.name.lastIndexOf(".tb");

            JSZip.loadAsync(file.arrayBuffer()).then(async (zip) => {
                console.log("loaded zip file...");

                // get project json from the data folder
                const dataFolder = zip.folder("data");
                const projectJsonString = await dataFolder
                    .file("project.json")
                    .async("string");
                const projectJson = JSON.parse(projectJsonString);

                // do your thing
                projectName = projectJson.metadata.name
                projectID = projectJson.metadata.id
                for (var i in projectJson.metadata) {
                    var v = projectJson.metadata[i]
                    extensionMetadata[i] = v
                }
                for (var i in projectJson.images) {
                    var v = projectJson.images[i]
                    extensionImageStates[i] = v
                }

                // get project workspace xml stuffs
                const workspacesFolder = zip.folder("workspaces");
                const fileNames = [];
                workspacesFolder.forEach((_, file) => {
                    const fileName = file.name.replace("workspaces/", "");
                    fileNames.push(fileName);
                });
                // console.log(fileNames); // debug
                const idWorkspacePairs = {};
                for (const fileName of fileNames) {
                    const idx = fileName.lastIndexOf(".xml");
                    const id = fileName.substring(0, idx);
                    // assign to pairs
                    idWorkspacePairs[id] = await workspacesFolder
                        .file(fileName)
                        .async("string");
                }
                // console.log(idWorkspacePairs); // debug

                // extensions
                async function addAllExtensions() {
                    const extensions = projectJson.extensions;
                    for (const extension of extensions) {
                        if (extension.customData) {
                            for (const blockData of extension.customData) {
                                let returnsFn;
                                if (typeof blockData.returns === "string") {
                                    try {
                                        returnsFn = eval(`(${blockData.returns})`);
                                    } catch (e) {
                                        console.error("Failed to restore returns function:", e);
                                        returnsFn = () => "";
                                    }
                                } else {
                                    returnsFn = () => "";
                                }
                                registerBlock(blockData.id, blockData.jsonData, (block) => {
                                    return returnsFn(block, javascriptGenerator)
                                })
                            }
                            await onAddExtension(extension.xml, extension.name);
                        } else {
                            await onAddExtension(extension.xml, extension.name);
                        }
                    };
                }
                addAllExtensions()

                // laod
                console.log(projectJson); // debug
                Blockly.serialization.workspaces.load(projectJson.blockly, workspace);

                updateGeneratedCode()
            });
        });
    }

    // code display & handling
    function beautifyGeneratedCode(code) {
        const beautified = beautify.js(code, {
            indent_size: 4,
            space_in_empty_paren: true,
        });
        return beautified;
    }
    function displayGeneratedCode(code) {
        const beautified = beautifyGeneratedCode(code);
        const highlighted = Prism.highlight(
            beautified,
            Prism.languages.javascript
        );
        return highlighted;
    }

    // image importing
    function extensionIconAdded(event) {
        console.log(event);
        const filePicker = event.target;
        // check if we have a file
        if (!filePicker.files || !filePicker.files[0]) {
            // remove the image
            extensionImageStates.icon.failed = false;
            extensionImageStates.icon.square = false;
            extensionImageStates.icon.loading = false;
            extensionImageStates.icon.image = "";
            updateGeneratedCode();
            return;
        }
        const file = filePicker.files[0];

        extensionImageStates.icon.loading = true;
        const fileReader = new FileReader();
        fileReader.onload = () => {
            // file finished loading
            const url = fileReader.result;
            extensionImageStates.icon.image = url;
            updateGeneratedCode();
            // start checking the other stuff
            const image = new Image();
            image.onload = () => {
                extensionImageStates.icon.failed = false;
                extensionImageStates.icon.square = image.width === image.height;
                // mark as loading finished
                extensionImageStates.icon.loading = false;
            };
            image.onerror = () => {
                extensionImageStates.icon.failed = true;
                extensionImageStates.icon.square = false;
                // mark as loading finished
                extensionImageStates.icon.loading = false;
            };
            image.src = url;
        };
        fileReader.readAsDataURL(file);
    }

    function extraIconAdded(event) {
        console.log(event);
        const filePicker = event.target;
        // check if we have a file
        if (!filePicker.files || !filePicker.files[0]) {
            // remove the image
            extensionImageStates.menuicon.failed = false;
            extensionImageStates.menuicon.square = false;
            extensionImageStates.menuicon.loading = false;
            extensionImageStates.menuicon.image = "";
            updateGeneratedCode();
            return;
        }
        const file = filePicker.files[0];

        extensionImageStates.menuicon.loading = true;
        const fileReader = new FileReader();
        fileReader.onload = () => {
            // file finished loading
            const url = fileReader.result;
            extensionImageStates.menuicon.image = url;
            updateGeneratedCode();
            // start checking the other stuff
            const image = new Image();
            image.onload = () => {
                extensionImageStates.menuicon.failed = false;
                extensionImageStates.menuicon.square = image.width === image.height;
                // mark as loading finished
                extensionImageStates.menuicon.loading = false;
            };
            image.onerror = () => {
                extensionImageStates.menuicon.failed = true;
                extensionImageStates.menuicon.square = false;
                // mark as loading finished
                extensionImageStates.menuicon.loading = false;
            };
            image.src = url;
        };
        fileReader.readAsDataURL(file);
    }

    // validation
    function isExtensionIDInvalid(id) {
        return Boolean(String(id).match(/[^a-z0-9]/gim));
    }

    // Modals
    const ModalState = {
        extensionColors: false,
        addExtensions: false,
        addonsMenu: false,
        dsText: false,
        blockPIcons: false,
    };

    let newToolbox = Toolbox;

    function hasCategory(xmlString, categoryName) {
        const doc = new DOMParser().parseFromString(xmlString, 'text/xml');
        return !![...doc.querySelectorAll('category')].find(
            el => el.getAttribute('name') === categoryName
        );
    }

    async function onAddExtension(extensionXML, categoryName, shouldSave, isCustom, customData) {
        if (!hasCategory(newToolbox, categoryName)) {
            let modifiedToolbox = AddXMLtoXML(extensionXML, newToolbox);
            newToolbox = modifiedToolbox;
            if (!!shouldSave) {
                if (!!isCustom) {
                    addedExtensions.push({
                        name: categoryName,
                        xml: extensionXML,
                        customData: customData
                    })
                } else {
                    addedExtensions.push({
                        name: categoryName,
                        xml: extensionXML
                    })
                }
            }
            updateToolbox(newToolbox);
        }
    }

    async function onHiddenBlocksMount() {
        try {
            onAddExtension(hiddenblocksExtension, "Hidden Blocks", true);
        } catch (error) {
            console.error('Error injecting XML:', error);
        }
    }
    async function onWebExtensionMount() {
        try {
            onAddExtension(webExtensionExtension, "Site Runtime", true);
        } catch (error) {
            console.error('Error injecting XML:', error);
        }
    }
    async function onEffectsMount() {
        try {
            onAddExtension(effectsExtension, "Effects", true);
        } catch (error) {
            console.error('Error injecting XML:', error);
        }
    }
    async function onJSExtensionMount() {
        try {
            onAddExtension(javascriptExtension, "Javascript", true);
        } catch (error) {
            console.error('Error injecting XML:', error);
        }
    }
    async function onTimersExtensionMount() {
        try {
            onAddExtension(timersExtension, "Timers", true);
        } catch (error) {
            console.error('Error injecting XML:', error);
        }
    }
    let refreshKey = 0;
    
    async function updateToolbox(newToolbox) {
        try {
            while (!workspace) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            workspace.updateToolbox(newToolbox);

            Blockly.svgResize(workspace);
            workspace.resize();

            while (!workspace.getToolbox || !workspace.getToolbox()) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            const toolbox = workspace.getToolbox();
            toolbox.refreshSelection();

            workspace.removeChangeListener(updateGeneratedCode);
            workspace.addChangeListener(updateGeneratedCode);

            updateGeneratedCode()
        } catch (error) {
            console.error("Failed to update toolbox:", error);
        }
    }

    async function onRemoveExtension(extensionXML, categoryName) {
        if (!!hasCategory(newToolbox, categoryName)) {
            let modifiedToolbox = RemoveXMLfromXML(categoryName, newToolbox);
            newToolbox = modifiedToolbox;
            for (const extension of addedExtensions) {
                if (extension.name === categoryName && extension.xml === extensionXML) {
                    const removeThis = addedExtensions.indexOf(extension);
                    if (removeThis === -1) return;
                    addedExtensions.splice(removeThis, 1)
                }
            };
            updateToolbox(newToolbox);
            hideExtensionDropdown();
        }
    }

    $: if (IsLiveTests) {
        console.log("Is Live Tests?: ", IsLiveTests)
        try {
            onAddExtension(liveTestsCategory, "Live Tests", false);
        } catch (error) {
            console.error('Error injecting XML:', error);
        }
    }

    function showExtensionDropdown(event, extensionName) {
        selectedExtension = extensionName;
        dropdownEl.style.display = 'block';
        dropdownEl.style.left = `${event.pageX}px`;
        dropdownEl.style.top = `${event.pageY}px`;
    }

    function hideExtensionDropdown() {
        dropdownEl.style.display = 'none';
        selectedExtension = null;
    }

    function isExtensionCategory(name) {
        const extensionNames = ["Hidden Blocks", "Site Runtime", "Javascript"]
        return extensionNames.includes(name)
    }

    let lines;
    let lineNumberBlocks = [];

    $: lines = beautifyGeneratedCode(lastGeneratedCode).split('\n');

    let previousLineCount = 0;
    $: if (lines.length !== previousLineCount) {
        previousLineCount = lines.length;
        refreshKey++;
    }

    let codeDisplay;
    let lineNumbers;

    function syncScroll() {
        lineNumbers.scrollTop = codeDisplay.scrollTop;
    }

    let codeLines = [];

    function syncLineHeights() {
        if (!lineNumbers || !codeDisplay) return;
        const codeLineDivs = codeDisplay.querySelectorAll('div.line');
        const lineNumberDivs = lineNumbers.querySelectorAll('div');
        codeLineDivs.forEach((lineDiv, i) => {
        const height = lineDiv.offsetHeight;
        if (lineNumberDivs[i]) {
            lineNumberDivs[i].style.height = height + 'px';
            lineNumberDivs[i].style.lineHeight = height + 'px';
        }
        });
    }

    function buildLineNumberBlocks() {
        if (!codeDisplay) return;

        const codeLineDivs = codeDisplay.querySelectorAll('div.line');

        lineNumberBlocks = [];

        let lineIndex = 1;

        for (let i = 0; i < codeLineDivs.length; i++) {
            const isNewBlock =
                i === 0 || codeLineDivs[i].offsetTop > codeLineDivs[i - 1].offsetTop;

            if (isNewBlock) {
                lineNumberBlocks.push(lineIndex++);
            } else {
                lineNumberBlocks.push('');
            }
        }
    }

    afterUpdate(() => {
        buildLineNumberBlocks();
        syncLineHeights();
    });
</script>

<CreateBlockModal
    color1={extensionMetadata.color1}
    color2={extensionMetadata.color2}
    color3={extensionMetadata.color3}
/>
{#if ModalState.addExtensions}
    <AddExtensionsModal
        on:completed={async (addextensiondata) => {
            ModalState.addExtensions = false;
            if (addextensiondata.detail.hiddenblocksExt === true) {
                onHiddenBlocksMount()
            }
            if (addextensiondata.detail.webextensionExt === true) {
                onWebExtensionMount()
            }
            if (addextensiondata.detail.effectsExt === true) {
                onEffectsMount()
            }
            if (addextensiondata.detail.jsextensionExt === true) {
                onJSExtensionMount()
            }
            if (addextensiondata.detail.timersextensionExt === true) {
                onTimersExtensionMount()
            }
            if (addextensiondata.detail.customextensionExt === true) {
                if (typeof window !== undefined) {
                    window.dinoBuilder.extensions.register(addextensiondata.detail.extensionCode)
                }
            }
        }}
        on:cancel={() => {
            ModalState.addExtensions = false;
        }}
    />
{/if}
{#if ModalState.extensionColors}
    <ExtensionColorsModal
        color1={extensionMetadata.color1}
        color2={extensionMetadata.color2}
        color3={extensionMetadata.color3}
        tbShow={extensionMetadata.tbShow}
        on:completed={(colors) => {
            ModalState.extensionColors = false;
            extensionMetadata.color1 = colors.detail.color1;
            extensionMetadata.color2 = colors.detail.color2;
            extensionMetadata.color3 = colors.detail.color3;
            extensionMetadata.tbShow = colors.detail.tbShow;
            updateGeneratedCode();
        }}
        on:cancel={() => {
            ModalState.extensionColors = false;
            updateGeneratedCode();
        }}
    />
{/if}
{#if ModalState.addonsMenu}
    <AddonsMenuModal
        dsText={ModalState.dsText}
        blockPIcons={ModalState.blockPIcons}
        on:completed={(events) => {
            ModalState.addonsMenu = false;
            ModalState.dsText = events.detail.dstext;
            ModalState.blockPIcons = events.detail.blockPaletteIcons;
            document.documentElement.style.setProperty('--dinobuilder-text', events.detail.dstext ? 'transparent' : '');
            document.documentElement.style.setProperty('--dinobuilder-text-overflow', events.detail.dstext ? 'hidden' : 'visible');
            document.documentElement.style.setProperty('--dinobuilder-text-white-space', events.detail.dstext ? 'nowrap' : 'normal');
        }}
        on:cancel={() => {
            ModalState.addonsMenu = false;
        }}
    />
{/if}
<NavigationBar>
    <DropdownButton on:toggle={(e) => console.log("Dropdown is ", e.detail.open)}>
        File
	    <div slot="content">
            <button class="button-thingy" on:click={async () => {
                const confirmation = confirm("Are you sure?");
                if (confirmation) {
                    while (!workspace) {
                        await new Promise(resolve => setTimeout(resolve, 0));
                    }
                    workspace.clear();
                }
            }}>
	            <b>
                    <slot>New</slot>
                </b>
            </button>
            <button class="button-thingy" on:click={downloadProject}>
	            <b>
                    <slot>Save</slot>
                </b>
            </button>
            <button class="button-thingy" on:click={loadProject}>
	            <b>
                    <slot>Load</slot>
                </b>
            </button>
	    </div>
    </DropdownButton>
    <NavigationDivider />
    <NavigationButton on:click={() => { ModalState.addonsMenu = true; }}>Addons</NavigationButton>
    <NavigationDivider />
    <input
        class="project-name"
        type="text"
        placeholder="Extension ID (ex: extensionID)"
        style="margin-left:4px;margin-right:4px"
        data-invalid={isExtensionIDInvalid(projectID)}
        bind:value={projectID}
        on:change={updateGeneratedCode}
    />
    {#if isExtensionIDInvalid(projectID)}
        <p style="color:white;margin-left:4px">
            <b>Extension ID must be only letters and numbers.</b>
        </p>
    {/if}
    <NavigationDivider />
    <input
        class="project-name"
        type="text"
        placeholder="Extension Name (ex: Extension)"
        style="margin-left:4px;margin-right:4px"
        bind:value={projectName}
        on:change={updateGeneratedCode}
    />
</NavigationBar>
<div class="main">
    <div class="row-menus">
        <div class="row-first-submenus">
            <div class="blockMenuButtons">
                <StyledButton
                    on:click={() => {
                        ModalState.addExtensions = true;
                    }}
                >
                    Add an Extension
                </StyledButton>
                <div style="margin-left:8px" />
                <StyledButton
                    on:click={() => {
                        ModalState.extensionColors = true;
                    }}
                >
                    Edit Extension Colors
                </StyledButton>
                <div style="margin-left:8px" />
                <!--<StyledButton
                    on:click={() => {
                        CreateBlockModalScript.open();
                    }}
                >
                    Create an Extension Block
                </StyledButton> wont need this since im changing the system -->
                <div style="margin-left:8px" />
                <div class="extensionMenuPreview">
                    <div style="text-align: center;">
                        {#if !extensionImageStates.icon.loading && !extensionImageStates.icon.failed && extensionImageStates.icon.image}
                            <div
                                class="extensionBubbleIcon"
                                style={`border: 0; border-radius: 0; background-image: url(${extensionImageStates.icon.image})`}
                            />
                        {:else}
                            <div
                                class="extensionBubbleIcon"
                                style={`background: ${extensionMetadata.color1}; border-color: ${extensionMetadata.color2}`}
                            />
                        {/if}
                        <div class="extensionBubbleName">
                            {#if projectName}
                                {projectName}
                            {:else}
                                Extension
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
            <div class="blocklyWrapper">
                <BlocklyComponent {config} locale={en} bind:workspace />
                {#if IsLiveTests}
                    <div class="extensionDropdown" style="display: none; position: absolute;">
                        <button on:click={() => onRemoveExtension(selectedExtension)}>Remove Extension</button>
                    </div>
                {/if}
            </div>
        </div>
        <div class="row-submenus">
            <div class="assetsWrapper">
                <h1>Assets</h1>
                <p>
                    Extra things that will appear under
                    {#if projectName}
                        "{projectName}"
                    {:else}
                        "Extension"
                    {/if}
                    in the block list.
                    <br />
                    These things are not required, so you can leave them empty if
                    you do not need them.
                </p>
                <p>
                    Documentation URL:
                    <input
                        type="text"
                        placeholder="https://..."
                        bind:value={extensionMetadata.docsURL}
                        on:change={updateGeneratedCode}
                    />
                </p>
                <p>
                    Extension Icon:
                    <input type="file" accept=".png,.jpg,.jpeg" on:change={extensionIconAdded} />
                </p>
                {#if !extensionImageStates.icon.loading && !extensionImageStates.icon.failed && extensionImageStates.icon.image}
                    <img
                        alt="Extension Icon"
                        title="Extension Icon"
                        class="extensionIcon"
                        src={extensionImageStates.icon.image}
                    />
                {/if}
                {#if extensionImageStates.icon.image}
                    {#if extensionImageStates.icon.failed}
                        <p class="warning">
                            The extension icon is not an image, this may appear
                            broken in the category list.
                        </p>
                    {/if}
                    {#if !extensionImageStates.icon.square}
                        <p class="warning">
                            The image is not square, this may appear broken in
                            the category list.
                        </p>
                    {/if}
                {/if}
                <h3>Extra Icons</h3>
                <p>
                    Blocks can use their own icons instead of the Extension
                    icon.
                    <br />
                    Add more images here to use them.
                </p>
                <p>
                    <input type="file" accept=".png,.jpg,.jpeg" on:change={extraIconAdded} />
                </p>
                {#if !extensionImageStates.menuicon.loading && !extensionImageStates.menuicon.failed && extensionImageStates.menuicon.image}
                    <img
                        alt="Menu Icon"
                        title="Menu Icon"
                        class="menuIcon"
                        src={extensionImageStates.menuicon.image}
                    />
                {/if}
                {#if extensionImageStates.menuicon.image}
                    {#if extensionImageStates.menuicon.failed}
                        <p class="warning">
                            The menu icon is not an image, this may appear
                            broken.
                        </p>
                    {/if}
                    {#if !extensionImageStates.menuicon.square}
                        <p class="warning">
                            The image is not square, this may appear broken.
                        </p>
                    {/if}
                {/if}
            </div>
            <div class="row-subsubmenus">
                <div class="codeActionsWrapper">
                    <p style="margin-right: 12px"><b>Extension Code</b></p>
                    <StyledButton
                        on:click={() => {
                            // copy code
                            const code =
                                beautifyGeneratedCode(lastGeneratedCode);
                            navigator.clipboard.writeText(code);
                        }}
                    >
                        Copy
                    </StyledButton>
                    <div style="margin-right: 4px" />
                    <StyledButton
                        on:click={() => {
                            // download
                            const code =
                                beautifyGeneratedCode(lastGeneratedCode);
                            const filteredProjectName = projectName.replace(
                                /[^a-z0-9\-]+/gim,
                                "_"
                            );
                            const blob = new Blob([code], {
                                type: "text/javascript;charset=UTF-8",
                            });
                            FileSaver.saveAs(blob, filteredProjectName + ".js");
                        }}
                    >
                        Download
                    </StyledButton>
                </div>
                <div class="codeWrapper">
                    <div class="lineNumbers" key={refreshKey} bind:this={lineNumbers}>
                        {#each lineNumberBlocks as number}
                            <div class="line">{number}</div>
                        {/each}
                    </div>
                    <div class="codeDisplay" bind:this={codeDisplay} on:scroll={syncScroll}>
                        {@html displayGeneratedCode(lastGeneratedCode)}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    :root {
        --nav-height: 3rem;
    }
    input[type="file"]::file-selector-button {
        padding: 0.35rem 1.65rem;

        font-size: 0.75rem;
        color: black;
        background: transparent;
        cursor: pointer;
        border: 1px solid rgba(0, 0, 0, 0.15);
        border-radius: 4px;
    }
    input[type="file"]::file-selector-button:focus,
    input[type="file"]::file-selector-button:hover,
    input[type="file"]::file-selector-button:active {
        background: white;
    }

    :global(body.dark) input[type="file"]::file-selector-button {
        color: #ccc;
        border-color: #c6c6c6;
    }
    :global(body.dark) input[type="file"]::file-selector-button:focus,
    :global(body.dark) input[type="file"]::file-selector-button:hover,
    :global(body.dark) input[type="file"]::file-selector-button:active {
        background: #111;
    }

    :global(body.dark) input[type="text"],
    :global(body.dark) input[type="number"] {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.7);
        color: white;
    }
    :global(body.dark) input[type="text"]:hover,
    :global(body.dark) input[type="number"]:hover {
        background: transparent;
        border: 1px solid dodgerblue;
    }

    .main {
        position: absolute;
        left: 0px;
        top: var(--nav-height);
        width: 100%;
        height: calc(100% - var(--nav-height));

        min-width: 870px;
    }

    .project-name {
        width: 236px;

        font-size: 20px;

        border-radius: 6px;
        outline: 1px dashed rgba(0, 0, 0, 0.15);
        border: 0;
        background: rgba(255, 255, 255, 0.25);
        color: white;

        font-weight: bold;
        font-size: 1rem;
        padding: 0.5rem;
        transition: 0.25s;
    }
    .project-name::placeholder {
        font-weight: normal;
        color: white;
        opacity: 1;
        font-style: italic;
    }
    .project-name:hover {
        background-color: hsla(0, 100%, 100%, 0.5);
        transition: 0.25s;
    }
    .project-name:active,
    .project-name:focus {
        outline: none;
        border: 1px solid hsla(0, 100%, 100%, 0);
        box-shadow: 0 0 0 calc(0.5rem * 0.5) hsla(0, 100%, 100%, 0.25);
        background-color: hsla(0, 100%, 100%, 1);
        color: black;
        transition: 0.25s;
    }

    .project-name[data-invalid="true"] {
        background-color: #a7f464;
        text-decoration: red underline;
    }
    :global(body.dark) .project-name[data-invalid="true"] {
        background-color: #9b0000 !important;
        text-decoration: red underline;
    }

    .extensionIcon {
        width: 96px;
        height: 96px;
        object-fit: contain;
    }

    .menuIcon {
        width: 96px;
        height: 96px;
        object-fit: contain;
    }

    .row-menus {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .row-submenus {
        display: flex;
        flex-direction: column;
        width: 35%;
        height: 100%;
    }
    .row-first-submenus {
        display: flex;
        flex-direction: column;
        width: 65%;
        height: 100%;
    }
    .row-subsubmenus {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 50%;
    }

    .extensionMenuPreview {
        width: 60px;
        cursor: pointer;
        overflow: hidden;
        color: #575e75;
        user-select: none;
    }
    .extensionMenuPreview:hover {
        color: #4c97ff !important;
    }
    .extensionMenuPreview:focus,
    .extensionMenuPreview:active {
        background-color: #e9eef2;
    }
    :global(body.dark) .extensionMenuPreview {
        color: #ccc;
    }
    :global(body.dark) .extensionMenuPreview:focus,
    :global(body.dark) .extensionMenuPreview:active {
        background-color: #1e1e1e;
    }
    .extensionBubbleIcon {
        width: 20px;
        height: 20px;
        background-size: 100%;
        border-radius: 100%;
        margin: 0 auto 0.125rem;
        border: 1px rgba(0, 0, 0, 0.2) solid;
    }
    .extensionBubbleName {
        font-size: 0.65rem;
    }

    .blockMenuButtons {
        position: relative;
        width: 100%;
        height: 48px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        background: #f9f9f9;
    }
    :global(body.dark) .blockMenuButtons {
        background-color: #111;
    }

    .blocklyWrapper {
        position: relative;
        width: 100%;
        height: calc(100% - 48px);
    }
    .assetsWrapper {
        position: relative;
        width: calc(100% - 16px);
        height: calc(50% - 16px);
        padding: 8px;
        overflow: auto;
    }
    .codeActionsWrapper {
        position: relative;
        width: 100%;
        height: 48px;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        background: #f9f9f9;
    }
    :global(body.dark) .codeActionsWrapper {
        background-color: #111;
    }
    .codeWrapper {
        position: relative;
        width: 100%;
        height: calc(100% - 48px);
    }

    .codeDisplay {
        width: 100%;
        height: 100%;

        border: 0;
        padding: 0 0 0 3em; /* leave space for line numbers */
        overflow: auto;

        background: #f9f9f9;
        white-space: pre-wrap;
        font-family: monospace !important;
    }
    :global(body.dark) .codeDisplay {
        background-color: #111;
    }

    .lineNumbers {
        position: absolute;
        font-family: monospace !important;
        top: 0;
        left: 0;
        width: 2em;
        padding-left: 0.5em;
        user-select: none;
        color: #888;
        background: transparent;
        text-align: right;
        font-size: 10px;
        line-height: 1.5em;
        height: 100%;
        overflow: hidden;
    }
    :global(body.dark) .lineNumbers {
        color: #666;
    }

    .lineNumbers div {
        height: 1.5em;
        line-height: 1.5em;
        text-align: right;
        padding-right: 0.5em;
        user-select: none;
    }

    .warning {
        background-color: yellow;
        color: black;
    }

    .button-thingy {
		position: relative;
		height: 2.5rem;
		padding: 0 0.75rem;
        width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		font-weight: bold;
		font-size: 0.75rem;
		color: white;
		background: transparent;
		cursor: pointer;
		border: 0;
	}

	.button-thingy:hover {
		background: rgba(0, 0, 0, 0.2);
	}
	:global(body.dark) .button-thingy:hover {
		background: rgba(255, 255, 255, 0.2);
	}

    .extensionDropdown {
        background: white;
        border: 1px solid #ccc;
        z-index: 9999;
        padding: 0.5em;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    :global(body.dark) .extensionDropdown {
        background: #222;
        color: #fff;
        border-color: #444;
    }
</style>
