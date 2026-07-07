# C++ Akademia

Interaktywna strona do nauki C++: roadmapa od podstaw do samodzielnych zadan, edytor kodu, uruchamianie testow przez Judge0, podpowiedzi i zapis postepu w przegladarce.

## Uruchomienie lokalnie

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Hosting z GitHub Pages

Projekt ma gotowy workflow w `.github/workflows/pages.yml`. Po wypchnieciu repozytorium na branch `main` wlacz w ustawieniach repozytorium GitHub Pages z trybem `GitHub Actions`.

Aplikacja jest statyczna, wiec nadaje sie do GitHub Pages. Kompilowanie C++ odbywa sie przez publiczne API Judge0 CE (`https://ce.judge0.com`). W aplikacji mozna zmienic endpoint, jesli bedziesz chcial podpiac wlasna instancje Judge0.

## Zapis postepu

Postep, kod rozwiazan, nazwa uzytkownika i ustawienia kompilatora sa zapisywane w `localStorage` danej przegladarki.
