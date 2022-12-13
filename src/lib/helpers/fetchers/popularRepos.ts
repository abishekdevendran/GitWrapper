const popularRepos = async (accessToken: string, username: string) => {
  // function to list all the repos with stars>5 and forks>5
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
    let repos = await request1.json();
    repos=repos.filter((repo:any)=>repo.stargazers_count>5 && repo.forks_count>5);
    repos=repos.map((repo:any)=>repo.name);
    return repos;
  } catch (err) {
    throw err;
  }
};

export default popularRepos;
