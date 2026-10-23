function calculateMortgagePlan(priceNGN, downPaymentPercent, tenureYears) {
  const deposit = priceNGN * (downPaymentPercent / 100);
  const principal = priceNGN - deposit;
  const annualInterest = 0.18; // 18% p.a. structured rate
  const monthlyRate = annualInterest / 12;
  const months = tenureYears * 12;

  const monthlyPayment =
    principal > 0
      ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
      : 0;

  return {
    deposit: Math.round(deposit),
    monthlyPayment: Math.round(monthlyPayment)
  };
}