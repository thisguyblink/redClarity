<script>
    import logo from "$lib/assets/logo-transparent.png";
    import { writable } from 'svelte/store';
    import { get } from 'svelte/store'
    import { analysis } from '$lib/store.js';
    import { onMount } from 'svelte';
    import { marked } from 'marked';

    let storedData = $analysis;
    let resultsHtml = "";
    let questionsHtml = "";
    console.log("data", storedData);

    let lang = 0;
    let sumViet = $state("");
    let sumSpan = $state("");
    let quesSpan = $state("");
    let quesViet = $state("");
    let files = $state();
    let dialog;
    let name = $state("");
    let output = $state($analysis.summary);
    let isShowingSummary = $state(true);
    let sum, ques;
    
    const doc = new FormData();
    let route = "https://redclarity-398008200067.us-west2.run.app/gemini";
    let routeSpan = "https://redclarity-398008200067.us-west2.run.app/spanish";
    let routeViet = "https://redclarity-398008200067.us-west2.run.app/vietnamese";
    
    onMount(() => {
        console.log("Analysis on results page:", storedData);
        storedData = { ...$analysis };
        resultsClicked();
    });

    $effect(() => {
        if (files) {
            console.log(files);

            if (name === "" && files.length > 0 && files[0]) {
                name = files[0].name;
            }

            for (const file of files) {
                console.log(`${file.name}: ${file.size} bytes`);
            }
        }
    });

    $effect(async () => {
        await updateOutput();
    });

    async function updateOutput() {
    console.log("Updating output with language:", lang);
    
    if (isShowingSummary) {
        // Separate check to see if the summaries are showing or not
        if (lang === 0) {
            output = $analysis.summary;
        } else if (lang === 1) {
            if (!sumSpan) await toSpan(true);
            output = sumSpan || "Spanish summary not available.";
        } else if (lang === 2) {
            if (!sumViet) await toViet(true);
            output = sumViet || "Vietnamese summary not available.";
        }
    } else {
        // View for the questions side of things
        if (lang === 0) {
            output = $analysis.questions;
        } else if (lang === 1) {
            if (!quesSpan) await toSpan(false);
            output = quesSpan || "Spanish questions not available.";
        } else if (lang === 2) {
            if (!quesViet) await toViet(false);
            output = quesViet || "Vietnamese questions not available.";
        }
    }
}


    async function toSpan(isSummary) {
        let input = isSummary ? $analysis.summary : $analysis.questions;
        console.log(input);
        const response = await fetch(routeSpan, { 
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json'
             },
            body: JSON.stringify({ text: input })
        });
        const out = await response.json();
        
        if (isSummary) {
            sumSpan = out['translated_text'];
            console.log("Spanish Summary:", sumSpan);
        } else {
            quesSpan = out['translated_text'];
            console.log("Spanish Questions:", quesSpan);
        }
    }

    async function toViet(isSummary) {
        let input = isSummary ? $analysis.summary : $analysis.questions;
        console.log(input);
        const response = await fetch(routeViet, { 
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json'
             },
            body: JSON.stringify({ text: input })
        });
        const out = await response.json();
        
        if (isSummary) {
            sumViet = out['translated_text'];
            console.log("Vietnamese Summary:", sumViet);
        } else {
            quesViet = out['translated_text'];
            console.log("Vietnamese Questions:", quesViet);
        }
    }

    async function sendDoc() {
        console.log("sent Doc");
        if (files && files.length > 0) {
            doc.append('file', files[0]);
        }
        const response = await fetch(route, { 
            method: 'POST',
            body: doc
        });
        const data = await response.json();
        sum = data["payload"];
        ques = data["questions"];
        console.log(data);
        analysis.set({
            summary: sum || "No summary available.",
            questions: ques || "No questions at this time."
        });
        
        // Clear translations when uploading a new document
        sumSpan = "";
        quesSpan = "";
        sumViet = "";
        quesViet = "";
        
        await updateOutput();
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
        isShowingSummary = true;
        rb.style.backgroundColor = "#C23B22";
        rb.style.color = "white";
        qb.style.backgroundColor = "white";
        qb.style.color = "black";
        updateOutput();
    }

    function questionsClicked() {
        isShowingSummary = false;
        rb.style.backgroundColor = "white";
        rb.style.color = "black";
        qb.style.backgroundColor = "#C23B22";
        qb.style.color = "white";
        updateOutput();
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
    <select class="drop-button" id="Translate" bind:value={lang}>
        <option value={0}>English</option> 
        <option value={1}>Spanish</option> 
        <option value={2}>Vietnamese</option> 
    </select>
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