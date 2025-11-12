package com.medcabinet.controller;

import com.medcabinet.dto.ApplicationAreaDTO;
import com.medcabinet.mapper.MedicineMapper;
import com.medcabinet.model.ApplicationArea;
import com.medcabinet.repository.ApplicationAreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/application-areas")
public class ApplicationAreaController {

    @Autowired
    private ApplicationAreaRepository applicationAreaRepository;

    @Autowired
    private MedicineMapper medicineMapper;

    @GetMapping
    public List<ApplicationAreaDTO> getAllApplicationAreas() {
        return applicationAreaRepository.findAll().stream()
                .map(medicineMapper::toAreaDto)
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> createApplicationArea(@RequestBody ApplicationArea applicationArea) {
        if (applicationAreaRepository.existsByName(applicationArea.getName())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Application area already exists"));
        }
        ApplicationArea savedArea = applicationAreaRepository.save(applicationArea);
        return ResponseEntity.ok(medicineMapper.toAreaDto(savedArea));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplicationArea(@PathVariable Long id) {
        try {
            applicationAreaRepository.deleteById(id);
            return ResponseEntity.ok().body(Map.of("message", "Application area deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error deleting application area"));
        }
    }
}