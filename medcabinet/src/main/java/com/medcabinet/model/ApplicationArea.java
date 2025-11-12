package com.medcabinet.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "application_areas")
public class ApplicationArea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String name;

    @ManyToMany(mappedBy = "applicationAreas")
    private Set<Medicine> medicines = new HashSet<>();

    // Конструкторы
    public ApplicationArea() {}

    public ApplicationArea(String name) {
        this.name = name;
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Set<Medicine> getMedicines() { return medicines; }
    public void setMedicines(Set<Medicine> medicines) { this.medicines = medicines; }
}