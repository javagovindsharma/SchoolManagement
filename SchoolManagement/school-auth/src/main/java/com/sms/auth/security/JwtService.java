package com.sms.auth.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET ="govindsharmaschoolmanagementsystem";

    public String generateToken(String email) {

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(
                    new Date(
                        System.currentTimeMillis()
                        + 86400000
                    )
                )
                .signWith(
                    Keys.hmacShaKeyFor(
                        SECRET.getBytes()
                    )
                )
                .compact();
    }
}