package com.medcabinet.controller;

import com.medcabinet.model.MedicineType;
import com.medcabinet.repository.MedicineTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicine-types")
public class MedicineTypeController {

    @Autowired
    private MedicineTypeRepository medicineTypeRepository;

    @GetMapping
    public List<MedicineType> getAllMedicineTypes() {
        return medicineTypeRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> createMedicineType(@RequestBody MedicineType medicineType) {
        if (medicineTypeRepository.existsByName(medicineType.getName())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Medicine type already exists"));
        }
        MedicineType savedType = medicineTypeRepository.save(medicineType);
        return ResponseEntity.ok(savedType);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicineType(@PathVariable Long id) {
        try {
            medicineTypeRepository.deleteById(id);
            return ResponseEntity.ok().body(Map.of("message", "Medicine type deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error deleting medicine type"));
        }
    }
}