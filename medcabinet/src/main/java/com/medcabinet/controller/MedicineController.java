package com.medcabinet.controller;

import com.medcabinet.dto.CreateMedicineRequest;
import com.medcabinet.dto.UpdateMedicineRequest;
import com.medcabinet.dto.MedicineResponseDTO;
import com.medcabinet.mapper.MedicineMapper;
import com.medcabinet.model.Medicine;
import com.medcabinet.model.User;
import com.medcabinet.service.MedicineExpiryService;
import com.medcabinet.service.MedicineService;
import com.medcabinet.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private UserService userService;

    @Autowired
    private MedicineMapper medicineMapper;

    @Autowired
    private MedicineExpiryService medicineExpiryService;

    @GetMapping
    public ResponseEntity<List<MedicineResponseDTO>> getAllMedicines() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        List<MedicineResponseDTO> dtos = medicineService.getAllMedicinesByUser(user)
                .stream()
                .map(medicineMapper::toDto)
                .toList();

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponseDTO> getMedicineById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return medicineService.getMedicineById(id, user)
                .map(medicineMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MedicineResponseDTO> createMedicine(@Valid @RequestBody CreateMedicineRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Medicine medicine = new Medicine();
        medicine.setName(request.getName());
        medicine.setQuantity(request.getQuantity());
        medicine.setUnit(request.getUnit());
        medicine.setExpiryDate(request.getExpiryDate());

        Medicine savedMedicine = medicineService.createMedicine(
                medicine, request.getTypeId(), request.getAreaIds(), user);

        medicineExpiryService.checkSingleMedicineForExpiry(savedMedicine);

        return ResponseEntity.ok(medicineMapper.toDto(savedMedicine));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponseDTO> updateMedicine(@PathVariable Long id, @Valid @RequestBody UpdateMedicineRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Medicine medicineDetails = new Medicine();
        medicineDetails.setName(request.getName());
        medicineDetails.setQuantity(request.getQuantity());
        medicineDetails.setUnit(request.getUnit());
        medicineDetails.setExpiryDate(request.getExpiryDate());

        Medicine updatedMedicine = medicineService.updateMedicine(
                id, medicineDetails, request.getTypeId(), request.getAreaIds(), user);

        medicineExpiryService.checkSingleMedicineForExpiry(updatedMedicine);

        return ResponseEntity.ok(medicineMapper.toDto(updatedMedicine));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicine(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        try {
            medicineService.deleteMedicine(id, user);
            return ResponseEntity.ok().body(Map.of("message", "Medicine deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/search")
    public List<MedicineResponseDTO> searchMedicines(@RequestParam String name) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return medicineService.searchMedicines(name, user)
                .stream()
                .map(medicineMapper::toDto)
                .toList();
    }

    @GetMapping("/expired")
    public List<MedicineResponseDTO> getExpiredMedicines() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return medicineService.getExpiredMedicines(user)
                .stream()
                .map(medicineMapper::toDto)
                .toList();
    }

    @GetMapping("/expiring-soon")
    public List<MedicineResponseDTO> getExpiringSoonMedicines(@RequestParam int days) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return medicineService.getExpiringSoonMedicines(days, user)
                .stream()
                .map(medicineMapper::toDto)
                .toList();
    }

    @GetMapping("/by-area/{areaName}")
    public List<MedicineResponseDTO> getMedicinesByApplicationArea(@PathVariable String areaName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return medicineService.getMedicinesByApplicationArea(areaName, user)
                .stream()
                .map(medicineMapper::toDto)
                .toList();
    }

    @GetMapping("/by-type/{typeName}")
    public List<MedicineResponseDTO> getMedicinesByType(@PathVariable String typeName) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }
        Long userId = (Long) authentication.getCredentials();
        User user = userService.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return medicineService.getMedicinesByType(typeName, user)
                .stream()
                .map(medicineMapper::toDto)
                .toList();
    }
}