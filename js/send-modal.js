let ethUsdRate = 0;

const buyModal = document.getElementById("buyModal");
const closeBuyModal = document.getElementById("closeBuyModal");
const buyWalletAddress = document.getElementById("buyWalletAddress");
const buyNetwork = document.getElementById("buyNetwork");
const buyWalletBalance = document.getElementById("buyWalletBalance");
const ethBuyAmount = document.getElementById("ethBuyAmount");
const usdBuyEstimate = document.getElementById("usdBuyEstimate");
const toAddressInput = document.getElementById("toAddressInput");
const buySubmitBtn = document.getElementById("buySubmitBtn");

// Fetch ETH/USD conversion rate
async function fetchEthUsdRate() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum');
    const data = await res.json();
    ethUsdRate = data.ethereum.usd;
  } catch (e) {
    console.error("Failed to fetch ETH price", e);
  }
}

// Populate modal with wallet info
async function updateBuyModalInfo() {
  try {
    await fetchEthUsdRate();

    if (!window.ethereum) {
      showBottomMessage("MetaMask not found.", "error");
      return;
    }

    if (!signer || !provider) {
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();
      connectedAccount = await signer.getAddress();
    }

    const network = await provider.getNetwork();
    const balanceBigInt = await provider.getBalance(connectedAccount);
    const ethBalance = ethers.formatEther(balanceBigInt);

    buyWalletAddress.textContent = connectedAccount;
    buyNetwork.textContent = `${network.name} (Chain ID: ${network.chainId})`;
    buyWalletBalance.textContent = `${parseFloat(ethBalance).toFixed(4)} ETH`;
  } catch (err) {
    console.error("Error loading wallet info", err);
    showBottomMessage("Unable to load wallet information.", "error");
  }
}

// ETH input → live USD update
ethBuyAmount.addEventListener("input", () => {
  const ethValue = parseFloat(ethBuyAmount.value || "0");
  usdBuyEstimate.textContent = isNaN(ethValue)
    ? "$0.00"
    : `$${(ethValue * ethUsdRate).toFixed(2)}`;
});

// Send ETH
buySubmitBtn.addEventListener("click", async () => {
  const amount = parseFloat(ethBuyAmount.value);
  const to = toAddressInput.value.trim();

  if (!amount || amount <= 0 || !ethers.isAddress(to)) {
    return showBottomMessage("Please enter a valid ETH amount and a valid address.", "error");
  }

  try {
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amount.toString()),
    });

    showBottomMessage(`Transaction sent! Hash:\n${tx.hash}`, "success");
  } catch (err) {
    console.error("Transaction failed", err);
    showBottomMessage("Transaction failed: " + err.message, "error");
  }
});

// Modal show/hide
function openBuyModal() {
  hideAllModals(); 
  buyModal.classList.remove("hidden");
  updateBuyModalInfo();
}

closeBuyModal.addEventListener("click", () => {
  buyModal.classList.add("hidden");
});
