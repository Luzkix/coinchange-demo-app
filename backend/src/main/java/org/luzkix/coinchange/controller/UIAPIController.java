package org.luzkix.coinchange.controller;

import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping(value = UIAPIController.BASE_UI_URI,produces = { "application/json" }, consumes = { "application/json" })
public abstract class UIAPIController {
    public static final String BASE_UI_URI = "/ui-api";
}
