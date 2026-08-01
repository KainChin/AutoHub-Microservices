import React from 'react';

export default function NavigationTabs({ activeTab, onTabChange }) {
  return (
    <nav className="nav-tabs">
      <button className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => onTabChange('customers')}>
        <i className="fa-solid fa-user-group"></i> Customers
      </button>
      <button className={`tab-btn ${activeTab === 'cars' ? 'active' : ''}`} onClick={() => onTabChange('cars')}>
        <i className="fa-solid fa-car"></i> Cars & Sales
      </button>
      <button className={`tab-btn ${activeTab === 'garage' ? 'active' : ''}`} onClick={() => onTabChange('garage')}>
        <i className="fa-solid fa-screwdriver-wrench"></i> Service Tickets
      </button>
      <button className={`tab-btn ${activeTab === 'parts' ? 'active' : ''}`} onClick={() => onTabChange('parts')}>
        <i className="fa-solid fa-box-open"></i> Spare Parts
      </button>
    </nav>
  );
}
