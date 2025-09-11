# Integration of `error-item.json` Elements into a New Project

## Purpose

Centralize error content (texts, buttons, links, icons) in a single `error-item.json` file serving as the source of truth.  
Import these elements into UI components (`button.json`, `typography.json`, `link.json`, `icon.json`) for a clean and modular integration.

## Manual Steps to Integrate `error-item.json` into a New Project

1. Copy the `error-item.json` file into the project’s `_data` folder or a shared location.

2. For each component type (`button`, `typography`, `link`, `icon`), open the corresponding JSON file (`button.json`, `typography.json`, etc.) in the components folder.

3. Browse the `error-item.json` file and for each element:  
   - Identify the `variant` (for example: `"variant": "button"`).  
   - Check if this element (`name`) already exists in the corresponding component file.  
   - If missing, copy the full element (name, content, spriteId, alt if icon, variant) into the component JSON file.  
   - If present, do not modify.

4. Save the JSON files.

5. Update `.njk` files if necessary, calling the newly added components, without modifying existing ones.

## Best Practices

- Always check for duplicates before adding.  
- Respect JSON syntax (commas, quotes, encoding).  
- Keep elements sorted alphabetically in JSON files for readability and maintenance.  
- Verify alt texts of icons for accessibility.  
- Never modify other parts of the project without approval.  
- Document significant changes in project tracking.

## Prompt to Use for Automation with Claude

```text
Tu vas travailler sur un projet web structuré avec des composants UI gérés par des fichiers JSON distincts selon le type : button.json, typography.json, link.json, icon.json.

Je te fournis un fichier principal error-item.json qui contient une liste d’éléments à intégrer dans l’interface, chacun ayant un champ variant qui précise à quel fichier JSON ils appartiennent (button, typography, link, icon).

Ta tâche est d’ajouter uniquement dans chaque fichier JSON composants la ou les nouvelles entrées correspondant aux éléments de error-item.json selon leur variant.

- Ne modifie rien d’autre dans ces fichiers, ne supprime rien, ne touche pas aux entrées existantes.
- Ajoute une seule fois chaque élément, en préservant la cohérence et la structure JSON.
- Si une entrée existe déjà dans un fichier, ne la duplique pas.
- Ensuite, si nécessaire, ajoute dans les fichiers .njk correspondants un appel à ces nouveaux composants, mais uniquement pour les nouveaux, sans modifier ni casser le reste.
- Ne touche à rien d’autre dans le projet.
- Respecte strictement la structure et la syntaxe JSON et Nunjucks existantes.
- Ta priorité : ne rien casser, rester très conservateur dans les modifications.

En résumé, tu fais un import intelligent et sélectif des éléments de error-item.json dans les composants concernés, avec un minimum de risque.

Si tu comprends cette tâche, réponds simplement "Prêt à importer les composants error-item".
```

## Conclusion

This method ensures a clean, modular, and reproducible integration of error elements into your web projects, maintaining a single source of truth (`error-item.json`) and a clear separation of components.

---
