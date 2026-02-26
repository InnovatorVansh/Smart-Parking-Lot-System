import { useState } from 'react';
import './App.css';

function App() {
  // Data Model
  // slots: Array of { slotNo: number, isCovered: boolean, isEVCharging: boolean, isOccupied: boolean }
  const [slots, setSlots] = useState([]);

  // Output message state
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success', 'error', 'info'

  // --- 1. Add Parking Slot State ---
  const [newSlotNo, setNewSlotNo] = useState('');
  const [newIsCovered, setNewIsCovered] = useState(false);
  const [newIsEVCharging, setNewIsEVCharging] = useState(false);

  // --- 3. Park Vehicle State ---
  const [parkNeedsEV, setParkNeedsEV] = useState(false);
  const [parkNeedsCover, setParkNeedsCover] = useState(false);

  // --- 4. Remove Vehicle State ---
  const [removeSlotNo, setRemoveSlotNo] = useState('');

  // Helper to show messages
  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
  };

  // --- Logic 1: Add Parking Slot ---
  const handleAddSlot = (e) => {
    e.preventDefault();
    const slotNumber = parseInt(newSlotNo, 10);

    if (isNaN(slotNumber) || slotNumber <= 0) {
      showMessage('Please enter a valid positive slot number.', 'error');
      return;
    }

    if (slots.some(slot => slot.slotNo === slotNumber)) {
      showMessage(`Error: Slot number ${slotNumber} already exists.`, 'error');
      return;
    }

    const newSlot = {
      slotNo: slotNumber,
      isCovered: newIsCovered,
      isEVCharging: newIsEVCharging,
      isOccupied: false
    };

    setSlots([...slots, newSlot]);
    showMessage(`Success: Slot ${slotNumber} added successfully.`, 'success');
    
    // Reset form
    setNewSlotNo('');
    setNewIsCovered(false);
    setNewIsEVCharging(false);
  };

  // --- Logic 2: Park Vehicle ---
  const handleParkVehicle = (e) => {
    e.preventDefault();

    // Filter available slots based on requirements
    const availableSlots = slots.filter(slot => {
      // Must not be occupied
      if (slot.isOccupied) return false;
      
      // If EV is needed, slot MUST have EV charging
      if (parkNeedsEV && !slot.isEVCharging) return false;
      
      // If Cover is needed, slot MUST be covered
      if (parkNeedsCover && !slot.isCovered) return false;
      
      return true;
    });

    if (availableSlots.length === 0) {
      showMessage('No slot available', 'error');
      return;
    }

    // Sort by smallest slotNo (nearest)
    availableSlots.sort((a, b) => a.slotNo - b.slotNo);
    const allocatedSlot = availableSlots[0];

    // Mark slot as occupied
    setSlots(slots.map(slot => 
      slot.slotNo === allocatedSlot.slotNo 
        ? { ...slot, isOccupied: true } 
        : slot
    ));

    showMessage(`Success: Vehicle parked at Slot ${allocatedSlot.slotNo}`, 'success');
  };

  // --- Logic 3: Remove Vehicle ---
  const handleRemoveVehicle = (e) => {
    e.preventDefault();
    const slotNumber = parseInt(removeSlotNo, 10);

    if (isNaN(slotNumber)) {
      showMessage('Please enter a valid slot number.', 'error');
      return;
    }

    const slotIndex = slots.findIndex(s => s.slotNo === slotNumber);

    if (slotIndex === -1) {
      showMessage(`Error: Slot ${slotNumber} does not exist.`, 'error');
      return;
    }

    if (!slots[slotIndex].isOccupied) {
      showMessage(`Error: Slot ${slotNumber} is already empty.`, 'error');
      return;
    }

    // Set occupied to false
    setSlots(slots.map(slot => 
      slot.slotNo === slotNumber 
        ? { ...slot, isOccupied: false } 
        : slot
    ));

    showMessage(`Success: Vehicle removed from Slot ${slotNumber}.`, 'success');
    setRemoveSlotNo('');
  };

  // Sort slots for display showing slotNo ascending as requested
  const sortedSlots = [...slots].sort((a, b) => a.slotNo - b.slotNo);

  return (
    <div className="app-container">
      <header className="header">
        <h1>Smart Parking Lot System</h1>
        <p>Manage your parking spaces efficiently</p>
      </header>

      {/* Output Display Panel (for latest message) */}
      {message.text && (
        <div className={`message-panel message-${message.type}`}>
          {message.text}
        </div>
      )}

      <main className="main-content">
        {/* Left Column: Forms and Controls */}
        <div className="controls-section">
          
          {/* Add Slot Form */}
          <section className="card">
            <h2>Add Parking Slot</h2>
            <form onSubmit={handleAddSlot}>
              <div className="form-group">
                <label>Slot Number</label>
                <input 
                  type="number" 
                  value={newSlotNo} 
                  onChange={(e) => setNewSlotNo(e.target.value)}
                  placeholder="e.g. 101"
                  min="1"
                  required
                />
              </div>
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="isCovered"
                  checked={newIsCovered}
                  onChange={(e) => setNewIsCovered(e.target.checked)}
                />
                <label htmlFor="isCovered">Covered Parking</label>
              </div>
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="isEV"
                  checked={newIsEVCharging}
                  onChange={(e) => setNewIsEVCharging(e.target.checked)}
                />
                <label htmlFor="isEV">EV Charging Station</label>
              </div>
              <button type="submit" className="btn" style={{marginTop: '1rem'}}>
                Add Slot
              </button>
            </form>
          </section>

          {/* Park Vehicle Section */}
          <section className="card">
            <h2>Park Vehicle</h2>
            <form onSubmit={handleParkVehicle}>
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="parkCover"
                  checked={parkNeedsCover}
                  onChange={(e) => setParkNeedsCover(e.target.checked)}
                />
                <label htmlFor="parkCover">Needs Covered Parking</label>
              </div>
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="parkEV"
                  checked={parkNeedsEV}
                  onChange={(e) => setParkNeedsEV(e.target.checked)}
                />
                <label htmlFor="parkEV">Needs EV Charging</label>
              </div>
              <button type="submit" className="btn" style={{marginTop: '1rem'}}>
                Find & Allocate Slot
              </button>
            </form>
          </section>

          {/* Remove Vehicle Section */}
          <section className="card">
            <h2>Remove Vehicle</h2>
            <form onSubmit={handleRemoveVehicle}>
              <div className="form-group">
                <label>Slot Number</label>
                <input 
                  type="number" 
                  value={removeSlotNo} 
                  onChange={(e) => setRemoveSlotNo(e.target.value)}
                  placeholder="e.g. 101"
                  min="1"
                  required
                />
              </div>
              <button type="submit" className="btn btn-danger" style={{marginTop: '0.5rem'}}>
                Remove Vehicle
              </button>
            </form>
          </section>

        </div>

        {/* Right Column: Slot Listing Table */}
        <div className="listing-section">
          <section className="card">
            <h2>Slot Listing</h2>
            {sortedSlots.length === 0 ? (
              <div className="empty-state">
                No parking slots added yet.
              </div>
            ) : (
              <div className="slot-table-container">
                <table className="slot-table">
                  <thead>
                    <tr>
                      <th>Slot No</th>
                      <th>Covered</th>
                      <th>EV Charging</th>
                      <th>Occupied</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSlots.map((slot) => (
                      <tr key={slot.slotNo}>
                        <td><strong>{slot.slotNo}</strong></td>
                        <td>{slot.isCovered ? 'Yes' : 'No'}</td>
                        <td>{slot.isEVCharging ? 'Yes' : 'No'}</td>
                        <td>
                          {slot.isOccupied 
                            ? <span className="badge badge-danger">Occupied</span>
                            : <span className="badge badge-success">Available</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
