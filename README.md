# Stående vågor

En fristående webbsida för att utforska resonans i en sträng och i en pipa. Den använder vanlig HTML, CSS och JavaScript, utan byggsteg eller installation. Öppna `index.html` i en webbläsare för att köra sidan.

## Anpassa undervisningen

- **Undervisningstexter och visningsetiketter:** redigera `content.js`. Texten är uppdelad per system (sträng/pipa) och per begreppskort.
- **Resonansfysik:** redigera `physics.js`. Där finns villkoren för lika ändar respektive en öppen och en sluten ände. `approximateResonanceTolerance` i `content.js` anger hur nära ett resonansvärde våglängden behöver vara för att markeras (6 mm, så att reglagets steg på 1 cm fungerar även för våglängder som inte har två decimaler).
- **Utseende:** redigera `styles.css`.
- **Sidans struktur och kontroller:** redigera `index.html`; interaktionen finns i `app.js`.

Piplängden är 1,00 m och våglängdsreglaget går från 0,25 m till 2,50 m. Ändra `lengthMeters` i `content.js` om du vill laborera med en annan längd.

## Publicera på GitHub Pages

1. Lägg filerna i rotmappen i ett GitHub-repository.
2. Öppna repositoryts **Settings → Pages**.
3. Välj **Deploy from a branch**, välj `main` och mappen `/ (root)`, och spara.
4. När publiceringen är klar finns sidan på adressen som visas under Pages-inställningarna.

Sidan kräver ingen server eller installation; GitHub Pages kan publicera filerna direkt. Google Fonts används som en valfri extern font. Om den inte kan hämtas används systemets standardfont.
