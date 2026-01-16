# 🏗️ InfraBeacon

**Mobile-First Public Infrastructure Reporting Web App**

InfraBeacon enables citizens to report public infrastructure issues (potholes, broken lights, garbage, waterlogging) using geotagged images. The app uses AI to automatically analyze and classify issues, prevents duplicate reports, and visualizes issue density using maps and heatmaps.

## 🌟 Features

- **Mobile-First UI**: Touch-friendly interface optimized for phone cameras
- **AI-Powered Analysis**: Gemini Vision API detects issue types and severity
- **Duplicate Prevention**: Geo-based checking within 15m radius
- **Interactive Maps**: Google Maps with marker clusters and heatmaps
- **Admin Dashboard**: Manage, filter, and update report statuses
- **Secure Admin Access**: Firebase Authentication for admin login
- **PWA Support**: Progressive Web App for offline-capable experience

## 🛠️ Tech Stack (Google Cloud)

| Component | Technology |
|-----------|------------|
| Backend | Python + Flask |
| Hosting | Google Cloud Run |
| Database | Google Cloud Firestore |
| Image Storage | Google Cloud Storage |
| Maps & Heatmaps | Google Maps JavaScript API |
| AI / Vision | Google Gemini Vision API |
| Authentication | Firebase Authentication |
| Logging | Google Cloud Logging |

## 📁 Project Structure

```
infrabeacon/
├── app.py                  # Flask app entry point
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── cloudbuild.yaml        # Cloud Build deployment config
├── routes/
│   ├── report_routes.py   # Report submission endpoints
│   ├── map_routes.py      # Map visualization endpoints
│   ├── admin_routes.py    # Admin dashboard endpoints (protected)
│   └── auth_routes.py     # Authentication endpoints
├── services/
│   ├── firestore_service.py  # Database operations
│   ├── storage_service.py    # Cloud Storage operations
│   ├── gemini_service.py     # AI analysis service
│   └── auth_service.py       # Firebase Authentication service
├── templates/
│   ├── index.html         # Landing page
│   ├── report.html        # Report submission page
│   ├── map.html           # Map visualization page
│   ├── admin.html         # Admin dashboard (requires login)
│   └── login.html         # Admin login page
└── static/
    ├── css/style.css      # Mobile-first styles
    ├── js/app.js          # Main JavaScript
    └── manifest.json      # PWA manifest
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Google Cloud account with billing enabled
- Google Maps API key
- Gemini API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/infrabeacon.git
   cd infrabeacon
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or: venv\Scripts\activate  # Windows
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**
   ```bash
   export GOOGLE_CLOUD_PROJECT="your-project-id"
   export GCS_BUCKET="your-bucket-name"
   export GOOGLE_MAPS_API_KEY="your-maps-api-key"
   export GEMINI_API_KEY="your-gemini-api-key"
   export SECRET_KEY="your-secret-key"
   export FIREBASE_API_KEY="your-firebase-api-key"
   export FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   export ADMIN_EMAILS="admin1@example.com,admin2@example.com"  # Optional
   ```

5. **Run the app**
   ```bash
   python app.py
   ```

6. **Open in browser**
   ```
   http://localhost:8080
   ```

### Deploy to Cloud Run

1. **Enable required APIs**
   ```bash
   gcloud services enable run.googleapis.com \
       cloudbuild.googleapis.com \
       firestore.googleapis.com \
       storage.googleapis.com
   ```

2. **Create Firestore database**
   ```bash
   gcloud firestore databases create --region=us-central1
   ```

3. **Create Cloud Storage bucket**
   ```bash
   gsutil mb -l us-central1 gs://your-bucket-name
   gsutil iam ch allUsers:objectViewer gs://your-bucket-name
   ```

4. **Deploy using Cloud Build**
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

5. **Set environment variables in Cloud Run**
   ```bash
   gcloud run services update infrabeacon \
       --set-env-vars="GCS_BUCKET=your-bucket-name" \
       --set-env-vars="GOOGLE_MAPS_API_KEY=your-key" \
       --set-env-vars="GEMINI_API_KEY=your-key" \
       --region=us-central1
   ```

## 📝 API Endpoints

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports` | List all reports |
| POST | `/api/reports` | Create new report |
| GET | `/api/reports/<id>` | Get report by ID |
| GET | `/api/reports/nearby?lat=&lng=&radius=` | Find nearby reports |

### Maps

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/map/api/markers` | Get map markers |
| GET | `/map/api/heatmap` | Get heatmap data |
| GET | `/map/api/stats` | Get statistics |
| GET | `/map/api/clusters` | Get clustered data |

### Admin (Protected - Requires Login)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/api/reports` | List reports with filters |
| PATCH | `/admin/api/reports/<id>` | Update report |
| DELETE | `/admin/api/reports/<id>` | Delete report |
| POST | `/admin/api/reports/<id>/verify` | Verify report |
| POST | `/admin/api/reports/<id>/resolve` | Resolve report |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/login` | Admin login page |
| POST | `/auth/api/verify-token` | Verify Firebase token |
| GET | `/auth/logout` | Logout admin |
| GET | `/auth/api/session` | Check login status |

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CLOUD_PROJECT` | GCP Project ID | Yes |
| `GCS_BUCKET` | Cloud Storage bucket name | Yes |
| `GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `SECRET_KEY` | Flask secret key | Yes (production) |
| `FIREBASE_API_KEY` | Firebase Web API key | Yes (for admin login) |
| `FIREBASE_AUTH_DOMAIN` | Firebase Auth domain (e.g., project.firebaseapp.com) | Yes (for admin login) |
| `ADMIN_EMAILS` | Comma-separated list of admin emails | Yes (for admin login) |
| `PORT` | Server port (default: 8080) | No |

## 📊 Firestore Schema

### Collection: `reports`

```javascript
{
  id: string,           // Auto-generated document ID
  image_url: string,    // Cloud Storage URL
  latitude: float,      // GPS latitude
  longitude: float,     // GPS longitude
  geohash: string,      // Geohash for geo-queries
  issue_type: string,   // pothole | broken_light | garbage | waterlogging | other
  severity: string,     // low | medium | high
  description: string,  // AI or user description
  status: string,       // new | verified | resolved
  created_at: timestamp,
  updated_at: timestamp,
  ai_analyzed: boolean,
  ai_confidence: float
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Google Cloud technologies
- Designed for the Google Hackathon
- Inspired by civic technology initiatives worldwide
