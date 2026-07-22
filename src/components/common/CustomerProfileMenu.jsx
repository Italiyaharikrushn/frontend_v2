import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { logout, selectUserName, selectUserEmail } from '../../redux/authSlice';
import './CustomerProfileMenu.css';

const CustomerProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector(selectUserName);
  const userEmail = useSelector(selectUserEmail);

  // Determine avatar initial
  let avatarInitial = '';
  if (userName && userName.length > 0) {
    avatarInitial = userName.charAt(0).toUpperCase();
  } else if (userEmail && userEmail.length > 0) {
    avatarInitial = userEmail.charAt(0).toUpperCase();
  } else {
    avatarInitial = 'U';
  }

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="customer-profile-container" ref={menuRef}>
      <button 
        className="profile-avatar-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User Profile"
        aria-expanded={isOpen}
      >
        <span className="avatar-initial">{avatarInitial}</span>
      </button>

      {isOpen && (
        <div className="profile-dropdown-menu fade-in">
          <div className="profile-info">
            {userName && <p className="profile-name">{userName}</p>}
            {userEmail && <p className="profile-email">{userEmail}</p>}
            {!userName && !userEmail && <p className="profile-name">Customer</p>}
          </div>
          <div className="dropdown-divider"></div>
          <button className="dropdown-action-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerProfileMenu;
