package com.sms.school.api.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

/**
 * Intercepts WebSocket handshake to extract user info from query parameters.
 * Usage: ws://localhost:8080/ws/video-call?userId=1&userName=John&role=TEACHER
 */
public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            String userId = servletRequest.getServletRequest().getParameter("userId");
            String userName = servletRequest.getServletRequest().getParameter("userName");
            String role = servletRequest.getServletRequest().getParameter("role");

            if (userId != null && !userId.isBlank()) {
                attributes.put("userId", userId);
                attributes.put("userName", userName != null ? userName : "Unknown");
                attributes.put("role", role != null ? role : "STUDENT");
                return true;
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }
}
