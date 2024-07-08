document.addEventListener('DOMContentLoaded', function() {
    const button = document.querySelector(".button");
    const circle = document.querySelector(".circle");
    let buttonOn = false;
    const contrastSlider = document.getElementById('contrast-slider');
    const saturationSlider = document.getElementById('saturation-slider');
    const grayscaleSlider = document.getElementById('grayscale-slider');
    const contrastValue = document.getElementById('contrast-value');
    const saturationValue = document.getElementById('saturation-value');
    const grayscaleValue = document.getElementById('grayscale-value');
  
    button.addEventListener("click", async () => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!buttonOn) {
        buttonOn = true;
        button.style.animation = "transformToBlue 1s ease-in-out 0s forwards";
        circle.style.animation = "moveCircleRight 1s ease-in-out 0s forwards";
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['appOn.js']
        });
      } else {
        buttonOn = false;
        button.style.animation = "transformToYellow 1s ease-in-out 0s forwards";
        circle.style.animation = "moveCircleLeft 1s ease-in-out 0s forwards";
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['appOff.js']
        });
      }
    });
  
    const updateFilters = async () => {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const contrast = contrastSlider.value;
      const saturation = saturationSlider.value;
      const grayscale = grayscaleSlider.value;
  
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (contrast, saturation, grayscale) => {
          document.querySelector("html").style.filter = `
            contrast(${contrast}%)
            saturate(${saturation}%)
            grayscale(${grayscale}%)
          `;
        },
        args: [contrast, saturation, grayscale]
      });
  
      contrastValue.textContent = contrast;
      saturationValue.textContent = saturation;
      grayscaleValue.textContent = grayscale;
    };
  
    contrastSlider.addEventListener('input', updateFilters);
    saturationSlider.addEventListener('input', updateFilters);
    grayscaleSlider.addEventListener('input', updateFilters);
  
    const applyDarkMode = () => {
      document.body.classList.add('dark-mode');
    };
  
    const applyLightMode = () => {
      document.body.classList.remove('dark-mode');
    };
  
    button.addEventListener("click", () => {
      if (buttonOn) {
        applyDarkMode();
      } else {
        applyLightMode();
      }
    });
  
    if (buttonOn) {
      applyDarkMode();
    } else {
      applyLightMode();
    }
  
    document.getElementById('default-button').addEventListener('click', () => {
      contrastSlider.value = 100;
      saturationSlider.value = 100;
      grayscaleSlider.value = 0;
      updateFilters();
    });
  });
  