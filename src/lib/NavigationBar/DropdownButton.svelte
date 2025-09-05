<script>
	import { onMount, onDestroy, createEventDispatcher } from "svelte";

    export let dropdownContent = null;
	export let initiallyOpen = false;

	let showDropdown = initiallyOpen;
	let dropdownRef;
	const dispatch = createEventDispatcher();

	function toggleDropdown() {
		showDropdown = !showDropdown;
		dispatch("toggle", { open: showDropdown });
	}

	function handleClickOutside(event) {
		if (dropdownRef && !dropdownRef.contains(event.target)) {
			showDropdown = false;
			dispatch("close");
		}
	}

	let removeListener;

	onMount(() => {
		if (typeof document !== 'undefined') {
			document.addEventListener("mousedown", handleClickOutside);
			removeListener = () =>
				document.removeEventListener("mousedown", handleClickOutside);
		}
	});

	onDestroy(() => {
		if (removeListener) removeListener();
	});
</script>

<div class="dropdown-container" bind:this={dropdownRef}>
    <button on:click={toggleDropdown}>
	    <b>
            <slot />
        </b>
    </button>
	{#if showDropdown}
		<div class="dropdown">
			<slot name="content">
				{#if dropdownContent}
					{@html dropdownContent}
				{/if}
			</slot>
		</div>
	{/if}
</div>

<style>
	.dropdown-container {
		position: relative;
		height: 100%;
	}

    button {
        position: relative;
        height: 100%;
        padding: 0 0.75rem;
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

	button:hover {
		background: rgba(0, 0, 0, 0.2);
	}

	:global(body.dark) button:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		background: #80f41a;
		padding: 0.5rem;
		color: white;
		z-index: 999999;
		min-width: 150px;
	}

	:global(body.dark) .dropdown {
		background: #333;
		color: white;
		border-color: #444;
	}
</style>
