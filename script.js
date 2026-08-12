const copyButtons = document.querySelectorAll(".copy-button");

copyButtons.forEach((button) => {

    button.addEventListener("click", async () => {

        const textToCopy = button.dataset.copy;

        try {

            await navigator.clipboard.writeText(textToCopy);

            const originalText = button.textContent;

            button.textContent = "Copied!";

            button.classList.add("copied");

            setTimeout(() => {

                button.textContent = originalText;

                button.classList.remove("copied");

            }, 1500);

        } catch (error) {

            button.textContent = "Copy failed";

            setTimeout(() => {

                button.textContent =
                    "Copy Discord Username";

            }, 1500);

        }

    });

});