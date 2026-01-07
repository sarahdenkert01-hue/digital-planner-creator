export const STYLES = {
  overlayStyle: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems:  'center',
    zIndex: 9999,
  },
  progressCard: {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    textAlign: 'center',
    minWidth: '300px',
  },
  actionBtn: {
    width: '100%',
    padding: '10px',
    background: '#4f46e5',
    color:  'white',
    border:  'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  smallBtn: {
    flex: 1,
    padding:  '8px',
    background: '#f8f9fa',
    border: '1px solid #e2e8f0',
    borderRadius:  '4px',
    cursor:  'pointer',
    fontSize:  '11px',
  },
  exportBtn: {
    width: '100%',
    padding: '15px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius:  '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
    marginTop: '20px',
  },
};

export const toggleBtn = (isActive) => ({
  flex: 1,
  padding:  '8px',
  background: isActive ? '#4f46e5' : '#f8f9fa',
  color: isActive ? 'white' : '#333',
  border: '1px solid #e2e8f0',
  borderRadius:  '4px',
  cursor:  'pointer',
  fontSize:  '11px',
  fontWeight: isActive ? 'bold' : 'normal',
});

export const pageBtn = (isActive) => ({
  padding: '10px',
  fontSize: '11px',
  color: isActive ? '#4f46e5' : '#333',
  fontWeight: isActive ? 'bold' : 'normal',
});

export const moveBtn = {
  padding: '2px 6px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '10px',
  opacity: 0.6,
};

export const headerGridBtn = {
  padding: '6px 4px',
  background: '#fff',
  border: '1px solid #e2e8f0',
  cursor: 'pointer',
  fontSize: '9px',
  borderRadius: '2px',
};

export const libBtn = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #e2e8f0',
  cursor: 'pointer',
  fontSize: '11px',
  borderRadius: '4px',
  textAlign: 'center',
};
