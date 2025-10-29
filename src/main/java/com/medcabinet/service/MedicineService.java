package com.medcabinet.service;

import com.medcabinet.model.Medicine;
import com.medcabinet.model.MedicineType;
import com.medcabinet.model.ApplicationArea;
import com.medcabinet.repository.MedicineRepository;
import com.medcabinet.repository.MedicineTypeRepository;
import com.medcabinet.repository.ApplicationAreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private MedicineTypeRepository medicineTypeRepository;

    @Autowired
    private ApplicationAreaRepository applicationAreaRepository;

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Optional<Medicine> getMedicineById(Long id) {
        return medicineRepository.findById(id);
    }

    public Medicine createMedicine(Medicine medicine, Long typeId, Set<Long> areaIds) {
        MedicineType type = medicineTypeRepository.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Medicine type not found"));

        Set<ApplicationArea> areas = areaIds.stream()
                .map(areaId -> applicationAreaRepository.findById(areaId)
                        .orElseThrow(() -> new RuntimeException("Application area not found")))
                .collect(Collectors.toSet());

        medicine.setType(type);
        medicine.setApplicationAreas(areas);

        return medicineRepository.save(medicine);
    }

    public Medicine updateMedicine(Long id, Medicine medicineDetails, Long typeId, Set<Long> areaIds) {
        Medicine medicine = medicineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (typeId != null) {
            MedicineType type = medicineTypeRepository.findById(typeId)
                    .orElseThrow(() -> new RuntimeException("Medicine type not found"));
            medicine.setType(type);
        }

        if (areaIds != null) {
            Set<ApplicationArea> areas = areaIds.stream()
                    .map(areaId -> applicationAreaRepository.findById(areaId)
                            .orElseThrow(() -> new RuntimeException("Application area not found")))
                    .collect(Collectors.toSet());
            medicine.setApplicationAreas(areas);
        }

        medicine.setName(medicineDetails.getName());
        medicine.setQuantity(medicineDetails.getQuantity());
        medicine.setUnit(medicineDetails.getUnit());
        medicine.setExpiryDate(medicineDetails.getExpiryDate());

        return medicineRepository.save(medicine);
    }

    public void deleteMedicine(Long id) {
        medicineRepository.deleteById(id);
    }

    public List<Medicine> searchMedicines(String name) {
        return medicineRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Medicine> getExpiredMedicines() {
        return medicineRepository.findByExpiryDateBefore(LocalDate.now());
    }

    public List<Medicine> getExpiringSoonMedicines(int days) {
        return medicineRepository.findByExpiryDateBefore(LocalDate.now().plusDays(days));
    }

    public List<Medicine> getMedicinesByApplicationArea(String areaName) {
        return medicineRepository.findByApplicationArea(areaName);
    }

    public List<Medicine> getMedicinesByType(String typeName) {
        return medicineRepository.findByTypeName(typeName);
    }
}