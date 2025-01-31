---
playerLevel: 1
spellLevel: 1
baseDC: 15
baseSpellDC: 15
---


### DC by Proficiency

| Proficiency | DC  |
| ----------- | --- |
| Untrained   | 10  |
| Trained     | 15  |
| Expert      | 20  |
| Master      | 30  |
| Legendary   | 40  |

### DC Adjustments

| Difficulty      | Adjustment |
| --------------- | ---------- |
| Incredibly Easy | -10        |
| Very Easy       | -5         |
| Easy            | -2         |
| Normal          | 0          |
| Hard            | +2         |
| Very Hard       | +5         |
| Incredibly Hard | +10        |

### DC Calculator

DC Level: `INPUT[number:playerLevel]`

| Difficulty               | DC                                                                                                        |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| Incredibly Easy          | `VIEW[{baseDC} - 10]`                                                                                     |
| Very Easy                | `VIEW[{baseDC} - 5]`                                                                                      |
| Easy                     | `VIEW[{baseDC} - 2]`                                                                                      |
| Normal                   | `VIEW[({playerLevel} < 20 ? {playerLevel} + 14 + floor({playerLevel} / 3) : {playerLevel} * 2)][:baseDC]` |
| Hard (Uncommon)          | `VIEW[{baseDC} + 2]`                                                                                      |
| Very Hard (Rare)         | `VIEW[{baseDC} + 5]`                                                                                      |
| Incredibly Hard (Unique) | `VIEW[{baseDC} + 10]`                                                                                     |

Spell Level: `INPUT[number:spellLevel]`

| Spell Rarity | DC                                                                             |
| ------------ | ------------------------------------------------------------------------------ |
| Normal       | `VIEW[(({spellLevel} * 2 - 1) + 14 + floor(({spellLevel} * 2 - 1) / 3))][:baseSpellDC]`      |
| Uncommon     | `VIEW[{baseSpellDC} + 2]`  |
| Rare         | `VIEW[{baseSpellDC} + 5]`  |
| Unique       | `VIEW[{baseSpellDC} + 10]` |


