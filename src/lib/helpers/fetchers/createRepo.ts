const createRepo = async (
  accessToken: string,
  name: string,
  visibility: 'private' | 'public' = 'private',
  description?: string
) => {
  const body = {
    name,
    description,
    private: visibility === 'private' ? true : false
  };
  try {
    const response = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(body)
    });
    console.log('response: ', response);
    if(response.status === 422) {
      throw new Error('Repo already exists');
    }
    if(response.status !== 201) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log('try/catch error: ', err);
    throw err;
  }
};
export default createRepo;