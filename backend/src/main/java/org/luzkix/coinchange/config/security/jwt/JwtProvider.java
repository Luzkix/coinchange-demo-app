package org.luzkix.coinchange.config.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidJwtTokenException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtProvider {

    private final SecretKey secretKey; // Secret key for signing JWT tokens

    private final long validityInMilliseconds; // Token expiration time in milliseconds

    // Constructor to initialize secretKey and validity duration from application properties
    public JwtProvider(@Value("${jwt.secret}") String secret,
                       @Value("${jwt.expiration}") long validityInMilliseconds
    ) {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret)); // Decoded Base64 secret key
        this.validityInMilliseconds = validityInMilliseconds; // token validity duration
    }

    /**
     * Generates a JWT token for the given userId.
     *
     * @param userId The userId to include in the token payload.
     * @return A signed JWT token.
     */
    public String generateToken(Long userId) {
        Date now = new Date(); // Current timestamp
        Date validity = new Date(now.getTime() + validityInMilliseconds); // Expiration timestamp

        JwtBuilder jwtBuilder = Jwts.builder()
                .id(userId.toString())
                .issuedAt(now)
                .expiration(validity);

        return jwtBuilder.signWith(secretKey).compact(); // Sign and compact the token
    }

    /**
     * Validates the given JWT token.
     *
     * @param token The JWT token to validate.
     * @return True if the token is valid, exception otherwise.
     */
    public Jws<Claims> validateToken(String token) {
        try {
            Jws<Claims> claims = Jwts.parser()
                    .verifyWith(secretKey) // Validate the signature with the secret key
                    .build()
                    .parseSignedClaims(token); // Parse and validate the signed claims

            return claims;
        } catch (Exception e) { //in case of any JWT exception return exception with type IMVALID_JWT_TOKEN and custom message specifying what was wrong
            throw new InvalidJwtTokenException(e.getMessage(), ErrorBusinessCodeEnum.INVALID_JWT_TOKEN);
        }
    }

    /**
     * Extracts the user Id from the given JWT token.
     *
     * @param token The JWT token to extract the user Id from.
     * @return The user Id included in the token payload.
     */
    public Long getUserIdFromToken(String token) {
        Jws<Claims> claims = validateToken(token);

        return Long.parseLong(claims.getPayload().getId()); // Extract user Id
    }
}
