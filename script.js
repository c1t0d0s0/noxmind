/**
 * Mindy - Elegant Mind Mapping Application
 * Core scripting file managing state, layout, SVG rendering, zoom/pan, import/export
 */

// --- Default Data Structure ---
const DEFAULT_MINDMAP = {
  id: "root",
  text: "セントラルテーマ",
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
let mindMapData = getLocalStorageData('mindy_data', DEFAULT_MINDMAP);
let activeNodeId = 'root';
let isEditing = false;
let defaultBorderless = false;

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
const svg = document.getElementById('mindmap-svg');
const canvasContainer = document.getElementById('canvas-container');
const viewport = document.getElementById('viewport');
const nodesGroup = document.getElementById('nodes-group');
const connectionsGroup = document.getElementById('connections-group');
const sidebar = document.getElementById('property-sidebar');
const fileInput = document.getElementById('file-input');

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
  setLocalStorageData('mindy_data', mindMapData);
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

  if (node.children) {
    node.children.forEach(child => createInvisibleNodes(child, depth + 1));
  }
}

/**
 * Helper to calculate node width dynamically based on text length (supporting manual breaks)
 */
function getNodeWidth(node) {
  const text = node.text || "ノード";
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

  if (node.children) {
    node.children.forEach(child => measureNodeHeights(child));
  }
}

/**
 * Calculate Subtree Heights recursively
 */
function calculateSubtreeHeights(node) {
  if (!node.children || node.children.length === 0) {
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
  } else {
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
    layoutSubtree(child, child.x, child.y, direction);
  });
}

// Get nodes direction (1 for right, -1 for left)
function getNodeDirection(nodeId) {
  if (nodeId === 'root') return 1;
  
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
}

/**
 * Draw connection lines (Bézier curves)
 */
function renderConnections(node) {
  if (!node.children || node.children.length === 0) return;

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
    renderConnections(child);
  });
}

/**
 * Render single node HTML inside SVG foreignObject
 */
function renderNode(node, depth) {
  const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
  fo.setAttribute('x', node.x - node.width / 2);
  fo.setAttribute('y', node.y - node.height / 2);
  fo.setAttribute('width', node.width);
  fo.setAttribute('height', node.height);
  fo.setAttribute('class', 'mindmap-node-wrapper');
  
  const div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
  div.className = `mindmap-node level-${depth}`;
  if (node.id === activeNodeId) div.className += ' active';
  if (node.borderless) div.className += ' borderless';
  
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

  // Attach Event Listeners to Nodes
  div.addEventListener('click', (e) => {
    e.stopPropagation();
    selectNode(node.id);
  });

  div.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    startEditing(node.id);
  });

  // Render children
  if (node.children) {
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

  const newText = span.innerText.trim() || "ノード";
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

function deleteNode(nodeId = activeNodeId) {
  if (nodeId === 'root') {
    alert("セントラルテーマ（ルート）は削除できません。");
    return;
  }

  const parentNode = findParentNode(mindMapData, nodeId);
  if (!parentNode) return;

  if (confirm("このノードとそのすべての子ノードを削除しますか？")) {
    parentNode.children = parentNode.children.filter(c => c.id !== nodeId);
    saveToLocalStorage();
    
    // Select parent after deletion
    selectNode(parentNode.id);
    renderMindMap();
  }
}

// --- Zoom & Pan Management ---

function updateViewportTransform() {
  viewport.setAttribute('transform', `translate(${translateX}, ${translateY}) scale(${scale})`);
  
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
    
    if (node.children) {
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

// --- Import & Export Code ---

// Export mind map data as JSON
function exportJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(mindMapData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  
  // Format filename with timestamp
  const date = new Date();
  const stamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  downloadAnchor.setAttribute("download", `mindy_mindmap_${stamp}.json`);
  
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
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
    
    if (node.children) {
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
    svgText.setAttribute('text-anchor', 'middle');
    
    // Split and lay out lines (manual breaks only)
    const lines = text.split('\n');
    const lineHeight = parseInt(fontSize) * 1.25;
    const totalTextHeight = lines.length * lineHeight;
    
    // Compute Y start alignment
    const startY = y + (h / 2) - (totalTextHeight / 2) + (parseInt(fontSize) * 0.85);

    lines.forEach((line, index) => {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', x + w / 2);
      tspan.setAttribute('y', startY + index * lineHeight);
      tspan.textContent = line;
      svgText.appendChild(tspan);
    });

    g.appendChild(svgText);

    // Swap foreignObject wrapper with the SVG group
    wrapper.parentNode.replaceChild(g, wrapper);
  });

  // Embed simple styles for lines
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = `
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
  downloadAnchor.download = 'mindy_mindmap.svg';
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
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
    
    // Get PNG URL
    const pngUrl = canvas.toDataURL('image/png');
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = pngUrl;
    downloadAnchor.download = 'mindy_mindmap.png';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    
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
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    svg.style.cursor = 'grab';
  });

  // Mouse wheel zoom
  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    
    // Zoom centered on cursor position
    const rect = svg.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    zoom(factor, mouseX, mouseY);
  }, { passive: false });

  // Touch Zoom/Pan support for Mobile Devices
  let touchStartDist = 0;
  let touchStartScale = 1;
  let touchStartX = 0;
  let touchStartY = 0;
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
      touchStartX = ((t1.clientX + t2.clientX) / 2) - rect.left;
      touchStartY = ((t1.clientY + t2.clientY) / 2) - rect.top;
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
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      if (touchStartDist > 0) {
        const factor = dist / touchStartDist;
        zoomTo(touchStartScale * factor, touchStartX, touchStartY);
      }
    }
  }, { passive: false });

  svg.addEventListener('touchend', () => {
    isTouchDragging = false;
  });

  // Canvas click to deselect node and close sidebar (if clicking bg)
  svg.addEventListener('click', (e) => {
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
  document.getElementById('btn-new').addEventListener('click', () => {
    if (confirm("現在編集中のマインドマップは破棄されます。新しく作成しますか？")) {
      mindMapData = JSON.parse(JSON.stringify(DEFAULT_MINDMAP));
      activeNodeId = 'root';
      saveToLocalStorage();
      renderMindMap();
      centerMindMap();
    }
  });

  document.getElementById('btn-import').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', importJSON);
  
  document.getElementById('btn-export').addEventListener('click', exportJSON);
  
  // Image export dropdown toggle
  const dropdownToggle = document.getElementById('btn-export-image');
  dropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownToggle.closest('.dropdown').classList.toggle('open');
  });
  
  // Close dropdown on click outside
  window.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  });

  document.getElementById('btn-export-png').addEventListener('click', exportPNG);
  document.getElementById('btn-export-svg').addEventListener('click', exportSVG);

  document.getElementById('btn-fit').addEventListener('click', fitToScreen);
  document.getElementById('btn-center').addEventListener('click', centerMindMap);

  // Zoom floats
  document.getElementById('btn-zoom-in').addEventListener('click', () => zoom(1.1));
  document.getElementById('btn-zoom-out').addEventListener('click', () => zoom(0.9));

  // Sidebar Controls
  document.getElementById('btn-close-sidebar').addEventListener('click', () => {
    sidebar.classList.remove('open');
  });

  document.getElementById('btn-add-child').addEventListener('click', () => addNewChild());
  document.getElementById('btn-add-sibling').addEventListener('click', () => addNewSibling());
  document.getElementById('btn-delete-node').addEventListener('click', () => deleteNode());

  // Sidebar Color Pickers
  document.getElementById('text-color-picker').addEventListener('input', (e) => {
    updateActiveNodeStyle('color', e.target.value);
  });
  document.getElementById('bg-color-picker').addEventListener('input', (e) => {
    updateActiveNodeStyle('bgColor', e.target.value);
  });
  document.getElementById('branch-color-picker').addEventListener('input', (e) => {
    updateActiveNodeStyle('branchColor', e.target.value);
  });

  document.getElementById('chk-borderless').addEventListener('change', (e) => {
    defaultBorderless = e.target.checked;
    updateActiveNodeStyle('borderless', e.target.checked);
  });

  // Sidebar Text Input change listener
  const nodeTextInput = document.getElementById('node-text-input');
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
