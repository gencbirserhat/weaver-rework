import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import english from './locales/en/common.json'
import turkish from './locales/tr/common.json'
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
let token
const resources = {
    en: {
        translation: english
    },
    tr: {
        translation: turkish
    }
};


i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        compatibilityJSON: 'v3',
        resources,
        debug: false,
        lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        },
    });

export default i18n;










/* import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import AsyncStorage from '@react-native-async-storage/async-storage';
import english from './locales/en/common.json'
import turkish from './locales/tr/common.json'
import useTranslation from "react-i18next";


(async () => {
    const token = await AsyncStorage.getItem("weaver:selectedLang")
    console.log(token);
    console.log("******");

    i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init({
        lang: token === 'en' ? english : turkish,
        debug: true,
        resources: {
            'en': { translation: english },
            'tr': { translation: turkish }
        },
        react: {
            useSuspense: false
        },
        fallbackLng: token === 'en' ? 'en' : 'tr',
        interpolation: {
            escapeValue: false
        },
        keySeparator: false,
    })
})()


export default i18n;*/
