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

export class FetchCoinPairStatsError extends Error {
  constructor(
    message: string,
    public readonly productId: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'FetchCoinPairStatsError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchCoinPairStatsError);
    }
  }
}

export class FetchSupportedCurrenciesError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'FetchSupportedCurrenciesError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchSupportedCurrenciesError);
    }
  }
}

export class FetchBalancesError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'FetchBalancesError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchBalancesError);
    }
  }
}

export class RefreshTokenError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'RefreshTokenError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RefreshTokenError);
    }
  }
}
