import React, { useState } from 'react';
import NeumorphicCard from './components/NeumorphicCard';
import NeumorphicButton from './components/NeumorphicButton';
import {
  LeafIcon,
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
  const [activeTab, setActiveTab] = useState('home'); // home, map, notifications, profile, admin
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reporting Camera State
  const [showForm, setShowForm] = useState(false);
  const [cameraViewfinder, setCameraViewfinder] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null); // 'pothole', 'light', 'garbage', 'drainage', null
  const [formTitle, setFormTitle] = useState('Pothole');
  const [formLocation, setFormLocation] = useState('');

  // Admin Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

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
      photoType: 'pothole'
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
      photoType: 'light'
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
      photoType: finalPhoto
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
    setShowForm(false);
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
  };

  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'admin') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setAdminUsername('');
      setAdminPassword('');
      setActiveTab('admin');
    } else {
      alert('Invalid admin credentials! (Use admin/admin)');
    }
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
    const reportToDelete = issues.find(i => i.id === id);
    setIssues(issues.filter(issue => issue.id !== id));
    if (reportToDelete) {
      setNotifications([
        { id: Date.now(), text: `InfraBeacon Alert: Report "${reportToDelete.title}" at ${reportToDelete.location} was deleted by Admin.`, time: 'Just now', unread: true },
        ...notifications
      ]);
    }
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
          <div style={{
            position: 'absolute',
            top: '32px',
            right: '26px',
            zIndex: 15
          }}>
            <button 
              onClick={() => {
                if (isAdminLoggedIn) {
                  setIsAdminLoggedIn(false);
                  setActiveTab('home');
                } else {
                  setShowAdminLogin(true);
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

          {/* Admin Login Dialog sheet */}
          {showAdminLogin && (
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              backgroundColor: 'rgba(236, 243, 240, 0.95)',
              zIndex: 30,
              padding: '40px 30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <NeumorphicCard padding="24px">
                <form onSubmit={handleAdminLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 className="title-serif" style={{ fontSize: '1.3rem', textAlign: 'center', marginBottom: '8px' }}>Admin Login</h3>
                  
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
                        fontFamily: 'Outfit, sans-serif'
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
                        fontFamily: 'Outfit, sans-serif'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <NeumorphicButton type="submit" primary={true} style={{ flex: 1, padding: '12px' }}>
                      Login
                    </NeumorphicButton>
                    <NeumorphicButton type="button" onClick={() => setShowAdminLogin(false)} style={{ flex: 1, padding: '12px' }}>
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
                  <LeafIcon size={34} fill="var(--accent-color)" stroke="var(--accent-color)" strokeWidth={1.8} />
                  <h1 className="title-serif" style={{ fontSize: '2.1rem', letterSpacing: '-0.5px' }}>InfraBeacon</h1>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: '500', maxWidth: '280px', lineHeight: '1.3' }}>
                  Community-focused reporting for a better neighborhood
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

              {/* Report New Issue Trigger/Form */}
              {!showForm ? (
                <div 
                  onClick={() => setShowForm(true)}
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
              ) : (
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

                    {/* Interactive camera capture trigger in report form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-light)' }}>CAPTURE PROOF</label>
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={startCamera}
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
                        <span style={{ fontSize: '0.82rem', fontWeight: '500', color: capturedPhoto ? 'var(--text-main)' : 'var(--text-light)' }}>
                          {capturedPhoto ? '📸 Photo captured successfully!' : '📷 Tap photo square to open camera'}
                        </span>
                      </div>
                    </div>

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
                      <NeumorphicButton type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '12px' }}>
                        Cancel
                      </NeumorphicButton>
                    </div>
                  </form>
                </NeumorphicCard>
              )}

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
                              Status: <span style={{ fontWeight: '600', color: issue.status === 'Resolved' ? '#2E7D32' : 'var(--text-main)' }}>{issue.status}</span>
                            </span>
                          </div>
                        </div>

                        {/* Right: Map Thumbnail */}
                        <MiniMap lat={issue.lat} lng={issue.lng} />
                      </div>

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
              <header style={{ marginBottom: '20px' }}>
                <h1 className="title-serif" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Admin Dashboard</h1>
                <p style={{ color: '#2E7D32', fontSize: '0.82rem', textAlign: 'center', fontWeight: '600' }}>✓ LOGGED IN AS ADMINISTRATOR</p>
              </header>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {issues.map(issue => (
                  <NeumorphicCard key={issue.id} padding="16px">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>{issue.title}</h4>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>{issue.location} • By {issue.reporter}</p>
                        <p style={{ fontSize: '0.82rem', fontWeight: '600', marginTop: '4px' }}>
                          Current Status: <span style={{ color: issue.status === 'Resolved' ? '#2E7D32' : '#E65100' }}>{issue.status}</span>
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => deleteIssue(issue.id)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          backgroundColor: '#FFEBEE',
                          color: '#C62828',
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <TrashIcon size={14} color="#C62828" />
                      </button>
                    </div>

                    {/* Status change actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'Submitted')}
                        style={{
                          flex: 1,
                          padding: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-color)',
                          boxShadow: issue.status === 'Submitted' ? 'var(--shadow-pressed)' : 'var(--shadow-extruded-sm)',
                          color: issue.status === 'Submitted' ? 'var(--accent-color)' : 'var(--text-light)',
                          cursor: 'pointer'
                        }}
                      >
                        Submitted
                      </button>
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'In Progress')}
                        style={{
                          flex: 1,
                          padding: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-color)',
                          boxShadow: issue.status === 'In Progress' ? 'var(--shadow-pressed)' : 'var(--shadow-extruded-sm)',
                          color: issue.status === 'In Progress' ? 'var(--accent-color)' : 'var(--text-light)',
                          cursor: 'pointer'
                        }}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateIssueStatus(issue.id, 'Resolved')}
                        style={{
                          flex: 1,
                          padding: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          border: 'none',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-color)',
                          boxShadow: issue.status === 'Resolved' ? 'var(--shadow-pressed)' : 'var(--shadow-extruded-sm)',
                          color: issue.status === 'Resolved' ? 'var(--accent-color)' : 'var(--text-light)',
                          cursor: 'pointer'
                        }}
                      >
                        Resolved
                      </button>
                    </div>
                  </NeumorphicCard>
                ))}
              </div>

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
                <h1 className="title-serif" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Eco Profile</h1>
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
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: '600', marginTop: '2px' }}>COMMUNITY GUARDIAN • LVL 4</p>
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
                <LeafIcon size={20} fill="var(--accent-color)" stroke="var(--accent-color)" strokeWidth={1.8} opacity={1} />
              </div>
            ) : (
              <LeafIcon size={20} fill="var(--text-light)" stroke="var(--text-light)" strokeWidth={1.8} opacity={0.6} />
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
        <LeafIcon size={18} fill="var(--accent-color)" stroke="var(--accent-color)" strokeWidth={1.8} opacity={1} />
        <span>Eco-friendly Platform</span>
      </footer>

    </div>
  );
}

export default App;
