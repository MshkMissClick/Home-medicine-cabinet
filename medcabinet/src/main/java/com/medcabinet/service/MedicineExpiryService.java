package com.medcabinet.service;

import com.medcabinet.model.Medicine;
import com.medcabinet.model.User;
import com.medcabinet.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class MedicineExpiryService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Проверяет все лекарства в базе данных и создаёт уведомления для тех,
     * у которых срок годности истекает через месяц или меньше.
     */
    @Transactional
    public void checkAllMedicinesForExpiry() {
        LocalDate today = LocalDate.now();
        LocalDate thresholdDate = today.plusMonths(1);

        // Находим все лекарства, срок годности которых <= thresholdDate
        List<Medicine> medicines = medicineRepository.findAll();

        for (Medicine medicine : medicines) {
            if (!medicine.getExpiryDate().isAfter(thresholdDate)) {
                createExpiryNotification(medicine);
            }
        }
    }

    /**
     * Проверяет одно лекарство и создаёт уведомление, если срок годности близок.
     * @param medicine Лекарство для проверки
     */
    @Transactional
    public void checkSingleMedicineForExpiry(Medicine medicine) {
        LocalDate today = LocalDate.now();
        LocalDate thresholdDate = today.plusMonths(1);

        if (!medicine.getExpiryDate().isAfter(thresholdDate)) {
            createExpiryNotification(medicine);
        }
    }

    /**
     * Создаёт уведомление о скором истечении срока годности.
     * @param medicine Лекарство
     */
    private void createExpiryNotification(Medicine medicine) {
        User user = medicine.getUser();
        if (user == null) {
            return; // Пропускаем, если пользователь не указан
        }

        String text = String.format(
                "Лекарство '%s' истекает %s. Пожалуйста, проверьте запасы.",
                medicine.getName(),
                medicine.getExpiryDate().toString()
        );

        notificationService.createNotification(user.getId(), text);
    }
}