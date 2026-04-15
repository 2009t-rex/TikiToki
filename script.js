const container = document.getElementById("imgContainer");
const buttons = document.querySelectorAll(".container .doom-btn");
const buttonContainer = document.querySelector(".container");
const goBack = document.getElementById("goBack")
 
let currentSlide = null;
let nextSlide = null;
let isAnimating = false;
let startY = 0;
let initialized = false;
let currentCategory = "random";
 
const categoryMap = {
  "Różne zdjęcia": "random",
  "Kotki": "cats",
  "Pieski": "dogs",
  "Liski": "foxes",
  "Pająki": "spiders",
};
 
// 🌐 fetch image URL by category
async function fetchImageUrl() {
  switch (currentCategory) {
 
    case "dogs": {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await res.json();
      return data.message;
    }
 
    case "cats": {
      const res = await fetch("https://api.thecatapi.com/v1/images/search");
      const data = await res.json();
      return data[0].url;
    }
 
    case "foxes": {
      const res = await fetch("https://randomfox.ca/floof/");
      const data = await res.json();
      return data.image;
    }
 
case "spiders": {
  const res = await fetch("https://api.reddit.com/r/spiders");
  const data = await res.json();

  const posts = data.data.children;

  const images = posts
    .map(p => p.data)
    .filter(p => p.post_hint === "image" && !p.over_18)
    .map(p => p.url);

  if (!images.length) {
    return `https://picsum.photos/1080/1920?random=${Math.random()}`;
  }

  return images[Math.floor(Math.random() * images.length)];
}
 
    case "random":
    default:
      return `https://picsum.photos/1080/1920?random=${Math.random()}`;
  }
}
 
// 🔘 button listeners
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const label = btn.textContent.trim();
    currentCategory = categoryMap[label] || "random";
 
    if (label === "Różne zdjęcia") onRoznjeZdjecia();
    else if (label === "Kotki") onKotki();
    else if (label === "Pieski") onPieski();
    else if (label === "Liski") onLiski();
    else if (label === "Pająki") onPajaki();
  });
});
 
function showImageContainer() {
  buttonContainer.style.display = "none";
  container.style.display = "flex";
}
 
function onRoznjeZdjecia() {
  currentCategory = "random";
  showImageContainer();
  startOrSwitch();
}
 
function onKotki() {
  currentCategory = "cats";
  showImageContainer();
  startOrSwitch();
}
 
function onPieski() {
  currentCategory = "dogs";
  showImageContainer();
  startOrSwitch();
}
 
function onLiski() {
  currentCategory = "foxes";
  showImageContainer();
  startOrSwitch();
}
 
function onPajaki() {
  currentCategory = "spiders";
  showImageContainer();
  startOrSwitch();
}
 
// 🖼️ create a slide element
function createSlide(url) {
  const slide = document.createElement("div");
  slide.className = "slide";
  const img = document.createElement("img");
  img.src = url;
  slide.appendChild(img);
  return slide;
}
 
// 🚀 first call — place slide without animation
async function init() {
  initialized = true;
  const url = await fetchImageUrl();
  currentSlide = createSlide(url);
  currentSlide.style.transform = "translateY(0%)";
  container.appendChild(currentSlide);
}
 
// called by buttons — init on first use, animate on subsequent
function startOrSwitch() {
  if (!initialized) {
    init();
    return;
  }
  goNext();
}
 
// ➡️ forward only
async function goNext() {
  if (isAnimating || !initialized) return;
  isAnimating = true;
 
  const url = await fetchImageUrl();
  nextSlide = createSlide(url);
  nextSlide.style.transform = "translateY(100%)";
  container.appendChild(nextSlide);
 
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      currentSlide.style.transform = "translateY(-100%)";
      nextSlide.style.transform = "translateY(0%)";
 
      setTimeout(() => {
        container.removeChild(currentSlide);
        currentSlide = nextSlide;
        nextSlide = null;
        isAnimating = false;
      }, 400);
    });
  });
}
 
// 📱 swipe (touch)
window.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
});
 
window.addEventListener("touchend", (e) => {
  if (container.style.display === "none") return;
  const endY = e.changedTouches[0].clientY;
  if (startY - endY > 50) goNext();
});
 
// 🖱️ mouse drag (PC)
window.addEventListener("mousedown", (e) => {
  startY = e.clientY;
});
 
window.addEventListener("mouseup", (e) => {
  if (container.style.display === "none") return;
  if (startY - e.clientY > 50) goNext();
});
 
// 🖱️ scroll wheel (PC)
window.addEventListener("wheel", (e) => {
  if (container.style.display === "none") return;
  if (e.deltaY > 0) goNext();
}, { passive: true });

goBack.addEventListener("click", () => {
    initialized = false
    buttonContainer.style.display = "flex";
    container.style.display = "none";
    container.removeChild(currentSlide);
})