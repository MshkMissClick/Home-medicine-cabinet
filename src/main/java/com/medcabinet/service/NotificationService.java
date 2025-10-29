package com.medcabinet.service;

import com.medcabinet.model.Medicine;
import com.medcabinet.model.Notification;
import com.medcabinet.model.User;
import com.medcabinet.repository.NotificationRepository;
import com.medcabinet.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MedicineService medicineService;

    public List<Notification> getUserNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUser(user);
    }

    public Notification createNotification(Long userId, String text) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setText(text);
        notification.setDate(LocalDateTime.now());
        notification.setUser(user);

        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void deleteOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<Notification> oldNotifications = notificationRepository.findByDateBefore(cutoffDate);
        notificationRepository.deleteAll(oldNotifications);
    }

    @Scheduled(cron = "0 0 8 * * ?") // Каждый день в 8:00
    public void checkExpiringMedicines() {
        List<Medicine> expiringMedicines = medicineService.getExpiringSoonMedicines(7); // За 7 дней

        for (Medicine medicine : expiringMedicines) {
            // Здесь можно добавить логику создания уведомлений для пользователей
            String message = String.format("Лекарство '%s' истекает %s",
                    medicine.getName(), medicine.getExpiryDate());
            // createNotification(userId, message);
        }
    }
}