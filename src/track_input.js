const alert = new Alert()
alert.title = "Cashlog"

alert.addAction("💰 Income")
alert.addAction("🧾 Expense")
alert.addAction("⚙️ Settings")

alert.addCancelAction("Cancel")

const choice = await alert.presentSheet()

switch (choice) {
    case 0: //Income
        break
    case 1: //Expense
        break
    case 2: //Settings
        break
}