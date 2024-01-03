import API_KEYS from './config.js';

let myform = document.forms['myform'];

let userText = myform['userText'];
let tone = myform['tone'];
let text_result = document.getElementById('text-result');
let img1 = document.getElementById('img1');
let img2 = document.getElementById('img2');

const GPT_API_KEY = API_KEYS.gpt;
const DIF_API_KEY = API_KEYS.diffusion;

const getChatResponse = async (query_gpt) => {
    const API_URL = "https://api.openai.com/v1/completions";

    const gptRequestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GPT_API_KEY}`
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: query_gpt,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    };

    try {
        const request = await fetch(API_URL, gptRequestOptions);
        const response = await request.json();
        console.log(response);
        text_result.innerHTML = response.choices[0].text;
    } catch {
        console.log("Error processing request");
    }
}

const getImageResponse = async (query_dif) => {
    const API_URL = "https://stablediffusionapi.com/api/v3/text2img";

    const gptRequestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            key: DIF_API_KEY,
            prompt: query_dif,
            negative_prompt: null,
            width: "512",
            height: "512",
            samples: "2",
            num_inference_steps: "20",
            safety_checker: "no",
            enhance_prompt: "yes",
            seed: null,
            guidance_scale: 7.5,
            multi_lingual: "no",
            panorama: "no",
            self_attention: "no",
            upscale: "no",
            embeddings_model: null,
            webhook: null,
            track_id: null        
        })
    };

    try {
        const request = await fetch(API_URL, gptRequestOptions);
        const response = await request.json();
        console.log(response);
        img1.src = response.output[0];
        img2.src = response.output[1];
        document.getElementById('loader').classList.add('d-none');
    } catch {
        console.log("Error processing request");
    }
}

myform.addEventListener('submit', (e)=> {
    e.preventDefault();
    document.getElementById('loader').classList.remove('d-none');
    let msg_request = `Write a media-rich content on ${userText.value}
    and the tone of the output should be ${tone.value}`;

    let imgrequest = `${tone.value} ${userText.value}`;
    getChatResponse(msg_request);
    getImageResponse(imgrequest);
})