# HealthConnect - Digital Clinic Management System

## 📋 Project Description

HealthConnect is a comprehensive digital clinic management system built with Spring Boot that streamlines healthcare operations. The platform enables efficient management of patient appointments, medical records, doctor schedules, and administrative tasks for digital clinics.

### Key Features
- **Patient Management**: Complete patient profiles with medical history
- **Appointment Scheduling**: Online booking and management system
- **Doctor Dashboard**: Schedule management and patient consultations
- **Medical Records**: Secure storage and access to patient records
- **Payment Integration**: Integrated payment processing for consultations
- **Real-time Notifications**: WebSocket-based notifications for updates
- **Admin Panel**: System administration and analytics
- **Security**: JWT-based authentication and role-based access control

## 🛠 Technology Stack

### Backend
- **Java**: 21 LTS
- **Spring Boot**: 3.2.3
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database operations
- **Spring WebSocket**: Real-time communication
- **MySQL**: Primary database
- **JWT**: Token-based authentication
- **Maven**: Build and dependency management

### Frontend
- **Thymeleaf**: Server-side templating
- **HTML5/CSS3**: Responsive UI
- **JavaScript/jQuery**: Client-side interactions
- **WebJars**: Client-side dependencies
- **Chart.js**: Data visualization

### Development Tools
- **Git**: Version control
- **Postman**: API testing
- **Swagger**: API documentation

## 🚀 Setup Instructions

### Prerequisites
- Java 21 LTS or higher
- MySQL 8.0 or higher
- Maven 3.9+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOURUSERNAME/healthconnect.git
   cd healthconnect
   ```

2. **Database Setup**
   - Create a MySQL database named `healthconnect`
   - Update database credentials in `src/main/resources/application.yml`

3. **Build the project**
   ```bash
   ./mvnw clean install
   ```

4. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:8080`
   - Default admin credentials: Check `HELP.md` for details

## 📖 API Documentation

The API documentation is available via Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

For detailed API endpoints, refer to `API_ENDPOINTS.md`

## 🖼 Screenshots

### Dashboard
![Dashboard Screenshot](screenshots/dashboard.png)

### Appointment Booking
![Appointment Screenshot](screenshots/appointment.png)

### Admin Panel
![Admin Screenshot](screenshots/admin.png)

*Screenshots will be added during development*

## 📁 Project Structure

```
healthconnect/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/healthconnect/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── model/
│   │   │       └── config/
│   │   └── resources/
│   │       ├── static/
│   │       ├── templates/
│   │       └── application.yml
│   └── test/
├── .gitignore
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Check `HELP.md` for common issues
- Review `LOCAL_RUN_INSTRUCTIONS.md` for detailed setup
- Contact the development team

---

**HealthConnect** - Transforming healthcare management through technology.