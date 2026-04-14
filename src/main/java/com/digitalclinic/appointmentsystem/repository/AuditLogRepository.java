package com.digitalclinic.appointmentsystem.repository;

import com.digitalclinic.appointmentsystem.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserId(Long userId);
    List<AuditLog> findByTableNameAndRecordId(String tableName, Long recordId);
}
