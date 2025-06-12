import { ApiError } from '../../api-generated/backend';

/**
 * Returns true if error exists and is of type ApiError.
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
