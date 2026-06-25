package com.sms.school.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String mobile;

    private String subject;

    private String gender;

    private String address;

    private String status = "Active";

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}