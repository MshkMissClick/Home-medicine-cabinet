package com.medcabinet.mapper;

import com.medcabinet.dto.MedicineDTO;
import com.medcabinet.model.Medicine;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MedicineMapper {

    public MedicineDTO toDTO(Medicine medicine) {
        if (medicine == null) {
            return null;
        }

        return new MedicineDTO(
                medicine.getId(),
                medicine.getName(),
                medicine.getType() != null ? medicine.getType().getName() : null,
                medicine.getApplicationAreas() != null ?
                        medicine.getApplicationAreas().stream()
                                .map(area -> area.getName())
                                .collect(Collectors.toSet()) : null,
                medicine.getQuantity(),
                medicine.getUnit(),
                medicine.getExpiryDate()
        );
    }

    public List<MedicineDTO> toDTOList(List<Medicine> medicines) {
        return medicines.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}