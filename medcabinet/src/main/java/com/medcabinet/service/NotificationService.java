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

    public void deleteNotification(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("You can only delete your own notifications");
        }

        notificationRepository.delete(notification);
    }

    public void deleteOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<Notification> oldNotifications = notificationRepository.findByDateBefore(cutoffDate);
        notificationRepository.deleteAll(oldNotifications);
    }

    @Scheduled(cron = "0 0 8 * * ?") // Каждый день в 8:00
    public void checkExpiringMedicines() {
        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {
            List<Medicine> expiringMedicines = medicineService.getExpiringSoonMedicines(7, user);

            for (Medicine medicine : expiringMedicines) {
                String message = String.format("Лекарство '%s' истекает %s",
                        medicine.getName(), medicine.getExpiryDate());

                createNotification(user.getId(), message);
            }
        }
    }
}