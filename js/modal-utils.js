// modal-utils.js

function hideAllModals() {
    const modalIds = [
      "buyModal",
      "buyEthModal",
      "swapModal",
      "sellModal",
      "bridgeModal"
    ];
  
    modalIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add("hidden");
    });
  }
  
  // Make it available globally
  window.hideAllModals = hideAllModals;
  

  function showBottomMessage(message, type = 'success', duration = 4000) {
    const box = document.getElementById("bottomMessageBox");
    const textSpan = document.getElementById("bottomMessageText");
  
    const validType = type === 'success' ? 'message-success' : 'message-error';
    box.className = `message-box ${validType} fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50`;
  
    textSpan.textContent = message;
  
    box.classList.remove("hidden");
  
    // Optional: auto-hide
    // setTimeout(() => {
    //   box.classList.add("hidden");
    // }, duration);
  }
  
  function hideBottomMessage() {
    document.getElementById("bottomMessageBox").classList.add("hidden");
  }
  
  
  
