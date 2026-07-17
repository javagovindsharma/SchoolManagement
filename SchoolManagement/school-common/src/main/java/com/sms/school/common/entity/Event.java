package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type")
    @Builder.Default
    private EventType eventType = EventType.ACADEMIC;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(length = 300)
    private String venue;

    @Column(length = 200)
    private String organizer;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_audience")
    @Builder.Default
    private TargetAudience targetAudience = TargetAudience.ALL;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = true;

    @Column(name = "is_holiday")
    @Builder.Default
    private Boolean isHoliday = false;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EventStatus status = EventStatus.UPCOMING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    public enum EventType { ACADEMIC, CULTURAL, SPORTS, HOLIDAY, EXAM, MEETING, OTHER }
    public enum TargetAudience { ALL, STUDENTS, PARENTS, TEACHERS, STAFF }
    public enum EventStatus { UPCOMING, ONGOING, COMPLETED, CANCELLED }
}
