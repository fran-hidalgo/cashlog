# Cashlog — Project Context

## Descripción general

Cashlog es un sistema de seguimiento de gastos e ingresos personales diseñado para ejecutarse en **Scriptable** (iOS). Permite registrar movimientos económicos en tiempo real, organizarlos por ciclos de nómina, y visualizar el estado financiero mediante widgets nativos de iOS.

El objetivo personal detrás del sistema es controlar el ahorro mensual con vistas a financiar un máster.

---

## Arquitectura del sistema

El sistema consta de **tres scripts independientes** que comparten un único archivo de datos:

| Script | Archivo | Función |
|---|---|---|
| Entrada de datos | `tracker_input.js` | Menú interactivo para registrar ingresos, gastos y configurar límites |
| Widget compacto | `widget2x2.js` | Widget 2×2 de iOS — vista resumida |
| Widget extendido | `widget2x4.js` | Widget 2×4 de iOS — vista detallada |

Los tres scripts leen y/o escriben sobre un único archivo JSON: `tracker.json`.

---

## Estructura del JSON (`tracker.json`)

```json
{
    "goal": {
        "name": "Master profesional",
        "target_amount": 20000.00,
        "target_month": 1000.00,
        "deadline": "2027-12"
    },
    "account_balance": {
        "amount": 3500.00,
        "date": "2026-03-01"
    },
    "cycles": [
        {
            "id": "2026-03",
            "income": {
                "amount": 1400.00,
                "date": "2026-03-03"
            },
            "limits": {
                "variable": 300.00,
                "fuel": 80.00
            },
            "expenses": {
                "fixed": [
                    { "name": "Alquiler", "amount": 450.00, "date": "2026-03-03" }
                ],
                "variable": [
                    { "name": "Supermercado", "amount": 45.30, "date": "2026-03-05" }
                ],
                "fuel": [
                    { "amount": 40.00, "date": "2026-03-08" }
                ]
            }
        }
    ]
}
```

### Campos clave

- **`goal`** — Objetivo de ahorro: nombre, cantidad total, objetivo mensual y fecha límite.
- **`account_balance`** — Saldo de cuenta real en una fecha dada. Se actualiza manualmente.
- **`cycles`** — Array de ciclos. Cada ciclo comienza cuando se registra un ingreso (nómina).
  - **`id`** — Identificador del ciclo en formato `YYYY-MM`.
  - **`income`** — Ingreso que abre el ciclo (importe y fecha).
  - **`limits`** — Límites de gasto por categoría para ese ciclo.
  - **`expenses`** — Gastos del ciclo, separados en tres categorías.

---

## Categorías de gasto

| Categoría | Clave JSON | Descripción |
|---|---|---|
| Fijos | `fixed` | Suscripciones, seguros, gimnasio, alquiler — importes predecibles |
| Gasolina | `fuel` | Carburante — categoría propia por su variabilidad según uso y precio |
| Variables | `variable` | Ocio, comidas, ropa, farmacia — gastos discrecionales |

Cada categoría tiene un **límite configurable por ciclo** (`limits.variable`, `limits.fuel`). Los gastos fijos no tienen límite porque son importes conocidos de antemano.

---

## Lógica de ciclos

- Un **ciclo nuevo** se abre cada vez que se registra un ingreso.
- El `id` del ciclo coincide con el mes del ingreso (`YYYY-MM`).
- Todos los gastos registrados se asocian al ciclo activo (el más reciente).
- El sistema puede tener múltiples ciclos históricos en el array `cycles`.

---

## Script: `tracker_input.js`

Script principal de entrada de datos. Se ejecuta manualmente desde Scriptable.

### Menú principal

```
💰 Income
🧾 Expense
⚙️ Settings
Cancel
```

### Flujo de registro de ingreso (`handleIncome`)

1. Solicita importe (campo numérico).
2. Solicita fecha: "Today" o introducción manual en formato `YYYY-MM-DD`.
3. Muestra confirmación antes de guardar.
4. Crea un nuevo ciclo en `tracker.json` con el ingreso registrado.

### Flujo de registro de gasto (`handleExpense`)

**Pendiente de implementar.** Debe:
1. Solicitar categoría: Fixed / Fuel / Variable.
2. Solicitar nombre del gasto (no aplica para Fuel).
3. Solicitar importe.
4. Solicitar fecha.
5. Confirmar y guardar en el ciclo activo.

### Settings (`handleSettings`)

Permite configurar únicamente los **límites de gasto por categoría**:
- Límite de gastos variables (`limits.variable`)
- Límite de gasolina (`limits.fuel`)

> ⚠️ El Settings actual también permite editar el goal (nombre, target_amount, monthly savings). Ese comportamiento debe eliminarse. Settings solo debe gestionar límites.

---

## Scripts de widget: `widget2x2.js` y `widget2x4.js`

- Leen `tracker.json` para obtener el estado del ciclo activo.
- No escriben en el JSON.
- Maquetas de diseño disponibles en `.claude/design/widget/`.

### Datos que deben mostrar (pendiente de definir exactamente por widget)

- Gasto total del ciclo actual vs límites por categoría.
- Progreso hacia el objetivo de ahorro mensual.
- Saldo de cuenta (último valor registrado en `account_balance`).

---

## Estado actual del proyecto

| Componente | Estado |
|---|---|
| `tracker_input.js` — menú principal | ✅ Implementado |
| `tracker_input.js` — registro de ingreso | ✅ Implementado |
| `tracker_input.js` — registro de gasto | ✅ Implementado |
| `tracker_input.js` — settings (límites) | ✅ Implementado |
| `tracker.json` — lectura/escritura real | ✅ Implementado (FileManager.iCloud) |
| `widget2x2.js` | ❌ Pendiente |
| `widget2x4.js` | ❌ Pendiente |

---

## Convenciones

- Fechas siempre en formato `YYYY-MM-DD`.
- Importes en `float` con dos decimales.
- El ciclo activo es siempre el último elemento del array `cycles`.
- Idioma del código: inglés. Idioma de los nombres de gasto (datos): libre.