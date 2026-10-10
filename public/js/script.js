(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (form.dataset.isSubmitting === 'true') {
                event.preventDefault()
                return
            }

            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else if (form.dataset.loadingText) {
                const submitButton = form.querySelector('button[type="submit"]')

                form.dataset.isSubmitting = 'true'

                if (submitButton) {
                    submitButton.disabled = true
                    submitButton.setAttribute('aria-busy', 'true')
                    submitButton.textContent = form.dataset.loadingText
                }
            }

            form.classList.add('was-validated')
        }, false)
    })

    document.querySelectorAll('[data-auto-submit] select').forEach(select => {
        select.addEventListener('change', () => select.form.requestSubmit())
    })
})()
