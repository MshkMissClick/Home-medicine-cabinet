package com.medcabinet.repository;

import com.medcabinet.model.Medicine;
import com.medcabinet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    List<Medicine> findByUser(User user);

    List<Medicine> findByNameContainingIgnoreCaseAndUser(String name, User user);

    @Query("SELECT m FROM Medicine m WHERE m.expiryDate < :date AND m.user = :user")
    List<Medicine> findByExpiryDateBeforeAndUser(LocalDate date, User user);

    @Query("SELECT m FROM Medicine m JOIN m.applicationAreas a WHERE a.name = :areaName AND m.user = :user")
    List<Medicine> findByApplicationAreaAndUser(String areaName, User user);

    @Query("SELECT m FROM Medicine m WHERE m.type.name = :typeName AND m.user = :user")
    List<Medicine> findByTypeNameAndUser(String typeName, User user);
}