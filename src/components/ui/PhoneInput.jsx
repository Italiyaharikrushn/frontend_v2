import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { COUNTRIES } from '../../utils/countries';
import '@/styles/css/components/PhoneInput.css';

export default function PhoneInput({ value, onChange, required, id, name, style }) {
  // Parse initial value if it contains a country code, prioritize longer codes first to avoid partial matches
  const sortedCountries = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length);
  const initialCode = value ? (sortedCountries.find(c => value.startsWith(c.code))?.code || '+91') : '+91';
  const initialNumber = value ? value.replace(initialCode, '').trim() : '';

  const [country, setCountry] = useState(COUNTRIES.find(c => c.code === initialCode) || COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhoneChange = (e) => {
    const newNumber = e.target.value;
    setPhoneNumber(newNumber);
    if (onChange) {
      onChange(`${country.code}${newNumber}`);
    }
  };

  const handleCountrySelect = (c) => {
    setCountry(c);
    setIsOpen(false);
    setSearch('');
    if (onChange) {
      onChange(`${c.code}${phoneNumber}`);
    }
  };

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  return (
    <div className="phone-input-wrapper" style={style}>
      <div className="phone-input-container">
        <div className="country-selector" ref={dropdownRef}>
          <button 
            type="button" 
            className="country-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{country.code}</span>
            <ChevronDown size={14} />
          </button>
          
          {isOpen && (
            <div className="country-dropdown">
              <div className="country-search">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
              <ul className="country-list">
                {filteredCountries.map(c => (
                  <li 
                    key={c.name} 
                    className={`country-item ${country.code === c.code ? 'active' : ''}`}
                    onClick={() => handleCountrySelect(c)}
                  >
                    <span className="country-name">{c.name}</span>
                    <span className="country-dial-code">{c.code}</span>
                  </li>
                ))}
                {filteredCountries.length === 0 && (
                  <li className="country-item empty">No countries found</li>
                )}
              </ul>
            </div>
          )}
        </div>
        
        <input 
          type="tel" 
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Enter your contact number"
          required={required}
          className="phone-number-field"
        />
        {/* Hidden input for native form submission */}
        <input type="hidden" id={id} name={name} value={`${country.code}${phoneNumber}`} />
      </div>
      {/[+\-]/.test(phoneNumber) && (
        <span className="phone-error">Contact number should not contain + or - signs.</span>
      )}
      {phoneNumber.length > 0 && !/[+\-]/.test(phoneNumber) && (
        Array.isArray(country.length) 
          ? (phoneNumber.length < country.length[0] || phoneNumber.length > country.length[1]) && (
              <span className="phone-error">Please enter between {country.length[0]} and {country.length[1]} digits for {country.name}.</span>
            )
          : phoneNumber.length !== country.length && (
              <span className="phone-error">Please enter exactly {country.length} digits for {country.name}.</span>
            )
      )}
    </div>
  );
}
