const currencyFormatter = (currency, amount) => {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);

  return formattedAmount;
};

export default currencyFormatter;
