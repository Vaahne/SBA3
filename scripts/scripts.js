// alert("Hello !!!");
// alert("Welcome to your todo List!!!");

const form = document.querySelector(".form");
const add = document.getElementById("add");
const todoContainer = document.querySelector("#todo");

form.addEventListener('submit',addList);

function addTemplate(todo){

    const template = document.querySelector("template");
    const newList = template.content.cloneNode(true);

    let todoList = newList.querySelector(".todoList");

    todoList.textContent = todo;
    
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";

    todoList.appendChild(checkBox);

    todoContainer.appendChild(todoList);
}

function addList(e){
    e.preventDefault();
    const task = document.getElementById("task");
    addTemplate(task.value);
    form.reset();
}



