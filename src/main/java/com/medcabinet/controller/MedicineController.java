package com.medcabinet.controller;

import com.medcabinet.model.Medicine;
import com.medcabinet.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createMedicine(@RequestBody CreateMedicineRequest request) {
        try {
            Medicine medicine = new Medicine();
            medicine.setName(request.getName());
            medicine.setQuantity(request.getQuantity());
            medicine.setUnit(request.getUnit());
            medicine.setExpiryDate(request.getExpiryDate());

            Medicine savedMedicine = medicineService.createMedicine(
                    medicine, request.getTypeId(), request.getAreaIds());
            return ResponseEntity.ok(savedMedicine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicine(@PathVariable Long id, @RequestBody UpdateMedicineRequest request) {
        try {
            Medicine medicineDetails = new Medicine();
            medicineDetails.setName(request.getName());
            medicineDetails.setQuantity(request.getQuantity());
            medicineDetails.setUnit(request.getUnit());
            medicineDetails.setExpiryDate(request.getExpiryDate());

            Medicine updatedMedicine = medicineService.updateMedicine(
                    id, medicineDetails, request.getTypeId(), request.getAreaIds());
            return ResponseEntity.ok(updatedMedicine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        try {
            medicineService.deleteMedicine(id);
            return ResponseEntity.ok().body(Map.of("message", "Medicine deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error deleting medicine"));
        }
    }

    @GetMapping("/search")
    public List<Medicine> searchMedicines(@RequestParam String name) {
        return medicineService.searchMedicines(name);
    }

    @GetMapping("/expired")
    public List<Medicine> getExpiredMedicines() {
        return medicineService.getExpiredMedicines();
    }

    @GetMapping("/expiring-soon")
    public List<Medicine> getExpiringSoonMedicines(@RequestParam(defaultValue = "7") int days) {
        return medicineService.getExpiringSoonMedicines(days);
    }

    @GetMapping("/by-area/{areaName}")
    public List<Medicine> getMedicinesByApplicationArea(@PathVariable String areaName) {
        return medicineService.getMedicinesByApplicationArea(areaName);
    }

    @GetMapping("/by-type/{typeName}")
    public List<Medicine> getMedicinesByType(@PathVariable String typeName) {
        return medicineService.getMedicinesByType(typeName);
    }

    // DTO классы для запросов
    public static class CreateMedicineRequest {
        private String name;
        private Integer quantity;
        private String unit;
        private LocalDate expiryDate;
        private Long typeId;
        private Set<Long> areaIds;

        // геттеры и сеттеры
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
        public Long getTypeId() { return typeId; }
        public void setTypeId(Long typeId) { this.typeId = typeId; }
        public Set<Long> getAreaIds() { return areaIds; }
        public void setAreaIds(Set<Long> areaIds) { this.areaIds = areaIds; }
    }

    public static class UpdateMedicineRequest {
        private String name;
        private Integer quantity;
        private String unit;
        private LocalDate expiryDate;
        private Long typeId;
        private Set<Long> areaIds;

        // геттеры и сеттеры
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
        public Long getTypeId() { return typeId; }
        public void setTypeId(Long typeId) { this.typeId = typeId; }
        public Set<Long> getAreaIds() { return areaIds; }
        public void setAreaIds(Set<Long> areaIds) { this.areaIds = areaIds; }
    }
}