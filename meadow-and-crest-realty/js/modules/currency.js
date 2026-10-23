let currentCurrency = localStorage.getItem("mc_currency") || "NGN";

function toggleCurrencyState() {
  currentCurrency = currentCurrency === "NGN" ? "USD" : "NGN";
  localStorage.setItem("mc_currency", currentCurrency);
  return currentCurrency;
}

function formatPrice(priceNGN, period = "") {
  if (currentCurrency === "NGN") {
    let formatted;
    if (priceNGN >= 1000000000) {
      formatted = `₦${(priceNGN / 1000000000).toFixed(2).replace(/\.00$/, "")}B`;
    } else if (priceNGN >= 1000000) {
      formatted = `₦${(priceNGN / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    } else {
      formatted = `₦${priceNGN.toLocaleString()}`;
    }
    return period ? `${formatted} <span class="text-xs font-normal opacity-80">${period}</span>` : formatted;
  } else {
    const usd = Math.round(priceNGN / EXCHANGE_RATE);
    const formatted = `$${usd.toLocaleString()}`;
    return period ? `${formatted} <span class="text-xs font-normal opacity-80">${period}</span>` : formatted;
  }
}

function formatFullPrice(priceNGN) {
  if (currentCurrency === "NGN") {
    return "₦" + priceNGN.toLocaleString();
  } else {
    return "$" + Math.round(priceNGN / EXCHANGE_RATE).toLocaleString();
  }
}