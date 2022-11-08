import https from "https";

export function execute(message, args) {
  const sl = args.shift();
  const tl = args.shift();
  const query = encodeURI(args.join(" "));
  if (!sl || !tl || !query) return;

  const options = {
    host: "translate.googleapis.com",
    path: `/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${query}`,
  };

  const req = https.request(options, (res) => {
    let buffer = "";
    res.on("data", (fragment) => (buffer += fragment));
    res.on("end", () => {
      const data = JSON.parse(buffer);
      let text = "";
      for (const d of data[0]) text += d[0];
      message.channel.send(text);
    });
    res.on("err", console.error);
  });
  req.end();
}
