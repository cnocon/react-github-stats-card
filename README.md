# GitHub Stats Card for React

Pass a [GitHub username](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-user-account/remembering-your-github-username-or-email) and a boolean for whether or not you want the theme to be used, and get this:

![Widget Screenshot](react-github-stat-card-screenshot.png)

## Installation

```bash
npm install @cnocon/react-github-stats-card
```

## Example using Express:

The Card function returns a functional React Component. Imports will be updated in the future to get rid of using `dist`.

```js
import Card from '@cnocon/react-github-stats-card/dist/Card';

<Card username="cnocon" theme={true}/>
```
