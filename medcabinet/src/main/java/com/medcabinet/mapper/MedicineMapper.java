package com.medcabinet.mapper;

import com.medcabinet.dto.*;
import com.medcabinet.model.*;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import java.util.Set;

@Mapper(componentModel = "spring")
public interface MedicineMapper {

    MedicineMapper INSTANCE = Mappers.getMapper(MedicineMapper.class);

    // Medicine → DTO
    @Mapping(target = "type", source = "type")
    @Mapping(target = "applicationAreas", source = "applicationAreas")
    MedicineResponseDTO toDto(Medicine medicine);

    MedicineTypeDTO toTypeDto(MedicineType type);

    ApplicationAreaDTO toAreaDto(ApplicationArea area);

    Set<ApplicationAreaDTO> toAreaDtoSet(Set<ApplicationArea> areas);
}