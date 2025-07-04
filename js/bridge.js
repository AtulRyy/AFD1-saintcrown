const bridgeBtn = document.getElementById('bridgeNowBtn');
const bridgeTokenSymbolInput = document.getElementById('bridgeTokenSymbol');
const bridgeAmountInput = document.getElementById('bridgeAmount');
const fromChainInput = document.getElementById('fromChain');
const toChainInput = document.getElementById('toChain');

const chainIdMap = {
  ethereum: "1",
  polygon: "137",
  arbitrum: "42161",
  bsc: "56",
};

async function performBridge() {
  const wallet = connectedAccount;
  if (!wallet) return alert("⚠️ Wallet not connected");

  const tokenSymbol = bridgeTokenSymbolInput.value.trim().toUpperCase();
  const amount = parseFloat(bridgeAmountInput.value);
  const fromChainKey = fromChainInput.value.trim().toLowerCase();
  const toChainKey = toChainInput.value.trim().toLowerCase();

  if (!tokenSymbol || !amount || !fromChainKey || !toChainKey) {
    return alert("⚠️ Fill all fields");
  }

  const fromChain = chainIdMap[fromChainKey];
  const toChain = chainIdMap[toChainKey];

  if (!fromChain || !toChain) {
    return alert("❌ Unsupported chain selected.");
  }

  try {
    // Fetch tokens for both source and destination chains
    const [fromTokensRes, toTokensRes] = await Promise.all([
      fetch(`https://li.quest/v1/tokens?chain=${fromChainKey}`),
      fetch(`https://li.quest/v1/tokens?chain=${toChainKey}`)
    ]);

    const fromTokensData = await fromTokensRes.json();
    const toTokensData = await toTokensRes.json();

    const fromTokenList = fromTokensData.tokens?.[fromChain] || [];
    const toTokenList = toTokensData.tokens?.[toChain] || [];

    const fromToken = fromTokenList.find(t => t.symbol?.toUpperCase() === tokenSymbol);
    const toToken = toTokenList.find(t => t.symbol?.toUpperCase() === tokenSymbol);

    if (!fromToken || !toToken) {
      return alert(`❌ ${tokenSymbol} not supported on both chains.`);
    }

    const amountInWei = BigInt(amount * (10 ** fromToken.decimals)).toString();

    // Build quote request
    const quoteParams = new URLSearchParams({
      fromChain,
      toChain,
      fromToken: fromToken.address,
      toToken: toToken.address,
      fromAddress: wallet,
      toAddress: wallet,
      fromAmount: amountInWei,
      integrator: 'your-dapp-name',
      slippage: '1.0',
    });

    const quoteRes = await fetch(`https://li.quest/v1/quote?${quoteParams.toString()}`);
    const quoteData = await quoteRes.json();

    if (!quoteRes.ok) {
      throw new Error(quoteData.message || "Failed to get bridge quote");
    }

    // Send transaction via Metamask
    const tx = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [quoteData.transactionRequest],
    });

    alert(`✅ Bridge started! Tx hash:\n${tx}`);
    closeBridgeModal();
  } catch (err) {
    console.error("Bridge error:", err);
    alert("❌ Bridge failed:\n" + (err.message || err));
  }
}

bridgeBtn.addEventListener('click', performBridge);

// Modal helpers
function openBridgeModal() {
  document.getElementById("bridgeModal").classList.remove("hidden");
  document.getElementById("bridgeWalletAddress").textContent = connectedAccount || '-';
}

function closeBridgeModal() {
  document.getElementById("bridgeModal").classList.add("hidden");
}

window.openBridgeModal = openBridgeModal;
window.closeBridgeModal = closeBridgeModal;
