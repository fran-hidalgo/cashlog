const alert = new Alert()
alert.title = "Cashlog"

alert.addAction("💰 Income")
alert.addAction("🧾 Expense")
alert.addAction("⚙️ Settings")

alert.addCancelAction("Cancel")

const choice = await alert.presentSheet()

switch (choice) {
    case 0: //Income
       await handleIncome()
       break     
    case 1: //Expense
        break
    case 2: //Settings
        break
}

// Handle Income
async function handleIncome() {
    const amountAlert = new Alert()
    amountAlert.title = "💰 Income"
    amountAlert.message = "Enter the amount you earned"

    amountAlert.addTextField("Amount", "0.00", "decimalPad")
    amountAlert.addAction("Next")
    amountAlert.addCancelAction("Cancel")

    const amountChoice = await amountAlert.presentAlert()
    if (amountChoice === -1) return

    const amount = parseFloat(amountAlert.textFieldValue(0))
    if (isNaN(amount) || amount <= 0) {
        const err = new Alert()
        err.title = "Importe no válido"
        err.addAction("OK")
        await err.presentAlert()
        return
    }

    // Step 2: date
    const dateAlert = new Alert()
    dateAlert.title = "📅 Fecha del ingreso"
    dateAlert.addAction("Hoy")
    dateAlert.addAction("Otra fecha")
    dateAlert.addCancelAction("Cancelar")

    const dateChoice = await dateAlert.presentAlert()
    if (dateChoice === -1) return

    let date
    if (dateChoice === 0) {
        date = formatDate(new Date())
    } else {
        const customAlert = new Alert()
        customAlert.title = "📅 Introduce la fecha"
        customAlert.message = "Formato: YYYY-MM-DD"
        customAlert.addTextField("Fecha", formatDate(new Date()))
        customAlert.addAction("Confirmar")
        customAlert.addCancelAction("Cancelar")

        const customChoice = await customAlert.presentAlert()
        if (customChoice === -1) return

        date = customAlert.textFieldValue(0)
    }

    // Step 3: confirm
    const confirm = new Alert()
    confirm.title = "¿Confirmar ingreso?"
    confirm.message = `Importe: ${amount.toFixed(2)} €\nFecha: ${date}`
    confirm.addAction("Guardar")
    confirm.addCancelAction("Cancelar")

    const confirmed = await confirm.presentAlert()
    if (confirmed === -1) return

    // TODO: save to tracker.json
    console.log(`Income saved: ${amount} on ${date}`)
}

// --- Helpers ---

function formatDate(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}