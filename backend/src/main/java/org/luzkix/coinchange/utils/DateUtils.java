package org.luzkix.coinchange.utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

/**
 * Provides various helper methods related to Dates conversions.
 */
public class DateUtils {

    public static OffsetDateTime convertToSystemOffsetDateTime(LocalDateTime localDateTime) {
        return localDateTime != null ? localDateTime.atOffset(OffsetDateTime.now().getOffset()) : null;
    }

    public static LocalDateTime convertFromOffsetDateTime(OffsetDateTime dateTime){
        if (dateTime == null){
            return null;
        }

        return dateTime.toLocalDateTime();
    }

    public static LocalDate convertToLocalDate(LocalDateTime dateTime){
        if (dateTime == null){
            return null;
        }

        return dateTime.toLocalDate();
    }

    public static LocalDateTime convertToLocalDateTime(LocalDate dateTime){
        if (dateTime == null){
            return null;
        }

        return dateTime.atStartOfDay();
    }

    /**
     * Compares two LocalDateTime values and returns true if futureDateTime is greater than actualDateTime.
     *
     * @param actualDateTime the current or reference date-time
     * @param futureDateTime the date-time to compare against
     * @return true if futureDateTime is greater than actualDateTime, false otherwise
     */
    public static boolean isFutureDateGreater(LocalDateTime actualDateTime, LocalDateTime futureDateTime) {
        return futureDateTime.isAfter(actualDateTime);
    }

    /**
     * Adds seconds to localDateTime and returns new localDateTime.
     * @param localDateTime inputted date and time
     * @param seconds number of seconds to be added (can be also with minus sign)
     * @return new LocalDateTime with added seconds
     */
    public static LocalDateTime addSecondsToLocalDateTime(LocalDateTime localDateTime, Long seconds) {
        if (localDateTime == null || seconds == null) {
            throw new IllegalArgumentException("Error in function 'addSecondsToLocalDateTime'. Parameter 'localDateTime' or 'second' was null!");
        }
        return localDateTime.plusSeconds(seconds);
    }


}
