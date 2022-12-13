// function to list all the repos of a given user with > 5 commits by owner in last 10 days
import dayjs from "dayjs";

const getActiveRepos = async (accessToken: string, username: string) => {
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
    let activeRepos: string[] = [];
    await Promise.all(
      repoNames.map(async (repoName: string) => {
        const request2 = await fetch(
          `https://api.github.com/repos/${username}/${repoName}/branches`,
          {
            headers: {
              Authorization: `token ${accessToken}`,
              Accept: 'application/vnd.github.v3+json'
            }
          }
        );
        if(request2.status !== 200){
          throw new Error('F2: Fetch failed.');
        }
        const branches=await request2.json();
        const branchNames=branches.map((branch:any)=>branch.name);
        let commitCount=0;
        await Promise.all(branchNames.map(async (branchName:string)=>{
          const request3 = await fetch(
            `https://api.github.com/repos/${username}/${repoName}/commits?sha=${branchName}`,
            {
              headers: {
                Authorization: `token ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
              }
            }
          );
          if(request3.status !== 200){
            throw new Error('F3: Fetch failed.');
          }
          const commits=await request3.json();
          commits.forEach((commit:any)=>{
            const commitDate=dayjs(commit.commit.author.date);
            if(commitDate.isAfter(dayjs().subtract(10,'day'))){
              commitCount++;
            }
          });
        }));
        if(commitCount>5){
          activeRepos.push(repoName);
        }
      })
    );
    return activeRepos;
  } catch (err) {
    throw err;
  }
};

export default getActiveRepos;
