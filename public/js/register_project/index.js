const registerProjectForm = document.getElementById('registerProjectForm');


const requiredErrorText = {
    name: 'Project name is required.',
    objective: 'Project objective is required.',
    description: 'Project description is required.',
    domain_expertise: 'Select an option.',
    technical_expertise: 'Select an option.',
    git_repo: {
        required  : true,
        errorText1: 'Repo name is required.',
        errorText2: 'Repo URL is required.',
    },
    mailing_list: {
        errorText1: 'List name is required.',
        errorText2: 'Subscribe URL is required.',
    },
    more_info: {
        errorText1: 'Title is required.',
        errorText2: 'URL is required.',
    }
}


const invalidErrorText = {
    name: 'This project name is already registered.',
    website: 'Invalid URL.',
    git_repo: {
        invalidText2: 'Invalid repo URL.'
    },
    mailing_list: {
        invalidText2: 'Invalid subscribe URL.'
    },
    more_info: {
        invalidText2: 'Invalid URL.'
    }
}

var validity = {}

window.onload = function() {
    validity = checkFormValidity();
};

handleOnSelectDropdownOption('domain_expertise');
handleOnSelectDropdownOption('technical_expertise');


registerProjectForm.addEventListener('submit', function (event) {
    var focusInvalidInput = null;
    
    for(var input in validity) {
        if(!validity[input] && !focusInvalidInput) {
            focusInvalidInput = input;
            break;
        }
    }

    if(focusInvalidInput) {
        event.preventDefault();
        document.getElementById(focusInvalidInput).focus();
    }

    for(var input in validity) {
        if(!validity[input]) {
            if(typeof requiredErrorText[input] === 'object') { showErrorMessageForInputGroup(input) }
            else { showErrorMessageForInput(input) }
        }
    }
})


function checkFormValidity() {
    const validity = {
        name: validateProjectName(document.getElementById('name').value),
        objective: validateInput('objective'),
        description: validateInput('description'),
        website: validateInput('website', 'keyup', validateURL),
        domain_expertise: validateInput('domain_expertise', 'click'),
        technical_expertise: validateInput('technical_expertise', 'click'),
        git_repo: validateDynamicInputGroup('git_repo', true),
        mailing_list: validateDynamicInputGroup('mailing_list'),
        more_info: validateDynamicInputGroup('more_info')
    }
    return validity;
}


function validateInput (id, event = 'keyup', validator = null) {
    const input = document.getElementById(id);
    const helper = document.getElementById(id + '-helper');
    const helperText = helper.textContent;

    input.addEventListener(event, () => {
        if(input.value) {
            if(validator && !validator(input.value)) {
                helper.textContent = invalidErrorText[id];
                helper.classList.add('error');
                validity[id] = false;
            }
            else {
                helper.textContent = helperText;
                helper.classList.remove('error');
                validity[id] = true;
            }
        }
        else {
            if(requiredErrorText[id]) {
                helper.textContent = requiredErrorText[id];
                helper.classList.add('error');
                validity[id] = false;
            }
            else {
                helper.textContent = helperText;
                helper.classList.remove('error');
                validity[id] = true;
            }
        }
    })

    const _checkValidity = (validator) => {
        if(input.value) {
            if(validator && !validator(input.value)) { return false }
            else { return true }
        }
        else {
            if(requiredErrorText[id]) { return false }
            else { return true }
        }
    }

    return _checkValidity(validator);
}


function handleOnSelectDropdownOption (id) {
    const element = document.getElementById(id + '-dropdown');
    const helper = document.getElementById(id + '-helper');
    const optionsList = element.querySelectorAll(".option");
    const selectedText = element.querySelector(".md-form").querySelector(".form-control");

    optionsList.forEach((option) => {
        option.addEventListener("click", () => {
          selectedText.classList.remove("error");
          helper.textContent = null;
          validity[id] = true;
        });
    });
}


function validateDynamicInputGroup (id, required = false) {
    const container = document.getElementById(id);
    const inputs = container.getElementsByTagName('input');
    const helpers = container.getElementsByTagName('span');

    const _setupEventListeners = () => {
        inputs.forEach((input, index) => {
            input.addEventListener("keyup", () => {
                const helper = helpers[index];

                if(index % 2 === 0 && !input.value) {
                    if(inputs[index + 1].value) {
                        helper.textContent = requiredErrorText[id].errorText1;
                        helper.classList.add('error');
                    }
                    else if(index) {
                        helper.textContent = null;
                        helper.classList.remove('error');
                        helpers[index + 1].textContent = null;
                        helpers[index + 1].classList.remove('error');
                    }
                }
                else if(index % 2 === 1 && !input.value) {
                    if(inputs[index - 1].value) {
                        helper.textContent = requiredErrorText[id].errorText2;
                        helper.classList.add('helper-text-no-icon');
                        helper.classList.add('error');
                    }
                    else if(index - 1) {
                        helper.textContent = null;
                        helper.classList.remove('error');
                        helpers[index - 1].textContent = null;
                        helpers[index - 1].classList.remove('error');
                    }
                }
                else if(index % 2 === 1 && input.value && !validateURL(input.value)) {
                    helper.textContent = invalidErrorText[id].invalidText2;
                    helper.classList.add('helper-text-no-icon');
                    helper.classList.add('error');
                }
                else {
                    helper.textContent = null;
                    helper.classList.remove('error');
                }

                if(required && !index && !input.value && !inputs[index + 1].value) {
                    helper.textContent = requiredErrorText[id].errorText1;
                    helper.classList.add('error');
                    helpers[index + 1].textContent = requiredErrorText[id].errorText2;
                    helpers[index + 1].classList.add('error');
                    helpers[index + 1].classList.add('helper-text-no-icon');
                }

                validity[id] = _checkValidity(inputs, required);
            })
        });
    }

    const _checkValidity = (inputs, required) => {
        var _validity = true;

        try {
            inputs.forEach((input, index) => {
                if(index === 0 && required && !input.value && !inputs[index + 1].value) {
                    throw 'InvalidException';
                }
                else if(index % 2 === 0 && ((input.value && !inputs[index + 1].value) || (!input.value && inputs[index + 1].value))) {
                    throw 'InvalidException';
                }
            })
        }
        catch (exception) {
            _validity = false;
        }

        return _validity;
    }

    _setupEventListeners();

    container.addEventListener("DOMNodeInserted", () => { _setupEventListeners() });

    return _checkValidity(inputs, required);
}


function showErrorMessageForInput (id) {
    const helper = document.getElementById(id + '-helper');

    if(invalidErrorText[id] && document.getElementById(id).value.trim()) {
        helper.textContent = invalidErrorText[id];
    }
    else {
        helper.textContent = requiredErrorText[id];
    }

    helper.classList.add('error');
}


function showErrorMessageForInputGroup (id) {
    const container = document.getElementById(id);
    const inputs = container.getElementsByTagName('input');
    const helpers = container.getElementsByTagName('span');

    inputs.forEach((input, index) => {
        const helper = helpers[index];

        if(index % 2 === 0 && !input.value && inputs[index + 1].value) {
            helper.textContent = requiredErrorText[id].errorText1;
            helper.classList.add('error');
        }
        else if(index % 2 === 1 && !input.value && inputs[index - 1].value) {
            helper.textContent = requiredErrorText[id].errorText2;
            helper.classList.add('helper-text-no-icon');
            helper.classList.add('error');
        }

        if(requiredErrorText[id].required && !index && !input.value && !inputs[index + 1].value) {
            helper.textContent = requiredErrorText[id].errorText1;
            helper.classList.add('error');
            helpers[index + 1].textContent = requiredErrorText[id].errorText2;
            helpers[index + 1].classList.add('error');
            helpers[index + 1].classList.add('helper-text-no-icon');
        }
    })
}


function validateURL (url) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+         // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+    // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+                          // ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+                      // port
    '(\\?[;&amp;a-z\\d%_.~+=-]*)?'+                         // query string
    '(\\#[-a-z\\d_]*)?$','i');

    return pattern.test(url);
}