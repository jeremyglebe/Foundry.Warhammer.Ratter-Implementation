# Drowsy's WFRP4e Ratter Implementation

Foundry VTT content module implementing fan-created WFRP material from The Ratter magazine for the
WFRP4e system.

## Mutant's Handbook Automation

Gamemasters can enable **Use The Mutant's Handbook mutation rules** in Module Settings. It replaces
the standard Dissolution of Body and Mind aftermath with the Ratter #11 species, severity,
Corruption-loss, normal Fortune or Dark Deal choices, Resilience, Chosen patron, and Chaos Spawn
procedure, and adds rolled mutation Items to the character.

Phase 1 covers all 224 described mutation Items (137 physical and 87 mental); the source's
advertised 225 also counts Chosen of Chaos, a special outcome rather than an Item. It automates
fixed and rolled Characteristic changes, Movement, Wounds, Size and Armour, unconditional Test
modifiers, configured Skill/Talent/Trait grants, repeat limits and conflicts, and Self-Control
actions for eligible mental mutations. Every Item states exactly what is automated and supplies a
checklist for its remaining manual rules. The WFRP4e Core Rulebook content module is required for
Core grants, and Winds of Magic is recommended for the optional Augury and Psychometry grants.

Phase 2 resolves and retains mutation-specific rolls, subtables, choices, specialisations, body
sides and hit locations through one reusable dialog. It handles nested draws, repeat progressions,
unique/capped choices, configured Core grants, and shared upgrades. Blocked results offer Reroll,
Accept Anyway, or Cancel, and cancelling leaves both the Actor and Corruption unchanged.

Activated or contextual powers, combat hit routing, durations, auras, transformations, companions,
concealment, treatment, destructive species replacement, and Chaos Spawn conversion remain GM-facing
work for later automation phases.

Install or update the module with this manifest URL:

```text
https://github.com/jeremyglebe/FVTT-WFRP-Ratter-Content/releases/latest/download/module.json
```
