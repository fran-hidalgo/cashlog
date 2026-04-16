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
        await handleExpense()
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

    const data = loadData() || { goal: {}, account_balance: {}, cycles: [] }
    const cycleId = date.substring(0, 7)
    data.cycles.push({
        id: cycleId,
        income: { amount, date },
        limits: { variable: 0, fuel: 0 },
        expenses: { fixed: [], variable: [], fuel: [] }
    })
    saveData(data)
}

// Handle Expense
async function handleExpense() {
    const data = loadData()
    if (!data || data.cycles.length === 0) {
        const err = new Alert()
        err.title = "No active cycle"
        err.message = "Register an income first."
        err.addAction("OK")
        await err.presentAlert()
        return
    }

    // Step 1: category
    const catAlert = new Alert()
    catAlert.title = "🧾 Expense"
    catAlert.message = "Select a category"
    catAlert.addAction("Fixed")
    catAlert.addAction("Fuel")
    catAlert.addAction("Variable")
    catAlert.addCancelAction("Cancel")

    const catChoice = await catAlert.presentSheet()
    if (catChoice === -1) return

    const categoryMap = { 0: "fixed", 1: "fuel", 2: "variable" }
    const category = categoryMap[catChoice]

    // Step 2: name (not for fuel)
    let name = null
    if (category !== "fuel") {
        const nameAlert = new Alert()
        nameAlert.title = "📝 Expense name"
        nameAlert.addTextField("Name", "")
        nameAlert.addAction("Next")
        nameAlert.addCancelAction("Cancel")

        const nameChoice = await nameAlert.presentAlert()
        if (nameChoice === -1) return

        name = nameAlert.textFieldValue(0).trim()
        if (name.length === 0) {
            const err = new Alert()
            err.title = "Invalid name"
            err.addAction("OK")
            await err.presentAlert()
            return
        }
    }

    // Step 3: amount
    const amountAlert = new Alert()
    amountAlert.title = "💶 Amount"
    amountAlert.addTextField("Amount", "")
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

    // Step 4: date
    const dateAlert = new Alert()
    dateAlert.title = "📅 Expense date"
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

    // Step 5: confirm
    const categoryLabels = { fixed: "Fixed", fuel: "Fuel", variable: "Variable" }
    const nameLine = name ? `Name: ${name}\n` : ""
    const confirm = new Alert()
    confirm.title = "Confirm expense?"
    confirm.message = `Category: ${categoryLabels[category]}\n${nameLine}Amount: ${amount.toFixed(2)} €\nDate: ${date}`
    confirm.addAction("Save")
    confirm.addCancelAction("Cancel")

    const confirmed = await confirm.presentAlert()
    if (confirmed === -1) return

    const cycle = data.cycles[data.cycles.length - 1]
    const entry = name ? { name, amount, date } : { amount, date }
    cycle.expenses[category].push(entry)
    saveData(data)
}

// Handle Settings
async function handleSettings() {
    const data = loadData()
    if (!data || data.cycles.length === 0) {
        const err = new Alert()
        err.title = "No active cycle"
        err.message = "Register an income first."
        err.addAction("OK")
        await err.presentAlert()
        return
    }

    const cycle = data.cycles[data.cycles.length - 1]
    const limits = cycle.limits

    const menu = new Alert()
    menu.title = "⚙️ Settings"
    menu.addAction(`Variable limit (${limits.variable.toFixed(2)} €)`)
    menu.addAction(`Fuel limit (${limits.fuel.toFixed(2)} €)`)
    menu.addCancelAction("Cancel")

    const choice = await menu.presentAlert()
    if (choice === -1) return

    const limitKey = choice === 0 ? "variable" : "fuel"
    const limitLabel = choice === 0 ? "Variable limit" : "Fuel limit"

    const limitAlert = new Alert()
    limitAlert.title = limitLabel
    limitAlert.addTextField("Amount", limits[limitKey].toFixed(2))
    limitAlert.addAction("Save")
    limitAlert.addCancelAction("Cancel")

    const confirmed = await limitAlert.presentAlert()
    if (confirmed === -1) return

    const value = parseFloat(limitAlert.textFieldValue(0))
    if (isNaN(value) || value < 0) {
        const err = new Alert()
        err.title = "Invalid amount"
        err.addAction("OK")
        await err.presentAlert()
        return
    }

    limits[limitKey] = value
    saveData(data)
}

// --- Helpers ---

function formatDate(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${y}-${m}-${day}`
}

function loadData() {
    const fm = FileManager.iCloud()
    const path = fm.joinPath(fm.documentsDirectory(), "tracker.json")
    if (!fm.fileExists(path)) return null
    return JSON.parse(fm.readString(path))
}

function saveData(data) {
    const fm = FileManager.iCloud()
    const path = fm.joinPath(fm.documentsDirectory(), "tracker.json")
    fm.writeString(path, JSON.stringify(data, null, 2))
}
