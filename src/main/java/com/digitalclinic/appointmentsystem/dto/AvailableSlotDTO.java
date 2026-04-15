package com.digitalclinic.appointmentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableSlotDTO {
    private Long slotId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;         // "AVAILABLE", "BOOKED", "BREAK", "BLOCKED"
    private boolean isEmergencySlot;
    private boolean isAvailable;   // backward compat: true only when status=AVAILABLE
}
