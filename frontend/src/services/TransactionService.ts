import { ApiTransactionService, TransactionResponseDto } from '../api-generated/backend';

/**
 * TransactionService provides api calls related to transactions (e.g. processed transactions, pending transactions...).
 */
export const TransactionService = {
  /**
   * Fetches all transactions for the user using the backend API.
   * Returns TransactionResponseDto[] on success.
   */
  async fetchAllTransactionsByUser(): Promise<TransactionResponseDto[]> {
    console.log('Getting all user´s transactions...');
    return ApiTransactionService.getAllTransactionsByUser();
  },
  /**
   * Fetches all pending transactions for the user using the backend API.
   * Returns TransactionResponseDto[] on success.
   */
  async fetchAllPendingTransactionsByUser(): Promise<TransactionResponseDto[]> {
    console.log('Getting all user´s pending transactions...');
    return ApiTransactionService.getAllPendingTransactionsByUser();
  },

  /**
   * Cancels selected pending transaction using the backend API.
   * Returns remaining pending transactions as TransactionResponseDto[] on success.
   */
  async cancelPendingTransaction(transactionId: number): Promise<TransactionResponseDto[]> {
    console.log('Getting all user´s pending transactions...');
    return ApiTransactionService.cancelPendingTransaction(transactionId);
  },
};
