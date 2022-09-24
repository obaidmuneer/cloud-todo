let item = document.querySelector('#item')
let courseItem = document.querySelector('#courseItem')
let result = document.querySelector('#result')
let addBtn = document.querySelector('#addBtn')
let todo = document.querySelector('#todo')

let todoItems = {}

function addCourse() {
    if (!courseItem.value) {
        return
    }
    localStorage.setItem('course', courseItem.value)
    axios.post('http://localhost:8080/courses', {
        course: courseItem.value
    })
        .then((res) => {
            showItems(res.data.data[courseItem.value].items)
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
            console.log(res.data.data);
            showItems(res.data.data[courseItem.value].items)
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
    index > -1 ? update(index) : postItem(courseItem.value, todoItem)
    item.value = ''
}

function postItem(course, todoItem) {
    axios.post('http://localhost:8080/todoItem', {
        todoItem,
        course
    })
        .then((res) => {
            showItems(res.data.data[courseItem.value].items)
        })
}


function showItems(items) {
    let data = items.filter((item) => item.id !== 1664045378368)
    console.log(data);
    result.innerHTML = ''

    items.map((item, index) => {
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

function update(index) {
    list[index] = item.value
    formSetting()
}

function editItem(index) {
    item.value = list[index]
    formSetting(index)
}

function dltItem(index) {
    list.splice(index, 1)
    showItems()
}