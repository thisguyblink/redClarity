<script>
    import logo from "$lib/assets/logo-transparent.png";
    import { writable } from 'svelte/store';
    import { persisted } from 'svelte-persisted-store'
    export const analysis = persisted('analysis', {
        summary: 'The summary goes here. ',
        questions: 'Questions go here???'
    });
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

<link href='https://fonts.googleapis.com/css?family=Fredoka' rel='stylesheet'>
<link href='https://fonts.googleapis.com/css?family=Reddit+Sans' rel='stylesheet'>

<div class="heading">
    <h1>RedClarity</h1>
    <img class="logo" alt="logo" src={logo} />
</div>

<h2>What is RedClarity?</h2>
<p>Ever gotten your blood test results and had no idea what they meant? 
    RedClarity is a website that scans your blood test results and summarizes 
    them into simpler terms.
</p>

<h2>How does it work?</h2>
<p>Just upload a PDF of your blood test results, and RedClarity will scan 
    through to convert the results into simpler terms.
</p>

<label for="lab" class="upload">Upload Lab Results:</label>
<input accept="application/pdf" bind:files id="lab" name="lab" type="file" />

<button class="submit-button" onclick={showPop}> Submit Lab </button>
<a href="/results" class="resultPage">Results Page</a> 

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

<style>
    :global(body){
        background: #D7ECFF;
    }

    h1 {
        font-family: 'Fredoka';
        font-size: 60px;
        text-align: right;
    }

    h2 {
        font-family: 'Fredoka';
        font-size: 30px;
        padding-left: 80px;
        padding-right: 80px;
    }

    p {
        font-family: 'Reddit Sans';
        font-size: 18px;
        padding-left: 80px;
        padding-right: 80px;
    }

    .upload {
        font-family: 'Fredoka';
        font-size: 20px;
        padding-left: 80px;
    }

    .submit-button {
        background-color: white;
        font-family: 'Fredoka';
        font-size: 20px;
        border-radius: 10px;
        padding: 5px;
        cursor: pointer;
    }

    .submit-button:hover {
        background-color: #C23B22;
        color: white;
    }

    .logo {
        width: 180px;
        height: 180px;
        float: left;
        margin: -30px;
    }

    .heading {
        display: grid;
        align-items: center; 
        grid-template-columns: 1fr .6fr;
    }

    .resultPage {
        text-decoration: none;
        color: black;
        background-color: white;
        font-family: 'Fredoka';
        font-size: 20px;
        border-radius: 10px;
        border: .1em solid black;
        padding: 5px;
        cursor: pointer;
    }
    .resultPage:hover {
        background-color: green;
        color: white;
    }
</style>