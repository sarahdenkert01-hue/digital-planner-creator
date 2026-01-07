import React from 'react';
import PageList from './PageList';
import SectionTitle from './SectionTitle';
import LibraryBtn from './LibraryBtn';
import ButtonGroup from './ButtonGroup';
import MasterMerge from '../Export/MasterMerge';
import { LIBRARY_ITEMS, MONTH_NAMES, STYLES, toggleBtn } from '../../constants';

export default function Sidebar({
  selectedId,
  selectedBlock,
  currentPage,
  pages,
  currentPageIndex,
  startDay,
  isExporting,
  onToggleLock,
  onDeleteBlock,
  onChangeBackground,
  onAddBlankPage,
  onDuplicatePage,
  onClearPage,
  onApplyLayoutToNext,
  onMovePage,
  onRenamePage,
  onSetCurrentPage,
  onAddBlock,
  onApplyStarter,
  onSetStartDay,
  onExportPDF,
}) {
  return (
    <div style={{
      width: "320px",
      background: "white",
      padding: "20px",
      overflowY: "auto",
      borderRight: "1px solid #ddd"
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>
        Designer
      </h2>

      {/* Selected Block Actions */}
      {selectedId && (
        <div style={{
          marginBottom: '20px',
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #eee'
        }}>
          <button onClick={onToggleLock} style={STYLES.actionBtn}>
            {selectedBlock?. locked ? "🔓 Unlock" : "🔒 Lock"}
          </button>
          <button
            onClick={onDeleteBlock}
            style={{ ...STYLES.actionBtn, color: '#ff4d4f', marginTop: '5px' }}
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
          background: '#e1f5fe',
          marginBottom: '15px'
        }}
      >
        Apply Background to ALL
      </button>

      {/* Page Management */}
      <SectionTitle>Page Management</SectionTitle>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
        <button onClick={onAddBlankPage} style={STYLES.smallBtn}>
          ➕ Add
        </button>
        <button onClick={onDuplicatePage} style={STYLES.smallBtn}>
          👯 Copy
        </button>
        <button onClick={onClearPage} style={{ ...STYLES.smallBtn, color: '#ff4d4f' }}>
          🧹 Clear
        </button>
      </div>
      <button
        onClick={onApplyLayoutToNext}
        style={{
          width: '100%',
          padding: '10px',
          background: '#4f46e5',
          color:  'white',
          border:  'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          marginBottom: '10px',
          cursor: 'pointer'
        }}
      >
        Apply Layout to Next →
      </button>

      {/* Page List */}
      <PageList
        pages={pages}
        currentPageIndex={currentPageIndex}
        onMovePage={onMovePage}
        onSetCurrentPage={onSetCurrentPage}
        onRenamePage={onRenamePage}
      />

      {/* Planner Covers */}
      <SectionTitle>Planner Cover</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS.covers} onClick={onAddBlock} />

      {/* Headers Section */}
      <SectionTitle>Headers</SectionTitle>
      <LibraryBtn onClick={() => onAddBlock("sunstartheader.svg")}>
        Sunday Start Weekday Header
      </LibraryBtn>
      <LibraryBtn onClick={() => onAddBlock("monstartheader.svg")}>
        Monday Start Weekday Header
      </LibraryBtn>
      <div style={{
        display: "grid",
        gridTemplateColumns:  "repeat(4, 1fr)",
        gap: "2px",
        marginTop: '5px'
      }}>
        {MONTH_NAMES.map(m => (
          <button
            key={m}
            onClick={() => onAddBlock(`${m}header.svg`)}
            style={{
              padding: '6px 4px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              fontSize: '9px',
              borderRadius: '2px'
            }}
          >
            {m. toUpperCase()}
          </button>
        ))}
      </div>

      {/* Monthly Layouts */}
      <SectionTitle>Monthly Layouts</SectionTitle>
      <div style={{ display: "flex", gap: "5px", marginBottom: "10px" }}>
        <button
          onClick={() => onSetStartDay("sunday")}
          style={toggleBtn(startDay === "sunday")}
        >
          Sun Start
        </button>
        <button
          onClick={() => onSetStartDay("monday")}
          style={toggleBtn(startDay === "monday")}
        >
          Mon Start
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
        {MONTH_NAMES.map(m => (
          <button
            key={m}
            onClick={() => onAddBlock(`${m}${startDay}start.png`)}
            style={{
              padding: '10px',
              background: '#fff',
              border: '1px solid #e2e8f0',
              cursor: 'pointer',
              fontSize: '11px',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Full Page Templates */}
      <SectionTitle>Full Page Templates</SectionTitle>
      <LibraryBtn onClick={() => onApplyStarter('annualplantemp.svg')}>
        Annual Planner
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('monstartyearoverviewtemp.svg')}>
        Monday Start Year Overview
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('sunstartyearoverviewtemp. svg')}>
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
      <LibraryBtn onClick={() => onApplyStarter('sunstartweektemp. svg')}>
        Sunday Start Weekly Session Schedule
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('monthreviewtemp.svg')}>
        Monthly Review
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('taskplannertemp.svg')}>
        Task Planner
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('listplannertemp.svg')}>
        To Do Planner
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('weektodotemp.svg')}>
        Weekly To-Do
      </LibraryBtn>
      <LibraryBtn onClick={() => onApplyStarter('yearpixelstemp.svg')}>
        Year in Pixels
      </LibraryBtn>

      {/* Clinical Templates */}
      <SectionTitle>Clinical Templates</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS.clinical} onClick={(id) => onAddBlock(id, "full")} />

      {/* Note Templates */}
      <SectionTitle>Note Templates</SectionTitle>
      <ButtonGroup items={LIBRARY_ITEMS.notes} onClick={(id) => onAddBlock(id, "full")} />

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
          ... STYLES.exportBtn,
          opacity: isExporting ? 0.6 : 1,
          cursor: isExporting ? 'not-allowed' : 'pointer'
        }}
        title={isExporting ? "Export in progress..." : "Export all pages to PDF"}
      >
        {isExporting ? "⏳ Exporting..." :  "💾 EXPORT PDF BATCH"}
      </button>

      {/* Master Merge Section */}
      <MasterMerge />
    </div>
  );
}
