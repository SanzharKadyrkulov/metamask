export const formatBalance = (rawBalance: any) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatToWei = (amount: any) => {
  const weiAmount = amount * 1000000000000000000;
  return "0x" + weiAmount.toString(16);
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};
