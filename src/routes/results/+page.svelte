<script>
    import logo from "$lib/assets/logo-transparent.png";
    import { writable } from 'svelte/store';
    import { get } from 'svelte/store'
    import { analysis } from '$lib/store.js';

    import { onMount } from 'svelte';

    let storedData = $analysis;

    onMount(() => {
        console.log("Analysis on results page:", storedData);
        storedData = { ...$analysis }; // Forces reactivity update
    });

	let files = $state();
    let dialog;
    let name = $state("");
    let output = $state($analysis.summary);
    let data = $state("Waiting for response...");
    const doc = new FormData();
    let route = "https://redclarity-398008200067.us-west2.run.app/gemini";

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

    async function sendDoc() {
        console.log("sent Doc");
        if (files && files.length > 0) {
            doc.append('file', files[0]);
        }
        const response = await fetch(route, { 
            method: 'POST',
            body: doc
        })
        data = await response.json();
        data = data["payload"];
        console.log(data);
        analysis.set({
            summary: data || "No summary available.",
            questions: data.questions || "No questions at this time."
        });
    }
    function showPop() {
        dialog.showModal();
    }
    function closePop() {
        dialog.close();
    }

    let rb;
    let qb;
    
    function resultsClicked() {
        rb.style.backgroundColor = "#C23B22";
        rb.style.color = "white";
        qb.style.backgroundColor = "white";
        qb.style.color = "black";
        output = $analysis.summary;
    }

    function questionsClicked() {
        rb.style.backgroundColor = "white";
        rb.style.color = "black";
        qb.style.backgroundColor = "#C23B22";
        qb.style.color = "white";
        output = $analysis.questions;
    }

</script>

<link href='https://fonts.googleapis.com/css?family=Fredoka' rel='stylesheet'>
<link href='https://fonts.googleapis.com/css?family=Reddit+Sans' rel='stylesheet'>

<div class="heading">
    <h1>RedClarity</h1>
    <img class="logo" alt="logo" src={logo} />
</div>

<button bind:this={rb} onclick={resultsClicked} class="results-button">Summary</button>

<button bind:this={qb} onclick={questionsClicked} class="questions-button">Questions</button>

<div class="dropdown">
    <select class="drop-button" id="Translate">
        <option value="0">English</option> 
        <option value="1">Spanish</option> 
        <option value="2">Vietnamese</option> 
    </select> 
    <!-- <div class="dropdown-content">
        <button bind:this={eb} onclick={englishClicked} class="english-button">English</button>
        <button bind:this={sp} onclick={spanishClicked} class="spanish-button">Spanish</button>
        <button bind:this={vb} onclick={vietnameseClicked} class="vietnamese-button">Vietnamese</button>
    </div> -->
</div>

<div class="main-text">
    <p>{output}</p>
</div>

<label for="lab" class="upload">Upload More Lab Results:</label>
<input accept="application/pdf" bind:files id="lab" name="lab" type="file" />

<button class="submit-button" onclick={showPop}> Submit Lab </button>
<a href="../" class="homePage">Home Page</a> 
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

    p {
        font-family: 'Reddit Sans';
        font-size: 20px;
        padding-left: 100px;
        padding-right: 100px;
    }

    .upload {
        font-family: 'Fredoka';
        font-size: 24px;
        padding-left: 100px;
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

    .results-button {
        background-color: #C23B22;
        color: white;
        font-family: 'Fredoka';
        font-size: 20px;
        border-radius: 10px;
        padding: 5px;
        margin-left: 100px;
        cursor: pointer;
    }

    .results-button:hover {
        background-color: #C23B22 !important;
        color: white !important;
        /* box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19); */
    }

    .questions-button {
        background-color: white;
        font-family: 'Fredoka';
        font-size: 20px;
        border-radius: 10px;
        padding: 5px;
        margin-left: 20px;
        cursor: pointer;
    }

    .questions-button:hover {
        background-color: #C23B22 !important;
        color: white !important;
        /* box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24),0 17px 50px 0 rgba(0,0,0,0.19); */
    }

    .main-text {
        background-color: white;
        border-style: solid;
        border-color: black;
        border-width: 3px;
        border-radius: 10px;
        margin: 20px 100px 20px 100px;
        padding: 20px 0px 20px 0px;
    }
    
    .dropdown {
        position: relative;
        float: right;
    }

    .drop-button {
        background-color: white;
        font-family: 'Fredoka';
        font-size: 20px;
        border-style: solid;
        border-radius: 10px;
        padding: 5px;
        margin-right: 100px;
        cursor: pointer;
    }

    .drop-button:hover {
        background-color: #C23B22 !important;
        color: white !important;
    }
    
    .dropdown:hover {
        display: block;
    }

    .homePage {
        text-decoration: none;
        color: black;
        background-color: white;
        font-family: 'Fredoka';
        font-size: 20px;
        border-radius: 10px;
        border: .1em solid black;
        padding: 5px;
        cursor: pointer;
        margin-left: 20px;
    }

    .homePage:hover {
        background-color: #C23B22;
        color: white;
    }
    
</style>