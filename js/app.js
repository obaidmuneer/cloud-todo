let item = document.querySelector('#item')
let courseItem = document.querySelector('#courseItem')
let result = document.querySelector('#result')
let addBtn = document.querySelector('#addBtn')
let todo = document.querySelector('#todo')

let todoItems = {}
let oldItemId;

function addCourse() {
    if (!courseItem.value) {
        return
    }
    localStorage.setItem('course', courseItem.value)
    axios.post('http://localhost:8080/courses', {
        course: courseItem.value
    })
        .then((res) => {
            todoItems = res.data.data
            showItems()
            // showItems(res.data.data[courseItem.value].items)
            // console.log(todoItems);
        })
        .catch((err) => {
            console.log(err);
        })

}
function renderItems(items) {
    if (localStorage.getItem('course')) {
        courseItem.value = localStorage.getItem('course')
    }
    axios.get('http://localhost:8080/todoItems')
        .then((res) => {
            // console.log(res.data.data);
            todoItems = res.data.data
            showItems()
        })
        .catch((err) => {
            console.log(err);
        })

}
renderItems()

function addItem(index) {
    if (!item.value) {
        return
    }
    const todoItem = {
        text: item.value,
        id: Date.now()
    }
    // console.log(index);
    index > -1 ? update(index) : postItem(courseItem.value, todoItem)
    item.value = ''
}

function postItem(course, todoItem) {
    axios.post('http://localhost:8080/todoItem', {
        todoItem,
        course
    })
        .then((res) => {
            todoItems = res.data.data
            showItems()
        })
}


function showItems() {
    result.innerHTML = ''

    todoItems[courseItem.value].items.map((item, index) => {
        let edit = `<input data-course="${courseItem.value}" class="btn button edit" type="button" onclick="editItem(${index})" value="Edit">`
        let dlt = `<input data-course="${courseItem.value}" class="btn button delete" type="button" onclick="dltItem(${index})" value="Delete">`
        result.innerHTML += `<li data-key="${item.id}" > <div class="list" > ${item.text} </div> ${edit} ${dlt}</li>`
    })
}

function formSetting(index) {
    if (index > -1) {
        addBtn.innerHTML = 'Update'
        todo.onsubmit = function () {
            addItem(index);
            return false
        }
    } else {
        addBtn.innerHTML = 'Add'
        todo.onsubmit = function () {
            addItem();
            return false
        }
    }
}

function update() {
    let api = `http://localhost:8080/todoItem/${courseItem.value}/${oldItemId}`
    axios.put(api, {
        text: item.value
    })
        .then((res) => {
            todoItems = res.data.data
            showItems()
        })
        .catch((err) => {
            console.log(err.response.data.msg);
        })
    formSetting()
}

function editItem(index) {
    item.value = todoItems[courseItem.value].items[index].text
    oldItemId = todoItems[courseItem.value].items[index].id
    // console.log(oldItemId);
    formSetting(index)
}

function dltItem(index) {
    let api = `http://localhost:8080/todoItem/${courseItem.value}/${todoItems[courseItem.value].items[index].id}`
    console.log(api);
    axios.delete(api)
        .then((res) => {
            todoItems = res.data.data
            showItems()
        })
        .catch((err) => {
            console.log(err.message);
        })
}