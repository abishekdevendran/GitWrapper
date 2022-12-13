const getUserRepos = async (username?: string, accessToken?: string) => {
  if (!username && !accessToken) {
    throw new Error('No username or accessToken provided');
  }
  if (username) {
    console.log('username: ', username);
    try {
      const response = await fetch(
        ' https://api.github.com/users/' + username + '/repos',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json'
          }
        }
      );
      const data = await response.json();
      if(data.message === 'Not Found') {
        throw new Error('User not found');
      }
      const repos = data.map((repo: any) => {
        return {
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language
        };
      });
      return repos;
    } catch (err) {
      console.log('try/catch error: ', err);
      throw err;
    }
  } else {
    try {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
      const data = await response.json();
      const repos = data.map((repo: any) => {
        return {
          name: repo.name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language
        };
      });
      return repos;
    } catch (err) {
      console.log('try/catch error: ', err);
    }
  }
};

export default getUserRepos;
