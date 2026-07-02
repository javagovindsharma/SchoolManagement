package com.sms.school.common.entity;


import com.sms.school.common.enums.MeetingStatus;
import com.sms.school.common.enums.MeetingType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "meeting")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String meetingCode;

    private String title;

    private Long hostId;

    @Enumerated(EnumType.STRING)
    private MeetingType meetingType;

    @Enumerated(EnumType.STRING)
    private MeetingStatus status;

    private LocalDateTime scheduledTime;

    private Integer duration;

    private LocalDateTime createdAt;
}