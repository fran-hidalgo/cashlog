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
        await handleSettings()
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

// Handle Settings
async function handleSettings() {
    // TODO: load current values from tracker.json
    const current = {
        name: "Master profesional",
        targetAmount: 20000.00,
        monthlySavings: 400.00
    }

    const menu = new Alert()
    menu.title = "⚙️ Settings"
    menu.addAction(`Goal name: ${current.name}`)
    menu.addAction(`Target amount: ${current.targetAmount.toFixed(2)} €`)
    menu.addAction(`Monthly savings target: ${current.monthlySavings.toFixed(2)} €`)
    menu.addCancelAction("Cancel")

    const choice = await menu.presentAlert()
    if (choice === -1) return

    if (choice === 0) {
        const nameAlert = new Alert()
        nameAlert.title = "Goal name"
        nameAlert.addTextField("Name", current.name)
        nameAlert.addAction("Save")
        nameAlert.addCancelAction("Cancel")

        const confirmed = await nameAlert.presentAlert()
        if (confirmed === -1) return

        current.name = nameAlert.textFieldValue(0)
    }

    if (choice === 1) {
        const amountAlert = new Alert()
        amountAlert.title = "Target amount"
        amountAlert.addTextField("Amount", current.targetAmount.toFixed(2))
        amountAlert.addAction("Save")
        amountAlert.addCancelAction("Cancel")

        const confirmed = await amountAlert.presentAlert()
        if (confirmed === -1) return

        const value = parseFloat(amountAlert.textFieldValue(0))
        if (!isNaN(value) && value > 0) current.targetAmount = value
    }

    if (choice === 2) {
        const savingsAlert = new Alert()
        savingsAlert.title = "Monthly savings target"
        savingsAlert.addTextField("Amount", current.monthlySavings.toFixed(2))
        savingsAlert.addAction("Save")
        savingsAlert.addCancelAction("Cancel")

        const confirmed = await savingsAlert.presentAlert()
        if (confirmed === -1) return

        const value = parseFloat(savingsAlert.textFieldValue(0))
        if (!isNaN(value) && value > 0) current.monthlySavings = value
    }

    // TODO: save updated values to tracker.json
    console.log(`Settings saved: ${JSON.stringify(current)}`)
}

// --- Helpers ---

function formatDate(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}