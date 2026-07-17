package com.sms.school.api.controller;

import com.sms.school.api.dto.ApiResponse;
import com.sms.school.api.repository.BranchRepository;
import com.sms.school.api.repository.BusRouteRepository;
import com.sms.school.common.entity.Branch;
import com.sms.school.common.entity.BusRoute;
import com.sms.school.common.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transport")
@RequiredArgsConstructor
public class TransportController {

    private final BusRouteRepository busRouteRepository;
    private final BranchRepository branchRepository;

    @GetMapping("/routes")
    public ResponseEntity<ApiResponse<List<BusRoute>>> getRoutes(@AuthenticationPrincipal User user) {
        Long branchId = (user != null && user.getBranch() != null) ? user.getBranch().getId() : null;
        List<BusRoute> routes = branchId != null
                ? busRouteRepository.findByBranchIdAndIsActiveTrue(branchId)
                : busRouteRepository.findByIsActiveTrue();
        return ResponseEntity.ok(ApiResponse.success(routes));
    }

    @PostMapping("/routes")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN', 'BRANCH_ADMIN', 'PRINCIPAL', 'TRANSPORT_MANAGER')")
    @Transactional
    public ResponseEntity<ApiResponse<BusRoute>> createRoute(
            @RequestBody Map<String, Object> dto,
            @AuthenticationPrincipal User currentUser) {

        String routeName = (String) dto.get("routeName");
        if (routeName == null || routeName.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Route name is required"));
        }

        // Resolve branch
        Branch branch = currentUser.getBranch();
        if (branch == null) {
            Object branchIdObj = dto.get("branchId");
            if (branchIdObj != null) {
                branch = branchRepository.findById(Long.valueOf(branchIdObj.toString())).orElse(null);
            }
            if (branch == null) {
                var branches = branchRepository.findByIsActiveTrue();
                if (branches.isEmpty()) {
                    return ResponseEntity.badRequest().body(ApiResponse.error("No branch available."));
                }
                branch = branches.get(0);
            }
        }

        BusRoute route = BusRoute.builder()
                .branch(branch)
                .routeName(routeName)
                .routeNumber((String) dto.get("routeNumber"))
                .startLocation((String) dto.get("startLocation"))
                .endLocation((String) dto.get("endLocation"))
                .conductorName((String) dto.get("conductorName"))
                .conductorPhone((String) dto.get("conductorPhone"))
                .isActive(true)
                .build();

        if (dto.get("monthlyFee") != null && !dto.get("monthlyFee").toString().isBlank()) {
            route.setMonthlyFee(new BigDecimal(dto.get("monthlyFee").toString()));
        }
        if (dto.get("maxStudents") != null && !dto.get("maxStudents").toString().isBlank()) {
            route.setMaxStudents(Integer.valueOf(dto.get("maxStudents").toString()));
        }

        busRouteRepository.save(route);
        return ResponseEntity.ok(ApiResponse.success("Route created", route));
    }
}
