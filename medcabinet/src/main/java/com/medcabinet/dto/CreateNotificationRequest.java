package com.medcabinet.dto;

import java.time.LocalDateTime;

public class CreateNotificationRequest {
    private String text;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
}