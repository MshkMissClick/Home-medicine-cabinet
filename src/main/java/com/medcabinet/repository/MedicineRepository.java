package com.medcabinet.repository;

import com.medcabinet.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByNameContainingIgnoreCase(String name);
    List<Medicine> findByExpiryDateBefore(LocalDate date);

    @Query("SELECT m FROM Medicine m JOIN m.applicationAreas a WHERE a.name = :areaName")
    List<Medicine> findByApplicationArea(@Param("areaName") String areaName);

    @Query("SELECT m FROM Medicine m WHERE m.type.name = :typeName")
    List<Medicine> findByTypeName(@Param("typeName") String typeName);
}