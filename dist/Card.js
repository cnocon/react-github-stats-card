import React, { useEffect, useState } from 'react';
import('./Card.css');

const pluralizer = (number, string) => {
  let newString = string.slice();

  if (number === 0) {
    newString = `${string}s`;
  } else if (number > 1) {
    newString = `${string}s`;
  }

  return newString;
};

export default function Card({ ...props
}) {
  const {
    username,
    accessToken,
    theme
  } = props;
  const [user, setUser] = useState({});
  const [userRepos, setUserRepos] = useState([]);
  const [userLanguages, setUserLanguages] = useState({});

  const getUserReposData = (username, accessToken = null) => {
    let options;

    if (accessToken) {
      options = {
        'method': 'GET',
        'headers': {
          'Accept': 'application/vnd.github.v3+json',
          'user-agent': `${username}`,
          'authorization': `token ${accessToken}`
        }
      };
    } else {
      options = {
        'method': 'GET',
        'headers': {
          'Accept': 'application/vnd.github.v3+json',
          'user-agent': `${username}`
        }
      };
    }

    ;
    fetch(`https://api.github.com/users/${username}/repos`, options).then(response => {
      return response.json();
    }).then(data => {
      const languagesObj = {};

      try {
        data.forEach(repository => {
          if (repository.language && repository.language !== null) {
            if (languagesObj[repository.language]) {
              languagesObj[repository.language] += 1;
            } else {
              languagesObj[repository.language] = 1;
            }
          }
        });
        return [data, languagesObj];
      } catch (err) {
        const error = new Error(err);
        console.error(error);
      }
    }).then(payload => {
      try {
        setUserRepos(payload[0]);
        setUserLanguages(payload[1]);
      } catch (err) {
        const error = new Error(err);
        console.error(error);
      }
    }).catch(err => {
      console.error(err);
      return err;
    });
  };

  const getUserData = (username, accessToken = null) => {
    let options;

    if (accessToken) {
      options = {
        'method': 'GET',
        'headers': {
          'Accept': 'application/vnd.github.v3+json',
          'user-agent': `@cnocon/react-github-stats-card`,
          'authorization': `token ${accessToken}`
        }
      };
    } else {
      options = {
        'method': 'GET',
        'headers': {
          'Accept': 'application/vnd.github.v3+json',
          'user-agent': `@cnocon/github-stats-card`
        }
      };
    }

    fetch(`https://api.github.com/users/${username}`, options).then(response => {
      return response.json();
    }).then(data => {
      setUser(data);
    });
  };

  const sortedLanguages = Object.entries(userLanguages).sort((a, b) => {
    return a[1][1] - b[1][1];
  });
  const topLanguages = sortedLanguages.length >= 3 ? sortedLanguages.slice(0, 3) : sortedLanguages;
  const languagesMarkup = topLanguages.map(language => /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, language[0]), /*#__PURE__*/React.createElement("small", null, language[1], " ", pluralizer(parseInt(language[1]), 'repo'))));
  const watchersCount = userRepos.reduce((acc, r) => acc + r.watchers_count, 0);
  const stargazersCount = userRepos.reduce((acc, r) => acc + r.stargazers_count, 0);
  const openIssuesCount = userRepos.reduce((acc, r) => acc + r.open_issues_count, 0);
  const stargazers = /*#__PURE__*/React.createElement("li", null, "Starred ", /*#__PURE__*/React.createElement("b", null, stargazersCount), " ", pluralizer(parseInt(stargazersCount), `time`));
  const watchers = /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, watchersCount), " ", pluralizer(parseInt(watchersCount), `watcher`));
  const followers = /*#__PURE__*/React.createElement("li", null, "Followed by ", /*#__PURE__*/React.createElement("b", null, user.followers), " ", pluralizer(parseInt(user.followers), `member`));
  const following = /*#__PURE__*/React.createElement("li", null, "Following ", /*#__PURE__*/React.createElement("b", null, user.following), " $", pluralizer(parseInt(user.following), `member`));
  const openIssues = /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("b", null, openIssuesCount), "\xA0", pluralizer(parseInt(openIssuesCount), `open issue`));
  const company = !user.company ? `` : /*#__PURE__*/React.createElement("p", null, "Currently at ", user.company);
  const location = !user.location ? `` : /*#__PURE__*/React.createElement("p", null, user.location);
  const profileLink = /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    href: user.html_url,
    target: "_blank",
    rel: "noreferrer nofollow"
  }, "@", user.login, " on GitHub"));
  const fullName = !user.name ? `` : /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, user.name));
  const blog = !user.blog ? `` : /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("a", {
    href: user.blog
  }, user.blog.split('://')[1]));
  const createdAt = new Date(user.created_at);
  const relativeDate = Date.now() - createdAt;
  const totalYears = Math.round(relativeDate / 1000 / 60 / 60 / 24 / 365);
  const yearsOnGitHub = /*#__PURE__*/React.createElement("p", null, totalYears, " ", pluralizer(totalYears, 'Year'), " of Membership");
  const footer = /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("section", null, profileLink, yearsOnGitHub, company), /*#__PURE__*/React.createElement("img", {
    src: "https://github.githubassets.com/images/icons/emoji/octocat.png?v8",
    alt: "Octocat"
  }));
  useEffect(() => {
    if (Object.keys(user).length === 0) {
      getUserData(username, accessToken);
    }

    if (userRepos.length === 0 || Object.keys(userLanguages.length === 0)) {
      getUserReposData(username, accessToken);
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: theme ? 'github-stats-card' : ''
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("a", {
    href: user.html_url,
    target: "_blank",
    rel: "noopener nofollow"
  }, "@", username), "\xA0on GitHub"), user && user.bio ? /*#__PURE__*/React.createElement("h4", null, user.bio) : ``, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, user.public_repos), "Public Repos"), /*#__PURE__*/React.createElement("span", null, "|"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, user.public_gists), "Public Gists"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("b", null, "Top Languages")), /*#__PURE__*/React.createElement("ol", null, languagesMarkup), /*#__PURE__*/React.createElement("ul", null, openIssues, watchers, stargazers, followers, following)), footer);
}
;