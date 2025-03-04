type OrderType =
  | "spot"
  | "margin"
  | "future"
  | "swap"
  | "option"
  | "contract"
  | null;

type availability = {
  exchange: string;
  orderType: OrderType;
  token: string;
  orientation: string;
  entryPrice: number[];
  takeProfit: number[];
  stopLoss: number[];
};

export type { availability, OrderType };
