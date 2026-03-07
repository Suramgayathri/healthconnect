package com.digitalclinic.appointmentsystem.dto;

import com.digitalclinic.appointmentsystem.model.Role;
import lombok.Data;

@Data
public class UserRegistrationDTO {
    private String fullName;
    private String email;
    private String phone;
    private String password;
    private String dob;
    private String gender;
    private String bloodGroup;
    private Role role; // PATIENT or DOCTOR
}
