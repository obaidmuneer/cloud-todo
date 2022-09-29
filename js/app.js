let addBtn = document.querySelector('#addBtn')
let courseItem = document.querySelector('#courseItem')
let imagefile = document.querySelector('#uploadedFile');
let item = document.querySelector('#item')
let result = document.querySelector('#result')
let todo = document.querySelector('#todo')

let todoItems = {}
let oldItemId;
let api = 'https://faithful-erin-wig.cyclic.app/'
// let api = 'http://localhost:8080/'

function addCourse() {
    if (!courseItem.value) {
        return
    }
    localStorage.setItem('course', courseItem.value)
    axios.post(`${api}courses`, {
        course: courseItem.value
    })
        .then((res) => {
            todoItems = res.data.data
            showItems()
            // console.log(todoItems);
        })
        .catch((err) => {
            console.log(err);
        })

}
function renderItems(items) {
    axios.get(`${api}todoItems`)
        .then((res) => {
            // console.log(res.data.data);
            todoItems = res.data.data
            console.log(todoItems);
            showItems()
        })
        .catch((err) => {
            console.log(err);
        })

}
if (localStorage.getItem('course')) {
    // courseItem.focus()
    courseItem.value = localStorage.getItem('course')
    renderItems()
}

function addItem(index) {
    if (!item.value) {
        return
    }
    const todoItem = {
        text: item.value,
        id: Date.now()
    }
    // console.log(index);
    index > -1 ? updateItem(index) : postItem(courseItem.value, todoItem)
    item.value = ''
}

function fileUpload() {
    let formData = new FormData();
    formData.append("uploadedFile", imagefile.files[0]);
    axios.post(`${api}${courseItem.value}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then((res) => {
            console.log(res.data.data);
            renderItems()
            // document.querySelector('#img').src = res.data.data
        })
        .catch((err) => {
            console.log(err);
        })
}

function postItem(course, todoItem) {
    axios.post(`${api}todoItem`, {
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

    todoItems[courseItem.value].items.reverse().map((item, index) => {
        let edit = item.text ? `<a href="#" onclick="editItem(${index})" class="text-info" data-mdb-toggle="tooltip" title="Edit todo"><i
        class="fas fa-pencil-alt me-3"></i></a>` : ''
        let dlt = `<a href="#" onclick="dltItem(${index})" class="text-danger" data-mdb-toggle="tooltip" title="Delete todo"><i
        class="fas fa-trash-alt"></i></a>`
        let itemdiv;
        if (item.text) {
            itemdiv = `<div class="d-flex align-items-center">
            ${item.text}
          </div>`
        } else {
            itemdiv = `<div class="card img-card">
            <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
              <img src="${api}${courseItem.value}/${item.filename}" class="img-fluid"/>
                <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
            </div>
          </div><br>`
            
        }
        result.innerHTML += `<li data-key="${item.id}"
                class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                ${itemdiv}
                <div class="d-flex flex-row justify-content-end mb-1">
                      ${edit}
                      ${dlt}
                    </div>
              </li>`
    })
}

function formSetting(index) {
    if (index > -1) {
        addBtn.innerHTML = 'Update'
        addBtn.setAttribute('class', 'btn btn-success btn-rounded ms-2')
        todo.onsubmit = function () {
            addItem(index);
            return false
        }
    } else {
        addBtn.innerHTML = 'Add'
        addBtn.setAttribute('class', 'btn btn-primary btn-rounded ms-2')
        todo.onsubmit = function () {
            addItem();
            return false
        }
    }
}

function updateItem() {
    axios.put(`${api}/todoItem/${courseItem.value}/${oldItemId}`, {
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
    item.focus()
    formSetting(index)
}

function dltItem(index) {
    axios.delete(`${api}todoItem/${courseItem.value}/${todoItems[courseItem.value].items[index].id}`)
        .then((res) => {
            todoItems = res.data.data
            showItems()
        })
        .catch((err) => {
            console.log(err.message);
        })
}

function dltAll() {
    axios.delete(`${api}/${courseItem.value}/`)
        .then((res) => {
            console.log(res.data);
            result.innerHTML = ''
        })
}