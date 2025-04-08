package org.luzkix.coinchange.exceptions;

import org.luzkix.coinchange.openapi.uiapi.model.ErrorDTO;
import org.luzkix.coinchange.utils.DatesUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
public class ExceptionHandlerAdvice extends ResponseEntityExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(ExceptionHandlerAdvice.class);

    @ExceptionHandler({
            Exception.class
    })
    public ResponseEntity<Object> handleType500exceptions(Exception exception, WebRequest request) {
        return handleException(exception, new HttpHeaders(), INTERNAL_SERVER_ERROR, request);
    }

    @ExceptionHandler({
            AccessDeniedException.class
    })
    public ResponseEntity<Object> handleType403exceptions(final Exception exception,
                                                              final WebRequest request) {

        return handleException(exception, new HttpHeaders(), FORBIDDEN, request);
    }

    @ExceptionHandler({
            UnprocessableEntityException.class
    })
    public ResponseEntity<Object> handleType422exceptions(final Exception exception,
                                                          final WebRequest request) {

        return handleException(exception, new HttpHeaders(), UNPROCESSABLE_ENTITY, request);
    }

    private ResponseEntity<Object> handleException(Exception e, HttpHeaders headers,
                                                   HttpStatus status, WebRequest request) {

        ErrorDTO errorDto = new ErrorDTO();
        errorDto.setErrorStatusValue(status.value());
        errorDto.setErrorStatus(status.name());
        errorDto.setErrorTime(DatesUtils.convertToSystemOffsetDateTime(LocalDateTime.now()));
        errorDto.setErrorMessage(e.getMessage());
        if (e instanceof ErrorBusinessCodeProvider) {
            errorDto.setErrorBusinessCode(((ErrorBusinessCodeProvider) e).getErrorBusinessCode().getCode());
        } else errorDto.setErrorBusinessCode(null);

        log.error("An exception was thrown from a REST controller. Creating an ErrorDTO (errorStatusValue: {}, errorMessage: {}, errorBusinessCode: {})",
                        errorDto.getErrorStatusValue(), e.getMessage(), errorDto.getErrorBusinessCode(), e);

        return super.handleExceptionInternal(e, errorDto, headers, status, request);
    }

}
