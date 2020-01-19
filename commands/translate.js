module.exports = {
    name: 'translate',
    execute(message, args) {
        const sl = args.shift();
        const tl = args.shift();
        const query = encodeURI(args.join(' '));
        console.log(query);
        if (!sl || !tl || !query) return;

        const https = require('https');
        const options = {
            host: 'translate.googleapis.com',
            path: `/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${query}`
        };

        const req = https.request(options, res => {
            let buffer = '';
            res.on('data', res => buffer += res);
            res.on('end', () => {
                const data = JSON.parse(buffer);
                console.log(data);
                let text = '';
                for (const d of data[0]) text += d[0];
                // const text = data[0][0][0];
                message.channel.send(text);
            });
            res.on('err', console.error);
        });
        req.end();
    }
}
