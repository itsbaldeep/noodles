module.exports = {
    name: 'translate',
    execute(message, args) {
        console.log(args);
        const [sl, tl, query] = args;
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
                const text = data[0][0][0];

                message.channel.send(text);
            });
            res.on('err', console.error);
        });
        req.end();
    }
}