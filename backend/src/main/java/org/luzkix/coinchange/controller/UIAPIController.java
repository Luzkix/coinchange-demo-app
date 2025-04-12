package org.luzkix.coinchange.controller;

import org.luzkix.coinchange.config.security.CustomUserDetails;
import org.luzkix.coinchange.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = UIAPIController.BASE_UI_URI,produces = { "application/json" })
public abstract class UIAPIController {
    public static final String BASE_UI_URI = "/ui-api";

    //generic method to be used in all endpoints to get info about logged user
    protected User getUserFromAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ((CustomUserDetails) authentication.getPrincipal()).getUser();
    }
}
