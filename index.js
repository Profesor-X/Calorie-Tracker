// Storage Controller
const StorageCtrl = (function(){
  
  // Public methods
  return {
    storeItem: function(item){
      let items;

      // Check LS for items
      if(localStorage.getItem('items') === null){
        items = [];

        // push new items
        items.push(item);

        // Set LS / LS only holds strings
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is in LS
        items = JSON.parse(localStorage.getItem('items'));

        // Push new item
        items.push(item);

        // Reset LS
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(updatedItem.id === item.id){
          items.splice(index, 1, updatedItem);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id){
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function(item, index){
        if(id === item.id){
          items.splice(index, 1);
        }
      });

      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function(){
      localStorage.removeItem('items');
    }
  }
})();

// *******************************************************************
// Item Controller
const ItemCtrl = (function(){
  // Item Constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  // Data Structure / State
  const data = {
    // Item array
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null, 
    totalCalories: 0
  }

  // Public Methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      let ID;
      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new ITEM
      newItem = new Item(ID, name, calories);

      // Add to Items Array
      data.items.push(newItem);

      return newItem;

    },
    getItemById: function(id){
      let found = null;

      // Loop through items
      data.items.forEach(function(item){
        if(item.id === id){
          found = item;
        }
      });

      return found;
    },
    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });

      return found;

    },
    deleteItem: function(id){
      // get ids
      ids = data.items.map(function(item){
        return item.id;
      });

      // get index
      const index = ids.indexOf(id);

      // remove item 
      data.items.splice(index, 1);
    },
    clearAllItems: function(){
      data.items = [];
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    getTotalCalories: function(){
      let total = 0;

      // LOOP TRHOUGH ITEMS AND ADD CALORIES
      data.items.forEach(function(item){
        total += item.calories;
       
      });

      // set total in data structure
      data.totalCalories = total;

      // return calories
      return data.totalCalories;
    },
    logData: function(){
      return data;
    }
  }
})();

// *******************************************************************
// UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    listitems: '#item-list li',
    addBtn: '.add-btn', 
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(function(item){
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name} </strong> 
        <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      // Insert list items into HTML
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function(){
      return {
        name:document.querySelector(UISelectors.itemNameInput).value,
        calories:document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    addListItem: function(item){
      // Show Items
      document.querySelector(UISelectors.itemList).style.display = 'block';
      // Create LI element
      const li = document.createElement('li');
      // Add class
      li.className = 'collection-item';
      // Add ID
      li.id = `item-${item.id}`;
      // ADD HTML
      li.innerHTML = `<strong>${item.name}: </strong> 
      <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;
      // Insert Item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listitems);

      // NODE TO ARRAY
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> 
          <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      })
    },
    deleteListItem: function(id){
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    clearInputs: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;

      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },
    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listitems);
      
      // NODE TO ARRAY
      listItems = Array.from(listItems);
      
      // Remove Items
      listItems.forEach(function(item){
        item.remove();
      });
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    clearEditState: function(){
      UICtrl.clearInputs();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    showEditState: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';

    },
    getSelectors: function(){
      return UISelectors;
    }
  }
})();

// *******************************************************************
// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
  // Load all event listeners
  const loadEventListeners = function(){
    // GET UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // ADD ITEM EVENT
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e){
      if(e.keycode === 13 || e.which ===13){
        e.preventDefault();
        return false;
      }
    });

    // Edit icon event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    // Delete button event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    // Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click',   function(e){
      e.preventDefault();
      UICtrl.clearEditState();
    });

    // Clear button event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);


  }

  // Add item submit
  const itemAddSubmit = function(e) {
    // Get form input
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if(input.name === '' || input.calories === ''){
      alert('Please fill in the required fields!');
    } else {
      
      // Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Store in local storage
      StorageCtrl.storeItem(newItem);

      // CLEAR FIELDS
      UICtrl.clearInputs();

    }

    e.preventDefault();

  }

  // Click edit item
  const itemEditClick = function(e){
    if(e.target.classList.contains('edit-item')) {
      
      // GET LIST ITEM ID
      const listId = e.target.parentNode.parentNode.id;

      // break into an array
      const listIdArr = listId.split('-');
      
      // Get the actual ID
      const id = parseInt(listIdArr[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add item to form
      UICtrl.addItemToForm();
    }

    e.preventDefault();
    
  }

  // DELETE button event
  const itemDeleteSubmit = function(e){
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete drom data structure
    ItemCtrl.deleteItem(currentItem.id);

    //  Delete from UI
    UICtrl.deleteListItem(currentItem.id);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from LS
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    UICtrl.clearEditState();
    
    e.preventDefault();
  }

  // Clear all items
  const clearAllItemsClick = function(e){
    // Delete all items from data structure
    ItemCtrl.clearAllItems();

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Remove from the UI
    UICtrl.removeItems();

    // Clear items from LS
    StorageCtrl.clearItemsFromStorage();

    // Hide UL
    UICtrl.hideList();
    
    e.preventDefault();
  }

  // Item Update Submit
  const itemUpdateSubmit = function(e){
    // Get item input
    const input = UICtrl.getItemInput();
    // update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update local storage
    StorageCtrl.updateItemStorage(updatedItem);

    UICtrl.clearEditState();
    
    e.preventDefault();
    
  }

  return {
    init: function(){
      console.log('Initializing app...');

      // Clear edit state / set init state
      UICtrl.clearEditState();

      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if items exist
      if(items.length === 0){
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemList(items);
      }

      // get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // LOAD EVENT LISTENERS
      loadEventListeners();
    }
  }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();