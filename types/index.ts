export type Filter = {
  id: string;
  items?: Filter[];
  name: string;
  order: number;
  type: string;
  value?: string;
  open: boolean;
  plural?: string;
};

export type ShortFilter = {
  id: string;
  min?: number;
  max?: number;
  items?: ShortFilter[];
};

export type QualityExtension = {
  title: string;
  subtitle: string;
};

export type ItemDescription = {
  type: string;
  value: string;
};

export type PriceHistory = {
  price: number;
  time: number;
};

export type CartItem = {
  market_hash_name: string;
};

export type Item = {
  market_hash_name: string;
  market_name: string;
  descriptions?: ItemDescription[];

  ctp: number;
  price: number;

  slot?: string;
  rarity?: string;
  quality?: string;
  quality_ext?: QualityExtension;
  popularity?: number;

  image_512?: string;
  image_300?: string;
  image_150?: string;
};

export type Payment = {
  paymentType: "DEPOSIT" | "REFUND";
  paymentMethod: PaymentMethod;

  currency: "EUR" | "USD";
  amount: number;
};

export type PaymentRequest = {
  returnUrl?: string;
  webhookUrl?: string;
} & Payment;

export type PaymentResponse = {
  status: number;
  result: {
    id: string;
    state: "COMPLETED" | "PENDING";
    redirectUrl: string;
  } & Payment;
};

export enum PaymentMethod {
  "BASIC_CARD" = "BANK CARD",
}
