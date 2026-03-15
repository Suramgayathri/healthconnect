package com.digitalclinic.appointmentsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HospitalDTO {
    private Long hospitalId;
    private String hospitalName;
    private String hospitalAddress;
    private String city;
    private String state;
    private String pincode;
    private String phone;
    private String email;
    private String website;
    private Integer totalBeds;
    private Boolean emergencyServices;
    private Boolean ambulanceServices;
    private String description;
    private String facilities;
    private String imageUrl;
    private Integer doctorCount;
}
