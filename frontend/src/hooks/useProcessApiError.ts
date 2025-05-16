import { useGeneralContext } from '../contexts/GeneralContext.tsx';
import { ApiError, ErrorDto } from '../api-generated/backend';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook for processing errors coming from used API. It is responsible for displaying and logging of error messages.
 * @param apiError - generic error received from API
 * @param processName - specify the process or function where the error happened
 */
export const useProcessApiError = () => {
  const { addErrorModal, addErrorPopup } = useGeneralContext();
  const { t } = useTranslation(['errors']);

  return (apiError: ApiError, processName?: string) => {
    const errorDto: ErrorDto = apiError?.body;
    if (errorDto) {
      if (errorDto.errorBusinessCode) {
        addErrorModal(
          t(`businessErrors.${errorDto.errorBusinessCode}.message`),
          t(`businessErrors.${errorDto.errorBusinessCode}.title`),
        );
        console.error(
          processName
            ? processName + ' errorDto: ' + JSON.stringify(errorDto)
            : 'errorDto: ' + JSON.stringify(errorDto),
        );
      } else {
        addErrorModal(
          errorDto.errorMessage ?? t(`common.unknownErrorMessage`),
          t(`common.unknownError`),
        );
        console.error(
          processName
            ? processName + ' errorDto: ' + JSON.stringify(errorDto)
            : 'errorDto: ' + JSON.stringify(errorDto),
        );
      }
    } else {
      if (apiError.status) {
        addErrorPopup(
          t('common.genericErrorTitle') +
            ' ' +
            t('common.statusCode') +
            ': ' +
            apiError.status +
            ' ' +
            t('common.statusDesc') +
            ': ' +
            apiError.statusText,
        );
        console.error(
          processName
            ? processName + ' ApiError: ' + JSON.stringify(apiError)
            : 'ApiError: ' + JSON.stringify(apiError),
        );
      } else {
        addErrorPopup(apiError.message);
        console.error(
          processName
            ? processName + ' ApiError: ' + apiError.stack
            : 'ApiError: ' + apiError.stack,
        );
      }
    }
  };
};
