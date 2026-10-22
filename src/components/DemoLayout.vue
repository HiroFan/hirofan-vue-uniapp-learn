<script setup>
import { ref, computed, markRaw } from 'vue'

// 同时导入组件 + 源码文本
const modules = import.meta.glob('../learnskill/*.vue', { eager: true, import: 'default' })
// ✅ 加上 eager: true，立即拿到源码字符串
const sourceModules = import.meta.glob('../learnskill/*.vue', { as: 'raw', eager: true })
const demos = computed(() => {
  return Object.entries(modules).map(([path, comp]) => {
    const fileName = path.split('/').pop().replace('.vue', '')
    const displayName = comp.name || fileName.replace('Demo', '')
    return {
      path,
      fileName,
      displayName,
      component: markRaw(comp),
      sourceCode: sourceModules[path]
    }
  }).sort((a, b) => a.fileName.localeCompare(b.fileName))
})

const search = ref('')
const filteredDemos = computed(() => {
  if (!search.value) return demos.value
  const kw = search.value.toLowerCase()
  return demos.value.filter(d =>
    d.displayName.toLowerCase().includes(kw) ||
    d.fileName.toLowerCase().includes(kw)
  )
})

const activeKey = ref(localStorage.getItem('activeDemo') || '')
const activeDemo = computed(() => demos.value.find(d => d.fileName === activeKey.value))

const selectDemo = (fileName) => {
  activeKey.value = fileName
  localStorage.setItem('activeDemo', fileName)
  tabType.value = 'preview' // 默认打开预览
}

const sidebarCollapsed = ref(false)
const toggleSidebar = () => sidebarCollapsed.value = !sidebarCollapsed.value

// 预览 / 源码切换 tab
const tabType = ref('preview')
</script>

<template>
  <div class="app-root">
    <!-- 顶部导航栏 -->
    <header class="topbar">
      <div class="topbar-left">
        <button class="icon-btn" @click="toggleSidebar" :title="sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <!-- 折叠状态下的图标 (三条等长线) -->
            <template v-if="sidebarCollapsed">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </template>
            <!-- 展开状态下的图标 (中间线变短) -->
            <template v-else>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="15" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </template>
          </svg>
        </button>
        <div class="brand">
          <div class="brand-logo">💻</div>
          <div class="brand-text">
            <div class="brand-title">编程学习实验室</div>
            <div class="brand-sub">Demo Playground · Vue3</div>
          </div>
        </div>
      </div>
      
      <div class="topbar-center">
        <div class="global-search">
          <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input v-model="search" type="text" placeholder="搜索 Demo 名称 / 文件名..." />
          <span v-if="search" class="search-clear" @click="search = ''">✕</span>
        </div>
      </div>
      
      <div class="topbar-right">
        <span class="badge">Vue 3.5 + Vite</span>
        <span class="dot"></span>
        <span class="status">运行就绪</span>
      </div>
    </header>

    <div class="body">
      <!-- 侧边栏 -->
      <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
        <nav class="nav">
          <div class="nav-group">
            <div class="nav-group-title" v-if="!sidebarCollapsed">📂 全部示例 Demo</div>
            <div v-else class="nav-group-title text-center">📂</div>
            
            <div
              v-for="demo in filteredDemos"
              :key="demo.fileName"
              class="nav-item"
              :class="{ active: demo.fileName === activeKey }"
              @click="selectDemo(demo.fileName)"
              :title="sidebarCollapsed ? demo.displayName : ''"
            >
              <span class="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </span>
              <div v-if="!sidebarCollapsed" class="nav-content">
                <span class="nav-name">{{ demo.displayName }}</span>
                <span class="nav-file">{{ demo.fileName }}.vue</span>
              </div>
            </div>
            
            <div v-if="filteredDemos.length === 0" class="empty-tip">
              没有找到匹配的 Demo
            </div>
          </div>
        </nav>
        <div v-if="!sidebarCollapsed" class="sidebar-footer">
          <div class="footer-tip">
            <b>💡 自动扫描机制</b>
            <p>在 <code>src/learnskill/</code> 目录新建 <code>*.vue</code> 文件，页面自动热更新加载，无需修改配置。</p>
          </div>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="main">
        <!-- 面包屑 / 操作栏 -->
        <div class="page-header">
          <div class="breadcrumbs">
            <span class="bc-item">学习实验室</span>
            <span class="bc-sep">/</span>
            <span class="bc-item current">{{ activeDemo?.displayName || 'Demo 总览' }}</span>
          </div>
          
          <div class="page-actions" v-if="activeDemo">
            <div class="tab-wrap">
              <button class="tab-btn" :class="{active: tabType === 'preview'}" @click="tabType='preview'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                预览效果
              </button>
              <button class="tab-btn" :class="{active: tabType === 'code'}" @click="tabType='code'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                查看源码
              </button>
            </div>
          </div>
        </div>

        <!-- 内容展示区 -->
        <div class="page-body">
          <!-- 选中Demo时 -->
          <div v-if="activeDemo" class="demo-container">
            <!-- 预览面板：全屏铺满 -->
            <div v-show="tabType === 'preview'" class="preview-panel">
              <component :is="activeDemo.component" class="demo-wrap" />
            </div>
            
            <!-- 源码面板 -->
            <div v-show="tabType === 'code'" class="code-panel">
              <div class="code-header">
                <span class="file-path">src/learnskill/{{ activeDemo.fileName }}.vue</span>
              </div>
              <div class="code-body">
<pre><code>{{ activeDemo.sourceCode }}</code></pre>
              </div>
            </div>
          </div>

          <!-- 首页欢迎页 -->
          <div v-else class="welcome-card">
            <div class="welcome-emoji">🚀</div>
            <h1>欢迎来到编程学习实验室</h1>
            <p class="desc">左侧选择一个示例 Demo，查看组件运行效果，同时支持查看源代码。</p>
            <div class="quick-grid">
              <div
                v-for="demo in demos"
                :key="demo.fileName"
                class="quick-card"
                @click="selectDemo(demo.fileName)"
              >
                <div class="quick-icon">📘</div>
                <div class="quick-name">{{ demo.displayName }}</div>
                <div class="quick-filename">{{ demo.fileName }}.vue</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* 全局根节点：禁止页面整体横向滚动 */
.app-root {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  max-width:100vw;
  background-color: #0f172a;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow: hidden; /* ✅ 关闭整个页面左右、上下全局滚动 */
}

/* 顶部导航 磨砂玻璃风格 */
.topbar {
  height: 64px;
  background-color: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(51, 65, 85, 0.6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  z-index: 100;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 280px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border: none;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.2s ease;
}
.icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-logo {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #38bdf8, #8b5cf6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.2);
}
.brand-text {
  line-height: 1.2;
}
.brand-title {
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
}
.brand-sub {
  font-size: 11px;
  color: #94a3b8;
  letter-spacing: 0.5px;
}

/* 搜索框居中 */
.topbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 600px;
}
.global-search {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.search-icon {
  position: absolute;
  left: 14px;
  color: #64748b;
}
.global-search input {
  width: 100%;
  padding: 10px 16px 10px 42px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 14px;
  background-color: rgba(15, 23, 42, 0.6);
  color: #f1f5f9;
  outline: none;
  transition: all 0.2s ease;
}
.global-search input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
  background-color: #0f172a;
}
.global-search input::placeholder {
  color: #64748b;
}
.search-clear {
  position: absolute;
  right: 12px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #334155;
  color: #cbd5e1;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}
.search-clear:hover {
  background: #475569;
  color: #fff;
}

.topbar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  width: 280px;
}
.badge {
  font-size: 12px;
  font-weight: 500;
  color: #38bdf8;
  background-color: rgba(56, 189, 248, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.2);
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
}
.status {
  font-size: 13px;
  color: #94a3b8;
}

/* 主体布局 */
.body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ===== 侧边栏 ===== */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  background-color: #1e293b;
  border-right: 1px solid #334155;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar.collapsed {
  width: 72px;
}

.nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
}

/* 定制细长滚动条 */
.nav::-webkit-scrollbar,
.page-body::-webkit-scrollbar,
.code-body::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.nav::-webkit-scrollbar-thumb,
.page-body::-webkit-scrollbar-thumb,
.code-body::-webkit-scrollbar-thumb {
  background-color: #475569;
  border-radius: 4px;
}
.nav::-webkit-scrollbar-thumb:hover,
.page-body::-webkit-scrollbar-thumb:hover,
.code-body::-webkit-scrollbar-thumb:hover {
  background-color: #64748b;
}
.nav::-webkit-scrollbar-track,
.page-body::-webkit-scrollbar-track,
.code-body::-webkit-scrollbar-track {
  background-color: transparent;
}

.nav-group-title {
  padding: 8px 12px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.text-center {
  text-align: center;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.nav-item:hover {
  background-color: #334155;
}
.nav-item.active {
  background-color: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.2);
}

.nav-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  color: #64748b;
  transition: color 0.2s;
}
.nav-item.active .nav-icon {
  color: #38bdf8;
}
.nav-item:hover .nav-icon {
  color: #cbd5e1;
}

.nav-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.nav-name {
  font-size: 14px;
  font-weight: 500;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nav-item.active .nav-name {
  color: #38bdf8;
  font-weight: 600;
}
.nav-file {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
  font-family: Consolas, monospace;
}

.sidebar.collapsed .nav-content {
  display: none;
}
.sidebar.collapsed .nav-icon {
  margin-right: 0;
}

.empty-tip {
  text-align: center;
  color: #64748b;
  font-size: 13px;
  padding: 20px 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #334155;
}
.footer-tip {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.6;
  background-color: rgba(15, 23, 42, 0.5);
  padding: 12px;
  border-radius: 8px;
  border: 1px dashed #334155;
}
.footer-tip b {
  color: #cbd5e1;
  display: block;
  margin-bottom: 4px;
}
.footer-tip p {
  margin: 0;
}
.footer-tip code {
  background-color: #1e293b;
  padding: 2px 4px;
  border-radius: 4px;
  color: #38bdf8;
  font-family: Consolas, monospace;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width:0; /* ✅ flex子项允许被压缩，防止内容撑宽 */
  background-color: #0f172a;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: #0f172a;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.bc-item {
  color: #64748b;
}
.bc-item.current {
  color: #e2e8f0;
  font-weight: 500;
}
.bc-sep {
  color: #334155;
}

/* Tab 切换按钮组 */
.tab-wrap {
  display: flex;
  background-color: #1e293b;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #334155;
}
.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.tab-btn:hover:not(.active) {
  color: #cbd5e1;
}
.tab-btn.active {
  background-color: #334155;
  color: #38bdf8;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.page-body {
  flex: 1;
  overflow-y: auto;
  overflow‑x:hidden; /* ✅页面层禁止横向滚动 */
  padding: 24px 32px;
  position: relative;
  min-width:0;
}

/* 当选中 Demo 时，容器铺满高度 */
.demo-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 预览区：去掉多余边框，像无边框画布 */
.preview-panel {
  flex: 1;
  background-color: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;
  padding: 24px;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
.demo-wrap {
  width: 100%;
  min-height: 100%;
}

/* 源码区 */ 
.code-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #111827;
  border-radius: 12px;
  border: 1px solid #334155;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  min-width:0; /* flex容器允许压缩 */
}

.code-header {
  background-color: #1e293b;
  padding: 10px 16px;
  border-bottom: 1px solid #334155;
  display: flex;
  align-items: center;
}
.file-path {
  font-family: Consolas, monospace;
  font-size: 12px;
  color: #94a3b8;
}
.file-path::before {
  content: '📄';
  margin-right: 6px;
}

.code-body {
  flex: 1;
  overflow: auto; /* ✅只有代码块内部才出现横向滚动条 */
  padding: 16px;
  min-width:0;
}
.code-body pre {
  margin: 0;
  min-width:0;
  max-width:100%;
}
.code-body code {
  font-family: 'Fira Code', Consolas, Menlo, Monaco, monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #e2e8f0;
  white-space: pre; /* pre保留格式，超长行在code-body内部滚动，不会撑页面 */
  tab-size: 2;
}

/* 欢迎页 */
.welcome-card {
  max-width: 1000px;
  margin: 0 auto;
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 60px 48px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.welcome-emoji {
  font-size: 64px;
  margin-bottom: 24px;
}
.welcome-card h1 {
  font-size: 28px;
  color: #f1f5f9;
  margin: 0 0 12px;
  font-weight: 600;
}
.desc {
  color: #94a3b8;
  font-size: 15px;
  margin-bottom: 40px;
}
.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  text-align: left;
}
.quick-card {
  padding: 20px;
  background-color: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.quick-card:hover {
  border-color: #38bdf8;
  background-color: rgba(56, 189, 248, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(56, 189, 248, 0.1);
}
.quick-icon {
  font-size: 28px;
  margin-bottom: 12px;
}
.quick-name {
  font-size: 15px;
  font-weight: 600;
  color: #e2e8f0;
}
.quick-filename {
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
  font-family: Consolas, monospace;
}
</style>