<script>
    import logo from "$lib/assets/logo-transparent.png";
    import { writable } from 'svelte/store';
    import { get } from 'svelte/store'

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

    let rb;
    let qb;
    
    function resultsClicked() {
        rb.style.backgroundColor = "#C23B22";
        rb.style.color = "white";
        qb.style.backgroundColor = "white";
        qb.style.color = "black";
    }

    function questionsClicked() {
        rb.style.backgroundColor = "white";
        rb.style.color = "black";
        qb.style.backgroundColor = "#C23B22";
        qb.style.color = "white";
    }

</script>

<link href='https://fonts.googleapis.com/css?family=Fredoka' rel='stylesheet'>
<link href='https://fonts.googleapis.com/css?family=Reddit+Sans' rel='stylesheet'>

<div class="heading">
    <h1>RedClarity</h1>
    <img class="logo" alt="logo" src={logo} />
</div>

<button bind:this={rb} onclick={resultsClicked} class="results-button">Results</button>

<button bind:this={qb} onclick={questionsClicked} class="questions-button">Questions</button>

<div class="dropdown">
    <button class="drop-button">Dropdown</button>
    <div class="dropdown-content">
        <div class="dropdown-content-individual">English</div>
        <div class="dropdown-content-individual">Spanish</div>
        <div class="dropdown-content-individual">Vietnamese</div>
    </div>
</div>

<div class="main-text">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
        ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <p>
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
        nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
        deserunt mollit anim id est laborum.
    </p>
</div>

<label for="lab" class="upload">Upload More Lab Results:</label>
<input accept="application/pdf" bind:files id="lab" name="lab" type="file" />

<button class="submit-button" onclick={showPop}> Submit Lab </button>

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

<a href="../">Home Page</a> 

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
        font-size: 20px;
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

    .dropdown-content {
        display: none;
        position: absolute;
        left: 0;
        background-color: white;
        width: 150px;
        padding: 5px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
        font-family: 'Fredoka';
        font-size: 20px;
    }
    
    .dropdown:hover .dropdown-content {
        display: block;
    }

    .dropdown-content-individual {
        padding: 10px;
    }
    
</style>