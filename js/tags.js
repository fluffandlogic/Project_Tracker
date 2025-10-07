let tags = [];
  
try {
  tags = JSON.parse(localStorage.tags);
} catch {
  tags = [];
} // --- end import ---

function showTagsInSidebar() {
  displayTags(tags);

  function closeTagsSidebar() {
    document.querySelector('#sidebar-tag-add-btn').closest('.sidebar-actions').classList.remove('hidden');
    document.querySelector('#sidebar-tag-add-input-container').classList.add('hidden');
    displayTags(tags);
  }

  document.querySelector('#tag-search')
    .addEventListener('keyup', (e) => {
      const parent = e.target.closest('.search');
      let iconSearch = parent.querySelector('.search-icon');
      let iconReset = parent.querySelector('.btn-search-reset');
      iconSearch.classList.add('hidden');
      iconReset.classList.remove('hidden');

      iconReset.addEventListener('click', () => {
        iconSearch.classList.remove('hidden');
        iconReset.classList.add('hidden');
        e.target.value = "";
        displayTags(tags);
      });
      
      let searchResults = [];
      tags.forEach( (tag) => {
        if (tag.toLowerCase().indexOf(e.target.value.toLowerCase()) >= 0) {
          searchResults.push(tag);
        }
      });
      displayTags(searchResults);
    });

  // Delete selected tag from the actual tags array 
  // not the list being displayed (which could be search results) 
  document.querySelector('#sidebar-tag-list')
    .addEventListener('click', (e) => {
      if (e.target.classList.contains('icon-delete')) {
        const tagToDelete = e.target.closest('.sidebar-list-item-delete').dataset.tag;
          tags.forEach( (tag, index) => {
          if (tag.toLowerCase() === tagToDelete.toLowerCase()) {
            tags.splice(index, 1);
            localStorage.tags = JSON.stringify(tags);
            displayTags(tags);
          }
        });
      }
    });
} // --- end showTagsInSidebar ---

function displayTags(selectedTags) {
  let tagsToDisplay = '';
  selectedTags.forEach( (tag) => {
    tagsToDisplay += `
      <div class="sidebar-list-item">
        <span class="sidebar-list-item-content">${tag}</span>
        <button class="btn btn-icon sidebar-list-item-delete" data-tag="${tag}">
          <span class="icon icon-delete">Delete</span>
        </button>
      </div>
    `;    
  });
  document.querySelector('#sidebar-tag-list').innerHTML = tagsToDisplay;
} // --- end display ---

function addTags() {
  document.querySelector('#sidebar-tag-add-btn').closest('.sidebar-actions').classList.add('hidden');  
  document.querySelector('#sidebar-tag-add-input-container').classList.remove('hidden');
  const tagAddInput = document.querySelector('#sidebar-tag-add-input');
  tagAddInput.focus();

  tagAddInput.addEventListener('keyup', (e)=> {
    if (e.key === 'Enter') {
      let duplicateTag = false;
      const newTag = e.target.value.trim();
      
      tags.forEach( (tag) => {
        if (tag.toLowerCase() === newTag.toLowerCase()) {
          duplicateTag = true;
        }
      });

      if (!duplicateTag && newTag !== "") {
        tags.push(newTag);
        console.log([tags]);
        localStorage.tags = JSON.stringify(tags);
      }

      e.target.value = '';      
      document.querySelector('#sidebar-tag-add-btn').closest('.sidebar-actions').classList.remove('hidden');
      document.querySelector('#sidebar-tag-add-input-container').classList.add('hidden');
      displayTags(tags);
    } 
    else if (e.key === 'Escape') {      
      e.target.value = ''; 
      document.querySelector('#sidebar-tag-add-btn').closest('.sidebar-actions').classList.remove('hidden');
      document.querySelector('#sidebar-tag-add-input-container').classList.add('hidden');
      displayTags(tags);
    }   
  });
}

