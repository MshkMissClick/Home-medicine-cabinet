package com.medcabinet.dto;

import java.time.LocalDate;
import java.util.Set;

public class MedicineDTO {
    private Long id;
    private String name;
    private String typeName;
    private Set<String> applicationAreas;
    private Integer quantity;
    private String unit;
    private LocalDate expiryDate;

    // Конструктор
    public MedicineDTO() {}

    public MedicineDTO(Long id, String name, String typeName, Set<String> applicationAreas,
                       Integer quantity, String unit, LocalDate expiryDate) {
        this.id = id;
        this.name = name;
        this.typeName = typeName;
        this.applicationAreas = applicationAreas;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTypeName() { return typeName; }
    public void setTypeName(String typeName) { this.typeName = typeName; }

    public Set<String> getApplicationAreas() { return applicationAreas; }
    public void setApplicationAreas(Set<String> applicationAreas) { this.applicationAreas = applicationAreas; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
}