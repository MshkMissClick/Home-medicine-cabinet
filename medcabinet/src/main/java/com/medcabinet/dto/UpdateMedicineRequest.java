package com.medcabinet.dto;

import java.time.LocalDate;
import java.util.Set;

public class UpdateMedicineRequest {
    private String name;
    private Integer quantity;
    private String unit;
    private LocalDate expiryDate;
    private Long typeId;
    private Set<Long> areaIds;

    // Геттеры и сеттеры
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