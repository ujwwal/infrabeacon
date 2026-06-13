import React, { useState } from 'react';
import NeumorphicCard from './components/NeumorphicCard';
import NeumorphicButton from './components/NeumorphicButton';
import {
  BeaconIcon,
  SearchIcon,
  CameraIcon,
  PinIcon,
  BellIcon,
  UserIcon,
  ClockIcon,
  WarningIcon,
  StreetlightIcon,
  MailIcon,
  SyncIcon,
  PlusIcon,
  LockIcon,
  UnlockIcon,
  TrashIcon
} from './components/Icons';
import './index.css';

// SVG Mock Photo Components
const PotholePhoto = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ display: 'block' }}>
    <rect width="100%" height="100%" fill="#78909C" />
    <circle cx="50" cy="55" r="30" fill="#37474F" />
    <path d="M 35 48 Q 42 53 48 45 Q 56 38 62 58 Q 50 68 35 48 Z" fill="#212121" />
    <path d="M 15 25 L 32 30" stroke="#FFD54F" strokeWidth="4" />
    <path d="M 68 75 L 85 80" stroke="#FFD54F" strokeWidth="4" />
  </svg>
);

const StreetlightPhoto = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ display: 'block' }}>
    <rect width="100%" height="100%" fill="#1A237E" />
    <rect x="47" y="35" width="6" height="65" fill="#78909C" />
    <path d="M38 35 Q50 18 62 35 Z" fill="#CFD8DC" />
    <circle cx="50" cy="45" r="25" fill="#FFF59D" fillOpacity="0.4" />
    <circle cx="50" cy="38" r="9" fill="#FFFDE7" />
  </svg>
);

const GarbagePhoto = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ display: 'block' }}>
    <rect width="100%" height="100%" fill="#5D4037" />
    <path d="M32 45 L37 90 L63 90 L68 45 Z" fill="#2E7D32" />
    <rect x="27" y="37" width="46" height="8" rx="3" fill="#1B5E20" />
    <circle cx="44" cy="30" r="11" fill="#212121" />
    <circle cx="56" cy="28" r="10" fill="#424242" />
    <path d="M 32 35 C 32 22 42 27 46 30 Z" fill="#212121" />
  </svg>
);

const DrainagePhoto = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ display: 'block' }}>
    <rect width="100%" height="100%" fill="#455A64" />
    <rect x="22" y="22" width="56" height="56" rx="4" fill="#263238" />
    <line x1="32" y1="28" x2="32" y2="72" stroke="#78909C" strokeWidth="5" />
    <line x1="41" y1="28" x2="41" y2="72" stroke="#78909C" strokeWidth="5" />
    <line x1="50" y1="28" x2="50" y2="72" stroke="#78909C" strokeWidth="5" />
    <line x1="59" y1="28" x2="59" y2="72" stroke="#78909C" strokeWidth="5" />
    <line x1="68" y1="28" x2="68" y2="72" stroke="#78909C" strokeWidth="5" />
    <path d="M 10 88 Q 30 83 50 88 T 90 88" stroke="#80DEEA" strokeWidth="3" fill="none" opacity="0.6" />
  </svg>
);

const GenericPhoto = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ display: 'block' }}>
    <rect width="100%" height="100%" fill="#B0BEC5" />
    <circle cx="50" cy="50" r="18" fill="#90A4AE" />
    <circle cx="50" cy="50" r="8" fill="#78909C" />
    <rect x="35" y="32" width="30" height="6" rx="2" fill="#78909C" />
  </svg>
);

// Map Grid Component with street lines and customizable marker
const MiniMap = ({ lat = 50, lng = 50 }) => (
  <div style={{
    width: '76px',
    height: '76px',
    borderRadius: '18px',
    overflow: 'hidden',
    border: '1.5px solid var(--shadow-dark)',
    boxShadow: 'var(--shadow-pressed)',
    position: 'relative',
    backgroundColor: '#E5EFEA',
    flexShrink: 0
  }}>
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <rect width="100%" height="100%" fill="#E3ECE6" />
      <path d="M 0 0 Q 30 20 45 0 Z" fill="#D2E3D8" />
      <path d="M 55 100 Q 75 75 100 85 L 100 100 Z" fill="#D2E3D8" />
      <path d="M -10 35 L 110 50" stroke="#FFFFFF" strokeWidth="7" fill="none" />
      <path d="M 35 -10 L 60 110" stroke="#FFFFFF" strokeWidth="7" fill="none" />
      <path d="M 80 -10 L 80 110" stroke="#FFFFFF" strokeWidth="5" fill="none" />
      <path d="M -10 75 Q 45 70 110 80" stroke="#FFFFFF" strokeWidth="5" fill="none" />
      <circle cx={lat} cy={lng} r="8" fill="#E57373" fillOpacity="0.35" />
      <path d={`M${lat} ${lng - 10} C${lat - 5} ${lng - 10} ${lat - 9} ${lng - 6} ${lat - 9} ${lng - 1} C${lat - 9} 5 ${lat} 14 ${lat} 14 C${lat} 14 ${lat + 9} 5 ${lat + 9} ${lng - 1} C${lat + 9} ${lng - 6} ${lat + 5} ${lng - 10} ${lat} ${lng - 10} Z`} fill="#E53935" />
      <circle cx={lat} cy={lng - 2} r="2.5" fill="#FFFFFF" />
    </svg>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, map, notifications, profile, admin, report, admin-login
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reporting Camera State
  const [cameraViewfinder, setCameraViewfinder] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null); // 'pothole', 'light', 'garbage', 'drainage', null
  const [formTitle, setFormTitle] = useState('Pothole');
  const [formLocation, setFormLocation] = useState('');

  // Geotagging State
  const [isGeotagging, setIsGeotagging] = useState(false);
  const [geotagged, setGeotagged] = useState(false);

  // Admin Dashboard States
  const [adminSubView, setAdminSubView] = useState('list'); // list, map
  const [adminFilterStatus, setAdminFilterStatus] = useState('All');
  const [adminFilterType, setAdminFilterType] = useState('All');
  const [adminFilterSeverity, setAdminFilterSeverity] = useState('All');
  const [adminSortOption, setAdminSortOption] = useState('date-desc');

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTicketFormIssueId, setActiveTicketFormIssueId] = useState(null);
  const [activeResolveFormIssueId, setActiveResolveFormIssueId] = useState(null);
  const [formSeverity, setFormSeverity] = useState('Medium');

  // New Admin panel simulation states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [activeMapPopup, setActiveMapPopup] = useState(null);
  const [activeImageModal, setActiveImageModal] = useState(null);

  // List of issues state
  const [issues, setIssues] = useState([
    {
      id: 1,
      title: 'Pothole',
      location: '12 Main St',
      time: 'Reported 2h ago',
      reporter: 'Sarah J.',
      status: 'Submitted',
      upvotes: 14,
      hasUpvoted: false,
      lat: 48,
      lng: 48,
      photoType: 'pothole',
      ticket: null,
      severity: 'High'
    },
    {
      id: 2,
      title: 'Broken Streetlight',
      location: '45 Oak Ave',
      time: 'Reported 5h ago',
      reporter: 'Mike L.',
      status: 'In Progress',
      upvotes: 14,
      hasUpvoted: false,
      lat: 72,
      lng: 52,
      photoType: 'light',
      severity: 'Medium',
      ticket: {
        ticketId: 'TK-4821',
        department: 'Roads & Traffic',
        priority: 'Medium',
        scheduledDate: '2026-06-16',
        notes: 'Replace the cracked LED luminaire and verify connection.'
      }
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Pothole on 12 Main St status updated to "In Progress".', time: '10m ago', unread: true },
    { id: 2, text: 'Your report "Broken Streetlight" has been approved.', time: '2h ago', unread: false },
    { id: 3, text: 'New issue reported: Garbage Pile near Pine Park.', time: '1d ago', unread: false }
  ]);

  const handleUpvote = (id) => {
    setIssues(issues.map(issue => {
      if (issue.id === id) {
        const hasUpvoted = !issue.hasUpvoted;
        return {
          ...issue,
          hasUpvoted,
          upvotes: hasUpvoted ? issue.upvotes + 1 : issue.upvotes - 1
        };
      }
      return issue;
    }));
  };

  const triggerGeotagging = () => {
    setIsGeotagging(true);
    setGeotagged(false);
    setTimeout(() => {
      setIsGeotagging(false);
      setGeotagged(true);
      const mockAddresses = [
        '88 Pine Crest Blvd',
        '104 Elmwood Ave',
        '15 Maple Rd',
        '242 Riverdale Rd',
        '67 Oak Ridge Ln',
        '302 Sycamore Dr'
      ];
      const selectedAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
      setFormLocation(selectedAddress + ' (Geotagged)');
    }, 1800);
  };

  const handleAddIssue = (e) => {
    e.preventDefault();
    if (!formLocation.trim()) return;

    let finalPhoto = capturedPhoto;
    if (!finalPhoto) {
      if (formTitle.toLowerCase().includes('light')) finalPhoto = 'light';
      else if (formTitle.toLowerCase().includes('garbage')) finalPhoto = 'garbage';
      else if (formTitle.toLowerCase().includes('drainage')) finalPhoto = 'drainage';
      else finalPhoto = 'pothole';
    }

    const newIssue = {
      id: Date.now(),
      title: formTitle,
      location: formLocation,
      time: 'Reported just now',
      reporter: 'Alex M.',
      status: 'Submitted',
      upvotes: 0,
      hasUpvoted: false,
      lat: 35 + Math.random() * 45,
      lng: 35 + Math.random() * 45,
      photoType: finalPhoto,
      ticket: null,
      severity: formSeverity
    };

    setIssues([newIssue, ...issues]);
    
    // Add notification
    setNotifications([
      { id: Date.now(), text: `You reported a new issue: "${formTitle}" at ${formLocation}.`, time: 'Just now', unread: true },
      ...notifications
    ]);

    // Reset Form
    setFormLocation('');
    setCapturedPhoto(null);
    setGeotagged(false);
    setIsGeotagging(false);
    setFormSeverity('Medium');
    setActiveTab('home');
  };

  const startCamera = () => {
    setCameraViewfinder(true);
  };

  const capturePhotoAction = () => {
    let mockType = 'pothole';
    if (formTitle.toLowerCase().includes('light')) mockType = 'light';
    else if (formTitle.toLowerCase().includes('garbage')) mockType = 'garbage';
    else if (formTitle.toLowerCase().includes('drainage')) mockType = 'drainage';
    
    setCapturedPhoto(mockType);
    setCameraViewfinder(false);
    
    // Auto trigger geotagging on capture
    triggerGeotagging();
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'admin') {
      setIsAdminLoggedIn(true);
      setAdminUsername('');
      setAdminPassword('');
      setActiveTab('admin');
    } else {
      alert('Invalid admin credentials! (Use admin/admin)');
    }
  };

  const handleCreateTicket = (e, issueId) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const department = formData.get('department');
    const priority = formData.get('priority');
    const scheduledDate = formData.get('scheduledDate');
    const notes = formData.get('notes');
    const ticketId = 'TK-' + Math.floor(1000 + Math.random() * 9000);

    setIssues(issues.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: 'In Progress',
          ticket: {
            ticketId,
            department,
            priority,
            scheduledDate,
            notes
          }
        };
      }
      return issue;
    }));

    setNotifications([
      {
        id: Date.now(),
        text: `Work Ticket #${ticketId} created for "${issues.find(i => i.id === issueId)?.title}" at ${issues.find(i => i.id === issueId)?.location}.`,
        time: 'Just now',
        unread: true
      },
      ...notifications
    ]);

    setActiveTicketFormIssueId(null);
  };

  const updateIssueStatus = (id, newStatus) => {
    setIssues(issues.map(issue => {
      if (issue.id === id) {
        // Trigger alert notify when status changes
        if (issue.status !== newStatus) {
          const newAlert = {
            id: Date.now(),
            text: `InfraBeacon Alert: "${issue.title}" at ${issue.location} has been marked "${newStatus}".`,
            time: 'Just now',
            unread: true
          };
          setNotifications([newAlert, ...notifications]);
        }
        return { ...issue, status: newStatus };
      }
      return issue;
    }));
  };

  const deleteIssue = (id) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) return;
    const reportToDelete = issues.find(i => i.id === id);
    setIssues(issues.filter(issue => issue.id !== id));
    if (reportToDelete) {
      setNotifications([
        { id: Date.now(), text: `InfraBeacon Alert: Report "${reportToDelete.title}" at ${reportToDelete.location} was deleted by Admin.`, time: 'Just now', unread: true },
        ...notifications
      ]);
    }
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleResolveSubmit = (e, id) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const notes = formData.get('resolutionNotes') || 'Marked as resolved by admin';
    
    setIssues(issues.map(issue => {
      if (issue.id === id) {
        const notesText = notes.trim() || 'Marked as resolved by admin';
        
        const newAlert = {
          id: Date.now(),
          text: `InfraBeacon Alert: "${issue.title}" at ${issue.location} has been marked "Resolved" with notes: "${notesText}".`,
          time: 'Just now',
          unread: true
        };
        setNotifications([newAlert, ...notifications]);
        
        return { 
          ...issue, 
          status: 'Resolved',
          resolutionNotes: notesText
        };
      }
      return issue;
    }));
    
    setActiveResolveFormIssueId(null);
    if (activeMapPopup && activeMapPopup.id === id) {
      setActiveMapPopup(null);
    }
  };

  const getBadgeStyle = (type, value) => {
    const normalizedValue = String(value).toLowerCase();
    
    if (type === 'issue_type') {
      if (normalizedValue.includes('pothole')) {
        return { backgroundColor: '#e3f2fd', color: '#1565c0' };
      } else if (normalizedValue.includes('light')) {
        return { backgroundColor: '#fff3e0', color: '#e65100' };
      } else if (normalizedValue.includes('garbage')) {
        return { backgroundColor: '#f3e5f5', color: '#7b1fa2' };
      } else if (normalizedValue.includes('drainage') || normalizedValue.includes('waterlogging')) {
        return { backgroundColor: '#e0f7fa', color: '#00838f' };
      } else {
        return { backgroundColor: '#f5f5f5', color: '#616161' };
      }
    }
    
    if (type === 'severity') {
      if (normalizedValue === 'high') {
        return { backgroundColor: '#ffebee', color: '#c62828' };
      } else if (normalizedValue === 'medium') {
        return { backgroundColor: '#fff3e0', color: '#ef6c00' };
      } else {
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      }
    }
    
    if (type === 'status') {
      if (normalizedValue === 'submitted' || normalizedValue === 'new') {
        return { backgroundColor: '#ffebee', color: '#c62828' };
      } else if (normalizedValue === 'approved' || normalizedValue === 'verified' || normalizedValue === 'in progress') {
        return { backgroundColor: '#fff8e1', color: '#f57f17' };
      } else {
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      }
    }
    
    return { backgroundColor: '#f5f5f5', color: '#616161' };
  };

  const getStatusLabel = (status) => {
    const norm = status.toLowerCase();
    if (norm === 'submitted' || norm === 'new') return '🔴 New';
    if (norm === 'approved' || norm === 'verified') return '🟡 Verified';
    if (norm === 'in progress') return '🟠 In Progress';
    if (norm === 'resolved') return '🟢 Resolved';
    return status;
  };

  const getTypeLabel = (type) => {
    const norm = type.toLowerCase();
    if (norm.includes('pothole')) return '🕳️ Pothole';
    if (norm.includes('light')) return '💡 Broken Light';
    if (norm.includes('garbage')) return '🗑️ Garbage';
    if (norm.includes('drainage') || norm.includes('waterlogging')) return '🌊 Waterlogging';
    return '⚠️ Other';
  };

  const renderLargePhoto = (photoType) => {
    return (
      <div style={{ 
        width: '320px', 
        height: '320px', 
        borderRadius: '24px', 
        overflow: 'hidden', 
        border: '4px solid #FFFFFF', 
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        backgroundColor: '#FFF'
      }}>
        {renderPhotoThumbnail(photoType)}
      </div>
    );
  };


  // Filter issues based on search
  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.reporter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPhotoThumbnail = (photoType) => {
    switch (photoType) {
      case 'pothole': return <PotholePhoto />;
      case 'light': return <StreetlightPhoto />;
      case 'garbage': return <GarbagePhoto />;
      case 'drainage': return <DrainagePhoto />;
      default: return <GenericPhoto />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {/* Simulated Device Frame */}
      <div className="app-container">
        
        {/* Scrollable Container enforcing sizing consistency across all tabs */}
        <div className="scrollable-content">

          {/* Top Lock/Admin Indicator */}
          {activeTab !== 'report' && activeTab !== 'admin-login' && activeTab !== 'admin' && (
            <div style={{
              position: 'absolute',
              top: '32px',
              right: '26px',
              zIndex: 15
            }}>
              <button 
                onClick={() => {
                  if (isAdminLoggedIn) {
                    if (activeTab === 'admin') {
                      setIsAdminLoggedIn(false);
                      setActiveTab('home');
                    } else {
                      setActiveTab('admin');
                    }
                  } else {
                    setActiveTab('admin-login');
                  }
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-color)',
                  boxShadow: 'var(--shadow-extruded-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isAdminLoggedIn ? '#2E7D32' : 'var(--text-light)',
                  transition: 'all 0.2s ease'
                }}
                onMouseDown={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-pressed)'}
                onMouseUp={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-extruded-sm)'}
              >
                {isAdminLoggedIn ? <UnlockIcon size={18} color="#2E7D32" /> : <LockIcon size={18} color="var(--text-light)" />}
              </button>
            </div>
          )}

          {/* Simulated Camera Viewfinder overlay */}
          {cameraViewfinder && (
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundColor: '#1C2824',
              zIndex: 40,
              padding: '36px 24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#FFFFFF'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Outfit', fontWeight: '600', fontSize: '0.9rem', color: '#ECEFF1' }}>CAMERA VIEWFINDER</span>
                <button 
                  onClick={() => setCameraViewfinder(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#ECEFF1',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Viewfinder Grid Screen */}
              <div style={{
                width: '100%',
                height: '380px',
                borderRadius: '24px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)'
              }}>
                {/* SVG Render scene based on issue type selection */}
                {formTitle.toLowerCase().includes('light') && <StreetlightPhoto />}
                {formTitle.toLowerCase().includes('garbage') && <GarbagePhoto />}
                {formTitle.toLowerCase().includes('drainage') && <DrainagePhoto />}
                {!formTitle.toLowerCase().includes('light') && !formTitle.toLowerCase().includes('garbage') && !formTitle.toLowerCase().includes('drainage') && <PotholePhoto />}

                {/* Viewfinder crosshairs */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  border: '1.5px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '50%'
                }} />
                <div style={{ position: 'absolute', top: '0', bottom: '0', left: '33.33%', width: '1px', borderLeft: '1px dashed rgba(255, 255, 255, 0.2)' }} />
                <div style={{ position: 'absolute', top: '0', bottom: '0', left: '66.66%', width: '1px', borderLeft: '1px dashed rgba(255, 255, 255, 0.2)' }} />
                <div style={{ position: 'absolute', left: '0', right: '0', top: '33.33%', height: '1px', borderTop: '1px dashed rgba(255, 255, 255, 0.2)' }} />
                <div style={{ position: 'absolute', left: '0', right: '0', top: '66.66%', height: '1px', borderTop: '1px dashed rgba(255, 255, 255, 0.2)' }} />
              </div>

              {/* Shutter actions */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
                <button 
                  onClick={capturePhotoAction}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ECEFF1',
                    border: '5px solid #455A64',
                    cursor: 'pointer',
                    boxShadow: '0 0 15px rgba(255,255,255,0.4)',
                    transition: 'transform 0.1s ease'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span style={{ fontSize: '0.8rem', color: '#B0BEC5', fontWeight: '500' }}>TAP SHUTTER TO CAPTURE</span>
              </div>
            </div>
          )}

          {/* HOME TAB SCREEN */}
          {activeTab === 'home' && (
            <div>
              {/* Header */}
              <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <BeaconIcon size={34} fill="var(--accent-color)" stroke="var(--accent-color)" strokeWidth={1.8} />
                  <h1 className="title-serif" style={{ fontSize: '2.1rem', letterSpacing: '-0.5px' }}>InfraBeacon</h1>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: '600', maxWidth: '300px', lineHeight: '1.3' }}>
                  AI-Powered Infrastructure Reporting Platform
                </p>
              </header>

              {/* Search Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-color)',
                borderRadius: '24px',
                padding: '6px 6px 6px 18px',
                boxShadow: 'var(--shadow-pressed)',
                marginBottom: '26px',
                height: '52px'
              }}>
                <input
                  type="text"
                  placeholder="Search issues near you..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '0.95rem',
                    color: 'var(--text-main)',
                    width: '100%',
                    fontWeight: '500'
                  }}
                />
                <div style={{
                  backgroundColor: 'var(--accent-light)',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-color)',
                  boxShadow: 'var(--shadow-extruded-sm)'
                }}>
                  <SearchIcon size={18} color="var(--accent-color)" />
                </div>
              </div>

              {/* Report New Issue Trigger */}
              <div 
                onClick={() => setActiveTab('report')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderRadius: '24px',
                  backgroundColor: 'var(--bg-color)',
                  boxShadow: 'var(--shadow-extruded)',
                  cursor: 'pointer',
                  marginBottom: '28px',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Sunken Camera Circle */}
                <div style={{
                  position: 'relative',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  boxShadow: 'var(--shadow-pressed-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-color)',
                  marginRight: '20px',
                  flexShrink: 0
                }}>
                  <CameraIcon size={24} color="var(--accent-color)" />
                  <div style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-light)',
                    border: '2px solid var(--bg-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-extruded-sm)'
                  }}>
                    <PlusIcon size={10} color="var(--accent-color)" />
                  </div>
                </div>
                
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: '700',
                  fontSize: '0.98rem',
                  letterSpacing: '0.8px',
                  color: 'var(--accent-color)',
                }}>
                  REPORT NEW ISSUE
                </span>
              </div>

              {/* List Heading */}
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '16px',
                fontFamily: 'Outfit, sans-serif',
                color: 'var(--text-main)'
              }}>
                Recent Local Issues
              </h2>

              {/* Issues Cards Stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <NeumorphicCard key={issue.id} padding="20px">
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
                        {/* Left: Captured photo thumbnail (high visual detail) */}
                        <div style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '14px',
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-pressed)',
                          border: '1px solid var(--shadow-dark)',
                          flexShrink: 0
                        }}>
                          {renderPhotoThumbnail(issue.photoType)}
                        </div>

                        {/* Center: Metadata */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginLeft: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ color: 'var(--accent-color)' }}>
                              {issue.photoType === 'light' ? <StreetlightIcon size={16} /> : <WarningIcon size={16} />}
                            </span>
                            <span style={{ fontWeight: '700', fontSize: '1.05rem', letterSpacing: '-0.3px' }}>
                              {issue.title}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)' }}>
                            <PinIcon size={13} color="var(--text-light)" />
                            <span style={{ fontSize: '0.82rem', fontWeight: '500' }}>{issue.location}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)' }}>
                            <UserIcon size={13} color="var(--text-light)" />
                            <span style={{ fontSize: '0.82rem', fontWeight: '500' }}>{issue.time} by {issue.reporter}</span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {issue.status === 'Submitted' ? <MailIcon size={13} color="var(--text-light)" /> : <SyncIcon size={13} color="var(--text-light)" />}
                            </span>
                            <span style={{ fontSize: '0.82rem', fontWeight: '500' }}>
                              Status: <span style={{ fontWeight: '600', color: issue.status === 'Resolved' ? '#2E7D32' : issue.status === 'Approved' ? '#1976D2' : 'var(--text-main)' }}>{issue.status}</span>
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)' }}>
                            <WarningIcon size={13} color="var(--text-light)" />
                            <span style={{ fontSize: '0.82rem', fontWeight: '500' }}>
                              Severity: <span style={{
                                fontWeight: '600',
                                color: 
                                  issue.severity === 'High' ? '#C62828' :
                                  issue.severity === 'Medium' ? '#E65100' : '#2E7D32'
                              }}>{issue.severity || 'Medium'}</span>
                            </span>
                          </div>
                        </div>

                        {/* Right: Map Thumbnail */}
                        <MiniMap lat={issue.lat} lng={issue.lng} />
                      </div>

                      {/* Ticket Details (if exists) */}
                      {issue.ticket && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px 14px',
                          borderRadius: '16px',
                          backgroundColor: 'var(--accent-light)',
                          border: '1.5px solid rgba(91,133,109,0.3)',
                          boxShadow: 'var(--shadow-pressed)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          animation: 'fadeIn 0.3s ease'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-color)', letterSpacing: '0.5px' }}>
                              🎫 TICKET: {issue.ticket.ticketId}
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              padding: '2px 6px',
                              borderRadius: '6px',
                              backgroundColor: 
                                issue.ticket.priority === 'Critical' || issue.ticket.priority === 'High' ? '#FFEBEE' : 
                                issue.ticket.priority === 'Medium' ? '#FFF3E0' : '#E8F5E9',
                              color: 
                                issue.ticket.priority === 'Critical' || issue.ticket.priority === 'High' ? '#C62828' : 
                                issue.ticket.priority === 'Medium' ? '#E65100' : '#2E7D32'
                            }}>
                              {issue.ticket.priority} Priority
                            </span>
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                            <div><strong>Assigned Dept:</strong> {issue.ticket.department}</div>
                            <div><strong>Schedule Date:</strong> {issue.ticket.scheduledDate}</div>
                            {issue.ticket.notes && (
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: 'var(--text-light)', 
                                fontStyle: 'italic',
                                marginTop: '2px',
                                borderLeft: '2px solid var(--accent-color)',
                                paddingLeft: '6px'
                              }}>
                                "{issue.ticket.notes}"
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer Row: Upvote Badge */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button 
                          onClick={() => handleUpvote(issue.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '6px 14px',
                            borderRadius: '16px',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: issue.hasUpvoted ? 'var(--accent-light)' : 'var(--bg-color)',
                            boxShadow: issue.hasUpvoted ? 'var(--shadow-pressed)' : 'var(--shadow-extruded-sm)',
                            cursor: 'pointer',
                            fontFamily: 'Outfit, sans-serif',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            color: issue.hasUpvoted ? 'var(--accent-color)' : 'var(--text-main)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{
                            backgroundColor: 'var(--accent-light)',
                            color: 'var(--accent-color)',
                            padding: '3px 8px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: '700'
                          }}>
                            Upvote
                          </span>
                          <span>{issue.upvotes}</span>
                        </button>
                      </div>
                    </NeumorphicCard>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    No reports match your search.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ADMIN SCREEN */}
          {activeTab === 'admin' && (
            <div>
              {/* Header mimicking the Flask app layout */}
              <header style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '1.5px solid var(--shadow-dark)'
              }}>
                <button 
                  onClick={() => setActiveTab('home')}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-color)',
                    boxShadow: 'var(--shadow-extruded-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-pressed)'}
                  onMouseUp={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-extruded-sm)'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <h1 className="title-serif" style={{ fontSize: '1.5rem', margin: 0 }}>Admin Dashboard</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-light)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title="admin@infrabeacon.gov">
                    admin@infrabeacon.gov
                  </span>
                  <button 
                    onClick={() => {
                      setIsAdminLoggedIn(false);
                      setActiveTab('home');
                    }}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-color)',
                      boxShadow: 'var(--shadow-extruded-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#C62828',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseDown={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-pressed)'}
                    onMouseUp={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-extruded-sm)'}
                    title="Logout"
                  >
                    🚪
                  </button>
                </div>
              </header>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 className="title-serif" style={{ fontSize: '1.2rem', margin: 0 }}>Infrastructure Reports</h2>
                <button 
                  onClick={triggerRefresh}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-color)',
                    boxShadow: 'var(--shadow-extruded-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--accent-color)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-pressed)'}
                  onMouseUp={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-extruded-sm)'}
                  title="Refresh Data"
                >
                  <span style={{ 
                    display: 'inline-block', 
                    animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' 
                  }}>
                    🔄
                  </span>
                </button>
              </div>

              {(() => {
                const filteredAdminIssues = issues
                  .filter(issue => {
                    let matchesStatus = true;
                    if (adminFilterStatus !== 'All') {
                      if (adminFilterStatus === 'new') {
                        matchesStatus = issue.status === 'Submitted';
                      } else if (adminFilterStatus === 'verified') {
                        matchesStatus = issue.status === 'Approved' || issue.status === 'In Progress';
                      } else if (adminFilterStatus === 'resolved') {
                        matchesStatus = issue.status === 'Resolved';
                      } else {
                        matchesStatus = issue.status === adminFilterStatus;
                      }
                    }

                    let matchesType = true;
                    if (adminFilterType !== 'All') {
                      const typeLower = adminFilterType.toLowerCase();
                      const issueTitleLower = issue.title.toLowerCase();
                      
                      if (typeLower === 'pothole') {
                        matchesType = issueTitleLower.includes('pothole');
                      } else if (typeLower === 'broken_light') {
                        matchesType = issueTitleLower.includes('light');
                      } else if (typeLower === 'garbage') {
                        matchesType = issueTitleLower.includes('garbage');
                      } else if (typeLower === 'waterlogging') {
                        matchesType = issueTitleLower.includes('drainage') || issueTitleLower.includes('water') || issueTitleLower.includes('flood');
                      } else if (typeLower === 'other') {
                        matchesType = !issueTitleLower.includes('pothole') && !issueTitleLower.includes('light') && !issueTitleLower.includes('garbage') && !issueTitleLower.includes('drainage');
                      } else {
                        matchesType = issue.title === adminFilterType;
                      }
                    }

                    let matchesSeverity = true;
                    if (adminFilterSeverity !== 'All') {
                      matchesSeverity = (issue.severity || 'Medium').toLowerCase() === adminFilterSeverity.toLowerCase();
                    }

                    return matchesStatus && matchesType && matchesSeverity;
                  })
                  .sort((a, b) => {
                    const severityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                    const statusOrder = { 'Submitted': 1, 'Approved': 2, 'In Progress': 3, 'Resolved': 4 };

                    if (adminSortOption === 'date-desc') {
                      return b.id - a.id;
                    }
                    if (adminSortOption === 'date-asc') {
                      return a.id - b.id;
                    }
                    if (adminSortOption === 'severity-desc') {
                      return (severityOrder[b.severity || 'Medium'] || 2) - (severityOrder[a.severity || 'Medium'] || 2);
                    }
                    if (adminSortOption === 'severity-asc') {
                      return (severityOrder[a.severity || 'Medium'] || 2) - (severityOrder[b.severity || 'Medium'] || 2);
                    }
                    if (adminSortOption === 'status-asc') {
                      return (statusOrder[a.status] || 1) - (statusOrder[b.status] || 1);
                    }
                    if (adminSortOption === 'status-desc') {
                      return (statusOrder[b.status] || 1) - (statusOrder[a.status] || 1);
                    }
                    return b.id - a.id;
                  });

                return (
                  <div>
                    {/* Stats Counters Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
                      <NeumorphicCard padding="8px" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>{issues.length}</span>
                        <span style={{ fontSize: '0.55rem', fontWeight: '700', color: 'var(--text-light)', marginTop: '2px' }}>TOTAL</span>
                      </NeumorphicCard>
                      <NeumorphicCard padding="8px" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#C62828' }}>{issues.filter(i => i.status === 'Submitted').length}</span>
                        <span style={{ fontSize: '0.55rem', fontWeight: '700', color: '#C62828', marginTop: '2px' }}>NEW</span>
                      </NeumorphicCard>
                      <NeumorphicCard padding="8px" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1565C0' }}>{issues.filter(i => i.status === 'Approved' || i.status === 'In Progress').length}</span>
                        <span style={{ fontSize: '0.55rem', fontWeight: '700', color: '#1565C0', marginTop: '2px' }}>VERIFIED</span>
                      </NeumorphicCard>
                      <NeumorphicCard padding="8px" style={{ alignItems: 'center', textAlign: 'center' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: '700', color: '#2E7D32' }}>{issues.filter(i => i.status === 'Resolved').length}</span>
                        <span style={{ fontSize: '0.55rem', fontWeight: '700', color: '#2E7D32', marginTop: '2px' }}>RESOLVED</span>
                      </NeumorphicCard>
                    </div>

                    {/* View Switcher and Filters Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      {/* List / Map View Toggle */}
                      <div style={{
                        display: 'flex',
                        backgroundColor: 'var(--bg-color)',
                        borderRadius: '16px',
                        padding: '4px',
                        boxShadow: 'var(--shadow-pressed)'
                      }}>
                        <button
                          type="button"
                          onClick={() => setAdminSubView('list')}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '12px',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: adminSubView === 'list' ? 'var(--bg-color)' : 'transparent',
                            boxShadow: adminSubView === 'list' ? 'var(--shadow-extruded-sm)' : 'none',
                            color: 'var(--text-main)',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          📋 List View
                        </button>
                        <button
                          type="button"
                          onClick={() => setAdminSubView('map')}
                          style={{
                            flex: 1,
                            padding: '8px',
                            borderRadius: '12px',
                            border: 'none',
                            outline: 'none',
                            backgroundColor: adminSubView === 'map' ? 'var(--bg-color)' : 'transparent',
                            boxShadow: adminSubView === 'map' ? 'var(--shadow-extruded-sm)' : 'none',
                            color: 'var(--text-main)',
                            fontWeight: '700',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          🗺️ Map View
                        </button>
                      </div>

                      {/* Filter Selectors (matching the dropdowns of Flask app admin dashboard) */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--text-light)' }}>STATUS</label>
                          <select
                            value={adminFilterStatus}
                            onChange={(e) => setAdminFilterStatus(e.target.value)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '10px',
                              border: 'none',
                              outline: 'none',
                              backgroundColor: 'var(--bg-color)',
                              boxShadow: 'var(--shadow-extruded-sm)',
                              fontSize: '0.75rem',
                              fontFamily: 'Outfit',
                              color: 'var(--text-main)',
                              fontWeight: '500'
                            }}
                          >
                            <option value="All">All Statuses</option>
                            <option value="new">🔴 New</option>
                            <option value="verified">🟡 Verified</option>
                            <option value="resolved">🟢 Resolved</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--text-light)' }}>SEVERITY</label>
                          <select
                            value={adminFilterSeverity}
                            onChange={(e) => setAdminFilterSeverity(e.target.value)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '10px',
                              border: 'none',
                              outline: 'none',
                              backgroundColor: 'var(--bg-color)',
                              boxShadow: 'var(--shadow-extruded-sm)',
                              fontSize: '0.75rem',
                              fontFamily: 'Outfit',
                              color: 'var(--text-main)',
                              fontWeight: '500'
                            }}
                          >
                            <option value="All">All Severities</option>
                            <option value="high">🔴 High</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="low">🟢 Low</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--text-light)' }}>ISSUE TYPE</label>
                          <select
                            value={adminFilterType}
                            onChange={(e) => setAdminFilterType(e.target.value)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '10px',
                              border: 'none',
                              outline: 'none',
                              backgroundColor: 'var(--bg-color)',
                              boxShadow: 'var(--shadow-extruded-sm)',
                              fontSize: '0.75rem',
                              fontFamily: 'Outfit',
                              color: 'var(--text-main)',
                              fontWeight: '500'
                            }}
                          >
                            <option value="All">All Types</option>
                            <option value="pothole">🕳️ Pothole</option>
                            <option value="broken_light">💡 Broken Light</option>
                            <option value="garbage">🗑️ Garbage</option>
                            <option value="waterlogging">🌊 Waterlogging</option>
                            <option value="other">⚠️ Other</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--text-light)' }}>SORT BY</label>
                          <select
                            value={adminSortOption}
                            onChange={(e) => setAdminSortOption(e.target.value)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '10px',
                              border: 'none',
                              outline: 'none',
                              backgroundColor: 'var(--bg-color)',
                              boxShadow: 'var(--shadow-extruded-sm)',
                              fontSize: '0.75rem',
                              fontFamily: 'Outfit',
                              color: 'var(--text-main)',
                              fontWeight: '500'
                            }}
                          >
                            <option value="date-desc">📅 Newest First</option>
                            <option value="date-asc">📅 Oldest First</option>
                            <option value="severity-desc">⚠️ Severity (High→Low)</option>
                            <option value="severity-asc">⚠️ Severity (Low→High)</option>
                            <option value="status-asc">📊 Status (New→Resolved)</option>
                            <option value="status-desc">📊 Status (Resolved→New)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* RENDER LIST VIEW */}
                    {adminSubView === 'list' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Mocking Flask app table header visually */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '60px 1fr',
                          padding: '0 8px',
                          marginBottom: '-8px',
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          color: 'var(--text-light)',
                          letterSpacing: '0.5px'
                        }}>
                          <span>IMAGE</span>
                          <span>REPORT DETAILS & CONTROLS</span>
                        </div>

                        {filteredAdminIssues.length > 0 ? (
                          filteredAdminIssues.map(issue => (
                            <NeumorphicCard key={issue.id} padding="16px">
                              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                                {/* Image column matching dynamic modal action */}
                                <div 
                                  onClick={() => setActiveImageModal(issue.photoType)}
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-pressed)',
                                    border: '1.5px solid var(--shadow-dark)',
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                    backgroundColor: '#FFFFFF',
                                    transition: 'transform 0.15s ease'
                                  }}
                                  title="Click to view image fullscreen"
                                >
                                  {renderPhotoThumbnail(issue.photoType)}
                                </div>

                                {/* Details column */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>
                                      {getTypeLabel(issue.title)}
                                    </h4>
                                    
                                    <button 
                                      onClick={() => deleteIssue(issue.id)}
                                      style={{
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: '#FFEBEE',
                                        color: '#C62828',
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        transition: 'transform 0.1s ease'
                                      }}
                                      title="Delete Report"
                                    >
                                      <TrashIcon size={12} color="#C62828" />
                                    </button>
                                  </div>

                                  <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '2px 0 4px 0' }}>
                                    📍 {issue.location} • By {issue.reporter} • {issue.time}
                                  </p>

                                  {/* Badges list row */}
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                    <span style={{ 
                                      fontSize: '0.68rem', 
                                      fontWeight: '700', 
                                      padding: '3px 10px', 
                                      borderRadius: '12px',
                                      ...getBadgeStyle('issue_type', issue.title)
                                    }}>
                                      {getTypeLabel(issue.title)}
                                    </span>
                                    <span style={{ 
                                      fontSize: '0.68rem', 
                                      fontWeight: '700', 
                                      padding: '3px 10px', 
                                      borderRadius: '12px',
                                      ...getBadgeStyle('severity', issue.severity)
                                    }}>
                                      {issue.severity?.toUpperCase() || 'MEDIUM'}
                                    </span>
                                    <span style={{ 
                                      fontSize: '0.68rem', 
                                      fontWeight: '700', 
                                      padding: '3px 10px', 
                                      borderRadius: '12px',
                                      ...getBadgeStyle('status', issue.status)
                                    }}>
                                      {getStatusLabel(issue.status)}
                                    </span>
                                  </div>

                                  {/* Action row (mimicking verify, resolve, delete from Flask templates) */}
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                    {issue.status === 'Submitted' && (
                                      <button
                                        onClick={() => updateIssueStatus(issue.id, 'Approved')}
                                        style={{
                                          flex: 1,
                                          padding: '8px 12px',
                                          fontSize: '0.75rem',
                                          fontWeight: '700',
                                          border: 'none',
                                          borderRadius: '8px',
                                          backgroundColor: '#E8F5E9',
                                          color: '#2E7D32',
                                          boxShadow: 'var(--shadow-extruded-sm)',
                                          cursor: 'pointer',
                                          transition: 'all 0.1s ease'
                                        }}
                                      >
                                        ✓ Verify / Approve
                                      </button>
                                    )}

                                    {issue.status === 'Approved' && (
                                      <button
                                        onClick={() => setActiveTicketFormIssueId(issue.id)}
                                        style={{
                                          flex: 1,
                                          padding: '8px 12px',
                                          fontSize: '0.75rem',
                                          fontWeight: '700',
                                          border: 'none',
                                          borderRadius: '8px',
                                          backgroundColor: '#E3F2FD',
                                          color: '#1565C0',
                                          boxShadow: 'var(--shadow-extruded-sm)',
                                          cursor: 'pointer',
                                          transition: 'all 0.1s ease'
                                        }}
                                      >
                                        🎫 Create Ticket
                                      </button>
                                    )}

                                    {issue.status !== 'Resolved' && (
                                      <button
                                        onClick={() => setActiveResolveFormIssueId(issue.id)}
                                        style={{
                                          flex: 1,
                                          padding: '8px 12px',
                                          fontSize: '0.75rem',
                                          fontWeight: '700',
                                          border: 'none',
                                          borderRadius: '8px',
                                          backgroundColor: '#FFF8E1',
                                          color: '#F57F17',
                                          boxShadow: 'var(--shadow-extruded-sm)',
                                          cursor: 'pointer',
                                          transition: 'all 0.1s ease'
                                        }}
                                      >
                                        ✅ Resolve
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Inline Ticket creation form */}
                              {activeTicketFormIssueId === issue.id && (
                                <form onSubmit={(e) => handleCreateTicket(e, issue.id)} style={{
                                  marginTop: '12px',
                                  padding: '12px',
                                  borderRadius: '12px',
                                  backgroundColor: 'var(--bg-color)',
                                  boxShadow: 'var(--shadow-pressed)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '10px',
                                  animation: 'fadeIn 0.2s ease'
                                }}>
                                  <h5 style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>Create Work Ticket</h5>
                                  
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-light)' }}>DEPARTMENT</label>
                                      <select
                                        name="department"
                                        required
                                        style={{
                                          padding: '6px 10px',
                                          borderRadius: '8px',
                                          border: 'none',
                                          outline: 'none',
                                          backgroundColor: 'var(--bg-color)',
                                          boxShadow: 'var(--shadow-extruded-sm)',
                                          fontSize: '0.8rem',
                                          fontFamily: 'Outfit'
                                        }}
                                      >
                                        <option>Public Works</option>
                                        <option>Sanitation & Waste</option>
                                        <option>Roads & Traffic</option>
                                        <option>Water & Sewage</option>
                                        <option>Forestry & Parks</option>
                                      </select>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                      <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-light)' }}>PRIORITY</label>
                                      <select
                                        name="priority"
                                        required
                                        style={{
                                          padding: '6px 10px',
                                          borderRadius: '8px',
                                          border: 'none',
                                          outline: 'none',
                                          backgroundColor: 'var(--bg-color)',
                                          boxShadow: 'var(--shadow-extruded-sm)',
                                          fontSize: '0.8rem',
                                          fontFamily: 'Outfit'
                                        }}
                                      >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Critical</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-light)' }}>SCHEDULED DATE</label>
                                    <input
                                      type="date"
                                      name="scheduledDate"
                                      required
                                      defaultValue={new Date(Date.now() + 3*24*60*60*1000).toISOString().split('T')[0]}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: 'var(--bg-color)',
                                        boxShadow: 'var(--shadow-extruded-sm)',
                                        fontSize: '0.8rem',
                                        fontFamily: 'Outfit'
                                      }}
                                    />
                                  </div>

                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-light)' }}>WORK NOTES</label>
                                    <textarea
                                      name="notes"
                                      placeholder="Add instructions for repair crew..."
                                      rows={2}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: 'var(--bg-color)',
                                        boxShadow: 'var(--shadow-extruded-sm)',
                                        fontSize: '0.8rem',
                                        fontFamily: 'Outfit',
                                        resize: 'none'
                                      }}
                                    />
                                  </div>

                                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                    <button type="submit" style={{
                                      flex: 1,
                                      padding: '8px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      backgroundColor: 'var(--accent-color)',
                                      color: '#FFF',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}>
                                      Create Ticket
                                    </button>
                                    <button type="button" onClick={() => setActiveTicketFormIssueId(null)} style={{
                                      flex: 1,
                                      padding: '8px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      backgroundColor: 'var(--bg-color)',
                                      boxShadow: 'var(--shadow-extruded-sm)',
                                      color: 'var(--text-light)',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}>
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              )}

                              {/* Inline Resolve Form */}
                              {activeResolveFormIssueId === issue.id && (
                                <form onSubmit={(e) => handleResolveSubmit(e, issue.id)} style={{
                                  marginTop: '12px',
                                  padding: '12px',
                                  borderRadius: '12px',
                                  backgroundColor: 'var(--bg-color)',
                                  boxShadow: 'var(--shadow-pressed)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '10px',
                                  animation: 'fadeIn 0.2s ease'
                                }}>
                                  <h5 style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>Resolve Issue</h5>
                                  
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-light)' }}>RESOLUTION NOTES</label>
                                    <textarea
                                      name="resolutionNotes"
                                      placeholder="Enter details of how the issue was fixed (optional)..."
                                      rows={2}
                                      style={{
                                        padding: '6px 10px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: 'var(--bg-color)',
                                        boxShadow: 'var(--shadow-extruded-sm)',
                                        fontSize: '0.8rem',
                                        fontFamily: 'Outfit',
                                        resize: 'none'
                                      }}
                                    />
                                  </div>

                                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                    <button type="submit" style={{
                                      flex: 1,
                                      padding: '8px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      backgroundColor: 'var(--accent-color)',
                                      color: '#FFF',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}>
                                      Confirm Resolution
                                    </button>
                                    <button type="button" onClick={() => setActiveResolveFormIssueId(null)} style={{
                                      flex: 1,
                                      padding: '8px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      backgroundColor: 'var(--bg-color)',
                                      boxShadow: 'var(--shadow-extruded-sm)',
                                      color: 'var(--text-light)',
                                      fontSize: '0.8rem',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}>
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              )}

                              {/* Ticket details display */}
                              {issue.ticket && (
                                <div style={{
                                  marginTop: '12px',
                                  padding: '12px 14px',
                                  borderRadius: '16px',
                                  backgroundColor: 'var(--accent-light)',
                                  border: '1px solid rgba(91,133,109,0.3)',
                                  boxShadow: 'var(--shadow-pressed)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '6px',
                                  animation: 'fadeIn 0.3s ease'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-color)', letterSpacing: '0.5px' }}>
                                      🎫 TICKET: {issue.ticket.ticketId}
                                    </span>
                                    <span style={{
                                      fontSize: '0.7rem',
                                      fontWeight: '700',
                                      padding: '2px 6px',
                                      borderRadius: '6px',
                                      backgroundColor: 
                                        issue.ticket.priority === 'Critical' || issue.ticket.priority === 'High' ? '#FFEBEE' : 
                                        issue.ticket.priority === 'Medium' ? '#FFF3E0' : '#E8F5E9',
                                      color: 
                                        issue.ticket.priority === 'Critical' || issue.ticket.priority === 'High' ? '#C62828' : 
                                        issue.ticket.priority === 'Medium' ? '#E65100' : '#2E7D32'
                                    }}>
                                      {issue.ticket.priority} Priority
                                    </span>
                                  </div>
                                  
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                                    <div><strong>Assigned Dept:</strong> {issue.ticket.department}</div>
                                    <div><strong>Schedule Date:</strong> {issue.ticket.scheduledDate}</div>
                                    {issue.ticket.notes && (
                                      <div style={{ 
                                        fontSize: '0.75rem', 
                                        color: 'var(--text-light)', 
                                        fontStyle: 'italic',
                                        marginTop: '2px',
                                        borderLeft: '2px solid var(--accent-color)',
                                        paddingLeft: '6px'
                                      }}>
                                        "{issue.ticket.notes}"
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Resolution Notes display (if exists) */}
                              {issue.resolutionNotes && (
                                <div style={{
                                  marginTop: '12px',
                                  padding: '12px 14px',
                                  borderRadius: '16px',
                                  backgroundColor: '#E8F5E9',
                                  border: '1px solid rgba(46,125,50,0.3)',
                                  boxShadow: 'var(--shadow-pressed)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '4px',
                                  animation: 'fadeIn 0.3s ease'
                                }}>
                                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#2E7D32' }}>
                                    ✅ RESOLUTION NOTES:
                                  </span>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, fontStyle: 'italic' }}>
                                    "{issue.resolutionNotes}"
                                  </p>
                                </div>
                              )}
                            </NeumorphicCard>
                          ))
                        ) : (
                          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-light)', fontSize: '0.9rem' }}>
                            No reports match your filters.
                          </div>
                        )}
                      </div>
                    )}

                    {/* RENDER MAP VIEW (mocking Google Maps features from Flask app admin panel) */}
                    {adminSubView === 'map' && (
                      <div>
                        <div style={{
                          width: '100%',
                          height: '380px',
                          borderRadius: '28px',
                          overflow: 'hidden',
                          boxShadow: 'var(--shadow-pressed)',
                          position: 'relative',
                          backgroundColor: '#E5EFEA',
                          border: '2px solid var(--shadow-dark)'
                        }}>
                          {/* SVG Map Grid Layout */}
                          <svg width="100%" height="100%" viewBox="0 0 400 360">
                            <defs>
                              <filter id="heatmap-blur" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="15" />
                              </filter>
                            </defs>
                            <rect width="100%" height="100%" fill="#E3ECE6" />
                            <path d="M 0 0 Q 150 120 220 0 Z" fill="#D2E3D8" />
                            <path d="M 280 360 Q 340 280 400 300 L 400 360 Z" fill="#D2E3D8" />

                            <path d="M -10 100 L 410 100" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                            <path d="M -10 260 L 410 260" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                            <path d="M 120 -10 L 120 370" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                            <path d="M 300 -10 L 300 370" stroke="#FFFFFF" strokeWidth="8" fill="none" />

                            {/* User location dot */}
                            {showUserLocation && (
                              <g>
                                <circle cx="200" cy="180" r="14" fill="#4285F4" fillOpacity="0.3">
                                  <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="200" cy="180" r="7" fill="#4285F4" stroke="#FFFFFF" strokeWidth="2.5" />
                              </g>
                            )}

                            {/* Heatmap Layer */}
                            {showHeatmap && filteredAdminIssues.map(issue => {
                              const x = (issue.lat / 100) * 320 + 40;
                              const y = (issue.lng / 100) * 280 + 40;
                              const statusColors = {
                                'Submitted': '#E53935',
                                'Approved': '#1E88E5',
                                'In Progress': '#F57C00',
                                'Resolved': '#2E7D32'
                              };
                              const pinColor = statusColors[issue.status] || '#E53935';
                              return (
                                <circle
                                  key={`heatmap-${issue.id}`}
                                  cx={x}
                                  cy={y}
                                  r="35"
                                  fill={pinColor}
                                  fillOpacity="0.7"
                                  filter="url(#heatmap-blur)"
                                />
                              );
                            })}

                            {/* Standard Interactive Pins */}
                            {!showHeatmap && filteredAdminIssues.map(issue => {
                              const x = (issue.lat / 100) * 320 + 40;
                              const y = (issue.lng / 100) * 280 + 40;
                              const statusColors = {
                                'Submitted': '#E53935',
                                'Approved': '#1E88E5',
                                'In Progress': '#F57C00',
                                'Resolved': '#2E7D32'
                              };
                              const pinColor = statusColors[issue.status] || '#E53935';

                              return (
                                <g 
                                  key={`pin-${issue.id}`} 
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => setActiveMapPopup(issue)}
                                >
                                  <circle cx={x} cy={y} r="12" fill={pinColor} fillOpacity="0.25">
                                    <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />
                                  </circle>
                                  <path d={`M${x} ${y - 10} C${x - 5} ${y - 10} ${x - 8} ${y - 7} ${x - 8} ${y - 2} C${x - 8} 3 ${x} 12 ${x} 12 C${x} 12 ${x + 8} 3 ${x + 8} ${y - 2} C${x + 8} ${y - 7} ${x + 5} ${y - 10} ${x} ${y - 10} Z`} fill={pinColor} />
                                  <circle cx={x} cy={y - 2.5} r="2.5" fill="#FFFFFF" />
                                  
                                  <rect x={x - 45} y={y - 32} width="90" height="18" rx="5" fill="var(--text-main)" opacity="0.8" />
                                  <text x={x} y={y - 20} fill="#FFFFFF" fontSize="8" fontWeight="600" textAnchor="middle">
                                    {issue.title}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>

                          {/* Map Stats Overlay */}
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            backgroundColor: 'rgba(236, 243, 240, 0.95)',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-extruded-sm)',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            color: 'var(--text-main)',
                            zIndex: 10,
                            pointerEvents: 'none'
                          }}>
                            <span>Total: <strong style={{ color: 'var(--accent-color)' }}>{issues.length}</strong></span>
                            <span style={{ marginLeft: '12px' }}>Showing: <strong style={{ color: 'var(--accent-color)' }}>{filteredAdminIssues.length}</strong></span>
                          </div>

                          {/* Map Controls */}
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            zIndex: 10
                          }}>
                            <button 
                              onClick={() => setShowHeatmap(!showHeatmap)}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: showHeatmap ? 'var(--accent-color)' : 'rgba(236, 243, 240, 0.9)',
                                color: showHeatmap ? '#FFF' : 'var(--text-main)',
                                boxShadow: 'var(--shadow-extruded-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease'
                              }}
                              title="Toggle Heatmap"
                            >
                              🔥
                            </button>
                            <button 
                              onClick={() => {
                                setShowUserLocation(!showUserLocation);
                              }}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: showUserLocation ? 'var(--accent-color)' : 'rgba(236, 243, 240, 0.9)',
                                color: showUserLocation ? '#FFF' : 'var(--text-main)',
                                boxShadow: 'var(--shadow-extruded-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease'
                              }}
                              title="Locate Me"
                            >
                              📍
                            </button>
                            <button 
                              onClick={triggerRefresh}
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: 'rgba(236, 243, 240, 0.9)',
                                color: 'var(--text-main)',
                                boxShadow: 'var(--shadow-extruded-sm)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.2s ease'
                              }}
                              title="Refresh Map"
                            >
                              <span style={{ display: 'inline-block', animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' }}>
                                🔄
                              </span>
                            </button>
                          </div>

                          {/* Map Legend */}
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            backgroundColor: 'rgba(236, 243, 240, 0.95)',
                            padding: '8px 12px',
                            borderRadius: '12px',
                            boxShadow: 'var(--shadow-extruded-sm)',
                            fontSize: '0.65rem',
                            fontWeight: '600',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            zIndex: 10,
                            pointerEvents: 'none'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E53935' }} />
                              <span>New</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E88E5' }} />
                              <span>Verified</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F57C00' }} />
                              <span>In Progress</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2E7D32' }} />
                              <span>Resolved</span>
                            </div>
                          </div>

                          {/* InfoWindow Popup on map */}
                          {activeMapPopup && (
                            <div style={{
                              position: 'absolute',
                              bottom: '70px',
                              left: '12px',
                              right: '12px',
                              backgroundColor: 'rgba(236, 243, 240, 0.98)',
                              padding: '14px',
                              borderRadius: '20px',
                              boxShadow: 'var(--shadow-extruded)',
                              border: '1.5px solid var(--shadow-dark)',
                              zIndex: 25,
                              animation: 'fadeIn 0.25s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0 }}>
                                  {getTypeLabel(activeMapPopup.title)}
                                </h4>
                                <button 
                                  onClick={() => setActiveMapPopup(null)}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    color: 'var(--text-light)',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    padding: '2px 6px'
                                  }}
                                >
                                  &times;
                                </button>
                              </div>

                              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <div 
                                  onClick={() => {
                                    setActiveImageModal(activeMapPopup.photoType);
                                  }}
                                  style={{
                                    width: '64px',
                                    height: '64px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    boxShadow: 'var(--shadow-pressed)',
                                    border: '1px solid var(--shadow-dark)',
                                    flexShrink: 0,
                                    cursor: 'pointer',
                                    backgroundColor: '#FFFFFF'
                                  }}
                                >
                                  {renderPhotoThumbnail(activeMapPopup.photoType)}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, fontWeight: '500' }}>
                                    📍 {activeMapPopup.location}
                                  </p>
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
                                    <span style={{ 
                                      fontSize: '0.68rem', 
                                      fontWeight: '700', 
                                      padding: '2px 8px', 
                                      borderRadius: '10px',
                                      ...getBadgeStyle('severity', activeMapPopup.severity)
                                    }}>
                                      {activeMapPopup.severity.toUpperCase()}
                                    </span>
                                    <span style={{ 
                                      fontSize: '0.68rem', 
                                      fontWeight: '700', 
                                      padding: '2px 8px', 
                                      borderRadius: '10px',
                                      ...getBadgeStyle('status', activeMapPopup.status)
                                    }}>
                                      {activeMapPopup.status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                                {activeMapPopup.status === 'Submitted' && (
                                  <button
                                    onClick={() => {
                                      updateIssueStatus(activeMapPopup.id, 'Approved');
                                      setActiveMapPopup(prev => ({ ...prev, status: 'Approved' }));
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: '8px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      backgroundColor: '#E8F5E9',
                                      color: '#2E7D32',
                                      fontSize: '0.75rem',
                                      fontWeight: '700',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    ✓ Verify
                                  </button>
                                )}
                                {activeMapPopup.status === 'Approved' && (
                                  <button
                                    onClick={() => {
                                      setActiveTicketFormIssueId(activeMapPopup.id);
                                      setAdminSubView('list');
                                      setActiveMapPopup(null);
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: '8px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      backgroundColor: '#E3F2FD',
                                      color: '#1565C0',
                                      fontSize: '0.75rem',
                                      fontWeight: '700',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    🎫 Create Ticket
                                  </button>
                                )}
                                {activeMapPopup.status !== 'Resolved' && (
                                  <button
                                    onClick={() => {
                                      setActiveResolveFormIssueId(activeMapPopup.id);
                                      setAdminSubView('list');
                                      setActiveMapPopup(null);
                                    }}
                                    style={{
                                      flex: 1,
                                      padding: '8px',
                                      borderRadius: '8px',
                                      border: 'none',
                                      backgroundColor: '#E3F2FD',
                                      color: '#1565C0',
                                      fontSize: '0.75rem',
                                      fontWeight: '700',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    ✅ Resolve
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                <NeumorphicButton 
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    setActiveTab('home');
                  }}
                  style={{ padding: '12px 20px', fontSize: '0.85rem' }}
                >
                  Logout Admin View
                </NeumorphicButton>
              </div>
            </div>
          )}

          {/* REPORT SCREEN */}
          {activeTab === 'report' && (
            <div>
              <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button 
                  onClick={() => {
                    setActiveTab('home');
                    setFormLocation('');
                    setCapturedPhoto(null);
                    setGeotagged(false);
                    setIsGeotagging(false);
                  }}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-color)',
                    boxShadow: 'var(--shadow-extruded-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-pressed)'}
                  onMouseUp={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-extruded-sm)'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <h1 className="title-serif" style={{ fontSize: '1.8rem' }}>Report Issue</h1>
              </header>

              <NeumorphicCard padding="20px" style={{ marginBottom: '28px' }}>
                <form onSubmit={handleAddIssue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }} className="title-serif">File a New Report</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)' }}>ISSUE TYPE</label>
                    <select
                      value={formTitle}
                      onChange={(e) => {
                        setFormTitle(e.target.value);
                        setCapturedPhoto(null); // Reset snap if type changes
                        setGeotagged(false);
                        setIsGeotagging(false);
                      }}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'var(--bg-color)',
                        boxShadow: 'var(--shadow-pressed)',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.9rem',
                        color: 'var(--text-main)',
                        fontWeight: '500',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235B856D\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                        backgroundSize: '16px'
                      }}
                    >
                      <option>Pothole</option>
                      <option>Broken Streetlight</option>
                      <option>Overflowing Garbage</option>
                      <option>Blocked Drainage</option>
                      <option>Other Issue</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)' }}>SEVERITY LEVEL</label>
                    <select
                      value={formSeverity}
                      onChange={(e) => setFormSeverity(e.target.value)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'var(--bg-color)',
                        boxShadow: 'var(--shadow-pressed)',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.9rem',
                        color: 'var(--text-main)',
                        fontWeight: '500',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%235B856D\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 16px center',
                        backgroundSize: '16px'
                      }}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>

                  {/* Interactive camera capture trigger in report form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)' }}>CAPTURE PROOF</label>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (capturedPhoto) {
                            triggerGeotagging();
                          } else {
                            startCamera();
                          }
                        }}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '16px',
                          border: 'none',
                          outline: 'none',
                          backgroundColor: 'var(--bg-color)',
                          boxShadow: 'var(--shadow-extruded-sm)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--accent-color)',
                          overflow: 'hidden'
                        }}
                      >
                        {capturedPhoto ? renderPhotoThumbnail(capturedPhoto) : <CameraIcon size={24} />}
                      </button>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: capturedPhoto ? 'var(--text-main)' : 'var(--text-light)' }}>
                          {capturedPhoto ? '📸 Photo captured!' : '📷 Tap square to take photo'}
                        </span>
                        {capturedPhoto && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '2px' }}>
                            (Tap photo again to geotag location)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Geotagging status & animation panel */}
                  {(isGeotagging || geotagged) && (
                    <div style={{
                      marginTop: '4px',
                      padding: '16px',
                      borderRadius: '20px',
                      backgroundColor: 'var(--bg-color)',
                      boxShadow: 'var(--shadow-pressed)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      animation: 'fadeIn 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: isGeotagging ? 'var(--accent-color)' : '#2E7D32',
                          boxShadow: isGeotagging ? '0 0 6px var(--accent-color)' : '0 0 6px #2E7D32',
                          animation: isGeotagging ? 'pulse 1.2s infinite' : 'none'
                        }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isGeotagging ? 'var(--text-main)' : '#2E7D32' }}>
                          {isGeotagging ? 'Acquiring live GPS coordinates...' : '✓ GPS Location Geotagged'}
                        </span>
                      </div>
                      
                      {/* Map inside a rectangle */}
                      <div style={{
                        width: '100%',
                        height: '110px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        position: 'relative',
                        border: '1.5px solid var(--shadow-dark)',
                        backgroundColor: '#E5EFEA'
                      }}>
                        <svg width="100%" height="100%" viewBox="0 0 200 110">
                          <rect width="100%" height="100%" fill="#E3ECE6" />
                          <path d="M -10 40 L 210 55" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                          <path d="M 60 -10 L 80 120" stroke="#FFFFFF" strokeWidth="4" fill="none" />
                          <path d="M 140 -10 L 120 120" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                          <path d="M -10 85 Q 100 80 210 90" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                          
                          {/* Pulsing GPS Radar sweep */}
                          {isGeotagging && (
                            <circle cx="100" cy="55" r="30" fill="none" stroke="var(--accent-color)" strokeWidth="1.5" opacity="0.4">
                              <animate attributeName="r" values="0;45" dur="1.8s" repeatCount="indefinite" />
                              <animate attributeName="stroke-opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
                            </circle>
                          )}
                          
                          {/* Map Pin Locator */}
                          <g>
                            {isGeotagging ? (
                              <circle cx="100" cy="55" r="6" fill="var(--accent-color)">
                                <animate attributeName="r" values="4;8;4" dur="1.2s" repeatCount="indefinite" />
                              </circle>
                            ) : (
                              <>
                                <circle cx="100" cy="55" r="12" fill="#E53935" fillOpacity="0.25">
                                  <animate attributeName="r" values="10;15;10" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <path d="M100 45 C96 45 93 48 93 52 C93 56 100 65 100 65 C100 65 107 56 107 52 C107 48 104 45 100 45 Z" fill="#E53935" />
                                <circle cx="100" cy="51" r="2.5" fill="#FFFFFF" />
                              </>
                            )}
                          </g>
                        </svg>
                        
                        {/* Laser Scanning Bar Overlay */}
                        {isGeotagging && (
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            background: 'linear-gradient(to bottom, rgba(91,133,109,0.8), rgba(91,133,109,0))',
                            boxShadow: '0 0 8px rgba(91,133,109,0.6)',
                            animation: 'scanBar 1.5s ease-in-out infinite'
                          }} />
                        )}
                      </div>
                      
                      {!isGeotagging && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.78rem', color: 'var(--text-light)' }}>
                          <span><strong>Coordinates:</strong> 37.7749° N, 122.4194° W</span>
                          <span><strong>Accuracy:</strong> Live GPS (~4m accuracy)</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)' }}>LOCATION</label>
                    <input
                      type="text"
                      placeholder="e.g. 15 Maple Rd"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      required
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'var(--bg-color)',
                        boxShadow: 'var(--shadow-pressed)',
                        fontFamily: 'Outfit, sans-serif',
                        fontSize: '0.9rem',
                        color: 'var(--text-main)',
                        fontWeight: '500'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                    <NeumorphicButton type="submit" primary={true} style={{ flex: 1, padding: '12px' }}>
                      Submit
                    </NeumorphicButton>
                    <NeumorphicButton 
                      type="button" 
                      onClick={() => {
                        setActiveTab('home');
                        setFormLocation('');
                        setCapturedPhoto(null);
                        setGeotagged(false);
                        setIsGeotagging(false);
                      }} 
                      style={{ flex: 1, padding: '12px' }}
                    >
                      Cancel
                    </NeumorphicButton>
                  </div>
                </form>
              </NeumorphicCard>
            </div>
          )}

          {/* ADMIN LOGIN SCREEN */}
          {activeTab === 'admin-login' && (
            <div>
              <header style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button 
                  onClick={() => setActiveTab('home')}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-color)',
                    boxShadow: 'var(--shadow-extruded-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-pressed)'}
                  onMouseUp={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-extruded-sm)'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <h1 className="title-serif" style={{ fontSize: '1.8rem' }}>Admin Gateway</h1>
              </header>

              <NeumorphicCard padding="24px">
                <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 className="title-serif" style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '8px' }}>Sign in to Admin Dashboard</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)' }}>USERNAME</label>
                    <input
                      type="text"
                      placeholder="Username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'var(--bg-color)',
                        boxShadow: 'var(--shadow-pressed)',
                        fontFamily: 'Outfit, sans-serif',
                        color: 'var(--text-main)',
                        fontWeight: '500'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)' }}>PASSWORD</label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      style={{
                        padding: '12px 16px',
                        borderRadius: '14px',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'var(--bg-color)',
                        boxShadow: 'var(--shadow-pressed)',
                        fontFamily: 'Outfit, sans-serif',
                        color: 'var(--text-main)',
                        fontWeight: '500'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <NeumorphicButton type="submit" primary={true} style={{ flex: 1, padding: '12px' }}>
                      Login
                    </NeumorphicButton>
                    <NeumorphicButton type="button" onClick={() => setActiveTab('home')} style={{ flex: 1, padding: '12px' }}>
                      Cancel
                    </NeumorphicButton>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '4px' }}>
                    Bypass Hint: Use <strong>admin</strong> / <strong>admin</strong>
                  </p>
                </form>
              </NeumorphicCard>
            </div>
          )}

          {/* MAP SCREEN */}
          {activeTab === 'map' && (
            <div>
              <header style={{ marginBottom: '20px' }}>
                <h1 className="title-serif" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Community Map</h1>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', textAlign: 'center' }}>Overview of active issues in your neighborhood</p>
              </header>

              <div style={{
                width: '100%',
                height: '340px',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-extruded)',
                position: 'relative',
                backgroundColor: '#E5EFEA',
                border: '2px solid var(--shadow-dark)'
              }}>
                <svg width="100%" height="100%" viewBox="0 0 400 400" style={{ cursor: 'grab' }}>
                  <rect width="100%" height="100%" fill="#E3ECE6" />
                  <path d="M 0 0 Q 150 120 220 0 Z" fill="#D2E3D8" />
                  <path d="M 280 400 Q 340 300 400 320 L 400 400 Z" fill="#D2E3D8" />
                  <rect x="50" y="220" width="80" height="90" rx="10" fill="#D2E3D8" />

                  <path d="M -10 120 L 410 120" stroke="#FFFFFF" strokeWidth="12" fill="none" />
                  <path d="M -10 280 L 410 280" stroke="#FFFFFF" strokeWidth="12" fill="none" />
                  <path d="M 120 -10 L 120 410" stroke="#FFFFFF" strokeWidth="12" fill="none" />
                  <path d="M 300 -10 L 300 410" stroke="#FFFFFF" strokeWidth="10" fill="none" />
                  
                  <path d="M -10 50 Q 150 60 410 50" stroke="#FFFFFF" strokeWidth="6" fill="none" opacity="0.8" />
                  <path d="M -10 200 L 120 200" stroke="#FFFFFF" strokeWidth="6" fill="none" opacity="0.8" />
                  <path d="M 200 120 L 200 280" stroke="#FFFFFF" strokeWidth="6" fill="none" opacity="0.8" />

                  {issues.map(issue => (
                    <g key={issue.id} style={{ cursor: 'pointer' }} onClick={() => alert(`${issue.title} at ${issue.location}\nStatus: ${issue.status}`)}>
                      {(() => {
                        const x = (issue.lat / 100) * 320 + 40;
                        const y = (issue.lng / 100) * 320 + 40;
                        return (
                          <>
                            <circle cx={x} cy={y} r="14" fill="#E53935" fillOpacity="0.25">
                              <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <path d={`M${x} ${y - 12} C${x - 6} ${y - 12} ${x - 10} ${y - 8} ${x - 10} ${y - 2} C${x - 10} 4 ${x} 15 ${x} 15 C${x} 15 ${x + 10} 4 ${x + 10} ${y - 2} C${x + 10} ${y - 8} ${x + 6} ${y - 12} ${x} ${y - 12} Z`} fill="#E53935" />
                            <circle cx={x} cy={y - 3} r="3" fill="#FFFFFF" />
                            
                            <rect x={x - 45} y={y - 40} width="90" height="22" rx="6" fill="var(--text-main)" opacity="0.9" />
                            <text x={x} y={y - 25} fill="#FFFFFF" fontSize="9" fontWeight="600" textAnchor="middle">
                              {issue.title}
                            </text>
                          </>
                        );
                      })()}
                    </g>
                  ))}
                </svg>
              </div>
              
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)' }}>ACTIVE LOCATIONS ({issues.length})</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {issues.map(issue => (
                    <div key={issue.id} style={{
                      padding: '8px 12px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-color)',
                      boxShadow: 'var(--shadow-extruded-sm)',
                      fontSize: '0.8rem',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--text-main)'
                    }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E53935' }} />
                      {issue.location} ({issue.title})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SCREEN */}
          {activeTab === 'notifications' && (
            <div>
              <header style={{ marginBottom: '22px' }}>
                <h1 className="title-serif" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Notifications</h1>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', textAlign: 'center' }}>Stay updated on community progress</p>
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {notifications.map(n => (
                  <div key={n.id} style={{
                    padding: '16px 20px',
                    borderRadius: '20px',
                    backgroundColor: 'var(--bg-color)',
                    boxShadow: n.unread ? 'var(--shadow-pressed)' : 'var(--shadow-extruded-sm)',
                    borderLeft: n.unread ? '4px solid var(--accent-color)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: n.unread ? 'var(--accent-color)' : 'var(--text-light)'
                      }}>
                        {n.unread ? 'NEW ALERT' : 'ARCHIVED'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{n.time}</span>
                    </div>
                    <p style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-main)',
                      fontWeight: n.unread ? '600' : '400',
                      lineHeight: '1.4'
                    }}>
                      {n.text}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                <NeumorphicButton 
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, unread: false })))}
                  style={{ padding: '12px 20px', fontSize: '0.85rem' }}
                >
                  Mark all as read
                </NeumorphicButton>
              </div>
            </div>
          )}

          {/* PROFILE SCREEN */}
          {activeTab === 'profile' && (
            <div>
              <header style={{ marginBottom: '24px' }}>
                <h1 className="title-serif" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Citizen Profile</h1>
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '26px' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  boxShadow: 'var(--shadow-extruded)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--bg-color)',
                  marginBottom: '16px',
                  padding: '4px'
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    boxShadow: 'var(--shadow-pressed)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--accent-color)'
                  }}>
                    <UserIcon size={48} color="var(--accent-color)" />
                  </div>
                </div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Alex Mercer</h2>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: '600', marginTop: '2px' }}>INFRASTRUCTURE MONITOR • LVL 4</p>
              </div>

              <NeumorphicCard padding="18px" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)' }}>
                  <span>Level 4 Progress</span>
                  <span>80% (320 / 400 XP)</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '14px',
                  borderRadius: '7px',
                  boxShadow: 'var(--shadow-pressed)',
                  backgroundColor: 'var(--bg-color)',
                  overflow: 'hidden',
                  marginTop: '10px',
                  padding: '2px'
                }}>
                  <div style={{
                    width: '80%',
                    height: '100%',
                    borderRadius: '5px',
                    backgroundColor: 'var(--accent-color)',
                    boxShadow: '0 0 4px rgba(91, 133, 109, 0.4)'
                  }} />
                </div>
              </NeumorphicCard>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <NeumorphicCard padding="16px" style={{ alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--accent-color)' }}>
                    {issues.length + 10}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-light)', marginTop: '4px' }}>
                    REPORTS MADE
                  </span>
                </NeumorphicCard>

                <NeumorphicCard padding="16px" style={{ alignItems: 'center', textAlign: 'center' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--accent-color)' }}>
                    48
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-light)', marginTop: '4px' }}>
                    UPVOTES GIVEN
                  </span>
                </NeumorphicCard>
              </div>

              <NeumorphicCard padding="16px" style={{ alignItems: 'center', textAlign: 'center' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--accent-color)' }}>
                  {(issues.length + 10) * 20}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: '600', color: 'var(--text-light)', marginTop: '4px' }}>
                  TOTAL IMPACT XP
                </span>
              </NeumorphicCard>
            </div>
          )}

        </div>

        {/* Bottom Floating Navigation Dock */}
        <div style={{
          position: 'absolute',
          bottom: '22px',
          left: '24px',
          right: '24px',
          height: '72px',
          borderRadius: '36px',
          backgroundColor: 'var(--bg-color)',
          boxShadow: 'var(--shadow-extruded)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '0 14px',
          zIndex: 10
        }}>
          {/* Home Tab Trigger */}
          <button 
            onClick={() => setActiveTab('home')}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: activeTab === 'home' ? 'var(--shadow-pressed)' : 'var(--shadow-extruded-sm)',
              color: activeTab === 'home' ? 'var(--accent-color)' : 'var(--text-light)',
              transition: 'all 0.2s ease',
              padding: activeTab === 'home' ? '2px' : '0'
            }}
          >
            {activeTab === 'home' ? (
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BeaconIcon size={20} fill="var(--accent-color)" stroke="var(--accent-color)" strokeWidth={1.8} opacity={1} />
              </div>
            ) : (
              <BeaconIcon size={20} fill="var(--text-light)" stroke="var(--text-light)" strokeWidth={1.8} opacity={0.6} />
            )}
          </button>

          {/* Map Tab Trigger */}
          <button 
            onClick={() => setActiveTab('map')}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: activeTab === 'map' ? 'var(--shadow-pressed)' : 'var(--shadow-extruded-sm)',
              color: activeTab === 'map' ? 'var(--accent-color)' : 'var(--text-light)',
              transition: 'all 0.2s ease'
            }}
          >
            <PinIcon size={20} color={activeTab === 'map' ? 'var(--accent-color)' : 'var(--text-light)'} fill={activeTab === 'map' ? 'var(--accent-light)' : 'none'} />
          </button>

          {/* Alerts Tab Trigger */}
          <button 
            onClick={() => setActiveTab('notifications')}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: activeTab === 'notifications' ? 'var(--shadow-pressed)' : 'var(--shadow-extruded-sm)',
              color: activeTab === 'notifications' ? 'var(--accent-color)' : 'var(--text-light)',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            <BellIcon size={20} color={activeTab === 'notifications' ? 'var(--accent-color)' : 'var(--text-light)'} fill={activeTab === 'notifications' ? 'var(--accent-light)' : 'none'} />
            {notifications.some(n => n.unread) && (
              <span style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#E53935',
                border: '1px solid var(--bg-color)'
              }} />
            )}
          </button>

          {/* Profile Tab Trigger */}
          <button 
            onClick={() => setActiveTab('profile')}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              backgroundColor: 'var(--bg-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: activeTab === 'profile' ? 'var(--shadow-pressed)' : 'var(--shadow-extruded-sm)',
              color: activeTab === 'profile' ? 'var(--accent-color)' : 'var(--text-light)',
              transition: 'all 0.2s ease'
            }}
          >
            <UserIcon size={20} color={activeTab === 'profile' ? 'var(--accent-color)' : 'var(--text-light)'} fill={activeTab === 'profile' ? 'var(--accent-light)' : 'none'} />
          </button>
        </div>
      </div>

      {/* External Branding Footer */}
      <footer style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginTop: '16px',
        marginBottom: '32px',
        color: 'var(--text-light)',
        fontSize: '0.85rem',
        fontWeight: '600',
        letterSpacing: '0.2px'
      }}>
        <BeaconIcon size={18} fill="var(--accent-color)" stroke="var(--accent-color)" strokeWidth={1.8} opacity={1} />
        <span>InfraBeacon Platform</span>
      </footer>

      {/* Fullscreen Image Modal Overlay */}
      {activeImageModal && (
        <div 
          onClick={() => setActiveImageModal(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.95)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            cursor: 'pointer',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <button 
            onClick={() => setActiveImageModal(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              color: 'white',
              background: 'none',
              border: 'none',
              fontSize: '32px',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
          <div onClick={(e) => e.stopPropagation()} style={{ cursor: 'default' }}>
            {renderLargePhoto(activeImageModal)}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
