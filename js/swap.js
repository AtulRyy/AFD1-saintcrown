const swapBtn = document.getElementById('swapBtn');
const swapAmountInput = document.getElementById('swapAmount');
const swapToTokenInput = document.getElementById('swapToToken');

async function performSwap() {
  if (!connectedAccount) {
    return showBottomMessage("Wallet not connected", "error");
  }
  const buyToken = swapToTokenInput.value.trim();
  if (!buyToken) return showBottomMessage("Enter a token symbol or address (e.g., DAI)", "error");

  const sellAmount = parseFloat(swapAmountInput.value);
  if (!sellAmount || sellAmount <= 0) return showBottomMessage("Enter a valid ETH amount", "error");

  const sellAmountWei = ethers.parseEther(sellAmount.toString());

  try {
    // Call your backend proxy
    const params = new URLSearchParams({
      buyToken,
      sellToken: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // ETH
      sellAmount: sellAmountWei.toString(),
      taker: connectedAccount,
    });

    const res = await fetch(`${window.BASE_URL}/swap-quote?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch swap quote from server");

    const quote = await res.json();

    // Construct transaction object
    const txParams = {
    from: connectedAccount, // ✅ set manually
    to: quote.transaction.to,
    data: quote.transaction.data,
    value: quote.transaction.value,
    gas: quote.transaction.gas,
    gasPrice: quote.transaction.gasPrice,
    };
    // console.log("value sent (ETH):", ethers.formatEther(txParams.value));
    // console.log("gas (units):", txParams.gas);
    // console.log("gasPrice (gwei):", ethers.formatUnits(txParams.gasPrice, 'gwei'));
    console.log(txParams);
    

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [txParams],
    });

    showBottomMessage(`Swap executed!\nTx Hash: ${txHash}`, "success");
    closeSwapModal();
  } catch (e) {
    console.error("Swap failed", e);
    showBottomMessage("Swap failed:\n" + (e.message || e), "error");
  }
}

swapBtn.addEventListener('click', performSwap);

// Modal controls
function openSwapModal() {
  hideAllModals();
  document.getElementById("swapModal").classList.remove("hidden");
  document.getElementById("swapWalletAddress").textContent = connectedAccount || '-';
}

function closeSwapModal() {
  document.getElementById("swapModal").classList.add("hidden");
}
