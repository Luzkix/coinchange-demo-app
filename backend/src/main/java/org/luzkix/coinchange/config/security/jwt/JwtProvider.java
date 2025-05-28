package org.luzkix.coinchange.config.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.luzkix.coinchange.dto.ConversionRateTokenPayloadDto;
import org.luzkix.coinchange.exceptions.ErrorBusinessCodeEnum;
import org.luzkix.coinchange.exceptions.InvalidJwtTokenException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
                .expiration(validity)
                .signWith(secretKey); // Sign created token with secret key

        return jwtBuilder.compact();
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



    // Methods for generation and validation of conversionRateToken

    /**
     * Generates a JWT token with information about conversion rate of particular currency pair.
     *
     * @param soldCurrencyCode code of sold currency.
     * @param boughtCurrencyCode code of bought currency.
     * @param conversionRate calculated conversion rate.
     * @param validTo validity of conversion rate.
     * @return A signed JWT token.
     */
    public String generateConversionRateToken(
            String soldCurrencyCode,
            String boughtCurrencyCode,
            BigDecimal conversionRate,
            OffsetDateTime validTo
    ) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("soldCurrencyCode", soldCurrencyCode);
        claims.put("boughtCurrencyCode", boughtCurrencyCode);
        claims.put("conversionRate", conversionRate);
        claims.put("validTo", validTo.toString());

        Date now = new Date();

        JwtBuilder jwtBuilder = Jwts.builder()
                .issuedAt(now)
                .claims(claims)
                .signWith(secretKey);

        return jwtBuilder.compact();
    }

    public ConversionRateTokenPayloadDto parseConversionRateToken(String token) {
        Jws<Claims> claimsJws = validateToken(token);
        Claims claims = claimsJws.getPayload();

        String soldCurrencyCode = claims.get("soldCurrencyCode", String.class);
        String boughtCurrencyCode = claims.get("boughtCurrencyCode", String.class);
        BigDecimal conversionRate = new BigDecimal(claims.get("conversionRate", String.class));
        OffsetDateTime validTo = OffsetDateTime.parse(claims.get("validTo", String.class));

        return new ConversionRateTokenPayloadDto(soldCurrencyCode, boughtCurrencyCode, conversionRate, validTo);
    }
}
