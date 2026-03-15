# Plan de implementación: Calculadora de coste de perks

## Contexto actual

- El patrón de dependencias por `parent` ya existe en el tech tree y se usa para construir jerarquía y validar desbloqueo por padre.
- Los perks se cargan desde `getPerks`.
- En los datos de perks existen padres "raíz" lógicos (por ejemplo: `Artillerist`, `Harvester`, `Hauler`, `Warlord`) que no son perks comprables, sino nodos de agrupación.

## Fase 1: Motor de cálculo reutilizable

Implementar un módulo puro `perkCostEngine` con estas funciones:

- `buildPerkGraph(perks)` → mapas `byName`, `childrenByParent`, `roots`.
- `getRequiredChain(perkName)` → devuelve ancestros necesarios.
- `computeTotalCost(selectedPerks)` → suma costes únicos de la clausura (seleccionados + prerequisitos).
- `canSelect(perkName, selectedSet)` → valida si el padre está cumplido o si es raíz lógica.
- `togglePerk(perkName, selectedSet)` → selecciona/deselecciona manteniendo consistencia.

## Fase 2: UI similar a tech

- Crear vista/componente de calculadora de perks.
- Mostrar lista/árbol por ramas (raíz lógica → perks encadenados).
- Permitir seleccionar perks auto-seleccionando prerequisitos.
- Permitir deseleccionar con limpieza en cascada de descendientes inválidos.
- Añadir resumen fijo con:
  - Puntos totales.
  - Perks seleccionados.
  - Coste incremental del próximo perk.

## Fase 3: UX y estado

- Persistir selección en `localStorage` (patrón similar a `skills-*`).
- Añadir acción de `Reset`.
- Opcional: compartir build por querystring.
- Accesibilidad:
  - `aria-pressed` en toggles.
  - foco visible.
  - navegación por teclado.

## Fase 4: Validación

Crear tests unitarios del motor para:

- Cadena simple `A → B → C`.
- Padres faltantes (raíces lógicas).
- Evitar doble conteo de prerequisitos compartidos.
- Limpieza en cascada al deseleccionar.
- Detección/manejo de ciclos.

Ejecutar verificación final:

- `lint`
- `typecheck`
- `build`

## Reglas de cálculo recomendadas

- Coste total = suma de `cost` de perks seleccionados + prerequisitos requeridos.
- Padres lógicos sin nodo perk propio tienen coste `0`.
- No permitir estado inválido (hijo seleccionado sin padre).
- Si se deselecciona un perk, limpiar descendientes inválidos.

## Criterios de aceptación

- Seleccionar cualquier perk devuelve el total correcto incluyendo su cadena de `parent`.
- No existen estados inválidos en UI ni en estado persistido.
- El total se actualiza en tiempo real.
- El estado se mantiene tras recarga.
- `lint`, `typecheck` y `build` pasan correctamente.
