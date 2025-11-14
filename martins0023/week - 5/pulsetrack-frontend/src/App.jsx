import React, { useState } from 'react';
import './App.css';
import apiService from './api/apiService';

// Import all components
import UserSelector from './components/UserSelector';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import MealForm from './components/MealForm';
import MealList from './components/MealList';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import DoctorForm from './components/DoctorForm';
import DoctorList from './components/DoctorList';
import ReportGenerator from './components/ReportGenerator';
import ReportList from './components/ReportList';
import ReportModal from './components/ReportModal';
// (You'll need to create Meal, Appointment, and Doctor components
// using the Activity components as a template)

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // State to trigger list refreshes
  const [refreshKey, setRefreshKey] = useState(0);
  
  // State for the report modal
  const [modalReportData, setModalReportData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // This simple "refresh" works by changing a key, forcing useEffect to re-run
  const handleRefresh = () => setRefreshKey(key => key + 1);

  // Fetch full report data for the modal
  const handleViewReport = async (reportId) => {
    setModalLoading(true);
    try {
      const res = await apiService.getReportById(reportId);
      setModalReportData(res.data);
    } catch (err) {
      console.error("Failed to fetch report details:", err);
      // You could set an error state here
    }
    setModalLoading(false);
  };

  const handleCloseModal = () => {
    setModalReportData(null);
  };

  return (
    <div className="App">
      <header>
        <h1>PulseTrack Health Ecosystem</h1>
        <UserSelector onUserSelect={setSelectedUserId} />
      </header>

      {!selectedUserId ? (
        <h2 className="select-user-prompt">Please select a user to begin.</h2>
      ) : (
        <>
          <nav className="app-nav">
            <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'active' : ''}>Dashboard</button>
            <button onClick={() => setActiveTab('appointments')} className={activeTab === 'appointments' ? 'active' : ''}>Appointments</button>
            <button onClick={() => setActiveTab('doctors')} className={activeTab === 'doctors' ? 'active' : ''}>Doctors</button>
            <button onClick={() => setActiveTab('reports')} className={activeTab === 'reports' ? 'active' : ''}>Reports</button>
          </nav>

          <main>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="tab-content">
                <div className="grid-col-2">
                  <ActivityForm userId={selectedUserId} onNewActivity={handleRefresh} />
                  <ActivityList userId={selectedUserId} refreshKey={refreshKey} />
                </div>
                <hr />
                <div className="grid-col-2">
                  {/* Create MealForm and MealList like ActivityForm/List */}
                  <MealForm userId={selectedUserId} onNewMeal={handleRefresh} />
                  <MealList userId={selectedUserId} refreshKey={refreshKey} />
                  
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="tab-content">
                <div className="grid-col-2">
                  <AppointmentForm userId={selectedUserId} onNewAppointment={handleRefresh} />
                  <AppointmentList userId={selectedUserId} refreshKey={refreshKey} />
                </div>
              </div>
            )}
            
            {/* Doctors Tab (Doesn't depend on user) */}
            {activeTab === 'doctors' && (
              <div className="tab-content">
                <div className="grid-col-2">
                  <DoctorForm onNewDoctor={handleRefresh} />
                  <DoctorList refreshKey={refreshKey} />
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="tab-content">
                <div className="grid-col-2">
                  <ReportGenerator userId={selectedUserId} onReportGenerated={handleRefresh} />
                  <ReportList userId={selectedUserId} refreshKey={refreshKey} onViewReport={handleViewReport} />
                </div>
              </div>
            )}
          </main>
        </>
      )}
      
      <ReportModal report={modalReportData} onClose={handleCloseModal} />
    </div>
  );
}

export default App;