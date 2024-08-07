This project created with React Native Community CLI

# Getting Started

#### JAVA-JDK Version 17 (Recommend)
#### node.js Version >=18
#### Yarn Version 3.6.4

## Step 1: Install Modules

```bash
# using yarn
yarn install
```

## Step 2: Fix Deprecated Object (IMPORTANT)
!! If you do not complete this step, the project WILL NOT RUN. !!
### OPEN:

``node_modules\react-native-snap-carousel\src\carousel\Carousel.js``

``node_modules\react-native-snap-carousel\src\pagination\Pagination.js``

``node_modules\react-native-snap-carousel\src\pagination\PaginationDot.js``

``node_modules\react-native-snap-carousel\src\parallaximage\ParallaxImage.js``

### CHANGE IMPORTS:

1. Delete all ``` import {..., WiewPropTypes, ...} from 'react-native' ``` (Just delete the ViewPropTypes field)

2. Add ``` import ViewPropTypes from "deprecated-react-native-prop-types"; ```

## Step 3: Start your Application
### For Android

```bash
# using Yarn
yarn android

# using npx
npx react-native run-android
```

### For iOS

```bash
# using Yarn
yarn ios

# using npx
npx react-native run-ios
```

