/**
 * NoxMind - Elegant Mind Mapping Application
 * Core scripting file managing state, layout, SVG rendering, zoom/pan, import/export
 */


// --- Localization (i18n) ---
const TRANSLATIONS = {
  ja: {
    // Header
    "btn-new": "新規",
    "btn-import": "開く",
    "btn-export": "保存",
    "btn-export-image": "画像出力",
    "btn-export-png": "PNG画像",
    "btn-export-svg": "SVG画像",
    "btn-help": "ヘルプ",
    "btn-fit": "全体表示",
    "btn-center": "中央寄せ",
    "zoom-in": "拡大",
    "zoom-out": "縮小",
    // Sidebar
    "sidebar-title": "ノードの編集",
    "label-text": "テキストの編集",
    "placeholder-text": "選択されていません",
    "label-text-color": "テキストの色",
    "label-bg-color": "背景の色",
    "label-branch-color": "ブランチの色 (接続線)",
    "label-borderless": "枠なし (テキストのみ)",
    "sidebar-style": "スタイル",
    "sidebar-actions": "ノード操作",
    "btn-sidebar-add-child": "子ノード追加 (Tab)",
    "btn-sidebar-add-sibling": "同階層追加 (Enter)",
    "btn-sidebar-delete": "ノード削除 (Del)",
    "color-custom": "カスタム",
    // Help Modal
    "help-title": "NoxMind の使い方",
    "help-basic-ops": "基本操作",
    "help-zoom": "ズーム:",
    "help-zoom-desc": "マウスホイールを回す、または画面右下の「+」「-」ボタンを押します。",
    "help-scroll": "スクロール:",
    "help-scroll-desc": "背景をドラッグすると画面を移動できます。",
    "help-select": "ノードの選択:",
    "help-select-desc": "ノードをクリックすると選択できます。",
    "help-edit": "ノードの編集:",
    "help-edit-desc": "選択されたノードをダブルクリックするとテキストを変更できます。",
    "help-menu": "メニュー操作:",
    "help-menu-desc": "ノードを右クリックすると、追加・削除が簡単に行えるメニューが表示されます。",
    "help-shortcuts": "キーボードショートカット",
    "help-col-key": "キー",
    "help-col-action": "アクション",
    "help-action-tab": "選択したノードに子ノードを追加",
    "help-action-enter": "選択したノードと同階層のノードを追加（ルートの場合は子ノード）",
    "help-action-delete": "選択したノードを削除（ルートは削除できません）",
    "help-action-edit": "選択したノードの編集を開始（編集完了は Enter または外をクリック）",
    "help-action-esc": "編集をキャンセル / 選択を解除",
    "help-action-arrows": "ノード間をキーボードで移動",
    "btn-open-license": "ライセンス表示",
    "license-modal-title": "ライセンス情報",
    "license-app-title": "NoxMind ライセンス",
    "license-third-party-title": "サードパーティのソフトウェア",
    "license-third-party-desc": "NoxMind は以下のオープンソースプロジェクトを利用しています。",
    "ctx-expand-all": "すべて展開",
    "ctx-collapse-all": "すべて折りたたむ",
    "ctx-add-root-child": "新規ノードを追加",
    "ctx-center-view": "中央に戻す",
    "ctx-fit-screen": "全体を表示",
    "ctx-new-map": "新規作成",
    "btn-layout-mode-title": "配置切り替え (左右均等 / 右側のみ)",
    "btn-layout-mode": "配置方向",
    "btn-save-overwrite": "上書き保存",
    "btn-save-as": "名前を付けて保存",
    "btn-save-dropdown-title": "保存メニューを開く",
    "toast-saved": "保存しました",
    "toast-save-failed": "保存に失敗しました",
    "toast-import-failed": "読み込みに失敗しました",
    // Confirmations / Dialogs
    "confirm-dialog-title": "確認",
    "confirm-new-title": "新規作成の確認",
    "confirm-new-msg": "現在編集中のマインドマップは破棄されます。<br>本当に新しく作成しますか？",
    "confirm-new-btn": "新規作成",
    "confirm-delete-title": "ノード削除の確認",
    "confirm-delete-msg": "選択したノードと、そのすべての子ノードを削除します。<br>本当に削除しますか？",
    "confirm-delete-btn": "削除",
    "btn-cancel": "キャンセル",
    "btn-ok": "確定",
    "default-node-text": "ノード",
    "central-theme": "セントラルテーマ",
    "confirm-err-title": "削除できません",
    "confirm-err-root": "セントラルテーマ（ルート）は削除できません。",
    "search-placeholder": "ノードを検索...",
    // Context Menu
    "ctx-add-child": "子ノードを追加",
    "ctx-add-sibling": "同階層を追加",
    "ctx-delete-node": "ノードを削除"
  },
  en: {
    // Header
    "btn-new": "New",
    "btn-import": "Open",
    "btn-export": "Save",
    "btn-export-image": "Export Image",
    "btn-export-png": "PNG Image",
    "btn-export-svg": "SVG Image",
    "btn-help": "Help",
    "btn-fit": "Fit to Screen",
    "btn-center": "Center View",
    "zoom-in": "Zoom In",
    "zoom-out": "Zoom Out",
    // Sidebar
    "sidebar-title": "Edit Node",
    "label-text": "Edit Text",
    "placeholder-text": "No node selected",
    "label-text-color": "Text Color",
    "label-bg-color": "Background Color",
    "label-branch-color": "Branch Color (Lines)",
    "label-borderless": "Borderless (Text Only)",
    "sidebar-style": "Style",
    "sidebar-actions": "Node Operations",
    "btn-sidebar-add-child": "Add Child (Tab)",
    "btn-sidebar-add-sibling": "Add Sibling (Enter)",
    "btn-sidebar-delete": "Delete Node (Del)",
    "color-custom": "Custom",
    // Help Modal
    "help-title": "How to use NoxMind",
    "help-basic-ops": "Basic Operations",
    "help-zoom": "Zoom:",
    "help-zoom-desc": "Scroll the mouse wheel, or press the '+' / '-' buttons in the bottom right corner.",
    "help-scroll": "Scroll:",
    "help-scroll-desc": "Drag the background to pan the canvas.",
    "help-select": "Select Node:",
    "help-select-desc": "Click a node to select it.",
    "help-edit": "Edit Node:",
    "help-edit-desc": "Double-click a selected node to edit its text.",
    "help-menu": "Menu Operation:",
    "help-menu-desc": "Right-click a node to open a quick action menu for adding or deleting nodes.",
    "help-shortcuts": "Keyboard Shortcuts",
    "help-col-key": "Key",
    "help-col-action": "Action",
    "help-action-tab": "Add a child node to the selected node",
    "help-action-enter": "Add a sibling node (or a child if root is selected)",
    "help-action-delete": "Delete the selected node (Root cannot be deleted)",
    "help-action-edit": "Start editing the selected node (Press Enter or click outside to finish)",
    "help-action-esc": "Cancel editing / Deselect node",
    "help-action-arrows": "Navigate selection between nodes",
    "btn-open-license": "View License",
    "license-modal-title": "License Information",
    "license-app-title": "NoxMind License",
    "license-third-party-title": "Third-Party Software",
    "license-third-party-desc": "NoxMind uses the following open source projects.",
    "ctx-expand-all": "Expand All",
    "ctx-collapse-all": "Collapse All",
    "ctx-add-root-child": "Add Node",
    "ctx-center-view": "Center View",
    "ctx-fit-screen": "Fit to Screen",
    "ctx-new-map": "New Map",
    "btn-layout-mode-title": "Toggle Layout (Balanced / Right-Only)",
    "btn-layout-mode": "Layout",
    "btn-save-overwrite": "Save",
    "btn-save-as": "Save As...",
    "btn-save-dropdown-title": "Open Save Menu",
    "toast-saved": "Saved successfully",
    "toast-save-failed": "Failed to save file",
    "toast-import-failed": "Failed to load file",
    // Confirmations / Dialogs
    "confirm-dialog-title": "Confirmation",
    "confirm-new-title": "Confirm New Canvas",
    "confirm-new-msg": "Your current mind map will be discarded.<br>Are you sure you want to create a new one?",
    "confirm-new-btn": "Create New",
    "confirm-delete-title": "Confirm Node Deletion",
    "confirm-delete-msg": "This will delete the selected node and all its child nodes.<br>Are you sure you want to delete?",
    "confirm-delete-btn": "Delete",
    "btn-cancel": "Cancel",
    "btn-ok": "OK",
    "default-node-text": "Node",
    "central-theme": "Central Theme",
    "confirm-dialog-title": "Confirmation",
    "confirm-err-title": "Cannot Delete",
    "confirm-err-root": "The Central Theme (root) cannot be deleted.",
    "search-placeholder": "Search nodes...",
    // Context Menu
    "ctx-add-child": "Add Child Node",
    "ctx-add-sibling": "Add Sibling Node",
    "ctx-delete-node": "Delete Node"
  }
};

const systemLanguage = (navigator.language || navigator.userLanguage || 'en').startsWith('ja') ? 'ja' : 'en';

function t(key) {
  return (TRANSLATIONS[systemLanguage] && TRANSLATIONS[systemLanguage][key]) || TRANSLATIONS['en'][key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.value = t(key);
    } else {
      el.innerHTML = t(key);
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.setAttribute('title', t(key));
  });
}

// --- Default Data Structure ---
const DEFAULT_MINDMAP = {
  id: "root",
  text: t('central-theme'),
  color: "#ffffff",
  bgColor: "#1e1e2e",
  branchColor: "#89b4fa",
  children: []
};

function getLocalStorageData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn("localStorage is not available:", e);
    return fallback;
  }
}

function setLocalStorageData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage is not writeable:", e);
  }
}

// --- Application State ---
let mindMapData = getLocalStorageData('noxmind_data', DEFAULT_MINDMAP);
if (!mindMapData || mindMapData.id !== 'root' || typeof mindMapData.text !== 'string' || !Array.isArray(mindMapData.children)) {
  console.warn("Invalid mindMapData in localStorage, resetting to default.");
  mindMapData = JSON.parse(JSON.stringify(DEFAULT_MINDMAP));
}
let layoutMode = getLocalStorageData('noxmind_layout_mode', 'balanced');
let currentFilePath = null;
let activeNodeId = 'root';
let isEditing = false;
let defaultBorderless = false;

// Search state
let isSearchOpen = false;
let searchMatches = [];
let currentSearchIndex = -1;

// Drag and Drop state
let dragNodeId = null;
let dragStartX = 0;
let dragStartY = 0;
let dragNodeOffsetX = 0;
let dragNodeOffsetY = 0;
let isDraggingNode = false;
let dropTargetNodeId = null;
let contextMenuNodeId = null;

// Zoom and Pan state
let scale = 1;
let translateX = 0;
let translateY = 0;
let isDragging = false;
let startX = 0;
let startY = 0;
let lastSvgWidth = 0;
let lastSvgHeight = 0;

// Configuration Constants
const NODE_WIDTH = 240;
const GAP_X = 100;
const GAP_Y = 24;

// DOM Elements
let svg;
let canvasContainer;
let viewport;
let nodesGroup;
let connectionsGroup;
let sidebar;
let fileInput;

// --- Helper Functions ---

// Generate unique ID for nodes
function generateId() {
  return 'node-' + Math.random().toString(36).substr(2, 9);
}

// Find a node by ID recursively
function findNodeById(node, id) {
  if (node.id === id) return node;
  if (node.children) {
    for (let child of node.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }
  return null;
}

// Find parent node recursively
function findParentNode(node, childId) {
  if (node.children) {
    for (let child of node.children) {
      if (child.id === childId) return node;
      const found = findParentNode(child, childId);
      if (found) return found;
    }
  }
  return null;
}

// Save to localStorage
function saveToLocalStorage() {
  setLocalStorageData('noxmind_data', mindMapData);
}

// Convert client coordinates to SVG viewport coordinates
function getSvgCoordinates(clientX, clientY) {
  const rect = svg.getBoundingClientRect();
  return {
    x: (clientX - rect.left - translateX) / scale,
    y: (clientY - rect.top - translateY) / scale
  };
}

// Check if a node is a descendant of another node (to avoid circular parent-child loops)
function isDescendant(parent, targetId) {
  if (parent.id === targetId) return true;
  if (parent.children) {
    for (let child of parent.children) {
      if (isDescendant(child, targetId)) return true;
    }
  }
  return false;
}

// Move node to a new parent node (re-parenting)
function moveNodeToNewParent(nodeId, newParentId) {
  const node = findNodeById(mindMapData, nodeId);
  const oldParent = findParentNode(mindMapData, nodeId);
  const newParent = findNodeById(mindMapData, newParentId);
  
  if (!node || !oldParent || !newParent) return;
  
  // Remove from old parent
  oldParent.children = oldParent.children.filter(c => c.id !== nodeId);
  
  // Adopt or generate branchColor
  if (newParentId === 'root') {
    const niceColors = ['#f38ba8', '#a6e3a1', '#f9e2af', '#89b4fa', '#cba6f7', '#fab387', '#94e2d5', '#f5e0dc'];
    node.branchColor = niceColors[newParent.children.length % niceColors.length];
  } else {
    node.branchColor = newParent.branchColor;
  }
  
  // Add to new parent
  newParent.children.push(node);
  
  saveToLocalStorage();
  renderMindMap();
  selectNode(nodeId);
}

// Show custom context menu for a node
function showContextMenu(x, y, nodeId) {
  // Hide canvas menu first
  const canvasMenu = document.getElementById('canvas-context-menu');
  if (canvasMenu) canvasMenu.style.display = 'none';

  const menu = document.getElementById('context-menu');
  const ctxAddSibling = document.getElementById('ctx-add-sibling');
  const ctxDeleteNode = document.getElementById('ctx-delete-node');
  const divider = menu.querySelector('.context-menu-divider');
  
  if (nodeId === 'root') {
    if (ctxAddSibling) ctxAddSibling.style.display = 'none';
    if (ctxDeleteNode) ctxDeleteNode.style.display = 'none';
    if (divider) divider.style.display = 'none';
  } else {
    if (ctxAddSibling) ctxAddSibling.style.display = 'flex';
    if (ctxDeleteNode) ctxDeleteNode.style.display = 'flex';
    if (divider) divider.style.display = 'block';
  }
  
  menu.style.display = 'block';
  
  // Prevent menu from going off-screen
  const menuWidth = menu.offsetWidth || 180;
  const menuHeight = menu.offsetHeight || 130;
  
  const posX = (x + menuWidth > window.innerWidth) ? x - menuWidth : x;
  const posY = (y + menuHeight > window.innerHeight) ? y - menuHeight : y;
  
  menu.style.left = `${posX}px`;
  menu.style.top = `${posY}px`;
}

// Show custom context menu for canvas background
function showCanvasContextMenu(x, y) {
  hideContextMenu();
  const menu = document.getElementById('canvas-context-menu');
  if (!menu) return;

  menu.style.display = 'block';

  const menuWidth = menu.offsetWidth || 180;
  const menuHeight = menu.offsetHeight || 90;

  const posX = (x + menuWidth > window.innerWidth) ? x - menuWidth : x;
  const posY = (y + menuHeight > window.innerHeight) ? y - menuHeight : y;

  menu.style.left = `${posX}px`;
  menu.style.top = `${posY}px`;
}

// Hide custom context menu
function hideContextMenu() {
  const menu = document.getElementById('context-menu');
  if (menu) {
    menu.style.display = 'none';
  }
  const canvasMenu = document.getElementById('canvas-context-menu');
  if (canvasMenu) {
    canvasMenu.style.display = 'none';
  }
  contextMenuNodeId = null;
}

// --- Layout Algorithm (2-Pass Rendering) ---

/**
 * First Pass: Render invisible nodes to measure heights
 */
function createInvisibleNodes(node, depth = 0) {
  // Create HTML structure for node
  const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  fo.setAttribute('id', `measure-${node.id}`);
  fo.setAttribute('width', getNodeWidth(node));
  fo.setAttribute('height', '300'); // Temporary height (enough to fit text)
  fo.setAttribute('class', 'mindmap-node-wrapper');
  fo.style.visibility = 'hidden';
  fo.style.position = 'absolute';

  const div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  div.className = `mindmap-node level-${depth}`;
  div.style.height = 'auto'; // Force auto height to accurately measure the content height instead of taking parent 300px height
  div.innerHTML = `<span class="node-text">${escapeHtml(node.text)}</span>`;
  
  fo.appendChild(div);
  nodesGroup.appendChild(fo);

  if (node.children && !node.collapsed) {
    node.children.forEach(child => createInvisibleNodes(child, depth + 1));
  }
}

/**
 * Helper to calculate node width dynamically based on text length (supporting manual breaks)
 */
function getNodeWidth(node) {
  const text = node.text || t('default-node-text');
  const lines = text.split('\n');
  let maxLineScore = 0;
  
  lines.forEach(line => {
    let lineScore = 0;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const isFullWidth = char.match(/[^\x01-\x7E\xA1-\xDF]/);
      lineScore += isFullWidth ? 15 : 9; // Increased width per character to ensure horizontal shapes
    }
    if (lineScore > maxLineScore) {
      maxLineScore = lineScore;
    }
  });
  
  // Padding left/right: 16px each = 32px. Extra scale for root node text size
  const padding = node.id === 'root' ? 42 : 32;
  const scale = node.id === 'root' ? 1.15 : 1.0;
  
  const computedWidth = maxLineScore * scale + padding;
  return Math.max(120, Math.min(computedWidth, 1000)); // cap at 1000px, min width 120px for rectangle feel
}

/**
 * Helper to measure rendered node height
 */
function measureNodeHeights(node) {
  const el = document.querySelector(`#measure-${node.id} .mindmap-node`);
  if (el) {
    node.height = el.offsetHeight || 40;
  } else {
    node.height = 40;
  }
  node.width = getNodeWidth(node);
  
  // Clean up temporary measuring elements
  const measureFo = document.getElementById(`measure-${node.id}`);
  if (measureFo) measureFo.remove();

  if (node.children && !node.collapsed) {
    node.children.forEach(child => measureNodeHeights(child));
  }
}

/**
 * Calculate Subtree Heights recursively
 */
function calculateSubtreeHeights(node) {
  if (!node.children || node.children.length === 0 || node.collapsed) {
    node.subtreeHeight = node.height || 40;
    return node.subtreeHeight;
  }

  let childrenHeight = 0;
  node.children.forEach(child => {
    childrenHeight += calculateSubtreeHeights(child);
  });
  childrenHeight += (node.children.length - 1) * GAP_Y;

  node.subtreeHeight = Math.max(node.height || 40, childrenHeight);
  return node.subtreeHeight;
}

/**
 * Calculate Node Coordinates (X, Y)
 */
function layoutSubtree(node, parentX, parentY, direction) {
  if (node.id === 'root') {
    node.x = 0;
    node.y = 0;

    if (layoutMode === 'right-only') {
      layoutChildren(node.children, 0, 0, 1, node);
    } else {
      // Distribute children left and right
      const lefts = [];
      const rights = [];
      node.children.forEach((child, i) => {
        if (i % 2 === 0) {
          rights.push(child);
        } else {
          lefts.push(child);
        }
      });

      layoutChildren(rights, 0, 0, 1, node);
      layoutChildren(lefts, 0, 0, -1, node);
    }
  } else if (!node.collapsed) {
    layoutChildren(node.children, node.x, node.y, direction, node);
  }
}

function layoutChildren(children, parentX, parentY, direction, parentNode) {
  if (!children || children.length === 0) return;

  let totalHeight = 0;
  children.forEach(child => {
    totalHeight += child.subtreeHeight;
  });
  totalHeight += (children.length - 1) * GAP_Y;

  let currentY = parentY - totalHeight / 2;

  children.forEach(child => {
    const parentW = parentNode ? parentNode.width : NODE_WIDTH;
    child.x = parentX + direction * (parentW / 2 + GAP_X + child.width / 2);
    child.y = currentY + child.subtreeHeight / 2;
    currentY += child.subtreeHeight + GAP_Y;

    // Recurse children
    if (!child.collapsed) {
      layoutSubtree(child, child.x, child.y, direction);
    }
  });
}

// Get nodes direction (1 for right, -1 for left)
function getNodeDirection(nodeId) {
  if (nodeId === 'root') return 1;
  if (layoutMode === 'right-only') return 1;
  
  // Find which branch path from root this node belongs to
  let current = findNodeById(mindMapData, nodeId);
  let parent = findParentNode(mindMapData, nodeId);
  
  while (parent && parent.id !== 'root') {
    current = parent;
    parent = findParentNode(mindMapData, current.id);
  }
  
  if (!parent) return 1; // Fallback
  
  // Now parent is root, current is a direct child of root
  const index = parent.children.findIndex(c => c.id === current.id);
  return index % 2 === 0 ? 1 : -1;
}

/**
 * Render Mindmap Elements
 */
function renderMindMap() {
  // Clear groups
  nodesGroup.innerHTML = '';
  connectionsGroup.innerHTML = '';

  // 1st Pass: Create invisible nodes to measure heights
  createInvisibleNodes(mindMapData);
  
  // Wait a small tick for browser layout, then measure and arrange
  // Since we need immediate sync rendering for smooth interactions,
  // we do the measurement in DOM synchronously (it works because elements are added).
  measureNodeHeights(mindMapData);
  
  // 2nd Pass: Calculate layout positions
  calculateSubtreeHeights(mindMapData);
  layoutSubtree(mindMapData, 0, 0, 1);

  // Render nodes and connections
  renderNode(mindMapData, 0);
  renderConnections(mindMapData);

  // Update properties sidebar values
  updateSidebar();

  // Update Layout Mode Button UI
  updateLayoutModeUI();
}

/**
 * Draw connection lines (Bézier curves)
 */
function renderConnections(node) {
  if (!node.children || node.children.length === 0 || node.collapsed) return;

  node.children.forEach(child => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'connection-path');
    
    // Determine path points
    const startY = node.y;
    const endY = child.y;
    
    let startX, endX, direction;
    
    if (node.id === 'root') {
      direction = child.x > 0 ? 1 : -1;
      startX = direction === 1 ? node.width / 2 : -node.width / 2;
      endX = direction === 1 ? child.x - child.width / 2 : child.x + child.width / 2;
    } else {
      direction = child.x > node.x ? 1 : -1;
      startX = direction === 1 ? node.x + node.width / 2 : node.x - node.width / 2;
      endX = direction === 1 ? child.x - child.width / 2 : child.x + child.width / 2;
    }
    
    // Calculate Bézier curve
    const dx = Math.abs(endX - startX) * 0.5;
    const pathData = `M ${startX} ${startY} C ${startX + direction * dx} ${startY}, ${endX - direction * dx} ${endY}, ${endX} ${endY}`;
    
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', child.branchColor || node.branchColor || '#89b4fa');
    
    // Line width gets thinner further from root
    let strokeWidth = 3;
    if (node.id === 'root') strokeWidth = 4;
    else if (!child.children || child.children.length === 0) strokeWidth = 2;
    
    path.setAttribute('stroke-width', strokeWidth);
    
    connectionsGroup.appendChild(path);
    
    // Recurse children
    if (!child.collapsed) {
      renderConnections(child);
    }
  });
}

/**
 * Render single node HTML inside SVG foreignObject
 */
function renderNode(node, depth) {
  const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  fo.setAttribute('id', `fo-${node.id}`);
  fo.setAttribute('x', node.x - node.width / 2);
  fo.setAttribute('y', node.y - node.height / 2);
  fo.setAttribute('width', node.width);
  fo.setAttribute('height', node.height);
  fo.setAttribute('class', 'mindmap-node-wrapper');
  
  const div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  div.setAttribute('data-id', node.id);
  div.className = `mindmap-node level-${depth}`;
  if (node.id === activeNodeId) div.className += ' active';
  if (node.borderless) div.className += ' borderless';
  
  if (searchMatches.includes(node.id)) {
    div.className += ' search-match';
    if (searchMatches[currentSearchIndex] === node.id) {
      div.className += ' search-current-match';
    }
  }
  
  // Custom Styles
  div.style.backgroundColor = node.bgColor || '#1e1e2e';
  div.style.color = node.color || '#ffffff';
  
  // Border color inherits branch color (except root)
  if (node.id !== 'root') {
    div.style.borderColor = node.branchColor || '#89b4fa';
  } else {
    div.style.borderColor = '#89b4fa';
  }
  
  const span = document.createElement('span');
  span.className = 'node-text';
  span.id = `text-${node.id}`;
  span.textContent = node.text;
  
  div.appendChild(span);

  fo.appendChild(div);
  nodesGroup.appendChild(fo);

  // Render toggle button if node has children and is not the root node
  if (node.id !== 'root' && node.children && node.children.length > 0) {
    const dir = getNodeDirection(node.id);
    const toggleX = node.x + dir * (node.width / 2);
    const toggleY = node.y;

    const toggleG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    toggleG.setAttribute('class', 'node-toggle-svg');
    toggleG.setAttribute('cursor', 'pointer');

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', toggleX);
    circle.setAttribute('cy', toggleY);
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', 'var(--bg-surface)');
    circle.setAttribute('stroke', 'var(--accent)');
    circle.setAttribute('stroke-width', '1.5');
    toggleG.appendChild(circle);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let pathData = `M ${toggleX - 5} ${toggleY} L ${toggleX + 5} ${toggleY}`;
    if (node.collapsed) {
      pathData += ` M ${toggleX} ${toggleY - 5} L ${toggleX} ${toggleY + 5}`;
    }
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', 'var(--text-main)');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    toggleG.appendChild(path);

    toggleG.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNodeCollapse(node.id);
    });

    nodesGroup.appendChild(toggleG);
  }

  // Attach Event Listeners to Nodes
  div.addEventListener('click', (e) => {
    e.stopPropagation();
    selectNode(node.id);
  });

  div.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    startEditing(node.id);
  });

  div.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Left click only
    if (isEditing) return;
    if (node.id === 'root') return; // Root cannot be dragged
    
    e.stopPropagation();
    
    dragNodeId = node.id;
    const mouseSvg = getSvgCoordinates(e.clientX, e.clientY);
    dragStartX = mouseSvg.x;
    dragStartY = mouseSvg.y;
    dragNodeOffsetX = node.x - mouseSvg.x;
    dragNodeOffsetY = node.y - mouseSvg.y;
    isDraggingNode = false;
  });

  div.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isEditing) return;
    
    contextMenuNodeId = node.id;
    selectNode(node.id);
    showContextMenu(e.clientX, e.clientY, node.id);
  });

  // Render children
  if (node.children && !node.collapsed) {
    node.children.forEach(child => renderNode(child, depth + 1));
  }
}

// --- Node Editing and Interaction ---

function selectNode(id) {
  if (isEditing) finishEditing();
  
  activeNodeId = id;
  
  // Refresh active status class
  document.querySelectorAll('.mindmap-node').forEach(el => el.classList.remove('active'));
  const activeFo = document.getElementById(`text-${id}`);
  if (activeFo) {
    const nodeDiv = activeFo.closest('.mindmap-node');
    if (nodeDiv) {
      nodeDiv.classList.add('active');
    }
  }
  
  // Re-render to update shadows and selections cleanly
  renderMindMap();
  
  // Open property panel sidebar
  sidebar.classList.add('open');
  
  // Reset document scroll positions to block iOS Safari auto-scroll bug on value updates
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.body.scrollLeft = 0;
    document.body.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
    document.documentElement.scrollTop = 0;
  }, 0);
}

function startEditing(id) {
  const span = document.getElementById(`text-${id}`);
  if (!span) return;

  const nodeDiv = span.closest('.mindmap-node');
  nodeDiv.classList.add('editing');
  span.contentEditable = true;
  
  // Put cursor at the end of the text
  span.focus();
  const range = document.createRange();
  range.selectNodeContents(span);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  isEditing = true;
  
  // Attach key events specific to editing
  span.addEventListener('keydown', handleEditingKeydown);
  span.addEventListener('blur', () => finishEditing(id));
}

function handleEditingKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    e.target.blur(); // Triggers blur listener -> finishEditing
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    const node = findNodeById(mindMapData, activeNodeId);
    e.target.innerText = node.text; // Revert using innerText to support line breaks
    e.target.blur();
  }
}

function finishEditing(id = activeNodeId) {
  const span = document.getElementById(`text-${id}`);
  if (!span || !isEditing) return;

  isEditing = false;
  span.contentEditable = false;
  const nodeDiv = span.closest('.mindmap-node');
  if (nodeDiv) nodeDiv.classList.remove('editing');

  const newText = span.innerText.trim() || t('default-node-text');
  const node = findNodeById(mindMapData, id);
  if (node && node.text !== newText) {
    node.text = newText;
    saveToLocalStorage();
    renderMindMap();
  }
}

// --- Node CRUD Operations ---

function addNewChild(parentId = activeNodeId) {
  const parentNode = findNodeById(mindMapData, parentId);
  if (!parentNode) return;

  let branchColor = parentNode.branchColor;
  
  // If parent is root, assign a new bright color for the branch
  if (parentId === 'root') {
    const niceColors = ['#f38ba8', '#a6e3a1', '#f9e2af', '#89b4fa', '#cba6f7', '#fab387', '#94e2d5', '#f5e0dc'];
    branchColor = niceColors[parentNode.children.length % niceColors.length];
  }

  const newNode = {
    id: generateId(),
    text: "",
    color: parentNode.color || "#ffffff",
    bgColor: parentNode.bgColor || "#252538",
    branchColor: branchColor || "#89b4fa",
    borderless: defaultBorderless,
    children: []
  };

  parentNode.children.push(newNode);
  saveToLocalStorage();
  
  // Render and select new node
  renderMindMap();
  selectNode(newNode.id);
  
  // Immediately edit
  setTimeout(() => startEditing(newNode.id), 50);
}

function addNewSibling(nodeId = activeNodeId) {
  if (nodeId === 'root') {
    addNewChild('root');
    return;
  }

  const parentNode = findParentNode(mindMapData, nodeId);
  if (!parentNode) return;

  const node = findNodeById(mindMapData, nodeId);
  const index = parentNode.children.findIndex(c => c.id === nodeId);

  const newNode = {
    id: generateId(),
    text: "",
    color: node.color || "#ffffff",
    bgColor: node.bgColor || "#252538",
    branchColor: node.branchColor || "#89b4fa",
    borderless: defaultBorderless,
    children: []
  };

  // Insert sibling right after selected node
  parentNode.children.splice(index + 1, 0, newNode);
  saveToLocalStorage();

  renderMindMap();
  selectNode(newNode.id);
  
  setTimeout(() => startEditing(newNode.id), 50);
}

let confirmCallback = null;

function showConfirm(title, message, okText, onConfirm, isAlert = false) {
  const confirmModal = document.getElementById('confirm-modal');
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').innerHTML = message;
  
  const btnOk = document.getElementById('btn-confirm-ok');
  btnOk.textContent = okText;
  
  const btnCancel = document.getElementById('btn-confirm-cancel');
  if (isAlert) {
    btnCancel.style.display = 'none';
  } else {
    btnCancel.style.display = 'block';
  }
  
  confirmCallback = onConfirm;
  confirmModal.classList.add('open');
}

function deleteNode(nodeId = activeNodeId) {
  if (nodeId === 'root') {
    showConfirm(t("confirm-err-title"), t("confirm-err-root"), "OK", null, true);
    return;
  }

  const parentNode = findParentNode(mindMapData, nodeId);
  if (!parentNode) return;

  showConfirm(
    t("confirm-delete-title"),
    t("confirm-delete-msg"),
    t("confirm-delete-btn"),
    () => {
      parentNode.children = parentNode.children.filter(c => c.id !== nodeId);
      saveToLocalStorage();
      
      // Select parent after deletion
      selectNode(parentNode.id);
      renderMindMap();
    }
  );
}

// --- Zoom & Pan Management ---

function updateViewportTransform() {
  viewport.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
  
  // Force WebKit/Safari to repaint the SVG canvas to prevent rendering trails of foreignObject elements
  svg.style.opacity = svg.style.opacity === '0.999' ? '1' : '0.999';
  
  // Update UI Zoom Level indicator
  document.getElementById('zoom-level').textContent = `${Math.round(scale * 100)}%`;
}

function zoomTo(targetScale, mouseX = null, mouseY = null) {
  const oldScale = scale;
  scale = Math.min(Math.max(0.15, targetScale), 3.0);
  
  const rect = svg.getBoundingClientRect();
  const rectW = rect.width || window.innerWidth;
  const rectH = rect.height || (window.innerHeight - 64);
  const cx = mouseX !== null ? mouseX : rectW / 2;
  const cy = mouseY !== null ? mouseY : rectH / 2;
  
  translateX = cx - (cx - translateX) * (scale / oldScale);
  translateY = cy - (cy - translateY) * (scale / oldScale);
  
  updateViewportTransform();
}

function zoom(factor, mouseX = null, mouseY = null) {
  zoomTo(scale * factor, mouseX, mouseY);
}

function centerMindMap() {
  const rect = svg.getBoundingClientRect();
  const rectW = rect.width || window.innerWidth;
  const rectH = rect.height || (window.innerHeight - 64);
  translateX = rectW / 2;
  translateY = rectH / 2;
  scale = 1.0;
  lastSvgWidth = rectW;
  lastSvgHeight = rectH;
  updateViewportTransform();
}

function fitToScreen() {
  const rect = svg.getBoundingClientRect();
  const rectW = rect.width || window.innerWidth;
  const rectH = rect.height || (window.innerHeight - 64);
  lastSvgWidth = rectW;
  lastSvgHeight = rectH;
  
  // Calculate bounding box of all nodes
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  function getBounds(node) {
    if (!node || typeof node.x !== 'number' || typeof node.y !== 'number' || isNaN(node.x) || isNaN(node.y)) {
      return;
    }
    const nMinX = node.x - (node.width || 120) / 2;
    const nMaxX = node.x + (node.width || 120) / 2;
    const nMinY = node.y - (node.height || 40) / 2;
    const nMaxY = node.y + (node.height || 40) / 2;
    
    if (nMinX < minX) minX = nMinX;
    if (nMaxX > maxX) maxX = nMaxX;
    if (nMinY < minY) minY = nMinY;
    if (nMaxY > maxY) maxY = nMaxY;
    
    if (node.children && !node.collapsed) {
      node.children.forEach(getBounds);
    }
  }
  
  getBounds(mindMapData);
  
  // Safe fallback if bounds are invalid (e.g. no valid node positions found)
  if (minX === Infinity || maxX === -Infinity || minY === Infinity || maxY === -Infinity) {
    translateX = rectW / 2;
    translateY = rectH / 2;
    scale = 1.0;
    updateViewportTransform();
    return;
  }
  
  const mapW = maxX - minX;
  const mapH = maxY - minY;
  
  if (mapW <= 0 || mapH <= 0 || isNaN(mapW) || isNaN(mapH)) {
    translateX = rectW / 2;
    translateY = rectH / 2;
    scale = 1.0;
    updateViewportTransform();
    return;
  }
  
  const padding = 60;
  const scaleX = (rectW - padding) / mapW;
  const scaleY = (rectH - padding) / mapH;
  
  scale = Math.min(scaleX, scaleY, 1.5); // Don't scale up too much
  scale = Math.max(0.2, scale); // Don't scale down too much
  if (isNaN(scale)) scale = 1.0;
  
  // Target center coordinate
  const mapCenterX = (minX + maxX) / 2;
  const mapCenterY = (minY + maxY) / 2;
  
  translateX = rectW / 2 - mapCenterX * scale;
  translateY = rectH / 2 - mapCenterY * scale;
  
  if (isNaN(translateX) || isNaN(translateY)) {
    translateX = rectW / 2;
    translateY = rectH / 2;
  }
  
  updateViewportTransform();
}

// --- Tauri Native File API Helper ---
function checkIsTauri() {
  try {
    return typeof window !== 'undefined' && 
           window.__TAURI__ !== undefined && 
           window.__TAURI__ !== null && 
           window.__TAURI__.core !== undefined;
  } catch (e) {
    return false;
  }
}

async function saveNative(asDialog = false) {
  const dataStr = JSON.stringify(mindMapData, null, 2);
  
  try {
    if (!asDialog && currentFilePath) {
      await window.__TAURI__.core.invoke('save_file', { path: currentFilePath, data: dataStr });
      showToast(t('toast-saved'));
    } else {
      const path = await window.__TAURI__.core.invoke('save_file_dialog', { data: dataStr });
      if (path) {
        currentFilePath = path;
        updateFileNameDisplay();
        showToast(t('toast-saved'));
      }
    }
  } catch (err) {
    console.error(err);
    showToast(t('toast-save-failed') + ': ' + err);
  }
}

async function openNative() {
  try {
    const result = await window.__TAURI__.core.invoke('open_file_dialog');
    if (result) {
      const parsedData = JSON.parse(result.content);
      if (parsedData && parsedData.id === 'root' && typeof parsedData.text === 'string') {
        mindMapData = parsedData;
        currentFilePath = result.path;
        activeNodeId = 'root';
        saveToLocalStorage();
        updateFileNameDisplay();
        renderMindMap();
        fitToScreen();
        showToast(t('toast-saved'));
      } else {
        showToast(t('toast-import-failed'));
      }
    }
  } catch (err) {
    console.error(err);
    showToast(t('toast-import-failed') + ': ' + err);
  }
}

function updateFileNameDisplay() {
  const el = document.getElementById('current-file-name');
  if (!el) return;
  if (currentFilePath) {
    const parts = currentFilePath.split(/[/\\]/);
    const fileName = parts[parts.length - 1];
    el.textContent = `[ ${fileName} ]`;
    el.style.display = 'inline-block';
    el.setAttribute('title', currentFilePath);
  } else {
    el.textContent = '';
    el.style.display = 'none';
  }
}

function showToast(message) {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3000);
}

// --- Import & Export Code ---

// Export mind map data as JSON
function exportJSON() {
  const jsonStr = JSON.stringify(mindMapData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", url);
  
  // Format filename with timestamp
  const date = new Date();
  const stamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  downloadAnchor.setAttribute("download", `noxmind_mindmap_${stamp}.json`);
  
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  
  setTimeout(() => {
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  }, 250);
}

// Import JSON data file
function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsedData = JSON.parse(evt.target.result);
      
      // Basic validation of import structure
      if (parsedData && parsedData.id === 'root' && typeof parsedData.text === 'string') {
        mindMapData = parsedData;
        activeNodeId = 'root';
        saveToLocalStorage();
        renderMindMap();
        fitToScreen();
      } else {
        alert("無効なファイル形式です。マインドマップのJSONファイルを選択してください。");
      }
    } catch(err) {
      alert("ファイルの読み込み中にエラーが発生しました。");
    }
  };
  reader.readAsText(file);
  fileInput.value = ''; // Reset file input
}

// Helper to bundle CSS styles inside SVG for image outputs
function getStyledSVGPicture() {
  const svgClone = svg.cloneNode(true);
  
  // Remove interactive background grids/controls
  const bgGrid = svgClone.querySelector('.background-grid');
  if (bgGrid) bgGrid.remove();
  
  // Reset viewport transform for clean bounding box calculations
  const vp = svgClone.querySelector('#viewport');
  vp.removeAttribute('transform');
  
  // Calculate bounding box of all nodes
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  
  function getBounds(node) {
    const nMinX = node.x - node.width / 2;
    const nMaxX = node.x + node.width / 2;
    const nMinY = node.y - node.height / 2;
    const nMaxY = node.y + node.height / 2;
    
    if (nMinX < minX) minX = nMinX;
    if (nMaxX > maxX) maxX = nMaxX;
    if (nMinY < minY) minY = nMinY;
    if (nMaxY > maxY) maxY = nMaxY;
    
    if (node.children && !node.collapsed) {
      node.children.forEach(getBounds);
    }
  }
  
  getBounds(mindMapData);
  
  const margin = 40;
  const width = (maxX - minX) + margin * 2;
  const height = (maxY - minY) + margin * 2;
  
  // Shift all elements in viewport to fit inside the viewport box (starting 0, 0)
  const shiftX = -minX + margin;
  const shiftY = -minY + margin;
  vp.setAttribute('transform', `translate(${shiftX}, ${shiftY})`);
  
  // Update cloned SVG attributes
  svgClone.setAttribute('width', width);
  svgClone.setAttribute('height', height);
  svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);


  // Replace all foreignObjects with standard SVG elements (rect + text) to avoid tainted canvas security issues
  const nodeWrappers = svgClone.querySelectorAll('.mindmap-node-wrapper');
  nodeWrappers.forEach(wrapper => {
    const id = wrapper.getAttribute('id') || '';
    if (id.startsWith('measure-')) {
      wrapper.remove();
      return;
    }

    const x = parseFloat(wrapper.getAttribute('x'));
    const y = parseFloat(wrapper.getAttribute('y'));
    const w = parseFloat(wrapper.getAttribute('width'));
    const h = parseFloat(wrapper.getAttribute('height'));

    // Try to get internal html node
    const htmlNode = wrapper.querySelector('.mindmap-node') || wrapper.querySelector('.exported-node');
    if (!htmlNode) return;

    // Retrieve computed/assigned colors
    const bgColor = htmlNode.style.backgroundColor || '#1e1e2e';
    const color = htmlNode.style.color || '#ffffff';
    const borderColor = htmlNode.style.borderColor || '#89b4fa';
    
    // Check hierarchy level class (level-0, level-1, etc.) for text sizes
    let fontSize = '13px';
    let fontWeight = '500';
    let rx = 8;
    if (htmlNode.classList.contains('level-0')) {
      fontSize = '16px';
      fontWeight = '700';
      rx = 12;
    } else if (htmlNode.classList.contains('level-1')) {
      fontSize = '14px';
      fontWeight = '600';
    }

    // Retrieve text content
    const textSpan = htmlNode.querySelector('.node-text');
    const text = textSpan ? textSpan.textContent.trim() : '';

    // Create SVG Group container
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Create background rect
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    rect.setAttribute('rx', rx);
    rect.setAttribute('ry', rx);
    const isBorderless = htmlNode.classList.contains('borderless');
    rect.setAttribute('fill', isBorderless ? 'none' : bgColor);
    rect.setAttribute('stroke', isBorderless ? 'none' : borderColor);
    rect.setAttribute('stroke-width', htmlNode.classList.contains('level-0') ? '3' : '2');
    rect.setAttribute('filter', isBorderless ? 'none' : 'url(#node-shadow)');
    g.appendChild(rect);

    // Create SVG Text
    const svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svgText.setAttribute('fill', color);
    svgText.setAttribute('font-size', fontSize);
    svgText.setAttribute('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
    svgText.setAttribute('font-weight', fontWeight);
    svgText.setAttribute('text-anchor', 'start');
    
    // Split and lay out lines (manual breaks only)
    const lines = text.split('\n');
    const lineHeight = parseInt(fontSize) * 1.25;
    const totalTextHeight = lines.length * lineHeight;
    
    // Compute Y start alignment
    const startY = y + (h / 2) - (totalTextHeight / 2) + (parseInt(fontSize) * 0.85);

    // Compute left padding based on node level
    const isRoot = htmlNode.classList.contains('level-0');
    const paddingLeft = isRoot ? 21 : 16;

    lines.forEach((line, index) => {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', x + paddingLeft);
      tspan.setAttribute('y', startY + index * lineHeight);
      tspan.textContent = line;
      svgText.appendChild(tspan);
    });

    g.appendChild(svgText);

    // Swap foreignObject wrapper with the SVG group
    wrapper.parentNode.replaceChild(g, wrapper);
  });

  // Embed simple styles for lines and resolve CSS variables
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = `
    :root {
      --bg-base: #0b0b0e;
      --bg-surface: #15151c;
      --bg-element: #21212e;
      --border-color: #2d2d3d;
      --text-main: #f4f4f7;
      --text-muted: #9e9eb0;
      --accent: #89b4fa;
      --success: #a6e3a1;
      --warning: #f9e2af;
      --danger: #f38ba8;
    }
    svg { background-color: #0b0b0e; }
    .connection-path { fill: none; stroke-linecap: round; }
  `;
  svgClone.appendChild(style);
  
  return { svgClone, width, height };
}

// Export as SVG
function exportSVG() {
  const { svgClone } = getStyledSVGPicture();
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = url;
  downloadAnchor.download = 'noxmind_mindmap.svg';
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  
  setTimeout(() => {
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  }, 250);
}

// Export as PNG
function exportPNG() {
  const { svgClone, width, height } = getStyledSVGPicture();
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgClone);
  
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  const img = new Image();
  img.onload = function() {
    // Render onto high-dpi Canvas for sharp text
    const canvas = document.createElement('canvas');
    const scaleFactor = 2; // Export at 2x resolution
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(scaleFactor, scaleFactor);
    
    // Draw background
    ctx.fillStyle = '#0b0b0e';
    ctx.fillRect(0, 0, width, height);
    
    // Draw image
    ctx.drawImage(img, 0, 0, width, height);
    
    // Get PNG Blob and trigger download
    canvas.toBlob((pngBlob) => {
      if (!pngBlob) return;
      const pngUrl = URL.createObjectURL(pngBlob);
      
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = pngUrl;
      downloadAnchor.download = 'noxmind_mindmap.png';
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      
      setTimeout(() => {
        document.body.removeChild(downloadAnchor);
        URL.revokeObjectURL(pngUrl);
      }, 250);
    }, 'image/png');
    
    URL.revokeObjectURL(url);
  };
  
  img.src = url;
}

// --- Properties Panel Management ---

function updateSidebar() {
  const node = findNodeById(mindMapData, activeNodeId);
  const nodeTextInput = document.getElementById('node-text-input');
  
  if (!node) {
    nodeTextInput.value = "";
    nodeTextInput.disabled = true;
    nodeTextInput.placeholder = "選択されていません";
    return;
  }
  
  nodeTextInput.disabled = false;
  nodeTextInput.placeholder = "テキストを入力...";
  if (document.activeElement !== nodeTextInput) {
    nodeTextInput.value = node.text;
  }
  
  // Set custom color pickers to matching node values
  document.getElementById('text-color-picker').value = node.color || '#ffffff';
  document.getElementById('bg-color-picker').value = node.bgColor || '#1e1e2e';
  document.getElementById('branch-color-picker').value = node.branchColor || '#89b4fa';
  
  // Set borderless checkbox
  document.getElementById('chk-borderless').checked = node.borderless || false;
  
  // If root node, disable branch color (cannot edit connection lines) or sibling operations
  const btnSibling = document.getElementById('btn-add-sibling');
  const btnDelete = document.getElementById('btn-delete-node');
  
  if (node.id === 'root') {
    btnSibling.disabled = true;
    btnSibling.style.opacity = 0.5;
    btnDelete.disabled = true;
    btnDelete.style.opacity = 0.5;
  } else {
    btnSibling.disabled = false;
    btnSibling.style.opacity = 1;
    btnDelete.disabled = false;
    btnDelete.style.opacity = 1;
  }
}

function updateActiveNodeStyle(property, value) {
  const node = findNodeById(mindMapData, activeNodeId);
  if (!node) return;

  node[property] = value;
  
  // If editing branch color, also sync children branch colors in depth-first order
  // if they don't have override colors, or keep the connection synced.
  // Actually, connections get colored using child.branchColor.
  // So when we edit the branch color of a node, it colors the line connecting from parent to this node.
  
  saveToLocalStorage();
  renderMindMap();
}

// --- Keyboard Navigation ---

function moveSelection(direction) {
  if (isEditing) return;
  
  const currentNode = findNodeById(mindMapData, activeNodeId);
  if (!currentNode) return;
  
  const parentNode = findParentNode(mindMapData, activeNodeId);
  const dir = getNodeDirection(activeNodeId); // 1 for right, -1 for left
  
  let targetNode = null;
  
  switch (direction) {
    case 'ArrowUp':
      if (parentNode) {
        const index = parentNode.children.findIndex(c => c.id === activeNodeId);
        if (index > 0) targetNode = parentNode.children[index - 1];
      }
      break;
    case 'ArrowDown':
      if (parentNode) {
        const index = parentNode.children.findIndex(c => c.id === activeNodeId);
        if (index < parentNode.children.length - 1) targetNode = parentNode.children[index + 1];
      }
      break;
    case 'ArrowRight':
      if (activeNodeId === 'root') {
        // Go to first right child
        const rightChildren = currentNode.children.filter((_, i) => i % 2 === 0);
        if (rightChildren.length > 0) targetNode = rightChildren[0];
      } else if (dir === 1) {
        // We are on the right side, ArrowRight goes into children
        if (currentNode.children && currentNode.children.length > 0) {
          targetNode = currentNode.children[0];
        }
      } else {
        // We are on the left side, ArrowRight goes to parent (towards center)
        targetNode = parentNode;
      }
      break;
    case 'ArrowLeft':
      if (activeNodeId === 'root') {
        // Go to first left child
        const leftChildren = currentNode.children.filter((_, i) => i % 2 !== 0);
        if (leftChildren.length > 0) targetNode = leftChildren[0];
      } else if (dir === -1) {
        // We are on the left side, ArrowLeft goes into children
        if (currentNode.children && currentNode.children.length > 0) {
          targetNode = currentNode.children[0];
        }
      } else {
        // We are on the right side, ArrowLeft goes to parent (towards center)
        targetNode = parentNode;
      }
      break;
  }
  
  if (targetNode) {
    selectNode(targetNode.id);
  }
}

// --- Event Listeners and Initializers ---

function setupEventListeners() {
  // SVG zoom/pan dragging listeners
  svg.addEventListener('mousedown', (e) => {
    hideContextMenu();
    // Only drag on canvas background, not on interactive nodes
    if (!e.target.closest('.mindmap-node')) {
      isDragging = true;
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
      svg.style.cursor = 'grabbing';
    }
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      translateX = e.clientX - startX;
      translateY = e.clientY - startY;
      updateViewportTransform();
    } else if (dragNodeId) {
      const mouseSvg = getSvgCoordinates(e.clientX, e.clientY);
      
      if (!isDraggingNode) {
        const dx = mouseSvg.x - dragStartX;
        const dy = mouseSvg.y - dragStartY;
        // Start dragging after moving 5px
        if (Math.hypot(dx, dy) > 5) {
          isDraggingNode = true;
          const fo = document.getElementById(`fo-${dragNodeId}`);
          if (fo) {
            fo.classList.add('dragging');
            fo.style.pointerEvents = 'none'; // Enable elementFromPoint underneath
            
            // Move dragged node to front in DOM
            nodesGroup.appendChild(fo);
          }
        }
      }
      
      if (isDraggingNode) {
        const newX = mouseSvg.x + dragNodeOffsetX;
        const newY = mouseSvg.y + dragNodeOffsetY;
        
        const fo = document.getElementById(`fo-${dragNodeId}`);
        if (fo) {
          const nodeObj = findNodeById(mindMapData, dragNodeId);
          fo.setAttribute('x', newX - nodeObj.width / 2);
          fo.setAttribute('y', newY - nodeObj.height / 2);
        }
        
        // Detect drop target node
        const hoverEl = document.elementFromPoint(e.clientX, e.clientY);
        const hoverNodeEl = hoverEl ? hoverEl.closest('.mindmap-node') : null;
        
        // Clear previous target highlights
        document.querySelectorAll('.mindmap-node').forEach(el => el.classList.remove('drop-target'));
        dropTargetNodeId = null;
        
        if (hoverNodeEl) {
          const hoverNodeId = hoverNodeEl.getAttribute('data-id');
          if (hoverNodeId && hoverNodeId !== dragNodeId) {
            const dragNode = findNodeById(mindMapData, dragNodeId);
            const isDesc = isDescendant(dragNode, hoverNodeId);
            
            if (!isDesc) {
              dropTargetNodeId = hoverNodeId;
              hoverNodeEl.classList.add('drop-target');
            }
          }
        }
      }
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    svg.style.cursor = 'grab';
    
    if (dragNodeId) {
      const fo = document.getElementById(`fo-${dragNodeId}`);
      if (fo) {
        fo.classList.remove('dragging');
        fo.style.pointerEvents = 'auto';
      }
      
      document.querySelectorAll('.mindmap-node').forEach(el => el.classList.remove('drop-target'));
      
      if (isDraggingNode) {
        if (dropTargetNodeId) {
          moveNodeToNewParent(dragNodeId, dropTargetNodeId);
        } else {
          // Snap back
          renderMindMap();
        }
      }
      
      dragNodeId = null;
      isDraggingNode = false;
      dropTargetNodeId = null;
    }
  });

  // Mouse wheel zoom
  canvasContainer.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    
    // Zoom centered on cursor position
    const rect = canvasContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    zoom(factor, mouseX, mouseY);
  }, { passive: false });

  // Touch Zoom/Pan support for Mobile Devices
  let touchStartDist = 0;
  let touchStartScale = 1;
  let lastTouchCenterX = 0;
  let lastTouchCenterY = 0;
  let isTouchDragging = false;

  svg.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const target = e.target;
      // Allow dragging starting from any element that isn't a node
      if (!target.closest('.mindmap-node')) {
        isTouchDragging = true;
        startX = touch.clientX - translateX;
        startY = touch.clientY - translateY;
      }
    } else if (e.touches.length === 2) {
      isTouchDragging = false;
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      touchStartDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      touchStartScale = scale;
      
      const rect = svg.getBoundingClientRect();
      lastTouchCenterX = ((t1.clientX + t2.clientX) / 2) - rect.left;
      lastTouchCenterY = ((t1.clientY + t2.clientY) / 2) - rect.top;
    }
  }, { passive: true });

  svg.addEventListener('touchmove', (e) => {
    if (isTouchDragging && e.touches.length === 1) {
      e.preventDefault(); // Cancel browser-native scrolling/page-bounce on drag
      const touch = e.touches[0];
      translateX = touch.clientX - startX;
      translateY = touch.clientY - startY;
      updateViewportTransform();
    } else if (e.touches.length === 2) {
      e.preventDefault(); // Cancel browser-native zoom behavior
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const rect = svg.getBoundingClientRect();
      const cx = ((t1.clientX + t2.clientX) / 2) - rect.left;
      const cy = ((t1.clientY + t2.clientY) / 2) - rect.top;
      
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (touchStartDist > 0) {
        const factor = dist / touchStartDist;
        const targetScale = touchStartScale * factor;
        
        // Calculate incremental scaling
        const oldScale = scale;
        scale = Math.min(Math.max(0.15, targetScale), 3.0);
        const scaleFactor = scale / oldScale;
        
        // Zoom centered around the current midpoint
        translateX = cx - (cx - translateX) * scaleFactor;
        translateY = cy - (cy - translateY) * scaleFactor;
        
        // Pan based on pinch center displacement (smooth touch tracking)
        const dx = cx - lastTouchCenterX;
        const dy = cy - lastTouchCenterY;
        translateX += dx;
        translateY += dy;
        
        lastTouchCenterX = cx;
        lastTouchCenterY = cy;
        
        updateViewportTransform();
      }
    }
  }, { passive: false });

  svg.addEventListener('touchend', () => {
    isTouchDragging = false;
  });

  // Canvas click to deselect node and close sidebar (if clicking bg)
  svg.addEventListener('click', (e) => {
    hideContextMenu();
    if (!e.target.closest('.mindmap-node')) {
      if (isEditing) finishEditing();
      activeNodeId = null;
      document.querySelectorAll('.mindmap-node').forEach(el => el.classList.remove('active'));
      sidebar.classList.remove('open');
      renderMindMap();
    }
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Ctrl+F or Cmd+F
    if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
      e.preventDefault();
      showSearchPanel();
      return;
    }
    
    // Ignore global shortcuts if the user is typing in a text field, textarea, or contentEditable element
    if (isEditing || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    
    switch (e.key) {
      case 'Tab':
        e.preventDefault();
        if (activeNodeId) addNewChild();
        break;
      case 'Enter':
        e.preventDefault();
        if (activeNodeId) addNewSibling();
        break;
      case 'Delete':
      case 'Backspace':
        if (activeNodeId) {
          e.preventDefault();
          deleteNode();
        }
        break;
      case 'Escape':
        e.preventDefault();
        hideContextMenu();
        activeNodeId = null;
        sidebar.classList.remove('open');
        renderMindMap();
        break;
      case 'F2':
      case ' ': // Space key
        if (activeNodeId) {
          e.preventDefault();
          startEditing(activeNodeId);
        }
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        e.preventDefault();
        moveSelection(e.key);
        break;
    }
  });

  // Top Action Buttons
  const confirmModal = document.getElementById('confirm-modal');
  const btnNew = document.getElementById('btn-new');
  if (btnNew) {
    btnNew.addEventListener('click', () => {
      showConfirm(
        t("confirm-new-title"),
        t("confirm-new-msg"),
        t("confirm-new-btn"),
        () => {
          mindMapData = JSON.parse(JSON.stringify(DEFAULT_MINDMAP));
          activeNodeId = 'root';
          saveToLocalStorage();
          renderMindMap();
          centerMindMap();
        }
      );
    });
  }

  const btnCloseConfirm = document.getElementById('btn-close-confirm');
  if (btnCloseConfirm && confirmModal) {
    btnCloseConfirm.addEventListener('click', () => {
      confirmModal.classList.remove('open');
    });
  }

  const btnConfirmCancel = document.getElementById('btn-confirm-cancel');
  if (btnConfirmCancel && confirmModal) {
    btnConfirmCancel.addEventListener('click', () => {
      confirmModal.classList.remove('open');
    });
  }

  if (confirmModal) {
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) confirmModal.classList.remove('open');
    });
  }

  const btnConfirmOk = document.getElementById('btn-confirm-ok');
  if (btnConfirmOk && confirmModal) {
    btnConfirmOk.addEventListener('click', () => {
      confirmModal.classList.remove('open');
      if (confirmCallback) {
        confirmCallback();
        confirmCallback = null;
      }
    });
  }

  const btnImport = document.getElementById('btn-import');
  if (btnImport) {
    btnImport.addEventListener('click', () => {
      if (checkIsTauri()) {
        openNative();
      } else {
        if (fileInput) fileInput.click();
      }
    });
  }
  if (fileInput) {
    fileInput.addEventListener('change', importJSON);
  }
  
  // Save dropdown toggle & actions depending on Tauri/Web environment
  const saveDropdownToggle = document.getElementById('btn-save-dropdown');
  const saveDropdownMenu = saveDropdownToggle ? (document.querySelector('#btn-save-dropdown + .dropdown-menu') || saveDropdownToggle.nextElementSibling) : null;

  if (!checkIsTauri()) {
    // Web Mode: Turn dropdown button into a direct export button
    if (saveDropdownToggle) {
      saveDropdownToggle.classList.remove('dropdown-toggle');
      // Set to normal save title
      saveDropdownToggle.setAttribute('title', t('btn-export-title'));
      saveDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        exportJSON();
      });
    }
    // Remove the menu container from DOM to avoid confusion
    if (saveDropdownMenu) {
      saveDropdownMenu.remove();
    }
  } else {
    // Tauri Mode: Keep dropdown menu functionality
    if (saveDropdownToggle) {
      saveDropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropEl = saveDropdownToggle.closest('.dropdown');
        if (dropEl) dropEl.classList.toggle('open');
      });
    }

    const btnSaveOverwrite = document.getElementById('btn-save-overwrite');
    if (btnSaveOverwrite) {
      btnSaveOverwrite.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
        saveNative(false);
      });
    }

    const btnSaveAs = document.getElementById('btn-save-as');
    if (btnSaveAs) {
      btnSaveAs.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
        saveNative(true);
      });
    }
  }

  // Image export dropdown toggle
  const dropdownToggle = document.getElementById('btn-export-image');
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownToggle.closest('.dropdown').classList.toggle('open');
    });
  }
  
  // Close dropdown on click outside and dismiss context menu
  window.addEventListener('click', (e) => {
    if (!e.target.closest('#btn-export-image') && !e.target.closest('#btn-save-dropdown')) {
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    }
    hideContextMenu();
  });

  // Prevent closing menu when clicking on the menu itself
  const contextMenuEl = document.getElementById('context-menu');
  if (contextMenuEl) {
    contextMenuEl.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Prevent closing canvas menu when clicking on it
  const canvasContextMenu = document.getElementById('canvas-context-menu');
  if (canvasContextMenu) {
    canvasContextMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Handle right-click on SVG (Canvas background)
  svg.addEventListener('contextmenu', (e) => {
    if (isEditing) return;
    
    // If not clicking on a node, show canvas menu
    if (!e.target.closest('.mindmap-node')) {
      e.preventDefault();
      showCanvasContextMenu(e.clientX, e.clientY);
    }
  });

  // Context Menu Actions
  const ctxAddChild = document.getElementById('ctx-add-child');
  if (ctxAddChild) {
    ctxAddChild.addEventListener('click', (e) => {
      e.stopPropagation();
      if (contextMenuNodeId) {
        addNewChild(contextMenuNodeId);
      }
      hideContextMenu();
    });
  }

  const ctxAddSibling = document.getElementById('ctx-add-sibling');
  if (ctxAddSibling) {
    ctxAddSibling.addEventListener('click', (e) => {
      e.stopPropagation();
      if (contextMenuNodeId) {
        addNewSibling(contextMenuNodeId);
      }
      hideContextMenu();
    });
  }

  const ctxDeleteNode = document.getElementById('ctx-delete-node');
  if (ctxDeleteNode) {
    ctxDeleteNode.addEventListener('click', (e) => {
      e.stopPropagation();
      if (contextMenuNodeId) {
        deleteNode(contextMenuNodeId);
      }
      hideContextMenu();
    });
  }

  // Canvas Context Menu Actions
  const ctxAddRootChild = document.getElementById('ctx-add-root-child');
  if (ctxAddRootChild) {
    ctxAddRootChild.addEventListener('click', (e) => {
      e.stopPropagation();
      addNewChild('root');
      hideContextMenu();
    });
  }

  const ctxExpandAll = document.getElementById('ctx-expand-all');
  if (ctxExpandAll) {
    ctxExpandAll.addEventListener('click', (e) => {
      e.stopPropagation();
      setAllNodesCollapseState(mindMapData, false);
      renderMindMap();
      saveToLocalStorage();
      hideContextMenu();
    });
  }

  const ctxCollapseAll = document.getElementById('ctx-collapse-all');
  if (ctxCollapseAll) {
    ctxCollapseAll.addEventListener('click', (e) => {
      e.stopPropagation();
      setAllNodesCollapseState(mindMapData, true);
      renderMindMap();
      saveToLocalStorage();
      hideContextMenu();
    });
  }

  const ctxCenterView = document.getElementById('ctx-center-view');
  if (ctxCenterView) {
    ctxCenterView.addEventListener('click', (e) => {
      e.stopPropagation();
      centerMindMap();
      hideContextMenu();
    });
  }

  const ctxFitScreen = document.getElementById('ctx-fit-screen');
  if (ctxFitScreen) {
    ctxFitScreen.addEventListener('click', (e) => {
      e.stopPropagation();
      fitToScreen();
      hideContextMenu();
    });
  }

  const ctxNewMap = document.getElementById('ctx-new-map');
  if (ctxNewMap) {
    ctxNewMap.addEventListener('click', (e) => {
      e.stopPropagation();
      hideContextMenu();
      showConfirm(
        t("confirm-new-title"),
        t("confirm-new-msg"),
        t("confirm-new-btn"),
        () => {
          mindMapData = JSON.parse(JSON.stringify(DEFAULT_MINDMAP));
          activeNodeId = 'root';
          saveToLocalStorage();
          renderMindMap();
          centerMindMap();
        }
      );
    });
  }

  const btnExportPng = document.getElementById('btn-export-png');
  if (btnExportPng) btnExportPng.addEventListener('click', exportPNG);

  const btnExportSvg = document.getElementById('btn-export-svg');
  if (btnExportSvg) btnExportSvg.addEventListener('click', exportSVG);

  const btnFit = document.getElementById('btn-fit');
  if (btnFit) btnFit.addEventListener('click', fitToScreen);

  const btnCenter = document.getElementById('btn-center');
  if (btnCenter) btnCenter.addEventListener('click', centerMindMap);

  // Layout mode toggle listener
  const btnLayoutMode = document.getElementById('btn-layout-mode');
  if (btnLayoutMode) {
    btnLayoutMode.addEventListener('click', () => {
      layoutMode = layoutMode === 'balanced' ? 'right-only' : 'balanced';
      setLocalStorageData('noxmind_layout_mode', layoutMode);
      updateLayoutModeUI();
      renderMindMap();
    });
  }

  // Zoom floats
  const btnZoomIn = document.getElementById('btn-zoom-in');
  if (btnZoomIn) btnZoomIn.addEventListener('click', () => zoom(1.1));

  const btnZoomOut = document.getElementById('btn-zoom-out');
  if (btnZoomOut) btnZoomOut.addEventListener('click', () => zoom(0.9));

  // Sidebar Controls
  const btnCloseSidebar = document.getElementById('btn-close-sidebar');
  if (btnCloseSidebar) {
    btnCloseSidebar.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }

  const btnAddChild = document.getElementById('btn-add-child');
  if (btnAddChild) btnAddChild.addEventListener('click', () => addNewChild());

  const btnAddSibling = document.getElementById('btn-add-sibling');
  if (btnAddSibling) btnAddSibling.addEventListener('click', () => addNewSibling());

  const btnDeleteNode = document.getElementById('btn-delete-node');
  if (btnDeleteNode) btnDeleteNode.addEventListener('click', () => deleteNode());

  // Sidebar Color Pickers
  const textColorPicker = document.getElementById('text-color-picker');
  if (textColorPicker) {
    textColorPicker.addEventListener('input', (e) => {
      updateActiveNodeStyle('color', e.target.value);
    });
  }

  const bgColorPicker = document.getElementById('bg-color-picker');
  if (bgColorPicker) {
    bgColorPicker.addEventListener('input', (e) => {
      updateActiveNodeStyle('bgColor', e.target.value);
    });
  }

  const branchColorPicker = document.getElementById('branch-color-picker');
  if (branchColorPicker) {
    branchColorPicker.addEventListener('input', (e) => {
      updateActiveNodeStyle('branchColor', e.target.value);
    });
  }

  const chkBorderless = document.getElementById('chk-borderless');
  if (chkBorderless) {
    chkBorderless.addEventListener('change', (e) => {
      defaultBorderless = e.target.checked;
      updateActiveNodeStyle('borderless', e.target.checked);
    });
  }

  // Sidebar Text Input change listener
  const nodeTextInput = document.getElementById('node-text-input');
  if (nodeTextInput) {
    nodeTextInput.addEventListener('input', (e) => {
      const node = findNodeById(mindMapData, activeNodeId);
      if (node) {
        node.text = e.target.value;
        saveToLocalStorage();
        
        const span = document.getElementById(`text-${node.id}`);
        if (span) {
          span.textContent = node.text;
        }
        renderMindMap();
      }
    });
  }

  // Preset Colors Click Handlers
  setupPresetColors('text-presets', 'color');
  setupPresetColors('bg-presets', 'bgColor');
  setupPresetColors('branch-presets', 'branchColor');

  // Help Modal
  const helpModal = document.getElementById('help-modal');
  document.getElementById('btn-help').addEventListener('click', () => {
    helpModal.classList.add('open');
  });
  document.getElementById('btn-close-help').addEventListener('click', () => {
    helpModal.classList.remove('open');
  });
  helpModal.addEventListener('click', (e) => {
    if (e.target === helpModal) helpModal.classList.remove('open');
  });

  // License Modal
  const licenseModal = document.getElementById('license-modal');
  const btnOpenLicense = document.getElementById('btn-open-license');
  const btnCloseLicense = document.getElementById('btn-close-license');
  const noxmindLicenseText = document.getElementById('noxmind-license-text');

  // NoxMind MIT License Text
  const NOXMIND_LICENSE = `MIT License

Copyright (c) 2026 c1t0d0s0

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

  if (noxmindLicenseText) {
    noxmindLicenseText.textContent = NOXMIND_LICENSE;
  }

  if (btnOpenLicense) {
    btnOpenLicense.addEventListener('click', () => {
      helpModal.classList.remove('open');
      licenseModal.classList.add('open');
    });
  }

  if (btnCloseLicense) {
    btnCloseLicense.addEventListener('click', () => {
      licenseModal.classList.remove('open');
      helpModal.classList.add('open');
    });
  }

  if (licenseModal) {
    licenseModal.addEventListener('click', (e) => {
      if (e.target === licenseModal) {
        licenseModal.classList.remove('open');
        helpModal.classList.add('open');
      }
    });
  }

  // Accordion Logic for License Modal
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
      
      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Disable Safari's default pinch-to-zoom on the document level
  window.addEventListener('gesturestart', (e) => {
    e.preventDefault();
  }, { passive: false });
  window.addEventListener('gesturechange', (e) => {
    e.preventDefault();
  }, { passive: false });

  // Prevent page bounce and horizontal viewport scroll on iOS Safari
  document.addEventListener('touchmove', (e) => {
    const isScrollable = e.target.closest('.sidebar-content') || e.target.closest('.modal-body');
    const isInteractive = e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('.app-header');
    if (!isScrollable && !isInteractive) {
      e.preventDefault();
    }
  }, { passive: false });

  // Search event listeners
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (e.shiftKey) {
          goToMatch(-1);
        } else {
          goToMatch(1);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        hideSearchPanel();
      }
    });
    
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });
  }
  
  const btnSearchPrev = document.getElementById('btn-search-prev');
  if (btnSearchPrev) btnSearchPrev.addEventListener('click', () => goToMatch(-1));
  
  const btnSearchNext = document.getElementById('btn-search-next');
  if (btnSearchNext) btnSearchNext.addEventListener('click', () => goToMatch(1));
  
  const btnSearchClose = document.getElementById('btn-search-close');
  if (btnSearchClose) btnSearchClose.addEventListener('click', hideSearchPanel);
}

function setupPresetColors(containerId, property) {
  const container = document.getElementById(containerId);
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.preset-color');
    if (btn) {
      const color = btn.getAttribute('data-color');
      updateActiveNodeStyle(property, color);
      
      // Update picker input visual
      const pickerId = property === 'color' ? 'text-color-picker' : (property === 'bgColor' ? 'bg-color-picker' : 'branch-color-picker');
      document.getElementById(pickerId).value = color;
    }
  });
}

// Simple HTML escaping helper
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

let isInitialLayout = true;

// Resize observer to maintain canvas center on size changes
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const width = entry.contentRect.width;
    const height = entry.contentRect.height;
    
    if (width > 0 && height > 0) {
      if (isInitialLayout) {
        isInitialLayout = false;
        lastSvgWidth = width;
        lastSvgHeight = height;
        fitToScreen();
      } else {
        if (lastSvgWidth > 0 && lastSvgHeight > 0) {
          translateX += (width - lastSvgWidth) / 2;
          translateY += (height - lastSvgHeight) / 2;
        }
        lastSvgWidth = width;
        lastSvgHeight = height;
        updateViewportTransform();
      }
    }
  }
});

// --- Application Init ---
window.addEventListener('DOMContentLoaded', () => {
  // Initialize DOM elements
  svg = document.getElementById('mindmap-svg');
  canvasContainer = document.getElementById('canvas-container');
  viewport = document.getElementById('viewport');
  nodesGroup = document.getElementById('nodes-group');
  connectionsGroup = document.getElementById('connections-group');
  sidebar = document.getElementById('property-sidebar');
  fileInput = document.getElementById('file-input');

  // Handle fallback version display if placeholder isn't replaced by build script
  const versionSpan = document.querySelector('.app-version');
  if (versionSpan && versionSpan.textContent.includes('__APP_VERSION__')) {
    versionSpan.textContent = 'v0.9.1'; // Fallback value from tauri.conf.json
  }

  // Apply UI translations based on system language
  applyTranslations();

  setupEventListeners();
  
  // Render nodes initially
  renderMindMap();
  
  // Start observing canvas container size changes (HTML div is reliable on WebKit)
  resizeObserver.observe(canvasContainer);
});

// Window load event listener to ensure correct initial centering after all styles are loaded
window.addEventListener('load', () => {
  isInitialLayout = false;
  renderMindMap();
  fitToScreen();
});

// Lock window and sub-container scroll positions permanently to prevent iOS Safari auto-scroll on element updates
window.addEventListener('scroll', (e) => {
  if (e.target && e.target !== document && e.target !== window) {
    if (e.target.scrollLeft !== 0 || e.target.scrollTop !== 0) {
      const isSidebar = e.target.classList.contains('sidebar-content') || e.target.closest('.sidebar-content');
      const isModal = e.target.classList.contains('modal-body') || e.target.closest('.modal-body');
      if (!isSidebar && !isModal) {
        e.target.scrollLeft = 0;
        e.target.scrollTop = 0;
      }
    }
  } else {
    if (window.scrollX !== 0 || window.scrollY !== 0) {
      window.scrollTo(0, 0);
    }
  }
}, { capture: true, passive: true });

// Toggle Node Collapse state
function toggleNodeCollapse(id) {
  const node = findNodeById(mindMapData, id);
  if (node) {
    node.collapsed = !node.collapsed;
    renderMindMap();
    saveToLocalStorage();
  }
}

// Recursively set collapse state for all descendants
function setAllNodesCollapseState(node, state) {
  if (node.id !== 'root') {
    node.collapsed = state;
  }
  if (node.children) {
    node.children.forEach(child => setAllNodesCollapseState(child, state));
  }
}

// Update Layout Mode Toggle Button Icon and Class
function updateLayoutModeUI() {
  const btnLayoutMode = document.getElementById('btn-layout-mode');
  if (!btnLayoutMode) return;

  if (layoutMode === 'right-only') {
    btnLayoutMode.classList.add('active');
    const icon = btnLayoutMode.querySelector('.material-icons-round');
    if (icon) icon.textContent = 'align_horizontal_left';
  } else {
    btnLayoutMode.classList.remove('active');
    const icon = btnLayoutMode.querySelector('.material-icons-round');
    if (icon) icon.textContent = 'align_horizontal_center';
  }
}

// --- Search Functionality Helper Functions ---
function findMatchingNodes(node, query, matches = []) {
  if (!node) return matches;
  if (node.text && node.text.toLowerCase().includes(query.toLowerCase())) {
    matches.push(node.id);
  }
  if (node.children) {
    node.children.forEach(child => findMatchingNodes(child, query, matches));
  }
  return matches;
}

function expandAncestors(nodeId) {
  let parent = findParentNode(mindMapData, nodeId);
  let changed = false;
  while (parent) {
    if (parent.collapsed) {
      parent.collapsed = false;
      changed = true;
    }
    parent = findParentNode(mindMapData, parent.id);
  }
  return changed;
}

function centerOnNode(nodeId) {
  const node = findNodeById(mindMapData, nodeId);
  if (!node) return;
  
  const rect = svg.getBoundingClientRect();
  const rectW = rect.width || window.innerWidth;
  const rectH = rect.height || (window.innerHeight - 64);
  
  translateX = rectW / 2 - node.x * scale;
  translateY = rectH / 2 - node.y * scale;
  
  if (isNaN(translateX) || isNaN(translateY)) {
    translateX = rectW / 2;
    translateY = rectH / 2;
  }
  
  updateViewportTransform();
}

function showSearchPanel() {
  const panel = document.getElementById('search-panel');
  const input = document.getElementById('search-input');
  if (panel && input) {
    panel.classList.add('open');
    input.focus();
    input.select();
    isSearchOpen = true;
    performSearch(input.value);
  }
}

function hideSearchPanel() {
  const panel = document.getElementById('search-panel');
  if (panel) {
    panel.classList.remove('open');
  }
  isSearchOpen = false;
  searchMatches = [];
  currentSearchIndex = -1;
  renderMindMap();
}

function performSearch(query) {
  searchMatches = [];
  currentSearchIndex = -1;
  
  if (query.trim() !== '') {
    searchMatches = findMatchingNodes(mindMapData, query);
  }
  
  updateSearchCounter();
  
  if (searchMatches.length > 0) {
    currentSearchIndex = 0;
    const targetId = searchMatches[currentSearchIndex];
    const changed = expandAncestors(targetId);
    if (changed) {
      saveToLocalStorage();
    }
    // Make sure nodes are rendered with the correct search classes before selecting/focusing
    renderMindMap();
    selectNode(targetId);
    centerOnNode(targetId);
  } else {
    renderMindMap();
  }
}

function goToMatch(direction) {
  if (searchMatches.length === 0) return;
  
  currentSearchIndex = (currentSearchIndex + direction + searchMatches.length) % searchMatches.length;
  updateSearchCounter();
  
  const targetId = searchMatches[currentSearchIndex];
  const changed = expandAncestors(targetId);
  if (changed) {
    saveToLocalStorage();
  }
  renderMindMap();
  selectNode(targetId);
  centerOnNode(targetId);
}

function updateSearchCounter() {
  const counter = document.getElementById('search-results-count');
  if (counter) {
    if (searchMatches.length > 0) {
      counter.textContent = `${currentSearchIndex + 1} / ${searchMatches.length}`;
    } else {
      counter.textContent = '0 / 0';
    }
  }
}


