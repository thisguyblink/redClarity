<script>
    import { writable } from 'svelte/store';
	let files = $state();
    let dialog;
    let name = $state("");

	$effect(() => {
		if (files) {
			// Note that `files` is of type `FileList`, not an Array:
			// https://developer.mozilla.org/en-US/docs/Web/API/FileList
			console.log(files);

            if (name === "" && files.length > 0 && files[0]) {
                name = files[0].name;  // Update the name store with the file's name
            }

			for (const file of files) {
				console.log(`${file.name}: ${file.size} bytes`);
			}
		}
	});

    function sendDoc() {
        console.log("sent Doc");
    }
    function showPop() {
        dialog.showModal();
    }
    function closePop() {
        dialog.close();
    }

</script>

<label for="lab">Upload lab results:</label>
<input accept="application/pdf" bind:files id="lab" name="lab" type="file" />

<button onclick={showPop}> Submit Lab </button>

<div class = "results">
    <dialog id="dresult" bind:this={dialog}>
        <button type="button" id="exit" onclick={() => {
            closePop();
        }}>X</button>
        <br>
        <div class="popup">
            <p>Is this the correct file {name}?</p>
            <button 
            onclick={() => { sendDoc(); closePop(); }}>
                Yes
            </button>
            <button onclick={closePop}>No</button>
        </div>
    </dialog>
</div>



