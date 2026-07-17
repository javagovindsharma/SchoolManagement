package com.sms.school.api.repository;

import com.sms.school.common.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByBranchIdOrderByCreatedAtDesc(Long branchId);
    List<Notification> findAllByOrderByCreatedAtDesc();
}
