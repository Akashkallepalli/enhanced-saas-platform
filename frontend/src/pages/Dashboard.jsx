import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, users: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const projects = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, { headers });
      const tasks = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, { headers });
      const users = await axios.get(`${import.meta.env.VITE_API_URL}/users`, { headers });

      setStats({
        projects: projects.data.count,
        tasks: tasks.data.count,
        users: users.data.count
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard-content">
        <h1>Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>{stats.projects}</h3>
              <p>Projects</p>
            </div>
            <div className="stat-card">
              <h3>{stats.tasks}</h3>
              <p>Tasks</p>
            </div>
            <div className="stat-card">
              <h3>{stats.users}</h3>
              <p>Team Members</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
