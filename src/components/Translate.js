import { useTranslation } from "react-i18next";

// module.js
var translate = {
    t:null,
    init: function(){
        t = useTranslation();
    }
};
// export it
export default translate;