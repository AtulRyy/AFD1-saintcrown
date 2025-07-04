let connectedAccount = null;
let provider = null;
let signer = null;
let isWalletConnected = false;

document.addEventListener("DOMContentLoaded", function () {
  const walletButton = document.getElementById("walletButton");
  const noMetamask = document.getElementById("noMetamask");
  const subtitle = document.querySelector(".wallet-subtitle");
  const subCont = document.getElementById("subtitle-container");

  if (!window.ethereum || !window.ethereum.isMetaMask) {
    walletButton.style.display = "none";
    noMetamask.style.display = "flex";
    subCont.style.display = "block";
    subtitle.style.display = "none";
    detectBrowserAndSetDownloadLink();
    return;
  }

  window.connectWallet = async function connectWallet() {
    if (isWalletConnected) {
      disconnectWallet();
      return;
    }

    try {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      connectedAccount = await signer.getAddress();
      const balanceBigInt = await provider.getBalance(connectedAccount);
      const balance = ethers.formatEther(balanceBigInt);
      const network = await provider.getNetwork();

      document.getElementById("walletAddress").innerText =
        connectedAccount.slice(0, 6) + "..." + connectedAccount.slice(-4);
      document.getElementById("walletBalance").innerText = balance + " ETH";
      document.getElementById("walletChainId").innerText = network.chainId;
      document.getElementById("walletNetwork").innerText = network.name;
      document.getElementById("walletStatusText").innerText =
        "Connected to: " + network.name;
      document.getElementById("walletStatusDot").classList.add("active");

      const btn = document.getElementById("walletButton");
      btn.innerText = "Disconnect Wallet";
      btn.style.backgroundColor = "red";

      isWalletConnected = true;
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Failed to connect wallet.");
    }
  };
});

function disconnectWallet() {
  document.getElementById("walletAddress").innerText = "-";
  document.getElementById("walletBalance").innerText = "-";
  document.getElementById("walletChainId").innerText = "-";
  document.getElementById("walletNetwork").innerText = "-";
  document.getElementById("walletStatusText").innerText = "Disconnected";
  document.getElementById("walletStatusDot").classList.remove("active");

  const btn = document.getElementById("walletButton");
  btn.innerText = "Connect Wallet";
  btn.style.backgroundColor = "";

  isWalletConnected = false;
}

function detectBrowserAndSetDownloadLink() {
  const link = document.getElementById("metamaskDownloadLink");
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("firefox")) {
    link.href = "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/";
  } else {
    link.href = "https://chrome.google.com/webstore/detail/metamask/";
  }
}
