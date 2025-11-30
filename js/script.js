

function showSnackBar(text) {
  const snackbar = document.querySelector('.snackbar');  
  snackbar.style.top = window.scrollY + 'px';
  snackbar.innerHTML = text;  
  snackbar.classList.remove('hidden');

  setTimeout( () => {
    const snackbar = document.querySelector('.snackbar');
    snackbar.classList.add('fade-out');
  }, 2000);

  setTimeout( () => {
    const snackbar = document.querySelector('.snackbar');
    snackbar.classList.remove('fade-out');
      snackbar.classList.add('hidden');
  }, 2500);
} // --- end showSnackBar ---

async function copyTextToClipboard(textToCopy) {
  try {
    await navigator.clipboard.writeText(textToCopy);    
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
  showSnackBar('Copied to clipboard');
} // --- end copyTextToClipboard ---


function searchProjects(e) {
  let results = [];
  let searchTerm = e.target.value.toLowerCase();

  if (searchTerm === "") {
    results = projects;
  } 
  else {
    projects.forEach( (project) => {
      let projectToSearch = JSON.stringify(project).toLowerCase();
      if (projectToSearch.indexOf(searchTerm) >= 0) {
        results.push(project);
      }
    });    
  }
  displayProjects(results);  
} // --- end searchProjects ---


function filterHideClosedProjects(show) {
  if (show) {
    displayProjects(projects);
  } else {
    let filteredProjects = [];
    projects.forEach( (project) => {
      if (project.status.toLowerCase() !== 'closed') {
        filteredProjects.push(project);
      }
    });
    displayProjects(filteredProjects);
  }
} // --- end filterHideClosedProjects ---


function sortDisplayProjects(elem, col) {
  let sortedProjects = [];  
  
  if (elem.classList.contains('sorted')) {
    //Descending order
    elem.classList.remove('sorted');
    sortedProjects = projects.sort((a,b) => { 
      if (a[col] < b[col]) {
        return 1;
      } 
      else if (a[col] > b[col]) {
        return -1;
      } else {
        return 0;
      }
    });
  } else {
    //Ascending order (default)
    elem.classList.add('sorted');
    sortedProjects = projects.sort((a,b) => { 
      if (a[col] > b[col]) {
        return 1;
      } 
      else if (a[col] < b[col]) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  displayProjects(sortedProjects);
} // --- end sortDisplayProjects ---


function updateProjectCount() {
  document.querySelector('.project-count').innerHTML = projects.length;
}


function showSidebar(elem, action) {
  document.querySelector(elem).classList.remove('hidden');
  let closeSidebar = elem + " .btn-sidebar-close";
  document.querySelector(closeSidebar).addEventListener('click', (e) => {    
    e.target.closest('.sidebar').classList.add('hidden');
  }); 
  if (action) {
    action();
  }
} //--- end showSidebar ---


function closeModal(modal) {
  document.querySelector('html')
    .addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        document.querySelector('.edit-project').classList.add('hidden');
        document.querySelector('.scrim').classList.add('hidden');

      }
    });
} // --- end closeModal ---


function toggleTheme(theme) {
  const toggle = document.querySelector('#toggle-theme');
  const toggleLinkElement = document.querySelector('#head-link-theme');

  if (!theme) {
    if (toggle.checked) {
      toggleLinkElement.setAttribute('href',"lib/theme-dark.css");
    } else {
      toggleLinkElement.setAttribute('href',"lib/theme-light.css");
    }
  } 
  else if (theme.toLowerCase() === 'dark') {
    toggleLinkElement.setAttribute('href',"lib/theme-dark.css");
    document.querySelector('#head-link-theme').setAttribute('checked', 'checked');
  } 
  else {
    toggleLinkElement.setAttribute('href',"lib/theme-dark.css");
    document.querySelector('#toggle-theme').removeAttribute('checked');
  }
} // --- end toggleTheme ---


function setEvents() {
  document.querySelector('#main-nav-link-tags')
    .addEventListener('click', () => {
      showSidebar('#sidebar-tag', showTagsInSidebar);
    });

  document.querySelector('#toggle-theme')
    .addEventListener('click', () => {
      toggleTheme();
    });

  document.querySelector('#btn-end-punch')
    .addEventListener('click', () => {
      endPunch();
    });

  document.querySelector('.view-projects-table')
    .addEventListener('click', (e)=> {
        
    });


  // ---------------------------------
  // --- BEGIN: Sort by table header ---
  document.querySelector('.view-projects-table-name')
    .addEventListener('click', (e) => {
      sortDisplayProjects(e.target, 'name');
    });

  document.querySelector('.view-projects-table-size')
    .addEventListener('click', (e) => {
      sortDisplayProjects(e.target, 'size');
    });

  document.querySelector('.view-projects-table-design-due')
    .addEventListener('click', (e) => {
      sortDisplayProjects(e.target, 'designDue');
    });

  document.querySelector('.view-projects-table-design-started')
    .addEventListener('click', (e) => {
      sortDisplayProjects(e.target, 'designStarted');
    });

  document.querySelector('.view-projects-table-spec-due')
    .addEventListener('click', (e) => {
      sortDisplayProjects(e.target, 'specDue');
    });

  document.querySelector('.view-projects-table-status')
    .addEventListener('click', (e) => {
      sortDisplayProjects(e.target, 'status');
    });

  document.querySelector('.view-projects-table-pm')
    .addEventListener('click', (e) => {
      sortDisplayProjects(e.target, 'pm');
    });        


  // --- END: Sort by table header ---
  // ---------------------------------

  document.querySelector('#project-search')
    .addEventListener('keyup', (e) => {
      document.querySelector('#project-search-reset').classList.remove('hidden');
      document.querySelector('#project-search-icon').classList.add('hidden');
      searchProjects(e);
    });

  document.querySelector('#project-search-reset')
    .addEventListener('click', () => {
      document.querySelector('#project-search').value = "";
      displayProjects(projects);
      document.querySelector('#project-search-reset').classList.add('hidden');
      document.querySelector('#project-search-icon').classList.remove('hidden');
    });

  document.querySelector('#btn-add-project')
    .addEventListener('click', ()=> {
      addProject();
    });

  document
    .getElementById('btn-export-projects')
    .addEventListener('click',exportProjects);

  //import Projects in JSON format
  document
    .querySelector('#btn-import-projects')
    .addEventListener('click', ()=> {
      projectFileInput.click();
    });
  projectFileInput
    .addEventListener('change', importProjects);
  
  //import Projects in CSV format
  document
    .querySelector('#btn-import-projects-csv')
    .addEventListener('click', ()=> {
        projectCsvFileInput.click();
      });    
  projectCsvFileInput
    .addEventListener('change', importProjectsCsv);

  document.querySelector('#btn-reload-projects')
    .addEventListener('click', ()=> {
      getProjects();
    });

  document.querySelector('#filter-hide-closed')
    .addEventListener('click', (e)=> {
      if (e.target.checked) {
        filterHideClosedProjects(false); 
      } else {
        filterHideClosedProjects(true);
      }
    });

  document.querySelector('#sidebar-tag-add-btn')
    .addEventListener('click', () => {
      addTags();
    });

  document.querySelector('.view-projects-table')
    .addEventListener('click', (e) => {      
      if (e.target.classList.contains('btn-edit-project')) {
          editProject(e.target.dataset.id);
      }
      else {
        let parent = e.target.parentNode;
        if (parent.classList.contains('btn-punch-start')) {
          console.log(Date.now());
        }           
      }
    });
}





// ------------------
// --- INITIALIZE ---
// ------------------
window.onload = ()=> {
  setEvents();
  loadProjectsJSON();
  getProjects(); //load projects from localStorage
  exportProjects(); //generate export Projects button
  // displayProjects(projects);
  updateProjectCount();
  sortDisplayProjects(document.querySelector('.view-projects-table-status'),'status');
  // editProject(1); //For testing only  
  toggleTheme('dark'); //Start with dark mode
  
  //Listen for key up
  // if Key up is Esc, pass it to the active window.
}
// --- end window.onload ---

