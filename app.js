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

    logData() {
      return data;
    }
  };
})();

//UI CONTROLLER///////////////////////////////////////////////////////

const UICtrl = (function() {
  //PUBLIC METHODS (ANYTHING IN THE RETURN STATEMENT IS PUBLIC)
  return {
    populateItemList(items) {
      let html = "";
      items.forEach((item) => {
        html += `<li class="list-group-item d-flex justify-content-between align-items-center" id ='${item.id}'>
        ${item.name} : <em>${item.calories} calories</em>
        <a href="#" class="badge badge-primary badge-pill" id='edit-item'>X</a>
    </li>`;
      });
      //INSERT LIST ITEMS
      document.querySelector(".list-group").innerHTML = html;
    },

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
      listItem.className = `ist-group-item`;
      listItem.id = `item- ${item.id}`;
      listItem.innerHTML = ` <li class="list-group-item d-flex justify-content-between align-items-center" id ='${item.id}'>
      ${item.name} : <em>${item.calories} calories</em>
      <a href="#" class="badge badge-primary badge-pill" id='edit-item'>X</a>
  </li>`;
      document
        .querySelector(".list-group")
        .insertAdjacentElement("beforeend", listItem);
    },

    clearInputs() {
      (document.querySelector("#add-meal").value = ""),
        (document.querySelector("#add-calorie").value = "");
    }
  };
})();

////APP CONTROLLER///////////////////////////////////////////////////

const App = (function(ItemCtrl, UICtrl) {
  function loadEventListener() {
    const add = document.querySelector(".add");
    add.addEventListener("click", addItemFunc);
  }

  //ADD ITEM SUBMIT
  function addItemFunc(e) {
    const input = UICtrl.getInputItem();
    if (input.name !== "" && input.calories !== "") {
      //Add Item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);
      //CLEAR INPUT FIELDS

      UICtrl.clearInputs();
    }
    e.preventDefault();
  }

  //PUBLIC METHODS (ANYTHING IN THE RETURN STATEMENT IS PUBLIC)
  return {
    init() {
      const items = ItemCtrl.getItems();
      //Populate List with items
      UICtrl.populateItemList(items);
      // Load Event listeners
      loadEventListener();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
