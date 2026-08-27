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

Phase 3 provides owned action Items for attacks and activated powers, native Tests, damage and
Miscast handling, targeting, use limits, and Advantage costs. Phase 4 adds a reroll-safe **Apply
Mutant’s Handbook Outcome** option to final action cards, consequential Conditions, follow-up Tests,
healing, timed state, aura and burst resolution actions, extra Bleeding, and deterministic hit
routing.

Phase 5 adds managed forms, explicit reversion, durations, temporary support Items, linked companion
Actors, Symbiotic Twin Wound synchronization, and Additional Head control Tests. Phase 6 classifies
every rule clause as automated or mutation-specific GM/player guidance, hardens repeat ownership and
migration, and uses the same acquisition path for corruption results and manual drag-and-drop on
character, NPC, and creature Actors. Narrative manifestation, concealment, treatment, destructive
species replacement, and Chaos Spawn conversion remain deliberate GM adjudication.

Install or update the module with this manifest URL:

```text
https://github.com/jeremyglebe/Foundry.Warhammer.Ratter-Implementation/releases/latest/download/module.json
```
