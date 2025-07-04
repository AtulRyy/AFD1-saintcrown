
  

  // Open modal
  document.addEventListener("DOMContentLoaded", function () {
    
  const buyButton = document.getElementById("openBuyEthModal");

  if (buyButton) {
    buyButton.addEventListener("click", async () => {
      if (!window.ethereum) return alert("MetaMask not found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      connectedAccount = await signer.getAddress();

      document.getElementById("buyEthWalletAddress").value = connectedAccount;
      document.getElementById("buyEthModal").classList.remove("hidden");
    });
  }
});


  // Close modal
  document.getElementById("closeBuyEthModal").addEventListener("click", () => {
    document.getElementById("buyEthModal").classList.add("hidden");
  });

  // Launch Transak
  document.addEventListener("DOMContentLoaded", () => {
    const confirmBtn = document.getElementById("confirmBuyEth");

    confirmBtn.addEventListener("click", async () => {
      const amountUSD = parseFloat(document.getElementById("buyEthAmount").value);
      if (!amountUSD || amountUSD < 10) {
        return alert("Minimum amount is $10");
      }

      if (!window.ethereum) return alert("MetaMask not found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const connectedAccount = await signer.getAddress();

      const transak = new TransakSDK.default({
        apiKey: "4cad3cd4-a80b-4df9-8caa-2a7653ef2270", // ✅ Your API Key
        environment: "STAGING", // or "PRODUCTION"
        fiatCurrency: "USD",
        fiatAmount: amountUSD.toString(),
        cryptoCurrency: "ETH",
        walletAddress: connectedAccount,
        network: "ethereum",
        disableWalletAddressForm: true, // ✅ Prevents user from editing wallet
        themeColor: "000000",
        widgetHeight: "550px",
        widgetWidth: "450px"
      });

      transak.init();

      transak.on(transak.ALL_EVENTS, (data) => {
        console.log("[Transak Event]", data);
      });

      transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
        console.log("Transak widget closed.");
        transak.close();
      });

      transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log("Transaction successful:", orderData);
        alert("Your ETH purchase was successful!");
        transak.close();
      });
    });
  });