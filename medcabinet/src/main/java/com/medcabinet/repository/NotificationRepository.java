package com.medcabinet.repository;

import com.medcabinet.model.Notification;
import com.medcabinet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUser(User user);
    List<Notification> findByDateBefore(LocalDateTime date);
    List<Notification> findByUserAndDateBefore(User user, LocalDateTime date);
}