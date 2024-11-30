
# Civil Air Patrol Route Planner

## **Purpose**

The Civil Air Patrol Route Planner is a web application designed to assist civil aviation pilots in creating planning material for training exercises and missions. The app enables users to:
- Add, reorder, rename, and remove Points of Interest (POIs).
- Visualize a route connecting the POIs on an interactive map.
- Generate a flight log with detailed leg information and export it as a professional-grade PDF, complete with satellite imagery and route details.
- Plan routes with coordinates displayed in aviation-friendly formats (degrees and minutes).

This tool streamlines the exercise planning, and prepares pilots for navigation tasks.

---

## **Stack**

### **Frontend**
- **React**: Core framework for building the interactive user interface.
- **Material-UI (MUI)**: Provides modern, responsive UI components.
- **Google Maps API**: Used for map rendering, place search, route visualization, and satellite imagery.

### **Utilities**
- **UUID**: Generates unique identifiers for POIs.
- **jsPDF**: Creates downloadable PDFs for route export.
- **uuid**: Ensures unique identifiers for POIs.

---

## **How to Run**

### **Prerequisites**
1. **Node.js**: Install [Node.js](https://nodejs.org/) (LTS version recommended).
2. **Google Maps API Key**: Obtain an API key from [Google Cloud Console](https://console.cloud.google.com/).

### **Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/cap-route-planner.git
   cd cap-route-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add your Google Maps API Key:
     ```env
     REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
     ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## **Features**

### **1. POI Management**
- Search and add POIs using the Google Maps Places API.
- Reorder POIs via drag-and-drop.
- Rename POIs for specific task references.
- Remove unwanted POIs.

### **2. Route Visualization**
- Visualize routes as polylines connecting POIs on an interactive Google Map.
- Automatically adjusts the map bounds to fit all POIs.

### **3. PDF Export**
- Generate a PDF containing:
  - Route overview map.
  - Leg details (distance, heading).
  - Satellite imagery of each POI with coordinates.
- Save PDFs for offline navigation preparation.

### **4. Coordinate Display**
- Display latitude and longitude in aviation-friendly format (degrees and minutes).

---

## **Project Structure**

```plaintext
src/
├── components/
│   ├── MapContainer.js      # Main container for the map and app logic
│   ├── MapView.js           # Renders the Google Map
│   ├── POIList.js           # Handles POI management
│   ├── POIItem.js           # Represents a single POI in the list
│   ├── FlightInfo.js        # Displays flight metrics (total distance, speed)
│   ├── LegDetails.js        # Displays detailed leg information
│   ├── PDFGenerator.js      # Handles PDF generation
├── context/
│   └── MapContext.js        # Provides context for managing map and POI data
├── hooks/
│   ├── useGoogleMap.js      # Initializes and provides the Google Map instance
│   ├── usePDFGenerator.js   # Handles PDF export logic
├── utils/
│   ├── staticMap.js         # Helper for generating static map URLs
│   ├── convertBlobToBase64.js # Helper for converting blob to Base64 for PDFs
│   ├── formatCoordinates.js # Helper for formatting coordinates
├── App.js                   # Main application component
├── index.js                 # Application entry point
```

---

## **Customization**

### **1. Change Default Route Name**
Modify the default route name in `PDFGenerator.js`:
```javascript
const [routeName, setRouteName] = useState('Route 1');
```

### **2. Adjust Map Settings**
Update map configuration in `useGoogleMap.js`:
```javascript
const mapOptions = {
    center: { lat: 39.8283, lng: -98.5795 }, // Default center (USA)
    zoom: 4, // Default zoom level
};
```

---

## **Future Enhancements**
- Add user authentication for saving routes.
- Enable collaborative route planning.
- Provide weather overlays on the map.
- Include support for waypoints with custom icons.

---

## **Contributing**
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/new-feature
   ```
5. Create a pull request.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## **Acknowledgments**
- Google Maps Platform for providing the APIs.
- Material-UI for the UI components.
- Civil Air Patrol for inspiring the project.
