window.onload = () => {

    const form = funkShared('form'),
        btn = form[6],
        overlay = funkShared(".overlay"),
        question = funkShared('.main__link'),
        formInputs = document.querySelectorAll('input'),
        title = funkShared('.title');

    function funkShared (element) {
        const result = document.querySelector(element) || document.getElementById(element);
        return result;
    }

    function handleInputChange(event) {
        const input = event.target;
        if (input.value !== '') {
            input.style.borderColor = "blue";
        } else {
            input.style.borderColor = "";
        }
    }

    function formInputsDefaultBorder() {
        formInputs.forEach(input => {
            input.style.borderColor = "";
        });
    }

    function overlayToggle() {
        overlay.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
    }

    function changePage () {
        title.innerText = "Log in to the system";
        form[5].parentElement.remove();
        form[4].parentElement.remove();
        form[2].parentElement.remove();
        form[0].parentElement.remove();
        btn.innerText = "Sign In";
        question.innerText = "Registration";
        question.removeEventListener('click', changePage);
        question.addEventListener('click', ()=> {
            location.reload();
        });

        formInputsDefaultBorder();

        btn.removeEventListener('click', formValidated);

        btn.addEventListener('click', formValidatedSignInPage);
    }

    function accountPage (object) {

        btn.removeEventListener('click', formValidatedSignInPage);

        title.innerText = "Welcome " + object.name + "!";
        btn.innerText = "Exit";
        form[1].parentElement.remove();
        form[0].parentElement.remove();
        question.remove();
        document.querySelector('.descr').remove();

        btn.addEventListener('click', ()=> {
            location.reload();
        });
    }

    function redirectToLogin() {
        form.reset();
        overlayToggle();
        funkShared("modal-button").onclick = () => {
            overlayToggle();
        }
        funkShared(".modal__close").onclick = () => {
            overlayToggle();
        }
        changePage ();
    }

    function errorMessageRemove () {
        let errorMessage = document.querySelectorAll('.error-message');
        errorMessage.forEach(item => {
            item.remove();
        });
    }

    function formValidated (e) {
        e.preventDefault();
        let flag = false;
        errorMessageRemove ();
        if (!form[0].value) {
            errorTextHtml (form[0], 'Заполните поле Full Name');
            flag = true;
        }
        if (!form[1].value) {
            errorTextHtml (form[1], 'Заполните поле Username');
            flag = true;
        }
        if (!form[2].value) {
            errorTextHtml (form[2], 'Заполните поле E-mail');
            flag = true;
        } else if (!form[2].value.match(/.+@.+\..+/i)) {
            errorTextHtml (form[2], 'Некорректный E-mail');
            flag = true;
        }
        if (!form[3].value) {
            errorTextHtml (form[3], 'Заполните поле password');
            flag = true;
        } else if (!form[3].value.match(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/)) {
            errorTextHtml (form[3], 'Поле должно быть длиной от 8 символов и содержать хотя бы одну букву в верхнем регистре, одну цифру и один спецсимвол');
            flag = true;
        }
        if (!form[4].value) {
            errorTextHtml (form[4], 'Повторите ваш пароль');
            flag = true;
        } else if (!(form[3].value === form[4].value)) {
            errorTextHtml (form[4], 'Поле не совпадает с полем Password!');
            flag = true;
        }
        if (!form[5].checked) {
            errorTextHtml (form[5].closest('.form__checkbox'), 'Вы не согласились с политикой конфеденциальности!');
            flag = true;
        }

        if (!flag) {
            let clients = localStorage.getItem('clients'),
                clientsArray = [];
            if (clients) {
                clientsArray = JSON.parse(clients);
            }
            clientsArray.push({
                name: form[0].value,
                username: form[1].value,
                email: form[2].value,
                password: form[3].value,
            });
            localStorage.setItem('clients', JSON.stringify(clientsArray));

            redirectToLogin();
        }

    }

    function formValidatedSignInPage (e) {
        e.preventDefault();
        let flag = false;
        errorMessageRemove ();
        if (!form[0].value) {
            errorTextHtml (form[0], 'Заполните поле Username');
            flag = true;
        }
        if (!form[1].value) {
            errorTextHtml (form[1], 'Заполните поле Password');
            flag = true;
        }

        if (!flag && form[0].value && form[1].value) {
            let clients = localStorage.getItem('clients'),
                clientsArray = [];

            if (clients) {

                clientsArray = JSON.parse(clients);
                let client = clientsArray.find( function (item) {
                    return item.username === form[0].value;
                });
                if (!client || client.username !== form[0].value) {
                    errorTextHtml (form[0], 'Такой пользователь не зарегистрирован');
                }
                else if (client.password !== form[1].value || undefined) {
                    errorTextHtml (form[1], 'Неверный пароль');
                } else {
                    accountPage (client);
                }

            } else {
                errorTextHtml (form[0], 'Такой пользователь не зарегистрирован');
            }
        }
    }

    function errorTextHtml (element, string) {
        let span = document.createElement('span');
        span.innerText = string;
        span.className = "error-message"
        element.after(span);
        element.style.borderColor = "red";
    }

    formInputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
    });

    form[0].addEventListener('keydown', (e) => {
        if (/[^a-zа-я\s]/i.test(e.key)) {
            e.preventDefault();
        }
    });

    form[1].addEventListener('keydown', (e) => {
        if (/[^0-9a-zа-я_-]/i.test(e.key)) {
            e.preventDefault();
        }
    })

    form[5].addEventListener('change', (e) => {
        e.target.checked ? console.log("Согласен") : console.log("НЕ согласен");
    });

    btn.addEventListener('click', formValidated);

    question.addEventListener('click', changePage);
    
}