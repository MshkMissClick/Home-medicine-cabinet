package com.medcabinet.repository;

import com.medcabinet.model.ApplicationArea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ApplicationAreaRepository extends JpaRepository<ApplicationArea, Long> {
    Optional<ApplicationArea> findByName(String name);
    boolean existsByName(String name);
}