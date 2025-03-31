// alert("Hello !!!");
// alert("Welcome to your todo List!!!");

const form = document.querySelector(".form");
const add = document.getElementById("add");
const todoContainerUl = document.querySelector("#todo");
const h1 = document.querySelector("h1");
const taskArea = document.querySelector(".taskArea");
// localStorage.setItem("tasks",JSON.stringify([]));
let localStorageTasks = JSON.parse(localStorage.getItem("tasks")) || [];

h1.classList.add("centerText");
form.classList.add("formStyle");
taskArea.classList.add("taskSection");
form.addEventListener('submit', addList);

fromLocalStorage();

function addTemplate(todo,...flag) {

    const template = document.querySelector("template");
    const newList = template.content.cloneNode(true);

    let todoList = newList.querySelector(".todoList");

    const span = document.createElement("span");
    span.textContent = todo;

    // const textField = document.createElement("input");
    // textField.type = "text";
    // textField.value = todo;
    // textField.style.border = 0;
    // textField.readOnly = true;
    
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";    
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    todoList.appendChild(span);
    todoList.appendChild(editBtn);
    todoList.appendChild(deleteBtn);
    todoList.appendChild(checkBox);

    todoContainerUl.appendChild(todoList);
    
    if(flag.length == 0){
        localStorageTasks.push(todo);
        localStorage.setItem("tasks",JSON.stringify(localStorageTasks));
    }

    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        span.contentEditable = true;
        span.addEventListener('keydown',(e)=>{
            if(e.key == 'Enter')
                e.preventDefault();
        });
    });

    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let yesOrNo = confirm("Do you want to delete the task?");
        if (yesOrNo) {
            let task = e.target.parentNode.children[0].textContent;
            let index = localStorageTasks.indexOf(task);
            if(index != -1){
                localStorageTasks.splice(index,1);
                localStorage.setItem("tasks",JSON.stringify(localStorageTasks));
            }
            e.target.parentNode.remove();            
        }
    });
    checkBox.addEventListener('change',(e)=>{
        e.preventDefault();
        if(checkBox.checked)
            span.style.textDecoration = "line-through";
        else
            span.style.textDecoration = "none";
    });
}

function addList(e) {
    e.preventDefault();
    const task = document.getElementById("task");
    addTemplate(task.value);
    form.reset();
}

function fromLocalStorage(){
    localStorageTasks.forEach(element => {
       addTemplate(element,true); 
    });
}

