
/*************************************************************************************/
/* DYNAMIC HTML CONTROLLED INPUT COMPONANTS
/* CREATING NECESSARY ADD-ONS.
/*********************************************/
function SetComponant(inputComponantBox) {
    let inputComponant = inputComponantBox.querySelector("input") || inputComponantBox.querySelector("select") || inputComponantBox.querySelector("textarea");
    let inputExtButton = inputComponantBox.querySelector("button.ext-btn");
    let inputEyeButton = document.createElement("button");
    inputComponantBox.tabindex = "-1";
    let focusBoxShadow = "inset 0 0 .2em .1em currentcolor, 0 0 .2em .1em currentColor";
    let errorBoxShadow = "inset 0 0 .2em .1em var(--clr-red), 0 0 .2em .1em var(--clr-red)";
    let blurBoxShadow = "0 0 .15em currentColor";
    let hoverBoxShadow = "0 0 .25em .1em currentcolor";
    let Months = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const eyeSVG = `<path fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z" />`;
    const eyeSlashSVG = `<path fill="currentColor" d="M634 471L36 3.51A16 16 0 0 0 13.51 6l-10 12.49A16 16 0 0 0 6 41l598 467.49a16 16 0 0 0 22.49-2.49l10-12.49A16 16 0 0 0 634 471zM296.79 146.47l134.79 105.38C429.36 191.91 380.48 144 320 144a112.26 112.26 0 0 0-23.21 2.47zm46.42 219.07L208.42 260.16C210.65 320.09 259.53 368 320 368a113 113 0 0 0 23.21-2.46zM320 112c98.65 0 189.09 55 237.93 144a285.53 285.53 0 0 1-44 60.2l37.74 29.5a333.7 333.7 0 0 0 52.9-75.11 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64c-36.7 0-71.71 7-104.63 18.81l46.41 36.29c18.94-4.3 38.34-7.1 58.22-7.1zm0 288c-98.65 0-189.08-55-237.93-144a285.47 285.47 0 0 1 44.05-60.19l-37.74-29.5a333.6 333.6 0 0 0-52.89 75.1 32.35 32.35 0 0 0 0 29.19C89.72 376.41 197.08 448 320 448c36.7 0 71.71-7.05 104.63-18.81l-46.41-36.28C359.28 397.2 339.89 400 320 400z"/>`;

    function GetMandatorySpan() {
        let mandatorySpan = document.createElement("span");
        mandatorySpan.classList.add("mandatory");
        mandatorySpan.textContent = "*";
        return mandatorySpan;
    }
    function GetLabelElement() {
        let label = document.createElement("label");
        if (inputComponantBox.children[0].dataset.iconClass !== undefined && inputComponantBox.children[0].dataset.iconClass !== "") {
            let icon = document.createElement("i");
            icon.className = inputComponantBox.children[0].dataset.iconClass;
            icon.style.marginRight = ".25em";
            label.appendChild(icon);
        }
        label.innerHTML += `${inputComponantBox.querySelector("label").innerHTML}`;
        return label;
    }
    function GetInputContainer() {
        let inputContainer = document.createElement("div");
        inputContainer.style.cursor = getComputedStyle(inputComponant).cursor;
        inputContainer.tabindex = "-1";
        inputContainer.classList.add("input-container");
        inputContainer.classList.add("input-group");
        if (inputComponant.type === "file") {
            let displayText = document.createElement("div");
            displayText.classList.add("display-text");
            inputContainer.appendChild(displayText);
        }
        if (inputComponant.dataset.iconClass !== undefined && inputComponant.dataset.iconClass !== "") {
            let iconBox = document.createElement("div");
            iconBox.style.fontSize = "1em";
            iconBox.style.margin = "auto .5em auto 0";
            let icon = document.createElement("i");
            icon.className = inputComponant.dataset.iconClass;
            iconBox.appendChild(icon);
            if (inputComponant.dataset.iconPosition === "right") iconBox.classList.add("input-group-append");
            else iconBox.classList.add("input-group-prepend");
            inputContainer.appendChild(iconBox);
        }

        inputContainer.appendChild(inputComponant);
        return inputContainer;
    }
    function GetErrorMessageSpan(className, msgText) {
        let errorMsgSpan = document.createElement("span");
        errorMsgSpan.classList.add("error-msg");
        errorMsgSpan.classList.add(className);
        errorMsgSpan.textContent = msgText;
        return errorMsgSpan;
    }

    function convertPasswordToText(tooltipID) {
        inputComponant.type = 'text';
        inputEyeButton.innerHTML = `<svg viewBox="0 0 576 512" style="width:1em; height:1em;">${eyeSlashSVG}</svg>`;
        ChangeTooltipText(tooltipID, "Hide Password");
    }
    function convertTextToPassword(tooltipID) {
        inputComponant.type = 'password';
        inputEyeButton.innerHTML = `<svg viewBox="0 0 640 512" style="width:1em; height:1em;">${eyeSVG}</svg>`;
        ChangeTooltipText(tooltipID, "Show Password");
    }
    //function convertDateToText() {
    //    inputComponant.dataset.inputType = 'date';
    //    inputComponant.type = 'text';
    //    inputComponant.dataset.dateValue = new Date(inputComponant.value);
    //    if (inputComponant.value !== undefined && inputComponant.value !== '') {
    //        let day = inputComponant.value.split("-")[2];
    //        let month = Months[inputComponant.value.split("-")[1] - 1];
    //        let year = inputComponant.value.split("-")[0];
    //        let dateString = `${day} ${month} ${year}`;
    //        if (day !== undefined && month !== undefined && year !== undefined) inputComponant.value = dateString;
    //    }
    //}
    //function convertTextToDate() {
    //    if (inputComponant.value !== undefined && inputComponant.value !== '') {
    //        let day = inputComponant.value.split(" ")[0];
    //        let month = Months.indexOf(`${inputComponant.value.split(" ")[1]}`) + 1;
    //        if (month < 10) month = "0" + month;
    //        let year = inputComponant.value.split(" ")[2];
    //        let dateString = `${year}-${month}-${day}`;
    //        if (day !== undefined && month !== undefined && year !== undefined) inputComponant.value = dateString;
    //    }
    //    inputComponant.type = 'date';
    //    inputComponant.dataset("data-input-type");
    //}
    function AddHover() {
        if (inputComponant.disabled) {
            inputComponantBox.style.boxShadow = "none";
            inputComponantBox.style.color = "var(--clr-disabled)";
            inputComponantBox.style.cursor = "not-allowed";
            inputContainer.style.cursor = "not-allowed";
            inputComponant.style.cursor = "not-allowed";
        }
        else {
            inputComponantBox.style.boxShadow = blurBoxShadow;
            inputContainer.addEventListener("mouseenter", mouseEnter);
            inputContainer.addEventListener("mouseleave", mouseLeave);
            if (inputExtButton !== undefined && inputExtButton !== null) {
                inputExtButton.addEventListener("mouseenter", mouseEnter);
                inputExtButton.addEventListener("mouseleave", mouseLeave);
            }
            if (inputEyeButton !== undefined && inputEyeButton !== null) {
                inputEyeButton.addEventListener("mouseenter", mouseEnter);
                inputEyeButton.addEventListener("mouseleave", mouseLeave);
            }
            if (inputComponantBox.querySelector("span.info-span") !== undefined && inputComponantBox.querySelector("span.info-span") !== null) {

                inputComponantBox.querySelector("span.info-span").addEventListener("mouseenter", mouseEnter);
                inputComponantBox.querySelector("span.info-span").addEventListener("mouseleave", mouseLeave);
            }
        }
    }
    function RemoveHover() {
        inputContainer.removeEventListener("mouseenter", mouseEnter);
        inputContainer.removeEventListener("mouseleave", mouseLeave);
        if (inputExtButton !== undefined && inputExtButton !== null) {
            inputExtButton.removeEventListener("mouseenter", mouseEnter);
            inputExtButton.removeEventListener("mouseleave", mouseLeave);
        }
        if (inputEyeButton !== undefined && inputEyeButton !== null) {
            inputEyeButton.removeEventListener("mouseenter", mouseEnter);
            inputEyeButton.removeEventListener("mouseleave", mouseLeave);
        }
        if (inputComponantBox.querySelector("span.info-span") !== undefined && inputComponantBox.querySelector("span.info-span") !== null) {
            inputComponantBox.querySelector("span.info-span").removeEventListener("mouseenter", mouseEnter);
            inputComponantBox.querySelector("span.info-span").removeEventListener("mouseleave", mouseLeave);
        }
    }
    function SetDate() {
        if (inputComponant.dataset.minAge !== undefined && inputComponant.dataset.minAge !== '') {
            let today = new Date().toISOString().split("T")[0];
            inputComponant.value = inputComponant.value || new Date(parseInt(today.split("-")[0]) - parseInt(inputComponant.dataset.minAge), today.split("-")[1] - 1, today.split("-")[2]).toISOString().split("T")[0];
        }
        else inputComponant.value = inputComponant.value || new Date().toISOString().split("T")[0];
    }
    function SetTime() {
        const time = new Date();
        inputComponant.value = time.getHours() + ":" + time.getMinutes();
    }
    function focusLabel() {
        labelElement.style.transform = "translate(1em,.2em) scale(.75)";
        if (inputComponant.dataset.informationMsg !== undefined && inputComponant.dataset.informationMsg !== '') HideInformation();
    }
    function blurLabel() {
        let left = 0;
        if (inputComponantBox.querySelector(".input-container input") !== null)
            left = inputComponantBox.querySelector(".input-container input").offsetLeft;
        else if (inputComponantBox.querySelector(".input-container select") !== null)
            left = inputComponantBox.querySelector(".input-container select").offsetLeft;
        else if (inputComponantBox.querySelector(".input-container textarea") !== null)
            left = inputComponantBox.querySelector(".input-container textarea").offsetLeft;

        if (left === 0) labelElement.style.transform = `translate(1em,1.22em) scale(1)`;
        else labelElement.style.transform = `translate(${left}px,1.22em) scale(1)`;

        if (inputComponant.dataset.informationMsg !== undefined && inputComponant.dataset.informationMsg !== '') ShowInformation();
    }
    function ShowInformation() {
        inputComponantBox.querySelector("span.info-span").style.zIndex = "1";
        setTimeout(() => { inputComponantBox.querySelector("span.info-span").style.opacity = "1"; }, 20);
    }
    function HideInformation() {
        inputComponantBox.querySelector("span.info-span").style.opacity = "0";
        setTimeout(() => { inputComponantBox.querySelector("span.info-span").style.zIndex = "-111"; }, 500);
    }
    function mouseEnter() {
        inputComponantBox.style.boxShadow = hoverBoxShadow;
        if (inputComponant.dataset.informationMsg !== undefined && inputComponant.dataset.informationMsg !== '')
            if (inputComponant.value === "" || inputComponant.value === undefined)
                ShowInformation();
    }
    function mouseLeave() {
        inputComponantBox.style.boxShadow = blurBoxShadow;
    }


    function requiredField(isBlur) {
        if (isBlur) {
            if (inputComponant.value === "" || inputComponant.value === null) {
                inputComponantBox.querySelector(".error-box span.required").style.display = "block";
                return false;
            } else {
                inputComponantBox.querySelector(".error-box span.required").style.display = "none";
                return true;
            }
        } else if (inputComponant.value !== "" || inputComponant.value === null) {
            inputComponantBox.querySelector(".error-box span.required").style.display = "none";
            return true;
        }
    }
    function validateInput() {
        let regEx = new RegExp(inputComponant.dataset.validateExp, 'gi');
        if (regEx.test(inputComponant.value)) {
            inputComponant.value = inputComponant.value.replace(regEx, "");
            inputComponantBox.querySelector(".error-box span.validate-input").style.display = "block";
            return false;
        } else {
            inputComponantBox.querySelector(".error-box span.validate-input").style.display = "none";
        }
    }
    function validateEmail(isBlur) {
        let emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (isBlur && inputComponant.value !== "") {
            if (emailRegEx.test(inputComponant.value)) {
                inputComponantBox.querySelector(".error-box span.validate-email").style.display = "none";
                return true;
            } else {
                inputComponantBox.querySelector(".error-box span.validate-email").style.display = "block";
                return false;
            }
        }
        else if (isBlur && inputComponant.value === "") {
            inputComponantBox.querySelector(".error-box span.validate-email").style.display = "none";
            return true;
        }
        else if (emailRegEx.test(inputComponant.value)) {
            inputComponantBox.querySelector(".error-box span.validate-email").style.display = "none";
            return true;
        }
    }
    function validateAge(min, max) {
        let inputDate = new Date(inputComponant.value.split("-")[0], inputComponant.value.split("-")[1] - 1, inputComponant.value.split("-")[2]);
        let age = parseInt((new Date() - inputDate) / (1000 * 60 * 60 * 24));
        let minAge = (parseInt(min) * 365) + (parseInt(min) / 4) || 0;
        let maxAge = (parseInt(max) * 365) + (parseInt(max) / 4) || 500 * 365;
        if ((age > minAge && age < maxAge) || isNaN(age)) {
            inputComponantBox.querySelector(".error-box span.validate-age").style.display = "none";
            return true;
        } else {
            inputComponantBox.querySelector(".error-box span.validate-age").style.display = "block";
            return false;
        }
    }
    function validateLength(min, max, isBlur) {
        let minLength = parseInt(min);
        if (minLength === -1) minLength = 0;
        let maxLength = parseInt(max);
        if (maxLength === -1) maxLength = 50000;
        let length = inputComponant.value.length;
        if (isBlur)
            if (length === 0) {
                inputComponantBox.querySelector(".error-box span.validate-length").style.display = "none";
                return true;
            }
            else if (minLength > length || length > maxLength) {
                inputComponantBox.querySelector(".error-box span.validate-length").style.display = "block";
                return false;
            }
            else {
                inputComponantBox.querySelector(".error-box span.validate-length").style.display = "none";
                return true;
            }
        else if (minLength <= length && length <= maxLength) {
            inputComponantBox.querySelector(".error-box span.validate-length").style.display = "none";
            return true;
        }
    }
    function UpdateFileUpload() {
        let uploadedFiles = inputComponant.files;
        if (uploadedFiles.length > 1) {
            inputContainer.querySelector(".display-text").innerHTML = `${uploadedFiles.length} files selected`;
            inputComponantBox.style.boxShadow = blurBoxShadow;
            if (inputComponant.dataset.required === "true") {
                inputComponantBox.querySelector(".error-box span.required").style.display = "none";
            }
            focusLabel(); AddHover();
        } else if (uploadedFiles.length === 1) {
            inputContainer.querySelector(".display-text").innerHTML = `${uploadedFiles[0].name}`;
            inputComponantBox.style.boxShadow = blurBoxShadow;
            if (inputComponant.dataset.required === "true") {
                inputComponantBox.querySelector(".error-box span.required").style.display = "none";
            }
            focusLabel(); AddHover();
        } else {
            inputContainer.querySelector(".display-text").innerHTML = "";
            blurLabel();
            if (inputComponant.dataset.required === "true") {
                inputComponantBox.style.boxShadow = errorBoxShadow;
                inputComponantBox.querySelector(".error-box span.required").style.display = "block";
                RemoveHover();
            } else { AddHover(); }
        }
    }
    function ValidateFileUpload() {
        if (inputComponant.value !== '') {
            var valid_extensions = new RegExp(`(${inputComponant.dataset.fileExt})$`, 'i');
            if (valid_extensions.test(inputComponant.value)) {
                inputComponantBox.querySelector(".error-box span.validate-input").style.display = "none";
                return true;
            }
            else {
                inputComponantBox.querySelector(".error-box span.validate-input").style.display = "block";
                return false;
            }
        }
        return true;
    }
    function ValidateRange() {
        console.log(inputComponant.value);
        console.log(inputComponant.min, parseInt(inputComponant.value) < inputComponant.min);
        console.log(inputComponant.max, parseInt(inputComponant.value) > inputComponant.max);
        if (parseInt(inputComponant.value) < inputComponant.min) {
            inputComponantBox.querySelector(".error-box span.validate-input").style.display = "block";
            return false;
        } else if (parseInt(inputComponant.value) > inputComponant.max) {
            inputComponantBox.querySelector(".error-box span.validate-input").style.display = "block";
            return false;
        } else {
            inputComponantBox.querySelector(".error-box span.validate-input").style.display = "none";
            return true;
        }
    }


    let labelElement = GetLabelElement();
    let inputContainer = GetInputContainer();

    inputComponantBox.innerHTML = "";
    inputComponantBox.appendChild(labelElement);
    inputComponantBox.appendChild(inputContainer);
    if (inputExtButton !== null) {
        inputComponantBox.appendChild(inputExtButton);
    }
    function SetEyeButton() {
        inputComponantBox.appendChild(inputEyeButton);
        inputEyeButton.classList.add("eye-btn");
        inputEyeButton.type = "button";
        inputEyeButton.dataset.tooltipText = "Show Password";
        inputEyeButton.dataset.boxBgcolor = "var(--clr-dark)";
        inputEyeButton.dataset.boxColor = "var(--clr-light)";
        inputEyeButton.dataset.tooltipFontsize = ".7em";
        inputEyeButton.dataset.tooltipOpacity = ".9";
        inputEyeButton.id = GetRandomID(16);
        let tooltip = SetTooltip(`#${inputEyeButton.id}`);
        tooltip.id = GetRandomID(12);
        inputEyeButton.addEventListener('click', () => {
            if (inputComponant.type === 'password') { convertPasswordToText(tooltip.id); }
            else { convertTextToPassword(tooltip.id); }
        });
        inputEyeButton.innerHTML = `<svg viewBox="0 0 640 512" style="width:1em; height:1em;">${eyeSVG}</svg>`;
    }



    let errorBox = document.createElement("div");
    errorBox.classList.add("error-box");
    inputComponantBox.appendChild(errorBox);
    if (inputComponant.dataset.required === "true") {
        inputComponantBox.appendChild(GetMandatorySpan());
        errorBox.appendChild(GetErrorMessageSpan("required", "Required"));
    }
    if (inputComponant.dataset.validateErrorMsg !== undefined && inputComponant.dataset.validateErrorMsg !== "") {
        errorBox.appendChild(GetErrorMessageSpan("validate-input", inputComponant.dataset.validateErrorMsg));
    }
    if (inputComponant.dataset.ageErrorMsg !== undefined && inputComponant.dataset.ageErrorMsg !== "") {
        errorBox.appendChild(GetErrorMessageSpan("validate-age", inputComponant.dataset.ageErrorMsg));
    }
    if (inputComponant.dataset.validateEmail === "true") {
        errorBox.appendChild(GetErrorMessageSpan("validate-email", "Invalid email."));
    }
    if (inputComponant.dataset.lengthErrorMsg !== undefined && inputComponant.dataset.lengthErrorMsg !== "") {
        errorBox.appendChild(GetErrorMessageSpan("validate-length", inputComponant.dataset.lengthErrorMsg));
    }
    if (inputComponant.dataset.showCharacterCount === "true") {
        let characterCount = document.createElement("span");
        characterCount.classList.add("character-count");
        characterCount.textContent = `${inputComponant.value.length} / ${inputComponant.getAttribute("maxLength")}`;
        inputComponantBox.appendChild(characterCount);
    }
    if (inputComponant.dataset.informationMsg !== undefined && inputComponant.dataset.informationMsg !== '') {
        let infoBox = document.createElement("span");
        infoBox.classList.add("info-span");

        if (inputComponant.dataset.informationPosition === "bottom") infoBox.style.bottom = ".3em";
        else infoBox.style.top = ".3em";

        if (inputComponant.dataset.informationColor !== "" || inputComponant.dataset.informationColor !== undefined)
            infoBox.style.color = inputComponant.dataset.informationColor;

        infoBox.innerHTML = `<svg class="my-0 mr-3 ml-0" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"/></svg><span class="my-auto">${inputComponant.dataset.informationMsg}</span>`;

        infoBox.addEventListener("click", () => { inputComponant.focus(); });

        inputComponantBox.appendChild(infoBox);


        //infoBox.innerHTML = `<span class="my-auto ml-0 mr-3" style="position:relative;"><svg x="0px" y="0px" width="1em" height="1em" viewBox="0 0 512 512" style="fill:transparent;">
        //    <path fill="${inputComponant.dataset.informationColor}" d="M504.1,256C504.1,119,393,7.9,256,7.9C119,7.9,7.9,119,7.9,256C7.9,393,119,504.1,256,504.1C393,504.1,504.1,393,504.1,256z"></path>
        //    <path fill="#FFF" d="M323.2 367.5c-1.4-2-4-2.8-6.3-1.7-24.6 11.6-52.5 23.9-58 25-.1-.1-.4-.3-.6-.7-.7-1-1.1-2.3-1.1-4 0-13.9 10.5-56.2 31.2-125.7 17.5-58.4 19.5-70.5 19.5-74.5 0-6.2-2.4-11.4-6.9-15.1-4.3-3.5-10.2-5.3-17.7-5.3-12.5 0-26.9 4.7-44.1 14.5-16.7 9.4-35.4 25.4-55.4 47.5-1.6 1.7-1.7 4.3-.4 6.2 1.3 1.9 3.8 2.6 6 1.8 7-2.9 42.4-17.4 47.6-20.6 4.2-2.6 7.9-4 10.9-4 .1 0 .2 0 .3 0 0 .2.1.5.1.9 0 3-.6 6.7-1.9 10.7-30.1 97.6-44.8 157.5-44.8 183 0 9 2.5 16.2 7.4 21.5 5 5.4 11.8 8.1 20.1 8.1 8.9 0 19.7-3.7 33.1-11.4 12.9-7.4 32.7-23.7 60.4-49.7C324.3 372.2 324.6 369.5 323.2 367.5zM322.2 84.6c-4.9-5-11.2-7.6-18.7-7.6-9.3 0-17.5 3.7-24.2 11-6.6 7.2-9.9 15.9-9.9 26.1 0 8 2.5 14.7 7.3 19.8 4.9 5.2 11.1 7.8 18.5 7.8 9 0 17-3.9 24-11.6 6.9-7.6 10.4-16.4 10.4-26.4C329.6 96 327.1 89.6 322.2 84.6z"></path></svg></span>${inputComponant.dataset.informationMsg}`;

    }
    if (inputComponant.dataset.fileExtErrorMsg !== undefined && inputComponant.dataset.fileExtErrorMsg !== "") {
        errorBox.appendChild(GetErrorMessageSpan("validate-input", inputComponant.dataset.fileExtErrorMsg));
    }
    if (inputComponant.dataset.validateRangeErrorMsg !== undefined && inputComponant.dataset.validateRangeErrorMsg !== "") {
        errorBox.appendChild(GetErrorMessageSpan("validate-input", inputComponant.dataset.validateRangeErrorMsg));
    }


    inputComponant.addEventListener("focus", () => {
        inputComponantBox.style.boxShadow = focusBoxShadow;
        if (inputComponant.type === "date") {
            //convertTextToDate();
            SetDate();
        }
        if (inputComponant.tagName !== "SELECT" && inputComponant.type !== "file") focusLabel();
        RemoveHover();
    });
    inputComponant.addEventListener("blur", () => {
        let inputFlag, emailFlag, lengthFlag, ageFlag, requiredFlag, fileExtFlag, rangeFlag;
        if (inputComponant.value === "" || inputComponant.value === null) blurLabel();
        if (inputComponant.dataset.required === "true") requiredFlag = requiredField(true);
        if (inputComponant.dataset.validateExp !== undefined && inputComponant.dataset.validateExp !== '') inputFlag = validateInput();
        if (inputComponant.dataset.validateEmail === "true") emailFlag = validateEmail(true);
        if (inputComponant.dataset.validateLength === "true") lengthFlag = validateLength(inputComponant.minLength, inputComponant.maxLength, true);
        if (inputComponant.dataset.validateRange === "true") rangeFlag = ValidateRange();
        if (inputComponant.type === "date") {
            if ((inputComponant.dataset.minAge !== undefined && inputComponant.dataset.minAge !== '')
                || (inputComponant.dataset.maxAge !== undefined && inputComponant.dataset.maxAge !== ''))
                ageFlag = validateAge(inputComponant.dataset.minAge, inputComponant.dataset.maxAge);
            //convertDateToText();
        }
        if (inputComponant.dataset.fileExt !== undefined && inputComponant.dataset.fileExt !== '') { fileExtFlag = ValidateFileUpload(); }

        let flagResult = true;
        if (requiredFlag !== undefined && flagResult) flagResult = requiredFlag;
        if (fileExtFlag !== undefined && flagResult) flagResult = fileExtFlag;
        if (inputFlag !== undefined && flagResult) flagResult = inputFlag;
        if (emailFlag !== undefined && flagResult) flagResult = emailFlag;
        if (lengthFlag !== undefined && flagResult) flagResult = lengthFlag;
        if (ageFlag !== undefined && flagResult) flagResult = ageFlag;
        if (rangeFlag !== undefined && flagResult) flagResult = rangeFlag;

        if (flagResult) AddHover();
        else {
            inputComponantBox.style.boxShadow = errorBoxShadow;
            if (inputComponant.dataset.informationMsg !== undefined && inputComponant.dataset.informationMsg !== '')
                if (inputComponant.value === "" || inputComponant.value === undefined)
                    ShowInformation();
        }
    });
    inputComponant.addEventListener("keyup", () => {
        let inputFlag, emailFlag, lengthFlag, requiredFlag, rangeFlag;
        if (inputComponant.dataset.required === "true") requiredFlag = requiredField(false);
        if (inputComponant.dataset.validateExp !== undefined && inputComponant.dataset.validateExp !== '') inputFlag = validateInput();
        if (inputComponant.dataset.validateEmail === "true") emailFlag = validateEmail(false);
        if (inputComponant.dataset.validateLength === "true") lengthFlag = validateLength(inputComponant.minLength, inputComponant.maxLength, false);
        if (inputComponant.dataset.validateRange === "true") rangeFlag = ValidateRange();


        let flagResult = true;
        if (requiredFlag !== undefined && flagResult) flagResult = requiredFlag;
        if (inputFlag !== undefined && flagResult) flagResult = inputFlag;
        if (emailFlag !== undefined && flagResult) flagResult = emailFlag;
        if (lengthFlag !== undefined && flagResult) flagResult = lengthFlag;
        if (rangeFlag !== undefined && flagResult) flagResult = rangeFlag;

        if (!flagResult) inputComponantBox.style.boxShadow = errorBoxShadow;
        else inputComponantBox.style.boxShadow = focusBoxShadow;


        if (inputComponant.dataset.showCharacterCount === "true") inputComponantBox.querySelector(".character-count").textContent = `${inputComponant.value.length} / ${inputComponant.maxLength}`;
    });
    inputComponant.addEventListener("keypress", (e) => {
        if (e.keyCode === 13) e.preventDefault();
        if (inputComponant.dataset.validateExp !== undefined && inputComponant.dataset.validateExp !== '') validateInput();
    });
    if (inputComponant.type === "date") {
        inputComponant.style.cursor = "default";
        SetDate();
        inputComponant.addEventListener("change", () => {
            if ((inputComponant.dataset.minAge !== undefined && inputComponant.dataset.minAge !== '') || (inputComponant.dataset.maxAge !== undefined && inputComponant.dataset.maxAge !== ''))
                validateAge(inputComponant.dataset.minAge, inputComponant.dataset.maxAge);
        });

        //convertDateToText();
        //let inputDateComponants = inputComponant.value.split("-");
        //let date = `${inputDateComponants[0]}-${inputDateComponants[1] - 1}-${inputDateComponants[2]}`;
        //if (inputDateComponants[1] - 1 < 10)
        //    date = `${inputDateComponants[0]}-0${inputDateComponants[1] - 1}-${inputDateComponants[2]}`;
        //inputComponant.value = date;

        //inputComponant.blur();
        //inputComponant.addEventListener("keydown", (e) => { e.preventDefault(); });
    }
    if (inputComponant.type === "time") {
        inputComponant.style.cursor = "default";
        if (inputComponant.value === "" || inputComponant.value === undefined) SetTime();
        inputComponant.addEventListener("change", () => {
            if (inputComponant.value === "" || inputComponant.value === undefined) SetTime();
        });
    }
    if (inputComponant.type === "text") { inputComponantBox.style.cursor = 'text'; inputContainer.style.cursor = 'text'; }
    if (inputComponant.type === "password") {
        inputComponantBox.style.cursor = 'text';
        inputContainer.style.cursor = 'text';
        SetEyeButton();
    }
    if (inputComponant.tagName === 'TEXTAREA') { inputComponantBox.style.cursor = 'text'; inputContainer.style.cursor = 'text'; }
    if (inputComponant.type === "file") {
        inputComponant.addEventListener("change", () => {
            UpdateFileUpload();
            ValidateFileUpload();
            inputComponantBox.blur();
        });

        let clearBtn = document.createElement("button");
        clearBtn.type = "button";
        clearBtn.classList.add("clear-btn");
        clearBtn.textContent = "Clear";
        clearBtn.addEventListener("click", () => {
            inputComponant.value = null;
            UpdateFileUpload();
            inputComponant.blur();
        });
        inputComponantBox.appendChild(clearBtn);
    }
    if (inputComponant.tagName === "SELECT") {
        //let downSVG = document.createElement('svg');
        //downSVG.setAttribute('viewBox', '0 0 320 512');
        //downSVG.innerHTML = `<path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"/>`;

        //downSVG.style.position = 'absolute';
        //downSVG.style.zIndex = '2';
        //downSVG.style.right = '.25em';
        //downSVG.style.top = '35%';

        //inputContainer.appendChild(downSVG);

        inputComponant.addEventListener("change", () => {
            if (inputComponant.value === "" || inputComponant.value === undefined) blurLabel();
            else { focusLabel(); inputComponantBox.blur(); }
        });
        inputComponant.addEventListener("blur", () => {
            if (inputComponant.value === "" || inputComponant.value === undefined) blurLabel();
            else { focusLabel(); inputComponantBox.blur(); }
        });
    }

    inputContainer.addEventListener("click", () => { inputComponant.focus(); });
    inputContainer.addEventListener("focus", () => { inputComponant.focus(); });
    setTimeout(() => {
        blurLabel();
        if (inputComponant.value !== "" && inputComponant.value !== null) focusLabel();
        AddHover();

        if (inputComponant.getAttribute('disabled') === 'disabled') RemoveHover();
    }, 50);
}
function SetComponants() {
    ReSetTooltips();


    let inputBox = document.querySelectorAll(".input-box");
    inputBox.forEach(inputComponantBox => {
        let checkContainer = inputComponantBox.querySelector('.input-container');
        if (checkContainer === null) SetComponant(inputComponantBox);
    });
}
function SetDOMComponants(DOMElementID) {
    ReSetTooltips();


    let domElement = document.getElementById(DOMElementID);
    let inputBox = domElement.querySelectorAll(".input-box");
    inputBox.forEach(inputComponantBox => {
        let checkContainer = inputComponantBox.querySelector('.input-container');
        if (checkContainer === undefined || checkContainer === null) SetComponant(inputComponantBox);
        else {
            let inputComponant = inputComponantBox.querySelector("input") || inputComponantBox.querySelector("select") || inputComponantBox.querySelector("textarea");
            let labelElement = inputComponantBox.querySelector("label");
            let left = 0;
            if (inputComponantBox.querySelector(".input-container input") !== null)
                left = inputComponantBox.querySelector(".input-container input").offsetLeft;
            else if (inputComponantBox.querySelector(".input-container select") !== null)
                left = inputComponantBox.querySelector(".input-container select").offsetLeft;
            else if (inputComponantBox.querySelector(".input-container textarea") !== null)
                left = inputComponantBox.querySelector(".input-container textarea").offsetLeft;

            if (left === 0) labelElement.style.transform = `translate(1em,1.22em) scale(1)`;
            else labelElement.style.transform = `translate(${left}px,1.22em) scale(1)`;

            if (inputComponant.dataset.informationMsg !== undefined && inputComponant.dataset.informationMsg !== '') {
                inputComponantBox.querySelector("span.info-span").style.zIndex = "1";
                setTimeout(() => { inputComponantBox.querySelector("span.info-span").style.opacity = "1"; }, 20);
            }

            if (inputComponant.value !== "" && inputComponant.value !== null) {
                labelElement.style.transform = "translate(1em,.2em) scale(.75)";
                if (inputComponant.dataset.informationMsg !== undefined && inputComponant.dataset.informationMsg !== '') {
                    inputComponantBox.querySelector("span.info-span").style.opacity = "0";
                    setTimeout(() => { inputComponantBox.querySelector("span.info-span").style.zIndex = "-111"; }, 500);
                }
            }
        }
    });
}
/***********************************************************************************/





/*************************************************************************************/
//************************************************************************************
// *  DYNAMIC ALERT ON ELEMENT 
// *  -------------------------------
// *  This function will generate an alert and will display according to the 
// *  attributes difened. Following are the attributes to generate Alert.
// *  ---------------------------------------------------------------------------------
// *  obj         : Object on which alert is to be defined.
// *  style       : Defines the color theme of the alert.
// *  position    : Sets the postion for the alert to display
// *  title       : Text Title to show the title of the alert.
// *  message     : Text Message to show in alert body.
// *  timeDelay   : Numeric value in ms, alert display time.
// *---------------------------------------------------------------------------------*/
function AlertOnElement(targetObjectSelector, titleText, bodyHTML, displayTimeMS, fontSize, bgColor, color, position) {
    let alertBox = GetBox();
    alertBox.style.position = "fixed";
    let alertHead = GetHeadBox(titleText);
    let alertBody = GetBodyBox(bodyHTML);
    let alertContainer = GetContentBox();
    alertContainer.appendChild(alertHead);
    alertContainer.appendChild(alertBody);
    alertContainer = GetContainerBox(targetObjectSelector, alertContainer, fontSize, bgColor, color);
    alertBox.appendChild(alertContainer);

    let targetObject = document.querySelector(targetObjectSelector);

    let caretSpan = GetCaret(targetObjectSelector, alertContainer.style.backgroundColor, position);
    alertBox.appendChild(caretSpan);

    alertBox.style.zIndex = "110";
    alertBox = SetBoxPosition(targetObjectSelector, alertBox, position);
    targetObject.parentElement.appendChild(alertBox);
    setTimeout(() => alertBox.style.opacity = "1", 50);


    let currentPos = targetObject.getBoundingClientRect();
    let scrollSection = document.querySelector('.content');
    scrollSection.addEventListener('scroll', () => {
        let scrollPos = targetObject.getBoundingClientRect();
        alertBox.style.transform = `translateY(${-(currentPos.y - scrollPos.y)}px)`;
    });


    setTimeout(() => {
        alertBox.style.opacity = "0";
        setTimeout(() => alertBox.remove(), 650);
    }, displayTimeMS);
}
/***********************************************************************************/

//************************************************************************************
// *  DYNAMIC NOTIFICATION 
// *  -----------------------------
// *  This function will generate a notification in bottom of window. 
// *  Following are the attributes to generate Notification.
// *  ---------------------------------------------------------------------------------
// *  obj         : Object to only referrance color theme.
// *  style       : Defines the color theme of the Notification.
// *  title       : Text Title to show the title of the Notification.
// *  message     : Text Message to show in Notification body.
// *  timeDelay   : Numeric value in ms, Notification display time.
// *---------------------------------------------------------------------------------*/
function Notify(targetObjectSelector, titleText, bodyHTML, displayTimeMS, fontSize, bgColor, color, isFixed) {
    let notifyHead = GetHeadBox(titleText);
    let notifyBody = GetBodyBox(bodyHTML);
    let notifyContainer = GetContentBox();
    notifyContainer.appendChild(notifyHead);
    notifyContainer.appendChild(notifyBody);

    let notifyBox = GetBox();
    if (isFixed) notifyBox.style.position = "fixed";
    notifyContainer = GetContainerBox(targetObjectSelector, notifyContainer, fontSize, bgColor, color);
    notifyBox.appendChild(notifyContainer);
    notifyBox.style.bottom = "0";
    notifyBox.style.left = "0";
    notifyBox.style.padding = "1em";
    notifyBox.style.zIndex = "111";

    let displayIn = document.querySelector(targetObjectSelector);
    displayIn.appendChild(notifyBox);
    setTimeout(() => notifyBox.style.opacity = "1", 50);

    setTimeout(() => {
        notifyBox.style.opacity = "0";
        setTimeout(() => displayIn.removeChild(notifyBox), 500);
    }, displayTimeMS - 500);
}
/***********************************************************************************/

//************************************************************************************
// *  DYNAMIC CONFIRM BOX ON ELEMENT 
// *  ----------------------------------
// *  This function will generate an confirm box and will display according to the attributes difened. 
// *  Also you can pass the function to proceed further after making choice. 
// *  Following are the attributes to generate confirm box.
// *  ---------------------------------------------------------------------------------
// *  obj         : Object on which confirm box is to be defined.
// *  style       : Defines the color theme of the confirm box.
// *  position    : Sets the postion for the confirm box to display
// *  title       : Text Title to show the title of the confirm box.
// *  message     : Text Message to show in confirm box body.
// *  proceedButtonName: Button Name in text, to display.
// *  onConfirmFunction: Proceed Function to process.
// *---------------------------------------------------------------------------------*/
function ConfirmOnElement(targetObjectSelector, titleText, messageText, proceedButtonName, onConfirmFunction, fontSize, bgColor, color, position) {
    let confirmBox = GetBox();
    confirmBox.style.position = "fixed";
    let confirmHead = GetHeadBox(titleText);
    let confirmMessage = GetBodyBox(messageText);
    let confirmContainer = GetContentBox();

    let targetObject = document.querySelector(targetObjectSelector);

    let proceedButton = document.createElement("button");
    proceedButton.type = "button";
    proceedButton.style.backgroundColor = color || targetObject.dataset.boxColor || 'var(--clr-white)';
    proceedButton.style.color = bgColor || targetObject.dataset.boxBgcolor || 'var(--clr-dark)';
    proceedButton.style.fontSize = ".75em";
    proceedButton.textContent = proceedButtonName;
    proceedButton.addEventListener("click", () => {
        confirmBox.style.opacity = "0";
        setTimeout(() => confirmBox.remove(), 500);
        onConfirmFunction();
    });

    let confirmFooter = document.createElement("div");
    confirmFooter.style.padding = ".4em";
    confirmFooter.style.margin = "0 0 0 auto";
    confirmFooter.appendChild(proceedButton);

    let cancelButton = document.createElement("button");
    cancelButton.type = 'button';
    cancelButton.style.position = "absolute";
    cancelButton.style.top = "2%";
    cancelButton.style.right = "2%";
    cancelButton.innerHTML = "<i class=\"fas fa-times\"></i>";
    cancelButton.style.padding = ".25em .5em";
    cancelButton.style.borderRadius = ".2em";
    cancelButton.style.backgroundColor = "transparent";
    cancelButton.style.color = "currentcolor";
    cancelButton.addEventListener("click", () => {
        confirmBox.style.opacity = "0";
        setTimeout(() => confirmBox.remove(), 650);
    });

    confirmContainer.appendChild(confirmHead);
    confirmContainer.appendChild(confirmMessage);
    confirmContainer.appendChild(confirmFooter);
    confirmContainer.appendChild(cancelButton);
    confirmContainer = GetContainerBox(targetObjectSelector, confirmContainer, fontSize, bgColor, color);
    confirmBox.appendChild(confirmContainer);



    let caretSpan = GetCaret(targetObjectSelector, confirmContainer.style.backgroundColor, position);
    confirmBox.appendChild(caretSpan);

    confirmBox.style.zIndex = "111";
    confirmBox = SetBoxPosition(targetObjectSelector, confirmBox, position);

    let currentPos = targetObject.getBoundingClientRect();
    let scrollSection = document.querySelector('.content');
    scrollSection.addEventListener('scroll', () => {
        let scrollPos = targetObject.getBoundingClientRect();
        confirmBox.style.transform = `translateY(${-(currentPos.y - scrollPos.y)}px)`;
    });

    targetObject.parentElement.appendChild(confirmBox);
    setTimeout(() => confirmBox.style.opacity = "1", 50);
}
/***********************************************************************************/

//************************************************************************************
// *  DYNAMIC TOOLTIP 
// *  ----------------
// *  This function will auto generate tooltips for all the elements with class tooltip.
// *  data- variables are required to auto generate tooltip.
// *  Following are the attributes to generate Notification.
// *  ---------------------------------------------------------------------------------
// *  targetObject         : Element containing tooltip class
// *  style       : data-tooltip-style to set the style of tooltip.
// *  position    : data-tooltip-position to set the position of tooltip.
// *  text        : data-tooltip-text to set the text of tooltip.
// *---------------------------------------------------------------------------------*/
function Tooltip(targetObjectSelector, htmlText) {
    let targetObject = document.querySelector(targetObjectSelector);

    let tooltipBox = GetBox();
    tooltipBox.style.maxWidth = "360px";
    let tooltipContent = GetContentBox();
    tooltipContent.innerHTML = htmlText;
    tooltipContent = GetContainerBox(targetObjectSelector, tooltipContent);
    tooltipContent.style.backgroundColor = targetObject.dataset.tooltipBgcolor || "var(--clr-black)";
    tooltipContent.style.color = targetObject.dataset.tooltipColor || "var(--clr-white)";
    tooltipContent.style.fontSize = targetObject.dataset.tooltipFontsize || ".8em";
    tooltipBox.appendChild(tooltipContent);

    if (targetObject.dataset.tooltipItalics) tooltipBox.style.fontStyle = "italic";

    //let caret = GetCaret(targetObject, tooltipContent.style.backgroundColor);
    //tooltipBox.appendChild(caret);

    //tooltipBox = SetBoxPosition(targetObject, tooltipBox);
    //targetObject.parentElement.appendChild(tooltipBox);
    document.body.appendChild(tooltipBox);

    return tooltipBox;
}
function SetTooltips() {
    let tooltipElements = document.getElementsByClassName("tooltip");
    for (var i = 0; i < tooltipElements.length; i++) { SetTooltip('#' + tooltipElements[i].id); }
}
function SetTooltip(tooltipTargetSelector) {
    let targetObject = document.querySelector(tooltipTargetSelector);

    let tooltipBox = Tooltip(tooltipTargetSelector, targetObject.dataset.tooltipText);
    tooltipBox.classList.add('isTooltip');
    tooltipBox.style.position = "fixed";
    tooltipBox.style.left = 0;
    tooltipBox.style.top = 0;

    let opacity = "1";
    if (targetObject.dataset.tooltipOpacity !== undefined && targetObject.dataset.tooltipOpacity !== '')
        opacity = targetObject.dataset.tooltipOpacity;

    targetObject.addEventListener("mouseenter", () => {
        tooltipBox.style.opacity = opacity + "";
        tooltipBox.style.zIndex = "111";

        if ((window.innerWidth - event.clientX - 15) < parseInt(getComputedStyle(tooltipBox).width)) {
            tooltipBox.style.top = event.clientY + 25 + "px";
            tooltipBox.style.left = "auto";
            tooltipBox.style.right = 0;
        }
        else {
            tooltipBox.style.top = event.clientY + 20 + "px";
            tooltipBox.style.right = "auto";
            tooltipBox.style.left = event.clientX + 15 + "px";
        }
    });
    targetObject.addEventListener("mouseleave", () => {
        tooltipBox.style.opacity = "0";
        tooltipBox.style.zIndex = "-111";
    });
    targetObject.addEventListener("click", () => {
        tooltipBox.style.opacity = "0";
        tooltipBox.style.zIndex = "-111";
        tooltipBox.style.left = "0";
        tooltipBox.style.top = "0";
    });

    targetObject.addEventListener("mousemove", () => {
        if ((window.innerWidth - event.clientX - 15) < parseInt(getComputedStyle(tooltipBox).width)) {
            tooltipBox.style.top = event.clientY + 25 + "px";
            tooltipBox.style.left = "auto";
            tooltipBox.style.right = 0;
        }
        else {
            tooltipBox.style.top = event.clientY + 20 + "px";
            tooltipBox.style.right = "auto";
            tooltipBox.style.left = event.clientX + 15 + "px";
        }
    });



    if (targetObject.dataset.tooltipExpire !== undefined && targetObject.dataset.tooltipExpire !== '')
        setTimeout(() => {
            document.body.removeChild(tooltipBox);
        }, parseInt(targetObject.dataset.tooltipExpire) * 1000);

    return tooltipBox;
}
function RemoveTooltips() {
    let tooltipElements = document.getElementsByClassName('isTooltip');
    const len = tooltipElements.length;
    for (let i = 0; i < len; i++) {
        if (tooltipElements[0].id === undefined || tooltipElements[0].id === null)
            tooltipElements[0].remove();
    }
}
function RemoveTooltipsWithIDs() {
    let tooltipElements = document.getElementsByClassName('isTooltip');
    const len = tooltipElements.length;
    for (let i = 0; i < len; i++) {
        if (tooltipElements[0].id !== undefined || tooltipElements[0].id !== null)
            tooltipElements[0].remove();
    }
}
function RemoveTooltip(tooltipID) { document.getElementById(tooltipID).remove(); }
function ChangeTooltipText(tooltipID, tooltipHTMLText) {
    document.getElementById(tooltipID).children[0].children[0].innerHTML = tooltipHTMLText;
}
function ReSetTooltips() {
    RemoveTooltips();
    RemoveTooltipsWithIDs();

    SetTooltips();
}
/***********************************************************************************/

//************************************************************************************
//    *  DYNAMIC BOX GENERATION 
//    *  Auto generates Box for Alert, Confirm, Notification, ToolTip
//    *---------------------------------------------------------------------------------
//    *  This function will auto generate dynamic box according to the reuirement.
//    *---------------------------------------------------------------------------------*/
function GetBox() {
    let box = document.createElement("div");
    box.style.position = "absolute";
    box.style.display = "flex";
    box.style.display = "-ms-flexbox";
    box.style.display = "-webkit-flex";
    box.style.opacity = "0";
    box.style.zIndex = "-111";
    box.style.backgroundColor = "transparent";
    box.style.transition = ".65s ease opacity";
    box.style.maxWidth = "420px";
    return box;
}
/*-----------------------------------------------------------------------------------
 *  This function will auto arrange the position according to user position
 *  AVAILABLE POSITIONS = { 'top', 'bottom', 'right', 'left' }
 *---------------------------------------------------------------------------------*/
//function SetBoxPosition(targetObjectSelector, box, pos) {
//    let targetObject = document.querySelector(targetObjectSelector);

//    let parentWidth; let parentHeight;
//    if (targetObject.parentElement === document.body) {
//        parentWidth = innerWidth;
//        parentHeight = innerHeight;
//    }
//    else {
//        parentHeight = targetObject.parentElement.offsetHeight;
//        parentWidth = targetObject.parentElement.offsetWidth;
//    }

//    let rect = targetObject.getBoundingClientRect();
//    console.log(`Viewport:- ${window.innerWidth}, Element Position: Top: ${rect.top}, Left:${rect.left}`);
//    let position = pos || targetObject.dataset.boxPosition || 'bottom';
//    switch (position) {
//        case "top":
//            box.style.padding = "1em 0";
//            box.style.bottom = (parentHeight - targetObject.offsetTop) + "px";
//            if (targetObject.offsetLeft < parentWidth / 2)
//                box.style.left = targetObject.offsetLeft + "px";
//            else box.style.right = (parentWidth - targetObject.offsetLeft - targetObject.offsetWidth) + "px";
//            break;
//        case "bottom":
//            box.style.padding = "1em 0";
//            box.style.top = targetObject.offsetTop + targetObject.offsetHeight + "px";
//            if (targetObject.offsetLeft < parentWidth / 2)
//                box.style.left = targetObject.offsetLeft + "px";
//            else box.style.right = (parentWidth - targetObject.offsetLeft - targetObject.offsetWidth) + "px";
//            break;
//        case "right":
//            box.style.padding = "0 .38em";
//            box.style.left = (targetObject.offsetLeft + targetObject.offsetWidth) + "px";
//            if (targetObject.offsetTop < parentHeight / 2)
//                box.style.top = targetObject.offsetTop + "px";
//            else box.style.bottom = (parentHeight - targetObject.offsetTop - targetObject.offsetHeight) + "px";
//            break;
//        case "left":
//            box.style.padding = "0 .38em";
//            box.style.right = (parentWidth - targetObject.offsetLeft) + "px";
//            if (targetObject.offsetTop < parentHeight / 2)
//                box.style.top = targetObject.offsetTop + "px";
//            else box.style.bottom = (parentHeight - targetObject.offsetTop - targetObject.offsetHeight) + "px";
//            break;
//    }

//    return box;
//}


function SetBoxPosition(targetObjectSelector, box, pos) {
    let targetObject = document.querySelector(targetObjectSelector);

    let parentWidth = window.innerWidth;
    let parentHeight = window.innerHeight;
    let element = targetObject.getBoundingClientRect();

    let position = pos || targetObject.dataset.boxPosition || 'bottom';
    switch (position) {
        case "top":
            box.style.padding = ".9em 0";
            box.style.bottom = (parentHeight - element.top) + "px";
            if (element.left < parentWidth / 2)
                box.style.left = element.left + "px";
            else box.style.right = (parentWidth - element.left - element.width) + "px";
            break;
        case "bottom":
            box.style.padding = ".9em 0";
            box.style.top = element.top + element.height + "px";
            if (element.left < parentWidth / 2)
                box.style.left = element.left + "px";
            else box.style.right = (parentWidth - element.left - element.width) + "px";
            break;
        case "right":
            box.style.padding = "0 .38em";
            box.style.left = (element.left + targetObject.offsetWidth) + "px";
            if (element.top < parentHeight / 2)
                box.style.top = element.top + "px";
            else box.style.bottom = (parentHeight - element.top - element.height) + "px";
            break;
        case "left":
            box.style.padding = "0 .38em";
            box.style.right = (parentWidth - element.left) + "px";
            if (element.top < parentHeight / 2)
                box.style.top = element.top + "px";
            else box.style.bottom = (parentHeight - element.top - element.height) + "px";
            break;
    }



    return box;
}


/*-----------------------------------------------------------------------------------
*  This function will auto Content Box and give required style set by user
*  AVAILABLE STYLES = { 'similar', 'differ', 'light', 'dark', 'blue', 'danger', 'warning', 'success' }
*---------------------------------------------------------------------------------*/
function GetContentBox() {
    let contentBox = document.createElement("div");
    contentBox.style.position = "relative";
    contentBox.style.display = "flex";
    contentBox.style.display = "-ms-flexbox";
    contentBox.style.flexDirection = "column";
    contentBox.style.webkitFlexDirection = "column";
    contentBox.style.justifyContent = "center";
    contentBox.style.alignItemsitems = "center";
    contentBox.style.backgroundColor = "transparent";
    return contentBox;
}

function GetContainerBox(targetObjectSelector, contentBox, fontSize, bgColor, color) {
    let targetObject = document.querySelector(targetObjectSelector);

    let containerBox = document.createElement("div");
    containerBox.style.position = "relative";
    containerBox.style.display = "flex";
    containerBox.style.display = "-ms-flexbox";

    containerBox.style.fontSize = fontSize || targetObject.dataset.boxFontsize || "1em";

    containerBox.style.padding = ".4em .8em";
    containerBox.style.borderRadius = ".25em";

    containerBox.style.backgroundColor = bgColor || targetObject.dataset.boxBgcolor || "var(--clr-dark)";

    containerBox.style.color = color || targetObject.dataset.boxColor || "var(--clr-white)";

    if (targetObject.dataset.boxIcon !== undefined && targetObject.dataset.boxIcon !== '') {
        let icon = document.createElement("i");
        icon.className = targetObject.dataset.boxIcon;
        if (targetObject.dataset.boxIconsize !== undefined && targetObject.dataset.boxIconsize !== '')
            icon.style.fontSize = targetObject.dataset.boxIconsize;
        icon.style.margin = ".1em .25em auto 0";
        icon.style.fontSize = "1.6em";
        containerBox.appendChild(icon);
    }

    containerBox.appendChild(contentBox);
    return containerBox;
}
/*-----------------------------------------------------------------------------------
*  This function will auto generate and set caret arrow according to box position
*---------------------------------------------------------------------------------*/
//function GetCaret(targetObjectSelector, color, pos) {
//    const caret_up = `<svg width="1em" height="1em" viewBox="0 0 320 240"><defs><clipPath id="b"><rect width="320" height="240"/></clipPath></defs><g id="a" clip-path="url(#b)"><path fill="currentcolor" d="M151.68,12.481a10,10,0,0,1,16.641,0L309.635,224.453A10,10,0,0,1,301.315,240H18.685a10,10,0,0,1-8.321-15.547Z"/></g></svg>`;
//    const caret_down = `<svg width="1em" height="1em" viewBox="0 0 320 240"><defs><clipPath id="b"><rect width="320" height="240"/></clipPath></defs><g id="a" clip-path="url(#b)"><path  fill="currentcolor" d="M151.679,12.481a10,10,0,0,1,16.641,0L309.635,224.453A10,10,0,0,1,301.315,240H18.685a10,10,0,0,1-8.321-15.547Z" transform="translate(320 240) rotate(180)"/></g></svg>`;
//    const caret_right = `<svg width="1em" height="1em" viewBox="0 0 240 320"><defs><clipPath id="b"><rect width="240" height="320"/></clipPath></defs><g id="a" clip-path="url(#b)"><path  fill="currentcolor" d="M151.679,12.481a10,10,0,0,1,16.641,0L309.635,224.453A10,10,0,0,1,301.315,240H18.685a10,10,0,0,1-8.321-15.547Z" transform="translate(240) rotate(90)"/></g></svg>`;
//    const caret_left = `<svg width="1em" height="1em" viewBox="0 0 240 320"><defs><clipPath id="b"><rect width="240" height="320"/></clipPath></defs><g id="a" clip-path="url(#b)"><path  fill="currentcolor" d="M151.679,12.481a10,10,0,0,1,16.641,0L309.635,224.453A10,10,0,0,1,301.315,240H18.685a10,10,0,0,1-8.321-15.547Z" transform="translate(0 320) rotate(-90)"/></g></svg>`;
//    let targetObject = document.querySelector(targetObjectSelector);

//    let caretSpan = document.createElement("i");
//    caretSpan.style.position = "absolute";
//    caretSpan.style.fontSize = "1.5em";
//    caretSpan.style.padding = "0";
//    caretSpan.style.color = color;

//    let parentWidth; let parentHeight;
//    if (targetObject.parentElement === document.body) { parentWidth = innerWidth; parentHeight = innerHeight; }
//    else { parentHeight = targetObject.parentElement.offsetHeight; parentWidth = targetObject.parentElement.offsetWidth; }

//    let position = pos || targetObject.dataset.boxPosition || 'bottom';
//    switch (position) {
//        case "top":
//            caretSpan.style.bottom = "0";
//            //caretSpan.classList.add("fa-caret-down");
//            caretSpan.innerHTML = caret_down;
//            if (targetObject.offsetLeft < parentWidth / 2)
//                caretSpan.style.left = (targetObject.offsetWidth / 2.5) + "px";
//            else caretSpan.style.right = (targetObject.offsetWidth / 2.5) + "px";
//            break;
//        case "bottom":
//            caretSpan.style.top = "0";
//            //caretSpan.classList.add("fa-caret-up");
//            caretSpan.innerHTML = caret_up;
//            if (targetObject.offsetLeft < parentWidth / 2)
//                caretSpan.style.left = (targetObject.offsetWidth / 2.5) + "px";
//            else caretSpan.style.right = (targetObject.offsetWidth / 2.5) + "px";
//            break;
//        case "left":
//            caretSpan.style.right = "0";
//            //caretSpan.classList.add("fa-caret-right");
//            caretSpan.innerHTML = caret_right;
//            if (targetObject.offsetTop < parentHeight / 2)
//                caretSpan.style.top = (targetObject.offsetHeight / 2.5) + "px";
//            else caretSpan.style.bottom = (targetObject.offsetHeight / 2.5) + "px";
//            break;
//        case "right":
//            caretSpan.style.left = "0";
//            //caretSpan.classList.add("fa-caret-left");
//            caretSpan.innerHTML = caret_left;
//            if (targetObject.offsetTop < parentHeight / 2)
//                caretSpan.style.top = (targetObject.offsetHeight / 2.5) + "px";
//            else caretSpan.style.bottom = (targetObject.offsetHeight / 2.5) + "px";
//            break;
//    }
//    return caretSpan;
//}

function GetCaret(targetObjectSelector, color, pos) {
    const caret_up = `<svg width="1em" height="1em" viewBox="0 0 320 240"><defs><clipPath id="b"><rect width="320" height="240"/></clipPath></defs><g id="a" clip-path="url(#b)"><path fill="currentcolor" d="M151.68,12.481a10,10,0,0,1,16.641,0L309.635,224.453A10,10,0,0,1,301.315,240H18.685a10,10,0,0,1-8.321-15.547Z"/></g></svg>`;
    const caret_down = `<svg width="1em" height="1em" viewBox="0 0 320 240"><defs><clipPath id="b"><rect width="320" height="240"/></clipPath></defs><g id="a" clip-path="url(#b)"><path  fill="currentcolor" d="M151.679,12.481a10,10,0,0,1,16.641,0L309.635,224.453A10,10,0,0,1,301.315,240H18.685a10,10,0,0,1-8.321-15.547Z" transform="translate(320 240) rotate(180)"/></g></svg>`;
    const caret_right = `<svg width="1em" height="1em" viewBox="0 0 240 320"><defs><clipPath id="b"><rect width="240" height="320"/></clipPath></defs><g id="a" clip-path="url(#b)"><path  fill="currentcolor" d="M151.679,12.481a10,10,0,0,1,16.641,0L309.635,224.453A10,10,0,0,1,301.315,240H18.685a10,10,0,0,1-8.321-15.547Z" transform="translate(240) rotate(90)"/></g></svg>`;
    const caret_left = `<svg width="1em" height="1em" viewBox="0 0 240 320"><defs><clipPath id="b"><rect width="240" height="320"/></clipPath></defs><g id="a" clip-path="url(#b)"><path  fill="currentcolor" d="M151.679,12.481a10,10,0,0,1,16.641,0L309.635,224.453A10,10,0,0,1,301.315,240H18.685a10,10,0,0,1-8.321-15.547Z" transform="translate(0 320) rotate(-90)"/></g></svg>`;
    let targetObject = document.querySelector(targetObjectSelector);

    let caretSpan = document.createElement("span");
    caretSpan.style.position = "absolute";
    caretSpan.style.width = "1.5em";
    caretSpan.style.padding = "0";
    caretSpan.style.color = color;


    let parentWidth = window.innerWidth;
    let parentHeight = window.innerHeight;
    let element = targetObject.getBoundingClientRect();

    let position = pos || targetObject.dataset.boxPosition || 'bottom';
    switch (position) {
        case "top":
            caretSpan.style.bottom = "0";
            //caretSpan.classList.add("fa-caret-down");
            caretSpan.innerHTML = caret_down;
            if (element.left < parentWidth / 2)
                caretSpan.style.left = (element.width / 3) + "px";
            else caretSpan.style.right = (element.width / 3) + "px";
            break;
        case "bottom":
            caretSpan.style.top = "0";
            //caretSpan.classList.add("fa-caret-up");
            caretSpan.innerHTML = caret_up;
            if (element.left < parentWidth / 2)
                caretSpan.style.left = (element.width / 3) + "px";
            else caretSpan.style.right = (element.width / 3) + "px";
            break;
        case "left":
            caretSpan.style.right = "0";
            //caretSpan.classList.add("fa-caret-right");
            caretSpan.innerHTML = caret_right;
            if (element.top < parentHeight / 2)
                caretSpan.style.top = (element.height / 2.5) + "px";
            else caretSpan.style.bottom = (element.height / 2.5) + "px";
            break;
        case "right":
            caretSpan.style.left = "0";
            //caretSpan.classList.add("fa-caret-left");
            caretSpan.innerHTML = caret_left;
            if (element.top < parentHeight / 2)
                caretSpan.style.top = (element.height / 2.5) + "px";
            else caretSpan.style.bottom = (element.height / 2.5) + "px";
            break;
    }


    return caretSpan;
}


/*-----------------------------------------------------------------------------------
*  This function will auto generate title text for the required box
*---------------------------------------------------------------------------------*/
function GetHeadBox(titleText) {
    let headDiv = document.createElement("div");
    headDiv.style.position = "relative";
    headDiv.style.display = "flex";
    headDiv.style.display = "-ms-flex";
    headDiv.style.margin = "0";
    headDiv.style.padding = "10px 5px";
    headDiv.style.width = "100%";
    headDiv.style.fontSize = "1em";
    headDiv.style.fontWeight = "500";



    let titleDiv = document.createElement("div");
    titleDiv.textContent = titleText;
    titleDiv.style.margin = "auto .2em";
    headDiv.appendChild(titleDiv);

    return headDiv;
}
/*-----------------------------------------------------------------------------------
*  This function will auto generate message text for the required box
*---------------------------------------------------------------------------------*/
function GetBodyBox(bodyHTML) {
    let body = document.createElement("div");
    body.style.padding = "0";
    body.style.fontSize = ".85em";
    body.innerHTML = bodyHTML;
    return body;
}
/***********************************************************************************/
//**********************************************************************************/
//
//
//**********************************************************************************/
function animation(obj, animate) {
    let duration; let delay; let iteration; let fillMode;

    if (obj.dataset.animateDuration !== undefined) {
        duration = obj.dataset.animateDuration;
    } else if (arguments[2] !== undefined) {
        duration = arguments[2];
    } else { duration = 1000; }
    obj.style.animationDuration = duration + "ms";

    if (obj.dataset.animateDelay !== undefined) {
        delay = obj.dataset.animateDelay;
    } else if (arguments[3] !== undefined) {
        delay = arguments[3];
    } else { delay = 0; }
    obj.style.animationDelay = delay + "ms";

    if (obj.dataset.animateIteration !== undefined) {
        iteration = obj.dataset.animateIteration;
    } else if (arguments[4] !== undefined) {
        iteration = arguments[4];
    } else { iteration = 1; }
    if (iteration > 0) obj.style.animationIterationCount = iteration + "";
    else obj.style.animationIterationCount = "infinite";

    if (obj.dataset.animateFillmode !== undefined) {
        fillMode = obj.dataset.animateFillmode;
    } else if (arguments[5] !== undefined) {
        fillMode = arguments[5];
    } else { fillMode = "both"; }
    obj.style.animationFillMode = fillMode;




    obj.style.animationName = animate;
    if (iteration > 0) {
        setTimeout(() => {
            obj.style.animationName = "";
        }, parseInt(duration) * parseInt(iteration) + parseInt(delay));
    }
}
//**********************************************************************************/



/*****************************************************************************************/
//    * MODAL OPERATIONS
//    * -----------------------------------------------------------------------
//    *  SHOW MODAL function wil show model and will animate according to animation give from data-animation
//    * -----------------------------------------------------------------------------------***/
function ShowModal(modalID) {
    let modal = document.getElementById(modalID);
    modal.style.display = "block";
    modal.style.opacity = "1";
    modal.style.zIndex = "111";

    if (!document.body.classList.contains('hide-scrollbar')) document.body.classList.add('hide-scrollbar');


    let animate = modal.dataset.animate;
    let duration = 1000;
    if (modal.dataset.animateDuration !== undefined)
        duration = modal.dataset.animateDuration;
    let iteration = modal.dataset.iteration;

    if (animate !== undefined && modal.dataset.animation === 'true') {
        if (modal.dataset.animateRandom === 'true') animate = GetRandom(animate);
        /*if (modal.dataset.animation === 'true')*/ animation(modal.firstElementChild, animate, duration, 250, iteration);
    }

    SetDOMComponants(modalID);

}
/*-----------------------------------------------------------------------------------
*  HIDE MODAL function will hide model and will animate according to animation give from data-animation-end
*---------------------------------------------------------------------------------*/
function HideModal(modalID) {
    let modal = document.getElementById(modalID);


    let animate = modal.dataset.animateEnd;
    let duration = 1000;
    if (modal.dataset.animateDuration !== undefined)
        duration = modal.dataset.animateDuration;
    let iteration = modal.dataset.iteration;

    let timeOut;
    if (animate !== undefined) {
        if (modal.dataset.animateRandom === 'true') animate = GetRandom(animate);
        /*if (modal.dataset.animation === 'true')*/ animation(modal.firstElementChild, animate, duration, 0, iteration);
        timeOut = duration - 200;
    } else timeOut = 0;

    if (document.body.classList.contains('hide-scrollbar')) document.body.classList.remove('hide-scrollbar');


    setTimeout(() => {
        modal.style.opacity = "0";
        modal.style.zIndex = "-111";
        modal.style.display = "none";
    }, timeOut);
}
function GetRandom(animateString) {
    let randomArray = ["top", "right", "left", "bottom"];
    let random = parseInt(Math.random() * 4);
    if (random === 4) random = 3;
    animateString += "-" + randomArray[random];
    return animateString;
}
/***********************************************************************************/



/***********************************************************************************/
const pathCheck = `<path fill="var(--clr-green)" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/>`;
const pathTimes = `<path fill="var(--clr-red)" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"/>`;
function SetCheckboxes() {
    document.querySelectorAll('.checkbox').forEach(chkBx => {
        const svg = chkBx.querySelector('svg');
        svg.setAttribute("viewBox", "0 0 512 512");
        svg.setAttribute("width", "1em");
        svg.setAttribute("height", "1em");
        svg.classList.add('mr-10');
        const input = chkBx.querySelector('input');
        let trueLabel;
        let falseLabel;

        chkBx.querySelectorAll('label').forEach(lbl => {
            lbl.style.display = 'none';
            if (lbl.dataset.condition === 'true') trueLabel = lbl;
            else if (lbl.dataset.condition === 'false') falseLabel = lbl;
        });


        if (input.value.toLowerCase() === "true") {
            svg.innerHTML = pathCheck;
            trueLabel.style.display = "block";
        }
        else if (input.value.toLowerCase() === "false") {
            svg.innerHTML = pathTimes;
            falseLabel.style.display = "block";
        }
    });
}

function ToggleCheckBox(chkBx) {

    const svg = chkBx.querySelector('svg');
    const input = chkBx.querySelector('input');
    let trueLabel;
    let falseLabel;

    chkBx.querySelectorAll('label').forEach(lbl => {
        lbl.style.display = 'none';
        if (lbl.dataset.condition === 'true') trueLabel = lbl;
        else if (lbl.dataset.condition === 'false') falseLabel = lbl;
    });


    if (input.value.toLowerCase() === "true") {
        svg.innerHTML = pathTimes;
        trueLabel.style.display = "none";
        falseLabel.style.display = "block";
        input.value = "false";
    }
    else if (input.value.toLowerCase() === "false") {
        svg.innerHTML = pathCheck;
        trueLabel.style.display = "block";
        falseLabel.style.display = "none";
        input.value = "true";
    }

    return input.value;
}

/***********************************************************************************/








/***********************************************************************************/
const radioSVGPath = `<path fill="var(--clr-green)" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/>`;


function SetRadioButtons(radioBox) {
    const radioBtns = radioBox.querySelectorAll('button.radio-btn');
    radioBtns.forEach(rb => {
        const svg = rb.querySelector('svg');
        svg.setAttribute('width', '1em');
        svg.setAttribute('height', '1em');
        svg.setAttribute('viewBox', '0 0 512 512');
        svg.style.margin = 'auto .5em auto 0';

        const input = rb.querySelector('input');
        if (input.value.toLowerCase() === 'true') {
            svg.innerHTML = radioSVGPath;
        }
    });
}

function ToggleRadioButton(btn) {
    const radioBtns = btn.parentElement.querySelectorAll('button.radio-btn');
    radioBtns.forEach(rb => {
        rb.querySelector('svg').innerHTML = "";
        rb.querySelector('input').value === 'false';
    });

    const svg = btn.querySelector('svg').innerHTML = radioSVGPath;
    btn.querySelector('input').value = 'true';

}

function SetRadioBoxes() {
    const radioBoxes = document.querySelectorAll('.radio-box');
    radioBoxes.forEach(rb => SetRadioButtons(rb));
}

/***********************************************************************************/





/***********************************************************************************/

const multiChoiceSVGPath = `<path fill="currentcolor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"/>`;

function SetMultiChoiceButton(multiChoiceBox) {
    const multiChoiceBtns = multiChoiceBox.querySelectorAll('button.multi-choice-btn');
    multiChoiceBtns.forEach(mb => {
        const svg = mb.querySelector('svg');
        svg.setAttribute('width', '1em');
        svg.setAttribute('height', '1em');
        svg.setAttribute('viewBox', '0 0 512 512');
        svg.style.margin = 'auto .5em auto 0';

        const input = mb.querySelector('input');
        if (input.value.toLowerCase() === 'true') {
            svg.innerHTML = multiChoiceSVGPath;
        }
    });
}

function ToggleMultiChoiceButton(btn) {
    let input = btn.querySelector('input');
    const svg = btn.querySelector('svg');
    if (input.value.toLowerCase() === 'true') {
        svg.innerHTML = '';
        input.value = 'false';
        return false;
    } else {
        svg.innerHTML = multiChoiceSVGPath;
        input.value = 'true';
        return true;
    }
}

function SetMultiChoiceBoxes() {
    const multiChoiceBoxes = document.querySelectorAll('.multi-choice-box');
    multiChoiceBoxes.forEach(mb => SetMultiChoiceButton(mb));
}

/***********************************************************************************/






/************************************************************************************
 *   SOUND ANIMATION CIRCLES control for id="bgAudio" for BACKGROUND MUSIC
 ***********************************************************************************/
//let sound = parseInt(localStorage.getItem("sound"));
//if (isNaN(sound)) sound = 1;
//if (sound) {
//    let promise = document.getElementById("bgAudio").play();
//    if (promise !== undefined) {
//        promise.then(() => {
//            sound = 1;
//            localStorage.setItem("sound", 1);
//            document.querySelectorAll(".circles").forEach(c => c.style.animationName = "expand");
//            document.querySelector(".dot").style.borderWidth = "2px";
//        }).catch(err => {
//            AlertOnElement(document.querySelector("#bgAudioBtn"), "Background music paused by browser.", "Error from browser: " + err.message + ". Click to toggle sound.", 15000);
//            sound = 0;
//            localStorage.setItem("sound", 0);
//            document.querySelectorAll(".circles").forEach(c => {
//                c.style.animationName = "";
//                c.style.width = "0";
//                c.style.borderWidth = "0";
//            });
//            document.querySelector(".dot").style.borderWidth = "4px";
//        });
//    }
//} else stopSound();

//function startSound() {
//    sound = 1;
//    localStorage.setItem("sound", 1);
//    document.getElementById("bgAudio").play();
//    document.querySelectorAll(".circles").forEach(c => c.style.animationName = "expand");
//    document.querySelector(".dot").style.borderWidth = "2px";
//}
//function stopSound() {
//    sound = 0;
//    localStorage.setItem("sound", 0);
//    document.getElementById("bgAudio").pause();
//    document.querySelectorAll(".circles").forEach(c => {
//        c.style.animationName = "";
//        c.style.width = "0";
//        c.style.borderWidth = "0";
//    });
//    document.querySelector(".dot").style.borderWidth = "4px";
//}
//function toggleSound() {
//    if (sound) stopSound();
//    else startSound();
//}
/*******************************************************************************************************/











function PanelBodyHTML(targetObject, titleText, stringBodyHTML) {
    let panelHead = GetHeadBox(titleText);
    let panelBody = GetBodyBox(stringBodyHTML);
    let panelContainer = GetContentBox();
    panelContainer.appendChild(panelHead);
    panelContainer.appendChild(panelBody);

    let panelBox = GetBox();
    panelContainer = GetContainerBox(targetObject, panelContainer);
    panelBox.appendChild(panelContainer);
    panelBox.style.bottom = "2vh";
    panelBox.style.left = "2vw";
    panelBox.style.zIndex = "111";

    let closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('btn-close');
    closeButton.style.position = 'absolute';
    closeButton.style.right = '0';
    closeButton.style.top = '0';
    closeButton.style.padding = '.25em .5em';
    closeButton.innerHTML = `<i class="fas fa-times"></i>`;
    closeButton.addEventListener('click', () => {
        panelBox.style.opacity = '0';
        panelBox.style.zIndex = '-111';
    });
    panelBox.appendChild(closeButton);

    panelBox = SetBoxPosition(targetObject, panelBox);
    targetObject.parentElement.appendChild(panelBox);
    targetObject.addEventListener('click', () => { panelBox.style.opacity = "1"; });
}

function PanelBodyUploadFile(targetObjectSelector, titleText, uploadContolIdString, containerIdString) {
    let panelHead = GetHeadBox(titleText);
    panelHead.style.padding = '.25em .5em';
    //panelHead.style.margin = '.25em .5em';


    let panelBody = document.createElement('div');
    panelBody.style.padding = '.25em .5em';
    panelBody.style.margin = '.5em .25em';
    panelBody.appendChild(document.querySelector(uploadContolIdString));

    let appendTo = document.querySelector(containerIdString);

    let panelContainer = GetContentBox();
    panelContainer.appendChild(panelHead);
    panelContainer.appendChild(panelBody);
    panelContainer.style.width = getComputedStyle(appendTo).width * .9;

    let closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('btn-close');
    closeButton.style.position = 'absolute';
    closeButton.style.right = '.25em';
    closeButton.style.top = '.25em';
    closeButton.style.padding = '.25em .5em';
    closeButton.innerHTML = `<i class="fas fa-times"></i>`;
    closeButton.addEventListener('click', () => {
        panelBox.style.opacity = '0';
        panelBox.style.zIndex = '-111';
    });
    panelContainer.appendChild(closeButton);

    let panelBox = GetBox();
    //panelBox.style.padding = '.5em';
    panelContainer = GetContainerBox(targetObjectSelector, panelContainer);
    panelContainer.style.padding = '0';
    panelContainer.style.border = '.1em solid var(--clr-primary)';
    panelContainer.style.boxShadow = '.25em .25em .5em var(--clr-primary)';
    panelBox.appendChild(panelContainer);
    panelBox.style.zIndex = "111";
    //panelBox = SetBoxPosition(targetObjectSelector, panelBox);
    panelBox.style.width = getComputedStyle(appendTo).width * .9;
    appendTo.appendChild(panelBox);
    setTimeout(() => panelBox.style.opacity = "1", 50);
    setInterval(() => {
        if (panelBody.innerHTML === "")
            panelBox.remove();
    }, 100);
}

function InputBox(targetObject, titleText, inputTypeString, buttonText, buttonFunction) {
    let panelHead = GetHeadBox(titleText);
    let panelBody = document.createElement('div');
    panelBody.className = 'row p-10';


    let actionInput = document.createElement('input');
    actionInput.type = inputTypeString;
    actionInput.className = 'my-auto ml-0 mr-3';

    let actionButton = document.createElement('button');
    actionButton.type = 'button';
    actionButton.innerText = buttonText;
    actionButton.className = 'btn-link shadow-none my-auto ml-3 mr-0';
    actionButton.addEventListener('click', buttonFunction);

    console.log(targetObject.dataset.elementId);
    if (targetObject.dataset.elementId !== undefined || targetObject.dataset.elementId !== "") {
        actionInput.id = `input${targetObject.dataset.elementId}`;
        actionButton.id = `button${targetObject.dataset.elementId}`;
    }
    panelBody.appendChild(actionInput);
    panelBody.appendChild(actionButton);

    let panelContainer = GetContentBox();
    panelContainer.appendChild(panelHead);
    panelContainer.appendChild(panelBody);

    let panelBox = GetBox();
    panelContainer = GetContainerBox(targetObject, panelContainer);
    panelContainer.style.boxShadow = '0 0 .2em var(--clr-dark)';
    panelBox.appendChild(panelContainer);
    panelBox.style.opacity = '0';
    panelBox.style.zIndex = "-111";

    let closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('btn-close');
    closeButton.style.position = 'absolute';
    closeButton.style.right = '0';
    closeButton.style.top = '0';
    closeButton.style.padding = '.25em .5em';
    closeButton.innerHTML = `<i class="fas fa-times"></i>`;
    closeButton.addEventListener('click', () => {
        panelBox.style.opacity = '0';
        panelBox.style.zIndex = "-111";
    });
    panelContainer.appendChild(closeButton);

    panelBox = SetBoxPosition(targetObject, panelBox);
    targetObject.parentElement.appendChild(panelBox);
    setTimeout(() => {
        panelBox.style.opacity = "1";
        panelBox.style.zIndex = '111';
    }, 50);
}

function GetRandomID(length) {
    let id = '';
    const alpha = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        const cnt = parseInt(Math.random() * 26);
        const char = alpha.charAt(cnt);
        id += char;
    }
    return id;
}