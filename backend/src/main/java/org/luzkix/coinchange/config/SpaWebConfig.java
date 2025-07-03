package org.luzkix.coinchange.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Handle static resources normally
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/static/");

        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/");

        // Handle SPA routes - catch all non-API routes and forward to index.html
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);

                        // If resource exists and is readable, return it
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }

                        // For non-existing resources, check if it's not an API call
                        // and return index.html to let React Router handle the route
                        if (!resourcePath.startsWith("api/") &&
                                !resourcePath.startsWith("swagger-ui/") &&
                                !resourcePath.startsWith("v3/api-docs/") &&
                                !resourcePath.contains(".")) {
                            return new ClassPathResource("/static/index.html");
                        }

                        // For API calls and other resources, return null (404)
                        return null;
                    }
                });
    }
}
