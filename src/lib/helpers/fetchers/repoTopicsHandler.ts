const repoTopicsHandler = async (
  accessToken: string,
  username: string,
  repoName: string,
  method: 'GET' | 'PUT' | 'DELETE',
  topic?: string
) => {
  //topics are always lowercase as specified in the API.
  topic=topic?.toLowerCase();
  try {
    const request = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/topics`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );
    if (request.status !== 200) {
      throw new Error('Topic not found');
    }
    const data = await request.json();
    console.log(data);
    switch (method) {
      case 'GET':
        {
          return data.names;
        }
        break;
      case 'PUT':
        {
          if (!topic) {
            throw new Error('Topic is required');
          } else {
            if (data.names.includes(topic)) {
              throw new Error('Topic already exists');
            } else {
              let body = [...data.names, topic];
              const request = await fetch(
                `https://api.github.com/repos/${username}/${repoName}/topics`,
                {
                  method: 'PUT',
                  headers: {
                    Authorization: `token ${accessToken}`,
                    Accept: 'application/vnd.github.v3+json'
                  },
                  body: JSON.stringify({ names: body })
                }
              );
              console.log(request);
              if (request.status !== 200) {
                throw new Error('Topic not PUT successfully');
              }
            }
          }
        }
        break;
      case 'DELETE': {
        if (!topic) {
          throw new Error('Topic is required');
        } else {
          if (!data.names.includes(topic)) {
            throw new Error('Topic does not exist');
          } else {
            let body = data.names.filter((name: string) => name !== topic);
            const request = await fetch(
              `https://api.github.com/repos/${username}/${repoName}/topics`,
              {
                method: 'PUT',
                headers: {
                  Authorization: `token ${accessToken}`,
                  Accept: 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({ names: body })
              }
            );
          }
        }
      }
    }
  } catch (err) {
    throw err;
  }
};

export default repoTopicsHandler;
