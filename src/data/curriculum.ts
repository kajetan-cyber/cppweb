import type { Exercise, Stage } from "../types";

export const stages: Stage[] = [
  {
    id: "start",
    title: "Start w C++",
    subtitle: "Wejscie, wyjscie, zmienne",
    description:
      "Pierwsze programy, czytanie danych i pewnosc, ze rozumiesz przeplyw od wejscia do wyniku.",
    outcomes: ["cout i cin", "typy liczbowe", "proste obliczenia"],
    accent: "#0f9f8f",
  },
  {
    id: "control",
    title: "Sterowanie",
    subtitle: "Warunki i petle",
    description:
      "Decyzje w kodzie, powtarzanie operacji i budowanie programu, ktory reaguje na dane.",
    outcomes: ["if / else", "for i while", "przypadki brzegowe"],
    accent: "#dc6b36",
  },
  {
    id: "structures",
    title: "Dane",
    subtitle: "Funkcje, tablice, wektory",
    description:
      "Rozbijanie problemu na funkcje i praca na kolekcjach danych, bez przepisywania tych samych fragmentow.",
    outcomes: ["funkcje", "tablice", "vector"],
    accent: "#3d7cc9",
  },
  {
    id: "algorithms",
    title: "Algorytmy",
    subtitle: "Szukaj wzorca, nie zgaduj",
    description:
      "Klasyczne zadania, ktore ucza myslenia o zlozonosci i odpornosci rozwiazania.",
    outcomes: ["NWD", "liczby pierwsze", "wyszukiwanie"],
    accent: "#8b6f2b",
  },
  {
    id: "advanced",
    title: "Zaawansowanie",
    subtitle: "STL i strategie",
    description:
      "Praktyczne uzycie sortowania, map, zbiorow i technik znanych z zadan rekrutacyjnych.",
    outcomes: ["sort", "map / set", "two pointers"],
    accent: "#8758a5",
  },
  {
    id: "independent",
    title: "Samodzielnosc",
    subtitle: "Male projekty algorytmiczne",
    description:
      "Zadania laczace kilka technik naraz, z naciskiem na plan, testowanie i czytelny kod.",
    outcomes: ["dekompozycja", "walidacja wyniku", "dobor struktur"],
    accent: "#ad3f63",
  },
];

export const exercises: Exercise[] = [
  {
    id: "hello-name",
    stageId: "start",
    title: "Powitanie uzytkownika",
    difficulty: "Latwe",
    xp: 40,
    minutes: 8,
    concepts: ["iostream", "string", "cout"],
    brief: "Napisz pierwszy program, ktory czyta imie i wypisuje powitanie.",
    task: "Program ma wczytac jedno slowo: imie. Wypisz dokladnie: Witaj <imie>.",
    inputFormat: "Jedno slowo bez spacji.",
    outputFormat: "Linia w formacie: Witaj Ola",
    starterCode: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    cin >> name;

    // wypisz powitanie

    return 0;
}
`,
    hints: [
      "Do wypisywania tekstu uzyj cout.",
      "Mozesz laczyc tekst i zmienna operatorem <<.",
      "Poprawna linia wyglada tak: cout << \"Witaj \" << name << endl;",
    ],
    tests: [
      { name: "Proste imie", input: "Ola", expectedOutput: "Witaj Ola" },
      { name: "Inne imie", input: "Kuba", expectedOutput: "Witaj Kuba" },
      { name: "Test ukryty", input: "Ada", expectedOutput: "Witaj Ada", hidden: true },
    ],
  },
  {
    id: "sum-two",
    stageId: "start",
    title: "Suma dwoch liczb",
    difficulty: "Latwe",
    xp: 45,
    minutes: 10,
    concepts: ["int", "cin", "operatory"],
    brief: "Wczytaj dwie liczby calkowite i wypisz ich sume.",
    task: "Na wejsciu sa dwie liczby calkowite a i b. Wypisz jedna liczbe: a + b.",
    inputFormat: "Dwie liczby calkowite oddzielone spacja.",
    outputFormat: "Jedna liczba calkowita.",
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;

    // oblicz i wypisz sume

    return 0;
}
`,
    hints: [
      "Po wczytaniu masz dwie zmienne: a oraz b.",
      "Sume obliczysz operatorem +.",
      "Wystarczy: cout << a + b << endl;",
    ],
    tests: [
      { name: "Dodatnie", input: "2 5", expectedOutput: "7" },
      { name: "Z ujemna", input: "-3 8", expectedOutput: "5" },
      { name: "Zera", input: "0 0", expectedOutput: "0", hidden: true },
    ],
  },
  {
    id: "temperature",
    stageId: "start",
    title: "Celsius na Fahrenheit",
    difficulty: "Latwe",
    xp: 50,
    minutes: 12,
    concepts: ["double", "wzor", "fixed"],
    brief: "Przelicz temperature i wypisz wynik z jedna cyfra po przecinku.",
    task: "Wczytaj temperature w stopniach Celsjusza i wypisz temperature w Fahrenheitach wedlug wzoru F = C * 9 / 5 + 32. Wynik wypisz z jedna cyfra po przecinku.",
    inputFormat: "Jedna liczba rzeczywista.",
    outputFormat: "Jedna liczba z jedna cyfra po przecinku.",
    starterCode: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    double celsius;
    cin >> celsius;

    // oblicz fahrenheity

    return 0;
}
`,
    hints: [
      "Do ustawienia liczby miejsc po przecinku uzyj fixed oraz setprecision(1).",
      "Pamietaj, aby uzyc double, bo wynik moze miec czesc ulamkowa.",
      "Wypisanie moze wygladac tak: cout << fixed << setprecision(1) << fahrenheit << endl;",
    ],
    tests: [
      { name: "Zero", input: "0", expectedOutput: "32.0" },
      { name: "Temperatura pokojowa", input: "20", expectedOutput: "68.0" },
      { name: "Ujemna", input: "-10", expectedOutput: "14.0", hidden: true },
    ],
  },
  {
    id: "parity",
    stageId: "control",
    title: "Parzysta czy nie",
    difficulty: "Latwe",
    xp: 55,
    minutes: 12,
    concepts: ["if", "modulo", "warunek"],
    brief: "Podejmij decyzje na podstawie reszty z dzielenia.",
    task: "Wczytaj liczbe calkowita n. Jesli jest parzysta, wypisz PARZYSTA, w przeciwnym razie wypisz NIEPARZYSTA.",
    inputFormat: "Jedna liczba calkowita.",
    outputFormat: "PARZYSTA albo NIEPARZYSTA.",
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    // sprawdz parzystosc

    return 0;
}
`,
    hints: [
      "Operator % zwraca reszte z dzielenia.",
      "Liczba jest parzysta, gdy n % 2 == 0.",
      "Uzyj if / else i wypisz dokladnie wymagane slowa.",
    ],
    tests: [
      { name: "Parzysta dodatnia", input: "12", expectedOutput: "PARZYSTA" },
      { name: "Nieparzysta", input: "7", expectedOutput: "NIEPARZYSTA" },
      { name: "Zero", input: "0", expectedOutput: "PARZYSTA", hidden: true },
    ],
  },
  {
    id: "max-three",
    stageId: "control",
    title: "Najwieksza z trzech",
    difficulty: "Latwe",
    xp: 60,
    minutes: 15,
    concepts: ["if", "porownania", "zmienna pomocnicza"],
    brief: "Znajdz maksimum bez zakladania kolejnosci danych.",
    task: "Wczytaj trzy liczby calkowite. Wypisz najwieksza z nich.",
    inputFormat: "Trzy liczby calkowite.",
    outputFormat: "Jedna liczba calkowita.",
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;

    int best = a;
    // porownaj best z b oraz c

    cout << best << endl;
    return 0;
}
`,
    hints: [
      "Zacznij od zalozenia, ze najwieksza jest pierwsza liczba.",
      "Jesli b > best, przypisz best = b.",
      "Tak samo sprawdz c. Nie potrzebujesz wielu zagniezdzonych ifow.",
    ],
    tests: [
      { name: "Rosnace", input: "1 2 3", expectedOutput: "3" },
      { name: "Pierwsza najwieksza", input: "9 2 4", expectedOutput: "9" },
      { name: "Remis", input: "5 5 1", expectedOutput: "5", hidden: true },
    ],
  },
  {
    id: "fizzbuzz",
    stageId: "control",
    title: "FizzBuzz do n",
    difficulty: "Srednie",
    xp: 80,
    minutes: 20,
    concepts: ["for", "kolejnosc warunkow", "modulo"],
    brief: "Klasyczne cwiczenie na petle i warunki.",
    task: "Wczytaj n. Dla liczb od 1 do n wypisz w osobnych liniach: FizzBuzz dla podzielnych przez 3 i 5, Fizz dla podzielnych przez 3, Buzz dla podzielnych przez 5, a w pozostalych przypadkach sama liczbe.",
    inputFormat: "Jedna liczba calkowita n.",
    outputFormat: "n linii.",
    starterCode: `#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;

    for (int i = 1; i <= n; i++) {
        // uzupelnij warunki
    }

    return 0;
}
`,
    hints: [
      "Najpierw sprawdz przypadek podzielnosci przez 15 albo jednoczesnie przez 3 i 5.",
      "Kolejnosc ma znaczenie: liczba 15 nie powinna zatrzymac sie na samym Fizz.",
      "Dla zwyklej liczby wypisz i.",
    ],
    tests: [
      { name: "Do pieciu", input: "5", expectedOutput: "1\n2\nFizz\n4\nBuzz" },
      { name: "Do pietnastu", input: "15", expectedOutput: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz" },
      { name: "Jeden", input: "1", expectedOutput: "1", hidden: true },
    ],
  },
  {
    id: "sum-array",
    stageId: "structures",
    title: "Suma elementow",
    difficulty: "Srednie",
    xp: 85,
    minutes: 20,
    concepts: ["vector", "petla", "akumulator"],
    brief: "Przetworz serie liczb i policz ich laczna wartosc.",
    task: "Wczytaj n, a potem n liczb calkowitych. Wypisz sume wszystkich liczb.",
    inputFormat: "n, potem n liczb.",
    outputFormat: "Jedna liczba calkowita.",
    starterCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> numbers(n);

    for (int i = 0; i < n; i++) {
        cin >> numbers[i];
    }

    long long sum = 0;
    // policz sume

    cout << sum << endl;
    return 0;
}
`,
    hints: [
      "Akumulator to zmienna, do ktorej dodajesz kolejne wartosci.",
      "Przejdz po wektorze petla for od 0 do n - 1.",
      "W petli wykonaj: sum += numbers[i];",
    ],
    tests: [
      { name: "Kilka liczb", input: "5\n1 2 3 4 5", expectedOutput: "15" },
      { name: "Z ujemnymi", input: "4\n-2 10 -3 1", expectedOutput: "6" },
      { name: "Jedna liczba", input: "1\n99", expectedOutput: "99", hidden: true },
    ],
  },
  {
    id: "function-greet-score",
    stageId: "structures",
    title: "Funkcja oceniajaca",
    difficulty: "Srednie",
    xp: 90,
    minutes: 22,
    concepts: ["funkcje", "return", "warunki"],
    brief: "Przenies logike do funkcji, zeby main pozostal czytelny.",
    task: "Napisz funkcje grade(points), ktora zwraca znak oceny: A dla 90 lub wiecej, B dla 75-89, C dla 50-74 oraz D dla mniej niz 50. Wczytaj punkty i wypisz ocene.",
    inputFormat: "Jedna liczba calkowita z zakresu 0-100.",
    outputFormat: "Jeden znak: A, B, C albo D.",
    starterCode: `#include <iostream>
using namespace std;

char grade(int points) {
    // uzupelnij funkcje
    return 'D';
}

int main() {
    int points;
    cin >> points;
    cout << grade(points) << endl;
    return 0;
}
`,
    hints: [
      "Funkcja moze miec kilka instrukcji return.",
      "Zacznij od najwyzszego progu, czyli points >= 90.",
      "Jesli poprzedni warunek nie zadzialal, mozesz sprawdzac kolejny prog.",
    ],
    tests: [
      { name: "Ocena A", input: "96", expectedOutput: "A" },
      { name: "Granica B", input: "75", expectedOutput: "B" },
      { name: "Ponizej polowy", input: "42", expectedOutput: "D", hidden: true },
    ],
  },
  {
    id: "reverse-vector",
    stageId: "structures",
    title: "Odwroc kolejnosc",
    difficulty: "Srednie",
    xp: 95,
    minutes: 25,
    concepts: ["vector", "indeksy", "format wyjscia"],
    brief: "Wypisz elementy wektora od konca.",
    task: "Wczytaj n i n liczb. Wypisz liczby w odwrotnej kolejnosc, oddzielone spacjami.",
    inputFormat: "n, potem n liczb.",
    outputFormat: "Liczby od konca, oddzielone spacjami.",
    starterCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> values(n);

    for (int i = 0; i < n; i++) {
        cin >> values[i];
    }

    // wypisz od konca

    return 0;
}
`,
    hints: [
      "Ostatni indeks w wektorze o rozmiarze n to n - 1.",
      "Petla moze isc od n - 1 do 0.",
      "Nie przejmuj sie ostatnia spacja - sprawdzarka ignoruje nadmiarowe biale znaki.",
    ],
    tests: [
      { name: "Trzy liczby", input: "3\n10 20 30", expectedOutput: "30 20 10" },
      { name: "Piec liczb", input: "5\n1 1 2 3 5", expectedOutput: "5 3 2 1 1" },
      { name: "Jedna liczba", input: "1\n7", expectedOutput: "7", hidden: true },
    ],
  },
  {
    id: "gcd",
    stageId: "algorithms",
    title: "Najwiekszy wspolny dzielnik",
    difficulty: "Srednie",
    xp: 110,
    minutes: 25,
    concepts: ["while", "algorytm Euklidesa", "funkcja"],
    brief: "Zaimplementuj klasyczny algorytm Euklidesa.",
    task: "Wczytaj dwie dodatnie liczby calkowite a i b. Wypisz ich najwiekszy wspolny dzielnik.",
    inputFormat: "Dwie dodatnie liczby calkowite.",
    outputFormat: "Jedna liczba calkowita.",
    starterCode: `#include <iostream>
using namespace std;

int gcd(int a, int b) {
    // algorytm Euklidesa
    return a;
}

int main() {
    int a, b;
    cin >> a >> b;
    cout << gcd(a, b) << endl;
    return 0;
}
`,
    hints: [
      "Dopoki b != 0, oblicz reszte a % b.",
      "Potem przesun liczby: a = b, b = reszta.",
      "Gdy b spadnie do zera, odpowiedzia jest a.",
    ],
    tests: [
      { name: "Typowy przypadek", input: "48 18", expectedOutput: "6" },
      { name: "Liczby wzglednie pierwsze", input: "35 64", expectedOutput: "1" },
      { name: "Jedna dzieli druga", input: "100 25", expectedOutput: "25", hidden: true },
    ],
  },
  {
    id: "prime",
    stageId: "algorithms",
    title: "Czy liczba jest pierwsza",
    difficulty: "Srednie",
    xp: 120,
    minutes: 30,
    concepts: ["petla", "sqrt bez sqrt", "flaga"],
    brief: "Sprawdz dzielniki tylko tak dlugo, jak ma to sens.",
    task: "Wczytaj liczbe n. Wypisz TAK, jesli n jest liczba pierwsza, albo NIE w przeciwnym razie.",
    inputFormat: "Jedna liczba calkowita.",
    outputFormat: "TAK albo NIE.",
    starterCode: `#include <iostream>
using namespace std;

bool isPrime(int n) {
    // uzupelnij
    return true;
}

int main() {
    int n;
    cin >> n;
    cout << (isPrime(n) ? "TAK" : "NIE") << endl;
    return 0;
}
`,
    hints: [
      "Liczby mniejsze niz 2 nie sa pierwsze.",
      "Wystarczy testowac dzielniki i takie, ze i * i <= n.",
      "Jesli znajdziesz dzielnik n % i == 0, od razu zwroc false.",
    ],
    tests: [
      { name: "Pierwsza", input: "17", expectedOutput: "TAK" },
      { name: "Zlozona", input: "21", expectedOutput: "NIE" },
      { name: "Jeden", input: "1", expectedOutput: "NIE", hidden: true },
    ],
  },
  {
    id: "binary-search",
    stageId: "algorithms",
    title: "Wyszukiwanie binarne",
    difficulty: "Trudne",
    xp: 140,
    minutes: 35,
    concepts: ["inwariant", "logarytm", "indeksy"],
    brief: "Znajdz element w posortowanej tablicy szybciej niz liniowo.",
    task: "Wczytaj n, posortowany rosnaco ciag n liczb oraz szukana wartosc x. Wypisz indeks x liczony od 0 albo -1, jesli x nie wystepuje.",
    inputFormat: "n, n liczb rosnaco, x.",
    outputFormat: "Indeks od 0 albo -1.",
    starterCode: `#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& values, int x) {
    int left = 0;
    int right = (int)values.size() - 1;

    // uzupelnij petle

    return -1;
}

int main() {
    int n;
    cin >> n;
    vector<int> values(n);
    for (int i = 0; i < n; i++) {
        cin >> values[i];
    }

    int x;
    cin >> x;
    cout << binarySearch(values, x) << endl;
    return 0;
}
`,
    hints: [
      "Srodek przedzialu to left + (right - left) / 2.",
      "Jesli values[mid] jest za male, przesun left na mid + 1.",
      "Jesli jest za duze, przesun right na mid - 1. Trafienie zwraca mid.",
    ],
    tests: [
      { name: "Element istnieje", input: "5\n2 4 6 8 10\n8", expectedOutput: "3" },
      { name: "Brak elementu", input: "4\n1 3 5 7\n2", expectedOutput: "-1" },
      { name: "Pierwszy element", input: "3\n9 11 13\n9", expectedOutput: "0", hidden: true },
    ],
  },
  {
    id: "sort-products",
    stageId: "advanced",
    title: "Sortowanie wynikow",
    difficulty: "Trudne",
    xp: 150,
    minutes: 35,
    concepts: ["sort", "pair", "komparator"],
    brief: "Uzyj biblioteki standardowej, zamiast pisac sortowanie recznie.",
    task: "Wczytaj n oraz n par: nazwa produktu i cena. Wypisz nazwy produktow posortowane rosnaco po cenie. Przy remisie sortuj alfabetycznie po nazwie.",
    inputFormat: "n, potem n linii: nazwa cena.",
    outputFormat: "Nazwy w kolejnosci sortowania, po jednej w linii.",
    starterCode: `#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct Product {
    string name;
    int price;
};

int main() {
    int n;
    cin >> n;
    vector<Product> products(n);

    for (int i = 0; i < n; i++) {
        cin >> products[i].name >> products[i].price;
    }

    // posortuj produkty

    for (const Product& product : products) {
        cout << product.name << endl;
    }

    return 0;
}
`,
    hints: [
      "Mozesz przekazac do sort funkcje lambda.",
      "Najpierw porownaj ceny. Jesli sa rozne, mniejsza cena ma byc pierwsza.",
      "Jesli ceny sa rowne, porownaj name alfabetycznie.",
    ],
    tests: [
      { name: "Rozne ceny", input: "3\nchleb 5\nsok 7\nwoda 2", expectedOutput: "woda\nchleb\nsok" },
      { name: "Remis", input: "3\nbanan 4\narbuz 4\ncytryna 6", expectedOutput: "arbuz\nbanan\ncytryna" },
      { name: "Test ukryty", input: "4\nx 10\na 1\nb 1\ny 9", expectedOutput: "a\nb\ny\nx", hidden: true },
    ],
  },
  {
    id: "word-frequency",
    stageId: "advanced",
    title: "Najczestsze slowo",
    difficulty: "Trudne",
    xp: 160,
    minutes: 40,
    concepts: ["map", "string", "zliczanie"],
    brief: "Zlicz wystapienia slow i wybierz najlepszy wynik.",
    task: "Wczytaj n oraz n slow. Wypisz slowo, ktore wystapilo najczesciej. Przy remisie wypisz alfabetycznie najmniejsze slowo.",
    inputFormat: "n, potem n slow.",
    outputFormat: "Jedno slowo.",
    starterCode: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    int n;
    cin >> n;

    map<string, int> counter;
    for (int i = 0; i < n; i++) {
        string word;
        cin >> word;
        // zwieksz licznik slowa
    }

    string bestWord;
    int bestCount = 0;

    // znajdz najczestsze slowo

    cout << bestWord << endl;
    return 0;
}
`,
    hints: [
      "counter[word]++ zwieksza licznik dla danego slowa.",
      "map przechodzi po kluczach w kolejnosci alfabetycznej.",
      "Jesli aktualny licznik jest wiekszy od bestCount, aktualizuj odpowiedz.",
    ],
    tests: [
      { name: "Jeden lider", input: "5\nkot pies kot lis kot", expectedOutput: "kot" },
      { name: "Remis alfabetyczny", input: "4\nbeta alfa beta alfa", expectedOutput: "alfa" },
      { name: "Jedno slowo", input: "1\nsolo", expectedOutput: "solo", hidden: true },
    ],
  },
  {
    id: "pair-sum",
    stageId: "advanced",
    title: "Dwie liczby o danej sumie",
    difficulty: "Trudne",
    xp: 170,
    minutes: 45,
    concepts: ["two pointers", "sort", "zlozonosc"],
    brief: "Znajdz pare liczb bez sprawdzania kazdej pary.",
    task: "Wczytaj n, n liczb oraz cel target. Wypisz TAK, jesli istnieja dwie rozne liczby z tablicy o sumie target, albo NIE w przeciwnym razie.",
    inputFormat: "n, n liczb, target.",
    outputFormat: "TAK albo NIE.",
    starterCode: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<int> values(n);

    for (int i = 0; i < n; i++) {
        cin >> values[i];
    }

    int target;
    cin >> target;

    sort(values.begin(), values.end());

    // uzyj dwoch wskaznikow

    cout << "NIE" << endl;
    return 0;
}
`,
    hints: [
      "Po sortowaniu ustaw left na poczatku, right na koncu.",
      "Jesli suma jest za mala, przesun left w prawo.",
      "Jesli suma jest za duza, przesun right w lewo. Trafienie konczy program odpowiedzia TAK.",
    ],
    tests: [
      { name: "Para istnieje", input: "5\n1 4 7 9 11\n16", expectedOutput: "TAK" },
      { name: "Brak pary", input: "4\n2 4 6 8\n15", expectedOutput: "NIE" },
      { name: "Duplikaty", input: "4\n5 5 1 2\n10", expectedOutput: "TAK", hidden: true },
    ],
  },
  {
    id: "intervals",
    stageId: "independent",
    title: "Scalanie przedzialow",
    difficulty: "Projektowe",
    xp: 210,
    minutes: 55,
    concepts: ["sort", "vector", "przypadki brzegowe"],
    brief: "Polacz nachodzace na siebie przedzialy i wypisz uproszczona liste.",
    task: "Wczytaj n oraz n przedzialow [l, r]. Scal przedzialy, ktore sie nachodza lub stykaja. Wypisz liczbe przedzialow po scaleniu, a potem kazdy przedzial w osobnej linii.",
    inputFormat: "n, potem n linii: l r.",
    outputFormat: "Liczba scalonych przedzialow, potem linie l r.",
    starterCode: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> intervals(n);

    for (int i = 0; i < n; i++) {
        cin >> intervals[i].first >> intervals[i].second;
    }

    sort(intervals.begin(), intervals.end());

    vector<pair<int, int>> merged;
    // scal przedzialy

    cout << merged.size() << endl;
    for (auto interval : merged) {
        cout << interval.first << " " << interval.second << endl;
    }

    return 0;
}
`,
    hints: [
      "Po sortowaniu rozpatrujesz przedzialy od najmniejszego poczatku.",
      "Jesli merged jest puste albo aktualny poczatek jest wiekszy niz koniec ostatniego przedzialu + 1, dodaj nowy przedzial.",
      "W przeciwnym razie zaktualizuj koniec ostatniego przedzialu maksimum z obu koncow.",
    ],
    tests: [
      { name: "Nachodzace", input: "4\n1 3\n2 6\n8 10\n10 12", expectedOutput: "2\n1 6\n8 12" },
      { name: "Rozdzielne", input: "3\n1 1\n3 4\n6 8", expectedOutput: "3\n1 1\n3 4\n6 8" },
      { name: "Nieposortowane", input: "3\n10 20\n1 5\n4 8", expectedOutput: "2\n1 8\n10 20", hidden: true },
    ],
  },
  {
    id: "task-scheduler",
    stageId: "independent",
    title: "Planer zadan",
    difficulty: "Projektowe",
    xp: 230,
    minutes: 60,
    concepts: ["sort", "greedy", "analiza wyniku"],
    brief: "Wybierz maksymalna liczbe niekolidujacych zadan.",
    task: "Wczytaj n oraz n zadan opisanych poczatkiem i koncem. Wypisz maksymalna liczbe zadan, ktore mozna wykonac bez nakladania sie. Zadanie konczace sie w chwili t nie koliduje z zadaniem zaczynajacym sie w chwili t.",
    inputFormat: "n, potem n linii: start koniec.",
    outputFormat: "Jedna liczba calkowita.",
    starterCode: `#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> tasks(n);

    for (int i = 0; i < n; i++) {
        int start, finish;
        cin >> start >> finish;
        tasks[i] = {finish, start};
    }

    sort(tasks.begin(), tasks.end());

    int result = 0;
    int currentTime = -1000000000;

    // wybieraj zadania zachlannie

    cout << result << endl;
    return 0;
}
`,
    hints: [
      "Klasyczna strategia: wybieraj zadanie, ktore konczy sie najwczesniej.",
      "W parze {finish, start} domyslne sortowanie sortuje najpierw po koncu.",
      "Jesli start >= currentTime, mozesz wybrac zadanie i ustawic currentTime = finish.",
    ],
    tests: [
      { name: "Typowy zestaw", input: "4\n0 3\n1 2\n3 5\n4 7", expectedOutput: "2" },
      { name: "Stykajace sie", input: "3\n1 2\n2 3\n3 4", expectedOutput: "3" },
      { name: "Wszystkie koliduja", input: "3\n1 10\n2 9\n3 8", expectedOutput: "1", hidden: true },
    ],
  },
  {
    id: "mini-bank",
    stageId: "independent",
    title: "Mini system transakcji",
    difficulty: "Projektowe",
    xp: 260,
    minutes: 75,
    concepts: ["map", "walidacja", "symulacja"],
    brief: "Przetworz operacje na kontach i odrzuc bledne transakcje.",
    task: "Wczytaj liczbe operacji q. Operacja ADD name amount zwieksza saldo konta name. Operacja PAY from to amount przenosi amount, ale tylko jesli from ma wystarczajace saldo. Na koncu wypisz salda wszystkich kont alfabetycznie w formacie name saldo.",
    inputFormat: "q, potem q operacji.",
    outputFormat: "Konta alfabetycznie, po jednym w linii.",
    starterCode: `#include <iostream>
#include <map>
#include <string>
using namespace std;

int main() {
    int q;
    cin >> q;

    map<string, long long> balance;

    for (int i = 0; i < q; i++) {
        string operation;
        cin >> operation;

        if (operation == "ADD") {
            string name;
            long long amount;
            cin >> name >> amount;
            // dodaj srodki
        } else if (operation == "PAY") {
            string from, to;
            long long amount;
            cin >> from >> to >> amount;
            // wykonaj przelew tylko gdy to mozliwe
        }
    }

    for (auto entry : balance) {
        cout << entry.first << " " << entry.second << endl;
    }

    return 0;
}
`,
    hints: [
      "balance[name] tworzy konto z saldem 0, jesli jeszcze go nie bylo.",
      "Przy ADD wystarczy balance[name] += amount.",
      "Przy PAY najpierw sprawdz balance[from] >= amount, dopiero potem odejmij i dodaj.",
    ],
    tests: [
      { name: "Przelew poprawny", input: "3\nADD ala 100\nPAY ala ola 30\nADD ola 5", expectedOutput: "ala 70\nola 35" },
      { name: "Przelew odrzucony", input: "3\nADD ala 10\nPAY ala ola 50\nADD ola 1", expectedOutput: "ala 10\nola 1" },
      { name: "Nowe konta", input: "4\nADD zen 5\nADD ala 3\nPAY zen ala 2\nPAY ala zen 1", expectedOutput: "ala 4\nzen 4", hidden: true },
    ],
  },
];

export const firstExerciseId = exercises[0].id;
