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

export class FetchMarketConversionRateError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'FetchMarketConversionRateError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchMarketConversionRateError);
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

export class RegisterUserError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'RegisterUserError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RegisterUserError);
    }
  }
}

export class LoginUserError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'LoginUserError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LoginUserError);
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

export class UpdateUserError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'UpdateUserError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UpdateUserError);
    }
  }
}

export class SimpleTradingError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'SimpleTradingError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SimpleTradingError);
    }
  }
}

export class AdvancedTradingError extends Error {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'AdvancedTradingError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AdvancedTradingError);
    }
  }
}
