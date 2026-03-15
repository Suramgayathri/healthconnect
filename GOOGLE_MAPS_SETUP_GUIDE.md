# Google Maps API Setup Guide 🗺️

## Why Google Maps API?

The hospital search now uses **Google Places API** to show REAL hospitals near you, not hardcoded data!

## Features You Get:

✅ **Real Hospitals** - Actual hospitals from Google Maps
✅ **Accurate Distances** - Real distance calculations
✅ **Live Data** - Current ratings, reviews, open/closed status
✅ **Directions** - Direct link to Google Maps navigation
✅ **Geocoding** - Search by any address/city

## Setup Instructions (FREE)

### Step 1: Get Google Maps API Key (FREE)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a Project** (if you don't have one)
   - Click "Select a project" → "New Project"
   - Name it: "HealthConnect"
   - Click "Create"

3. **Enable APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable these APIs:
     - ✅ **Maps JavaScript API**
     - ✅ **Places API**
     - ✅ **Geocoding API**

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key (looks like: `AIzaSyD...`)

5. **Restrict API Key** (Important for security)
   - Click on your API key
   - Under "Application restrictions":
     - Select "HTTP referrers"
     - Add: `http://localhost:8080/*`
     - Add: `http://localhost:*` (for testing)
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose: Maps JavaScript API, Places API, Geocoding API
   - Click "Save"

### Step 2: Add API Key to Your Project

Open `src/main/resources/static/hospital_search.html` and replace:

```html
<!-- Change this line: -->
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>

<!-- To this (with your actual key): -->
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD...YOUR_ACTUAL_KEY...&libraries=places"></script>
```

### Step 3: Test It!

```bash
# Start your application
./mvnw spring-boot:run

# Open browser
http://localhost:8080/hospital_search.html

# Click "Use My Location"
# Allow location access
# See REAL hospitals near you!
```

## Free Tier Limits

Google Maps API is **FREE** for most use cases:

| API | Free Monthly Quota | Cost After |
|-----|-------------------|------------|
| Maps JavaScript API | $200 credit | $7 per 1000 loads |
| Places API | $200 credit | $17 per 1000 requests |
| Geocoding API | $200 credit | $5 per 1000 requests |

**$200 free credit = ~28,000 map loads per month!**

For a small project, you'll likely never pay anything.

## What You'll See Now

### Before (Hardcoded):
```
❌ Same 6 fake hospitals everywhere
❌ Random distances
❌ No real data
```

### After (Real Google Data):
```
✅ Actual hospitals in your city
✅ Real distances from your location
✅ Live ratings and reviews
✅ Open/Closed status
✅ Real addresses
✅ Direct navigation to Google Maps
```

## Example Output

When you click "Use My Location" in Mumbai:
```
🏥 Lilavati Hospital - 1.2 km away
   4.5 ⭐ (2,341 reviews)
   ● Open Now
   
🏥 Breach Candy Hospital - 2.8 km away
   4.3 ⭐ (1,892 reviews)
   ● Open Now
   
🏥 Jaslok Hospital - 3.5 km away
   4.4 ⭐ (1,567 reviews)
   ● Closed
```

## Features Implemented

### 1. Geolocation
- Uses browser GPS
- Gets your exact coordinates
- Searches within 10km radius

### 2. Google Places Search
- Searches for type: "hospital"
- Returns up to 20 nearest hospitals
- Sorted by distance

### 3. Real Data
- Hospital names from Google
- Actual addresses
- Real ratings and review counts
- Open/closed status
- Accurate distances (Haversine formula)

### 4. Actions
- **Get Directions** - Opens Google Maps navigation
- **View on Map** - Shows hospital location on map

### 5. Manual Search
- Type any city/address
- Press Enter
- Geocodes location
- Finds hospitals there

## Troubleshooting

### "Google is not defined" error
- Make sure API key is added to HTML
- Check browser console for errors
- Verify APIs are enabled in Google Cloud

### No hospitals showing
- Check if location permission is granted
- Try manual search with city name
- Verify API key restrictions allow localhost

### "This page can't load Google Maps correctly"
- API key might be invalid
- Check if billing is enabled (even for free tier)
- Verify API restrictions

## Alternative: Free OpenStreetMap

If you don't want to use Google Maps, you can use OpenStreetMap (completely free, no API key needed):

**Pros:**
- ✅ Completely free
- ✅ No API key needed
- ✅ No usage limits

**Cons:**
- ❌ Less hospital data
- ❌ No ratings/reviews
- ❌ Less accurate

Let me know if you want the OpenStreetMap version instead!

## Security Best Practices

1. **Never commit API key to Git**
   - Add to `.gitignore`
   - Use environment variables in production

2. **Restrict API key**
   - Limit to your domain
   - Restrict to specific APIs

3. **Monitor usage**
   - Check Google Cloud Console
   - Set up billing alerts

## Production Deployment

For production, use environment variables:

```javascript
// In production
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
```

Or use a backend proxy to hide the key.

---

**Ready to see real hospitals?** Just add your API key and test! 🚀
