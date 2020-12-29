import React, { useEffect, useState } from 'react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

const pluralizer = (number, string) => {
  let newString = string.slice();
  if (number === 0) {
    newString = `${string}s`;
  }
  else if (number > 1) {
    newString = `${string}s`;
  }
  return newString;
}

export default function Card({...props}) {
  const {username, accessToken, theme} = props;
  const [user, setUser] = useState({});
  const [userRepos, setUserRepos] = useState([]);
  const [userLanguages, setUserLanguages] = useState({});

  const getUserReposData = (username, accessToken) => {

    const options = {
      'method': 'GET',
      'headers': {
        'Accept': 'application/vnd.github.v3+json',
        'user-agent': 'cnocon',
        'authorization': `token ${accessToken}`
      }
    };
  
    fetch(`https://api.github.com/users/${username}/repos`, options)
      .then(response => {
        return response.json();
      }).then(data => {
        const languagesObj = {};

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
      }).then(payload => {
        setUserRepos(payload[0]);
        setUserLanguages(payload[1]);
      });
  }

  const getUserData = (username, accessToken) => {
    const options = {
      'method': 'GET',
      'headers': {
        'Accept': 'application/vnd.github.v3+json',
        'user-agent': 'cnocon',
        'authorization': `token ${accessToken}`
      }
    };
  
    fetch(`https://api.github.com/users/${username}`, options)
      .then(response => {
        return response.json();
      }).then(data => {
        setUser(data);
      });
  }

  const sortedLanguages = Object.entries(userLanguages).sort((a, b) => {
    return a[1][1] - b[1][1];
  });

  const topLanguages = sortedLanguages.length >= 3 ? sortedLanguages.slice(0,3) : sortedLanguages;
  const languagesMarkup = topLanguages.map(language => (
    `<li><b>${language[0]}</b><small>${language[1]} ${pluralizer(parseInt(language[1]), 'repo')}</small></li>`
  )).join('');
  const watchersCount = userRepos.reduce((acc, r) => (acc + r.watchers_count), 0);
  const stargazersCount = userRepos.reduce((acc, r) => (acc + r.stargazers_count), 0);
  const openIssuesCount = userRepos.reduce((acc, r) => (acc + r.open_issues_count), 0);
  const stargazers = `<li>Starred <b>${stargazersCount}</b> ${pluralizer(parseInt(stargazersCount), `time`)}</li>`;
  const watchers = `<li><b>${watchersCount}</b> ${pluralizer(parseInt(watchersCount), `watcher`)}</li>`;
  const followers = `<li>Followed by <b>${user.followers}</b> ${pluralizer(parseInt(user.followers), `member`)}</li>`;
  const following = `<li>Following <b>${user.following}</b> ${pluralizer(parseInt(user.following), `member`)}</li>`;
  const openIssues = `<li><b>${openIssuesCount}</b>&nbsp;${pluralizer(parseInt(openIssuesCount), `open issue`)}</li>`;
  const company = !user.company ? `` : `<p>${user.company}</p>`;
  const location = !user.location ? `` : `<p>${user.location}</p>`;
  const fullName = !user.name ? `` : `<p><b>${user.name}</b></p>`;
  const blog = !user.blog ? `` : `<p><a href="${user.blog}">${user.blog.split('://')[1]}</a></p>`;
  const footer = `<footer><img src="${user.avatar_url}" alt="${user.name}"/><section>${fullName}${blog}${location}${company}</section></footer>`;

  useEffect(() => {
    if (Object.keys(user).length === 0) {
      getUserData(username, accessToken);
    }

    if (userRepos.length === 0 || Object.keys(userLanguages.length === 0)) {
      getUserReposData(username, accessToken);
    } else {
      console.log(userLanguages);
    }
    
  }, []);

  return (
    <div className={theme ? 'github-stats-card' : ''}>
      <header><h3><a href={user.html_url} target="_blank" rel="noopener nofollow">@{username}</a>&nbsp;on GitHub<img src="https://github.githubassets.com/images/icons/emoji/octocat.png?v8" alt="Octocat"/></h3>{user.bio ? <h4>{user.bio}</h4> : ``}<h5><span><b>{user.public_repos}</b>Public Repos</span><span>|</span><span><b>{user.public_gists}</b>Public Gists</span></h5></header>
      <div><p><b>Top Languages</b></p><ol>{ReactHtmlParser(languagesMarkup)}</ol><ul>{ReactHtmlParser(openIssues)}{ReactHtmlParser(watchers)}{ReactHtmlParser(stargazers)}{ReactHtmlParser(followers)}{ReactHtmlParser(following)}</ul></div>
      {ReactHtmlParser(footer)}
    </div>
  )
  
};