export class FetchCoinsDataError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'FetchCoinsDataError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchCoinsDataError);
    }
  }
}

export class FetchCoinStatsError extends Error {
  constructor(
    public readonly productId: string,
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'FetchCoinStatsError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchCoinStatsError);
    }
  }
}
