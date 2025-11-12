package com.medcabinet.dto;

import java.time.LocalDate;
import java.util.Objects;
import java.util.Set;

public class MedicineResponseDTO {
    private final Long id;
    private final String name;
    private final Integer quantity;
    private final String unit;
    private final LocalDate expiryDate;
    private final MedicineTypeDTO type;
    private final Set<ApplicationAreaDTO> applicationAreas;

    public MedicineResponseDTO(
            Long id,
            String name,
            Integer quantity,
            String unit,
            LocalDate expiryDate,
            MedicineTypeDTO type,
            Set<ApplicationAreaDTO> applicationAreas
    ) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
        this.type = type;
        this.applicationAreas = applicationAreas;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Integer getQuantity() { return quantity; }
    public String getUnit() { return unit; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public MedicineTypeDTO getType() { return type; }
    public Set<ApplicationAreaDTO> getApplicationAreas() { return applicationAreas; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MedicineResponseDTO that)) return false;
        return Objects.equals(id, that.id) &&
                Objects.equals(name, that.name) &&
                Objects.equals(quantity, that.quantity) &&
                Objects.equals(unit, that.unit) &&
                Objects.equals(expiryDate, that.expiryDate) &&
                Objects.equals(type, that.type) &&
                Objects.equals(applicationAreas, that.applicationAreas);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, quantity, unit, expiryDate, type, applicationAreas);
    }

    @Override
    public String toString() {
        return "MedicineResponseDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", quantity=" + quantity +
                ", unit='" + unit + '\'' +
                ", expiryDate=" + expiryDate +
                ", type=" + type +
                ", applicationAreas=" + applicationAreas +
                '}';
    }
}