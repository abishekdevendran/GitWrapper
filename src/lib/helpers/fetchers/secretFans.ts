const secretFans = async (
  accessToken: string,
  username: string,
  specific = false
) => {
  // function to list all the stargazers who have started more than 2 repos of a given user
  try {
    const request1 = await fetch(
      `https://api.github.com/users/${username}/repos`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );
    if (request1.status !== 200) {
      throw new Error('Username not found');
    }
    const repos = await request1.json();
    const repoNames = repos.map((repo: any) => repo.name);
    console.log(repoNames);
    let secretFansList: { login: string; times: number }[] = [];
    await Promise.all(
      repoNames.map(async (repoName: string) => {
        const request2 = await fetch(
          `https://api.github.com/repos/${username}/${repoName}/stargazers`,
          {
            headers: {
              Authorization: `token ${accessToken}`,
              Accept: 'application/vnd.github.v3+json'
            }
          }
        );
        if (request2.status !== 200) {
          throw new Error('F2:Repo not found');
        }
        const stargazers = await request2.json();
        stargazers.forEach((stargazer: any) => {
          const index = secretFansList.findIndex(
            (secretFan: any) => secretFan.login === stargazer.login
          );
          if (index === -1) {
            secretFansList.push({ login: stargazer.login, times: 1 });
          } else {
            secretFansList[index].times += 1;
          }
        });
        console.log(secretFansList);
      })
    );
    console.log(secretFansList);
    secretFansList = secretFansList.filter((secretFan: any) => {
      if (specific) {
        return secretFan.times === 2;
      }
      return secretFan.times > 2;
    });
    return secretFansList;
  } catch (err) {
    throw err;
  }
};

export default secretFans;
