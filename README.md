<p align="center">
  <img src="MobileApp/assets/PuluLogo.png" alt="Pulu logo" width="120">
</p>

<h1 align="center">Pulu</h1>

<p align="center">
  Löydä lähistöltäsi piilotettuja helmiä – yksi swipe kerrallaan.
</p>

---

## Projekti

Tämä on kouluprojekti, jonka tavoitteena oli oppia mobiilisovelluskehitystä käyttäen **React Nativea**, **Expoa**, **TypeScriptiä** ja **Firebasea**. Projekti toimi harjoituksena hybridi mobiilisovelluksen rakentamisesta. Aina autentikoinnin toteutuksesta, firebase pilvitietokannan käytöstä sekä laitteen omien rajapintojen (esim. GPS/sijanti) hyödyntämisestä.

Idea Pulusta lähti siitä, että emme itsekään tiedä aina kaikista paikoista, vaikka kiinnostavia paikkoja olisi ihan vieressä. Halusimme sovelluksen, joka toimii vähän kuin Tinder paikoille: swaippaat oikealle, jos paikka kiinnostaa, ja vasemmalle, jos ei. Näin käyttäjä löytää uusia reittejä, näköalapaikkoja ja muita kohteita ilman, että täytyy itse erikseen tutkia 10 vuotta vanhoja vauva.fi palstan keskusteluja. Lisäksi sovellus mahdollistaa kuulumisen yhteisöön - voit alkaa itse lisäilemään mielenkiintoisia paikkoja ja parantaa muiden tietoisuutta.

## Sovelluksen kuvaus

Pulu on paikkojen löytämiseen keskittyvä mobiilisovellus, jossa käyttäjät voivat:

- **Tutustua** uusiin paikkoihin swaippaamalla kortteja Tinderin tyyliin.
- **Selata karttaa** ja nähdä lähistöllä olevat kohteet yhdellä silmäyksellä.
- **Tallentaa suosikkeja** omaan listaan ja palata niihin myöhemmin.
- **Lisätä omia paikkoja** kuvineen, kategorioineen ja tageineen muiden löydettäväksi.
- **Rekisteröityä ja kirjautua** sisään tai jatkaa vieraana ilman tiliä.

## Teknologiat

- **Frontend:** React Native, Expo, TypeScript
- **Navigaatio:** React Navigation (Bottom Tabs + Native Stack)
- **Kartat & sijainti:** `react-native-maps`, `expo-location`
- **UI:** React Native Paper, `@expo/vector-icons`, Bottom Sheet
- **Autentikointi & tietokanta:** Firebase Auth käyttäjänhallintaan, Firestore datalle ja Firestorage kuville
- **Tallennus kirjautumattomana:** AsyncStorage

Sovellus toimii sekä Androidilla että iOSilla ongelmitta.

## Tekijät
Jimmy Bergbacka
Jouni Maunula
Veikka 
Tuomas Ruuska
Iikka Laurila

Mobiilisovellusprojekti 
