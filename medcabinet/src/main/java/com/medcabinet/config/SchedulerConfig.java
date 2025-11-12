package com.medcabinet.config;

import com.medcabinet.service.MedicineExpiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class SchedulerConfig {

    @Autowired
    private MedicineExpiryService medicineExpiryService;

    // Запускается каждый день в 00:00
    @Scheduled(cron = "0 0 0 * * ?")
    public void checkMedicinesExpiryDaily() {
        medicineExpiryService.checkAllMedicinesForExpiry();
    }
}