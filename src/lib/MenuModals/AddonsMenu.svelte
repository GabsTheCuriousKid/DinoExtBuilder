<script>
    export let dsText = false;
    export let blockPIcons = false;

    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();

    let localDsText = dsText;
    let localBlockPIcons = blockPIcons;

    function cancel() {
        dispatch("cancel");
    }
    
    function event() {
        dispatch("completed", {
            dstext: localDsText,
            blockPaletteIcons: localBlockPIcons
        });
    }

    function toggleDsText() {
        localDsText = !localDsText;
    }
    function toggleBlockPI() {
        localBlockPIcons = !localBlockPIcons;
    }
</script>
<div class="bg">
    <div class="modal">
        <div class="modal-title">
            <p>Addons</p>
        </div>
        <div class="modal-content">
            <div
                style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%"
            >
                <div
                    style="display:flex;flex-direction:row;align-items:center;"
                >   
                    {'Hide Text in Category Buttons'}
                    <button class="addon-button" on:click={toggleDsText}>
                        {localDsText ? 'On' : 'Off'}
                    </button>
                </div>
            </div>
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
    input[type="color"] {
        margin-left: 3px;
    }
    img {
        cursor: not-allowed;
    }
    /* color picker */
    input[type="color"] {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 40px;
        height: 40px;
        background-color: transparent;
        border: none;
        cursor: pointer;
    }
    input[type="color"]::-webkit-color-swatch {
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.25);
    }
    input[type="color"]::-moz-color-swatch {
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.25);
    }
    :global(body.dark) input[type="color"]::-webkit-color-swatch {
        border-color: rgba(255, 255, 255, 0.5);
    }
    :global(body.dark) input[type="color"]::-moz-color-swatch {
        border-color: rgba(255, 255, 255, 0.5);
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
        height: 50%;
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
    .extensionMenuPreview {
        width: 60px;
        position: relative;
        cursor: pointer;
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
    .tbBubbleIcon {
        width: 16px;
        height: 16px;
        background: #0006;
        backdrop-filter: blur(2px);
        border-radius: 8px;
        position: absolute;
        top: -3px;
        right: -3px;
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
        position: relative;
    }
    .extensionBubbleName {
        font-size: 0.65rem;
    }
    .addon-button {
        background: transparent;
        font-weight: bold;
        margin: 5px;
        padding: 8px 32px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        cursor: pointer;
    }
    :global(body.dark) .addon-button {
        color: white;
        border-color: #ccc;
    }
    .addon-button:focus,
    .addon-button:hover {
        border-color: #80f41a !important;
    }
    .addon-button:active {
        border-color: black !important;
    }
    :global(body.dark) .addon-button:active {
        border-color: rgb(114, 114, 114) !important;
    }
</style>