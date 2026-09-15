/* =========================================
   ELEMENTS
   ========================================= */

const fileInput =
    document.getElementById("fileInput");

const dropArea =
    document.getElementById("dropArea");

const previewContainer =
    document.getElementById("previewContainer");

const imagePreview =
    document.getElementById("imagePreview");

const removeImageBtn =
    document.getElementById("removeImageBtn");

const socialImage =
    document.getElementById("socialImage");

const socialImagePlaceholder =
    document.getElementById("socialImagePlaceholder");

const generateBtn =
    document.getElementById("generateBtn");

const generateText =
    document.getElementById("generateText");

const loader =
    document.getElementById("loader");

const captionLanguage =
    document.getElementById("captionLanguage");

const captionBox =
    document.getElementById("captionBox");

const socialCaption =
    document.getElementById("socialCaption");

const platformInput =
    document.getElementById("platform");

const statusMessage =
    document.getElementById("statusMessage");

const copyBtn =
    document.getElementById("copyBtn");

const captionStyle =
    document.getElementById("captionStyle");

const captionLength =
    document.getElementById("captionLength");

const postTime =
    document.getElementById("postTime");

const socialHashtags =
    document.getElementById("socialHashtags");

const hashtagBtn =
    document.getElementById("hashtagBtn");

const emojiBtn =
    document.getElementById("emojiBtn");

const translateBtn =
    document.getElementById("translateBtn");

const translationPanel =
    document.getElementById("translationPanel");

const languageSelect =
    document.getElementById("languageSelect");

const doTranslateBtn =
    document.getElementById("doTranslateBtn");

const translatedBox =
    document.getElementById("translatedBox");


/* =========================================
   PLATFORM ACTIONS
   ========================================= */

const platformButtons =
    document.querySelectorAll(".platform-option");

const instagramActions =
    document.getElementById("instagramActions");

const facebookActions =
    document.getElementById("facebookActions");

const xActions =
    document.getElementById("xActions");

const linkedinActions =
    document.getElementById("linkedinActions");


/* =========================================
   SELECTED FILE
   ========================================= */

let selectedFile = null;

let currentImageURL = null;


/* =========================================
   FILE VALIDATION
   ========================================= */

function isValidImage(file) {

    if (!file) {
        return false;
    }

    return file.type.startsWith("image/");

}


/* =========================================
   SHOW STATUS
   ========================================= */

function showStatus(message) {

    if (statusMessage) {
        statusMessage.textContent = message;
    }

}


/* =========================================
   HANDLE IMAGE
   ========================================= */

function handleFile(file) {

    if (!file) {
        return;
    }


    /* CHECK IMAGE */

    if (!isValidImage(file)) {

        showStatus(
            "Please select a valid image file."
        );

        return;
    }


    /* SAVE FILE */

    selectedFile = file;


    /* ENABLE BUTTON */

    if (generateBtn) {
        generateBtn.disabled = false;
    }


    /* CREATE IMAGE URL */

    if (currentImageURL) {
        URL.revokeObjectURL(currentImageURL);
    }

    currentImageURL =
        URL.createObjectURL(file);


    /* =====================================
       LEFT PREVIEW
       ===================================== */

    if (imagePreview) {

        imagePreview.src =
            currentImageURL;

    }


    if (previewContainer) {

        previewContainer.style.display =
            "block";

    }


    /* =====================================
       SOCIAL PREVIEW IMAGE
       ===================================== */

    if (socialImage) {

        socialImage.src =
            currentImageURL;

        socialImage.style.display =
            "block";

    }


    if (socialImagePlaceholder) {

        socialImagePlaceholder.style.display =
            "none";

    }


    /* STATUS */

    showStatus(
        `Image selected: ${file.name}`
    );

}


/* =========================================
   FILE INPUT
   ========================================= */

if (fileInput) {

    fileInput.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            handleFile(file);

        }
    );

}


/* =========================================
   DROP AREA CLICK
   ========================================= */

if (dropArea) {

    dropArea.addEventListener(
        "click",
        function (event) {

            /*
             * Do not trigger the file picker
             * when the user clicks the Browse
             * Files label.
             */

            if (
                event.target.closest(
                    ".browse-button"
                )
            ) {
                return;
            }

            fileInput.click();

        }
    );

}


/* =========================================
   DRAG OVER
   ========================================= */

if (dropArea) {

    dropArea.addEventListener(
        "dragover",
        function (event) {

            event.preventDefault();

            dropArea.classList.add(
                "drag-over"
            );

        }
    );

}


/* =========================================
   DRAG LEAVE
   ========================================= */

if (dropArea) {

    dropArea.addEventListener(
        "dragleave",
        function () {

            dropArea.classList.remove(
                "drag-over"
            );

        }
    );

}


/* =========================================
   DROP
   ========================================= */

if (dropArea) {

    dropArea.addEventListener(
        "drop",
        function (event) {

            event.preventDefault();

            dropArea.classList.remove(
                "drag-over"
            );


            const file =
                event.dataTransfer.files[0];


            handleFile(file);

        }
    );

}


/* =========================================
   REMOVE IMAGE
   ========================================= */

if (removeImageBtn) {

    removeImageBtn.addEventListener(
        "click",
        function () {

            selectedFile = null;


            if (currentImageURL) {

                URL.revokeObjectURL(
                    currentImageURL
                );

                currentImageURL = null;

            }


            /* LEFT PREVIEW */

            if (imagePreview) {
                imagePreview.src = "";
            }


            if (previewContainer) {

                previewContainer.style.display =
                    "none";

            }


            /* SOCIAL PREVIEW */

            if (socialImage) {

                socialImage.src = "";

                socialImage.style.display =
                    "none";

            }


            if (socialImagePlaceholder) {

                socialImagePlaceholder.style.display =
                    "flex";

            }


            /* DISABLE GENERATE */

            if (generateBtn) {
                generateBtn.disabled = true;
            }


            /* RESET INPUT */

            if (fileInput) {
                fileInput.value = "";
            }


            showStatus(
                "Image removed."
            );

        }
    );

}


/* =========================================
   PLATFORM SELECTION
   ========================================= */

platformButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                platformButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                this.classList.add(
                    "active"
                );


                const selectedPlatform =
                    this.dataset.platform;


                if (platformInput) {

                    platformInput.value =
                        selectedPlatform;

                }


                updateSocialPreview(
                    selectedPlatform
                );

            }
        );

    }
);


/* =========================================
   UPDATE SOCIAL PLATFORM
   ========================================= */

function updateSocialPreview(platform) {


    /* HIDE ALL */

    if (instagramActions) {
        instagramActions.style.display =
            "none";
    }

    if (facebookActions) {
        facebookActions.style.display =
            "none";
    }

    if (xActions) {
        xActions.style.display =
            "none";
    }

    if (linkedinActions) {
        linkedinActions.style.display =
            "none";
    }


    /* SHOW SELECTED */

    if (platform === "Instagram") {

        instagramActions.style.display =
            "flex";

    }

    else if (platform === "Facebook") {

        facebookActions.style.display =
            "flex";

    }

    else if (platform === "X") {

        xActions.style.display =
            "flex";

    }

    else if (platform === "LinkedIn") {

        linkedinActions.style.display =
            "flex";

    }

}

function updateTextDirection(language, element) {

    if (!element) return;

    if (language === "Arabic") {
        element.setAttribute("dir", "rtl");
        element.classList.add("rtl-text");
    } else {
        element.setAttribute("dir", "ltr");
        element.classList.remove("rtl-text");
    }
}


/* =========================================
   GENERATE CAPTION
   ========================================= */

if (generateBtn) {

    generateBtn.addEventListener(
        "click",
        async function () {

            if (!selectedFile) {

                showStatus(
                    "Please upload an image first."
                );

                return;
            }


            /* LOADING */

            generateBtn.disabled = true;

            if (generateText) {

                generateText.style.display =
                    "none";

            }

            if (loader) {

                loader.style.display =
                    "inline-block";

            }

            showStatus(
                "Generating your caption..."
            );


            /* =================================
               FORM DATA
               ================================= */

            const formData =
                new FormData();


            formData.append(
                "image",
                selectedFile
            );


            formData.append(
                "platform",
                platformInput.value
            );


            formData.append(
                "captionStyle",
                captionStyle.value
            );

            formData.append(
                "captionLanguage",
                captionLanguage.value
            );

            formData.append(
                "captionLength",
                captionLength.value
            );


            try {


                /*
                 * IMPORTANT:
                 *
                 * This is your Tomcat servlet.
                 *
                 * If your application name is
                 * captioncraft, this URL is correct.
                 */

                const response =
                    await fetch(
                        "/captioncraft/CaptionServlet",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                /* CHECK RESPONSE */

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        `Server error: ${response.status}`
                    );

                }


                /* GET RESPONSE */

                const result =
                    await response.text();


                console.log(
                    "Servlet response:",
                    result
                );


                /*
                 * If your servlet returns plain
                 * caption text, use it directly.
                 */

                const caption =
                    result.trim();


                if (!caption) {

                    throw new Error(
                        "The server returned an empty caption."
                    );

                }


                /* =================================
                   DISPLAY CAPTION
                   ================================= */

                if (captionBox) {

                    captionBox.value =
                        caption;

                }


                if (socialCaption) {

                    socialCaption.textContent =
                        caption;

                }
                

                /* TIME */

                if (postTime) {

                    postTime.textContent =
                        "Just now";

                }


                showStatus(
                    "Caption generated successfully! ✨"
                );


            }

            catch (error) {

                console.error(
                    "Caption generation error:",
                    error
                );


                showStatus(
                    "Error: " + error.message
                );

            }

            finally {

                generateBtn.disabled =
                    !selectedFile;


                if (generateText) {

                    generateText.style.display =
                        "inline";

                }


                if (loader) {

                    loader.style.display =
                        "none";

                }

            }

        }
    );

}


/* =========================================
   COPY CAPTION
   ========================================= */

if (copyBtn) {

    copyBtn.addEventListener(
        "click",
        async function () {

            const caption =
                captionBox.value.trim();


            if (!caption) {

                showStatus(
                    "There is no caption to copy."
                );

                return;
            }


            try {

                await navigator.clipboard.writeText(
                    caption
                );


                copyBtn.textContent =
                    "✓ Copied";


                setTimeout(
                    function () {

                        copyBtn.textContent =
                            "📋 Copy";

                    },
                    1500
                );


                showStatus(
                    "Caption copied!"
                );

            }

            catch (error) {

                console.error(error);

                showStatus(
                    "Unable to copy caption."
                );

            }

        }
    );

}


/* =========================================
   HASHTAG BUTTON
   ========================================= */

if (hashtagBtn) {

    hashtagBtn.addEventListener(
        "click",
        function () {

            if (!captionBox.value.trim()) {

                showStatus(
                    "Generate a caption first."
                );

                return;
            }


            const hashtags =
                "#CaptionCraft #AI #Photography #Creative";


            socialHashtags.textContent =
                hashtags;

            const selectedLanguage =
                document.getElementById("captionLanguage").value;

            updateTextDirection(selectedLanguage, socialHashtags);


            showStatus(
                "Hashtags added."
            );

        }
    );

}


/* =========================================
   EMOJI BUTTON
   ========================================= */

if (emojiBtn) {

    emojiBtn.addEventListener(
        "click",
        function () {

            if (!captionBox.value.trim()) {

                showStatus(
                    "Generate a caption first."
                );

                return;
            }


            captionBox.value +=
                " ✨📸❤️";


            socialCaption.textContent =
                captionBox.value;


            showStatus(
                "Emojis added."
            );

        }
    );

}


/* =========================================
   TRANSLATION PANEL
   ========================================= */

if (translateBtn) {

    translateBtn.addEventListener(
        "click",
        function () {

            if (
                translationPanel.style.display ===
                "none"
            ) {

                translationPanel.style.display =
                    "block";

            }

            else {

                translationPanel.style.display =
                    "none";

            }

        }
    );

}


/* =========================================
   TRANSLATE CAPTION
   ========================================= */

if (doTranslateBtn) {

    doTranslateBtn.addEventListener(
        "click",
        async function () {

            const caption =
                captionBox.value.trim();

            const language =
                languageSelect.value;


            /* CHECK CAPTION */

            if (!caption) {

                showStatus(
                    "Generate a caption first."
                );

                return;
            }


            /* LOADING */

            doTranslateBtn.disabled = true;

            doTranslateBtn.textContent =
                "Translating...";


            showStatus(
                "Translating caption..."
            );


            /* FORM DATA */

            const formData =
                new FormData();

            formData.append(
                "action",
                "translate"
            );

            formData.append(
                "caption",
                caption
            );

            formData.append(
                "language",
                language
            );


            try {

                /*
                 * IMPORTANT:
                 * Use the SAME Tomcat application
                 * that is working for caption generation.
                 */

                const response =
                    await fetch(
                        "/captioncraft/CaptionServlet",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                /* CHECK SERVER RESPONSE */

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        `Server error: ${response.status}`
                    );

                }


                /* GET TRANSLATION */

                const translated =
                    await response.text();


                console.log(
                    "Translation response:",
                    translated
                );


                if (!translated.trim()) {

                    throw new Error(
                        "Server returned an empty translation."
                    );

                }


                /* DISPLAY */

                translatedBox.value =
                    translated.trim();


                showStatus(
                    `Caption translated to ${language}! 🌐`
                );


            }

            catch (error) {

                console.error(
                    "Translation error:",
                    error
                );


                showStatus(
                    "Translation error: " +
                    error.message
                );

            }

            finally {

                doTranslateBtn.disabled =
                    false;

                doTranslateBtn.textContent =
                    "Translate";

            }

        }
    );

}
/* =========================================
   INITIAL STATE
   ========================================= */

updateSocialPreview(
    "Instagram"
);






// =========================================
// CAPTION LANGUAGE
// =========================================

if (captionLanguage) {

    captionLanguage.addEventListener("change", function () {

        const language = this.value;

        updateTextDirection(language, captionBox);
        updateTextDirection(language, socialCaption);
        updateTextDirection(language, socialHashtags);

    });
}


// =========================================
// TRANSLATION LANGUAGE
// =========================================

if (languageSelect) {

    languageSelect.addEventListener(
        "change",
        function () {

            const language = this.value;

            if (translatedBox) {

                if (language === "Arabic") {

                    translatedBox.classList.add("rtl-text");
                    translatedBox.setAttribute("dir", "rtl");

                } else {

                    translatedBox.classList.remove("rtl-text");
                    translatedBox.setAttribute("dir", "ltr");

                }

            }

        }
    );

}