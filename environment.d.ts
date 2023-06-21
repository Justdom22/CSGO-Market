declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PRICE_MARKUP: number;
      BASE_FETCH_URL: string;
      PAYMENT_API_URL: string;
      PAYMENT_API_KEY: string;
    }
  }
}

export {};
