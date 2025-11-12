package com.medcabinet.dto;

import java.util.Objects;

public class ApplicationAreaDTO {
    private final Long id;
    private final String name;

    public ApplicationAreaDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() { return id; }
    public String getName() { return name; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ApplicationAreaDTO that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public String toString() {
        return "ApplicationAreaDTO{id=" + id + ", name='" + name + '\'' + '}';
    }
}