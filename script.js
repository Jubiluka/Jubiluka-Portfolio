document.getElementById("colorButton").addEventListener("click", () => {
  const colors = ["#fce4ec", "#f3e5f5", "#e3f2fd", "#e8f5e9", "#fff3e0"];
  const random = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.backgroundColor = random;
});