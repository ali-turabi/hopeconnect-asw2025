# HopeConnect – Supporting Orphaned Children in Gaza After War

HopeConnect is a backend API designed to facilitate donations, sponsorships, and support services for orphaned children in Gaza after the war. The platform connects donors, sponsors, and volunteers with orphanages and children in need. The system ensures transparency, security, and efficiency in managing resources—making sure donations reach the intended recipients.

---

## Features

### Core Features ✨

#### 1. Orphan Profiles & Sponsorships
- Every orphan has a personal profile: name, age, education status, and health condition.
- Users can sponsor an orphan with flexible donation models.
- Receive real-time updates on sponsored children’s well-being (photos, medical updates, education reports).

#### 2. Donation Management System
- Users can donate items or money (e.g., food, clothes, books).
- Multiple donation categories:
  - General Fund
  - Education Support
  - Medical Aid
- Seamless payment integration.
- Transparent donation tracking for donors.

#### 3. Volunteer & Service Matching
- Volunteers can register and offer services (mentoring, healthcare, teaching).
- Orphanages can request specific help.
- Matching engine connects volunteers with suitable tasks.

#### 4. Trust & Transparency
- Donor dashboard with fund usage and impact reports.
- All organizations verified to prevent fraud.
- Ratings and reviews for transparency.

#### 5. Emergency Support System
- Users get notified of urgent campaigns (e.g., medical emergencies).
- Can contribute directly to emergency cases.

#### 6. Logistics & Resource Distribution
- Real-time delivery tracking system.
- Pickup and delivery coordination for physical donations.

#### 7. Revenue Model & Sustainability
- Small transaction fees to support operational costs.
- NGO and charity partnerships to ensure project continuity.

---

## Additional Features ⭐

- **User Privacy and Data Security**: Passwords encrypted using Argon2.
- **Role-Based Access**:
  - **Admin**: Manages platform and users.
  - **User**: Donates and sponsors.
  - **Volunteer**: Offers services.
  - **Orphanage**: Posts needs and updates.
- **Error Handling and Logging**: Centralized logging and API error middleware.

---

## External APIs 🧩

### OpenCage Geocoder API  
**Purpose**: Location tracking for donations and deliveries.  
**Usage**: Convert address to coordinates for mapping and delivery logic.

### Nodemailer  
**Purpose**: Automated email system.  
**Usage**: Notify users about donations, sponsorships, and emergencies.

---

## Tools and Libraries 🛠️

- Node.js  
- Express.js  
- MySQL  
- Sequelize ORM  
- JWT  
- Argon2  
- Express Validator  
- Nodemailer  
- Postman (API Docs)  
- Git & GitHub  

---

## API Documentation 📄

You can explore and test our API using [Postman Documentation](#)  
*(Replace `#` with actual link when ready)*

---

## Getting Started 🚀

Follow these steps to set up the project on your local machine:

### 1. Clone the Repository

```bash
git clone https://github.com/ali-turabi/hopeconnect-asw2025.git
cd hopeconnect-asw2025
 ```

### 2. Ensure the following environment variables are set to run the application:
```bash
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN_DAYS=
EMAIL_USERNAME=
EMAIL_PASSWORD=
DB_HOST=
DB_USER=
DB_PASS=
DB_PORT=
```

### 3. Install Dependencies

```bash
npm i
```

### 4. make sure from existing database file

```bash
```

### 5. Run the Application

```bash
nodemon app
```

## For More Details

If you want to read more specific details about the project, you can jump to our [Wiki](https://your-wiki-link.com).


