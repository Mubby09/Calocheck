//ITEM CONTROLLER//////////////////////////////////////////////////////
const ItemCtrl = (function() {
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data structure
  const data = {
    items: [
      //   { id: 0, name: "Egg", calories: 300 },
      //   { id: 1, name: "Ice- cream", calories: 500 },
      //   { id: 2, name: "Steak", calories: 700 },
      //   { id: 3, name: "Tuna", calories: 500 }
    ],
    currentItem: null,
    totalCalories: 0
  };
  //PUBLIC METHODS (ANYTHING IN THE RETURN STATEMENT IS PUBLIC)
  return {
    getItems() {
      return data.items;
    },

    addItem(name, calories) {
      let ID = 0;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      //CALORIES TO NUMBER
      calories = +calories;
      // You could use parseInt(calories)too;

      //CREATE NEW ITEM
      newItem = new Item(ID, name, calories); //PROBABLY REMOVE THE CONST KEYWORD!!!!!
      //ADD TO ITEMS ARRAY
      data.items.push(newItem);
      return newItem;
    },

    getTotalCalories() {
      let total = 0;
      //LOOP THROUGH ITEMS AND ADD CALORIES.
      data.items.forEach((item) => {
        total += item.calories;
      });
      //SET TOTAL CALORIES IN DATA STRUCTURE
      data.totalCalories = total;
      return data.totalCalories;
    },

    getElementById(id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    setCurrentItem(item) {
      data.currentItem = item;
    },

    getCurrentItem() {
      return data.currentItem;
    },

    updateItem(name, calories) {
      //  CALORIES TO NUMBER (BECAUSE IT'S COMING FROM THE FORM)
      calories = +calories;

      let found = null;
      data.items.forEach((item) => {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    logData() {
      return data;
    }
  };
})();

//UI CONTROLLER///////////////////////////////////////////////////////

const UICtrl = (function() {
  //PUBLIC METHODS (ANYTHING IN THE RETURN STATEMENT IS PUBLIC)
  return {
    // populateItemList(items) {
    //   let html = "";
    //   items.forEach((item) => {
    //     html += `<li class="list-group-item d-flex justify-content-between align-items-center" id ='${item.id}'>
    //     ${item.name} : <em>${item.calories} calories</em>
    //     <a href="#" class="badge badge-primary badge-pill" id='edit-item'>X</a>
    // </li>`;
    //   });
    //   //INSERT LIST ITEMS
    //   document.querySelector(".list-group").innerHTML = html;
    // },

    getInputItem() {
      return {
        name: document.querySelector("#add-meal").value,
        calories: document.querySelector("#add-calorie").value
      };
    },

    addListItem(item) {
      //CREATE 'li' ELEMENT
      const listItem = document.createElement("li");
      //ADD CLASSNAME
      listItem.className = `list-group-item`;
      listItem.id = `item - ${item.id}`;
      listItem.innerHTML = ` <li class="list-group-item d-flex justify-content-between align-items-center" id ='${item.id}'>
      ${item.name} : <em>${item.calories} calories</em>
      <a href="#" class="edit-item badge badge-primary badge-pill">X</a>
  </li>`;
      document
        .querySelector(".list-group")
        .insertAdjacentElement("beforeend", listItem);
    },

    clearInputs() {
      (document.querySelector("#add-meal").value = ""),
        (document.querySelector("#add-calorie").value = "");
    },

    showTotalCalories(totalCalories) {
      document.querySelector(".total-calories").textContent = totalCalories;
    },

    clearEditState() {
      UICtrl.clearInputs();
      document.querySelector(".update").style.display = "none";
      document.querySelector(".remove").style.display = "none";
      document.querySelector(".back").style.display = "none";
    },

    setInputFields(item) {
      document.querySelector(
        "#add-meal"
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        "#add-calorie"
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    showEditState() {
      document.querySelector(".add").style.display = "none";
      document.querySelector(".update").style.display = "inline";
      document.querySelector(".remove").style.display = "inline";
      document.querySelector(".back").style.display = "inline";
    },

    updateList(item) {
      let listItems = document.querySelectorAll(".list-group li"); //THIS GIVES US A NODE LIST
      //AND WE NEED TO LOOP THROUGH THESE NDOES
      // AND WE CAN'T USE A forEach() ON A NODE LIST, SO WE NEED TO CONERT IT TO AN ARRAY

      listItems = Array.from(listItems); //THE Array.from() CONVERTS 'listItems' TO AN ARRAY.
      listItems.forEach((listItem) => {
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(
            `#${itemID}`
          ).innerHTML = ` <li class="list-group-item d-flex justify-content-between align-items-center" id ='${item.id}'>
          ${item.name} : <em>${item.calories} calories</em>
          <a href="#" class="edit-item badge badge-primary badge-pill">X</a>
      </li>`;
        }
      });
    }
  };
})();

////APP CONTROLLER///////////////////////////////////////////////////

const App = (function(ItemCtrl, UICtrl) {
  function loadEventListener() {
    const add = document.querySelector(".add");
    add.addEventListener("click", addItemFunc);
  }

  document
    .querySelector(".list-group")
    .addEventListener("click", EditButtonFunc);

  document.querySelector(".update").addEventListener("click", itemUpdateClick);

  document.addEventListener("keypress", (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      return false;
    }
  });
  //ADD ITEM SUBMIT
  function addItemFunc(e) {
    const input = UICtrl.getInputItem();
    if (input.name !== "" && input.calories !== "") {
      //Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);
      //TOTAL CALORIES
      const totalCalories = ItemCtrl.getTotalCalories();
      //DISPLAYING TOTAL IN THE UI
      UICtrl.showTotalCalories(totalCalories);
      //CLEAR INPUT FIELDS
      UICtrl.clearInputs();
    }
    e.preventDefault();
  }

  function EditButtonFunc(e) {
    if (e.target.classList.contains("edit-item")) {
      //GETTING THE ID FOROM THE LIST ITEM
      const listId = e.target.parentNode.parentNode.id;
      //BREAK listId INTO AN ARRAY
      const listIdArray = listId.split("-");
      const id = +listIdArray[1]; //or you could use 'parseInt(listIdArray[1])'

      const itemToEdit = ItemCtrl.getElementById(id);
      //SET CURRENT ITEM
      ItemCtrl.setCurrentItem(itemToEdit);
      UICtrl.setInputFields();
    }
    e.preventDefault();
  }

  function itemUpdateClick(e) {
    //GET INPUT ITEMS
    const input = UICtrl.getInputItem();

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // UPDATE THE UI
    UICtrl.updateList(updatedItem);
    e.preventDefault();
  }

  //PUBLIC METHODS (ANYTHING IN THE RETURN STATEMENT IS PUBLIC)
  return {
    init() {
      //   const items = ItemCtrl.getItems();
      //Populate List with items

      //   UICtrl.populateItemList(items);

      // Load Event listeners
      loadEventListener();
      UICtrl.clearEditState();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
