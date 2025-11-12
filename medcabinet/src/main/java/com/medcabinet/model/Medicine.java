package com.medcabinet.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "medicines")
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_type_id", nullable = false)
    private MedicineType type;

    @ManyToMany
    @JoinTable(
            name = "medicine_application_areas",
            joinColumns = @JoinColumn(name = "medicine_id"),
            inverseJoinColumns = @JoinColumn(name = "application_area_id")
    )
    private Set<ApplicationArea> applicationAreas = new HashSet<>();

    @Positive
    @Column(nullable = false)
    private Integer quantity;

    @NotBlank
    @Column(nullable = false)
    private String unit;

    @NotNull
    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)  // Добавлена связь с пользователем
    private User user;

    // Конструкторы
    public Medicine() {}

    public Medicine(String name, MedicineType type, Integer quantity,
                    String unit, LocalDate expiryDate, User user) {
        this.name = name;
        this.type = type;
        this.quantity = quantity;
        this.unit = unit;
        this.expiryDate = expiryDate;
        this.user = user;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public MedicineType getType() { return type; }
    public void setType(MedicineType type) { this.type = type; }

    public Set<ApplicationArea> getApplicationAreas() { return applicationAreas; }
    public void setApplicationAreas(Set<ApplicationArea> applicationAreas) {
        this.applicationAreas = applicationAreas;
    }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}