package com.sms.school.common.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "bus_routes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusRoute extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "branch_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "organization"})
    private Branch branch;

    @Column(name = "route_name", nullable = false, length = 200)
    private String routeName;

    @Column(name = "route_number", length = 20)
    private String routeNumber;

    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(name = "driver_id")
    private Long driverId;

    @Column(name = "conductor_name", length = 200)
    private String conductorName;

    @Column(name = "conductor_phone", length = 20)
    private String conductorPhone;

    @Column(name = "start_location", length = 300)
    private String startLocation;

    @Column(name = "end_location", length = 300)
    private String endLocation;

    @Column(name = "total_distance_km", precision = 6, scale = 2)
    private BigDecimal totalDistanceKm;

    @Column(name = "estimated_time_minutes")
    private Integer estimatedTimeMinutes;

    @Column(name = "monthly_fee", precision = 10, scale = 2)
    private BigDecimal monthlyFee;

    @Column(name = "max_students")
    private Integer maxStudents;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;
}
