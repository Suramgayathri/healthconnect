package com.digitalclinic.appointmentsystem.service;

import com.digitalclinic.appointmentsystem.model.User;
import com.digitalclinic.appointmentsystem.repository.DoctorRepository;
import com.digitalclinic.appointmentsystem.repository.PatientRepository;
import com.digitalclinic.appointmentsystem.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminUserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientRepository patientRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private AdminUserService adminUserService;

    @Test
    void testGetAllUsers() {
        User user = User.builder().id(1L).email("admin@test.com").build();
        Page<User> page = new PageImpl<>(List.of(user));
        when(userRepository.findAll((PageRequest) any())).thenReturn(page);

        Page<User> result = adminUserService.getAllUsers(0, 10);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testToggleUserStatus() {
        User user = User.builder().id(1L).isActive(true).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        adminUserService.toggleUserStatus(1L);

        assertFalse(user.isActive());
        verify(userRepository, times(1)).save(user);
    }
}
