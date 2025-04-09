package org.luzkix.coinchange.utils;

import org.luzkix.coinchange.model.User;

import java.time.LocalDateTime;

/**
 * Provides various helper methods in relation to User entity.
 */
public class UserUtils {

    /**
     * Compares two LocalDateTime values and returns true if futureDateTime is greater than actualDateTime.
     *
     * @param user is the user to be checked
     * @return true if the user is active (== his validTo date is in the future)
     */
    public static boolean isActiveUser (User user) {
        return DateUtils.isFutureDateGreater(LocalDateTime.now(), user.getValidTo());
    }
}
