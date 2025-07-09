const sellWalletAddress = document.getElementById("sellWalletAddress");

function openSellModal() {
  hideAllModals();
  document.getElementById("sellModal").classList.remove("hidden");
  sellWalletAddress.textContent = connectedAccount || "-";
}

function closeSellModal() {
  document.getElementById("sellModal").classList.add("hidden");
}

// Optional: expose globally
window.openSellModal = openSellModal;
window.closeSellModal = closeSellModal;
