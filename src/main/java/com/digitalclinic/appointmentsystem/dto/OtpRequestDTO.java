package com.digitalclinic.appointmentsystem.dto;

import lombok.Data;

@Data
public class OtpRequestDTO {
    private String email;
    private String phone;
}
