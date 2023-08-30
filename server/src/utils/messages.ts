const generateMessage = (username: string, text: string) => {
  return {
    username,
    text,
    createdAt: new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
  };
};

export {
  generateMessage
};