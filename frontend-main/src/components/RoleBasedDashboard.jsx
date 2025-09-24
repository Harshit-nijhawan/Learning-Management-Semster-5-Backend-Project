import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';

function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading...</p>;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <p>No dashboard available for this role.</p>;
  }
}

export default RoleBasedDashboard;
