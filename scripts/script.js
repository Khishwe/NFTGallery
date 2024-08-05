/*
{
  "p": "brc69",
  "op": "compile",
  "s": "aeons"
}
*/

// EDIT
const collectionJsonUrl = 'collection.json';//'/content/<deploy inscription id>';
const imageRendering = 'auto' // or pixelated
const renderSize = { width: 3508, height: 3508 }; // select image render size

async function loadImage (url) {
    return new Promise((resolve, reject) => {
        const image = document.createElement('img')
        image.src = url
        image.crossOrigin = 'anonymous'
        image.onload = () => {
            resolve(image)
        }
        image.onerror = () => {
            // Some display fallbacks for when the image fails to load
            if (!image.src.startsWith('https://')) {
                image.src = 'https://ordinals.com' + url
            } else if (image.src.startsWith('https://ordinals.com')) {
                image.src = 'https://ord-mirror.magiceden.dev' + url
            }
        }
    })
}

async function renderImage(imageEl, urls, operations, order) {
    const canvas = document.createElement('canvas');
    canvas.width = renderSize.width;    
    canvas.height = renderSize.height;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const images = await Promise.all((urls).map(loadImage))

    order.forEach(i => {
        ctx.globalCompositeOperation = operations[i];
        ctx.drawImage(images[i], 0, 0, canvas.width, canvas.height);
    });

    imageEl.src = canvas.toDataURL("image/png")
}

async function getAllTraits(traitsUrl, retry = false) {
    try {
        const collectionMetadataRes = await fetch(traitsUrl)
        return await collectionMetadataRes.json()
    } catch (e) {
        if (!retry) {
            const timestamp = Math.floor(Date.now() / (60000 * 10)) // 10 minutes
            const newTraitsUrl = `${traitsUrl}?timestamp=${timestamp}`
            return getAllTraits(newTraitsUrl, true)
        }
        throw e
    }
}

function createInitialImage () {
    // Manipulate the <body> tag
    document.body.style.margin = '0px';
    document.body.style.padding = '0px';

    // Create and set properties of the <img> tag
    const img = document.createElement('img');
    img.id = 'img';
    img.style.height = '100%';
    img.style.width = '100%';
    img.style.objectFit = 'contain';
    img.style.imageRendering = imageRendering;

    return img
}

async function createInscriptionHtml() {
    const imageEl = createInitialImage()

    try {
        // Get traits
        const allTraits = await getAllTraits(collectionJsonUrl)

        // Process traits
        const ac = document.querySelector('script[c]');
        const at = document.querySelector('script[t]');
        const ao = document.querySelector('script[o]');

        const c = ac.getAttribute('c');
        const conf = allTraits.configurations[c];

        const selectedTraitIndexes = at.getAttribute('t').split(',');
        const traits = [];
        
        for(let i in selectedTraitIndexes) {
        	let v = selectedTraitIndexes[i];
            traits.push("../traits/" + (v != -1 ? conf.categories[i].traits[v].id : "empty.png"));
        }
        
        let selectedTraitOrders = [];
        
        switch (c) {
			case "0":
			case "1":
		        selectedTraitOrders = ao ? ao.getAttribute('o').split(',') : [0, 18, 1, 3, 4, 15, 8, 13, 9, 10, 11, 5, 14, 12, 17, 6, 7, 16, 2];
				break;
			case "2":
			case "3":
		        selectedTraitOrders = ao ? ao.getAttribute('o').split(',') : [0, 17, 1, 3, 4, 14, 7, 16, 13, 11, 5, 8, 9, 10, 12, 2, 15, 6];
				break;
		}
        
        while (selectedTraitOrders.length < allTraits.length) {
            selectedTraitOrders.push(selectedTraitOrders.length);
        }

        const operations = conf.categories.map((v, i) => conf.categories[i].operation);

        // Render traits
        await renderImage(imageEl, traits, operations, selectedTraitOrders);
    } catch (e) {
        console.error(e)
    } finally {
        // Append the <img> tag to the <body>
        document.body.appendChild(imageEl);
    }
}

window.onload = function() {
    createInscriptionHtml();
}