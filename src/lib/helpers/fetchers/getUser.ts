const getUser = async (accessToken: string) => {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${accessToken}`
      }
    });
    const data = await response.json();
    const {login, name, email} = data;
    return {login, name, email};
  } catch (err) {
    console.log('try/catch error: ', err);
  }
};

export default getUser;