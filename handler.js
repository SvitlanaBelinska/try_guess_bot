const { start } = require('./index')

exports.getResponseHeaders = () => {
    return {
      "Access-Control-Allow-Origin": "*",
    };
  };
  
  /**
   * Вебхук для бота
   */
  module.exports.hello = async (event) => {
    try {
      let body =
        event.body[0] === "{"
          ? JSON.parse(event.body)
          : JSON.parse(Buffer.from(event.body, "base64"));
      await bot.handleUpdate(body);
      return { statusCode: 200, body: "" };
    } catch (err) {
      return {
        statusCode: err.statusCode ? err.statusCode : 500,
        headers: getResponseHeaders(),
        body: JSON.stringify({
          error: err.name ? err.name : "Exception",
          message: err.message ? err.message : "Unknown error",
        }),
      };
    }
  };
  
  /**
   * Устновка веб-хука.
   * Если вызвать этот метод, то хук вступит в силу
   */
  module.exports.setWebhook = async (event) => {
    try {
      const url = `https://${event.headers.Host}/${event.requestContext.stage}/webhook`;
      await bot.telegram.setWebhook(url);
      return {
        statusCode: 200,
        headers: getResponseHeaders(),
        body: JSON.stringify({ url }),
      };
    } catch (err) {
      return {
        statusCode: err.statusCode ? err.statusCode : 500,
        headers: getResponseHeaders(),
        body: JSON.stringify({
          error: err.name ? err.name : "Exception",
          message: err.message ? err.message : "Unknown error",
        }),
      };
    }
  };