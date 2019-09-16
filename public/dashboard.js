let global = null;

function getData() {
  $.get('/api/data', (data) => {
    console.log(data);
    global = data;
    data.users.forEach(item => $('#user-group').append(`
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${item.name}</li>
        </ul>
    `));

    data.books.forEach(item => $('#book-group').append(`
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${item.name}</li>
        </ul>
    `));

    data.list.forEach(item => {
      const username = data.users.find(user => item.userId === user.id).name;
      const bookname = data.books.find(book => book.id === item.bookId).name;
      $('#borrowlist-group').append(`
        <ul class="list-group list-group-horizontal" id="relation-list-${item.id}">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${username}</li>
          <li class="list-group-item flex-fill ">${bookname}</li>
          <li class="list-group-item flex-fill ">
            <button type="button" class="btn btn-danger" id="delete-relation-${item.id}">Delete</button>
            <button type="button" class="btn btn-warning" id="edit-relation-${item.id}">Edit</button>
          </li>
        </ul>
      `);
    });

    data.list.forEach(item => {
      $(`#delete-relation-${item.id}`).click(() => {
        deleteRelation(item);
      });
      $(`#edit-relation-${item.id}`).click(() => {
        editRelation(item);
      });
    })

  });
};


getData();

const addingUserForm = document.getElementById('add-user');
const addingBookForm = document.getElementById('add-book');
const editRationForm = $('#edit-relation');
editRationForm.hide();

addingUserForm.onsubmit = function(event) {
  event.preventDefault();
  const userId = $("#user-id").val();
  const username = $("#user-name").val();
  $.ajax({
    type: "POST",
    url: '/api/user',
    data: {
      username,
      userId,
    },
    success: (item) => {
      $('#user-group').append(`
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${item.name}</li>
        </ul>
    `)
    },
  }).done(() => {
  }).fail(e => {
  });
};


addingBookForm.onsubmit = function(event) {
  event.preventDefault();
  const bookId = $("#book-id").val();
  const bookname = $("#book-name").val();
  $.ajax({
    type: "POST",
    url: '/api/book',
    data: {
      bookId,
      bookname,
    },
    success: (item) => {
      $('#book-group').append(`
        <ul class="list-group list-group-horizontal">
          <li class="list-group-item flex-fill ">${item.id}</li>
          <li class="list-group-item flex-fill ">${item.name}</li>
        </ul>
    `)
    },
  }).done(() => {
  }).fail(e => {
  });
};

editRationForm.submit((event) => {
  event.preventDefault();
  console.log(global);
  editRationForm.hide();
  $.ajax({
    type: 'PUT',
    url: '/api/relation',
    data: {
      id: $('#relation-id').val(),
      userId: $('#relation-user-id').val(),
      bookId: $('#relation-book-id').val(),
    },
    success: () => {
      window.location.reload();
    },
  })
});


function deleteRelation(item) {
  console.log(item.id);
  $.ajax({
    type: "DELETE",
    url: '/api/relation',
    data: {
      id: item.id,
    },
    success: () => {
      console.log((`#relation-list-${item.id}`));
      $(`#relation-list-${item.id}`).remove()
    },
  });
}

function editRelation(item) {
  $('#relation-id').val(item.id);
  $('#relation-user-id').val(item.userId);
  $('#relation-book-id').val(item.bookId);
  editRationForm.show();
}
