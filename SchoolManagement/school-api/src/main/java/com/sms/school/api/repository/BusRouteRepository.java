package com.sms.school.api.repository;

import com.sms.school.common.entity.BusRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusRouteRepository extends JpaRepository<BusRoute, Long> {
    List<BusRoute> findByBranchIdAndIsActiveTrue(Long branchId);
    List<BusRoute> findByIsActiveTrue();
}
