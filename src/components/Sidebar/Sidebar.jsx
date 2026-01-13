import React from 'react';
import LibrarySection from './LibrarySection';
import SectionTitle from './SectionTitle';
import LibraryBtn from './LibraryBtn';
import ButtonGroup from './ButtonGroup';
import MasterMerge from '../Export/MasterMerge';
import { LIBRARY_ITEMS, MONTH_NAMES, STYLES, toggleBtn } from '../../constants';

export default function Sidebar({
  selectedId,
  selectedBlock,
  currentPage,
  startDay,
  isExporting,
  onToggleLock,
  onDeleteBlock,
  onChangeBackground,
  onAddBlock,
  onApplyStarter,
  onSetStartDay,
  onExportPDF,
  onAddMonthBundle
}) {
  return (
    <div style={{
      width: "320px",
      background: "white",
      padding:  "20px",
      overflowY: "auto",
      borderRight: "1px solid #ddd"
    }}>
      <h2 style={{ fontSize:  '20px', fontWeight:  'bold', marginBottom: '10px' }}>
        Designer
      </h2>

      {/* Selected Block Actions */}
      {selectedId && (
        <div style={{
          marginBottom:  '20px',
          padding:  '10px',
          background:  '#ffede6',
          borderRadius: '8px',
          border: '1px solid #eee'
        }}>
          <button onClick={onToggleLock} style={STYLES. actionBtn}>
            {selectedBlock?. locked ? "🔓 Unlock" : "🔒 Lock"}
          </button>
          <button
            onClick={onDeleteBlock}
            style={{ ... STYLES.actionBtn, background: '#ff4d4f', marginTop: '5px' }}
          >
            🗑️ Delete
          </button>
        </div>
      )}

      {/* Background Section */}
      <SectionTitle>Planner Background</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS. backgrounds} onClick={onChangeBackground} />
      <button
        onClick={() => onChangeBackground(currentPage.bg, true)}
        style={{
          ...STYLES.smallBtn,
          width: '100%',
          background: '#ffede6',
          color: '#f7b292',
          fontWeight: 'bold',
          marginBottom: '15px'
        }}
      >
        📋 Apply Background to ALL
      </button>

      {/* Planner Covers */}
      <SectionTitle>Planner Cover</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS.covers} onClick={(id) => onAddBlock(id, "cover")} />

      {/* Month Bundles */}
      <SectionTitle>Month Bundles</SectionTitle>
      <p style={{ fontSize: '10px', color: '#ffc8b0', marginBottom: '8px', lineHeight:  '1.4' }}>
        Click to create a complete monthly spread: Month Overview + 5 Weeks + 31 Days. Important: Do not rearrange these spreads, it will break the hyperlink process.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", marginBottom: '15px' }}>
        {MONTH_NAMES.map(m => (
          <button
            key={m}
            onClick={() => onAddMonthBundle(m. toUpperCase())}
            style={{
              padding: '8px 4px',
              background:   '#ffc8b0',
              border: '1px solid #ffede6',
              cursor:  'pointer',
              fontSize:  '10px',
              borderRadius: '4px',
              fontWeight: 'bold',
              color: '#ffffff'
            }}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Headers Section */}
      <SectionTitle>Headers</SectionTitle>
      <p style={{ fontSize: '10px', color: '#666', marginBottom: '8px', lineHeight: '1.4' }}>
        After you have added your monthly spread, choose either Sunday Start or Monday Start below to place weekday headers on your monthly calendar. 
      </p>
      <LibraryBtn onClick={() => onAddBlock("sunstartheader. svg", "weekheader")}>
        Sunday Start Weekday Header
      </LibraryBtn>
      <LibraryBtn onClick={() => onAddBlock("monstartheader.svg", "weekheader")}>
        Monday Start Weekday Header
      </LibraryBtn>

      {/* Full Page Templates */}
      <SectionTitle>Full Page Templates</SectionTitle>
      <p style={{ fontSize: '10px', color: '#666', marginBottom: '8px', lineHeight: '1.4' }}>
        Select a template below to add to a page.
      </p>
      <LibraryBtn onClick={() => onApplyStarter('annualplantemp.svg')}>
        Annual Planner
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('monstartyearoverviewtemp.svg')}>
        Monday Start Year Overview
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('sunstartyearoverviewtemp.svg')}>
        Sunday Start Year Overview
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('monstartweekplantemp.svg')}>
        Monday Start Weekly Plan
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('sunstartweekplantemp.svg')}>
        Sunday Start Weekly Plan
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('monstartweektemp.svg')}>
        Monday Start Weekly Session Schedule
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('sunstartweektemp.svg')}>
        Sunday Start Weekly Session Schedule
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('monthreviewtemp.svg')}>
        Monthly Review
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('taskplannertemp.svg')}>
        Task Planner
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('listplannertemp. svg')}>
        To Do Planner
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('weektodotemp. svg')}>
        Weekly To-Do
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('yearpixelstemp. svg')}>
        Year in Pixels
      </LibraryBtn>

      {/* Clinical Templates */}
      <SectionTitle>Clinical Templates</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS.clinical} onClick={(id) => onAddBlock(id, "full")} />

      {/* Note Templates */}
      <SectionTitle>Note Templates</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS. notes} onClick={(id) => onAddBlock(id, "full")} />

      {/* Half Page Blocks */}
      <SectionTitle>Half Page Blocks</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS.halfPage} onClick={(id) => onAddBlock(id, "half")} />

      {/* Quarter Page Blocks */}
      <SectionTitle>Quarter Page Blocks</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS.quarter} onClick={(id) => onAddBlock(id, "quarter")} />

      {/* 1/8 Page Blocks */}
      <SectionTitle>1/8 Page Blocks</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS.eighth} onClick={(id) => onAddBlock(id, "1/8")} />

      {/* Export Button */}
      <button
        onClick={onExportPDF}
        disabled={isExporting}
        style={{
          ...STYLES.exportBtn,
          opacity: isExporting ? 0.6 :   1,
          cursor: isExporting ? 'not-allowed' : 'pointer'
        }}
        title={isExporting ? "Export in progress..." : "Export all pages to PDF"}
      >
        {isExporting ?   "⏳ Exporting..." : "💾 EXPORT PDF BATCH"}
      </button>

      {/* Master Merge Section */}
      <MasterMerge />
    </div>
  );
}
