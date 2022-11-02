const displayListSelector = $('#dipsplay');
const paginateElement = $('.panigate-list');
const templateSelector = $('#template');
const total_record = $('#totalRecord');
let listOptionSort = $('.filter__select--options--sort');
let listOptionActive = $('.filter__select--options--active');
const SORT_DESC = 0;
const SORT_ASC = 1;
const msg = "Không có sản phẩm!";
const sortOld = 'latest_update_at';
const sortNew = '-latest_update_at';
let TOTAL_RECORD = 0;
let listData = [];
let page_size = 15;          // số sản phẩm trong 1 page
let page = 1;
let offset = 0;           // số trang
let query = '';
let sort = '';
let is_active = '';
let totalPage = 0;
const tokenString = '20|dx6hz9hEwfc9e23aavPeHXAy7Oh9risCPSbnqfBO';

function changeLimitPaginate() {
    $('#input__paginate').on('change', () => {
        page_size = $("#input__paginate option:selected").val();
        paginateElement.empty();
        page = 1;
        fetchData(page_size);
    })
}

function displayList(data) {
    console.log('Display list data', data);
    displayListSelector.empty();
    if (data.length <= 0) {
        const template = templateSelector.clone();
        template.removeClass('d-none');
        template.find('.checkboxs').remove();
        template.find('.js__icon').remove();
        template.find('.phone_number').text(msg);
        template.find('.phone_number').addClass("msg");
        displayListSelector.append(template);

    } else {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const template = templateSelector.clone();
            template.removeClass('d-none');
            template.attr('name', item.name);
            template.attr('id', item.id);
            template.find('.user__name').text(item.username);
            template.find('.name').text(item.name);
            template.find('.phone_number').text(item.phone_number);
            item.gender == 1 ? template.find('.gender').text('Nam') : template.find('.gender').text('Nữ');
            item.is_active == 1 ? template.find('.is_active').text('Đang hoạt động') : template.find('.is_active').text('Ngừng hoạt động');
            template.find('.checkboxx').attr('id', item.id);
            template.find('.js__avatar').attr('src', item.avatar);
            template.find('.checkboxx').attr('name', 'checkbox');
            template.find('.checkboxx').attr('data-id', item.id);
            template.find('.remove').attr('id', item.id);
            template.find('.a_edit').attr('href', `edit.html?id=${item.id}`);
            displayListSelector.append(template);
        }
        showChecked();
    }
}

function setPagination(item, wrapper, page_size) {
    console.log('page size:', page_size);
    if (item.total >= 1) {
        totalPage = Math.ceil(item.total / +page_size);
        paginateElement.empty();
        paginateElement.append('<li class="prev">&#60;</li>');
        for (let i = 0; i < totalPage; i++) {
            let li = document.createElement('li');
            li.classList.add('page');
            if (i + 1 == page) {
                $('.panigate-list li').removeClass('active');
                li.classList.add("active");
            } else if (i == 0) {
                $('.panigate-list li').removeClass('active');
                li.classList.add("active");
            }
            li.textContent = i + 1;
            wrapper.append(li);
        }
        paginateElement.append('<li class="next">&#62;</li>');
    } else {
        paginateElement.empty();
    }
}

function fetchData(page_size, isSetPagination = true) {
    const params = setURL();
    $.ajax({
        type: 'GET',
        dataType: "json",
        url: `http://training.mumesoft.com/api/users${params}`,
        success: function (data, status, xhr) {
            listData = data.data;
            if (isSetPagination) {
                setPagination(data, paginateElement, page_size);
            }
            total_record.text(TOTAL_RECORD = data.total);
            displayList(data.data);
        },
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + tokenString); }
    });
}

function removeItem(ids) {
    console.log('ids', ids.length);
    if (!window.confirm('Bạn chắc chắn xóa!')) return;
    let url = `http://training.mumesoft.com/api/users?ids=${ids}`;
    $.ajax({
        url: url,
        type: "DELETE",
        success: (data) => {
            let arrChecked = isChecked();
            const listTr = $('#dipsplay tr[name]');

            if (listTr.length > 1) {
                for (let id of arrChecked) {
                    let removeInput = $(`tr[id=${id}]`);
                    removeInput.remove();
                }
                TOTAL_RECORD -= arrChecked.length;
                total_record.text(TOTAL_RECORD);
            }

            if (listTr.length > 1) {
                if (ids.length > 1) {
                    for (let id of ids) {
                        let removeInput = $(`tr[id=${id}]`);
                        removeInput.remove();
                        TOTAL_RECORD -= arrChecked.length;
                        total_record.text(TOTAL_RECORD);
                    }
                } else {
                    let removeInput = $(`tr[id=${ids}]`);
                    removeInput.remove();
                    TOTAL_RECORD -= arrChecked.length;
                    total_record.text(TOTAL_RECORD);
                }
            }


            let newlist = $('tr[name]');
            if (newlist.length <= 1) {
                page--;
                fetchData(page_size, true);
                displayListSelector.html('<h3 id="message">Không còn sản phẩm nào !</h3>')
            }

            fetchData(page_size, true);
            console.log('data', data);
            $('#selectAll').prop("checked", false);
            $('#quantityRemove').text('')
            showChecked();
        },
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + tokenString); },
        error: () => {
            console.log('errors');
        }
    })
}

function searchItem() {
    $(document).on('click', '#btn-search', function () {
        applySearch();
    })
    $(document).on('keypress', '#input--search', function (e) {
        if (e.which == 13) {
            applySearch();
        }
    })
}

function applySearch() {
    query = $.trim($('#input--search').val());
    page = 1;
    fetchData(page_size, true);
}

// filter mới nhất theo ngày tạo
function filterItem() {
    $('#filter__select').on('change', () => {
        const selectVal = $("#filter__select option:selected").val();
        sort = selectVal;
        console.log(selectVal);
        fetchData(page_size);
    })
}

//filter theo trạng thái hoạt động
function filterActive() {
    $('#filter__select--acitve').on('change', function () {
        const selectVal = $("#filter__select--acitve option:selected").val();
        page = 1;
        is_active = selectVal;
        fetchData(page_size, true);
    })
}

//LOCAL ====================
let menuList = [
    { id: 1, content: "USER" },
    { id: 2, content: "CATEGORY" }
]

//show menu
function showMenu() {
    const menu = document.querySelector('#nav-menu');
    let menuItem = menuList.map(item => `<li class="nav-menu--item" id="${item.content}"><a href="index.html" class="nav-menu--item__a text-decoration-none">${item.content}</a></li>`)
    menu.innerHTML = menuItem.join('');
}


function isChecked() {
    let checked = [];
    const checkboxs = $("input[name=checkbox]");
    for (checkbox of checkboxs) {
        if (checkbox.checked) {
            checked.push($(checkbox).attr('id'));
            console.log('checked', checked);
            if (checked.length === checkboxs.length) {
                $("#selectAll").prop("checked", true);
            } else {
                $("#selectAll").prop("checked", false);
            }
        }
    }
    return checked;
}

function showChecked() {
    if (isChecked().length <= 0) {
        $('#quantityRemove').text('');
    } else {
        let checked = isChecked().length;
        $('#quantityRemove').text(checked + ' checked');
    }
}

function setURL() {
    let url = `?page_size=${page_size}&page=${page}`;
    if (query) {
        url += `&query=${query}`;
    }
    if (is_active) {
        url += `&is_active=${is_active}`;
    }
    if (sort) {
        url += `&sort=${sort}`;
    }

    window.history.replaceState(null, null, url);
    return url;
}

//select all checkbox
$(document).on('click', '#selectAll', function () {
    $("input[name=checkbox]").prop("checked", $(this).prop("checked"));
    showChecked();
});

$(document).on('click', 'input[name=checkbox]', function () {
    if (!$(this).prop("checked")) {
        $("#selectAll").prop("checked", false);
    }
    isChecked();
    showChecked();
});

//remove flo checkbox
$(document).on('click', '#btnMultiple', () => {
    const ids = isChecked();
    let arrChecked = isChecked();
    if (arrChecked.length == 0) {
        alert('bạn vẫn chưa chọn');
        return;
    }
    removeItem(ids);
});

//romve flo icon
$(document).on('click', '.remove[id]', function () {
    const id = $(this).attr("id");
    removeItem(id);
})

$(document).on('click', '.page', function () {
    $('.panigate-list li').removeClass('active');
    page = $(this).text();
    page = $(this).text();
    fetchData(page_size, false);
    $(this).addClass('active');
})

$(document).on('click', '.prev', function () {
    if (page == 1) return;
    $('.panigate-list li').removeClass('active');
    page--;
    $('.panigate-list li.page').each((i, li) => {
        if (li.textContent == page) {
            li.classList.add('active');
            fetchData(page_size, false);
        }
    });
})

$(document).on('click', '.next', function () {
    if (page >= Math.ceil(TOTAL_RECORD / page_size)) return;
    $('.panigate-list li').removeClass('active');
    page++;
    $('.panigate-list li.page').each((i, li) => {
        if (li.textContent == page) {
            li.classList.add('active');
            fetchData(page_size, false);
        }
    })
})

$(document).ready(function () {
    showMenu();
    let keyValues = window.location.search;
    let urlParams = new URLSearchParams(keyValues);
    if (keyValues) {
        if (urlParams.get('page_size')) {
            page_size = urlParams.get('page_size');
            $('#input__paginate').val(page_size);
        }
        if (urlParams.get('page')) {
            page = urlParams.get('page');
        }
        if (urlParams.get('query')) {
            query = urlParams.get('query');
            $('input[id=input--search]').val(query)
        }

        if (urlParams.get('sort')) {
            sort = $.trim(urlParams.get('sort'));
            sort = sort == sortNew ? sort : '+' + sort;
            $('#filter__select').val(sort);
        }

        if (urlParams.get('is_active')) {
            is_active = urlParams.get('is_active');
            is_active = is_active != '' ? is_active : '';
            $('#filter__select--acitve').val(is_active)
        }

        fetchData(page_size, true);
    } else {
        page_size = 15;
        fetchData(page_size, true);
    }

    filterActive();

    filterItem();

    searchItem();

    changeLimitPaginate();
})
