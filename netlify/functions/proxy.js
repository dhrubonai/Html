exports.handler = async (event) => {
  const url = event.queryStringParameters && event.queryStringParameters.url;
  if (!url) return { statusCode: 400, body: 'missing url' };

  let parsed;
  try {
    parsed = new URL(url);
  } catch (e) {
    return { statusCode: 400, body: 'invalid url' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { statusCode: 400, body: 'only http and https allowed' };
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
    });

    const html = await res.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: html,
    };
  } catch (err) {
    return { statusCode: 502, body: 'fetch failed' };
  }
};
