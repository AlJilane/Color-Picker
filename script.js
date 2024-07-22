// Initial references to HTML elements
const pickColor = document.getElementById("pick-color");
const error = document.getElementById("error");
const fileInput = document.getElementById("file");
const image = document.getElementById("image");
const hexValRef = document.getElementById("hex-val-ref");
const rgbValRef = document.getElementById("rgb-val-ref");
const customAlert = document.getElementById("custom-alert");
const pickedColorRef = document.getElementById("picked-color-ref");
const result = document.getElementById("result");
let eyeDropper;

// Function to run when the window loads
window.onload = () => {
  // Check if the browser supports the EyeDropper API
  if ("EyeDropper" in window) {
    pickColor.classList.remove("hide");
    eyeDropper = new EyeDropper();
  } else {
    error.classList.remove("hide");
    error.innerText = "Your browser doesn't support the Eyedropper API.";
    pickColor.classList.add("hide");
  }
};

// Function to handle color selection using EyeDropper
const colorSelector = async () => {
  try {
    const color = await eyeDropper.open();
    error.classList.add("hide");

    // Get the hex color code
    const hexValue = color.sRGBHex;

    // Convert hex color to RGB
    const rgbArr = [];
    for (let i = 1; i < hexValue.length; i += 2) {
      rgbArr.push(parseInt(hexValue[i] + hexValue[i + 1], 16));
    }
    const rgbValue = `rgb(${rgbArr.join(", ")})`;

    // Display color results
    result.style.display = "grid";
    hexValRef.value = hexValue;
    rgbValRef.value = rgbValue;
    pickedColorRef.style.backgroundColor = hexValue;
  } catch (err) {
    error.classList.remove("hide");

    // Handle error if user closes the EyeDropper tool
    if (err.toString().includes("AbortError")) {
      error.innerText = "";
    } else {
      error.innerText = err;
    }
  }
};

// Event listener for the color pick button
pickColor.addEventListener("click", colorSelector);

// Handle image file upload
fileInput.onchange = () => {
  result.style.display = "none";

  // Read the uploaded file
  const reader = new FileReader();
  reader.readAsDataURL(fileInput.files[0]);
  reader.onload = () => {
    image.setAttribute("src", reader.result);
  };
};

// Function to copy color codes to clipboard
const copy = (textId) => {
  // Select and copy the text
  document.getElementById(textId).select();
  document.execCommand("copy");

  // Show custom alert for copied text
  customAlert.style.transform = "scale(1)";
  setTimeout(() => {
    customAlert.style.transform = "scale(0)";
  }, 2000);
};
