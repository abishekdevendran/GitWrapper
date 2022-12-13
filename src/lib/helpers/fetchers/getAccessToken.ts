const getAccessToken = async (code: string) => {
  const body = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code
  };
  try {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(body)
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('try/catch error: ', err);
    throw err;
  }
};

export default getAccessToken;