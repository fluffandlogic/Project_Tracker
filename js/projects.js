let projects = [];
let projectsCsv = [];
let projectCount = 0;
let punches = [];
const pms = localStorage.pms ? JSON.parse(localStorage.pms) : [];
const projectFileInput = document.querySelector("#import-projects");
const projectCsvFileInput = document.querySelector("#import-projects-csv");

const projectStatus = [
  { id: 0, name: "--Select--", value: "" },
  { id: 1, name: "Open", value: "Open" },
  { id: 2, name: "In Progress", value: "In Progress" },
  { id: 3, name: "Product Review", value: "Product Review" },
  { id: 4, name: "Ready for Clarity", value: "Ready for Clarity" },
  { id: 5, name: "Product Acceptance", value: "Product Acceptance" },
  { id: 6, name: "On Hold", value: "On Hold" },
];

const projectSize = [
  { id: 0, name: "--Select--", value: "" },
  { id: 1, name: "S - Small", value: "S" },
  { id: 2, name: "M - Medium", value: "M" },
  { id: 3, name: "L - Large", value: "L" },
  { id: 4, name: "XL - Extra Large", value: "XL" },
];



function incrementProjectId() {
  let maxProjectId = 0;

  projects.forEach( (project) => {
    maxProjectId = Math.max(maxProjectId, project.id) + 1;
  });
  
  return maxProjectId;
}
                
// --- end initialize variables and constants ---

function buildEntitySelector(entities, selectedEntity, elem) {
  document.querySelector(elem).innerHTML = "";
  entities.forEach((entity) => {
    let opt = document.createElement('option');
    opt.value = entity.value;
    opt.innerHTML = entity.name;
    if (selectedEntity) {
      if (entity.value.toLowerCase() === selectedEntity.toLowerCase())  {
        opt.selected = true;
      }       
    }
    document.querySelector(elem).appendChild(opt);
  });
}

class Project {
  constructor(id,name,desc,size,designDue,designStarted,specDue,workedHours,availableHours,status,pm,url,rm,confluence,figma,figjam,notes) {    
    if (arguments.length !== 0) {      
      this.id = self.crypto.randomUUID(); 
      this.name = name; //0
      this.desc = desc; //1
      this.size = size; //2
      this.designDue = designDue; //3
      this.designStarted = designStarted; //4
      this.specDue = specDue; //5
      this.workedHours = workedHours; //6
      this.availableHours = availableHours; //7
      this.status = status; //8
      this.pm = pm; //9
      this.url = url; //10
      this.rm = rm; //11
      this.confluence = confluence; //12
      this.figma = figma; //13
      this.figjam = figjam; //14
      this.notes = notes || ''; //15
      this.tags = []; //16
    } 
      else    
    {
      this.id = self.crypto.randomUUID();
      this.name = ""; //0
      this.desc = ""; //1
      this.size = ""; //2
      this.designDue = ""; //3
      this.designStarted = ""; //4
      this.specDue = ""; //5
      this.workedHours = 0; //6
      this.availableHours = 0; //7
      this.status = "Open"; //8
      this.pm = ""; //9
      this.url = ""; //10
      this.rm = ""; //11
      this.confluence = ""; //12
      this.figma = ""; //13
      this.figjam = ""; //14
      this.notes = ""; //15
      this.tags = []; //16
    }
  }
}
// --- end Project class ---


function getProjects() {  
  projects = localStorage.projects ? JSON.parse(localStorage.projects) : [];
  displayProjects(projects);
  showSnackBar("Loaded projects from localStorage");
}
// --- end getProjects ---


function saveProjects() {  
  localStorage.projects = "";
  projectsToString = JSON.stringify(projects);
  localStorage.projects = projectsToString;
  showSnackBar("Saved projects to localStorage");
}
// --- end saveProjects ---


function importProjects() {
    const file = projectFileInput.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      () => {
        projects = JSON.parse(reader.result);
        saveProjects(); //Save to localStorage
        // getProjects(); //Load from localStorage
        displayProjects(projects);
      },
      false,
    );

    if (file) {
      reader.readAsText(file);
    }
}
// --- end importProjects ---


function importProjectsCsv(event) {
    projects = [];
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function(e) {
        const content = e.target.result;
        let projectsCsv = content.split('\n');

        projectsCsv.forEach((row) => {        
          const rowData = row.split(',');
          const project = new Project(
            rowData[0].trim(),
            rowData[1].trim(),
            rowData[2].trim(),
            rowData[3].trim(),
            rowData[4].trim(),
            rowData[5].trim(),
            rowData[6].trim(),
            rowData[7].trim(),
            rowData[8].trim(),
            rowData[9].trim(),
            rowData[10].trim(),
            rowData[11].trim(),
            rowData[12].trim(),
            rowData[13].trim(),
            rowData[14].trim(),
            rowData[15].trim(),
          );
          projects.push(project);
        });

        saveProjects(); //Save to localStorage
        getProjects(); //Load from localStorage
        displayProjects(projects); //render data
      }
      reader.readAsText(file);
    }
}
// --- end importProjectAsCsv ---


function exportProjects() {   
  let dataStr = 
    "data:text/json;charset=utf-8," + 
    encodeURIComponent(JSON.stringify(projects));

  let dlAnchorElem = document.getElementById('btn-export-projects');
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "projects.json");
}
// --- end exportProjects ---


function displayProjects(projectsToDisplay) {
  let display = ``;

  function tableCellWithUrl(content,contentType) {
     if (content === '') {
      return `<td class="empty">N/A</td>`;
    } else {
      return `<td>
                <div class="link" title="${content}">
                  <a href="${content}" target="_blank">${contentType}</a>
                  <button class="btn btn-icon" data-url="${content}" onclick="copyTextToClipboard('${content}')">
                    <span class="icon icon-copy">Copy</span>
                  </button>
                </div>
              </td>`;
    }
  }  

  function tableCellWithDate(content, elem) {    
    let renderedDate = '';
    let contentToDate = [];

    if (content) {
      if (content.toUpperCase() === 'N/A') {
         renderedDate = content;
      } else {
        contentToDate = content.split('-');        
        if (contentToDate.length === 3) {
          const Month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',];
          renderedDate = Month[Number(contentToDate[1].trim()) - 1] + "-" + Number(contentToDate[2]);
        } else {
          renderedDate = "";
        }
      }
    } else {
      renderedDate = "";
    }
    if (elem.toLowerCase() === 'date-design-due') {      
      if (contentToDate.length === 3) {
        const today = new Date(Date.now());        

        //getMonth is 0-11 (Jan - Dec). So have to subtract 1 from contentToDate's month
        //To be able to compare the stored date against the date object. Okay, this is dumb.
        //I should just store the date as a Date object right? Sigh. I don't know what I'm doing.
        if (parseInt(contentToDate[1]) - 1 === today.getMonth()) {
          //I want to know when designs are due in a week or two weeks time. Both are critical.                    
          const daysLeft = parseInt(contentToDate[2]) - today.getDate();          
          //One week out is for (S)mall stories with tight deadlines.
          if (daysLeft > 0 && daysLeft <= 7) {
            return `<td class="date ${elem} danger">${renderedDate}</td>`; 
          } 
          //Two weeks out is for larger stories that need to be done at least a week before spec due date.          
          else if (daysLeft > 0 && daysLeft <= 14) {
            return `<td class="date ${elem} warn">${renderedDate}</td>`; 
          }
        }

      }
    }
    return `<td class="date ${elem}">${renderedDate}</td>`;
  }

  function renderNotes(content) {
    if (!content) { 
      return "";
    } else {
      let words = content.split(" ");
      words.forEach( (word, index) => {
        if (word.toLowerCase().indexOf('http') >= 0) {          
          words[index] = `<a href="${word}" target="_blank">${word}</a>`;
        }
      });      
      return words.join(' ');
    }
  }

  projectsToDisplay.forEach( (project) => {

    if (project.status && project.status.toLowerCase() === 'closed') {
      display += '<tr class="closed">';
    } else {
      display += '<tr>';
    }

    display += `
        <th class="name">
          <button class="btn btn-icon btn-punch-start" title="Punch Start">
            <span class="icon icon-punch" data-id="${project.id}">Start</span>
          </button>

          <a href="javascript:void(0)" 
            data-id="${project.id}" 
            class="btn-edit-project">            
          ${project.name}</a>
        </th>
        <td class="desc">${project.desc}</td>
        <td class="size">${project.size}</td>
        ${tableCellWithDate(project.designDue,'date-design-due')}
        ${tableCellWithDate(project.designDue,'date-design-started')}
        ${tableCellWithDate(project.designDue,'date-spec-due')}
        <td class="hours hours-worked">${project.workedHours}</td>
        <td class="hours hours-available">${project.availableHours}</td>
        <td class="status">${project.status}</td>
        <td class="pm">${project.pm}</td>
        ${tableCellWithUrl(project.url, "Story")}
        ${tableCellWithUrl(project.rm, "RM")}
        ${tableCellWithUrl(project.confluence, "Confluence")}
        ${tableCellWithUrl(project.figma, "Figma")}
        ${tableCellWithUrl(project.figjam, "FigJam")}        
        <td>${renderNotes(project.notes)}</td>
    `;

    display += '</tr>';
  });

  document.querySelector('.view-projects-table-body').innerHTML = display;
  updateProjectCount();

  document.querySelectorAll('.btn-edit-project').forEach((item)=> {
    item.addEventListener('click', (e)=> {
      editProject(e.target.dataset.id);
    });
  });
}
// --- end displayProjects ---


function addProject() {
  const addProjectModal = document.querySelector('.add-project');
  addProjectModal.classList.remove('hidden');
  document.querySelector('.scrim').classList.remove('hidden');
  addProjectModal.style.top = window.scrollY + 'px';

  let tempProject = new Project();
  tempProject.id  = self.crypto.randomUUID();
  document.querySelector('#add-project-id').value = tempProject.id;

  buildEntitySelector(pms, "", "#add-project-pm");
  buildEntitySelector(projectSize, "", "#add-project-size");
  buildEntitySelector(projectStatus, "", "#add-project-status");

  function closeAddProjectModal() {
      document.querySelector('.add-project').classList.add('hidden');
      document.querySelector('.scrim').classList.add('hidden');    

      document.querySelector('#add-project-id').value = "";
      document.querySelector('#add-project-name').value = "";
      document.querySelector('#add-project-desc').value = "";
      document.querySelector('#add-project-size').value = "";
      document.querySelector('#add-project-design-due').value = "";
      document.querySelector('#add-project-design-started').value = "";
      document.querySelector('#add-project-spec-due').value = "";
      document.querySelector('#add-project-worked-hours').value = "";
      document.querySelector('#add-project-available-hours').value = "";
      document.querySelector('#add-project-status').value = "";
      document.querySelector('#add-project-pm').value = "";  
      document.querySelector('#add-project-url').value = "";
      document.querySelector('#add-project-rm').value = "";
      document.querySelector('#add-project-confluence').value = "";
      document.querySelector('#add-project-figma').value = "";
      document.querySelector('#add-project-figjam').value = "";
      document.querySelector('#add-project-notes').value = "";
  }

  document.querySelector('#add-project-btn-save')
    .addEventListener('click', () => {
      tempProject.name = document.querySelector('#add-project-name').value;
      tempProject.desc = document.querySelector('#add-project-desc').value;
      tempProject.size = document.querySelector('#add-project-size').value;
      tempProject.designDue = document.querySelector('#add-project-design-due').value;
      tempProject.designStarted = document.querySelector('#add-project-design-started').value;
      tempProject.specDue = document.querySelector('#add-project-spec-due').value;
      tempProject.workedHours = document.querySelector('#add-project-worked-hours').value;
      tempProject.availableHours = document.querySelector('#add-project-available-hours').value;
      tempProject.status = document.querySelector('#add-project-status').value;
      tempProject.pm = document.querySelector('#add-project-pm').value || "";      
      tempProject.url = document.querySelector('#add-project-url').value;
      tempProject.rm = document.querySelector('#add-project-rm').value;
      tempProject.confluence = document.querySelector('#add-project-confluence').value;
      tempProject.figma = document.querySelector('#add-project-figma').value;
      tempProject.figjam = document.querySelector('#add-project-figjam').value;
      tempProject.notes = document.querySelector('#add-project-notes').value;
      
      if (tempProject.name !== '') {          
          projects.push(tempProject);
      }
      
      saveProjects();
      getProjects();
      displayProjects(projects);
      updateProjectCount();

      closeAddProjectModal();

      showSnackBar(`${tempProject.name} added`);
    });

  document.querySelectorAll('.btn-close-add-project').forEach( (btn) => {
    btn.addEventListener('click', () => {
      closeAddProjectModal();
    });    
  });
} // --- end addProject ---


function editProject(id) {  
  const editProjectModal = document.querySelector('.edit-project');
  editProjectModal.style.top = window.scrollY + 'px';
  editProjectModal.classList.remove('hidden');  
  document.querySelector('.scrim').classList.remove('hidden');

  projects.forEach((project) => {
    if (project.id === id) {
      document.querySelector('#edit-project-id').value = project.id;
      document.querySelector('#edit-project-name').value = project.name;
      document.querySelector('#edit-project-desc').value = project.desc;
      //Note: Project Size is dynamically built below
      document.querySelector('#edit-project-design-due').value = project.designDue;
      document.querySelector('#edit-project-design-started').value = project.designStarted;
      document.querySelector('#edit-project-spec-due').value = project.specDue;
      document.querySelector('#edit-project-worked-hours').value = project.workedHours;
      document.querySelector('#edit-project-available-hours').value = project.availableHours;
      //Note: Status is dynamically built below
      //Note: PM is dynamically built below
      document.querySelector('#edit-project-url').value = project.url;
      document.querySelector('#edit-project-rm').value = project.rm;
      document.querySelector('#edit-project-confluence').value = project.confluence;
      document.querySelector('#edit-project-figma').value = project.figma;
      document.querySelector('#edit-project-figjam').value = project.figjam;
      document.querySelector('#edit-project-notes').value = project.notes;

      buildEntitySelector(pms, project.pm, "#edit-project-pm");
      buildEntitySelector(projectSize, project.size, "#edit-project-size");
      buildEntitySelector(projectStatus, project.status, "#edit-project-status");      

    } // --- end found matching project.id ---
  }); // -- end loop through projects ---

  document.querySelector('#edit-project-btn-save')
    .addEventListener('click', () => {
      projects.forEach((project) => {
        if (project.id === id) {               
          project.name = document.querySelector('#edit-project-name').value;
          project.desc = document.querySelector('#edit-project-desc').value;
          project.size = document.querySelector('#edit-project-size').value;
          project.designDue = document.querySelector('#edit-project-design-due').value;
          project.designStarted = document.querySelector('#edit-project-design-started').value;
          project.specDue = document.querySelector('#edit-project-spec-due').value;
          project.workedHours = document.querySelector('#edit-project-worked-hours').value;
          project.availableHours = document.querySelector('#edit-project-available-hours').value;
          project.status = document.querySelector('#edit-project-status').value;
          project.pm = document.querySelector('#edit-project-pm').value;          
          project.url = document.querySelector('#edit-project-url').value;
          project.rm = document.querySelector('#edit-project-rm').value;
          project.confluence = document.querySelector('#edit-project-confluence').value;
          project.figma = document.querySelector('#edit-project-figma').value;
          project.figjam = document.querySelector('#edit-project-figjam').value;
          project.notes = document.querySelector('#edit-project-notes').value;
          
          showSnackBar(`${project.name} updated`);
        }
      });      

      saveProjects();
      getProjects();
      displayProjects(projects);

      document.querySelector('.edit-project').classList.add('hidden');
      document.querySelector('.scrim').classList.add('hidden');
  });

  document.querySelectorAll('.btn-close-edit-project').forEach( (btn) => {
    btn.addEventListener('click', () => {
      document.querySelector('.edit-project').classList.add('hidden');
      document.querySelector('.scrim').classList.add('hidden');

      document.querySelector('#edit-project-name').value = "";
      document.querySelector('#edit-project-desc').value = "";
      document.querySelector('#edit-project-size').value = "";
      document.querySelector('#edit-project-design-due').value = "";
      document.querySelector('#edit-project-design-started').value = "";
      document.querySelector('#edit-project-spec-due').value = "";
      document.querySelector('#edit-project-worked-hours').value = "";
      document.querySelector('#edit-project-available-hours').value = "";
      document.querySelector('#edit-project-status').value = "";
      document.querySelector('#edit-project-pm').value = "";      
      document.querySelector('#edit-project-url').value = "";
      document.querySelector('#edit-project-rm').value = "";
      document.querySelector('#edit-project-confluence').value = "";
      document.querySelector('#edit-project-figma').value = "";
      document.querySelector('#edit-project-figjam').value = "";
      document.querySelector('#edit-project-notes').value = "";
    });
  });

  document.querySelector('#edit-project-btn-delete')
    .addEventListener('click', () => {
      deleteProject(id);
      document.querySelector('.edit-project').classList.add('hidden');
      document.querySelector('.scrim').classList.add('hidden');
    }); 
} // --- end editProject ---


function deleteProject(id) {
    projects.forEach((project, index) => {
    if (project.id === id) {         
      projects.splice(index,1); //Delete project from projects array
      saveProjects();
      getProjects();
      displayProjects(projects);
      showSnackBar(`Project #${project.id} deleted`);
    }
  });
} // --- end deleteProject ---
