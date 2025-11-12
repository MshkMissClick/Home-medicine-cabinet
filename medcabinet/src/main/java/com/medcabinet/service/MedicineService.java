package com.medcabinet.service;

import com.medcabinet.dto.MedicineDTO;
import com.medcabinet.mapper.MedicineMapper;
import com.medcabinet.model.Medicine;
import com.medcabinet.model.MedicineType;
import com.medcabinet.model.ApplicationArea;
import com.medcabinet.model.User;
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

    @Autowired
    private MedicineMapper medicineMapper;

    public List<Medicine> getAllMedicinesByUser(User user) {
        return medicineRepository.findByUser(user); // Возвращаем сущности, маппинг в контроллере
    }

    public Optional<Medicine> getMedicineById(Long id, User user) {
        return medicineRepository.findById(id)
                .filter(m -> m.getUser().equals(user)); // Сущность
    }

    public Medicine createMedicine(Medicine medicine, Long typeId, Set<Long> areaIds, User user) {
        MedicineType type = medicineTypeRepository.findById(typeId)
                .orElseThrow(() -> new RuntimeException("Medicine type not found"));

        Set<ApplicationArea> areas = areaIds.stream()
                .map(areaId -> applicationAreaRepository.findById(areaId)
                        .orElseThrow(() -> new RuntimeException("Application area not found")))
                .collect(Collectors.toSet());

        medicine.setType(type);
        medicine.setApplicationAreas(areas);
        medicine.setUser(user);

        return medicineRepository.save(medicine); // Сущность
    }

    public Medicine updateMedicine(Long id, Medicine medicineDetails, Long typeId, Set<Long> areaIds, User user) {
        Medicine medicine = medicineRepository.findById(id)
                .filter(m -> m.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Medicine not found or not owned by user"));

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

        return medicineRepository.save(medicine); // Сущность
    }

    public void deleteMedicine(Long id, User user) {
        Medicine medicine = medicineRepository.findById(id)
                .filter(m -> m.getUser().equals(user))
                .orElseThrow(() -> new RuntimeException("Medicine not found or not owned by user"));
        medicineRepository.delete(medicine);
    }

    public List<Medicine> searchMedicines(String name, User user) {
        return medicineRepository.findByNameContainingIgnoreCaseAndUser(name, user);
    }

    public List<Medicine> getExpiredMedicines(User user) {
        return medicineRepository.findByExpiryDateBeforeAndUser(LocalDate.now(), user);
    }

    public List<Medicine> getExpiringSoonMedicines(int days, User user) {
        return medicineRepository.findByExpiryDateBeforeAndUser(LocalDate.now().plusDays(days), user);
    }

    public List<Medicine> getMedicinesByApplicationArea(String areaName, User user) {
        return medicineRepository.findByApplicationAreaAndUser(areaName, user);
    }

    public List<Medicine> getMedicinesByType(String typeName, User user) {
        return medicineRepository.findByTypeNameAndUser(typeName, user);
    }
}