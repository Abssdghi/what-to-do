async function duckduckgo(term) {

const response = await fetch("https://proxy.corsfix.com/?https://serpapi.com/search.json?q=miagoth");        
const html = await response.text();

console.log(html);

const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');

const images = doc.getElementsByTagName('img');

const imageList = [];
for (let img of images) {
    imageList.push({
        src: img.src,
        alt: img.alt || 'none',
    });
}

console.log(imageList);

}

duckduckgo('term');