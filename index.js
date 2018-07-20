'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false, edited: false},
    {name: 'oranges', checked: false, edited: false},
    {name: 'milk', checked: true, edited: false},
    {name: 'bread', checked: false, edited: false}
  ],
  hideCheckedItems: false,
  searchTerm: null
};

//STORE EDITING


function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false, edited: false});
}

function deleteItemFromShoppingList(itemIndex) {
  STORE.items.splice(itemIndex, 1);
}

function editItem(itemIndex, editedName) {
  const uneditedItem = STORE.items[itemIndex];
  if (uneditedItem.name === editedName) {
    console.error('Try something else!');
    return;
  }
  STORE.items[itemIndex].name = editedName;
  console.log(`Renamed ${uneditedItem.name} to ${editedName}`);

}

function toggleCheck() {
  STORE.hideCheckedItems = !STORE.hideCheckedItems;
}

function toggleEditing(itemIndex) {
  STORE.items.map((item, indx) => {
    item.edited = (indx === itemIndex ? !item.edited : false );
    console.log(`Edit toggled on item at index ${itemIndex}`);
  });
}

function updateSearchTerm(word) {
  STORE.searchTerm = word;
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}

// DOM MANIPULATION

function renderShoppingList() {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  
  const items = STORE.items.filter(toRenderOrNotToRender);
  const shoppingListItemsString = generateShoppingItemsString(items);
  const itemNoun = items.length === 1 ? 'item' : 'items';
  
  // update the live region
  $('.js-list-count').text(`${items.length} ${itemNoun}`);
  // Render the list
  $('.js-shopping-list').html(shoppingListItemsString);


  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

function toRenderOrNotToRender(item) {
  const {hideCheckedItems, searchTerm} = STORE;
  if (hideCheckedItems && item.checked) {
    return false;
  } if (searchTerm) {
    return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  } else {
    return true;
  }
}

function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');
  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  return items.join('');
}

function generateItemElement(item, itemIndex, template) {
  const checkButtonText = item.checked ? 'uncheck' : 'check';
  let itemHTML = (
    `<span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button type='button' class="shopping-item-toggle js-toggle-checked">
            <span class="button-label">${checkButtonText}</span>
        </button>
        <button type="button" class="shopping-item-edit js-toggle edit">
          <span class="button-label">edit</span>
        </button>
        <button type="button" class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>`
  ); 
  if (item.edited) {
    itemHTML = (
      `<form id="js-edit-form">
        <input
          type="text"
          id="name"
          class="js-updated-name shopping-item"
          name="name"
          value="${item.name}"
        />
        <div class="shopping-item-controls">
          <button type="button"class="shopping-item-cancel-edit js-toggle-edit">
            <span class="button-label">cancel</span>
          </button>
          <button type="submit" class="shopping-item-save-edit js-save-edit">
            <span class="button-label">save</span>
          </button>
        </div>
      </form>`
    );
  }
  return (
    `<li class="js-item-index-element" data-item-index="${itemIndex}">
      ${itemHTML}
    </li>`
  );
}

// EVENT HANDLING

function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}

function handleSearchSubmit() {
  $('#js-search-form').on('submit', function(event) {
    event.preventDefault();
    const word = $('.js-search-term').val();
    updateSearchTerm(word);
    renderShoppingList();
  });
}

function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-toggle-checked', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}

function handleToggleChecked() {
  $('#js-search-form').on('change', '.js-toggle-checked', function(e) {
    toggleCheck();
    renderShoppingList();
  });
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    deleteItemFromShoppingList(itemIndex);
    renderShoppingList();
  });
}

function handleToggleItemEdit() {
  $('.js-shopping-list').on('click', '.js-toggle-edit', function(event) {
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleEditing(itemIndex);
    renderShoppingList();
  });
}

function handleEditItemSubmit() {
  $('.js-shopping-list').on('submit', '#js-edit-form', function(event) {
    event.preventDefault();
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    const updatedItemName = $('.js-updated-name').val();
    editItem(itemIndex, updatedItemName);
    toggleEditing(itemIndex);
    renderShoppingList();
  });
}

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleSearchSubmit();
  handleToggleItemEdit();
  handleEditItemSubmit();
  handleToggleChecked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);









