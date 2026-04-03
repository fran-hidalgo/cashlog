const alert = new Alert()
alert.title = "Cashlog"

alert.addAction("💰 Income")
alert.addAction("🧾 Expense")
alert.addAction("⚙️ Settings")

alert.addCancelAction("Cancel")

const choice = await alert.presentSheet()

switch (choice) {
    case 0: // Income
       await handleIncome()
       break
    case 1: // Expense
        break
    case 2: // Settings
        break
}

// Handle Income
async function handleIncome() {
    // Step 1: amount
    const amountAlert = new Alert()
    amountAlert.title = "💰 Income"
    amountAlert.message = "How much did you earn?"

    amountAlert.addTextField("Amount", "1429.45")
    amountAlert.addAction("Next")
    amountAlert.addCancelAction("Cancel")

    const amountChoice = await amountAlert.presentAlert()
    if (amountChoice === -1) return

    const amount = parseFloat(amountAlert.textFieldValue(0))
    if (isNaN(amount) || amount <= 0) {
        const err = new Alert()
        err.title = "Invalid amount"
        err.addAction("OK")
        await err.presentAlert()
        return
    }

    // Step 2: date
    const dateAlert = new Alert()
    dateAlert.title = "📅 Income date"
    dateAlert.addAction("Today")
    dateAlert.addAction("Other date")
    dateAlert.addCancelAction("Cancel")

    const dateChoice = await dateAlert.presentAlert()
    if (dateChoice === -1) return

    let date
    if (dateChoice === 0) {
        date = formatDate(new Date())
    } else {
        const customAlert = new Alert()
        customAlert.title = "📅 Enter the date"
        customAlert.message = "Format: YYYY-MM-DD"
        customAlert.addTextField("Date", formatDate(new Date()))
        customAlert.addAction("Confirm")
        customAlert.addCancelAction("Cancel")

        const customChoice = await customAlert.presentAlert()
        if (customChoice === -1) return

        date = customAlert.textFieldValue(0)
    }

    // Step 3: confirm
    const confirm = new Alert()
    confirm.title = "Confirm income?"
    confirm.message = `Amount: ${amount.toFixed(2)} €\nDate: ${date}`
    confirm.addAction("Save")
    confirm.addCancelAction("Cancel")

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