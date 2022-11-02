const messageUserName = $('#message__username');
const messageName = $('#message__name');
const messageEmail = $('#message__email');
const messagePhoneNumber = $('#message__phone_number');
const messagePassword = $('#message__password');
const messageRePassword = $('#message__re-password');
const listUser = [];
let username = '';
let name = '';
let email = '';
let avatar = {};
let gender = "";
let phoneNumber = "";
let password = "";
let rePassword = "";
let is_active = 1;
let role_id = 2;
const tokenString = '20|dx6hz9hEwfc9e23aavPeHXAy7Oh9risCPSbnqfBO';

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

function AddData() {
    $('#btn__add').on("click", function (event) {
        event.preventDefault();

        let dataForm = getDataForm();
        if (!isFormValid()) return;

        let fd = new FormData();
        for (const [key, value] of Object.entries(dataForm)) {
            fd.append(key, value);
        }

        let url = 'http://training.mumesoft.com/api/users';
        $.ajax({
            method: 'POST',
            dataType: 'JSON',
            data: fd,
            url: url,

            cache: false,
            processData: false,
            contentType: false,
            success: (res) => {
                console.log(res);
                alert(res.msg);
                name = '';
                // setTimeout(() => {
                //     location.href = 'index.html'
                // }, 2000);

            },
            beforeSend: function (xhr, settings) { xhr.setRequestHeader('Authorization', 'Bearer ' + tokenString); },
            error: (req, status, err) => {
                console.log("err", err);
                if (req.responseJSON.data) {
                    if (req.responseJSON.data.username) {
                        let reqMessageUser = req.responseJSON.data.username[0];
                        messageUserName.text(reqMessageUser);
                    }
                    if (req.responseJSON.data.name) {
                        let reqMessageName = req.responseJSON.data.name[0];
                        messageName.text(reqMessageName);
                    }
                    if (req.responseJSON.data.password) {
                        let reqMessagePassword = req.responseJSON.data.password[0];
                        messagePassword.text(reqMessagePassword);
                    }
                    if (req.responseJSON.data.password_confirmation) {
                        let reqMessageRePassword = req.responseJSON.data.password_confirmation[0];
                        messageRePassword.text(reqMessageRePassword);
                    }
                    if (req.responseJSON.data.phone_number) {
                        let reqMessagePhone = req.responseJSON.data.phone_number[0];
                        messagePhoneNumber.text(reqMessagePhone);
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

    if (password == '') {
        messagePassword.text('yêu cầu không bỏ trống !');
        isFormValid = false;
    }

    if (name == '') {
        messageName.text('yêu cầu không bỏ trống !');
        isFormValid = false;
    }

    if (rePassword == '') {
        messageRePassword.text('yêu cầu không bỏ trống !');
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

function getDataForm() {
    username = $('input[name=username]').val();
    password = $('input[name=password]').val();
    rePassword = $('input[name=re-password]').val();
    name = $('input[name=name]').val();
    email = $('input[name=email]').val();
    phoneNumber = $('input[name=phoneNumber]').val();
    birthday = $('input[name=birthday]').val();
    gender = $("input[name='gender']:checked").val();
    is_active = +$("input[name=active]:checked").val();

    // show img 
    $('input[type="file"]').on('change', (e) => {
        if ($('input[type="file"]').val() != null && $('input[type="file"]').val() != '') {
            const fr = new FileReader()
            fr.addEventListener("load", function (evt) {
                $("#avatar").attr("src", evt.target.result);
            });
            fr.readAsDataURL(e.target.files[0]);
        } else {
            $('#avatar').attr('src', 'https://cdn.questionpro.com/userimages/site_media/no-image.png');
        }

    })
    if ($('input[type="file"]').prop('files')[0]) {
        avatar = $('input[type="file"]').prop('files')[0];
    } else {
        avatar = null;
    }

    avatar == {} || avatar == null || avatar == undefined ?
        user = {
            username,
            password,
            password_confirmation: rePassword,
            name,
            birth_date: birthday,
            phone_number: phoneNumber,
            email,
            gender,
            is_active,
            role_id
        }
        :
        user = {
            username,
            password,
            password_confirmation: rePassword,
            name,
            birth_date: birthday,
            phone_number: phoneNumber,
            email,
            gender,
            is_active,
            role_id,
            avatar
        }


        console.log(user);
    return user;
}

function resetForm() {
    $('input[name=username]').val('');
    $('input[name=name]').val('');
    $('input[name=email]').val('');
    $('input[name=birthday]').val('');
    $('input[name=phoneNumber]').val('');
    $('input[type=file]').val('');
    $('#avatar').attr('src', 'https://cdn.questionpro.com/userimages/site_media/no-image.png');
    $('input[type=password]').val('');
    $('input[value="1"]').prop('checked', true);
    $('input[id=flexRadioDefault2]').prop('checked', true);
    messageName.text('');
    messageUserName.text('');
    messageEmail.text('');
    messagePhoneNumber.text('');
    messagePassword.text('');
    messageRePassword.text('');
}

// validation disable btn submit 
function isDisabled(status) {
    $('#btn__add').prop('disabled', status);
}

function checkDisabled() {
    let status = true;
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

$(document).on('click', '#reset', (e) => {
    e.preventDefault();
    resetForm();
})

$(document).ready(() => {
    showMenu();

    getDataForm();

    AddData();

    handleValidate();

    checkDisabled();
})

