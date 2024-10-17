import { Currency } from 'src/currency/currency.schema';

export function getPercentValue(rootValue: number, percent: number): number {
  const ans = (rootValue * percent) / 100;
  return parseFloat(ans.toFixed(8));
}

export function convertTOUSD(value: number, currency: Currency) {
  const ans = value * currency.valueInUSD;
  return parseFloat(ans.toFixed(8));
}

export function convertToProvidedCurrency(
  value: number,
  from: Currency,
  to: Currency,
) {
  const usdValue = convertTOUSD(value, from);
  const ans = usdValue / to.valueInUSD;
  return parseFloat(ans.toFixed(8));
}
