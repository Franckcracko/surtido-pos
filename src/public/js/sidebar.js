let sidebarOpen = false;
let activeTab = 'dashboard';

function toggleSidebar() {
  sidebarOpen = !sidebarOpen;
  render();
}

function setActiveTab(tab) {
  activeTab = tab;
  render();
}

function render() {
  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  if (sidebarOpen) {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
  } else {
    sidebar.classList.add('-translate-x-full');
    sidebar.classList.remove('translate-x-0');
  }

  // Botones de navegación
  const tabs = ['dashboard', 'categories', 'inventory', 'customers', 'settings'];
  tabs.forEach(tab => {
    const btn = document.getElementById(`btn-${tab}`);
    if (tab === activeTab) {
      btn.classList.add('bg-red-700', 'text-white');
      btn.classList.remove('text-red-100');
    } else {
      btn.classList.remove('bg-red-700', 'text-white');
      btn.classList.add('text-red-100');
    }
  });
}

document.addEventListener('DOMContentLoaded', render);