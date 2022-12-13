const getRepoDetails= async (accessToken:string, userName:string, repoName: string, filter?:"contributors"|"stargazers") => {
  try {
    //Immediately invoked function expression
    const URL=((filter)=>{
      switch(filter){
        case "contributors":
          return `https://api.github.com/repos/${userName}/${repoName}/contributors`;
        case "stargazers":
          return `https://api.github.com/repos/${userName}/${repoName}/stargazers`;
        default:
          return `https://api.github.com/repos/${userName}/${repoName}`;
      }
    })(filter);
    const response = await fetch(URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        client_id: process.env.CLIENT_ID!
      }
    });
    if(response.status===404){
      throw new Error("Repo not found")
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export default getRepoDetails;