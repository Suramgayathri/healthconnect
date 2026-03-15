# Hospital Search Feature ✅

## What Was Changed

### 1. ✅ Updated Patient Dashboard
**Changed**: "Find Doctors" → "Find Hospitals"

**Locations Updated**:
- Sidebar menu: Now shows "Find Hospitals" with hospital icon
- Main button: Changed from "Book Appointment" to "Find Hospitals"

### 2. ✅ Created Hospital Search Page
**New File**: `hospital_search.html`

**Features**:
- Location-based search
- Geolocation support ("Use My Location" button)
- Manual location input
- Responsive hospital cards
- Distance display
- Hospital information (address, phone, rating)
- Services/specialties tags
- Action buttons (View Doctors, Get Directions)

### 3. ✅ Hospital Card Information

Each hospital card shows:
- **Hospital Name** - e.g., "City General Hospital"
- **Type** - Multi-Specialty, Emergency Care, etc.
- **Distance** - How far from your location (km)
- **Address** - Full street address
- **Phone Number** - Contact number
- **Rating** - Star rating (out of 5)
- **Services** - Available specialties/departments
- **Actions**:
  - View Doctors - See doctors at this hospital
  - Get Directions - Opens Google Maps

## Sample Hospitals Included

1. **City General Hospital** - Multi-Specialty
2. **Apollo Medical Center** - Super Specialty
3. **St. Mary's Hospital** - General Hospital
4. **HealthPlus Clinic** - Specialty Clinic
5. **Metro Emergency Hospital** - Emergency Care
6. **Children's Care Hospital** - Pediatric

## Features Implemented

### Geolocation
- ✅ "Use My Location" button
- ✅ Browser geolocation API
- ✅ Automatic distance calculation
- ✅ Fallback if location denied

### Search & Filter
- ✅ Manual location input
- ✅ Search on Enter key
- ✅ Sort by distance (nearest first)
- ✅ Loading state while searching

### Hospital Cards
- ✅ Beautiful gradient headers
- ✅ Hospital icon
- ✅ Distance badge
- ✅ Service tags
- ✅ Hover effects
- ✅ Clickable actions

### Integration
- ✅ View Doctors - Links to doctor search
- ✅ Get Directions - Opens Google Maps
- ✅ Responsive design
- ✅ Mobile-friendly

## Files Created

1. **src/main/resources/static/hospital_search.html**
   - Main hospital search page
   - Location search bar
   - Hospital grid layout

2. **src/main/resources/static/css/hospital_search.css**
   - Hospital card styles
   - Search box styles
   - Responsive grid
   - Loading animations

3. **src/main/resources/static/js/hospital_search.js**
   - Geolocation logic
   - Hospital data loading
   - Distance calculation
   - Card rendering
   - Action handlers

## Files Modified

1. **src/main/resources/static/patient_dashboard.html**
   - Changed sidebar: "Find Doctors" → "Find Hospitals"
   - Changed button: "Book Appointment" → "Find Hospitals"
   - Updated links to hospital_search.html

## How It Works

### 1. User Opens Hospital Search
```
Patient Dashboard → Click "Find Hospitals"
```

### 2. Location Detection
```
Option A: Click "Use My Location"
- Browser asks for permission
- Gets GPS coordinates
- Calculates distances
- Sorts by nearest

Option B: Type location manually
- Enter city/address
- Press Enter
- Shows hospitals in that area
```

### 3. View Hospital Details
```
Each card shows:
- Name, type, distance
- Address, phone, rating
- Available services
- Action buttons
```

### 4. Take Action
```
View Doctors → See doctors at this hospital
Get Directions → Opens Google Maps
```

## Testing Instructions

### 1. Access Hospital Search
```bash
# Start application
./mvnw spring-boot:run

# Login as patient
http://localhost:8080/login.html

# Go to dashboard
http://localhost:8080/patient_dashboard.html

# Click "Find Hospitals" button
```

### 2. Test Geolocation
```
1. Click "Use My Location"
2. Allow location access
3. See hospitals sorted by distance
```

### 3. Test Manual Search
```
1. Type a location in search box
2. Press Enter
3. See hospitals in that area
```

### 4. Test Hospital Actions
```
1. Click "View Doctors" → Goes to doctor search
2. Click "Get Directions" → Opens Google Maps
```

## Future Enhancements (Optional)

### Backend Integration
- Connect to real hospital database
- API endpoint: `/api/hospitals/nearby`
- Real-time distance calculation
- Filter by services/specialties

### Advanced Features
- Map view with markers
- Filter by hospital type
- Filter by services
- Sort by rating/distance
- Save favorite hospitals
- Emergency hospital indicator
- Bed availability status
- Insurance acceptance info

### Mobile Features
- Call hospital directly
- Share hospital info
- Save to contacts
- Navigation integration

## Production Considerations

### API Integration
```javascript
// Replace sample data with API call
async function loadHospitals() {
    const response = await fetch(
        `${API_BASE}/api/hospitals/nearby?lat=${lat}&lng=${lng}&radius=10`,
        { headers: authHeaders() }
    );
    const hospitals = await response.json();
    renderHospitals(hospitals);
}
```

### Database Schema
```sql
CREATE TABLE hospitals (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    type VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    phone VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(2, 1),
    services TEXT,
    created_at TIMESTAMP
);
```

All features working! Hospital search is now live. 🏥
