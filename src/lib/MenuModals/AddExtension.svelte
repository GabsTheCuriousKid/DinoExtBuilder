<script>
    import { page } from '$app/stores';
    import { createEventDispatcher } from "svelte";

    import { get, set, remove } from '../../utils/GlobalTempVariables.js';

    const dispatch = createEventDispatcher();

    let toggledCustomGUI = false;
    let extensionCode;

    function cancel() {
        if (!!toggledCustomGUI) {
            toggleCustomGUI(false)
            extensionCode = null
            toggleCustom()
        } else {
            dispatch("cancel");
        }
    }

    function event() {
        if (!!toggledCustomGUI) {
            extensionCode = document.getElementById("extensions_textarea").value
            toggleCustom()
            toggleCustomGUI(false)
        }
        dispatch("completed", {
            hiddenblocksExt: localhiddenblocksExt,
            webextensionExt: localwebextensionExt,
            effectsExt: localeffectsExt,
            jsextensionExt: localjsextensionExt,
            timersextensionExt: localtimersextensionExt,
            customextensionExt: localcustomextensionExt,
            extensionCode: localCustomExtensionCode,
        });
    }

    export let hiddenblocksExt = false;
    export let webextensionExt = false;
    export let effectsExt = false;
    export let jsextensionExt = false;
    export let timersextensionExt = false;
    export let customextensionExt = false;
    let localhiddenblocksExt = hiddenblocksExt;
    let localwebextensionExt = webextensionExt;
    let localeffectsExt = effectsExt;
    let localjsextensionExt = jsextensionExt;
    let localtimersextensionExt = timersextensionExt
    let localcustomextensionExt = customextensionExt;
    let localCustomExtensionCode = '';

    function toggleHidden() {
        localhiddenblocksExt = !localhiddenblocksExt
    }
    function toggleWeb() {
        localwebextensionExt = !localwebextensionExt
    }
    function toggleEffects() {
        localeffectsExt = !localeffectsExt
    }
    function toggleJS() {
        localjsextensionExt = !localjsextensionExt
    }
    function toggleTimers() {
        localtimersextensionExt = !localtimersextensionExt
    }
    function toggleCustom() {
        if (extensionCode == null || extensionCode == '') {
            localcustomextensionExt = false
            localCustomExtensionCode = ''
            console.log("Cancelled")
        } else {
            localcustomextensionExt = true
            localCustomExtensionCode = extensionCode
        }
    }

    function toggleCustomGUI(bool) {
        toggledCustomGUI = bool
        if (bool) {
            for (const blockExtension of document.querySelectorAll(".block-extension")) {
                blockExtension.style.display = "none"
            }
            document.getElementById("chooseNote").innerHTML = "Paste the Custom Extension code below"
            document.getElementById("extensions_textarea").style.display = ""
        } else {
            for (const blockExtension of document.querySelectorAll(".block-extension")) {
                blockExtension.style.display = ""
            }
            document.getElementById("chooseNote").innerHTML = "Choose an Extension you'll like to add"
            document.getElementById("extensions_textarea").style.display = "none"
        }
    }

    let IsLiveTests;

    $: IsLiveTests = $page.url.searchParams.has('livetests');
</script>

<div class="bg">
    <div class="modal">
        <div class="modal-title">
            <p>Extensions</p>
        </div>
        <div class="modal-content">
            <div 
                style="display:flex;flex-direction:column;align-items:center;justify-content:center;height=100%"
            >
                <p id="chooseNote">Choose an Extension you'll like to add</p>
                <p>Note: After you add one or more Extensions, you can't remove the Extension/s unless you refresh the page!</p>
                <textarea id="extensions_textarea" placeholder="Paste the Custom extension here" style="display: none;"></textarea>
            </div>
            <button class="block-extension" on:click={toggleHidden}>
                <img 
                    alt="HiddenBlocksPNG"
                    src="images/extensionIcons/HiddenBlocksIcon.png"
                    height={50}
                />
                <div style="height:5px" />
                {localhiddenblocksExt ? 'Selected' : 'Hidden Blocks'}
            </button>
            <button class="block-extension" on:click={toggleEffects}>
                <img 
                    alt="EffectsPNG"
                    src="images/extensionIcons/looks-expansion.png"
                    height={50}
                />
                <div style="height:5px" />
                {localeffectsExt ? 'Selected' : 'Effects'}
            </button>
            <button class="block-extension" on:click={toggleTimers}>
                <img 
                    alt="TimersExtensionPNG"
                    src="images/extensionIcons/NoIcon.png"
                    height={50}
                />
                <div style="height:5px" />
                {localtimersextensionExt ? 'Selected' : 'Timers (DinosaurMod Only)'}
            </button>
            <button class="block-extension" on:click={toggleWeb}>
                <img 
                    alt="WebExtensionPNG"
                    src="images/extensionIcons/NoIcon.png"
                    height={50}
                />
                <div style="height:5px" />
                {localwebextensionExt ? 'Selected' : 'Site Runtime'}
            </button>
            <button class="block-extension" on:click={toggleJS}>
                <img 
                    alt="JSExtensionPNG"
                    src="images/extensionIcons/NoIcon.png"
                    height={50}
                />
                <div style="height:5px" />
                {localjsextensionExt ? 'Selected' : 'Javascript'}
            </button>
            <button class="block-extension" on:click={() => toggleCustomGUI(true)}>
                <img 
                    alt="CustomExtensionPNG"
                    src="images/extensionIcons/NoIcon.png"
                    height={50}
                />
                <div style="height:5px" />
                {localcustomextensionExt ? 'Selected' : 'Add Custom Extension'}
            </button>
        </div>
        <div class="modal-buttons">
            <button class="button-cancel" on:click={cancel}>Cancel</button>
            <div style="margin-left:6px" />
            <button class="button-accept" on:click={event}>OK</button>
            <div style="margin-left:24px" />
        </div>
    </div>
</div>

<style>
    .button-cancel {
        border: 1px solid rgba(0, 0, 0, 0.15);
        background: white;
        color: black;
        font-weight: bold;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        font-size: 0.85rem;
        cursor: pointer;
    }
    .button-accept {
        border: 1px solid #80f41a;
        background: #80f41a;
        color: white;
        font-weight: bold;
        padding: 0.75rem 1rem;
        border-radius: 0.25rem;
        font-size: 0.85rem;
        cursor: pointer;
    }

    label {
        font-weight: bold;
        font-size: 0.625rem;
        user-select: none;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .bg {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background: #6dd016b0;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .modal {
        width: 60%;
        height: 70%;
        outline: 4px solid hsla(0, 100%, 100%, 0.25);
        border-radius: 0.5rem;
        background: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
    }
    :global(body.dark) .bg {
        background-color: #333333b0;
    }
    :global(body.dark) .modal {
        background-color: #111;
    }

    .modal-title {
        width: 100%;
        height: 10%;
        background: #80f41a;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    :global(body.dark) .modal-title {
        background-color: #333;
    }
    .modal-content {
        width: 100%;
        height: 75%;
        overflow: auto;
    }
    .modal-buttons {
        width: 100%;
        height: 15%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: right;
    }
    .block-extension {
        background: transparent;
        font-weight: bold;
        margin: 5px;
        padding: 8px 32px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        cursor: pointer;
    }
    :global(body.dark) .block-extension {
        color: white;
        border-color: #ccc;
    }
    .block-extension:focus,
    .block-extension:hover {
        border-color: #80f41a !important;
    }
    .block-extension:active {
        border-color: black !important;
    }
    :global(body.dark) .block-extension:active {
        border-color: rgb(114, 114, 114) !important;
    }
    textarea {
        width: 80%;
        height: 240px;
        resize: none;
        overflow: auto;
        background-color: white;
        color: #111111;
    }
    textarea::placeholder {
        color: #757575;
    }
    :global(body.dark) textarea {
        background-color: #111111;
        color: white;
    }
    :global(body.dark) textarea::placeholder {
        color: #444444;
    }
</style>
