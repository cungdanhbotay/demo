const messageUserName = $('#message__username');
const messageName = $('#message__name');
const messageEmail = $('#message__email');
const messagePhoneNumber = $('#message__phone_number');
let user = {};
let username = '';
let name = '';
let email = '';
let gender = "";
let phoneNumber = "";
let avatar = {};
let is_active = 1;
let role_id = 2;
const tokenString = '20|dx6hz9hEwfc9e23aavPeHXAy7Oh9risCPSbnqfBO';
const avt = 'https://cdn.questionpro.com/userimages/site_media/no-image.png';

let menuList = [
    { id: 1, content: "USER" },
    { id: 2, content: "CATEGORY" }
]

//show menu
function showMenu() {
    const menu = document.querySelector('#nav-menu');
    let menuItem = menuList.map(item => `<li class="nav-menu--item" id="${item.content}"><a href="./listUser.html" class="nav-menu--item__a text-decoration-none">${item.content}</a></li>`)
    menu.innerHTML = menuItem.join('');
}

function getUser(id) {
    const url = `http://training.mumesoft.com/api/users/${id}`;
    $.ajax({
        method: 'GET',
        dataType: "json",
        url: url,
        success: (data) => {
            user = data.data;
            showData(user);
            console.log('data server:', user);
            if (user.avatar) $("#avatar").attr("src", user.avatar);
        },
        beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + tokenString); }
    })
}

const showData = (data) => {
    $('input[name=username]').val(data.username);
    $('input[name=name]').val(data.name);
    $('input[name=email]').val(data.email);
    $('input[name=birthday]').val(data.birth_date.slice(0, 10));
    $('input[name=phoneNumber]').val(data.phone_number);

    if (data.avatar != null) {
        $('#avatar').prop('src', data.avatar);
        avatar = data.avatar;
        console.log('avatar get api:',avatar);
    } else {
        $('#avatar').prop('src', avt)
    }


    $('input[name="gender"]').each(function () {
        if ($(this).val() == data.gender) {
            $(this).prop('checked', true);
        }
    });
    $('input[name="active"]').each(function () {
        if ($(this).val() == data.is_active) {
            $(this).prop('checked', true);
        }
    })

    $('#reset').on('click', (e) => {
        // showData(data);
        e.preventDefault();
        $('input[name=username]').val(data.username);
        $('input[name=name]').val(data.name);
        $('input[name=email]').val(data.email);
        $('input[name=birthday]').val(data.birth_date.slice(0, 10));
        $('input[name=phoneNumber]').val(data.phone_number);

        if (data.avatar != null) {
            $('#avatar').prop('src', data.avatar);
            console.log('avatar:',avatar);
        } else {
            $('#avatar').prop('src', avt)
        }
        $('input[name="gender"]').each(function () {
            if ($(this).val() == data.gender) {
                $(this).prop('checked', true);
            }
        });
        $('input[name="active"]').each(function () {
            if ($(this).val() == data.is_active) {
                $(this).prop('checked', true);
            }
        })
        messageName.text('');
            messageUserName.text('');
            messageEmail.text('');
            messagePhoneNumber.text('');

    })
}

function EditData(id) {
    $('#btn__add').on("click", function (event) {
        event.preventDefault();
        let dataForm = getDataForm();
        console.log('data form:', dataForm);
        if (!isFormValid()) return;
        let url = `http://training.mumesoft.com/api/users/${id}`;
        $.ajax({
            method: 'PUT',
            dataType: 'JSON',
            data: dataForm,
            url: url,
            success: (res) => {
                console.log(res);
                name = '';
                alert(res.msg);
                // setTimeout(() => {
                //     location.href = 'index.html'
                // }, 2000);
            },
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + tokenString); },
            error: (req, status, err) => {
                console.log("err", err);
                if (req.responseJSON?.data) {
                    if (req.responseJSON.data.username) {
                        let reqMessageUser = req.responseJSON.data.username[0];
                        messageUserName.text(reqMessageUser);
                    }
                    if (req.responseJSON.data.name) {
                        let reqMessageName = req.responseJSON.data.name[0];
                        messageName.text(reqMessageName);
                    }
                }
            }
        });
    });
}

function isFormValid() {
    let isFormValid = true;
    if (username == '') {
        messageUserName.text('yêu cầu không bỏ trống !');
        isFormValid = false;
    }
    console.log('valid', isFormValid);

    if (name == '') {
        messageName.text('yêu cầu không bỏ trống !');
        isFormValid = false;
    }

    if (email == '') {
        messageEmail.text('yêu cầu không bỏ trống !');
        isFormValid = false;
    }

    if (phoneNumber == '') {
        messagePhoneNumber.text('yêu cầu không bỏ trống !');
        isFormValid = false;
    }
    return isFormValid;
}

function handleValidate() {
    //username
    $('input[name="username"]').on('keyup', function () {
        const regexUserName = /^\S+$/;
        const tempUsername = $(this).val();
        if (tempUsername == null) {
            messageUserName.text('Yêu cầu không bỏ trống!');
            return;
        }
        if ($.trim(tempUsername).length < 5) {
            messageUserName.text('Yêu cầu nhập đủ độ dài!');
            return;
        };
        if (!tempUsername.match(regexUserName)) {
            messageUserName.text('Yêu cầu không có khoảng trắng!');
            return;
        }
        if (tempUsername) {
            messageUserName.text('');
        }
    })
    //name ok
    $('input[name=name]').on('keyup', function () {
        const tempName = $(this).val();
        if (tempName == '' || tempName == null) {
            messageName.text('Yêu cầu không bỏ trống!')
            return;
        }
        if (tempName.length < 5) {
            messageName.text('Yêu cầu nhập đủ độ dài!')
            return;
        };
        if (tempName) {

            messageName.text('')
        }
    })
    //password ok
    $('input[name=password]').on('keyup', function () {
        const tempPassword = $(this).val()
        if (tempPassword == '' || tempPassword == '') {
            messagePassword.text('Yêu cầu không bỏ trống!')
            return;
        }
        if ($.trim(tempPassword).length < 5) {
            messagePassword.text('Mật khẩu quá ngắn!')
            return;
        };
        if (tempPassword) {
            messagePassword.text('')
        }
    })
    //re-password ok
    $('input[name=re-password]').on('keyup', function () {
        const tempRePassword = $(this).val();
        if (tempRePassword == '' || tempRePassword == null) {
            messageRePassword.text('Yêu cầu không bỏ trống!')
            return;
        }
        if (tempRePassword !== $('input[name=password]').val()) {
            messageRePassword.text('Mật khẩu không trùng khớp !');
            return;
        }
        if (tempRePassword) {
            messageRePassword.text('')
        }
    })
    // email ok
    $('input[name=email]').on('keyup', function () {
        const tempEmail = $(this).val();
        messageEmail.text('')

        if (tempEmail == '') {
            messageEmail.text('Yêu cầu không bỏ trống!')
            return;
        }
        function validationEmail(email) {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        }
        if (!validationEmail(tempEmail)) {
            messageEmail.text('Yêu cầu nhập đúng định dạng!');
            messageEmail.css('color', 'red');
            return;
        }
    })
    //phonenumber ok
    $('input[name=phoneNumber]').on('keyup', function () {
        const regexPhone = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/;
        const tempPhoneNumber = $(this).val();
        if (tempPhoneNumber == '') {
            messagePhoneNumber.text('Yêu cầu không bỏ trống!')
            return;
        }
        if (!tempPhoneNumber.match(regexPhone)) {
            messagePhoneNumber.text('Yêu cầu nhập đúng định dạng! ');
            return;
        }
        if (tempPhoneNumber) {
            messagePhoneNumber.text('')
        }
    })
}

// nếu k chọn ảnh thì phải dữ nguyên ảnh cũ

function getDataForm() {
    username = $('input[name=username]').val();
    name = $('input[name=name]').val();
    email = $('input[name=email]').val();
    phoneNumber = $('input[name=phoneNumber]').val();

    $('input[type="file"]').on('change', (e) => {
        if ($('input[type="file"]').val() != null && $('input[type="file"]').val() != '') {
            const fr = new FileReader()
            fr.addEventListener("load", function (evt) {
                $("#avatar").attr("src", evt.target.result);
                avatar =  evt.target.result;
            });
            fr.readAsDataURL(e.target.files[0]);
        } else {
            $('#avatar').attr('src',avatar);
        }

    })

    console.log('avt after:',avatar);

    birthday = $('input[name=birthday]').val();
    gender = $("input[name='gender']:checked").val()
    is_active = $("input[name=active]:checked").val();

    user = {
        username,
        avatar,
        name,
        birth_date: birthday,
        phone_number: phoneNumber,
        email,
        avatar,
        gender,
        is_active,
        role_id,
    }

    return user;
}

function isDisabled(status) {
    $('#btn__add').prop('disabled', status);
}

function checkDisabled() {
    let status = false;
    $('input[name=username]').on('keyup', function () {
        if ($(this).val() == '') {
            console.log('không được bỏ trống !');
            status = true;
            isDisabled(status)
        } else {
            if ($('input[name=username]').val() != '' && $('input[name=name]').val() != ''
                && $('input[name=email]').val() != '' && $('input[name=phoneNumber]').val() != '') {
                status = false;
                isDisabled(status)
            }
        }
    })
    $('input[name=name]').on('keyup', function () {
        if ($(this).val() == '') {
            console.log('không được bỏ trống !');
            status = true;
            isDisabled(status)
        } else {
            if ($('input[name=username]').val() != '' && $('input[name=name]').val() != ''
                && $('input[name=email]').val() != '' && $('input[name=phoneNumber]').val() != '') {
                status = false;
                isDisabled(status)
            }
        }

    })
    $('input[name=email]').on('keyup', function () {
        if ($(this).val() == '') {
            console.log('không được bỏ trống !');
            status = true;
            isDisabled(status)
        } else {
            if ($('input[name=username]').val() != '' && $('input[name=name]').val() != ''
                && $('input[name=email]').val() != '' && $('input[name=phoneNumber]').val() != '') {
                status = false;
                isDisabled(status)
            }
        }
    })
    $('input[name=phoneNumber]').on('keyup', function () {
        if ($(this).val() == '') {
            console.log('không được bỏ trống !');
            status = true;
            isDisabled(status)
        } else {
            if ($('input[name=username]').val() != '' && $('input[name=name]').val() != ''
                && $('input[name=email]').val() != '' && $('input[name=phoneNumber]').val() != '') {
                status = false;
                isDisabled(status)
            }
        }
    })
}

$(document).ready(() => {
    let KeysValues = window.location.search;
    let urlParams = new URLSearchParams(KeysValues);

    if (urlParams) {
        const id = urlParams.get('id');
        console.log('id: ', id);
        getUser(id);

        EditData(id);
    }
    getDataForm();

    handleValidate();

    checkDisabled();

    // resetForm();

    showMenu();

})

