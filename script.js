document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".about-title h1");
    const text = title.textContent;
    title.textContent = "";
  
    text.split("").forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.animation = `fade 0.5s ease ${index / 10}s forwards`;
      title.appendChild(span);
    });
  });
  