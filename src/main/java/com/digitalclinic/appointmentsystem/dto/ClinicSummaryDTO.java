package com.digitalclinic.appointmentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClinicSummaryDTO {
    private Long locationId;
    private String clinicName;
}
