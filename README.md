# Hilly Agency

Hilly Agency is a comprehensive platform for managing tourism services. It allows service providers to list their services, manage bookings, and receive real-time notifications. Customers can browse services, book them, and leave reviews.

---

## 🌟 About the Author

Hilly Agency is developed and maintained by **IwmVictor**, a software designer and developer specializing in frontend web development, UI/UX design, and graphic design.

- **GitHub**: [@iwmvictor](https://github.com/iwmvictor)
- **Instagram**: [@iwmvictor](https://instagram.com/iwmvictor)
- **Twitter**: [@iwmvictor](https://twitter.com/iwmvictor)
- **YouTube**: [@iwmvictor](https://youtube.com/@iwmvictor)
- **Portfolio**: [iwmvictor.vercel.app](https://iwmvictor.vercel.app)

---

## 🚀 Features

### For Customers:
- **Browse Services**: View various tourism services categorized by type and location.
- **Service Booking**: Book services with a detailed form that includes date, time, and pricing.
- **Reviews & Ratings**: Leave reviews for services you’ve used and see ratings from other users.
- **Real-time Notifications**: Receive updates on booking statuses, messages, and system announcements.

### For Providers:
- **Manage Services**: Add, edit, and remove services.
- **Booking Management**: View and manage bookings, including accepting or declining requests.
- **Real-time Notifications**: Get instant updates when a new booking is made or when a review is posted.
- **Provider Dashboard**: View statistics, manage services, and bookings through an easy-to-use dashboard.

### For Admins:
- **User Management**: Manage users by changing their roles (client/provider/admin).
- **Booking Management**: View and manage all bookings across the platform.
- **Statistics Dashboard**: Monitor the platform’s overall performance, including active users, providers, and bookings.

---

## 🛠️ Technologies Used

- **Frontend**:
  - React.js
  - TypeScript
  - Tailwind CSS
  - Supabase (for authentication and real-time database functionality)
  - Zustand (for state management)

- **Backend**:
  - Supabase (PostgreSQL, Real-time Database, Authentication)

- **Deployment**:
  - Vercel (for frontend deployment)
  - Supabase (for backend and database)

---

## 📝 Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
2. **npm** (v6 or higher)
3. **Supabase Account** for backend setup

### Local Development Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/iwmvictor/hilly-agency.git
    cd hilly-agency
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up your Supabase environment:
    - Create a Supabase project at [https://app.supabase.io](https://app.supabase.io)
    - Set up your authentication, database, and real-time subscriptions.
    - Create a `.env` file in the root of your project and add the following:

    ```bash
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4. Start the development server:

    ```bash
    npm run dev
    ```

5. Visit `http://localhost:3000` in your browser.

---

## 🗃️ Database Setup

- Migrations for the profiles, bookings, and reviews tables have been set up using Supabase.
- Admin credentials can be automatically created if none exist in the database.

---

## 🔧 Available Scripts

- `npm run dev`: Starts the development server on `http://localhost:3000`.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production build server.
- `npm run lint`: Runs the linting script for code quality checks.
- `npm run format`: Formats the code using Prettier.

---

## 🚀 Deployment

This project is deployed using Vercel for the frontend and Supabase for the backend. To deploy your version:

1. **Frontend**: Push your code to GitHub, then link your GitHub repository to Vercel and deploy.
2. **Backend**: Set up your Supabase project, configure the necessary tables and authentication, and connect the frontend with the Supabase environment variables.

---

## 📅 Roadmap

Future enhancements to the platform may include:
- Adding more granular role-based access control.
- Implementing multi-language support.
- Expanding the review and rating system with advanced filtering options.
- Introducing payment integration for bookings.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a pull request.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
