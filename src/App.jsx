import React, { useState } from 'react';
import LicenseCheck from './components/Auth/LicenseCheck';
import PlannerCanvas from './components/Canvas/PlannerCanvas';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  if (!isUnlocked) {
    return <LicenseCheck onUnlock={() => setIsUnlocked(true)} />;
  }

  return <PlannerCanvas />;
}
